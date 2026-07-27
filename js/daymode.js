/* ============================================================
   daymode.js — the small amount of behaviour the board can't own.

   Day Mode is not a mode: it is the Quest Board, time-aware. There
   is no session, no wake lock, no end-of-day summary. This file
   holds only the three things the board itself can't do:

     swap(i)    — replace a slate item in place, same tier
     rescue(i)  — drop the slate item to a tier-0 micro-rep
     burst      — the opt-in 30-minute cadence, and only then

   Everything completion-shaped delegates to Quests.completeQuest(),
   so a day mission logs a rep, pays skill XP, counts in questLog and
   evolves Neons through the paths that already exist.
   ============================================================ */

const DayMode = (() => {

  const BURST_STEPS = 3;      // cadence pings across one burst window

  // Which slate item owns the focus card. Not persisted: it is a view
  // preference for this render, and it resets to "first unfinished".
  let focusOverride = null;

  // The burst strip's live countdown. Mirrors nightmode.js's uiTimer: one
  // handle, cleared on every render and re-armed only while the pane is on
  // screen and a burst is actually live.
  let uiTimer = null;

  function cfg() {
    const s = Store.state;
    if (!s.settings.day) s.settings.day = { burstMins: 30, lastBurstDay: null, bursts: 0 };
    return s.settings.day;
  }

  function burst() {
    const s = Store.state;
    if (!s.dayBurst) s.dayBurst = { active: false };
    return s.dayBurst;
  }

  function active() {
    const b = burst();
    return !!(b.active && b.endsAt > Date.now());
  }

  /* ---------- focus ---------- */
  function focusIndex() {
    const s = Store.state;
    const ids = s.dailyQuests.ids || [];
    if (focusOverride != null && ids[focusOverride] && !s.dailyQuests.done.includes(ids[focusOverride])) {
      return focusOverride;
    }
    for (let i = 0; i < ids.length; i++) {
      if (!s.dailyQuests.done.includes(ids[i])) return i;
    }
    return -1;
  }

  function focusOn(i) {
    focusOverride = i;
    Native.haptic("tap");
    Quests.render();
  }

  /* ---------- swap: replace in place, never a list ---------- */
  function swap(i) {
    const s = Store.state;
    const cur = Quests.questById(s.dailyQuests.ids[i]);
    if (!cur) return;
    const isMission = typeof cur.tier === "number";
    let next = null;
    if (isMission) {
      next = LiveEngine.swapPick(Quests.dayPool(), {
        tier: cur.tier,
        current: cur.id,
        exclude: s.dailyQuests.ids.concat(Object.keys(s.questLog)),
      });
    } else {
      const pool = Quests.bookPool().filter(q =>
        q.id !== cur.id && !s.dailyQuests.ids.includes(q.id) && !s.questLog[q.id]);
      if (pool.length) next = pool[Math.floor(Math.random() * pool.length)];
    }
    if (!next) { UI.toast("Nothing else to swap in"); return; }
    Native.haptic("tap");
    s.dailyQuests.ids[i] = next.id;
    focusOverride = i;
    Store.save();
    Quests.render();
  }

  /* ---------- 🛟 Smaller: a tier-0 rep takes the slot ---------- */
  function rescue(i) {
    const s = Store.state;
    const cur = s.dailyQuests.ids[i];
    const pool = Quests.rescuePool().filter(q => q.id !== cur && !s.dailyQuests.ids.includes(q.id));
    if (!pool.length) return;
    const p = pool[Math.floor(Math.random() * pool.length)];
    Native.haptic("tap");
    s.dailyQuests.ids[i] = p.id;
    focusOverride = i;
    Store.save();
    Quests.render();
  }

  /* ---------- the burst: opt-in, 30 minutes, then gone ---------- */
  function startBurst() {
    const c = cfg();
    const b = burst();
    const today = Store.todayKey();
    if (c.lastBurstDay !== today) { c.lastBurstDay = today; c.bursts = 0; }
    c.bursts += 1;
    b.active = true;
    b.startedAt = Date.now();
    b.endsAt = Date.now() + (c.burstMins || 30) * 60 * 1000;
    b.combo = 0;
    b.done = 0;
    Store.save();
    Native.haptic("medium");
    Native.rescheduleNotifications();   // schedules ids 500-511, and only now
    Quests.render();
  }

  function endBurst(quiet) {
    const b = burst();
    if (!b.active) return;
    const done = b.done || 0;
    Store.state.dayBurst = { active: false };
    Store.save();
    Native.rescheduleNotifications();   // cancels every pending 500-511 ping
    if (!quiet) UI.toast(done ? `Burst done — ${done} banked` : "Burst ended — anytime");
    Quests.render();
  }

  // Called from every render; a lapsed burst closes itself with no ceremony.
  function tick() {
    const b = burst();
    if (b.active && b.endsAt <= Date.now()) {
      Store.state.dayBurst = { active: false };
      Store.save();
      Native.rescheduleNotifications();
    }
  }

  // Chain bonus, but only inside a burst — a board has nothing to chain.
  function onComplete(q) {
    focusOverride = null;
    const b = burst();
    if (!active()) return 0;
    b.combo = (b.combo || 0) + 1;
    b.done = (b.done || 0) + 1;
    Store.save();
    return LiveEngine.comboBonus(b.combo);
  }

  /* ---------- rendering bits the board asks for ---------- */
  function burstButton() {
    if (active()) {
      return UI.el("button", {
        class: "btn ghost small block burst-btn", style: "margin-top:8px", text: "■ End burst",
        onclick: () => endBurst(),
      });
    }
    return UI.el("button", {
      class: "btn ghost small block burst-btn", style: "margin-top:8px", text: "▶ Burst",
      onclick: startBurst,
    });
  }

  // Time and combo are two different facts — each stays its own stable
  // token instead of a trailing word that means "left" one render and
  // "×2" the next.
  function burstStrip() {
    clearInterval(uiTimer);
    uiTimer = null;
    if (!active()) return null;
    const b = burst();
    const clock = UI.el("span", { class: "burst-left", text: `${LiveEngine.fmtClock(b.endsAt - Date.now())} left` });
    const kids = [UI.el("span", { class: "burst-dot", text: "▶" }), clock];
    if (b.combo > 1) kids.push(UI.el("span", { class: "chip combo", text: `×${b.combo} combo` }));
    const strip = UI.el("div", { class: "card burst-strip", style: "border-color:var(--good)" }, kids);

    uiTimer = setInterval(() => {
      const pane = document.getElementById("pane-quests");
      if (!pane || !pane.classList.contains("active")) { clearInterval(uiTimer); uiTimer = null; return; }
      const b2 = burst();
      if (!b2.active) { clearInterval(uiTimer); uiTimer = null; return; }
      const left = b2.endsAt - Date.now();
      // A lapsed burst closes itself right here instead of waiting for the
      // next render to notice (DayMode.tick() is the same check, but only
      // runs when something else triggers a re-render).
      if (left <= 0) { clearInterval(uiTimer); uiTimer = null; endBurst(true); return; }
      clock.textContent = `${LiveEngine.fmtClock(left)} left`;
    }, 1000);

    return strip;
  }

  return {
    swap, rescue, focusIndex, focusOn,
    startBurst, endBurst, tick, onComplete,
    burstButton, burstStrip,
    get active() { return active(); },
    get burstMins() { return cfg().burstMins; },
    BURST_STEPS,
  };
})();
