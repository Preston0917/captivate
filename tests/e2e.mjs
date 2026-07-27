#!/usr/bin/env node
/* ============================================================
   tests/e2e.mjs — driven end-to-end suite for Captivate.

   Plain node + Playwright (no test runner). It serves the repo
   root, boots the app in headless Chromium at iPhone size, and
   actually PLAYS the game: completes a quest, runs a Night Mode
   shift, saves an API key, answers a quiz question, goes offline.

   It also asserts the Liquid Glass contract from
   docs/liquid-glass-ui-plan.md: chrome blur, inline border-color
   state signalling, floating tab-bar capsule, toast safe area,
   and the reduced-motion / reduced-transparency fallbacks.

   Run:   npm test
   Env:   SHOT_DIR=/somewhere   screenshots land there
          PORT=4173             static server port
          HEADED=1              watch it run
          CHROMIUM_PATH=/path   use a system Chromium instead of
                                Playwright's own download

   Exits non-zero if any step fails, if the console logs an error,
   or if any request fails outside the deliberate offline step.
   ============================================================ */

import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 4173);
const SHOT_DIR = process.env.SHOT_DIR || path.join(os.tmpdir(), "captivate-e2e-screens");
const BASE = `http://127.0.0.1:${PORT}`;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};

function serve() {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, BASE);
      let rel = decodeURIComponent(url.pathname);
      if (rel.endsWith("/")) rel += "index.html";
      const file = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[/\\])+/, ""));
      if (!file.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }
      const body = await fsp.readFile(file);
      res.writeHead(200, {
        "content-type": MIME[path.extname(file)] || "application/octet-stream",
        "cache-control": "no-store",
        // the SW needs a same-origin, non-cached shell to precache
        "service-worker-allowed": "/",
      });
      res.end(body);
    } catch {
      res.writeHead(404, { "content-type": "text/plain" }).end("not found");
    }
  });
  return new Promise(resolve => server.listen(PORT, "127.0.0.1", () => resolve(server)));
}

