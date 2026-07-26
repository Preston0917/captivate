/* ============================================================
   native.js — the Capacitor bridge.

   Loaded BEFORE every engine script so `Native` always exists.
   On the web (GitHub Pages, plain file, anything that isn't the
   iOS wrap) every method here is a safe no-op or falls back to
   the localStorage behaviour the app already had — this file
   must never change how the web version behaves.

   No bundler is involved: plugins are reached through the
   bridge's own `Capacitor.registerPlugin(name)`, which returns a
   proxy straight to the installed native plugin. Nothing is
   imported on web, so a missing plugin can't break the page.
   ============================================================ */

const Native = (() => {

  const isNative = !!(window.Capacitor
    && typeof window.Capacitor.isNativePlatform === "function"
    && window.Capacitor.isNativePlatform());

  const KEYCHAIN_KEY = "captivate.apiKey";

  const loaded = {};
  function plugin(name) {
    if (!isNative) return null;
    if (name in loaded) return loaded[name];
    const C = window.Capacitor;
    try {
      loaded[name] = (C.Plugins && C.Plugins[name]) || C.registerPlugin(name);
    } catch (e) {
      console.warn("[native] plugin unavailable:", name, e);
      loaded[name] = null;
    }
    return loaded[name];
  }

  /* ============================================================
     API KEY — Keychain on device, the save file on web
     ============================================================ */

  let keyCache = null;   // null = not read yet, "" = known-empty

  async function getApiKey() {
    const s = Store.state;
    if (!isNative) return s.settings.apiKey || "";
    if (keyCache !== null) return keyCache;

    const ss = plugin("SecureStoragePlugin");
    if (!ss) return s.settings.apiKey || "";

    let val = "";
    try {
      const r = await ss.get({ key: KEYCHAIN_KEY });
      val = (r && r.value) || "";
    } catch (e) { val = ""; }   // plugin rejects when the key isn't set

    // One-time migration: a key typed into the web version rides along in the
    // save file. Move it into the Keychain and blank the plaintext copy.
    if (!val && s.settings.apiKey) {
      val = s.settings.apiKey;
      try {
        await ss.set({ key: KEYCHAIN_KEY, value: val });
        s.settings.apiKey = "";
        Store.save();
      } catch (e) { console.warn("[native] keychain migration failed", e); }
    }

    keyCache = val;
    return val;
  }

  async function setApiKey(v) {
    const value = (v || "").trim();
    const s = Store.state;
    if (!isNative) { s.settings.apiKey = value; Store.save(); return; }

    const ss = plugin("SecureStoragePlugin");
    if (!ss) { s.settings.apiKey = value; Store.save(); keyCache = value; return; }

    try {
      if (value) await ss.set({ key: KEYCHAIN_KEY, value });
      else await ss.remove({ key: KEYCHAIN_KEY }).catch(() => {});
      keyCache = value;
      if (s.settings.apiKey) { s.settings.apiKey = ""; Store.save(); }
    } catch (e) {
      console.warn("[native] keychain write failed", e);
      s.settings.apiKey = value; Store.save(); keyCache = value;
    }
  }

  // Best-effort synchronous answer for render-time decisions ("do we have a
  // key at all?"). The async accessor is still the source of truth.
  function hasApiKey() {
    if (!isNative) return !!(Store.state.settings.apiKey);
    return !!keyCache;
  }

  /* ============================================================
     HAPTICS
     ============================================================ */

  const IMPACT = { tap: "LIGHT", medium: "MEDIUM", heavy: "HEAVY" };

  function haptic(kind) {
    if (!isNative) return;
    const h = plugin("Haptics");
    if (!h) return;
    try {
      if (kind === "success" || kind === "warning" || kind === "error") {
        h.notification({ type: kind.toUpperCase() });
      } else {
        h.impact({ style: IMPACT[kind] || "LIGHT" });
      }
    } catch (e) { /* haptics are decoration — never let them throw */ }
  }

  /* ============================================================
     LOCAL NOTIFICATIONS

     All copy is carrot, never stick: an invitation to play, never
     a guilt trip about what you didn't do.

     ID ranges we own (everything else is left alone):
       100–106  daily quest nudge, one per day for the next 7
       200–206  streak keeper, one per evening for the next 7
       300–311  night-mode prompt cadence (live session only)
       400–499  night-goal warning/deadline pairs
     ============================================================ */

  const QUEST_IDS  = [100, 106];
  const STREAK_IDS = [200, 206];
  const NIGHT_IDS  = [300, 311];
  const GOAL_IDS   = [400, 499];

  function ourId(id) {
    return [QUEST_IDS, STREAK_IDS, NIGHT_IDS, GOAL_IDS]
      .some(r => id >= r[0] && id <= r[1]);
  }

  const QUEST_LINES = [
    "3 fresh quests are up — any one of them counts.",
    "Today's quests are picked and waiting. Pick the easy one.",
    "New quest board. One small rep is a whole day's win.",
    "Your quests are ready whenever you are — 30 seconds is plenty.",
    "Three quests, one you'll actually enjoy. Take a look.",
    "Fresh missions are live. Grab whichever one fits your day.",
    "The board reset — one rep out in the wild and today's done.",
  ];

  const STREAK_LINES = [
    "One rep tonight keeps the chain rolling — a hello counts.",
    "Still time for one small rep. And you've got freezes if not.",
    "Anything counts tonight: one question, one compliment, done.",
    "A single rep wraps the day. Freezes have your back either way.",
    "Evening check-in: one tiny social rep and today's in the books.",
    "One line to one person is a full rep. That's all it takes.",
    "Free freeze on standby — but one rep tonight feels better.",
  ];

  function notifCfg() {
    const s = Store.state;
    if (!s.settings.notifs) {
      s.settings.notifs = { enabled: false, questHour: "10:00", streakHour: "20:30" };
    }
    return s.settings.notifs;
  }

  function atTime(dayOffset, hhmm, fallback) {
    const [h, m] = String(hhmm || fallback).split(":").map(Number);
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(isNaN(h) ? 10 : h, isNaN(m) ? 0 : m, 0, 0);
    return d;
  }

  const SOON = 60 * 1000;   // don't schedule anything inside the next minute

  function questNotifs(cfg) {
    const s = Store.state;
    const today = Store.todayKey();
    const repToday = s.lastRepDay === today;
    const dq = s.dailyQuests || {};
    const allDone = dq.day === today && dq.ids && dq.ids.length && dq.done.length >= dq.ids.length;

    const out = [];
    for (let i = 0; i < 7; i++) {
      if (i === 0 && (repToday || allDone)) continue;   // nothing to nudge about
      const when = atTime(i, cfg.questHour, "10:00");
      if (when.getTime() <= Date.now() + SOON) continue;
      out.push({
        id: QUEST_IDS[0] + i,
        title: "Captivate",
        body: QUEST_LINES[i % QUEST_LINES.length],
        schedule: { at: when, allowWhileIdle: true },
        extra: { pane: "quests" },
      });
    }
    return out;
  }

  function streakNotifs(cfg) {
    const s = Store.state;
    const repToday = s.lastRepDay === Store.todayKey();

    const out = [];
    for (let i = 0; i < 7; i++) {
      if (i === 0 && repToday) continue;   // already in for today
      const when = atTime(i, cfg.streakHour, "20:30");
      if (when.getTime() <= Date.now() + SOON) continue;
      out.push({
        id: STREAK_IDS[0] + i,
        title: "🔥 Streak check-in",
        body: STREAK_LINES[i % STREAK_LINES.length],
        schedule: { at: when, allowWhileIdle: true },
        extra: { pane: "home" },
      });
    }
    return out;
  }

  // Deterministic goal id → a stable pair of notification ids, so rescheduling
  // the same goal always lands on the same slots.
  function goalIdBase(goalId) {
    let h = 2166136261;
    for (let i = 0; i < goalId.length; i++) {
      h ^= goalId.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const span = (GOAL_IDS[1] - GOAL_IDS[0] + 1) / 2;   // 50 pairs
    return GOAL_IDS[0] + (Math.abs(h) % span) * 2;
  }

  function nightNotifs() {
    const n = Store.state.night;
    if (!n || !n.active) return [];   // scheduled only while a shift is live

    const out = [];
    const intervalMs = ((n.cfg && n.cfg.interval) || 12) * 60 * 1000;
    let t = n.nextAt || (Date.now() + intervalMs);
    let slot = 0;
    const slots = NIGHT_IDS[1] - NIGHT_IDS[0] + 1;
    while (slot < slots) {
      if (t > Date.now() + 30 * 1000) {
        out.push({
          id: NIGHT_IDS[0] + slot,
          title: "🌙 Next mission",
          body: "Your next move is ready — one small action, then back to your night.",
          schedule: { at: new Date(t), allowWhileIdle: true },
          extra: { pane: "night" },
        });
        slot++;
      }
      t += intervalMs;
    }

    const used = new Set();
    for (const g of n.goals || []) {
      if (g.completedAt || g.expired) continue;
      let base = goalIdBase(g.id);
      while (used.has(base) && base + 2 <= GOAL_IDS[1]) base += 2;   // collision walk
      if (used.has(base)) continue;
      used.add(base);

      const warnAt = g.deadlineAt - 10 * 60 * 1000;
      if (warnAt > Date.now() + 30 * 1000) {
        out.push({
          id: base,
          title: "🎯 10 minutes left",
          body: `"${g.text}" — you're at ${g.done}/${g.target}. One more swing fits.`,
          schedule: { at: new Date(warnAt), allowWhileIdle: true },
          extra: { pane: "night" },
        });
      }
      if (g.deadlineAt > Date.now() + 30 * 1000) {
        out.push({
          id: base + 1,
          title: "🎯 Time on that one",
          body: `"${g.text}" window closed — every check-in you logged still counts. Call another shot?`,
          schedule: { at: new Date(g.deadlineAt), allowWhileIdle: true },
          extra: { pane: "night" },
        });
      }
    }
    return out;
  }

  let rescheduleTimer = null;

  // Coalesces the bursts of calls that come from logging a rep (rep → quest →
  // badge all fire in the same tick).
  function rescheduleNotifications() {
    if (!isNative) return;
    clearTimeout(rescheduleTimer);
    rescheduleTimer = setTimeout(() => {
      doReschedule().catch(e => console.warn("[native] reschedule failed", e));
    }, 300);
  }

  async function doReschedule() {
    const LN = plugin("LocalNotifications");
    if (!LN) return;

    // Clear only the ids we own — never touch anything else pending.
    const pend = await LN.getPending();
    const mine = ((pend && pend.notifications) || []).filter(x => ourId(x.id)).map(x => ({ id: x.id }));
    if (mine.length) await LN.cancel({ notifications: mine });

    const cfg = notifCfg();
    if (!cfg.enabled) return;

    const perm = await LN.checkPermissions();
    if (!perm || perm.display !== "granted") return;

    const list = questNotifs(cfg).concat(streakNotifs(cfg), nightNotifs());
    if (list.length) await LN.schedule({ notifications: list });
  }

  // Settings toggle: asks for permission the first time it's switched on.
  async function enableNotifications(on) {
    const cfg = notifCfg();
    if (!isNative) { cfg.enabled = false; Store.save(); return false; }
    const LN = plugin("LocalNotifications");
    if (!LN) return false;

    if (!on) {
      cfg.enabled = false; Store.save();
      rescheduleNotifications();
      return false;
    }

    let perm = await LN.checkPermissions();
    if (perm.display !== "granted") perm = await LN.requestPermissions();
    const granted = perm && perm.display === "granted";
    cfg.enabled = granted;
    Store.save();
    rescheduleNotifications();
    return granted;
  }

  async function pendingCount() {
    const LN = plugin("LocalNotifications");
    if (!LN) return 0;
    try {
      const pend = await LN.getPending();
      return ((pend && pend.notifications) || []).filter(x => ourId(x.id)).length;
    } catch (e) { return 0; }
  }

  /* ============================================================
     SHARE-SHEET / "OPEN IN CAPTIVATE" TRANSCRIPT IMPORT
     ============================================================ */

  async function importFile(url) {
    if (!url) return;
    const FS = plugin("Filesystem");
    if (!FS) return;
    try {
      const res = await FS.readFile({ path: url, encoding: "utf8" });
      let text = res && res.data ? String(res.data) : "";
      if (!text.trim()) return;
      if (text.length > 400000) text = text.slice(0, 400000);
      // These are `const` script globals, not window properties — check by name.
      if (typeof Analyzer !== "undefined" && Analyzer.fillTranscript) Analyzer.fillTranscript(text);
      if (typeof UI !== "undefined") UI.toast("Transcript loaded — hit Analyze");
    } catch (e) {
      console.warn("[native] file import failed", e);
      if (typeof UI !== "undefined") UI.toast("Couldn't read that file");
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */

  async function boot() {
    if (!isNative) return;
    document.documentElement.classList.add("native");

    try { await getApiKey(); } catch (e) { /* keychain optional */ }

    const LN = plugin("LocalNotifications");
    if (LN) {
      try {
        LN.addListener("localNotificationActionPerformed", ev => {
          const pane = ev && ev.notification && ev.notification.extra && ev.notification.extra.pane;
          if (pane && window.App) App.show(pane);
        });
      } catch (e) { /* listener is a nicety */ }
    }

    const A = plugin("App");
    if (A) {
      try {
        A.addListener("appStateChange", st => {
          if (st && st.isActive) rescheduleNotifications();
        });
        A.addListener("appUrlOpen", ev => importFile(ev && ev.url));
        const launch = await A.getLaunchUrl();
        if (launch && launch.url) importFile(launch.url);
      } catch (e) { /* app events are optional */ }
    }

    rescheduleNotifications();
  }

  return {
    isNative,
    boot,
    getApiKey, setApiKey, hasApiKey,
    haptic,
    rescheduleNotifications, enableNotifications, pendingCount,
    importFile,
  };
})();
