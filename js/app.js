/* ============================================================
   app.js — tab router + boot
   ============================================================ */

(() => {
  const PANES = {
    home: () => Home.render(),
    quests: () => Quests.render(),
    night: () => NightMode.render(),
    story: () => StoryMode.render(),
    trainer: () => Trainer.render(),
    skilltree: () => SkillTree.render(),
    analyzer: () => Analyzer.render(),
    settings: () => Settings.render(),
  };

  function show(name) {
    document.querySelectorAll(".pane").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(`pane-${name}`).classList.add("active");
    // Panes without a tab-bar button (e.g. night) highlight no tab
    const tab = document.querySelector(`.tab[data-pane="${name}"]`);
    if (tab) tab.classList.add("active");
    PANES[name]();
    window.scrollTo({ top: 0 });
  }

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => show(tab.dataset.pane));
  });

  window.App = { show };

  // ---------- Settings pane ----------
  window.Settings = {
    render() {
      const pane = document.getElementById("pane-settings");
      const s = Store.state;
      pane.innerHTML = "";
      pane.appendChild(UI.el("h2", { class: "pane-title", text: "Settings" }));
      pane.appendChild(UI.el("div", { class: "pane-sub", text: "API access, badges, and your data." }));

      // --- API key ---
      const keyInput = UI.el("input", { type: "password", placeholder: "sk-ant-...", value: s.settings.apiKey });
      const modelSel = UI.el("select", {},
        ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"].map(m =>
          UI.el("option", { value: m, text: m, ...(s.settings.model === m ? { selected: "" } : {}) })
        )
      );
      pane.appendChild(UI.el("div", { class: "card" }, [
        UI.el("h3", { text: "🔑 Claude API" }),
        UI.el("div", { class: "field" }, [
          UI.el("label", { text: "API key (stored only in this browser)" }),
          keyInput,
          UI.el("div", { class: "hint", text: "Used for the transcript analyzer. The key never leaves your device except to call api.anthropic.com directly. Personal use only — don't host this page publicly with a key saved." }),
        ]),
        UI.el("div", { class: "field" }, [
          UI.el("label", { text: "Model" }),
          modelSel,
          UI.el("div", { class: "hint", text: "Opus = deepest coaching. Sonnet = faster/cheaper. Haiku = quick + cheapest." }),
        ]),
        UI.el("button", {
          class: "btn primary", text: "Save",
          onclick: () => {
            s.settings.apiKey = keyInput.value.trim();
            s.settings.model = modelSel.value;
            Store.save();
            UI.toast("Settings saved");
          },
        }),
      ]));

      // --- Badges ---
      pane.appendChild(UI.el("div", { class: "section-label", text: "Badges" }));
      const grid = UI.el("div", { class: "badge-grid" });
      for (const b of QuestData.badges) {
        const owned = s.badges.includes(b.id);
        grid.appendChild(UI.el("div", { class: `badge ${owned ? "" : "locked"}`, title: b.desc }, [
          UI.el("div", { class: "b-ico", text: b.icon }),
          UI.el("div", { class: "b-name", text: b.name }),
        ]));
      }
      pane.appendChild(grid);

      // --- Stats & data ---
      pane.appendChild(UI.el("div", { class: "section-label", text: "Data" }));
      pane.appendChild(UI.el("div", { class: "card" }, [
        UI.el("div", { class: "muted", text: `Total XP earned: ${s.totalXp} · Quests completed: ${Object.keys(s.questLog).length} · Analyses: ${s.analyses.length}` }),
        UI.el("div", { style: "display:flex; gap:8px; margin-top:12px;" }, [
          UI.el("button", {
            class: "btn small", text: "Export save",
            onclick: () => {
              const blob = new Blob([JSON.stringify(Store.state, null, 2)], { type: "application/json" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `captivate-save-${Store.todayKey()}.json`;
              a.click();
            },
          }),
          UI.el("button", {
            class: "btn small danger", text: "Reset everything",
            onclick: () => {
              if (confirm("Wipe all progress? This cannot be undone.")) {
                Store.reset();
                UI.refreshHud();
                App.show("home");
                UI.toast("Fresh start!");
              }
            },
          }),
        ]),
      ]));
    },
  };

  // ---------- service worker ----------
  // Web/PWA only: the Capacitor wrap serves from capacitor:// and must not run it,
  // and file:// has no SW support at all.
  function registerServiceWorker() {
    if (window.Capacitor) return;
    if (!/^https?:$/.test(location.protocol)) return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("sw.js", { scope: "./" })
      .catch(err => console.warn("SW registration failed", err));
  }

  // ---------- boot ----------
  UI.refreshHud();
  show("home");
  registerServiceWorker();
})();
