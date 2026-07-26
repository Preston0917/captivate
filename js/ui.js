/* ============================================================
   ui.js — shared UI helpers: HUD, toasts, modals, meters
   ============================================================ */

const UI = (() => {
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of [].concat(children)) {
      if (c == null) continue;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  function esc(str) {
    const d = document.createElement("div");
    d.textContent = String(str ?? "");
    return d.innerHTML;
  }

  function refreshHud() {
    const s = Store.state;
    document.getElementById("hud-level").textContent = s.level;
    document.getElementById("hud-level-title").textContent = Store.levelTitle(s.level);
    document.getElementById("hud-xp").textContent = `${s.xp} / ${Store.xpForLevel(s.level)}`;
    document.getElementById("hud-xpbar").style.width =
      Math.min(100, (s.xp / Store.xpForLevel(s.level)) * 100) + "%";
    const streakEl = document.getElementById("hud-streak");
    streakEl.textContent = `🔥 ${s.streak}` + (s.freezes > 0 ? ` 🧊${s.freezes}` : "");
    streakEl.title = `Rep streak: days with at least one real-world rep. Best ever: ${s.bestStreak}. Freezes cover missed days automatically.`;
    streakEl.classList.toggle("hot", s.streak >= 3);
  }

  function toast(msg) {
    const layer = document.getElementById("toast-layer");
    const t = el("div", { class: "toast", text: msg });
    layer.appendChild(t);
    setTimeout(() => t.remove(), 3100);
  }

  function xpToast(amount, leveled) {
    toast(`+${amount} XP`);
    Native.haptic("success");
    refreshHud();
    if (leveled) levelUpModal();
  }

  function modal(contentNode, opts = {}) {
    const layer = document.getElementById("modal-layer");
    const card = document.getElementById("modal-card");
    card.innerHTML = "";
    card.appendChild(contentNode);
    layer.classList.remove("hidden");
    const close = () => layer.classList.add("hidden");
    layer.querySelector(".modal-backdrop").onclick = opts.sticky ? null : close;
    return close;
  }

  function closeModal() {
    document.getElementById("modal-layer").classList.add("hidden");
  }

  function levelUpModal() {
    const s = Store.state;
    Native.haptic("success");
    const wrap = el("div", { class: "levelup" }, [
      el("div", { class: "lv-big", text: "🎉" }),
      el("div", { class: "lv-title", text: `Level ${s.level} — ${Store.levelTitle(s.level)}` }),
      el("div", { class: "lv-sub", text: "Your presence grows. New quests and decks may be unlocked." }),
      el("button", { class: "btn primary block", text: "Keep going", style: "margin-top:16px", onclick: closeModal }),
    ]);
    modal(wrap);
  }

  function badgeModal(badge) {
    Native.haptic("success");
    const wrap = el("div", { class: "levelup" }, [
      el("div", { class: "lv-big", text: badge.icon }),
      el("div", { class: "lv-title", text: `Badge earned: ${badge.name}` }),
      el("div", { class: "lv-sub", text: badge.desc }),
      el("button", { class: "btn primary block", text: "Nice", style: "margin-top:16px", onclick: closeModal }),
    ]);
    modal(wrap);
  }

  function meter(label, value, max, colorClass) {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return el("div", { class: "meter-row" }, [
      el("div", { class: "meter-label" }, [
        el("span", { text: label }),
        el("span", { class: "val", text: `${value}/${max}` }),
      ]),
      el("div", { class: "meter" }, [
        el("div", { class: `meter-fill ${colorClass}`, style: `width:${pct}%` }),
      ]),
    ]);
  }

  return { el, esc, refreshHud, toast, xpToast, modal, closeModal, levelUpModal, badgeModal, meter };
})();