/* ---------- tiny assertion + step harness ---------- */
const results = [];
let currentStep = null;

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
function assertEq(actual, expected, msg) {
  if (actual !== expected) throw new Error(`${msg} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

async function step(name, fn) {
  currentStep = name;
  const t0 = Date.now();
  try {
    await fn();
    drainProblems();                        // console/network errors fail their own step
    results.push({ name, ok: true, ms: Date.now() - t0 });
    console.log(`  ✓ ${name} (${Date.now() - t0}ms)`);
  } catch (err) {
    results.push({ name, ok: false, ms: Date.now() - t0, err: err.message });
    console.log(`  ✗ ${name} — ${err.message}`);
  }
}

/* ---------- problem collection (asserted for the whole run) ---------- */
const problems = [];
let allowNetworkFailures = false;

function watch(page) {
  page.on("console", m => {
    if (m.type() === "error") problems.push(`console.error: ${m.text()}`);
  });
  page.on("pageerror", e => problems.push(`pageerror: ${e.message}`));
  page.on("requestfailed", r => {
    if (allowNetworkFailures) return;
    const err = r.failure()?.errorText || "";
    if (err === "net::ERR_ABORTED") return;             // navigations we cancel ourselves
    problems.push(`requestfailed: ${r.url()} (${err})`);
  });
  page.on("response", r => {
    if (allowNetworkFailures) return;
    if (r.status() >= 400) problems.push(`http ${r.status()}: ${r.url()}`);
  });
}

function drainProblems() {
  if (!problems.length) return;
  const found = problems.splice(0, problems.length);
  throw new Error(`${found.length} console/network problem(s): ${found.slice(0, 4).join(" | ")}`);
}

/* ---------- app helpers ---------- */
const shot = async (page, name, opts = {}) =>
  page.screenshot({ path: path.join(SHOT_DIR, `${name}.png`), fullPage: true, ...opts });

const hudXp = page => page.locator("#hud-xp").innerText();
const hudStreak = page => page.locator("#hud-streak").innerText();

async function openTab(page, pane) {
  await page.locator(`.tab[data-pane="${pane}"]`).click();
  await page.waitForFunction(
    p => document.getElementById(`pane-${p}`)?.classList.contains("active"),
    pane, { timeout: 5000 }
  );
  await page.waitForTimeout(180);                    // let the pane-in animation settle
}

async function waitModalClosed(page) {
  // #modal-layer.hidden is display:none, so wait on the class, not on visibility
  await page.waitForFunction(
    () => document.getElementById("modal-layer").classList.contains("hidden"),
    null, { timeout: 4000 }
  );
}

/* ---------- rendered-contrast probe ----------
   The UX review measured contrast on the REAL composited glass, not on CSS
   colour tokens: blank the glyphs, screenshot, sample every backdrop pixel
   under the text rect, and compute the WCAG ratio against the text colour.
   Anything that reasons about `background-color` alone is blind to
   backdrop-filter, so this is the only honest way to gate the chrome. */
async function contrast(page, sels) {
  const info = await page.evaluate(list => {
    const out = [];
    for (const s of list) {
      const el = document.querySelector(s);
      const r = el?.getBoundingClientRect();
      if (!el || !r || r.width < 1 || r.height < 1) { out.push({ sel: s, missing: true }); continue; }
      const cs = getComputedStyle(el);
      out.push({ sel: s, color: cs.color, size: parseFloat(cs.fontSize), weight: cs.fontWeight,
                 x: r.x, y: r.y, w: r.width, h: r.height });
    }
    const st = document.createElement("style");
    st.id = "__blank_glyphs";
    st.textContent = list.map(s => `${s},${s} *`).join(",") + "{color:transparent !important;text-shadow:none !important}";
    document.head.appendChild(st);
    return out;
  }, sels);
  await page.waitForTimeout(60);
  const png = (await page.screenshot()).toString("base64");
  await page.evaluate(() => document.getElementById("__blank_glyphs")?.remove());

  return page.evaluate(async ({ b64, info, dpr }) => {
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = "data:image/png;base64," + b64; });
    const cv = document.createElement("canvas");
    cv.width = img.width; cv.height = img.height;
    const g = cv.getContext("2d"); g.drawImage(img, 0, 0);
    const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const L = (r, gg, bb) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(bb);
    return info.map(t => {
      if (t.missing) return t;
      const x = Math.max(0, Math.round(t.x * dpr)), y = Math.max(0, Math.round(t.y * dpr));
      const w = Math.min(Math.round(t.w * dpr), cv.width - x), h = Math.min(Math.round(t.h * dpr), cv.height - y);
      if (w < 1 || h < 1) return { sel: t.sel, missing: true };
      const d = g.getImageData(x, y, w, h).data;
      const [cr, cg, cb] = t.color.match(/[\d.]+/g).map(Number);
      const Lt = L(cr, cg, cb);
      let worst = Infinity, worstPx = null;
      for (let i = 0; i < d.length; i += 4) {
        const Lb = L(d[i], d[i + 1], d[i + 2]);
        const v = (Math.max(Lt, Lb) + 0.05) / (Math.min(Lt, Lb) + 0.05);
        if (v < worst) { worst = v; worstPx = [d[i], d[i + 1], d[i + 2]]; }
      }
      return { sel: t.sel, color: t.color, size: t.size, weight: t.weight,
               worst: Math.round(worst * 100) / 100, worstPx };
    });
  }, { b64: png, info, dpr: 3 });
}

async function assertChromeContrast(page, where) {
  // no emoji / coloured borders inside these three rects, so the single worst
  // pixel is a fair gate — this is exactly what the review flagged.
  const sels = ['.tab[data-pane="trainer"] .tab-label', ".hud-xp-label", ".hud-sub"];
  for (const r of await contrast(page, sels)) {
    assert(!r.missing, `${r.sel} not measurable (${where})`);
    assert(r.worst >= 4.5,
      `${where}: ${r.sel} renders at ${r.worst}:1 on the glass (needs 4.5) — text ${r.color} over ${r.worstPx}`);
  }
}

async function closeAnyModal(page) {
  for (let i = 0; i < 4; i++) {
    const open = await page.locator("#modal-layer:not(.hidden)").count();
    if (!open) return;
    const primary = page.locator("#modal-card .btn.primary").last();
    if (await primary.count()) await primary.click();
    else await page.locator(".modal-backdrop").click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(120);
  }
  assert(!(await page.locator("#modal-layer:not(.hidden)").count()), "a modal refused to close");
}

/* ============================================================
   the run
   ============================================================ */
const server = await serve();
await fsp.mkdir(SHOT_DIR, { recursive: true });
console.log(`serving ${ROOT} on ${BASE}`);
console.log(`screenshots → ${SHOT_DIR}\n`);

const browser = await chromium.launch({
  headless: !process.env.HEADED,
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  serviceWorkers: "allow",
});
const page = await context.newPage();
watch(page);

/* --- 1. boot --- */
await step("1. boots clean (no console errors, no failed requests)", async () => {
  await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await page.waitForSelector("#pane-home.active .card", { timeout: 8000 });
  assert((await page.locator(".hud").count()) === 1, "HUD missing");
  assert((await page.locator(".tabbar .tab").count()) === 6, "expected 6 tabs");
  await shot(page, "01-home");
  await page.screenshot({ path: path.join(SHOT_DIR, "01-home-viewport.png") });
});

/* --- 2. all six tabs render --- */
await step("2. all 6 tabs navigate and render content", async () => {
  const tabs = ["home", "quests", "trainer", "skilltree", "analyzer", "settings"];
  const shots = { home: "02-home", quests: "02-quests", trainer: "02-trainer", skilltree: "02-skills", analyzer: "02-analyzer", settings: "02-settings" };
  for (const t of tabs) {
    await openTab(page, t);
    const pane = page.locator(`#pane-${t}`);
    const text = (await pane.innerText()).trim();
    assert(text.length > 40, `pane ${t} rendered only ${text.length} chars of text`);
    assert(await pane.locator(".card, .skill-row, .badge-grid, .analyzer-input").count() > 0,
      `pane ${t} rendered no surfaces`);
    assert(await page.locator(`.tab[data-pane="${t}"].active`).count() === 1, `tab ${t} not marked active`);
    await shot(page, shots[t]);
  }
});

