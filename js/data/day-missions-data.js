/* ============================================================
   day-missions-data.js — the daylight mission pool.

   These are normal quest objects. They merge into QuestData.quests,
   so they log reps, pay skill XP, land in questLog, evolve Neons and
   earn badges through the paths that already exist — no parallel
   system, no second done-list.

   What makes them day missions is three extra fields:
     when : "day"   — never rolled into a night lane, never gated
     tier : 0-3     — 0 = rescue (served only by 🛟 Smaller, never rolled)
     ctx  : a label a HUMAN reads (queue, cafe, gym…). Not a sensor.

   XP comes from the shared LiveEngine ladder, so a tier-2 rep pays the
   same at 2pm as it does at 2am.

   Copy rules: card `desc` stays ≤ 20 words, `how` steps ≤ 20 words each,
   compliments target CHOICES and never bodies, and exit cues are
   respected — `day-clean-exit` makes leaving well its own rep.
   Every mission fits inside a normal errand. None needs a venue, a
   drink, or an evening.
   ============================================================ */

var DayMissions = (() => {

  const quests = [

    /* ---------- tier 0 — rescues. Never rolled; 🛟 Smaller serves these. ---------- */
    {
      id: "day-r-eyes", name: "Eye, Smile, Away", icon: "🛟",
      tier: 0, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Day",
      desc: "Make eye contact with one person, smile, look away. That's the whole rep.",
      terms: ["lingo-savor-smile"],
      how: [
        "Pick anyone in your eyeline — staff, a passerby, someone in line.",
        "Meet their eyes for about a second, then let the smile build slowly.",
        "Look away first. No words needed. Rep logged.",
      ],
    },
    {
      id: "day-r-thanks", name: "Full-Sentence Thanks", icon: "🛟",
      tier: 0, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cues-vocal", source: "Day",
      desc: "Thank one worker with your eyes up and a full sentence.",
      how: [
        "Wait until you can actually catch their eye — not mid-transaction.",
        "Say a whole sentence, not a mumbled thanks at the counter.",
        "Let your voice drop at the end instead of rising.",
      ],
      examples: ["Thanks — I appreciate you."],
    },
    {
      id: "day-r-front", name: "Point Yourself", icon: "🛟",
      tier: 0, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Day",
      desc: "Point your feet and shoulders at the next person who talks to you.",
      terms: ["lingo-fronting"],
      how: [
        "Next time someone speaks to you, swivel your whole body, not your neck.",
        "Three T's: toes, torso, top. All three aimed at them.",
        "Hold it for the length of the exchange. That's it.",
      ],
    },
    {
      id: "day-r-hey", name: "One-Word Hey", icon: "🛟",
      tier: 0, ctx: "street", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Day",
      desc: "Say hey to the next person who passes close. One word counts.",
      how: [
        "Walking anywhere today, pick the next person who passes within arm's reach.",
        "Catch their eye a beat early so the word isn't a surprise.",
        "One word. \"Hey.\" Keep walking. Done.",
      ],
      examples: ["Hey."],
    },

    /* ---------- tier 1 — people already next to you ---------- */
    {
      id: "day-queue-wait", name: "Line Buddy", icon: "🧍",
      tier: 1, ctx: "queue", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-spark", source: "Day",
      desc: "Say one line about the wait to whoever is behind you.",
      tip: "Shared situation, zero risk: you are both already stuck in the same thing.",
      how: [
        "Wait until you have been standing a minute — shared time makes it natural.",
        "Turn halfway, not fully, and comment on the situation you both share.",
        "If they answer, ask one follow-up. If not, you still got the rep.",
      ],
      examples: [
        "Is this line always like this, or did we pick the worst time?",
        "I keep thinking it's about to move. It is not about to move.",
      ],
    },
    {
      id: "day-cafe-pick", name: "Barista's Pick", icon: "☕",
      tier: 1, ctx: "cafe", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-spark", source: "Day",
      desc: "Ask the barista what they'd actually order here — then order it.",
      terms: ["lingo-sparker"],
      how: [
        "Skip \"what's good?\" — ask what THEY drink, which is a real question.",
        "Actually order their answer. Following the recommendation is the warm part.",
        "Tell them how it was if you are still there.",
      ],
      examples: [
        "What do you drink when nobody's watching?",
        "If you had to pick one thing on this board, what is it?",
      ],
    },
    {
      id: "day-store-rec", name: "Ask a Shopper", icon: "🛒",
      tier: 1, ctx: "store", when: "day", type: "do", minLevel: 1,
      axis: "comp", skill: "cap-intrigue", source: "Day",
      desc: "Ask another shopper — not staff — which one they'd pick.",
      tip: "Staff are paid to answer. A stranger answering is a real conversation starting.",
      how: [
        "Find someone in the same aisle looking at the same kind of thing.",
        "Ask for a real opinion between two options, not a yes-or-no question.",
        "Thank them by name of the thing they picked — it shows you listened.",
      ],
      examples: [
        "You look like you've done this before — which of these is good?",
        "Genuine question: this one or that one?",
      ],
    },
    {
      id: "day-gym-sets", name: "How Many Left", icon: "🏋️",
      tier: 1, ctx: "gym", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-spark", source: "Day",
      desc: "Ask whoever's near your machine how many sets they have left.",
      tip: "It is the one question everyone in a gym already expects. Free reps.",
      how: [
        "Wait for them to finish a set — never talk to someone mid-lift.",
        "Ask how many they have left, and mean it: no rush in your voice.",
        "If they open up, stay one more exchange before you move on.",
      ],
      examples: [
        "How many you got left? No rush.",
        "You almost done, or should I loop back?",
      ],
    },
    {
      id: "day-choice-compliment", name: "Compliment the Choice", icon: "✨",
      tier: 1, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-highlight", source: "Day",
      desc: "Compliment something someone chose — bag, sneakers, order. Never their body.",
      terms: ["lingo-highlighter"],
      tip: "A choice is something they did. A body is something they have. Only one is a compliment.",
      how: [
        "Look for a decision: a jacket, a book, a drink order, a phone case.",
        "Name the specific thing, not a vague nice-outfit blur.",
        "Add a question so it opens a door instead of closing one.",
      ],
      examples: [
        "That jacket's great — where'd you find it?",
        "Good call on that order. Is it as good as it looks?",
      ],
    },
    {
      id: "day-worker-specific", name: "Name What They Did", icon: "⭐",
      tier: 1, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-highlight", source: "Day",
      desc: "Give one worker a specific thank-you that names what they actually did.",
      terms: ["lingo-gold-star"],
      how: [
        "Watch for the thing worth naming — speed, patience, a save under pressure.",
        "Say the specific thing back to them. Specific is what makes it land.",
        "Stop there. Do not tack a request onto the end of it.",
      ],
      examples: [
        "You cleared that line without breaking a sweat. Genuinely impressive.",
        "You've been the calmest person in this building all morning.",
      ],
    },
    {
      id: "day-transit-line", name: "Same Ride", icon: "🚏",
      tier: 1, ctx: "transit", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-spark", source: "Day",
      desc: "Say one situational line to whoever is waiting for the same ride.",
      how: [
        "Pick the person also watching the same board, sign, or corner.",
        "Open on the shared situation — never on them personally.",
        "Let it end whenever it ends. Waiting-room talk is allowed to be short.",
      ],
      examples: [
        "Any idea if this one's late, or are we both guessing?",
        "We're both staring at the same sign hoping it changes, huh?",
      ],
    },
    {
      id: "day-listen-sounds", name: "Three Listening Sounds", icon: "👂",
      tier: 1, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cues-vocal", source: "Day",
      desc: "Use three listening sounds in one daytime conversation. Watch them keep going.",
      tip: "mmm · uh-huh · go on · tell me more. Small sounds, big signal.",
      how: [
        "Pick any conversation today where the other person is doing the talking.",
        "Drop a short sound at each natural pause instead of jumping in.",
        "Count three. Notice how much longer they keep going.",
      ],
      examples: ["Mmm.", "Go on.", "Wait, tell me more about that."],
    },
    {
      id: "day-eyebrow-three", name: "Eyebrow Flash ×3", icon: "🤨",
      tier: 1, ctx: "street", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Day",
      desc: "Eyebrow flash and a hey for three people you pass today.",
      terms: ["lingo-eyebrow-flash"],
      how: [
        "Raise the brows — the brows only, not the eyelids — for under a second.",
        "Follow the flash with the word. Brows first, hey second.",
        "Three separate people. Different places if you can.",
      ],
      examples: ["Hey.", "Morning."],
    },
    {
      id: "day-clean-exit", name: "The Clean Exit", icon: "🚪",
      tier: 1, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-engage", source: "Day",
      desc: "Read one exit cue and close warmly first. Leaving well is the rep.",
      terms: ["lingo-distancing", "lingo-fronting"],
      tip: "Toes toward the door, a half-step back, a phone check — that is your cue, not a rejection.",
      how: [
        "Watch their feet and shoulders. Angled away means the window is closing.",
        "Beat them to it: name the exit yourself, warmly, before it gets awkward.",
        "Leave one specific good thing behind. That is what they remember.",
      ],
      examples: [
        "I'll let you get back to it — good talking to you.",
        "I'm going to let you go. Glad I asked about that.",
      ],
    },

    /* ---------- tier 2 — start it yourself ---------- */
    {
      id: "day-sparker", name: "Daylight Sparker", icon: "⚡",
      tier: 2, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-spark", source: "Day",
      desc: "Ask one stranger the highlight of their day instead of how they are.",
      terms: ["lingo-sparker", "lingo-big-talk"],
      how: [
        "Find a moment with a natural pause — a counter, a queue, a waiting room.",
        "Replace the autopilot question with one that asks for a real memory.",
        "Then shut up and let them dig for the answer. The digging is the point.",
      ],
      examples: [
        "Best thing that's happened to you today — go.",
        "What's been the highlight of your week so far?",
      ],
    },
    {
      id: "day-thread-two", name: "Two Threads", icon: "🧵",
      tier: 2, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "comp", skill: "cap-intrigue", source: "Day",
      desc: "Find two things in common inside one daytime conversation.",
      terms: ["lingo-thread-theory"],
      tip: "Hunt three lanes: people you both know, context you both share, interests you both have.",
      how: [
        "Listen for anything you can honestly claim — a place, a job, a hobby.",
        "When you hit one, say it out loud and pull on it before moving on.",
        "Two is the target. Faked ones do not count and always show.",
      ],
      examples: [
        "Wait, you're from there too? Okay, then you know the exact spot I mean.",
        "That's twice now we've landed on the same thing.",
      ],
    },
    {
      id: "day-get-name", name: "Get the Name", icon: "📛",
      tier: 2, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-connect", source: "Day",
      desc: "Get one stranger's name and use it out loud before you leave.",
      terms: ["lingo-name-game"],
      how: [
        "Offer yours first — it makes the ask an exchange instead of a demand.",
        "Repeat it back the second you hear it. That is the whole memory trick.",
        "Use it once more on the way out. Names land hardest at goodbye.",
      ],
      examples: [
        "I'm Preston, by the way — what's your name?",
        "Good talking to you, Sam.",
      ],
    },
    {
      id: "day-rec-riff", name: "Rec and Riff", icon: "🍜",
      tier: 2, ctx: "store/cafe", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-intrigue", source: "Day",
      desc: "Ask for a recommendation, then stay and riff on the answer.",
      terms: ["lingo-thread-theory"],
      tip: "Most people ask, get an answer, and leave. Staying is the entire mission.",
      how: [
        "Ask for a real recommendation — one you would actually act on.",
        "Do not fire a second question. React to the answer they gave you.",
        "Trade something back: your own pick, your own bad experience, anything.",
      ],
      examples: [
        "Okay, what should I get if I'm only doing this once?",
        "See, that's not what I expected you to say.",
      ],
    },
    {
      id: "day-hobby-open", name: "Open on What They're Doing", icon: "🐕",
      tier: 2, ctx: "park", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-spark", source: "Day",
      desc: "Open on what someone is doing — dog, camera, book, board.",
      terms: ["lingo-hot-button"],
      tip: "Whatever they brought with them is the thing they will happily talk about.",
      how: [
        "Scan for the object: the dog, the camera, the sketchbook, the skateboard.",
        "Ask about the object, not about them. Objects are safe doors.",
        "Watch their face light up — that lit-up topic is where you stay.",
      ],
      examples: [
        "Okay, I have to ask — what breed is that?",
        "That's a serious camera. What are you shooting?",
      ],
    },
    {
      id: "day-common-room", name: "Take the Table", icon: "📚",
      tier: 2, ctx: "campus", when: "day", type: "do", minLevel: 1,
      axis: "comp", skill: "cap-control", source: "Day",
      desc: "Sit near people in a common area and open with a context line.",
      terms: ["lingo-space-zones"],
      tip: "Close enough to talk, far enough not to loom — about an arm and a half.",
      how: [
        "Choose the shared table over the empty corner. Proximity does half the work.",
        "Settle in first. Opening the second you sit down reads as a plan.",
        "Open on the room you are both in, then ask what they are working on.",
      ],
      examples: [
        "Is this table taken?",
        "What are you working on? I need something to procrastinate with.",
      ],
    },
    {
      id: "day-mirror-words", name: "Mirror Their Words", icon: "🪩",
      tier: 2, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cues-verbal", source: "Day",
      desc: "Reuse three of their exact words back to them in one conversation.",
      terms: ["lingo-mirroring"],
      tip: "Match their nouns. Truck stays truck, never rig. Client stays client, never customer.",
      how: [
        "Catch the specific words they choose for their own things.",
        "Use their word, not your synonym, when you say it back.",
        "Three across one conversation. Subtle beats obvious every time.",
      ],
      examples: [
        "So the spot you mentioned — is that the same spot from last summer?",
      ],
    },

    /* ---------- tier 3 — bigger daylight swings ---------- */
    {
      id: "day-three-min", name: "Three Minutes", icon: "⏱️",
      tier: 3, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-connect", source: "Day",
      desc: "Start a conversation with a stranger and keep it alive three minutes.",
      terms: ["lingo-boomerang", "lingo-story-stack"],
      tip: "Three minutes is where question-asking runs out and trading starts.",
      how: [
        "Open on anything situational. The opener is not the hard part.",
        "When they state a fact, trade a short story back instead of another question.",
        "Close your story with a question that hands it back to them.",
      ],
      examples: [
        "Okay, that reminds me of the one time I tried that — it went badly.",
        "Have you ever had that happen to you?",
      ],
    },
    {
      id: "day-gym-workin", name: "Work In", icon: "💪",
      tier: 3, ctx: "gym", when: "day", type: "do", minLevel: 1,
      axis: "comp", skill: "cap-capture", source: "Day",
      desc: "Ask to work in, or ask someone to watch one set of form.",
      terms: ["lingo-franklin-effect"],
      tip: "Asking a small favour makes people like you more, not less. Use it.",
      how: [
        "Pick someone between sets who looks like they know the machine.",
        "Ask clearly and give them the out: how long you need, when you are gone.",
        "Thank them specifically afterward, then let them get back to it.",
      ],
      examples: [
        "Mind if I work in? Two sets and I'm out of your way.",
        "Can you watch one set and tell me if my back's rounding?",
      ],
    },
    {
      id: "day-intro-two", name: "Daylight Introduction", icon: "📣",
      tier: 3, ctx: "campus", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-highlight", source: "Day",
      desc: "Introduce two daytime people to each other with one highlight each.",
      terms: ["lingo-raving-intro"],
      how: [
        "Name plus rave plus tee-up. Never a generic this-is-so-and-so.",
        "Give each person one specific, true thing about the other.",
        "Hand them a shared topic, then step back and let them run.",
      ],
      examples: [
        "You two should meet — she just moved here, he knows every coffee spot.",
      ],
    },
    {
      id: "day-pair-open", name: "Open the Pair", icon: "👥",
      tier: 3, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "comp", skill: "cap-capture", source: "Day",
      desc: "Open a pair or small group instead of one person alone.",
      tip: "Aim the first line at the space between them, not at one face.",
      how: [
        "Stand at the open side of the group, never behind someone's shoulder.",
        "Aim the opener at all of them so nobody has to volunteer to answer.",
        "Once someone bites, spread your eye contact around the whole group.",
      ],
      examples: [
        "Settle something for me — you two look like you'd know.",
        "Okay, group opinion needed.",
      ],
    },
    {
      id: "day-tie-offer", name: "The Daylight Tie", icon: "🎗️",
      tier: 3, ctx: "any", when: "day", type: "do", minLevel: 1,
      axis: "warm", skill: "cap-engage", source: "Day",
      desc: "Close a daytime conversation by offering something real — then deliver it.",
      tip: "Only offer what you can actually deliver. Delivery is what turns a chat into a tie.",
      how: [
        "Listen for something they genuinely need — a spot, a name, a link.",
        "Offer it once, plainly, at the natural end of the conversation.",
        "Then actually send it. Same day. That part is the whole mission.",
      ],
      examples: [
        "Can I help you with anything? I know a spot for that.",
        "I'll write down the place I mentioned before I forget.",
      ],
    },
  ];

  // One ladder, shared with Night Mode: 8 / 15 / 25 / 40.
  for (const q of quests) q.xp = LiveEngine.TIER_XP[q.tier];

  return { quests };
})();
