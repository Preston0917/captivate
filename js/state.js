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
    settings: { apiKey: "", model: "claude-opus-5" },
  });

  let s = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      return Object.assign(defaults(), JSON.parse(raw));
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

  // ---------- streak ----------
  function touchStreak() {
    const today = todayKey();
    if (s.lastActiveDay === today) return;
    const yesterday = (() => {
      const d = new Date(Date.now() - 86400000);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();
    s.streak = s.lastActiveDay === yesterday ? s.streak + 1 : 1;
    s.lastActiveDay = today;
    save();
  }

  // ---------- XP / levels ----------
  function addXp(amount, skillId) {
    touchStreak();
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
    save, todayKey, weekKey, seededRandom,
    addXp, xpForLevel, levelTitle, touchStreak, awardBadge,
    reset() { s = defaults(); save(); },
  };
})();