/* --- 3. complete a daily quest end to end --- */
await step("3. completes a daily quest → XP toast + HUD XP + streak", async () => {
  await openTab(page, "quests");
  const xpBefore = await hudXp(page);
  const streakBefore = await hudStreak(page);
  assert(streakBefore.includes("0"), `expected a fresh 0 streak, got "${streakBefore}"`);

  // first daily quest under "Today's Quests" — "do" type if there is one, else tally it out
  const plan = await page.evaluate(() => {
    const pane = document.getElementById("pane-quests");
    const kids = [...pane.children];
    const start = kids.findIndex(k => k.classList.contains("section-label") && k.textContent.startsWith("Today's Quests"));
    const cards = kids.slice(start + 1).filter(k => k.classList.contains("quest-card"));
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const idx = [...pane.querySelectorAll(".quest-card")].indexOf(c);
      if ([...c.querySelectorAll("button")].some(b => b.textContent.includes("I did it"))) return { idx, type: "do" };
      if (c.querySelector(".tally")) {
        const goal = parseInt(c.querySelector(".tally-goal").textContent.replace(/\D/g, ""), 10);
        const count = parseInt(c.querySelector(".tally-count").textContent, 10);
        return { idx, type: "tally", clicks: Math.max(1, goal - count) };
      }
    }
    return null;
  });
  assert(plan, "no completable daily quest found");

  const card = page.locator("#pane-quests .quest-card").nth(plan.idx);
  if (plan.type === "do") {
    await card.locator("button", { hasText: "I did it" }).click();
  } else {
    for (let i = 0; i < plan.clicks; i++) {
      await card.locator(".tally-btn").nth(1).click();
      await page.waitForTimeout(60);
    }
  }

  const toast = page.locator(".toast").first();
  await toast.waitFor({ state: "attached", timeout: 3000 });
  const toastText = await toast.innerText();
  assert(/^\+\d+ XP$/.test(toastText.trim()), `expected an "+N XP" toast, got "${toastText}"`);
  await shot(page, "03-quest-complete-toast");

  await closeAnyModal(page);                          // badge / level-up flourish
  const xpAfter = await hudXp(page);
  const streakAfter = await hudStreak(page);
  assert(xpAfter !== xpBefore, `HUD XP did not change (still ${xpAfter})`);
  assert(streakAfter.includes("1"), `streak did not increment: "${streakBefore}" → "${streakAfter}"`);
});

