/* ============================================================
   quests-data.js — merged quest pool + badge catalog
   Quests themselves live in the two book content files;
   this file merges them and defines badges.
   ============================================================ */

const QuestData = {
  get quests() {
    return CaptivateContent.quests.concat(CuesContent.quests, DayMissions.quests);
  },

  badges: [
    { id: "first-quest",    icon: "🥇", name: "First Steps",      desc: "Complete your first quest." },
    { id: "quest-10",       icon: "⚔️", name: "Quest Veteran",    desc: "Complete 10 quests." },
    { id: "quest-50",       icon: "🏰", name: "Quest Legend",     desc: "Complete 50 quests." },
    { id: "streak-3",       icon: "🔥", name: "Warming Up",       desc: "3-day practice streak." },
    { id: "streak-7",       icon: "🌋", name: "On Fire",          desc: "7-day practice streak." },
    { id: "clean-sweep",    icon: "🧹", name: "Clean Sweep",      desc: "Finish all 3 daily quests in one day." },
    { id: "boss-slayer",    icon: "🐉", name: "Boss Slayer",      desc: "Beat a weekly boss challenge." },
    { id: "perfect-quiz",   icon: "💯", name: "Perfect Recall",   desc: "Score 100% on a quiz deck." },
    { id: "first-analysis", icon: "🎙️", name: "On the Record",    desc: "Analyze your first conversation transcript." },
    { id: "night-first",    icon: "🌙", name: "First Shift",      desc: "Complete an action in Night Mode." },
    { id: "night-combo5",   icon: "⚡", name: "On a Heater",      desc: "Chain a ×5 combo in one night." },
    { id: "night-ten",      icon: "🎆", name: "Life of the Party", desc: "10 actions in a single shift." },
    { id: "called-shot",    icon: "🎯", name: "Called My Shot",   desc: "Hit a night goal before its deadline." },
    { id: "day-first",      icon: "☀️", name: "Daylight",         desc: "Complete your first day mission." },
    { id: "day-ten",        icon: "🌞", name: "Broad Daylight",   desc: "Complete 10 day missions." },
    { id: "day-three-min",  icon: "⏱️", name: "Three Minutes",    desc: "Keep a stranger talking for three minutes." },
    { id: "round-clock",    icon: "🌗", name: "Round the Clock",  desc: "A day mission and a night action, same day." },
  ],
};
