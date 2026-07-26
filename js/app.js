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
      // Native keeps the key in the Keychain, so it arrives asynchronously.
      const keyInput = UI.el("input", { type: "password", placeholder: "sk-ant-...", value: "" });
      Native.getApiKey().then(k => { keyInput.value = k || ""; });
      const modelSel = UI.el("select", {},
        ["claude-opus-5", "claude-sonnet-5", "claude-haiku-4-5"].map(m =>
          UI.el("option", { value: m, text: m, ...(s.settings.model === m ? { selected: "" } : {}) })
        )
      );
      pane.appendChild(UI.el("div", { class: "card" }, [
        UI.el("h3", { text: "🔑 Claude API" }),
        UI.el("div", { class: "field" }, [
          UI.el("label", { text: Native.isNative ? "API key (stored in the iOS Keychain)" : "API key (stored only in this browser)" }),
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
          onclick: async () => {
            s.settings.model = modelSel.value;
            Store.save();
            await Native.setApiKey(keyInput.value.trim());
            Native.haptic("success");
            UI.toast("Settings saved");
            Native.rescheduleNotifications();
          },
        }),
      ]));

      // --- Reminders (native only: the web can't schedule local notifications) ---
      if (Native.isNative) {
        const cfg = s.settings.notifs;
        const questTime = UI.el("input", { type: "time", value: cfg.questHour || "10:00" });
        const streakTime = UI.el("input", { type: "time", value: cfg.streakHour || "20:30" });
        const toggle = UI.el("input", { type: "checkbox", ...(cfg.enabled ? { checked: "" } : {}) });

        toggle.addEventListener("change", async () => {
          const granted = await Native.enableNotifications(toggle.checked);
          toggle.checked = granted;
          UI.toast(granted ? "Reminders on — warm nudges only" : "Reminders off");
        });
        const saveTimes = () => {
          cfg.questHour = questTime.value || "10:00";
          cfg.streakHour = streakTime.value || "20:30";
          Store.save();
          Native.rescheduleNotifications();
        };
        questTime.addEventListener("change", saveTimes);
        streakTime.addEventListener("change", saveTimes);

        pane.appendChild(UI.el("div", { class: "card" }, [
          UI.el("h3", { text: "🔔 Reminders" }),
          UI.el("div", { class: "field" }, [
            UI.el("label", { style: "display:flex; align-items:center; gap:8px" }, [toggle, UI.el("span", { text: "Send me reminders" })]),
            UI.el("div", { class: "hint", text: "Two friendly nudges a day, and a heads-up when a night goal is close. Never a guilt trip — you can turn them off any time." }),
          ]),
          UI.el("div", { class: "field" }, [
            UI.el("label", { text: "Quest nudge" }),
            questTime,
            UI.el("div", { class: "hint", text: "Skipped automatically on days you've already logged a rep." }),
          ]),
          UI.el("div", { class: "field", style: "margin-bottom:0" }, [
            UI.el("label", { text: "Evening streak check-in" }),
            streakTime,
            UI.el("div", { class: "hint", text: "Only shows up if the day is still repless — freezes cover you either way." }),
          ]),
        ]));
      }

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
  Native.boot();          // no-op on web
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") Native.rescheduleNotifications();
  });
})();