/* --- 4. Night Mode session --- */
await step("4. Night Mode: start shift → add goal → +1 → end shift", async () => {
  await openTab(page, "home");
  await page.locator("#pane-home .card", { hasText: "Night Mode" }).locator("button").click();
  await page.waitForFunction(() => document.getElementById("pane-night").classList.contains("active"));
  await page.locator("#pane-night button", { hasText: "Start my shift" }).click();

  // the shift-start goal modal opens on its own
  await page.waitForSelector("#modal-layer:not(.hidden)", { timeout: 4000 });
  await page.locator('#modal-card input[type="text"]').fill("Talk to someone new");
  await page.locator("#modal-card button", { hasText: "Add goal" }).click();
  await waitModalClosed(page);

  assert(await page.locator("#pane-night .night-clock").count() === 1, "shift countdown did not render");
  assert(await page.locator("#pane-night .goal-row").count() === 1, "night goal did not render");
  await shot(page, "04-night-session-active");

  await page.locator("#pane-night .goal-plus").click();
  await page.waitForTimeout(250);
  assertEq(await page.locator("#pane-night .gdot.lit").count(), 1, "goal +1 did not light a dot");

  await page.locator("#pane-night .btn.danger", { hasText: "End shift" }).click();
  await page.waitForSelector("#modal-layer:not(.hidden)", { timeout: 4000 });
  const summary = await page.locator("#modal-card").innerText();
  assert(summary.includes("Shift complete"), `expected the shift summary, got: ${summary.slice(0, 80)}`);
  await closeAnyModal(page);
  assert(await page.locator("#pane-night button", { hasText: "Start my shift" }).count() === 1,
    "night pane did not return to setup after ending the shift");
});

/* --- 5. modal open/close + settings persistence --- */
await step("5. modal opens/closes; API key saves and survives a reload", async () => {
  await openTab(page, "quests");
  const howto = page.locator("#pane-quests button", { hasText: "How do I do this?" }).first();
  if (await howto.count()) {
    await howto.click();
    await page.waitForSelector("#modal-layer:not(.hidden)", { timeout: 4000 });
    await shot(page, "05-modal-open");
    await closeAnyModal(page);
    await waitModalClosed(page);
  } else {
    await page.locator("#pane-quests button", { hasText: "New custom quest" }).click();
    await page.waitForSelector("#modal-layer:not(.hidden)", { timeout: 4000 });
    await shot(page, "05-modal-open");
    await page.locator(".modal-backdrop").click({ position: { x: 5, y: 5 } });
    await waitModalClosed(page);
  }

  await openTab(page, "settings");
  const KEY = "sk-ant-e2e-test-key";
  await page.locator('#pane-settings input[type="password"]').fill(KEY);
  await page.locator("#pane-settings button.btn.primary").first().click();   // "Save"
  await page.locator(".toast").first().waitFor({ state: "attached", timeout: 3000 });

  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#pane-home.active .card", { timeout: 8000 });
  await openTab(page, "settings");
  await page.waitForFunction(
    () => document.querySelector('#pane-settings input[type="password"]')?.value.length > 0,
    null, { timeout: 5000 }
  );
  assertEq(await page.locator('#pane-settings input[type="password"]').inputValue(), KEY,
    "API key did not persist across a reload");
});

/* --- 6. Trainer quiz --- */
await step("6. Trainer: opens a quiz deck and answers a question", async () => {
  await openTab(page, "trainer");
  await page.locator("#pane-trainer button", { hasText: "Start quiz" }).first().click();
  await page.waitForSelector("#pane-trainer .quiz-q", { timeout: 5000 });
  assert(await page.locator("#pane-trainer .quiz-opt").count() >= 2, "quiz rendered without options");
  await shot(page, "06-trainer-quiz");
  await page.locator("#pane-trainer .quiz-opt").first().click();
  await page.waitForTimeout(250);
  const graded = await page.locator("#pane-trainer .quiz-opt.correct, #pane-trainer .quiz-opt.wrong").count();
  assert(graded > 0, "answering a question did not mark any option correct/wrong");
  assert(await page.locator("#pane-trainer .btn.primary").count() > 0, "no continue button after answering");
  await shot(page, "06-trainer-answered");
});

/* --- 7. Story mode --- */
await step("7. Story mode pane renders", async () => {
  await openTab(page, "home");
  await page.locator("#pane-home .card", { hasText: "Story Mode" }).locator("button").click();
  await page.waitForFunction(() => document.getElementById("pane-story").classList.contains("active"));
  const text = (await page.locator("#pane-story").innerText()).trim();
  assert(text.length > 60, `story pane rendered only ${text.length} chars`);
  assert(await page.locator("#pane-story .card").count() > 0, "story pane rendered no cards");
  await shot(page, "07-story");
});

