/* ============================================================
   home.js — dashboard: daily spark, stats, shortcuts
   ============================================================ */

const Home = (() => {
  function render() {
    Quests.ensureDaily();
    const pane = document.getElementById("pane-home");
    const s = Store.state;
    pane.innerHTML = "";

    pane.appendChild(UI.el("h2", { class: "pane-title", text: greeting() }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Small reps, every day." }));

    // Comeback card — after a 2+ day gap. Best streak is permanent; one tiny rep restarts.
    const gap = Store.daysSince(s.lastRepDay);
    if (s.lastRepDay && gap >= 2 && isFinite(gap)) {
      const fadeLines = (typeof StoryData !== "undefined" && StoryData && StoryData.afterHours && StoryData.afterHours.lines) || [];
      const rand = Store.seededRandom(Store.todayKey() + "|comeback");
      const fadeLine = fadeLines.length ? fadeLines[Math.floor(rand() * fadeLines.length)] : "The room didn't go anywhere. Neither did you.";
      pane.appendChild(UI.el("div", { class: "card daily-spark", style: "border-color:var(--good)" }, [
        UI.el("div", { class: "spark-label", style: "color:var(--good)", text: "👋 Welcome back" }),
        UI.el("div", { class: "spark-text", text: `Best streak: 🔥 ${s.bestStreak} — that's yours forever.` }),
        UI.el("div", { class: "muted", style: "margin-top:8px; font-size:.8rem; font-style:italic", text: fadeLine }),
        UI.el("button", {
          class: "btn primary", style: "margin-top:10px", text: "One tiny rep to restart (+30 XP)",
          onclick: () => {
            const tiny = [
              "Say one full sentence to one person today. Staff counts. Cashiers count.",
              "Send one message you'd normally overthink — first draft, no edits.",
              "Make eye contact with someone, smile, and say hey. That's the whole rep.",
            ];
            const pick = tiny[Math.floor(Math.random() * tiny.length)];
            UI.modal(UI.el("div", {}, [
              UI.el("h3", { text: "🛟 The restart rep" }),
              UI.el("p", { class: "muted", style: "margin:10px 0; line-height:1.6", text: pick }),
              UI.el("button", {
                class: "btn primary block", text: "✔ Did it",
                onclick: () => {
                  Store.logRep();
                  const leveled = Store.addXp(30, "cap-engage");
                  UI.closeModal();
                  UI.xpToast(30, leveled);
                  render();
                },
              }),
              UI.el("button", { class: "btn ghost block", style: "margin-top:8px", text: "Not yet", onclick: UI.closeModal }),
            ]));
          },
        }),
      ]));
    }

    // Daily spark — a conversation opener / cue tip of the day
    const sparks = CaptivateContent.sparks.concat(CuesContent.sparks);
    if (sparks.length) {
      const rand = Store.seededRandom(Store.todayKey() + "|spark");
      const spark = sparks[Math.floor(rand() * sparks.length)];
      pane.appendChild(UI.el("div", { class: "card daily-spark" }, [
        UI.el("div", { class: "spark-label", text: `✨ Today's ${spark.kind || "spark"}` }),
        UI.el("div", { class: "spark-text", text: spark.text }),
        spark.why ? UI.el("div", { class: "muted", style: "margin-top:8px; font-size:.8rem", text: spark.why }) : null,
      ]));
    }

    // The Live card — one card, adapting to the window. Night after 17:00 or
    // mid-shift; the day board otherwise. Either way it is one tap to a mission,
    // and it is the only Live CTA on the pane.
    const live = liveCard();
    pane.appendChild(UI.el("div", { class: "card daily-spark", style: "border-color:var(--gold)" }, [
      UI.el("div", { class: "spark-label", style: "color:var(--gold)", text: live.label }),
      UI.el("div", { class: "spark-text", text: live.text }),
      UI.el("button", { class: "btn primary", style: "margin-top:10px", text: live.btn, onclick: live.go }),
    ]));

    // Story Mode shortcut
    pane.appendChild(UI.el("div", { class: "card daily-spark", style: "border-color:var(--comp)" }, [
      UI.el("div", { class: "spark-label", style: "color:var(--comp)", text: "🗺️ Story Mode" }),
      UI.el("div", { class: "spark-text", text: StoryMode.teaser() }),
      UI.el("button", { class: "btn primary", style: "margin-top:10px", text: "Continue the journey", onclick: () => App.show("story") }),
    ]));

    // "One rep away" — surface the nearest finish line (goal-gradient)
    const nearest = nearestPip();
    if (nearest && nearest.delta <= 30) {
      pane.appendChild(UI.el("div", { class: "card", style: "border-color:var(--gold)" }, [
        UI.el("div", { style: "display:flex; align-items:center; gap:10px" }, [
          UI.el("div", { style: "font-size:24px", text: "⚡" }),
          UI.el("div", { style: "flex:1" }, [
            UI.el("div", { style: "font-weight:700; font-size:.9rem", text: `${nearest.name}: ${nearest.delta} XP to its next pip` }),
          ]),
          UI.el("button", { class: "btn small primary", text: "Go", onclick: () => App.show("quests") }),
        ]),
      ]));
    }

    // Trophy strip — progress belongs where you can see it
    const badgeCount = s.badges.length;
    const badgeTotal = QuestData.badges.length + ((typeof StoryData !== "undefined" && StoryData && StoryData.badges) ? StoryData.badges.length : 0);
    const caught = (s.story && s.story.catches) ? Object.keys(s.story.catches).length : 0;
    pane.appendChild(UI.el("div", { class: "card", style: "cursor:pointer", onclick: () => App.show("settings") }, [
      UI.el("div", { style: "display:flex; justify-content:space-around; text-align:center" }, [
        UI.el("div", {}, [UI.el("div", { style: "font-size:1.2rem; font-weight:800; color:var(--gold)", text: `🏅 ${badgeCount}/${badgeTotal}` }), UI.el("div", { class: "st-label", text: "badges" })]),
        UI.el("div", {}, [UI.el("div", { style: "font-size:1.2rem; font-weight:800; color:var(--violet)", text: `💡 ${caught}/24` }), UI.el("div", { class: "st-label", text: "neons" })]),
        UI.el("div", {}, [UI.el("div", { style: "font-size:1.2rem; font-weight:800; color:var(--warm)", text: `🔥 ${s.bestStreak}` }), UI.el("div", { class: "st-label", text: "best streak" })]),
      ]),
    ]));

    // Stats
    pane.appendChild(UI.el("div", { class: "stat-grid" }, [
      statTile(s.streak, "streak"),
      statTile(s.dailyQuests.done.length + "/" + (s.dailyQuests.ids.length || 3), "quests today"),
      statTile(Object.keys(s.questLog).length, "total quests"),
      statTile(s.totalXp, "XP"),
    ]));

    // The quest-shortcut card is gone: opening the board is the Live card's
    // job during the day, and the tab bar covers it at night.

    // Analyzer shortcut
    pane.appendChild(UI.el("div", { class: "card" }, [
      UI.el("h3", { text: "🎙️ Analyzer" }),
      UI.el("div", { class: "muted", text: "Paste a transcript. Get scored and coached." }),
      UI.el("button", { class: "btn", style: "margin-top:10px", text: "Analyze a transcript", onclick: () => App.show("analyzer") }),
    ]));
  }

  // Shift in progress → night → day. Night copy is unchanged; the day variant
  // is one word shorter than the night one it replaces.
  function liveCard() {
    if (NightMode.active) {
      return { label: "🌙 Shift in progress", text: "You're on the clock — jump back in.",
               btn: "Back to my shift", go: () => NightMode.startShift() };
    }
    if (Store.isNightHour()) {
      return { label: "🌙 Night Mode", text: "Three missions, picked for you, on a timer.",
               btn: "Start a shift", go: () => NightMode.startShift() };
    }
    return { label: "☀️ Day Mode", text: "Three missions, waiting for the right moment.",
             btn: "Today's missions", go: () => App.show("quests") };
  }

  function statTile(num, label) {
    return UI.el("div", { class: "stat-tile" }, [
      UI.el("div", { class: "st-num", text: String(num) }),
      UI.el("div", { class: "st-label", text: label }),
    ]);
  }

  // Smallest positive distance to the next mastery pip across all skills
  function nearestPip() {
    const thresholds = [20, 60, 140, 260, 420];
    const skills = CaptivateContent.skills.concat(CuesContent.skills);
    let best = null;
    for (const sk of skills) {
      const xp = Store.state.skillXp[sk.id] || 0;
      const next = thresholds.find(t => t > xp);
      if (next == null) continue;
      const delta = next - xp;
      if (xp > 0 && (!best || delta < best.delta)) best = { name: sk.name, delta };
    }
    return best;
  }

  function greeting() {
    const h = new Date().getHours();
    const name = Store.levelTitle(Store.state.level);
    if (h < 12) return `Morning, ${name}`;
    if (h < 18) return `Afternoon, ${name}`;
    return `Evening, ${name}`;
  }

  return { render };
})();
