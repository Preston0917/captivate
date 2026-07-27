/* ============================================================
   quests.js — Today: one time-aware board, one done-list.

   There is no second set of three. Today's daily quests ARE today's
   day missions: slot A and B come from the day-mission pool (tiers
   1 and 2/3), slot C from the book pool. One roll, one ledger.

   Time-awareness is one-directional: night-tagged content is gated
   to 17:00-04:00, day content never is. The slate is rolled once per
   calendar day from a pool that already excludes night, so a club
   prompt at 1pm is impossible by construction and the 17:00 boundary
   has nothing to re-roll — a mission finished at 1pm is still
   finished at 1am.

   Quest types:
     - "do":    binary real-world mission → mark complete
     - "tally": count occurrences (cue spotting) → reach goal
   ============================================================ */

const Quests = (() => {

  function allQuests() {
    return QuestData.quests.concat(Store.state.customQuests);
  }

  function questById(id) {
    return allQuests().find(q => q.id === id);
  }

  function eligible(q) {
    return (q.minLevel || 1) <= Store.state.level;
  }

  // Missing `when` means "anytime" — night has to opt in explicitly, so a
  // freshly written quest can never leak into the wrong half of the clock.
  function whenOf(q) { return q.when || "anytime"; }
  function isNight(q) { return whenOf(q) === "night"; }

  // Night content shows only inside the window, or while a shift is live.
  function nightOpen() {
    return Store.isNightHour() || (typeof NightMode !== "undefined" && NightMode.active);
  }

  // The rollable day pool: tier 0 is rescue-only and never drawn.
  function dayPool() {
    return allQuests().filter(q => eligible(q) && whenOf(q) === "day" && q.tier > 0);
  }

  // The book layer — technique quests, hour-agnostic, no tier.
  function bookPool() {
    return allQuests().filter(q => eligible(q) && !q.boss && !isNight(q) && typeof q.tier !== "number");
  }

  function rescuePool() {
    return allQuests().filter(q => whenOf(q) === "day" && q.tier === 0);
  }

  /* ---------- today's slate ----------
     Slot A — a tier-1 day mission (people already next to you)
     Slot B — tier 2, upgraded to tier 3 on a seeded 1-in-4 of days once
              you're level 5+
     Slot C — a book quest, never night-tagged
     Seeded on todayKey so it never reshuffles, and drawn from a pool with
     no night content in it at all. */
  function rollSlate(rand) {
    const day = dayPool();
    const bigRoll = rand() < 0.25;                       // always drawn, so the
    const bigDay = Store.state.level >= 5 && bigRoll;    // seed order is stable
    const picks = [];
    for (const tier of [1, bigDay ? 3 : 2]) {
      let pool = day.filter(q => q.tier === tier && !picks.includes(q.id));
      if (!pool.length) pool = day.filter(q => !picks.includes(q.id));
      if (pool.length) picks.push(pool[Math.floor(rand() * pool.length)].id);
    }
    const book = bookPool().filter(q => !picks.includes(q.id));
    if (book.length) picks.push(book[Math.floor(rand() * book.length)].id);
    return picks;
  }

  function ensureDaily() {
    const s = Store.state;
    const today = Store.todayKey();
    if (s.dailyQuests.day === today && s.dailyQuests.ids.length) return;

    const rand = Store.seededRandom(today + "|daily");
    s.dailyQuests = { day: today, ids: rollSlate(rand), done: [] };
    s.tallies = {};  // reset tallies daily
    Store.save();
  }

  function ensureBoss() {
    const s = Store.state;
    const week = Store.weekKey();
    if (s.weeklyBoss.week === week && s.weeklyBoss.id) return;
    const bosses = QuestData.quests.filter(q => q.boss && eligible(q));
    if (!bosses.length) { s.weeklyBoss = { week, id: null, done: false }; Store.save(); return; }
    const rand = Store.seededRandom(week + "|boss");
    s.weeklyBoss = { week, id: bosses[Math.floor(rand() * bosses.length)].id, done: false };
    Store.save();
  }

  function completeQuest(q, isDaily) {
    const s = Store.state;
    s.questLog[q.id] = { completedAt: Date.now(), day: Store.todayKey() };
    if (isDaily && !s.dailyQuests.done.includes(q.id)) s.dailyQuests.done.push(q.id);
    if (q.boss) s.weeklyBoss.done = true;
    Store.save();

    Store.logRep();
    // A burst chains: the same combo ladder Night pays, capped at +25.
    const bonus = (typeof DayMode !== "undefined") ? DayMode.onComplete(q) : 0;
    const leveled = Store.addXp(q.xp + bonus, q.skill);
    UI.xpToast(q.xp + bonus, leveled);
    checkBadges();
    Native.rescheduleNotifications();
    render();
  }

  function dayMissionsDone() {
    const s = Store.state;
    return Object.keys(s.questLog).filter(id => {
      const q = questById(id);
      return q && whenOf(q) === "day";
    }).length;
  }

  function checkBadges() {
    const s = Store.state;
    const n = Object.keys(s.questLog).length;
    const today = Store.todayKey();
    const earned = [];
    if (n >= 1) earned.push("first-quest");
    if (n >= 10) earned.push("quest-10");
    if (n >= 50) earned.push("quest-50");
    if (s.streak >= 3) earned.push("streak-3");
    if (s.streak >= 7) earned.push("streak-7");
    if (s.dailyQuests.done.length >= 3) earned.push("clean-sweep");
    if (s.weeklyBoss.done) earned.push("boss-slayer");

    const dayDone = dayMissionsDone();
    if (dayDone >= 1) earned.push("day-first");
    if (dayDone >= 10) earned.push("day-ten");
    if (s.questLog["day-three-min"]) earned.push("day-three-min");
    // Both halves of the clock in one day. Derived from state that already
    // persists, so nothing new has to be written on the night side.
    const dayToday = Object.keys(s.questLog).some(id => {
      const q = questById(id);
      return q && whenOf(q) === "day" && s.questLog[id].day === today;
    });
    const nightToday = (s.night && s.night.active && s.night.done >= 1)
      || (s.settings.night && s.settings.night.day === today && s.settings.night.shifts > 0);
    if (dayToday && nightToday) earned.push("round-clock");

    for (const id of earned) {
      if (Store.awardBadge(id)) {
        const b = QuestData.badges.find(x => x.id === id);
        if (b) UI.badgeModal(b);
      }
    }
  }

  // First sentence of a description — enough to decide, never a paragraph.
  function firstSentence(text) {
    const t = String(text || "").trim();
    const m = t.match(/^[\s\S]*?[.!?](?=\s|$)/);
    return m ? m[0].trim() : t;
  }

  function isDone(q, isDaily) {
    const s = Store.state;
    return isDaily ? s.dailyQuests.done.includes(q.id) : (q.boss ? s.weeklyBoss.done : false);
  }

  function tallyBlock(q, isDaily) {
    const countEl = UI.el("div", { class: "tally-count", text: String(Store.state.tallies[q.id] || 0) });
    return UI.el("div", { class: "tally" }, [
      UI.el("button", {
        class: "tally-btn", text: "−",
        onclick: () => {
          const c = Math.max(0, (Store.state.tallies[q.id] || 0) - 1);
          Store.state.tallies[q.id] = c; Store.save();
          countEl.textContent = String(c);
          Native.haptic("tap");
        },
      }),
      countEl,
      UI.el("button", {
        class: "tally-btn", text: "+",
        onclick: () => {
          const c = (Store.state.tallies[q.id] || 0) + 1;
          Store.state.tallies[q.id] = c; Store.save();
          countEl.textContent = String(c);
          Native.haptic("tap");
          if (c >= q.goal) completeQuest(q, isDaily);
        },
      }),
      UI.el("div", { class: "tally-goal", text: `goal: ${q.goal}` }),
    ]);
  }

  function questCard(q, { isDaily = false } = {}) {
    const doneToday = isDone(q, isDaily);

    const card = UI.el("div", { class: `card quest-card ${doneToday ? "done" : ""}`, "data-qid": q.id });
    const head = UI.el("div", { class: "quest-head" }, [
      UI.el("div", { class: "quest-ico", text: q.icon || "⚔️" }),
      UI.el("div", { class: "quest-body" }, [
        UI.el("div", { class: "quest-name", text: q.name }),
        // Card carries the first sentence only — the full desc is in the how-to modal.
        UI.el("div", { class: "quest-desc", text: firstSentence(q.desc) }),
        UI.el("div", { class: "quest-meta" }, [
          UI.el("span", { class: "chip xp", text: `+${q.xp} XP` }),
          q.axis ? UI.el("span", { class: `chip ${q.axis}`, text: q.axis === "warm" ? "Warmth" : "Competence" }) : null,
          q.boss ? UI.el("span", { class: "chip boss", text: "BOSS" }) : null,
          isNight(q) ? UI.el("span", { class: "chip", text: "🌙 Tonight" }) : null,
          q.source ? UI.el("span", { class: "chip", text: q.source }) : null,
        ]),
      ]),
    ]);
    card.appendChild(head);

    if (doneToday) {
      card.appendChild(UI.el("div", { class: "quest-meta", style: "margin-top:10px" }, [
        UI.el("span", { class: "chip", text: "✅ Completed" }),
      ]));
      return card;
    }

    if (q.type === "tally") {
      card.appendChild(tallyBlock(q, isDaily));
    } else {
      card.appendChild(UI.el("div", { class: "quest-actions" }, [
        UI.el("button", { class: "btn primary small", text: "I did it ✔", onclick: () => { Native.haptic("tap"); completeQuest(q, isDaily); } }),
        (q.how || q.tip) ? UI.el("button", {
          class: "btn ghost small", text: "How",
          onclick: () => howToModal(q),
        }) : null,
      ]));
    }
    // Tally quests get a how-to button too (below the counter)
    if (q.type === "tally" && !doneToday && (q.how || q.tip)) {
      card.appendChild(UI.el("div", { class: "quest-actions", style: "margin-top:8px" }, [
        UI.el("button", { class: "btn ghost small", text: "What", onclick: () => howToModal(q) }),
      ]));
    }
    return card;
  }

  /* ---------- the focus card ----------
     Night's one-thing-at-a-time discipline, applied to a board: the first
     unfinished mission of the slate is the only one that gets a whole card.
     Everything else on the pane is a one-line row or behind a disclosure. */
  function focusCard(q, idx) {
    const card = UI.el("div", { class: "card quest-card focus-card", "data-qid": q.id });
    card.appendChild(UI.el("div", { class: "fc-ico", text: q.icon || "⚔️" }));
    card.appendChild(UI.el("div", { class: "fc-name", text: q.name }));
    card.appendChild(UI.el("div", { class: "fc-text", text: q.desc }));
    card.appendChild(UI.el("div", { class: "quest-meta fc-meta" }, [
      UI.el("span", { class: "chip xp", text: `+${q.xp} XP` }),
      q.ctx ? UI.el("span", { class: "chip", text: q.ctx }) : null,
    ]));

    const openers = (q.examples || []).slice(0, 2);
    if (openers.length) {
      card.appendChild(UI.el("div", { class: "section-label", style: "margin-top:12px", text: "Open with" }));
      for (const line of openers) card.appendChild(UI.el("div", { class: "say-chip", text: "“" + line + "”" }));
    }

    if (q.type === "tally") {
      card.appendChild(tallyBlock(q, true));
    } else {
      card.appendChild(UI.el("button", {
        class: "btn primary block", style: "margin-top:12px", text: "✔ Did it",
        onclick: () => { Native.haptic("tap"); completeQuest(q, true); },
      }));
    }

    card.appendChild(UI.el("div", { class: "fc-row" }, [
      UI.el("button", { class: "btn ghost small", text: "⇄ Swap", onclick: () => DayMode.swap(idx) }),
      UI.el("button", { class: "btn ghost small", text: "🛟 Smaller", onclick: () => DayMode.rescue(idx) }),
      UI.el("button", { class: "btn ghost small", text: q.type === "tally" ? "What" : "How", onclick: () => howToModal(q) }),
    ]));
    card.appendChild(DayMode.burstButton());
    return card;
  }

  // The two missions that aren't the focus: one line, one tap.
  function slateRow(q, idx, done) {
    return UI.el("button", {
      class: `slate-row ${done ? "done" : ""}`, "data-qid": q.id,
      onclick: () => { if (!done) DayMode.focusOn(idx); },
    }, [
      UI.el("span", { class: "slate-box", text: done ? "✅" : "○" }),
      UI.el("span", { class: "slate-name", text: q.name }),
      UI.el("span", { class: "chip xp", text: `+${q.xp}` }),
    ]);
  }

  // Rich how-to modal: steps, example lines, toggleable visual, real-photo link
  function howToModal(q) {
    const wrap = UI.el("div", {}, [
      UI.el("h3", { text: q.name }),
      UI.el("p", { class: "muted", style: "line-height:1.55; margin-top:6px; font-size:.85rem", text: q.desc }),
    ]);

    if (q.how && q.how.length) {
      wrap.appendChild(UI.el("div", { class: "section-label", style: "margin-top:14px", text: "How to do it" }));
      const ol = UI.el("ol", { class: "howto-steps" });
      for (const step of q.how) ol.appendChild(UI.el("li", { text: step }));
      wrap.appendChild(ol);
    } else if (q.tip) {
      wrap.appendChild(UI.el("p", { class: "muted", style: "line-height:1.6; margin-top:10px", text: q.tip }));
    }

    if (q.how && q.how.length && q.tip) {
      wrap.appendChild(UI.el("p", { class: "muted", style: "line-height:1.6; margin-top:10px; font-size:.85rem", text: q.tip }));
    }

    if (q.examples && q.examples.length) {
      wrap.appendChild(UI.el("div", { class: "section-label", text: "Try saying" }));
      for (const ex of q.examples) {
        wrap.appendChild(UI.el("div", { class: "say-chip", text: "“" + ex + "”" }));
      }
    }

    // Every artifact a step names — a grid, a map, a scale — ships inside the
    // app: either as a demo you can open here, or as a glossary term you can tap.
    const demo = q.demo ? Demos.get(q.demo) : null;
    if (demo) {
      const demoBox = UI.el("div", { class: "demo-box hidden" });
      const showText = demo.interactive ? "🫵 Open it here" : "👁 Show me what it looks like";
      const hideText = demo.interactive ? "🙈 Hide it" : "🙈 Hide the visual";
      let built = false;
      const toggleBtn = UI.el("button", {
        class: `btn small ${demo.interactive ? "primary" : ""}`, style: "margin-top:12px",
        text: showText,
        onclick: () => {
          const hidden = demoBox.classList.toggle("hidden");
          // interactive demos measure themselves — only mount once visible
          if (!hidden && !built) { built = true; Demos.render(q.demo, demoBox); }
          if (!hidden) demoBox.scrollIntoView({ block: "nearest" });
          toggleBtn.textContent = hidden ? showText : hideText;
        },
      });
      wrap.appendChild(toggleBtn);
      wrap.appendChild(demoBox);
    }

    if (q.terms && q.terms.length) {
      wrap.appendChild(UI.el("div", { class: "section-label", text: "What these words mean" }));
      wrap.appendChild(UI.el("div", { class: "quest-meta" },
        q.terms.map(id => {
          const t = Trainer.termById(id);
          return t ? UI.el("button", {
            class: "chip chip-btn", text: `${t.emoji || "🔤"} ${t.term}`,
            onclick: () => { UI.closeModal(); Trainer.showTerm(id); },
          }) : null;
        })
      ));
    }

    // Photo search is for real-world body language only — an in-app interactive
    // has nothing to go look up.
    if (q.search || (demo && !demo.interactive)) {
      const query = encodeURIComponent(q.search || (demo.title + " body language example"));
      wrap.appendChild(UI.el("a", {
        class: "photo-link", target: "_blank", rel: "noopener",
        href: "https://www.google.com/search?tbm=isch&q=" + query,
        text: "🔎 See real photos of this ↗",
      }));
    }

    wrap.appendChild(UI.el("button", { class: "btn primary block", text: "Got it — let's go", style: "margin-top:14px", onclick: UI.closeModal }));
    UI.modal(wrap);
  }

  // One collapsed row that owns everything optional on this pane.
  function disclosure(label, build, opts) {
    const box = UI.el("div", { class: "hidden" });
    let built = !!(opts && opts.eager);
    if (built) build(box);
    const btn = UI.el("button", {
      class: "btn ghost small block disclose", text: `${label} ▾`,
      onclick: () => {
        const hidden = box.classList.toggle("hidden");
        if (!hidden && !built) { built = true; build(box); }
        btn.textContent = `${label} ${hidden ? "▾" : "▴"}`;
      },
    });
    return { btn, box };
  }

  function render() {
    ensureDaily();
    ensureBoss();
    DayMode.tick();
    const s = Store.state;
    const pane = document.getElementById("pane-quests");
    pane.innerHTML = "";
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "Today" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Do them out there. Log them here." }));

    const burst = DayMode.burstStrip();
    if (burst) pane.appendChild(burst);

    // Weekly boss — a week-scope commitment, but a night-tagged one still
    // waits for the night window rather than shouting at 1pm.
    if (s.weeklyBoss.id) {
      const boss = questById(s.weeklyBoss.id);
      if (boss && (!isNight(boss) || nightOpen())) {
        pane.appendChild(UI.el("div", { class: "section-label", text: "⚡ Weekly Boss Challenge" }));
        pane.appendChild(questCard(boss));
      }
    }

    // Today's 3 — first unfinished gets the whole card, the rest are rows.
    const ids = s.dailyQuests.ids;
    pane.appendChild(UI.el("div", { class: "section-label", text: `Today's Quests (${s.dailyQuests.done.length}/${ids.length})` }));
    const focusIdx = DayMode.focusIndex();
    let anyFocus = false;
    for (let i = 0; i < ids.length; i++) {
      const q = questById(ids[i]);
      if (!q) continue;
      const done = s.dailyQuests.done.includes(q.id);
      if (i === focusIdx && !done) { pane.appendChild(focusCard(q, i)); anyFocus = true; }
      else pane.appendChild(slateRow(q, i, done));
    }
    if (!anyFocus && s.dailyQuests.done.length >= ids.length) {
      pane.appendChild(UI.el("div", { class: "card muted", text: "All three done. Fresh ones tomorrow." }));
    }

    // 🌙 Tonight — night-tagged content, and only inside the night window.
    if (nightOpen()) {
      const rand = Store.seededRandom(Store.nightKey() + "|tonight");
      // The weekly boss has its own section — never list it twice.
      const pool = allQuests().filter(q =>
        eligible(q) && isNight(q) && !ids.includes(q.id) && q.id !== s.weeklyBoss.id);
      const picks = pool.slice().sort(() => rand() - 0.5).slice(0, 2);
      if (picks.length) {
        const d = disclosure(`🌙 Tonight (${picks.length})`, box => {
          for (const q of picks) box.appendChild(questCard(q));
        }, { eager: true });
        pane.appendChild(d.btn);
        pane.appendChild(d.box);
      }
    }

    // Everything optional lives behind one row (adhd-ux-review.md P3.2).
    // Built eagerly and hidden: display:none costs no height and no tappables,
    // and the browse layer stays measurable without expanding it.
    const more = disclosure("More quests", box => {
      const logged = new Set(Object.keys(s.questLog));
      const side = allQuests().filter(q => eligible(q) && !q.boss && !isNight(q) && !ids.includes(q.id));
      let shown = 0;
      for (const q of side) {
        if (shown >= 5) break;
        if (logged.has(q.id)) continue;
        box.appendChild(questCard(q));
        shown++;
      }
      if (!shown) box.appendChild(UI.el("div", { class: "card muted", text: "All caught up — level up for more." }));
      box.appendChild(UI.el("div", { class: "card" }, [
        UI.el("div", { class: "muted", text: "Set your own challenge." }),
        UI.el("button", {
          class: "btn small", text: "＋ New custom quest", style: "margin-top:10px",
          onclick: customQuestModal,
        }),
      ]));
    }, { eager: true });
    pane.appendChild(more.btn);
    pane.appendChild(more.box);
  }

  function customQuestModal() {
    const name = UI.el("input", { type: "text", placeholder: "e.g. Ask the barista how their day is going" });
    const wrap = UI.el("div", {}, [
      UI.el("h3", { text: "New custom quest" }),
      UI.el("div", { class: "field", style: "margin-top:10px" }, [UI.el("label", { text: "What will you do?" }), name]),
      UI.el("button", {
        class: "btn primary block", text: "Add quest (+25 XP when done)",
        onclick: () => {
          const text = name.value.trim();
          if (!text) return;
          Store.state.customQuests.push({
            id: "custom-" + Date.now(),
            name: text, desc: "Custom challenge you set for yourself.",
            icon: "🎯", xp: 25, type: "do", minLevel: 1, source: "You",
          });
          Store.save();
          UI.closeModal();
          render();
        },
      }),
    ]);
    UI.modal(wrap);
  }

  return {
    render, ensureDaily, questById, checkBadges,
    dayPool, bookPool, rescuePool, whenOf, isNight, nightOpen, dayMissionsDone,
  };
})();