/* --- 8. service worker / offline --- */
await step("8. service worker caches the shell; app still works offline", async () => {
  await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await page.waitForFunction(async () => {
    if (!("serviceWorker" in navigator)) return false;
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    return !!(reg && navigator.serviceWorker.controller);
  }, null, { timeout: 15000 });
  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    const name = keys.find(k => k.startsWith("captivate-"));
    if (!name) return { name: null, n: 0 };
    const c = await caches.open(name);
    return { name, n: (await c.keys()).length };
  });
  assert(cached.name, "no captivate cache was created");
  assert(cached.n >= 15, `only ${cached.n} shell entries precached`);

  allowNetworkFailures = true;
  try {
    await context.setOffline(true);
    await page.reload({ waitUntil: "load" });
    await page.waitForSelector("#pane-home.active .card", { timeout: 10000 });
    await openTab(page, "quests");
    assert((await page.locator("#pane-quests .quest-card").count()) > 0, "quests pane empty offline");
    await openTab(page, "skilltree");
    assert((await page.locator("#pane-skilltree .skill-row").count()) > 0, "skills pane empty offline");
    await shot(page, "08-offline-quests");
  } finally {
    await context.setOffline(false);
    allowNetworkFailures = false;
    problems.length = 0;                 // offline network noise is expected, not a failure
  }
});

/* --- 9. Liquid Glass spec assertions --- */
await step("9. glass spec: chrome blur, inline border-color, capsule, toast safe area", async () => {
  await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await page.waitForSelector("#pane-home.active .card", { timeout: 8000 });

  // 9a — chrome layers blur, content layers don't
  const filters = await page.evaluate(() => {
    const get = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = getComputedStyle(el);
      return (cs.backdropFilter || cs.webkitBackdropFilter || "none");
    };
    return { hud: get(".hud"), tabbar: get(".tabbar"), card: get("#pane-home .card") };
  });
  assert(/blur\(/.test(filters.hud || ""), `.hud has no backdrop-filter (got ${filters.hud})`);
  assert(/blur\(/.test(filters.tabbar || ""), `.tabbar has no backdrop-filter (got ${filters.tabbar})`);
  assertEq(filters.card, "none", "a content card is blurring — glass must stay on the chrome layer");

  // 9b — blur budget: at most 3 blurring elements composited at once
  const blurCount = await page.evaluate(() =>
    [...document.querySelectorAll("*")].filter(el => {
      if (!el.offsetParent && el !== document.body && getComputedStyle(el).position !== "fixed") return false;
      const cs = getComputedStyle(el);
      return /blur\(/.test(cs.backdropFilter || cs.webkitBackdropFilter || "");
    }).length);
  assert(blurCount <= 3, `${blurCount} blurring elements alive at once (budget is 3)`);

  // 9c — inline style="border-color:…" state signalling still paints
  const rims = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("#pane-home .card[style*='border-color']")) {
      const cs = getComputedStyle(el);
      out.push({
        inline: el.style.borderColor,
        computed: cs.borderTopColor,
        width: cs.borderTopWidth,
        style: cs.borderTopStyle,
      });
    }
    return out;
  });
  assert(rims.length >= 2, `expected JS-coloured state cards on Home, found ${rims.length}`);
  const gold = rims.find(r => r.computed === "rgb(245, 196, 81)");
  const comp = rims.find(r => r.computed === "rgb(92, 184, 255)");
  assert(gold, `no gold-rimmed card (Night Mode shortcut). Got: ${JSON.stringify(rims)}`);
  assert(comp, `no blue-rimmed card (Story shortcut). Got: ${JSON.stringify(rims)}`);
  for (const r of rims) {
    assert(r.width !== "0px" && r.style === "solid",
      `a state-coloured card lost its border shorthand (${r.width} ${r.style})`);
  }

  // 9d — tab bar is a floating capsule inside the viewport, content clears it
  const geo = await page.evaluate(() => {
    const t = document.querySelector(".tabbar").getBoundingClientRect();
    const cs = getComputedStyle(document.querySelector(".tabbar"));
    return {
      top: t.top, bottom: t.bottom, left: t.left, right: t.right,
      radius: parseFloat(cs.borderRadius), vh: innerHeight, vw: innerWidth,
    };
  });
  assert(geo.bottom <= geo.vh + 0.5, `tab bar bottom ${geo.bottom} is below the viewport (${geo.vh})`);
  assert(geo.left > 0 && geo.right < geo.vw, `tab bar is not inset from the edges (${geo.left}…${geo.right} of ${geo.vw})`);
  assert(geo.radius >= 20, `tab bar is not a capsule (radius ${geo.radius})`);
  assert(geo.vh - geo.bottom >= 4, "tab bar is flush against the bottom edge, not floating");

  const clearance = await page.evaluate(async () => {
    scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 300));
    const cards = document.querySelectorAll("#pane-home .card");
    const last = cards[cards.length - 1].getBoundingClientRect();
    const bar = document.querySelector(".tabbar").getBoundingClientRect();
    return { lastBottom: last.bottom, barTop: bar.top };
  });
  assert(clearance.lastBottom <= clearance.barTop,
    `last card (${clearance.lastBottom}) is hidden under the tab bar (${clearance.barTop})`);
  await page.evaluate(() => scrollTo(0, 0));

  // 9e — HUD clears the top inset, toast lands inside the visible viewport
  const hudBox = await page.evaluate(() => {
    const r = document.querySelector(".hud").getBoundingClientRect();
    return { top: r.top, bottom: r.bottom };
  });
  assertEq(hudBox.top, 0, "HUD is not pinned to the top");
  const toastBox = await page.evaluate(async () => {
    UI.toast("viewport check");
    await new Promise(r => setTimeout(r, 350));
    const t = document.querySelector(".toast").getBoundingClientRect();
    return { top: t.top, bottom: t.bottom, left: t.left, right: t.right, vh: innerHeight, vw: innerWidth };
  });
  assert(toastBox.top > 0 && toastBox.bottom < toastBox.vh,
    `toast is outside the viewport vertically (${toastBox.top}…${toastBox.bottom} of ${toastBox.vh})`);
  assert(toastBox.top >= hudBox.bottom - 1, "toast overlaps the HUD instead of clearing it");
  assert(toastBox.left >= 0 && toastBox.right <= toastBox.vw, "toast is clipped horizontally");
  await page.waitForTimeout(3200);                     // let it self-remove

  // 9f — concentric radii, per the spec's 20 / 12 / 8
  const radii = await page.evaluate(() => {
    const rs = getComputedStyle(document.documentElement);
    return {
      outer: rs.getPropertyValue("--radius").trim(),
      pad: rs.getPropertyValue("--card-pad").trim(),
      inner: rs.getPropertyValue("--radius-inner").trim(),
      btn: getComputedStyle(document.querySelector("#pane-home .btn")).borderRadius,
    };
  });
  assertEq(radii.outer, "20px", "--radius should be 20px");
  assertEq(radii.inner, "8px", "--radius-inner should be 8px (20 − 12)");
  assert(parseFloat(radii.btn) >= 18, `buttons are not capsules (radius ${radii.btn})`);
});

