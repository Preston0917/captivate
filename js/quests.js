/* ============================================================
   quests.js — daily quests, weekly boss, field missions
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

  // Pick today's 3 daily quests deterministically from the pool
  function ensureDaily() {
    const s = Store.state;
    const today = Store.todayKey();
    if (s.dailyQuests.day === today && s.dailyQuests.ids.length) return;

    const pool = allQuests().filter(q => eligible(q) && !q.boss);
    const rand = Store.seededRandom(today + "|daily");
    const picks = [];
    const used = new Set();
    // Prefer variety: one warm-skill, one comp-skill, one any
    const shuffled = pool.slice().sort(() => rand() - 0.5);
    for (const q of shuffled) {
      if (picks.length >= 3) break;
      if (used.has(q.id)) continue;
      picks.push(q.id);
      used.add(q.id);
    }
    s.dailyQuests = { day: today, ids: picks, done: [] };
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
    const leveled = Store.addXp(q.xp, q.skill);
    UI.xpToast(q.xp, leveled);
    checkBadges();
    Native.rescheduleNotifications();
    render();
  }

  function checkBadges() {
    const s = Store.state;
    const n = Object.keys(s.questLog).length;
    const earned = [];
    if (n >= 1) earned.push("first-quest");
    if (n >= 10) earned.push("quest-10");
    if (n >= 50) earned.push("quest-50");
    if (s.streak >= 3) earned.push("streak-3");
    if (s.streak >= 7) earned.push("streak-7");
    if (s.dailyQuests.done.length >= 3) earned.push("clean-sweep");
    if (s.weeklyBoss.done) earned.push("boss-slayer");
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

  function questCard(q, { isDaily = false } = {}) {
    const s = Store.state;
    const doneToday = isDaily
      ? s.dailyQuests.done.includes(q.id)
      : (q.boss ? s.weeklyBoss.done : false);

    const card = UI.el("div", { class: `card quest-card ${doneToday ? "done" : ""}` });
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
      const count = Store.state.tallies[q.id] || 0;
      const countEl = UI.el("div", { class: "tally-count", text: String(count) });
      const tally = UI.el("div", { class: "tally" }, [
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
      card.appendChild(tally);
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

  function render() {
    ensureDaily();
    ensureBoss();
    const s = Store.state;
    const pane = document.getElementById("pane-quests");
    pane.innerHTML = "";
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "Quest Board" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Do them out there. Log them here." }));

    // Weekly boss
    if (s.weeklyBoss.id) {
      const boss = questById(s.weeklyBoss.id);
      if (boss) {
        pane.appendChild(UI.el("div", { class: "section-label", text: "⚡ Weekly Boss Challenge" }));
        pane.appendChild(questCard(boss));
      }
    }

    // Daily quests
    pane.appendChild(UI.el("div", { class: "section-label", text: `Today's Quests (${s.dailyQuests.done.length}/${s.dailyQuests.ids.length})` }));
    for (const id of s.dailyQuests.ids) {
      const q = questById(id);
      if (q) pane.appendChild(questCard(q, { isDaily: true }));
    }

    // Free-play: browse the full quest pool
    pane.appendChild(UI.el("div", { class: "section-label", text: "Side Quests (anytime)" }));
    const done = new Set(Object.keys(s.questLog));
    const side = allQuests().filter(q => eligible(q) && !q.boss && !s.dailyQuests.ids.includes(q.id));
    const listWrap = UI.el("div");
    let shown = 0;
    for (const q of side) {
      if (shown >= 5) break;
      if (done.has(q.id)) continue;
      listWrap.appendChild(questCard(q));
      shown++;
    }
    if (!shown) listWrap.appendChild(UI.el("div", { class: "card muted", text: "All caught up — level up for more." }));
    pane.appendChild(listWrap);

    // Custom quest author
    pane.appendChild(UI.el("div", { class: "section-label", text: "Create your own" }));
    pane.appendChild(UI.el("div", { class: "card" }, [
      UI.el("div", { class: "muted", text: "Set your own challenge." }),
      UI.el("button", {
        class: "btn small", text: "＋ New custom quest", style: "margin-top:10px",
        onclick: customQuestModal,
      }),
    ]));
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

  return { render, ensureDaily, questById, checkBadges };
})();
