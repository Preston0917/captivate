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
    { id: "n-lean-front", tier: 1, icon: "🧭", text: "For the next 5 minutes: front the person talking to you — toes, torso, face — and hold 60% eye contact. Say nothing extra; just be fully aimed.",
      say: [] },
    { id: "n-name-use", tier: 1, icon: "📛", text: "Use someone's name in a sentence within the next 2 minutes. If you don't know it yet, that IS the mission.",
      say: ["Wait — I don't think I actually caught your name. I'm Preston."] },
    { id: "n-triple-nod", tier: 1, icon: "🫡", text: "Next time a girl at your table is telling a story, slow-triple-nod when she pauses and see if she keeps going.",
      say: [] },
    { id: "n-hot-take", tier: 1, icon: "🔥", text: "Drop a playful hot take to the group and let them argue with it.",
      say: ["Hot take: the second drink is always better than the first.", "Hot take: every friend group has a designated photographer, and it's never fair."] },

    // ---- tier 2: initiate fresh ----
    { id: "n-walkin-spark", tier: 2, icon: "🚪", text: "Next walk-in: skip 'how are you' and open with a sparker while you're walking her in.",
      say: ["Okay, best thing that happened to you today — go.", "What's the plan tonight — dance, talk, or cause problems?"] },
    { id: "n-bar-line", tier: 2, icon: "🍸", text: "On your next bar run, say one line to whoever is waiting next to you.",
      say: ["What are you ordering? I need a scouting report.", "This bar line is the real afterparty."] },
    { id: "n-quiet-one", tier: 2, icon: "🫶", text: "Find the quietest girl at your table and make her the star for 2 minutes — one question, then follow-ups only about her answers.",
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
    1: { name: "Warm-up", tiers: [1] },
    2: { name: "Steady", tiers: [1, 1, 2, 2] },
    3: { name: "Bold", tiers: [1, 2, 2, 3] },
  };

  let uiTimer = null;
  let wakeLock = null;

  function ns() {
    const s = Store.state;
    if (!s.night) s.night = { active: false };
    return s.night;
  }

  /* ---------- session lifecycle ---------- */
  function start(intervalMin, level) {
    const s = Store.state;
    s.night = {
      active: true,
      cfg: { interval: intervalMin, level },
      startedAt: Date.now(),
      nextAt: Date.now() + 20 * 1000,   // first prompt after a 20s settle-in
      current: null,
      done: 0, passed: 0, combo: 0, bestCombo: 0, xp: 0,
      usedIds: [],
      goals: [],
    };
    Store.save();
    requestWake();
    Native.rescheduleNotifications();   // prompt cadence goes out as notifications
    render();
    goalModal(true);   // offer to call your shots for the night
  }

  function drawPrompt() {
    const n = ns();
    const allowedTiers = LEVELS[n.cfg.level].tiers;
    const tier = allowedTiers[Math.floor(Math.random() * allowedTiers.length)];
    let pool = PROMPTS.filter(p => p.tier === tier && !n.usedIds.includes(p.id));
    if (!pool.length) {
      // tier exhausted → any unused schedulable prompt, else recycle
      pool = PROMPTS.filter(p => p.tier > 0 && !n.usedIds.includes(p.id));
      if (!pool.length) { n.usedIds = []; pool = PROMPTS.filter(p => p.tier > 0); }
    }
    const p = pool[Math.floor(Math.random() * pool.length)];
    n.current = p.id;
    n.usedIds.push(p.id);
    Store.save();
    buzz();
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

  function addGoal(text, count, deadlineAt) {
    const n = ns();
    n.goals.push({
      id: "g" + Date.now() + Math.floor(Math.random() * 1000),
      text, target: count, done: 0,
      deadlineAt, completedAt: null, expired: false,
    });
    Store.save();
    Native.rescheduleNotifications();   // goal warning + deadline pings
    render();
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

  function goalModal(isShiftStart) {
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
      UI.el("h3", { text: isShiftStart ? "🎯 Call your shots?" : "🎯 New night goal" }),
      UI.el("p", { class: "muted", style: "margin:6px 0 12px; line-height:1.5; font-size:.85rem",
        text: "A target with a deadline — every +1 pays 10 XP instantly, hit the number before the clock for +50. Add as many as you want." }),
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
      UI.el("button", { class: "btn ghost block", style: "margin-top:8px", text: isShiftStart ? "Skip — just the timer tonight" : "Cancel", onclick: UI.closeModal }),
    ]);
    UI.modal(wrap);
  }

  function goalsCard(n) {
    const wrap = UI.el("div", { class: "card" }, [
      UI.el("div", { style: "display:flex; justify-content:space-between; align-items:center" }, [
        UI.el("h3", { text: "🎯 Tonight's goals", style: "margin:0" }),
        UI.el("button", { class: "btn small ghost", text: "＋ Add", onclick: () => goalModal(false) }),
      ]),
    ]);
    if (!(n.goals || []).length) {
      wrap.appendChild(UI.el("div", { class: "muted", style: "margin-top:8px", text: "No goals set — call a shot like \"talk to 3 new guys in the next 30 min\"." }));
      return wrap;
    }
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

  function renderSetup(pane) {
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "🌙 Night Mode" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "For when you're working. A timer feeds you one small social action at a time — with the exact line to open with — so you're never stuck waiting for someone to talk first." }));

    let interval = 12, level = 2;
    const intervalRow = UI.el("div", { class: "seg-row" },
      [7, 12, 20].map(v => UI.el("button", {
        class: `seg ${v === interval ? "on" : ""}`, text: `${v} min`,
        onclick: (e) => { interval = v; intervalRow.querySelectorAll(".seg").forEach(b => b.classList.remove("on")); e.target.classList.add("on"); },
      }))
    );
    const levelRow = UI.el("div", { class: "seg-row" },
      [1, 2, 3].map(v => UI.el("button", {
        class: `seg ${v === level ? "on" : ""}`, text: LEVELS[v].name,
        onclick: (e) => { level = v; levelRow.querySelectorAll(".seg").forEach(b => b.classList.remove("on")); e.target.classList.add("on"); },
      }))
    );

    pane.appendChild(UI.el("div", { class: "card" }, [
      UI.el("div", { class: "field" }, [UI.el("label", { text: "Prompt every…" }), intervalRow]),
      UI.el("div", { class: "field" }, [
        UI.el("label", { text: "Intensity" }),
        levelRow,
        UI.el("div", { class: "hint", text: "Warm-up: only people already around you. Steady: adds fresh approaches. Bold: adds toasts, table stories, bridging groups." }),
      ]),
      UI.el("button", { class: "btn primary block", text: "▶ Start my shift", onclick: () => start(interval, level) }),
    ]));

    pane.appendChild(UI.el("div", { class: "card" }, [
      UI.el("h3", { text: "How it works" }),
      UI.el("div", { class: "muted", style: "line-height:1.6", text:
        "Every interval you get one mission sized to fit between hosting duties — walking someone in, drink runs, sitting at the table. Do it, tap ✔, and your combo builds (+5 XP per chain). Not the right moment? Pass freely — combo resets but a smaller one comes sooner. Frozen? The 🛟 button shrinks the mission to something you can do in 5 seconds." }),
    ]));

    // Keep tab switching from killing the page state — session persists anyway
    const s = Store.state;
    if (s.badges.includes("night-first")) {
      pane.appendChild(UI.el("div", { class: "muted", style: "text-align:center; font-size:.78rem", text: "Session state survives closing the app — your shift keeps running." }));
    }
  }

  function renderCountdown(pane, n) {
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "🌙 On shift" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: `${LEVELS[n.cfg.level].name} · every ${n.cfg.interval} min` }));

    const clock = UI.el("div", { class: "night-clock", text: fmt(n.nextAt - Date.now()) });
    const bar = UI.el("div", { class: "meter", style: "margin-top:14px" }, [
      UI.el("div", { class: "meter-fill gold", style: "width:0%" }),
    ]);
    pane.appendChild(UI.el("div", { class: "card night-wait" }, [
      UI.el("div", { class: "muted", text: "Next mission in" }),
      clock, bar,
      UI.el("div", { class: "muted", style: "margin-top:12px; font-size:.8rem", text: "Live your night — this will buzz when it's time. Or jump the gun:" }),
      UI.el("button", { class: "btn small", style: "margin-top:8px", text: "⚡ Give me one now", onclick: () => { ns().nextAt = Date.now(); Store.save(); render(); } }),
    ]));

    pane.appendChild(goalsCard(n));
    pane.appendChild(statsCard(n));
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

  function renderPrompt(pane, n) {
    const p = PROMPTS.find(x => x.id === n.current);
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "🎯 Your mission" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: p.tier === 0 ? "Tiny version — five seconds, that's all." : `Tier ${p.tier} · +${TIER_XP[p.tier]} XP${n.combo > 0 ? ` · combo ×${n.combo + 1} bonus +${Math.min(25, n.combo * 5)}` : ""}` }));

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
    if (p.tier > 0) {
      pane.appendChild(UI.el("button", { class: "btn ghost block", style: "margin-top:8px", text: "🛟 I'm frozen — make it smaller", onclick: panic }));
    }

    pane.appendChild(goalsCard(n));
    pane.appendChild(statsCard(n));
    pane.appendChild(UI.el("button", { class: "btn danger block", text: "End shift", onclick: endSession }));
  }

  function statsCard(n) {
    return UI.el("div", { class: "stat-grid", style: "margin:14px 0" }, [
      UI.el("div", { class: "stat-tile" }, [UI.el("div", { class: "st-num", text: String(n.done) }), UI.el("div", { class: "st-label", text: "done" })]),
      UI.el("div", { class: "stat-tile" }, [UI.el("div", { class: "st-num", text: "×" + n.combo }), UI.el("div", { class: "st-label", text: "combo" })]),
      UI.el("div", { class: "stat-tile" }, [UI.el("div", { class: "st-num", text: String(n.xp) }), UI.el("div", { class: "st-label", text: "night XP" })]),
      UI.el("div", { class: "stat-tile" }, [UI.el("div", { class: "st-num", text: String(n.passed) }), UI.el("div", { class: "st-label", text: "passes" })]),
    ]);
  }

  return { render, get active() { return ns().active; } };
})();