/* --- 10. accessibility fallbacks --- */
await step("10. reduced motion + reduced transparency still render, no errors", async () => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-transparency", value: "reduce" },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
  });
  await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await page.waitForSelector("#pane-home.active .card", { timeout: 8000 });

  const fallback = await page.evaluate(() => {
    const hud = getComputedStyle(document.querySelector(".hud"));
    const bar = getComputedStyle(document.querySelector(".tabbar"));
    const barBox = document.querySelector(".tabbar").getBoundingClientRect();
    return {
      hudFilter: hud.backdropFilter || hud.webkitBackdropFilter || "none",
      hudBg: hud.backgroundColor,
      barFilter: bar.backdropFilter || bar.webkitBackdropFilter || "none",
      barTop: barBox.top, barLeft: barBox.left, vh: innerHeight,
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      reducedTransparency: matchMedia("(prefers-reduced-transparency: reduce)").matches,
    };
  });
  assert(fallback.reducedMotion, "reduced-motion emulation did not take");
  assert(fallback.reducedTransparency, "reduced-transparency emulation did not take");
  assertEq(fallback.hudFilter, "none", "HUD still blurs under Reduce Transparency");
  assertEq(fallback.barFilter, "none", "tab bar still blurs under Reduce Transparency");
  assertEq(fallback.hudBg, "rgb(27, 23, 48)", "HUD did not fall back to the opaque tint");
  assert(fallback.barLeft > 0 && fallback.barTop < fallback.vh,
    "the fallback moved the tab bar — fallbacks must be colour-only");

  // still fully usable
  await openTab(page, "quests");
  assert(await page.locator("#pane-quests .quest-card").count() > 0, "quests pane empty under fallbacks");
  await shot(page, "10-reduced-transparency-quests");
  await openTab(page, "home");
  await shot(page, "10-reduced-transparency-home");

  await cdp.send("Emulation.setEmulatedMedia", { features: [] });
  await page.emulateMedia({ reducedMotion: null });
});

