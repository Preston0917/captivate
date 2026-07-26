/* ============================================================
   quests-data.js — merged quest pool + badge catalog
   Quests themselves live in the two book content files;
   this file merges them and defines badges.
   ============================================================ */

const QuestData = {
  get quests() {
    return CaptivateContent.quests.concat(CuesContent.quests);
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
  ],
};
