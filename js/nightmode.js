/* ============================================================
   nightmode.js — timed live-session mode for working a venue.
   Start a "shift"; every N minutes you get ONE small social
   action with the exact opener to use. Done = combo XP.
   Timestamps (not intervals) drive everything, so backgrounding
   the phone never loses state — glance at the phone, the prompt
   is waiting.
   ============================================================ */

const NightMode = (() => {

  /* ---------- prompt pool ----------
     tier 1 = talk to someone already near you (lowest activation energy)
     tier 2 = initiate fresh / small group moves
     tier 3 = bigger hosting swings
     tier 0 = "I'm frozen" micro-rescues (never scheduled, only via panic)
  */
  const PROMPTS = [
    // ---- tier 1: people already around you ----
    { id: "n-nearest-night", tier: 1, icon: "💬", text: "Say one line to whoever is closest to you at the table — no agenda, just open.",
      say: ["Okay honest review — how's tonight going so far?", "You picked a good night — it's about to get packed."] },
    { id: "n-drink-check", tier: 1, icon: "🥂", text: "Do a drink check-in with the girl next to you — and add ONE follow-up question after her answer.",
      say: ["You good on your drink? …What are you drinking anyway — is it actually good?"] },
    { id: "n-song-react", tier: 1, icon: "🎵", text: "React out loud to the song that's playing, aimed at someone specific.",
      say: ["Okay this song — keep or skip?", "This DJ is either cooking or crashing, no in-between."] },
    { id: "n-choice-compliment", tier: 1, icon: "✨", text: "Give one specific compliment about something someone CHOSE (outfit, nails, drink order) — never generic.",
      say: ["Those boots were a decision and it paid off.", "Espresso martini at midnight — respect, that's a power move."] },
    { id: "n-how-know", tier: 1, icon: "🤝", text: "Ask the person next to you how they know the group, then actually follow the thread they give you.",
      say: ["Wait, how do you two know each other?", "So who dragged who out tonight?"] },
    { id: "n-lean-front", tier: 1, icon: "🧭", text: "Next 5 minutes: point toes, torso and face at whoever's talking. Nothing else.",
      say: [] },
    { id: "n-name-use", tier: 1, icon: "📛", text: "Say someone's name out loud in the next 2 minutes. Don't know it? Go get it.",
      say: ["Wait — I don't think I actually caught your name. I'm Preston."] },
    { id: "n-triple-nod", tier: 1, icon: "🫡", text: "Slow-triple-nod at the next pause in her story. Watch her keep going.",
      say: [] },
    { id: "n-hot-take", tier: 1, icon: "🔥", text: "Drop a playful hot take to the group and let them argue with it.",
      say: ["Hot take: the second drink is always better than the first.", "Hot take: every friend group has a designated photographer, and it's never fair."] },

    // ---- tier 2: initiate fresh ----
    { id: "n-walkin-spark", tier: 2, icon: "🚪", text: "Next walk-in: skip 'how are you' and open with a sparker while you're walking her in.",
      say: ["Okay, best thing that happened to you today — go.", "What's the plan tonight — dance, talk, or cause problems?"] },
    { id: "n-bar-line", tier: 2, icon: "🍸", text: "On your next bar run, say one line to whoever is waiting next to you.",
      say: ["What are you ordering? I need a scouting report.", "This bar line is the real afterparty."] },
    { id: "n-quiet-one", tier: 2, icon: "🫶", text: "Make the quietest girl at your table the star for 2 minutes.",
      say: ["You've been observing all of us like a documentary — what's the verdict so far?"] },
    { id: "n-intro-two", tier: 2, icon: "🔗", text: "Introduce two people at your table who haven't talked yet — give each a one-line highlight.",
      say: ["You two need to meet — she just got back from Miami, and he claims he's never lost at pool."] },
    { id: "n-opinion-poll", tier: 2, icon: "🗳️", text: "Run a quick table poll — silly question, everyone votes, you emcee it.",
      say: ["Table vote: is a hotdog a sandwich? This decides who I trust.", "Okay everyone — window or aisle? Wrong answers exist."] },
    { id: "n-highlight-host", tier: 2, icon: "🌟", text: "Catch someone doing something well and say it to the group (the gold-star move).",
      say: ["Can we acknowledge she's been carrying the vibe at this end of the table all night?"] },
    { id: "n-new-face", tier: 2, icon: "👋", text: "Approach one person you haven't spoken to tonight — staff counts — and open with anything situational.",
      say: ["You look like you actually know what's going on tonight — what did I miss?"] },
    { id: "n-story-trade", tier: 2, icon: "📖", text: "When someone states a fact ('I'm from Dallas'), trade a 20-second story back instead of another question.",
      say: ["Dallas! Okay so the one time I was in Dallas…"] },
    { id: "n-eyebrow-hello", tier: 2, icon: "🤨", text: "Greet the next three people with an eyebrow flash + their name (or a warm 'hey!'). Watch what comes back.",
      say: [] },

    // ---- tier 3: bigger swings ----
    { id: "n-toast", tier: 3, icon: "🥃", text: "Raise a mini-toast for your table — 10 seconds, one specific callout, done.",
      say: ["Quick one — to Friday, to this table, and to whoever convinced the DJ to play that last song."] },
    { id: "n-table-story", tier: 3, icon: "🎤", text: "Tell the whole table one 30-second story — setup, snag, payoff. Pick your reliable one and land it.",
      say: [] },
    { id: "n-two-groups", tier: 3, icon: "🌉", text: "Bridge your table with the neighboring table or group — one shared joke or a cheers between them.",
      say: ["Settle a debate for us — is this song a banger or are we being scammed?"] },
    { id: "n-walk-lap", tier: 3, icon: "🚶", text: "Do a full host lap: one line to every single person at your table, no skips, under 5 minutes.",
      say: ["Checking on my people — you good? Need anything?"] },
    { id: "n-plan-next", tier: 3, icon: "🗺️", text: "Play concierge: ask two people what would make tonight a 10/10, then make one of them happen.",
      say: ["Real question — what would make tonight an actual 10 for you?"] },

    // ---- tier 0: panic rescues (via "I'm frozen") ----
    { id: "n-rescue-1", tier: 0, icon: "🛟", text: "Tiny version: turn to the nearest person and ask ONE four-word question.",
      say: ["Having a good night?"] },
    { id: "n-rescue-2", tier: 0, icon: "🛟", text: "Tiny version: make eye contact with someone at your table, smile, and raise your glass. That's it — no words needed.",
      say: [] },
    { id: "n-rescue-3", tier: 0, icon: "🛟", text: "Tiny version: one exhale, shoulders down, then say one sentence about the room to anyone.",
      say: ["It's filling up fast tonight."] },
  ];

  const TIER_XP = { 0: 8, 1: 15, 2: 25, 3: 40 };
  const LEVELS = {
    1: { name: "Nearby", tiers: [1] },
    2: { name: "Mixed", tiers: [1, 1, 2, 2] },
    3: { name: "Big swings", tiers: [1, 2, 2, 3] },
  };

  const SET_SIZE = 3;   // missions auto-chosen per set — never asked for, never browsed

  let uiTimer = null;
  let wakeLock = null;

  function ns() {
    const s = Store.state;
    if (!s.night) s.night = { active: false };
    const n = s.night;
    // Mid-shift saves written before the setlist existed still have to render.
    if (n.active) {
      if (!Array.isArray(n.setlist)) n.setlist = [];
      if (typeof n.setIdx !== "number") n.setIdx = 0;
      if (typeof n.setNo !== "number") n.setNo = 0;
      if (typeof n.shiftIndex !== "number") n.shiftIndex = 0;
      if (!Array.isArray(n.usedIds)) n.usedIds = [];
      if (!Array.isArray(n.goals)) n.goals = [];
      if (!n.cfg) n.cfg = { interval: nightCfg().interval, level: nightCfg().level };
    }
    return n;
  }

  // Remembered cadence — the start path has nothing to decide.
  function nightCfg() {
    const s = Store.state;
    if (!s.settings.night) s.settings.night = { interval: 12, level: 2, day: null, shifts: 0 };
    return s.settings.night;
  }

  /* ---------- the setlist: 3 missions chosen for you ----------
     Seeded off the day + which shift of the day it is + which set within
     that shift, so reopening the app never reshuffles tonight's picks. */
  function tierOf(id) {
    const p = PROMPTS.find(x => x.id === id);
    return p ? p.tier : 9;
  }

  function buildSetlist() {
    const n = ns();
    const rand = Store.seededRandom(`${Store.todayKey()}|night${n.shiftIndex}|set${n.setNo}`);
    const tiers = LEVELS[n.cfg.level] ? LEVELS[n.cfg.level].tiers : LEVELS[2].tiers;
    const picks = [];
    for (let i = 0; i < SET_SIZE; i++) {
      const tier = tiers[Math.floor(rand() * tiers.length)];
      let pool = PROMPTS.filter(p => p.tier === tier && !n.usedIds.includes(p.id) && !picks.includes(p.id));
      if (!pool.length) pool = PROMPTS.filter(p => p.tier > 0 && !n.usedIds.includes(p.id) && !picks.includes(p.id));
      if (!pool.length) { n.usedIds = []; pool = PROMPTS.filter(p => p.tier > 0 && !picks.includes(p.id)); }
      if (!pool.length) break;
      picks.push(pool[Math.floor(rand() * pool.length)].id);
    }
    picks.sort((a, b) => tierOf(a) - tierOf(b));   // easiest first: lowest activation energy leads
    n.setlist = picks;
    n.setIdx = 0;
    Store.save();
  }

  function queueNextSet() {
    const n = ns();
    n.setNo += 1;
    buildSetlist();
    UI.toast(`${n.setlist.length} more queued`);
  }

  /* ---------- session lifecycle ---------- */
  function start(intervalMin, level) {
    const s = Store.state;
    const cfg = nightCfg();
    if (intervalMin) cfg.interval = intervalMin;
    if (level) cfg.level = level;
    const today = Store.todayKey();
    if (cfg.day !== today) { cfg.day = today; cfg.shifts = 0; }
    const shiftIndex = cfg.shifts;
    cfg.shifts += 1;

    s.night = {
      active: true,
      cfg: { interval: cfg.interval, level: cfg.level },
      shiftIndex,
      startedAt: Date.now(),
      nextAt: Date.now(),               // first mission is already here
      current: null,
      done: 0, passed: 0, combo: 0, bestCombo: 0, xp: 0,
      usedIds: [],
      setlist: [], setIdx: 0, setNo: 0,
      goals: [],
    };
    buildSetlist();
    autoGoal();          // one shot, called for you — no modal
    drawPrompt();        // mission on screen immediately, no settle-in
    Store.save();
    requestWake();
    Native.rescheduleNotifications();   // prompt cadence + the auto goal's pings
    render();
  }

  // Home's one-tap entry: start the shift AND land on it.
  function startShift() {
    if (!ns().active) start();
    App.show("night");
  }

  function drawPrompt() {
    const n = ns();
    if (n.setIdx >= n.setlist.length) queueNextSet();
    const id = n.setlist[n.setIdx];
    const p = PROMPTS.find(x => x.id === id) || PROMPTS.find(x => x.tier > 0);
    n.current = p.id;
    if (!n.usedIds.includes(p.id)) n.usedIds.push(p.id);
    Store.save();
    buzz();
  }

  // Wrong mission? One tap replaces it. No list, no modal.
  function swap() {
    const n = ns();
    const cur = PROMPTS.find(x => x.id === n.current);
    const baseTier = (cur && cur.tier > 0) ? cur.tier : tierOf(n.setlist[n.setIdx]);
    const off = id => id === (cur && cur.id) || n.setlist.includes(id) || n.usedIds.includes(id);
    let pool = PROMPTS.filter(p => p.tier === baseTier && !off(p.id));
    if (!pool.length) pool = PROMPTS.filter(p => p.tier > 0 && !off(p.id));
    if (!pool.length) pool = PROMPTS.filter(p => p.tier > 0 && p.id !== (cur && cur.id));
    if (!pool.length) return;
    const p = pool[Math.floor(Math.random() * pool.length)];
    Native.haptic("tap");
    n.current = p.id;
    n.setlist[n.setIdx] = p.id;
    if (!n.usedIds.includes(p.id)) n.usedIds.push(p.id);
    Store.save();
    render();
  }

  function tick() {
    const n = ns();
    if (!n.active) return;
    if (!n.current && Date.now() >= n.nextAt) drawPrompt();
    // Expire overdue goals (earned tick-XP is kept; just closes the window)
    for (const g of n.goals || []) {
      if (!g.completedAt && !g.expired && Date.now() > g.deadlineAt) {
        g.expired = true;
        Store.save();
      }
    }
  }

  /* ---------- night goals (call your shots) ---------- */
  const GOAL_PRESETS = [
    { text: "Talk to new guys", count: 3, mode: "rel", mins: 30 },
    { text: "Introduce myself to girls I find attractive", count: 5, mode: "abs", time: "01:00" },
    { text: "Learn and use names", count: 3, mode: "rel", mins: 60 },
    { text: "Start conversations first (not approached)", count: 3, mode: "rel", mins: 60 },
    { text: "Give compliments on something they chose", count: 3, mode: "abs", time: "00:00" },
  ];
  const GOAL_TICK_XP = 10;
  const GOAL_BONUS_XP = 50;

  function fmtClock(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function addGoal(text, count, deadlineAt, quiet) {
    const n = ns();
    n.goals.push({
      id: "g" + Date.now() + Math.floor(Math.random() * 1000),
      text, target: count, done: 0,
      deadlineAt, completedAt: null, expired: false,
    });
    Store.save();
    if (quiet) return;                  // start() reschedules + renders once, at the end
    Native.rescheduleNotifications();   // goal warning + deadline pings
    render();
  }

  // Exactly one goal, called for you, seeded so it's the same all night.
  function autoGoal() {
    const rand = Store.seededRandom(Store.todayKey() + "|goal");
    const p = GOAL_PRESETS[Math.floor(rand() * GOAL_PRESETS.length)];
    let deadlineAt;
    if (p.mode === "abs") {
      const [h, m] = p.time.split(":").map(Number);
      const d = new Date(); d.setHours(h, m, 0, 0);
      if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
      deadlineAt = d.getTime();
    } else {
      deadlineAt = Date.now() + p.mins * 60 * 1000;
    }
    addGoal(p.text, p.count, deadlineAt, true);
  }

  function tickGoal(g) {
    const n = ns();
    if (g.expired || g.completedAt) return;
    Native.haptic("tap");
    g.done += 1;
    n.xp += GOAL_TICK_XP;
    let xp = GOAL_TICK_XP;
    let finished = false;
    if (g.done >= g.target && Date.now() <= g.deadlineAt) {
      g.completedAt = Date.now();
      n.xp += GOAL_BONUS_XP;
      xp += GOAL_BONUS_XP;
      finished = true;
    }
    Store.save();
    Store.logRep();
    const leveled = Store.addXp(xp, "night");
    if (finished) {
      if (Store.awardBadge("called-shot")) {
        const b = QuestData.badges.find(x => x.id === "called-shot");
        if (b) UI.badgeModal(b);
      } else {
        UI.modal(UI.el("div", { class: "levelup" }, [
          UI.el("div", { class: "lv-big", text: "🎯" }),
          UI.el("div", { class: "lv-title", text: "Called it." }),
          UI.el("div", { class: "lv-sub", text: `"${g.text}" — ${g.target}/${g.target} with time to spare. +${GOAL_BONUS_XP} bonus XP.` }),
          UI.el("button", { class: "btn primary block", style: "margin-top:16px", text: "Keep rolling", onclick: UI.closeModal }),
        ]));
      }
    }
    UI.xpToast(xp, leveled);
    if (finished) Native.rescheduleNotifications();   // drop this goal's pings
    render();
  }

  function goalModal() {
    const n = ns();
    if (!n.active) return;
    let mode = "rel", mins = 30;

    const textInput = UI.el("input", { type: "text", placeholder: "e.g. Talk to new guys" });
    const countSel = UI.el("select", {}, [1,2,3,4,5,6,7,8,9,10].map(v =>
      UI.el("option", { value: String(v), text: String(v), ...(v === 3 ? { selected: "" } : {}) })));
    const timeInput = UI.el("input", { type: "time", value: "01:00", style: "display:none" });

    const minsRow = UI.el("div", { class: "seg-row" },
      [15, 30, 60, 90].map(v => UI.el("button", {
        class: `seg ${v === 30 ? "on" : ""}`, text: `${v}m`,
        onclick: (e) => { mins = v; minsRow.querySelectorAll(".seg").forEach(b => b.classList.remove("on")); e.target.classList.add("on"); },
      })));
    const modeRow = UI.el("div", { class: "seg-row", style: "margin-bottom:8px" }, [
      UI.el("button", { class: "seg on", text: "In the next…", onclick: (e) => { mode = "rel"; setMode(e.target); } }),
      UI.el("button", { class: "seg", text: "By a time", onclick: (e) => { mode = "abs"; setMode(e.target); } }),
    ]);
    function setMode(btn) {
      modeRow.querySelectorAll(".seg").forEach(b => b.classList.remove("on"));
      btn.classList.add("on");
      minsRow.style.display = mode === "rel" ? "" : "none";
      timeInput.style.display = mode === "abs" ? "" : "none";
    }

    const presetWrap = UI.el("div", { style: "display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px" },
      GOAL_PRESETS.map(p => UI.el("button", {
        class: "chip", style: "cursor:pointer",
        text: `${p.text} ×${p.count}`,
        onclick: () => {
          textInput.value = p.text;
          countSel.value = String(p.count);
          if (p.mode === "abs") { mode = "abs"; timeInput.value = p.time; setMode(modeRow.querySelectorAll(".seg")[1]); }
          else { mode = "rel"; mins = p.mins; setMode(modeRow.querySelectorAll(".seg")[0]);
                 minsRow.querySelectorAll(".seg").forEach(b => b.classList.toggle("on", b.textContent === p.mins + "m")); }
        },
      })));

    const wrap = UI.el("div", {}, [
      UI.el("h3", { text: "🎯 New night goal" }),
      UI.el("p", { class: "muted", style: "margin:6px 0 12px; line-height:1.5; font-size:.85rem",
        text: "+10 each. +50 if you hit the number in time." }),
      presetWrap,
      UI.el("div", { class: "field" }, [UI.el("label", { text: "What counts as one?" }), textInput]),
      UI.el("div", { class: "field" }, [UI.el("label", { text: "How many" }), countSel]),
      UI.el("div", { class: "field" }, [UI.el("label", { text: "Deadline" }), modeRow, minsRow, timeInput]),
      UI.el("button", {
        class: "btn primary block", text: "Add goal",
        onclick: () => {
          const text = textInput.value.trim();
          if (!text) { UI.toast("Describe the goal first"); return; }
          let deadlineAt;
          if (mode === "rel") deadlineAt = Date.now() + mins * 60 * 1000;
          else {
            const [h, m] = timeInput.value.split(":").map(Number);
            const d = new Date(); d.setHours(h, m, 0, 0);
            if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
            deadlineAt = d.getTime();
          }
          addGoal(text, parseInt(countSel.value, 10), deadlineAt);
          UI.closeModal();
        },
      }),
      UI.el("button", { class: "btn ghost block", style: "margin-top:8px", text: "Cancel", onclick: UI.closeModal }),
    ]);
    UI.modal(wrap);
  }

  function goalsCard(n) {
    const wrap = UI.el("div", { class: "card" }, [
      UI.el("div", { style: "display:flex; justify-content:space-between; align-items:center" }, [
        UI.el("h3", { text: "🎯 Tonight's goals", style: "margin:0" }),
        UI.el("button", { class: "btn small ghost", text: "＋ Add", onclick: () => goalModal() }),
      ]),
    ]);
    for (const g of n.goals) {
      const status = g.completedAt ? "✅" : g.expired ? "⌛" : "";
      const row = UI.el("div", { class: `goal-row ${g.completedAt ? "hit" : ""} ${g.expired ? "exp" : ""}` }, [
        UI.el("div", { class: "goal-info" }, [
          UI.el("div", { class: "goal-text", text: `${status} ${g.text}` }),
          UI.el("div", { class: "goal-meta", text: g.completedAt
            ? `hit it at ${fmtClock(g.completedAt)} · +${GOAL_BONUS_XP} bonus`
            : g.expired
              ? `time's up — ${g.done}/${g.target}, XP for each one kept`
              : `${g.done}/${g.target} · by ${fmtClock(g.deadlineAt)}` }),
          UI.el("div", { class: "goal-dots" },
            Array.from({ length: g.target }, (_, i) => UI.el("span", { class: `gdot ${i < g.done ? "lit" : ""}` }))),
        ]),
        (!g.completedAt && !g.expired) ? UI.el("button", { class: "tally-btn goal-plus", text: "+1", onclick: () => tickGoal(g) }) : null,
      ]);
      wrap.appendChild(row);
    }
    return wrap;
  }

  function resolve(didIt) {
    const n = ns();
    const p = PROMPTS.find(x => x.id === n.current);
    if (!p) { n.current = null; Store.save(); return; }
    Native.haptic("tap");

    // Either way this slot is spent — move down the setlist.
    n.setIdx += 1;
    if (n.setIdx >= n.setlist.length) queueNextSet();     // never asks, just refills

    if (didIt) {
      n.done += 1;
      n.combo += 1;
      n.bestCombo = Math.max(n.bestCombo, n.combo);
      const comboBonus = Math.min(25, (n.combo - 1) * 5);
      const xp = TIER_XP[p.tier] + comboBonus;
      n.xp += xp;
      n.current = null;
      n.nextAt = Date.now() + n.cfg.interval * 60 * 1000;
      Store.save();
      Store.logRep();
      const leveled = Store.addXp(xp, "night");
      UI.xpToast(xp, leveled);
      if (n.combo >= 5 && Store.awardBadge("night-combo5")) {
        const b = QuestData.badges.find(x => x.id === "night-combo5");
        if (b) UI.badgeModal(b);
      }
    } else {
      // Passing is allowed and cheap — the next chance comes sooner.
      n.passed += 1;
      n.combo = 0;
      n.current = null;
      n.nextAt = Date.now() + Math.max(3, Math.round(n.cfg.interval / 2)) * 60 * 1000;
      Store.save();
      UI.toast("All good — smaller one coming soon");
    }
    Native.rescheduleNotifications();   // the cadence just shifted
    render();
  }

  function panic() {
    const n = ns();
    const rescues = PROMPTS.filter(p => p.tier === 0);
    n.current = rescues[Math.floor(Math.random() * rescues.length)].id;
    Store.save();
    render();
  }

  function endSession() {
    const n = ns();
    const bonus = n.done >= 3 ? 30 : 0;
    if (bonus) {
      n.xp += bonus;
      Store.addXp(bonus, "night");
    }
    const goalsHit = (n.goals || []).filter(g => g.completedAt).length;
    const goalTicks = (n.goals || []).reduce((a, g) => a + g.done, 0);
    const summary = { done: n.done, passed: n.passed, bestCombo: n.bestCombo, xp: n.xp, goalsHit, goalsTotal: (n.goals || []).length, goalTicks, mins: Math.round((Date.now() - n.startedAt) / 60000) };
    if (n.done >= 1 && Store.awardBadge("night-first")) { /* modal after summary */ }
    if (n.done >= 10) Store.awardBadge("night-ten");

    Store.state.night = { active: false };
    Store.save();
    releaseWake();
    Native.rescheduleNotifications();   // cancels every pending shift ping
    UI.refreshHud();

    const wrap = UI.el("div", { class: "levelup" }, [
      UI.el("div", { class: "lv-big", text: summary.done >= 5 ? "🏆" : summary.done >= 1 ? "🌙" : "🤝" }),
      UI.el("div", { class: "lv-title", text: "Shift complete" }),
      UI.el("div", { class: "lv-sub", text: `${summary.done} actions · best combo ×${summary.bestCombo} · ${summary.passed} passes · ${summary.mins} min` }),
      summary.goalsTotal ? UI.el("div", { class: "lv-sub", text: `🎯 goals: ${summary.goalsHit}/${summary.goalsTotal} hit · ${summary.goalTicks} total check-ins` }) : null,
      UI.el("div", { class: "lv-sub", style: "color:var(--gold); font-weight:800", text: `+${summary.xp} XP tonight${bonus ? " (incl. +30 shift bonus)" : ""}` }),
      summary.done === 0 ? UI.el("div", { class: "lv-sub", text: "Showing up still counts. Next shift, aim for one action." }) : null,
      UI.el("button", { class: "btn primary block", style: "margin-top:16px", text: "Done", onclick: UI.closeModal }),
    ]);
    UI.modal(wrap);
    render();
  }

  /* ---------- device niceties ---------- */
  function buzz() {
    try { navigator.vibrate && navigator.vibrate([180, 90, 180]); } catch (_) {}
  }
  async function requestWake() {
    try { wakeLock = await navigator.wakeLock?.request("screen"); } catch (_) {}
  }
  function releaseWake() {
    try { wakeLock?.release(); wakeLock = null; } catch (_) {}
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (ns().active) { requestWake(); tick(); if (isPaneActive()) render(); }
    }
  });

  function isPaneActive() {
    const pane = document.getElementById("pane-night");
    return pane && pane.classList.contains("active");
  }

  function fmt(ms) {
    const t = Math.max(0, Math.ceil(ms / 1000));
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  }

  /* ---------- rendering ---------- */
  function render() {
    const pane = document.getElementById("pane-night");
    if (!pane) return;
    const n = ns();
    pane.innerHTML = "";
    clearInterval(uiTimer);

    if (!n.active) return renderSetup(pane);

    tick();
    if (n.current) renderPrompt(pane, n);
    else renderCountdown(pane, n);
  }

  // One card, one button. Cadence lives behind a ghost link, collapsed.
  function renderSetup(pane) {
    const cfg = nightCfg();
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "🌙 Night Mode" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Three missions, one at a time, with the line to open with." }));

    const intervalRow = UI.el("div", { class: "seg-row" },
      [7, 12, 20].map(v => UI.el("button", {
        class: `seg ${v === cfg.interval ? "on" : ""}`, text: `${v} min`,
        onclick: (e) => { cfg.interval = v; Store.save(); intervalRow.querySelectorAll(".seg").forEach(b => b.classList.remove("on")); e.target.classList.add("on"); },
      }))
    );
    const levelRow = UI.el("div", { class: "seg-row" },
      [1, 2, 3].map(v => UI.el("button", {
        class: `seg ${v === cfg.level ? "on" : ""}`, text: LEVELS[v].name,
        onclick: (e) => { cfg.level = v; Store.save(); levelRow.querySelectorAll(".seg").forEach(b => b.classList.remove("on")); e.target.classList.add("on"); },
      }))
    );
    const tweaks = UI.el("div", { class: "night-tweaks hidden" }, [intervalRow, levelRow]);
    const tweakBtn = UI.el("button", {
      class: "btn ghost small block", style: "margin-top:8px", text: "⚙ Cadence",
      onclick: () => tweaks.classList.toggle("hidden"),
    });

    pane.appendChild(UI.el("div", { class: "card" }, [
      UI.el("button", { class: "btn primary block", text: "▶ Start my shift", onclick: () => start() }),
      tweakBtn,
      tweaks,
    ]));
  }

  function renderCountdown(pane, n) {
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "🌙 On shift" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: liveLine(n) }));

    const clock = UI.el("div", { class: "night-clock", text: fmt(n.nextAt - Date.now()) });
    const bar = UI.el("div", { class: "meter", style: "margin-top:14px" }, [
      UI.el("div", { class: "meter-fill gold", style: "width:0%" }),
    ]);
    pane.appendChild(UI.el("div", { class: "card night-wait" }, [
      UI.el("div", { class: "muted", text: "Next mission in" }),
      clock, bar,
      setDots(n),
      UI.el("div", { class: "muted", style: "margin-top:12px; font-size:.8rem", text: "It'll buzz." }),
      UI.el("button", { class: "btn small", style: "margin-top:8px", text: "⚡ Now", onclick: () => { ns().nextAt = Date.now(); Store.save(); render(); } }),
    ]));

    pane.appendChild(goalsCard(n));
    pane.appendChild(UI.el("button", { class: "btn danger block", text: "End shift", onclick: endSession }));

    const total = n.cfg.interval * 60 * 1000;
    uiTimer = setInterval(() => {
      if (!isPaneActive() || !ns().active) { clearInterval(uiTimer); return; }
      const left = n.nextAt - Date.now();
      clock.textContent = fmt(left);
      bar.firstChild.style.width = Math.min(100, 100 - (left / total) * 100) + "%";
      if (left <= 0) { clearInterval(uiTimer); render(); }
    }, 500);
  }

  // The mission screen shows the mission. Nothing else competes with it.
  function renderPrompt(pane, n) {
    const p = PROMPTS.find(x => x.id === n.current);
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "🎯 Your mission" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: p.tier === 0 ? "Five seconds, that's all." : `+${TIER_XP[p.tier]} XP · ${liveLine(n)}` }));
    pane.appendChild(setDots(n));

    const card = UI.el("div", { class: "card night-prompt" }, [
      UI.el("div", { class: "np-icon", text: p.icon }),
      UI.el("div", { class: "np-text", text: p.text }),
    ]);
    if (p.say && p.say.length) {
      card.appendChild(UI.el("div", { class: "section-label", style: "margin-top:12px", text: "Open with" }));
      for (const line of p.say) card.appendChild(UI.el("div", { class: "say-chip", text: "“" + line + "”" }));
    }
    pane.appendChild(card);

    pane.appendChild(UI.el("div", { style: "display:flex; gap:8px" }, [
      UI.el("button", { class: "btn primary", style: "flex:2", text: "✔ Did it", onclick: () => resolve(true) }),
      UI.el("button", { class: "btn", style: "flex:1", text: "Pass", onclick: () => resolve(false) }),
    ]));
    pane.appendChild(UI.el("div", { style: "display:flex; gap:8px; margin-top:8px" }, [
      UI.el("button", { class: "btn ghost", style: "flex:1", text: "⇄ Swap", onclick: swap }),
      p.tier > 0
        ? UI.el("button", { class: "btn ghost", style: "flex:1", text: "🛟 Smaller", onclick: panic })
        : UI.el("button", { class: "btn danger", style: "flex:1", text: "End shift", onclick: endSession }),
    ]));
  }

  // Position in tonight's set, in 3 glyphs and 0 words.
  function setDots(n) {
    const wrap = UI.el("div", { class: "goal-dots set-dots" });
    for (let i = 0; i < n.setlist.length; i++) {
      const state = i < n.setIdx ? "lit" : (i === n.setIdx ? "now" : "");
      wrap.appendChild(UI.el("span", { class: `gdot ${state}` }));
    }
    return wrap;
  }

  // The only live number worth carrying: what you've banked so far.
  function liveLine(n) {
    return `${n.done} done${n.combo > 1 ? ` · ×${n.combo}` : ""}`;
  }

  return { render, startShift, start, get active() { return ns().active; } };
})();