/* --- 11. desktop width --- */
await step("11. desktop (1280) layout still works", async () => {
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const dp = await desktop.newPage();
  watch(dp);
  await dp.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await dp.waitForSelector("#pane-home.active .card", { timeout: 8000 });
  const geo = await dp.evaluate(() => {
    const t = document.querySelector(".tabbar").getBoundingClientRect();
    return { left: t.left, right: t.right, width: t.width, bottom: t.bottom, vw: innerWidth, vh: innerHeight };
  });
  assert(geo.width <= 600, `desktop tab bar is ${geo.width}px wide, expected a centred capsule`);
  assert(Math.abs((geo.left + geo.right) / 2 - geo.vw / 2) < 2, "desktop tab bar is not centred");
  assert(geo.bottom < geo.vh, "desktop tab bar is not floating above the bottom edge");
  await dp.screenshot({ path: path.join(SHOT_DIR, "11-desktop-1280-home.png"), fullPage: true });
  await desktop.close();
});

/* --- 12. UX-review blocker fixes stay fixed --- */
await step("12. review fixes: toast over modal, blur budget, chrome contrast, quiz surfaces", async () => {
  await page.goto(`${BASE}/index.html`, { waitUntil: "load" });
  await page.waitForSelector("#pane-home.active .card", { timeout: 8000 });
  await page.waitForTimeout(300);

  /* 12a — a toast fired while a modal opens must still be visible.
     UI.xpToast() does exactly this: toast(), then levelUpModal(). */
  await page.evaluate(() => { UI.toast("+9 XP"); UI.levelUpModal(); });
  await page.waitForSelector("#modal-layer:not(.hidden)", { timeout: 4000 });
  await page.waitForSelector(".toast", { state: "attached", timeout: 3000 });
  await page.waitForTimeout(400);

  const layering = await page.evaluate(() => {
    const t = document.querySelector(".toast");
    const layer = document.getElementById("toast-layer");
    const cs = getComputedStyle(t);
    // #toast-layer is pointer-events:none, which makes elementFromPoint skip
    // it — flip it on just for the hit test, then put it back.
    const r = t.getBoundingClientRect();
    const oldL = layer.style.pointerEvents, oldT = t.style.pointerEvents;
    layer.style.pointerEvents = "auto"; t.style.pointerEvents = "auto";
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    layer.style.pointerEvents = oldL; t.style.pointerEvents = oldT;
    return {
      onTop: hit === t || t.contains(hit),
      hitClass: hit ? (hit.className || hit.id || hit.tagName) : null,
      backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter || "none",
      zToast: +getComputedStyle(document.getElementById("toast-layer")).zIndex,
      zModal: +getComputedStyle(document.getElementById("modal-layer")).zIndex,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      opacity: +cs.opacity,
    };
  });
  assert(layering.zToast > layering.zModal,
    `#toast-layer (z${layering.zToast}) sits under #modal-layer (z${layering.zModal}) — level-up toasts are erased`);
  assert(layering.onTop, `the toast is painted under "${layering.hitClass}" while a modal is open`);
  assert(layering.opacity > 0.5, `the toast is only ${layering.opacity} opaque`);
  assertEq(layering.backdropFilter, "none",
    "the toast still blurs — that is a 4th simultaneous blur layer and it needs no backdrop to read");

  // pixel proof: its gold rim must survive at full strength. If the modal
  // backdrop were compositing over the toast, the gold would be washed out.
  const rimSeen = await (async () => {
    const b = (await page.screenshot({
      clip: { x: layering.rect.x, y: layering.rect.y, width: layering.rect.w, height: layering.rect.h },
    })).toString("base64");
    return page.evaluate(async b64 => {
      const img = new Image();
      await new Promise(r => { img.onload = r; img.src = "data:image/png;base64," + b64; });
      const cv = document.createElement("canvas");
      cv.width = img.width; cv.height = img.height;
      const g = cv.getContext("2d"); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, cv.width, cv.height).data;
      let best = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 190 && d[i + 1] > 140 && d[i + 2] < 130) best++;
      }
      return best;
    }, b);
  })();
  assert(rimSeen > 20, `the toast's gold rim is not rendering at full strength (${rimSeen} px) — something is compositing over it`);

  await shot(page, "12-toast-over-modal", { fullPage: false });

  /* 12b — blur budget with the worst-case stack alive: HUD + tab bar + modal
     backdrop, toast up. Spec §5.3 caps it at 3. */
  const blurs = await page.evaluate(() =>
    [...document.querySelectorAll("*")].filter(el => {
      if (!el.offsetParent && el !== document.body && getComputedStyle(el).position !== "fixed") return false;
      const cs = getComputedStyle(el);
      return /blur\(/.test(cs.backdropFilter || cs.webkitBackdropFilter || "");
    }).map(el => el.className || el.id || el.tagName));
  assert(blurs.length <= 3,
    `${blurs.length} blurring layers with a modal + toast alive (budget is 3): ${blurs.join(", ")}`);
  assert(blurs.some(c => String(c).includes("modal-backdrop")),
    `the modal backdrop stopped blurring: ${blurs.join(", ")}`);

  await closeAnyModal(page);
  await page.waitForTimeout(3300);                    // let the toast self-remove

  /* 12c — chrome text contrast on the real rendered glass */
  await assertChromeContrast(page, "home top");
  await page.evaluate(() => scrollTo(0, 300));
  await page.waitForTimeout(350);
  await assertChromeContrast(page, "home mid-scroll");
  await page.evaluate(() => scrollTo(0, 0));
  await openTab(page, "quests");
  await page.evaluate(() => scrollTo(0, 340));
  await page.waitForTimeout(350);
  await assertChromeContrast(page, "quests mid-scroll");
  await page.evaluate(() => scrollTo(0, 0));

  /* 12d — trainer quiz reads as raised surfaces on the pane, not dark wells */
  await openTab(page, "trainer");
  await page.locator("#pane-trainer button", { hasText: "Start quiz" }).first().click();
  await page.waitForSelector("#pane-trainer .quiz-opt", { timeout: 5000 });
  const wellBg = "rgba(0, 0, 0, 0.22)";
  const raised = await page.evaluate(() => {
    const pick = el => {
      const cs = getComputedStyle(el);
      return {
        parent: el.parentElement.id,
        bg: cs.backgroundColor, bgImage: cs.backgroundImage,
        radius: cs.borderTopLeftRadius, borderW: cs.borderTopWidth,
        borderS: cs.borderTopStyle, shadow: cs.boxShadow,
      };
    };
    return {
      q: pick(document.querySelector("#pane-trainer .quiz-q")),
      opt: pick(document.querySelector("#pane-trainer .quiz-opt")),
    };
  });
  for (const [name, s] of Object.entries(raised)) {
    assertEq(s.parent, "pane-trainer", `${name} is no longer a direct child of the pane — retune this check`);
    assert(s.bg !== wellBg, `.quiz-${name} still paints the recessed-well fill (${s.bg}) directly on the aurora`);
    assert(/linear-gradient/.test(s.bgImage), `.quiz-${name} has no lit card gradient (${s.bgImage})`);
    assert(s.borderW === "1px" && s.borderS === "solid", `.quiz-${name} has no card border (${s.borderW} ${s.borderS})`);
    assert(/inset/.test(s.shadow) && /rgba\(0, 0, 0/.test(s.shadow),
      `.quiz-${name} has no rim + depth shadow (${s.shadow})`);
  }
  assertEq(raised.q.radius, "20px", ".quiz-q should use the 20px outer card radius");

  // graded states keep the raised surface too
  await page.locator("#pane-trainer .quiz-opt").first().click();
  await page.waitForTimeout(250);
  const gradedBg = await page.evaluate(() => {
    const el = document.querySelector("#pane-trainer .quiz-opt.correct, #pane-trainer .quiz-opt.wrong");
    const cs = getComputedStyle(el);
    return { cls: el.className, bgImage: cs.backgroundImage, border: cs.borderTopColor };
  });
  assert((gradedBg.bgImage.match(/linear-gradient/g) || []).length >= 2,
    `a graded quiz option lost its raised surface (${gradedBg.cls}: ${gradedBg.bgImage})`);
  assert(gradedBg.border !== "rgb(50, 42, 78)", "a graded quiz option lost its state border colour");
  await shot(page, "12-quiz-raised");
});

/* ---------- summary ---------- */
if (problems.length) {
  results.push({ name: "run-wide: zero console errors / failed requests", ok: false, ms: 0, err: problems.slice(0, 6).join(" | ") });
} else {
  results.push({ name: "run-wide: zero console errors / failed requests", ok: true, ms: 0 });
}

await browser.close();
server.close();

const pad = n => String(n).padStart(2, " ");
console.log("\n──────────────── Captivate e2e ────────────────");
let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : `\n        ↳ ${r.err}`}`);
}
console.log("───────────────────────────────────────────────");
console.log(`${pad(results.length - failed)}/${results.length} steps passed · screenshots in ${SHOT_DIR}`);
if (failed) {
  console.log(`${failed} FAILED`);
  process.exit(1);
}
process.exit(0);
