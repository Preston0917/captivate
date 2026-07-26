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
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Small reps, every day. That's how charisma is built." }));

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

    // Night Mode shortcut — the live-session mode
    pane.appendChild(UI.el("div", { class: "card daily-spark", style: "border-color:var(--gold)" }, [
      UI.el("div", { class: "spark-label", style: "color:var(--gold)", text: NightMode.active ? "🌙 Shift in progress" : "🌙 Night Mode" }),
      UI.el("div", { class: "spark-text", text: NightMode.active ? "You're on the clock — jump back in." : "Working tonight? Get one small social mission at a time, on a timer." }),
      UI.el("button", { class: "btn primary", style: "margin-top:10px", text: NightMode.active ? "Back to my shift" : "Start a shift", onclick: () => App.show("night") }),
    ]));

    // Story Mode shortcut
    pane.appendChild(UI.el("div", { class: "card daily-spark", style: "border-color:var(--comp)" }, [
      UI.el("div", { class: "spark-label", style: "color:var(--comp)", text: "🗺️ Story Mode" }),
      UI.el("div", { class: "spark-text", text: StoryMode.teaser() }),
      UI.el("button", { class: "btn primary", style: "margin-top:10px", text: "Continue the journey", onclick: () => App.show("story") }),
    ]));

    // Stats
    pane.appendChild(UI.el("div", { class: "stat-grid" }, [
      statTile(s.streak, "day streak"),
      statTile(s.dailyQuests.done.length + "/" + (s.dailyQuests.ids.length || 3), "quests today"),
      statTile(Object.keys(s.questLog).length, "total quests"),
      statTile(s.totalXp, "lifetime XP"),
    ]));

    // Quest shortcut
    const remaining = s.dailyQuests.ids.length - s.dailyQuests.done.length;
    pane.appendChild(UI.el("div", { class: "card" }, [
      UI.el("h3", { text: remaining > 0 ? `⚔️ ${remaining} quest${remaining > 1 ? "s" : ""} waiting` : "🌟 All daily quests done!" }),
      UI.el("div", { class: "muted", text: remaining > 0 ? "Get out there and run today's missions." : "Come back tomorrow for fresh missions — or hit the training grounds." }),
      UI.el("button", {
        class: "btn primary", style: "margin-top:10px",
        text: remaining > 0 ? "Open quest board" : "Go train",
        onclick: () => App.show(remaining > 0 ? "quests" : "trainer"),
      }),
    ]));

    // Analyzer shortcut
    pane.appendChild(UI.el("div", { class: "card" }, [
      UI.el("h3", { text: "🎙️ Ran a stream or recorded a convo?" }),
      UI.el("div", { class: "muted", text: "Paste the transcript and get coached on your warmth, competence, and cues." }),
      UI.el("button", { class: "btn", style: "margin-top:10px", text: "Analyze a transcript", onclick: () => App.show("analyzer") }),
    ]));
  }

  function statTile(num, label) {
    return UI.el("div", { class: "stat-tile" }, [
      UI.el("div", { class: "st-num", text: String(num) }),
      UI.el("div", { class: "st-label", text: label }),
    ]);
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
