/* ============================================================
   state.js — persistence, XP/levels, streaks, badges
   All data lives in localStorage under one key.
   ============================================================ */

const Store = (() => {
  const KEY = "captivate.save.v1";

  const LEVEL_TITLES = [
    "Wallflower",        // 1
    "Observer",          // 2
    "Icebreaker",        // 3
    "Spark",             // 4
    "Conversationalist", // 5
    "Storyteller",       // 6
    "Cue Detective",     // 7
    "Connector",         // 8
    "Highlighter",       // 9
    "Charisma Adept",    // 10
    "People Whisperer",  // 11
    "Room Reader",       // 12
    "Magnetic",          // 13
    "Captivator",        // 14
    "Legend of the Room" // 15+
  ];

  // XP needed to go from level N to N+1
  function xpForLevel(level) {
    return 80 + (level - 1) * 45;
  }

  const defaults = () => ({
    xp: 0,
    level: 1,
    totalXp: 0,
    streak: 0,
    bestStreak: 0,             // never decreases, survives any lapse
    freezes: 2,                // streak freezes: auto-granted, never bought
    lastRepDay: null,          // "YYYY-MM-DD" of last REAL-WORLD rep
    lastActiveDay: null,       // "YYYY-MM-DD"
    questLog: {},              // questId -> { completedAt, day }
    dailyQuests: { day: null, ids: [], done: [] },
    weeklyBoss: { week: null, id: null, done: false },
    tallies: {},               // questId -> current count
    quizStats: {},             // deckId -> { attempts, best, lastScore }
    skillXp: {},               // skillId -> xp earned toward that skill
    badges: [],                // badgeId[]
    analyses: [],              // saved transcript analysis summaries (small)
    customQuests: [],          // user-authored quests
    settings: {
      apiKey: "",                 // web only — the iOS wrap keeps it in the Keychain
      model: "claude-opus-5",
      // Native reminders (ignored on web, where nothing can schedule them)
      notifs: { enabled: false, questHour: "10:00", streakHour: "20:30" },
      // Night Mode remembers its cadence so starting a shift costs zero choices.
      // day/shifts count the shifts started today — the setlist seed uses it.
      night: { interval: 12, level: 2, day: null, shifts: 0 },
    },
  });

  let s = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const d = defaults();
      if (!raw) return d;
      const defSettings = d.settings;                       // grabbed before the shallow merge
      const loaded = Object.assign(d, JSON.parse(raw));
      // Object.assign is shallow: re-merge nested settings so new keys get defaults
      loaded.settings = Object.assign({}, defSettings, loaded.settings || {});
      loaded.settings.notifs = Object.assign({}, defSettings.notifs, loaded.settings.notifs || {});
      loaded.settings.night = Object.assign({}, defSettings.night, loaded.settings.night || {});
      // Migration for saves from before the rep-streak rework
      if (loaded.bestStreak < loaded.streak) loaded.bestStreak = loaded.streak;
      if (!loaded.lastRepDay && loaded.lastActiveDay) loaded.lastRepDay = loaded.lastActiveDay;
      return loaded;
    } catch (e) {
      console.warn("save corrupted, starting fresh", e);
      return defaults();
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  // ---------- time helpers ----------
  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function weekKey() {
    // ISO-ish week key: year + week number
    const d = new Date();
    const jan1 = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
  }

  // Deterministic PRNG seeded by a string (so daily quests are stable all day)
  function seededRandom(seedStr) {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }

  // ---------- rep streak ----------
  // The 🔥 streak counts days with at least one REAL-WORLD rep (quest done,
  // night action, goal check-in, Neon catch, Fade rung, gym part) — never
  // app opens or in-app study. Missed days are covered silently by freezes.
  function daysSince(dayKey) {
    if (!dayKey) return Infinity;
    return Math.round((Date.parse(todayKey()) - Date.parse(dayKey)) / 86400000);
  }

  function logRep() {
    const today = todayKey();
    if (s.lastRepDay === today) return { counted: false, frozeUsed: 0 };
    let frozeUsed = 0;
    const gap = daysSince(s.lastRepDay);
    if (!s.lastRepDay) {
      s.streak = 1;
    } else if (gap === 1) {
      s.streak += 1;
    } else if (gap - 1 <= s.freezes) {
      // freezes silently cover the missed days; the chain holds
      frozeUsed = gap - 1;
      s.freezes -= frozeUsed;
      s.streak += 1;
    } else {
      s.streak = 1;
    }
    s.lastRepDay = today;
    s.lastActiveDay = today;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
    // earn a freeze back every 5-day stretch, capped at 3 — granted, never bought
    if (s.streak % 5 === 0) s.freezes = Math.min(3, s.freezes + 1);
    save();
    // Today's nudges are pointless now that a rep is in (no-op on web).
    // `const Native` is a script global, not a window property — check by name.
    if (typeof Native !== "undefined") Native.rescheduleNotifications();
    return { counted: true, frozeUsed };
  }

  // ---------- XP / levels ----------
  function addXp(amount, skillId) {
    s.xp += amount;
    s.totalXp += amount;
    if (skillId) s.skillXp[skillId] = (s.skillXp[skillId] || 0) + amount;

    let leveled = false;
    while (s.xp >= xpForLevel(s.level)) {
      s.xp -= xpForLevel(s.level);
      s.level += 1;
      leveled = true;
    }
    save();
    return leveled;
  }

  function levelTitle(level) {
    return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  }

  // ---------- badges ----------
  function awardBadge(id) {
    if (s.badges.includes(id)) return false;
    s.badges.push(id);
    save();
    return true;
  }

  return {
    get state() { return s; },
    save, todayKey, weekKey, seededRandom, daysSince,
    addXp, xpForLevel, levelTitle, logRep, awardBadge,
    reset() { s = defaults(); save(); },
  };
})();
