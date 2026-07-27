// lingo-data.js — plain-English glossary for the book lingo used across the app.
// For players who have NOT read "Captivate" or "Cues": every coined term, technique
// name, and framework, defined like a friend would explain it — plus quiz decks and
// flashcards that drill the vocabulary itself. Plain script, defines one global.

var LingoContent = {

  // ==========================================================================
  // TERMS — the dictionary
  // ==========================================================================
  terms: [

    // ------------------------- Captivate lingo -------------------------
    {
      id: "lingo-sparker",
      term: "Conversation Sparker",
      emoji: "⚡",
      book: "Captivate",
      def: "A novelty question you use instead of the tired autopilot scripts (\"how are you?\", \"what do you do?\"). Sparkers trigger a real memory or a proud topic, which makes the conversation pleasurable — and pleasurable means memorable.",
      example: "Instead of asking a guest \"how's it going?\", try \"what's been the highlight of your night so far?\" — you'll get a story instead of a shrug.",
      related: ["lingo-big-talk", "lingo-hot-button"]
    },
    {
      id: "lingo-big-talk",
      term: "Big Talk",
      emoji: "🎢",
      book: "Captivate",
      def: "The opposite of small talk: conversation with actual peaks — stories, passions, surprises — that gives people a little dopamine hit and makes you the person they remember. The book's image: small talk is the kiddie ride, Big Talk is Space Mountain.",
      example: "Skipping \"busy week?\" with a bar regular and instead asking what trip they're planning next takes the same thirty seconds but leaves a totally different impression.",
      related: ["lingo-sparker", "lingo-boomerang"]
    },
    {
      id: "lingo-hot-button",
      term: "Hot Button",
      emoji: "🔥",
      book: "Captivate",
      def: "A topic or hobby that visibly lights a person up. You know you've hit one when they lean in, answer longer, raise their eyebrows, gesture bigger, or say \"tell me more.\"",
      example: "You mention sneakers and the quiet guy at the table suddenly comes alive — that's his hot button. Stay on it and dig for the backstory.",
      related: ["lingo-sparker", "lingo-eyebrow-flash"]
    },
    {
      id: "lingo-thread-theory",
      term: "Thread Theory",
      emoji: "🧵",
      book: "Captivate",
      def: "The likability strategy of hunting for shared threads — \"me too!\" moments — in three categories: People (mutual contacts), Context (the situation you're both in), and Interests (the richest kind). The more genuine threads you share, the more someone likes you.",
      example: "Three minutes into meeting a new group at your table: you both know the DJ (people), you're both from out of town (context), you both ride motorcycles (interests). That group is now yours for the night.",
      related: ["lingo-not-me-trap", "lingo-five-whys"]
    },
    {
      id: "lingo-five-whys",
      term: "The Five Whys",
      emoji: "❓",
      book: "Captivate",
      def: "Once you find a shared thread, follow it with successive \"why\"-style questions — a trick borrowed from Toyota's root-cause method. A few whys take you from surface facts to motivations and dreams, where real connection lives.",
      example: "\"You promote too? Why'd you get into it?\" → \"Why that city?\" → \"Why leave the day job?\" — three questions in, you're talking about their actual life, not their business card.",
      related: ["lingo-thread-theory"]
    },
    {
      id: "lingo-not-me-trap",
      term: "The \"Not Me!\" Trap",
      emoji: "🙅",
      book: "Captivate",
      def: "Announcing a mismatch (\"I never watch sports,\" \"not my kind of music\") — which slams a conversational door for no reason. If a thread misses, don't declare it: quietly pivot to the next one, or make curiosity the thread with \"teach me?\"",
      example: "A guest raves about a band you've never heard of. Saying \"never heard of them\" kills it; saying \"okay, sell me — what's their best song?\" keeps the thread alive.",
      related: ["lingo-thread-theory"]
    },
    {
      id: "lingo-highlighter",
      term: "Highlighter",
      emoji: "🖍️",
      book: "Captivate",
      def: "The listening strategy of bringing out the best in people — catching what's genuinely impressive about someone and honoring it out loud, like running a highlighter over their strengths. You become the highlight of the room by making others feel like it.",
      example: "\"You're the reason this table has been fun all night\" said to the friend who's been hyping everyone — she'll remember you as the best part of her night.",
      related: ["lingo-gold-star", "lingo-raving-intro"]
    },
    {
      id: "lingo-gold-star",
      term: "Emotional Gold Star",
      emoji: "⭐",
      book: "Captivate",
      def: "A specific positive label you hand someone (\"you know everyone — you're a natural connector\"). Labels shape behavior: great expectations produce greatness (the Pygmalion effect), and low expectations produce the opposite (the golem effect) — so hand out the good ones.",
      example: "Telling your busser \"you're the fastest reset guy in this building\" costs nothing — and watch how he works the rest of the shift.",
      related: ["lingo-highlighter"]
    },
    {
      id: "lingo-raving-intro",
      term: "Raving Introduction",
      emoji: "📣",
      book: "Captivate",
      def: "Never introduce people generically. The formula: name + genuine rave + conversation tee-up. It plants a positive label, hands both people a topic, and gets them talking — a triple win.",
      example: "\"Maya, meet Jordan — he throws the best rooftop parties in the city, his last one sold out in a day.\" Now they have a conversation and you're the connector.",
      related: ["lingo-highlighter", "lingo-gold-star"]
    },
    {
      id: "lingo-triple-threat",
      term: "The Triple Threat",
      emoji: "🤝",
      book: "Captivate",
      def: "The three-part nonverbal first impression: visible hands, winner posture, and steady eye contact. It answers the three questions people subconsciously ask in the first seconds: friend or foe? winner or loser? ally or enemy?",
      example: "Walking the floor: hands out of your pockets, shoulders back, meeting guests' eyes — you've answered all three questions before saying a word.",
      related: ["lingo-launch-stance", "lingo-thin-slicing"]
    },
    {
      id: "lingo-launch-stance",
      term: "Launch Stance",
      emoji: "🧍",
      book: "Captivate",
      def: "The toned-down power pose for real life: shoulders down and back, chin and chest level or slightly up, space between arms and torso, hands visible. The anti-version is the phone slump — head bowed, arms pinned — which reads as loser posture by accident.",
      example: "Before walking a group to their table, take two seconds at the host stand: shoulders back, chin level, phone away. You look like the person in charge — because you are.",
      related: ["lingo-triple-threat", "lingo-expansion"]
    },
    {
      id: "lingo-thin-slicing",
      term: "Thin-Slicing",
      emoji: "⏱️",
      book: "Captivate",
      def: "The research finding that people form accurate-feeling judgments of you from tiny slices of behavior — about two seconds — and rarely revise them. It's why the first nonverbal moments matter more than your opening line.",
      example: "A guest has decided how they feel about you before you finish \"welcome in\" — so the posture and smile you walk up with ARE the first impression.",
      related: ["lingo-triple-threat"]
    },
    {
      id: "lingo-event-zones",
      term: "Start / Side / Social Zones",
      emoji: "🗺️",
      book: "Captivate",
      def: "The map of any event. The Start Zone (entrance, check-in) is where anxiety peaks — never work it. The Side Zones are the traps: hovering near the bathroom, camping the food table, clinging to people you already know. The Social Zone is where the connecting happens.",
      example: "At an industry mixer, skip the badge table crowd, don't post by the buffet, and head for where relaxed people with drinks are actually mingling.",
      related: ["lingo-sweet-spot"]
    },
    {
      id: "lingo-sweet-spot",
      term: "Social Sweet Spot",
      emoji: "🎯",
      book: "Captivate",
      def: "The highest-connection positions in a room: the two ends of the bar (you catch people with a fresh drink, anxiety spent, ready to talk) and the host's orbit (thank the host, ask who you should meet, stay in their line of sight for bonus intros).",
      example: "Working the end of the bar with \"how's the wine tonight?\" beats prowling the entrance all night — people arrive at YOU, already relaxed.",
      related: ["lingo-event-zones"]
    },
    {
      id: "lingo-thrive-survive",
      term: "Thrive / Survive Locations",
      emoji: "🌗",
      book: "Captivate",
      def: "Sorting social settings into places you genuinely shine (thrive), places that drain or dread you (survive), and everything in between (neutral). The rule: practice new social skills only in thrive locations, and give yourself permission to decline survive-location invites.",
      example: "You're electric on the floor of your own venue but miserable at seated networking dinners — so book the meetings at your club, and skip the dinners guilt-free.",
      related: ["lingo-event-zones"]
    },
    {
      id: "lingo-grazer",
      term: "The Grazer",
      emoji: "🍢",
      book: "Captivate",
      def: "The buffet strategy for pacing social energy: instead of one heaping plate, make multiple small trips. Each trip is a legitimate exit ramp from a conversation and a built-in reset between quality one-on-ones.",
      example: "At a promo brunch, the appetizer run, the main run, and the dessert run give you three graceful ways to rotate between groups without ghosting anyone.",
      related: ["lingo-event-zones"]
    },
    {
      id: "lingo-winger",
      term: "The Winger",
      emoji: "🪽",
      book: "Captivate",
      def: "Your wing-person — the recurring name when you ask yourself who you love spending time with, who makes you laugh, who makes you your best self. The Winger joins your social adventures and practices new skills with you.",
      example: "The friend you bring to every launch party who makes working the room feel like a game instead of a chore — that's your Winger.",
      related: ["lingo-riser"]
    },
    {
      id: "lingo-riser",
      term: "The Riser",
      emoji: "🚀",
      book: "Captivate",
      def: "The one relationship you deliberately want to level up — a colleague, a new friend, a career-changing contact. You apply the book's techniques to the Riser on purpose, instead of leaving the relationship to chance.",
      example: "The venue owner who could change your whole year: decode what they value, feed it once a week, and watch the relationship compound.",
      related: ["lingo-winger", "lingo-primary-value"]
    },
    {
      id: "lingo-name-game",
      term: "The Name Game",
      emoji: "📛",
      book: "Captivate",
      def: "The three-step name-memory trick: (1) Meet & Repeat — say the name back out loud immediately; (2) Spell It Out — mentally spell or picture it; (3) Associate & Anchor — tie it to someone you already know with that name.",
      example: "\"Nice to meet you, Sasha\" (repeat), S-A-S-H-A (spell), anchor to the Sasha who used to bartend Fridays — you'll still have it at last call.",
      related: []
    },
    {
      id: "lingo-franken-people",
      term: "Franken-People",
      emoji: "🧟",
      book: "Captivate",
      def: "What you become when you try to build yourself out of stitched-together copies of other people's charm — borrowed lines, faked extroversion, someone else's persona. It reads as fake, and \"people who are fake\" is the single most annoying people-habit in the book's survey.",
      example: "Copying another promoter's loud alpha act when you're naturally a one-on-one guy makes you a Franken-promoter — guests smell it. Optimize the real you instead.",
      related: ["lingo-thrive-survive"]
    },
    {
      id: "lingo-microexpression",
      term: "Microexpression",
      emoji: "🎭",
      book: "Captivate",
      def: "An involuntary facial flash lasting under one second — too fast to fake, which makes it honest. There are seven universal ones: anger, contempt, happiness, fear, surprise, disgust, and sadness, each with distinct facial markers.",
      example: "A guest says the table location is \"fine\" but a sub-second one-sided smirk flashes first — the flash is the truth, the word is the cover.",
      related: ["lingo-congruency", "lingo-squelching"]
    },
    {
      id: "lingo-congruency",
      term: "Congruency",
      emoji: "⚖️",
      book: "Captivate",
      def: "Whether someone's words match their face and body. When they agree, trust the message; when they clash (\"I'm fine\" plus an anger flash), trust the face — the involuntary signal is the honest one.",
      example: "The birthday girl says everything's great but her face leaks sadness every time the bill comes up. Don't ignore it — quietly check if something's wrong with the tab.",
      related: ["lingo-microexpression", "lingo-cue-cluster"]
    },
    {
      id: "lingo-squelching",
      term: "Squelching",
      emoji: "😬",
      book: "Captivate",
      def: "The mashed-up face someone makes while actively suppressing a microexpression. It means a feeling is being hidden — embarrassment, a reaction they don't want you to see, possibly a lie — and it's a signal to dig deeper, gently.",
      example: "You quote the bottle minimum and his face does a weird half-swallowed scrunch before he says \"no problem\" — that's a squelch. Give him a graceful out or a cheaper option.",
      related: ["lingo-microexpression", "lingo-shame-cue"]
    },
    {
      id: "lingo-punctuator",
      term: "Punctuator",
      emoji: "❗",
      book: "Captivate",
      def: "A habitual gesture or expression a person uses just to accent their speech — with no emotional meaning behind it. If a cue shows up at random moments regardless of topic, it's a punctuator (a habit), not a feeling.",
      example: "Your barback flares his nostrils constantly, on every topic — that's his punctuator, not anger. But if a cue appears ONLY when one topic comes up, that's real signal.",
      related: ["lingo-baseline", "lingo-cue-cluster"]
    },
    {
      id: "lingo-speed-read",
      term: "Speed-Read",
      emoji: "🔍",
      book: "Captivate",
      def: "Decoding someone's five personality traits from questions, behavior, and environment instead of guesswork — then adapting to the traits rather than trying to change them (you can't; a big chunk of personality is genetic).",
      example: "New client always asks \"what's the plan?\" and shows up early — high conscientiousness. Send the itemized rundown before the event and he'll trust you forever.",
      related: ["lingo-ocean", "lingo-the-matrix"]
    },
    {
      id: "lingo-ocean",
      term: "OCEAN (The Big Five)",
      emoji: "🌊",
      book: "Captivate",
      def: "The five science-backed personality dials: Openness (novelty vs. routine), Conscientiousness (details vs. go-with-the-flow), Extroversion (energized vs. drained by people), Agreeableness (default yes vs. default no), and Neuroticism (worrier vs. steady). Everyone sits high, low, or middle on each — and no ranking is \"best.\"",
      example: "One regular wants the new cocktail menu every week (high openness); another orders the same vodka soda since 2022 (low openness). Neither is wrong — sell them differently.",
      related: ["lingo-speed-read", "lingo-the-matrix"]
    },
    {
      id: "lingo-the-matrix",
      term: "The Matrix (Cipher)",
      emoji: "🧅",
      book: "Captivate",
      def: "The three-layer profile you build of a person: their Big Five traits on the outside, their appreciation language in the middle, and their primary value at the center. Complete all three layers and you've \"unlocked their cipher\" — the CliffsNotes to the relationship.",
      example: "Your best host: low neuroticism, quality-time appreciation, status-driven at the core. Now you know how to brief her, thank her, and keep her.",
      related: ["lingo-ocean", "lingo-appreciation-languages", "lingo-primary-value"]
    },
    {
      id: "lingo-appreciation-languages",
      term: "The 5 Appreciation Languages",
      emoji: "💝",
      book: "Captivate",
      def: "The five ways people give and feel appreciation: Words of Affirmation, Gifts, Physical Touch, Acts of Service, and Quality Time. Most people have a primary and a secondary — and appreciation delivered in the wrong language barely registers.",
      example: "You keep publicly praising a doorman who actually feels valued when you cover his shift-end cab (acts of service). Right intent, wrong language — switch it.",
      related: ["lingo-the-matrix"]
    },
    {
      id: "lingo-primary-value",
      term: "Primary Value",
      emoji: "💎",
      book: "Captivate",
      def: "The one resource a person is fundamentally trying to gain from interactions, out of six: Love (belonging), Service (help), Status (credit and respect), Money, Goods (things), and Information (being in the know). Decode it from complaints, brags, and what keeps them up at night — and trust behavior over what they claim.",
      example: "The waitress who stays late hoping the manager notices runs on Status; the one out the door at close who asks about the holiday bonus runs on Money. Motivate each in her own currency.",
      related: ["lingo-the-matrix", "lingo-riser"]
    },
    {
      id: "lingo-story-stack",
      term: "Story Stack",
      emoji: "📚",
      book: "Captivate",
      def: "A prepared inventory of stories: for each recurring trigger topic (weather, commute, weekends, work), you pre-hunt one short anecdote that reliably lands, plus a boomerang question to hand the conversation back. Stories don't have to be yours — collect the good ones you hear.",
      example: "Someone mentions rideshares and you're ready with your 90-second \"driver took us to the wrong casino\" story, ending with \"what's your worst ride ever?\"",
      related: ["lingo-boomerang"]
    },
    {
      id: "lingo-boomerang",
      term: "The Boomerang",
      emoji: "🪃",
      book: "Captivate",
      def: "The question you throw after telling a story that invites THEIR story back (\"have you ever...?\"). It keeps you from being a conversation hog and gives the other person the dopamine of self-disclosure.",
      example: "After your celebrity-at-the-club story: \"you ever had someone famous walk into your spot?\" — now they're talking and loving you for it.",
      related: ["lingo-story-stack"]
    },
    {
      id: "lingo-ikea-effect",
      term: "The Ikea Effect",
      emoji: "🪑",
      book: "Captivate",
      def: "We overvalue what we help build — people who assembled their own origami or furniture valued it several times higher than outsiders did. Leadership implication: give people a hand in building the thing and they'll care about it and defend it.",
      example: "Let your promo team design their own section of the flyer instead of handing them a finished one — suddenly it's THEIR event they're pushing.",
      related: ["lingo-the-because", "lingo-skill-solicitation"]
    },
    {
      id: "lingo-the-because",
      term: "The \"Because\"",
      emoji: "🔑",
      book: "Captivate",
      def: "Always attach a reason to a request — the word \"because\" itself triggers our purpose-driven wiring and dramatically raises compliance, even when the reason is thin. Strongest when the reason points at their benefit or a shared one.",
      example: "\"Can you cover the door for ten? Because I've got to walk the VIPs in\" gets a faster yes than the bare ask — every time.",
      related: ["lingo-ikea-effect"]
    },
    {
      id: "lingo-skill-solicitation",
      term: "Skill Solicitation",
      emoji: "🙋",
      book: "Captivate",
      def: "Instead of begging for volunteers (\"can someone please...?\"), ask people to self-identify by capability: \"who's good at ___?\" Tasks become skill-shaped instead of duty-shaped, and naming someone's known skill doubles as a compliment.",
      example: "\"Who's got the best camera roll game? I need someone to own tonight's recap reel\" beats assigning it to whoever's nearest.",
      related: ["lingo-ikea-effect", "lingo-highlighter"]
    },
    {
      id: "lingo-spotlight-effect",
      term: "The Spotlight Effect",
      emoji: "💡",
      book: "Captivate",
      def: "The proven tendency to massively overestimate how much other people notice your flubs and embarrassments — in the classic study, roughly double reality. Nobody is scrutinizing you as hard as you are.",
      example: "You blank on a regular's name and cringe about it all night — he forgot the moment in seconds. The replay loop is only running in YOUR head.",
      related: ["lingo-pratfall-effect"]
    },
    {
      id: "lingo-pratfall-effect",
      term: "The Pratfall Effect",
      emoji: "☕",
      book: "Captivate",
      def: "A competent person who makes a small human blunder (spilling coffee on himself, in the classic study) is rated MORE likable than the flawless version. Small imperfections humanize you — they're similarity fuel.",
      example: "Fumbling the champagne cork in front of the table and laughing it off makes you more charming, not less — as long as the service itself is dialed.",
      related: ["lingo-spotlight-effect", "lingo-franklin-effect"]
    },
    {
      id: "lingo-franklin-effect",
      term: "The Franklin Effect",
      emoji: "🪞",
      book: "Captivate",
      def: "Asking someone for a favor makes THEM like YOU more — named for Ben Franklin, who won over a rival by borrowing a rare book. Asking for advice is the everyday version: it admits a little vulnerability, gets them talking, and reveals how they think.",
      example: "\"You know this city better than anyone — where should I take a client Tuesday?\" The venue manager now likes you more BECAUSE he helped you.",
      related: ["lingo-pratfall-effect"]
    },
    {
      id: "lingo-nut-job",
      term: "The NUT Job",
      emoji: "🛡️",
      book: "Captivate",
      def: "The three-step de-escalation for difficult moments, adapted from hostage negotiation: Name the emotion (reflect their exact words back), Understand what they're really seeking, and only then Transform with a solution — never before they've de-escalated (listen for the big sigh).",
      example: "Guest raging about a double-charged card: \"that's incredibly frustrating\" (name), \"walk me through what happened\" (understand), then — after the sigh — \"here's what I'll do right now\" (transform).",
      related: ["lingo-low-road-high-road", "lingo-gremlin"]
    },
    {
      id: "lingo-low-road-high-road",
      term: "Low Road / High Road",
      emoji: "🧠",
      book: "Captivate",
      def: "Fear's two brain pathways: the Low Road is the instant survival reflex through the amygdala; the logical High Road arrives a beat later. When the Low Road dominates (\"emotional hijacking\"), a person literally can't access their rational, witty self — difficult people are hijacked people, not bad people.",
      example: "A shouting customer isn't choosing to be irrational — his Low Road is driving. That's why you calm the emotion first (NUT Job) instead of arguing facts he can't hear yet.",
      related: ["lingo-nut-job"]
    },
    {
      id: "lingo-gremlin",
      term: "Gremlins",
      emoji: "👹",
      book: "Captivate",
      def: "The catalog of social fears — being judged, rejected, left out, laughed at, boring, forgotten — that dress up as behavior: people-pleasing, bossiness, defensiveness, gossip, neediness, drama. \"Fear is a cross-dresser\": difficult behavior is usually a fear in costume.",
      example: "The promoter who trashes every competitor's event is probably wearing the \"afraid of being irrelevant\" costume. Naming your own gremlin is step one to retiring the act.",
      related: ["lingo-nut-job"]
    },
    {
      id: "lingo-self-narrative",
      term: "Self-Narrative",
      emoji: "📜",
      book: "Captivate",
      def: "The internal life story a person tells about who they are and why — where their sense of purpose lives. Primary values often trace back to it: people chase the resource their story says they were denied or that defines them.",
      example: "The owner who grew up broke and now name-drops revenue in every conversation isn't bragging at random — his self-narrative made Money the score he keeps.",
      related: ["lingo-primary-value"]
    },
    {
      id: "lingo-attunement",
      term: "Attunement",
      emoji: "🧲",
      book: "Captivate",
      def: "The capstone skill: making people feel wanted, liked, and known. Brain scans show the most popular people aren't the best-looking or funniest — they're the most attuned to what others think and feel. It runs on reciprocity (we mirror the treatment we receive), belonging, and curiosity.",
      example: "Opening with \"I was hoping you'd come through tonight\" and closing with \"this was the best table of my week\" — said only when true — is attunement in one evening.",
      related: ["lingo-highlighter"]
    },

    // --------------------------- Cues lingo ---------------------------
    {
      id: "lingo-cue",
      term: "Cue",
      emoji: "📡",
      book: "Cues",
      def: "Any signal you send or receive beyond the literal words: body language, facial expressions, vocal tone, word choice, even colors and props. Cues run in four channels — nonverbal, vocal, verbal, and imagery — and they're being read constantly, not just at first meetings.",
      example: "Your crossed arms at the host stand, your rising pitch on the price, the emoji in your confirmation text — all cues, all being read.",
      related: ["lingo-cue-cycle", "lingo-cue-cluster"]
    },
    {
      id: "lingo-cue-cluster",
      term: "Cue Cluster (The Cluster Rule)",
      emoji: "🧩",
      book: "Cues",
      def: "Never judge on a single cue — one crossed arm can be a cold room, one furrow can be concentration. The rule: require a cluster of three incongruent cues around the SAME topic before concluding anything. There is no single \"Pinocchio's nose\" for lying.",
      example: "A guest leans back when the bill lands. Alone, meaningless. Leaning back + lip press + feet toward the door, all at bill time? Now you've got a read — go smooth it out.",
      related: ["lingo-baseline", "lingo-congruency"]
    },
    {
      id: "lingo-baseline",
      term: "Baseline",
      emoji: "📏",
      book: "Cues",
      def: "A person's normal — their resting face, usual energy, habitual gestures. You can only read a cue as signal if it DEVIATES from that person's baseline; some people just look grumpy or fidget constantly.",
      example: "Your regular always sits arms-crossed — that's his baseline, not boredom. But if Mr. Handshakes-Everyone suddenly goes closed-off, something happened.",
      related: ["lingo-cue-cluster", "lingo-punctuator", "lingo-rbf"]
    },
    {
      id: "lingo-cue-cycle",
      term: "The Cue Cycle",
      emoji: "🔁",
      book: "Cues",
      def: "The loop every interaction runs: Decode (read others' signals) → Internalize (those cues change your own mood and state) → Encode (send signals back). Moods jump between people in minutes, so what you spot literally shapes what you send.",
      example: "You catch a guest's stress (decode), feel your own shoulders rise (internalize), and either pass the tension on or deliberately send calm back (encode). The cycle runs either way — better to drive it.",
      related: ["lingo-cue"]
    },
    {
      id: "lingo-charisma-scale",
      term: "The Charisma Scale (Warmth × Competence)",
      emoji: "⚖️",
      book: "Cues",
      def: "Charisma = warmth + competence. People scan you for warmth first (\"can I trust you?\") then competence (\"can I rely on you?\"). High warmth alone gets you liked but talked over; high competence alone gets you respected but avoided. The Charisma Zone is high on both.",
      example: "The host everyone loves but nobody books through: all warmth, no competence cues. The manager everyone fears texting: the reverse. You want the corner where both live.",
      related: ["lingo-danger-zone", "lingo-charisma-dial"]
    },
    {
      id: "lingo-danger-zone",
      term: "The Danger Zone",
      emoji: "🚨",
      book: "Cues",
      def: "The low-warmth, low-competence corner of the charisma scale — where people get overlooked, dismissed, and undervalued. You land there by sending too FEW cues (muted face, sterile tone) or too many negative ones — not by being a bad person. Hiding all your cues IS a cue.",
      example: "Nervously flat texts (\"ok. see you then.\") read as cold and forgettable — Danger Zone by accident. One warm line fixes it.",
      related: ["lingo-charisma-scale", "lingo-rbf"]
    },
    {
      id: "lingo-charisma-dial",
      term: "The Charisma Dial",
      emoji: "🎛️",
      book: "Cues",
      def: "Flexing your warmth/competence blend to fit the moment: dial UP warmth when you need buy-in, rapport, or collaboration; dial UP competence when you need credibility, respect, or negotiation power. Also match the other person's lean.",
      example: "With a first-time bachelorette group: warmth up — smiles, stories, chitchat. With the venue's finance guy: competence up — numbers first, level voice, no tangents.",
      related: ["lingo-charisma-scale"]
    },
    {
      id: "lingo-fronting",
      term: "Fronting",
      emoji: "🧭",
      book: "Cues",
      def: "Aiming your three T's — toes, torso, and top (head) — at your target of attention. Full fronting is the fastest \"you matter\" signal there is. Decode side: people's toes point where they want to go; toes toward the exit means they want out.",
      example: "When a guest flags you down, swivel your whole body to face her, not just your neck — she feels heard in one second. And if her date's feet aim at the door all night, he's not staying for another round.",
      related: ["lingo-distancing"]
    },
    {
      id: "lingo-blocking",
      term: "Blocking",
      emoji: "🙅",
      book: "Cues",
      def: "Putting a barrier between your torso and the world: crossed arms, a clutched phone or clipboard, a bag hugged to the chest, hands covering the mouth or eyes. It signals protection, nerves, or closed-ness. The reverse move — visibly REMOVING a barrier (anti-blocking) — is a fast trust builder.",
      example: "Taking orders with the tablet hugged to your chest reads as closed-off. Drop it to your side — or make a show of setting your phone face-down when a VIP starts talking.",
      related: ["lingo-distancing", "lingo-self-soothing"]
    },
    {
      id: "lingo-distancing",
      term: "Distancing",
      emoji: "↩️",
      book: "Cues",
      def: "Physically pulling away from something threatening or unwanted: stepping back, leaning back, angling away, scooting the chair, or turning to a phone mid-conversation (\"phubbing\" — which measurably costs you trust). People even distance from their own lies.",
      example: "You pitch the upgrade and the group's spokesperson leans back and half-turns to his phone — that's a no forming. Change tack before you push.",
      related: ["lingo-blocking", "lingo-fronting"]
    },
    {
      id: "lingo-steepling",
      term: "Steepling",
      emoji: "⛪",
      book: "Cues",
      def: "Fingertips together, palms facing, fingers splayed — \"a power pose for your hands.\" It signals calm, confident contemplation, keeps palms visible, and gives fidgety hands somewhere professional to live. (Don't drum the fingers — that reads as scheming.)",
      example: "While the client explains what she wants for her event, rest your hands in a loose steeple instead of clicking your pen — you look like the calmest, most capable person in the room.",
      related: ["lingo-expansion"]
    },
    {
      id: "lingo-expansion",
      term: "Expansion (Power Posture)",
      emoji: "🗿",
      book: "Cues",
      def: "Taking up a bit more space to signal confidence: shoulders down away from the ears, feet planted slightly wider, arms relaxed with a little daylight from the torso, thumbs rotated forward. Inches, not superhero poses — and it lowers your own stress, too. Shrinking (contraction) signals the opposite.",
      example: "Before you step into the owner's office to negotiate your cut: shoulders down, feet planted, hands out of your pockets. You'll sound different because you'll feel different.",
      related: ["lingo-launch-stance", "lingo-steepling"]
    },
    {
      id: "lingo-savor-smile",
      term: "Savor Smile",
      emoji: "😊",
      book: "Cues",
      def: "A genuine smile that spreads slowly — over about half a second — and reaches the eyes (crow's-feet crinkles). Slow-spreading smiles rate as more attractive and authentic. Fake smiles live on the lower face only and don't fool anyone.",
      example: "When your favorite regulars walk in, let the smile build as you recognize them instead of snapping on the greeter grin — it lands completely differently.",
      related: ["lingo-eyebrow-flash"]
    },
    {
      id: "lingo-eyebrow-flash",
      term: "Eyebrow Flash",
      emoji: "🤨",
      book: "Cues",
      def: "A quick (under one second) raise of the brows — the fastest interest, curiosity, and acknowledgment signal humans have. Great for greetings and encouraging someone to keep talking. Careful: raise the BROWS, not the eyelids — showing upper eye-whites reads as fear.",
      example: "Catching a guest's eye across the rail with a quick brow flash and a nod says \"I see you, I've got you\" without shouting over the music.",
      related: ["lingo-savor-smile", "lingo-hot-button"]
    },
    {
      id: "lingo-mirroring",
      term: "Mirroring",
      emoji: "🪩",
      book: "Cues",
      def: "Subtly matching another person's posture, gestures, energy, volume — and even their word choices (verbal mirroring). It builds fast trust and measurably better outcomes in negotiations. Rules: mirror only positive, open cues; keep it subtle; never mirror negativity.",
      example: "A low-key guest speaks quietly and slowly — meet him there instead of blasting promoter energy at him. Echo the group's own words back: if they call it a \"celebration,\" it's a celebration, not a \"package.\"",
      related: ["lingo-charisma-dial"]
    },
    {
      id: "lingo-uptalk",
      term: "Uptalk (Question Inflection)",
      emoji: "📈",
      book: "Cues",
      def: "Letting your pitch rise at the end of a STATEMENT, as if asking a question. It signals low confidence, flips listeners from listening to scrutinizing, and invites doubt and haggling. Danger spots: saying your own name, prices, deadlines, and hard news.",
      example: "\"The minimum is two bottles?\" (rising) invites negotiation. \"The minimum is two bottles.\" (level or falling) ends it.",
      related: ["lingo-downward-inflection", "lingo-vocal-fry"]
    },
    {
      id: "lingo-downward-inflection",
      term: "Downward Inflection",
      emoji: "📉",
      book: "Cues",
      def: "Ending a statement with level or falling pitch — the vocal signature of certainty. Use it deliberately on names, prices, timelines, and anything you don't want argued with.",
      example: "Practice saying your own name and your rate with a firm landing. \"Six hundred for the table.\" Period. Watch how much less pushback you get.",
      related: ["lingo-uptalk"]
    },
    {
      id: "lingo-vocal-fry",
      term: "Vocal Fry",
      emoji: "🥓",
      book: "Cues",
      def: "The creaky, bacon-sizzle rattle when too little breath passes the vocal cords — usually at the end of run-on sentences or when faking casual. It reads as anxiety or carelessness, not cool. Fix: shorter sentences, a bit more breath and volume.",
      example: "By 2 a.m. your voice is fried and your \"last call for bottle service\" crackles into nothing. Take a breath, add volume, shorten the sentence — instant authority back.",
      related: ["lingo-uptalk", "lingo-power-pause"]
    },
    {
      id: "lingo-power-pause",
      term: "Power Pause & Breathing Pause",
      emoji: "⏸️",
      book: "Cues",
      def: "Two pause moves: replace every would-be filler (\"um,\" \"like\") with a silent inhale (the breathing pause — it lowers pitch, prevents fry, and buys thinking time), and pause mid-sentence right BEFORE your reveal (the power pause — it builds intrigue and holds the floor). Pausing at sentence ends invites interruption.",
      example: "\"The one thing this group needs to see tonight... [beat] ...is the view from the mezzanine.\" That beat does more selling than any adjective.",
      related: ["lingo-vocal-fry", "lingo-downward-inflection"]
    },
    {
      id: "lingo-rbf",
      term: "Resting Bothered Face (RBF)",
      emoji: "🪞",
      book: "Cues",
      def: "A neutral resting face that accidentally carries a negative expression — a brow furrow (reads angry), downturned mouth corners (reads sad), or a one-sided lift (reads contemptuous). People scan faces to decide what to think, so an accidental RBF sends signals you never meant.",
      example: "Photograph your face while you think about inventory. If there's a furrow or a smirk in there, that's what guests see when you're just doing math in your head.",
      related: ["lingo-baseline", "lingo-danger-zone"]
    },
    {
      id: "lingo-self-soothing",
      term: "Self-Soothing (Comfort Cues)",
      emoji: "🫂",
      book: "Cues",
      def: "The anxiety leaks: rubbing your arm or neck, wringing hands, pulling a collar (ventilating), nail biting, preening, swaying, touching your nose. Self-touch rises with stress — and fidgety speakers actually raise their audience's stress. Fix with displacement: hold a pen, plant a hand, press thumb to finger.",
      example: "Counting the drawer while the owner watches, you keep rubbing the back of your neck. Grab the clipboard with both hands instead — the leak stops.",
      related: ["lingo-blocking", "lingo-shame-cue"]
    },
    {
      id: "lingo-shame-cue",
      term: "The Shame Cue",
      emoji: "🫣",
      book: "Cues",
      def: "Fingertips or a hand touching the forehead with the gaze dropping — hiding the embarrassed face. Top triggers: money talk, confusion, and over-personal questions. When you see it, you've entered someone's sensitive territory: reassure, never pile on.",
      example: "You mention the deposit and the groom-to-be's hand goes to his forehead. Ease off: \"we've got flexible options — I'll text you the range, no pressure tonight.\"",
      related: ["lingo-self-soothing", "lingo-squelching"]
    },
    {
      id: "lingo-nonverbal-bridge",
      term: "Nonverbal Bridge",
      emoji: "🌉",
      book: "Cues",
      def: "Crossing into someone's closer space zone with one limb or object instead of your whole body: a lean, leveling to their height, a hand-off (drink, phone photo, sample), a brief touch, a high five. Bridges build closeness without invading.",
      example: "Instead of stepping into a new group's huddle, hand the birthday girl a glass across the gap: \"this one's on me.\" One arm crosses; the trust follows.",
      related: ["lingo-space-zones"]
    },
    {
      id: "lingo-space-zones",
      term: "Space Zones (Proxemics)",
      emoji: "📐",
      book: "Cues",
      def: "Edward T. Hall's four distance zones: Intimate (closest — high-trust only), Personal (friends and colleagues, handshake range), Social (business and parties), and Public (waves and nods). The zone someone lets you into reveals their comfort with you; jumping zones uninvited reads as invasion.",
      example: "Lean in to be heard over the music, sure — but if a guest keeps re-opening the gap you keep closing, she's telling you which zone you belong in. Respect it.",
      related: ["lingo-nonverbal-bridge", "lingo-distancing"]
    },
    {
      id: "lingo-gaze-zones",
      term: "Gaze Zones",
      emoji: "👁️",
      book: "Cues",
      def: "Where you aim your eyes on a face sets the register: keeping gaze around the eyes and forehead reads formal and powerful; the eyes-to-mouth triangle is friendly social gazing; letting gaze drift from eyes toward the chest reads intimate — keep it out of work. Aim for warm eye contact in bursts (eye locks at moments of agreement), not a stare-down.",
      example: "Talking to a guest's girlfriend? Eyes-and-mouth triangle, generous eye contact, zero drift. Talking to the owner about money? Keep the gaze high and steady.",
      related: ["lingo-eyebrow-flash"]
    },
    {
      id: "lingo-power-words",
      term: "Warm, Competent & Sterile Words",
      emoji: "✍️",
      book: "Cues",
      def: "Words carry warmth and competence like the body does: warm words (together, we, enjoy, collaborate) work like a smile in text; competent words (effective, data, streamline) work like a steeple; charismatic words (excited, team, kickoff) do both. The killer is STERILE boilerplate — it signals nothing and reads as cold.",
      example: "\"Confirmed. 10pm. Bring ID.\" is sterile. \"Locked in for 10 — so glad you're coming through. Bring ID and come straight to me.\" is the same info with a pulse.",
      related: ["lingo-danger-zone", "lingo-mirroring"]
    },
    {
      id: "lingo-nonverbal-brand",
      term: "Nonverbal Brand",
      emoji: "🎩",
      book: "Cues",
      def: "The visual cues that broadcast who you are before you speak: a signature look, prop, color, or accessory (think Bill Nye's bow tie). It shapes how others read you AND how you read yourself.",
      example: "The promoter in the same sharp all-black fit with the gold chain every night isn't just dressing — he's branding. Pick your signature and keep it consistent.",
      related: ["lingo-power-words"]
    },
    {
      id: "lingo-rule-of-three",
      term: "The Rule of Three",
      emoji: "3️⃣",
      book: "Cues",
      def: "Try every new cue at least three times in three different situations before judging it: the first attempt feels awkward, the second feels empowering, and on the third you decide keep or discard. One weird try proves nothing.",
      example: "Steepling felt ridiculous at Tuesday's staff meeting. Rule of Three says try it twice more — on a call, with a client — before you throw it out.",
      related: ["lingo-cue-cycle"]
    },
    {
      id: "lingo-three-in-three",
      term: "The 3-in-3 Rule",
      emoji: "⏲️",
      book: "Cues",
      def: "Show three warmth cues in the first three minutes of any interaction — a real smile, a head tilt, a lean, an eyebrow flash, a warm opener. Warmth is what people scan for first, so front-load it.",
      example: "New table walks in: savor smile at the greeting, head tilt while they explain the occasion, small lean at the birthday reveal. Three minutes, trust established.",
      related: ["lingo-savor-smile", "lingo-eyebrow-flash", "lingo-charisma-scale"]
    }
  ],

  // ==========================================================================
  // QUIZ DECKS — drilling the lingo itself
  // ==========================================================================
  decks: [
    {
      id: "lingo-deck-captivate",
      name: "Captivate Lingo 101",
      icon: "📖",
      desc: "What the Captivate terms actually mean — no book required.",
      minLevel: 1,
      skill: "cap-spark",
      questions: [
        {
          q: "What is a \"conversation sparker\"?",
          options: [
            "A witty comeback you keep ready",
            "A novelty question that replaces autopilot small talk and triggers a real answer",
            "A compliment you open with",
            "A joke to break the ice"
          ],
          answer: 1,
          explain: "Sparkers like \"what was the highlight of your day?\" knock people off script. Pleasure makes conversation memorable — dopamine works like a chemical \"remember this\" note."
        },
        {
          q: "\"Big Talk\" means...",
          options: [
            "Talking about important business topics",
            "Speaking loudly and confidently",
            "Conversation with real peaks — stories and passions — instead of weather-and-work autopilot",
            "Dominating the conversation"
          ],
          answer: 2,
          explain: "Small talk is the kiddie ride; Big Talk is Space Mountain. You get there with sparkers, hot buttons, and stories — not volume."
        },
        {
          q: "\"Thread Theory\" is the strategy of...",
          options: [
            "Keeping several conversations going at once",
            "Hunting for genuine \"me too!\" commonalities in people, context, and interests",
            "Remembering conversation details for later",
            "Steering every topic back to your expertise"
          ],
          answer: 1,
          explain: "We like people like us (the similarity-attraction effect). Search People, Context, and Interests for shared threads, follow them with whys — and never announce a mismatch."
        },
        {
          q: "Being a \"highlighter\" means...",
          options: [
            "Wearing something bright so you stand out",
            "Recapping the best moments of an event",
            "Talking up your own wins confidently",
            "Listening for what's genuinely impressive in people and honoring it out loud"
          ],
          answer: 3,
          explain: "You become the highlight of the room by bringing out the best in others — real strengths, not flattery. Labels shape behavior, so hand out good ones."
        },
        {
          q: "An \"emotional gold star\" is...",
          options: [
            "A specific positive label you give someone, which they tend to grow into",
            "A reward you promise for good behavior",
            "A mental note about someone's value to you",
            "Public recognition at a ceremony"
          ],
          answer: 0,
          explain: "\"You're a natural connector\" is a gold star. The Pygmalion effect: great expectations produce greatness — and low expectations (the golem effect) produce the opposite."
        },
        {
          q: "In the Story Stack, the \"boomerang\" is...",
          options: [
            "A story that circles back to its opening line",
            "Re-telling a story that worked to a new group",
            "The question after your story that invites THEIR story back",
            "A callback to something said earlier"
          ],
          answer: 2,
          explain: "\"Have you ever...?\" hands the mic back. It keeps you from hogging the conversation and gives them the dopamine of talking about themselves."
        },
        {
          q: "Your \"Winger\" is...",
          options: [
            "Your backup plan when an event flops",
            "Your wing-person who joins social adventures and practices skills with you",
            "The most connected person you know",
            "Someone who improvises well"
          ],
          answer: 1,
          explain: "The recurring name when you ask who makes you laugh, feel valued, and become your best self. The Riser, by contrast, is the one relationship you're deliberately leveling up."
        },
        {
          q: "A \"social sweet spot\" is...",
          options: [
            "The moment in the night when everyone's warmed up",
            "A topic everyone can agree on",
            "The VIP section of a venue",
            "A high-connection position in the room, like the ends of the bar or near the host"
          ],
          answer: 3,
          explain: "At the bar's ends you catch people with a fresh drink, anxiety spent, ready to talk. Truman worked side-room sweet spots to win a nomination without taking the stage."
        },
        {
          q: "A \"Franken-person\" is what happens when you...",
          options: [
            "Stay out too late too many nights in a row",
            "Stitch yourself together from copied bits of other people's charm — and read as fake",
            "Mix too many personality frameworks at once",
            "Try to please two different audiences"
          ],
          answer: 1,
          explain: "Borrowed lines and faked extroversion don't fool anyone — \"people who are fake\" ranked as the #1 most annoying habit. Optimize the real you in settings where you thrive."
        },
        {
          q: "The \"NUT Job\" is...",
          options: [
            "A three-step de-escalation: Name the emotion, Understand what they seek, Transform with a solution",
            "A prank to lighten a tense mood",
            "The label for an impossible customer",
            "A negotiation tactic for driving the price down"
          ],
          answer: 0,
          explain: "Adapted from hostage negotiation: reflect their exact emotion words, dig for what they're really after, and only offer fixes AFTER the de-escalation sigh."
        },
        {
          q: "The \"Franklin effect\" says that to make someone like you more, you should...",
          options: [
            "Do them a generous favor first",
            "Compliment them in front of others",
            "Ask THEM for a favor or genuine advice",
            "Find their favorite topic"
          ],
          answer: 2,
          explain: "Doing a kindness makes the DOER like the recipient more. Asking for advice you genuinely need admits vulnerability, gets them talking, and bonds them to you."
        },
        {
          q: "To \"speed-read\" someone means to...",
          options: [
            "Skim their social media before meeting them",
            "Decode their personality traits from questions, behavior, and environment",
            "Judge them in the first two seconds",
            "Finish their sentences to build rapport"
          ],
          answer: 1,
          explain: "You can't change people's traits (a big chunk is genetic) — so read the five OCEAN dials and adapt: optimize or compromise, never remodel."
        }
      ]
    },
    {
      id: "lingo-deck-cues",
      name: "Cues Lingo 101",
      icon: "🏷️",
      desc: "Decode the decoder's vocabulary — cues, clusters, baselines, and the scale.",
      minLevel: 1,
      skill: "cues-scale",
      questions: [
        {
          q: "In the book's sense, a \"cue\" is...",
          options: [
            "A hint you drop on purpose",
            "Any signal beyond your literal words — body, voice, word choice, even colors and props",
            "Your turn to speak in a conversation",
            "A memorized script line"
          ],
          answer: 1,
          explain: "Cues run in four channels — nonverbal, vocal, verbal, imagery — and people read them constantly, not just when you meet."
        },
        {
          q: "Someone's \"baseline\" is...",
          options: [
            "Their minimum acceptable outcome in a negotiation",
            "Their normal — resting face, usual energy, habitual gestures — that cues must deviate from to mean anything",
            "The first impression they made on you",
            "Their default seat or position in a room"
          ],
          answer: 1,
          explain: "Some people always cross their arms; some always fidget. Only a CHANGE from a person's baseline is signal — which is why you learn their normal first."
        },
        {
          q: "The \"cluster rule\" says...",
          options: [
            "Stick with groups of three people at events",
            "Group your questions in threes",
            "Never conclude anything from one cue — require three incongruent cues around the same topic",
            "Three positive cues cancel a negative one"
          ],
          answer: 2,
          explain: "One crossed arm can be a cold room. There's no single Pinocchio's-nose lie cue — clusters in context are the only safe read."
        },
        {
          q: "\"Fronting\" means...",
          options: [
            "Acting more confident than you feel",
            "Aiming your toes, torso, and head at your target of attention",
            "Standing at the front of a group",
            "Leading with your strongest topic"
          ],
          answer: 1,
          explain: "The three T's telegraph attention — full fronting is the fastest \"you matter\" signal. Decode side: toes pointed at the exit mean someone wants to leave."
        },
        {
          q: "\"Blocking\" is...",
          options: [
            "Refusing to answer a question",
            "Physically barring someone from a space",
            "Interrupting someone repeatedly",
            "Putting a barrier — crossed arms, clutched object, covering hands — between your torso and the world"
          ],
          answer: 3,
          explain: "Body, mouth, and eye blocks all buy protection or processing time. The reverse — visibly removing a barrier (anti-blocking) — is a fast trust builder."
        },
        {
          q: "\"Steepling\" is...",
          options: [
            "Fingertips together, palms apart — a calm, confident power pose for the hands",
            "Standing tall with your chin raised",
            "Stacking your points from weakest to strongest",
            "Clasping your hands tightly to stay still"
          ],
          answer: 0,
          explain: "It keeps palms visible, reads as confident contemplation, and anchors fidgety hands. Just don't drum the fingers — that's the scheming version."
        },
        {
          q: "\"Uptalk\" means...",
          options: [
            "Talking up your achievements",
            "Ending statements with rising pitch, like a question",
            "Speaking to someone more senior",
            "Raising your volume for emphasis"
          ],
          answer: 1,
          explain: "Rising pitch on an assertion asks your own statement as a question — it signals insecurity and invites doubt and haggling, especially on prices and your own name."
        },
        {
          q: "\"Vocal fry\" is...",
          options: [
            "Losing your voice from overuse",
            "A deliberately raspy style that signals cool",
            "The creaky rattle when too little breath passes the vocal cords — reads as anxious, not relaxed",
            "Speaking so fast words sizzle together"
          ],
          answer: 2,
          explain: "Fry hits at the end of run-on sentences or when faking casual. Fix: shorter sentences, more breath, slightly more volume."
        },
        {
          q: "The \"Danger Zone\" on the charisma scale is...",
          options: [
            "Coming on too strong with too many cues",
            "Low warmth AND low competence — where muted or negative cues get you overlooked and dismissed",
            "High competence that intimidates people",
            "Being too warm to be taken seriously"
          ],
          answer: 1,
          explain: "You land there by sending too FEW cues (sterile, muted) or too many negative ones — not by being a bad person. Hiding all your cues is itself a cue."
        },
        {
          q: "\"RBF\" in this book stands for Resting Bothered Face, meaning...",
          options: [
            "The tired face everyone gets late at night",
            "A face that shows you're deep in thought",
            "An intimidation tactic used on purpose",
            "A neutral resting face that accidentally carries anger, sadness, or contempt"
          ],
          answer: 3,
          explain: "A resting brow furrow reads angry; downturned corners read sad; a one-sided lift reads contemptuous. People scan faces to decide what to think — audit yours."
        },
        {
          q: "A \"savor smile\" is...",
          options: [
            "A genuine smile that spreads slowly and crinkles the eyes",
            "The smile you hold for photos",
            "A knowing half-smile",
            "Smiling while eating something delicious"
          ],
          answer: 0,
          explain: "Slow-spreading smiles rate as more attractive and authentic — like relishing the person. Fake smiles live on the lower face and skip the eyes."
        },
        {
          q: "\"Mirroring\" done right means...",
          options: [
            "Copying everything the other person does",
            "Subtly matching their positive cues — posture, energy, even word choices",
            "Repeating their sentences back verbatim",
            "Matching their negative mood to show empathy"
          ],
          answer: 1,
          explain: "Mirror what you want to magnetize — open, positive cues only, kept subtle. Never mirror negativity (you'll catch it), and never turn it into Simon Says."
        }
      ]
    },
    {
      id: "lingo-deck-scenarios",
      name: "Name That Move",
      icon: "🎯",
      desc: "Real situations — which concept explains what's happening?",
      minLevel: 1,
      skill: "cues-cycle",
      questions: [
        {
          q: "A guy at your table crosses his arms and angles his feet toward the exit. Which concept tells you what to check BEFORE assuming he's bored?",
          options: [
            "His baseline, and whether a cluster of cues forms around one topic",
            "The spotlight effect",
            "The Ikea effect",
            "The Franklin effect"
          ],
          answer: 0,
          explain: "Maybe he always sits like that (baseline), or the AC is blasting (context). One cue proves nothing — wait for three incongruent cues around the same trigger before you conclude anything."
        },
        {
          q: "You quote the table minimum and your voice rises at the end like a question. What did you just do?",
          options: [
            "Used a power pause",
            "Uptalked your price — inviting doubt and haggling",
            "Mirrored the guest",
            "Used downward inflection"
          ],
          answer: 1,
          explain: "Question inflection on a statement asks your own price as a question. Land it level or falling — sales reps who fixed this stopped getting haggled."
        },
        {
          q: "Instead of prowling the entrance, you post up at the end of the bar where people arrive with fresh drinks. What did you just claim?",
          options: [
            "The Start Zone",
            "A Side Zone",
            "A social sweet spot",
            "The Danger Zone"
          ],
          answer: 2,
          explain: "The bar's two ends are the highest-connection positions in the room — people get there relaxed, drink in hand, ready to talk. The entrance is peak-anxiety territory."
        },
        {
          q: "A promoter camps by the check-in table grabbing everyone as they walk in — and wonders why nobody sticks. Which trap is he in?",
          options: [
            "The Start Zone — where arrival anxiety peaks",
            "The \"Not me!\" trap",
            "The spotlight effect",
            "The golem effect"
          ],
          answer: 0,
          explain: "People at the entrance are distracted, scanning, and bee-lining to the bar or bathroom. Start-Zone pouncers made the fewest connections — let people land first."
        },
        {
          q: "A guest says \"totally fine with it\" but a one-sided smirk flashes across her face for half a second. What's the read?",
          options: [
            "She's amused — half smiles mean things are going well",
            "Words and face disagree — the involuntary flash (contempt) is the honest signal",
            "Ignore it — one expression means nothing ever",
            "She's confused and needs the explanation repeated"
          ],
          answer: 1,
          explain: "That's a congruency check: a sub-second microexpression can't be faked. Contempt is a red flag — find the source and rebuild before it festers."
        },
        {
          q: "You tell your best club story, then ask \"you ever had a night go completely sideways like that?\" What technique is that?",
          options: [
            "The boomerang",
            "The Five Whys",
            "A raving introduction",
            "Skill solicitation"
          ],
          answer: 0,
          explain: "The boomerang throws the conversation back after your story — they get to self-disclose (which their brain loves), and you stop short of conversation-hog territory."
        },
        {
          q: "\"Maya, meet Jordan — he throws the best rooftop parties in the city, his last one sold out in a day.\" What did you just do?",
          options: [
            "A cold introduction",
            "A raving introduction: name + genuine rave + conversation tee-up",
            "A gold star with no follow-through",
            "The Franklin effect"
          ],
          answer: 1,
          explain: "The raver formula plants a positive label, hands them a topic, and gets Jordan talking — a triple win, and you're the connector both remember."
        },
        {
          q: "A guest is furious about being double-charged. You say \"that's incredibly frustrating — I get why you're heated\" before anything else. Which step are you on?",
          options: [
            "Transform — offering the fix",
            "The boomerang",
            "Name — reflecting their emotion in their own words",
            "Understand — gathering the story"
          ],
          answer: 2,
          explain: "Name comes first in the NUT Job. Validating with THEIR words opens the release valve — staying robot-calm while they're heated just infuriates them. Solutions wait for the sigh."
        },
        {
          q: "Before walking the floor you reset: shoulders back and down, chin level, hands visible, phone away. What is that called?",
          options: [
            "The Launch Stance",
            "Steepling",
            "Fronting",
            "The 3-in-3 rule"
          ],
          answer: 0,
          explain: "The Launch Stance is the everyday winner posture — it answers \"winner or loser?\" nonverbally. The phone slump (head bowed, arms pinned) is its evil twin."
        },
        {
          q: "A mellow guest talks low and slow, so you drop your volume and pace to match instead of hitting him with full promoter energy. That's...",
          options: [
            "The Danger Zone",
            "Mirroring — meeting people where they are",
            "Distancing",
            "Vocal fry"
          ],
          answer: 1,
          explain: "Wowing is meeting people where they are, not maximum energy. Subtle matching of posture, pace, and volume builds trust fast — just never mirror negative cues."
        },
        {
          q: "You mention sneakers and the quiet guy at the table lights up — leaning in, longer answers, eyebrows popping. What did you find?",
          options: [
            "A hot button — dig for the backstory",
            "A punctuator — ignore it",
            "A gremlin",
            "The similarity-attraction effect failing"
          ],
          answer: 0,
          explain: "Those engagement cues (lean, longer replies, eyebrow raise, bigger gestures) mean you hit a topic that lights him up. Probe with \"how'd you get into that?\" and stay on it."
        },
        {
          q: "You ask the venue manager \"you know this city better than anyone — where should I take a client Tuesday?\" Why does this make him like you MORE?",
          options: [
            "Flattery always works",
            "The Franklin effect — doing you a small kindness bonds him to you",
            "The Ikea effect — he built your itinerary",
            "The spotlight effect"
          ],
          answer: 1,
          explain: "Asking for genuine advice admits a little vulnerability, gets him talking, and flips the favor-liking switch: the person who HELPS ends up liking the person they helped."
        }
      ]
    }
  ],

  // ==========================================================================
  // FLASHCARDS — term on the front, plain English on the back
  // ==========================================================================
  flashcards: [
    {
      id: "lingo-fc-captivate",
      name: "Captivate Lingo",
      icon: "📖",
      skill: "cap-spark",
      cards: [
        {
          front: "Conversation Sparker",
          back: "A novelty question that replaces autopilot small talk. Instead of \"how's it going?\" — \"what's been the highlight of your night?\" You get a story instead of a shrug."
        },
        {
          front: "Big Talk",
          back: "Conversation with actual peaks — stories, passions, surprises — instead of weather-and-work filler. Small talk is the kiddie ride; Big Talk is Space Mountain."
        },
        {
          front: "Hot Button",
          back: "A topic that visibly lights someone up: they lean in, answer longer, eyebrows pop, hands start moving. When you hit one, stay on it and dig for the backstory."
        },
        {
          front: "Thread Theory",
          back: "Hunt for genuine \"me too!\" commonalities in three categories: People (mutual contacts), Context (the shared situation), Interests (the richest). More shared threads = more likability. Never announce a mismatch."
        },
        {
          front: "The Five Whys",
          back: "Follow a shared thread with successive why-questions (borrowed from Toyota). \"Why'd you get into promoting?\" → three whys later you're at motivations and dreams, not job titles."
        },
        {
          front: "Highlighter",
          back: "Bring out the best in people: catch what's genuinely impressive and say it out loud. \"You've kept this whole table laughing all night.\" You become the highlight by giving them the highlight."
        },
        {
          front: "Emotional Gold Star",
          back: "A specific positive label — \"you're a natural connector\" — that people tend to grow into (the Pygmalion effect). Low expectations do the reverse (the golem effect)."
        },
        {
          front: "Raving Introduction",
          back: "Name + genuine rave + conversation tee-up: \"Maya, meet Jordan — he throws the city's best rooftop parties.\" Plants a label, hands them a topic, gets them talking."
        },
        {
          front: "The Triple Threat",
          back: "The nonverbal first impression: visible hands, winner posture, steady eye contact. Answers the three snap questions — friend or foe? winner or loser? ally or enemy? — before you speak."
        },
        {
          front: "Launch Stance",
          back: "Everyday winner posture: shoulders back and down, chin level, space between arms and torso, hands visible. The phone slump (head bowed, arms pinned) is accidental loser posture."
        },
        {
          front: "Social Sweet Spot",
          back: "The highest-connection positions in a room: the two ends of the bar (fresh drink in hand, ready to talk) and the host's orbit. Skip the entrance — that's peak anxiety."
        },
        {
          front: "Winger & Riser",
          back: "Your Winger: the wing-person who joins your social adventures and practices skills with you. Your Riser: the one relationship you're deliberately leveling up — a mentor, a client, a connection that could change your year."
        },
        {
          front: "The Boomerang",
          back: "The question after your story that invites theirs back: \"you ever had a night like that?\" Keeps you from hogging the mic and hands them the dopamine of self-disclosure."
        },
        {
          front: "The NUT Job",
          back: "De-escalation in three steps: Name the emotion (their exact words back), Understand what they're seeking, Transform with a fix — only AFTER the big sigh. You can't argue with a feeling, but you can acknowledge it."
        },
        {
          front: "The Franklin Effect",
          back: "Asking someone for a favor or genuine advice makes THEM like YOU more. \"Where should I take a client Tuesday? You know this city best.\" The helper bonds to the helped."
        }
      ]
    },
    {
      id: "lingo-fc-cues",
      name: "Cues Lingo",
      icon: "🏷️",
      skill: "cues-scale",
      cards: [
        {
          front: "Cue",
          back: "Any signal beyond your literal words — body language, vocal tone, word choice, colors, props. Four channels: nonverbal, vocal, verbal, imagery. Being read constantly, both directions."
        },
        {
          front: "Baseline",
          back: "A person's normal: resting face, usual energy, habit gestures. Only a DEVIATION from baseline is signal — some people just always sit arms-crossed."
        },
        {
          front: "Cue Cluster",
          back: "The safety rule: never judge on one cue. Require three incongruent cues around the SAME topic before concluding anything. There is no single Pinocchio's-nose lie cue."
        },
        {
          front: "The Charisma Scale",
          back: "Charisma = warmth + competence. People scan warmth first (can I trust you?), then competence (can I rely on you?). The goal is high on both; the Danger Zone is low on both."
        },
        {
          front: "The Danger Zone",
          back: "Low warmth + low competence: overlooked, dismissed, undervalued. You land there by muting your cues (sterile texts, flat face) or leaking negative ones — not by being a bad person."
        },
        {
          front: "Fronting",
          back: "Aim your three T's — toes, torso, top (head) — at whoever matters right now. Fastest \"you matter\" signal there is. Decode: toes at the exit = they want to leave."
        },
        {
          front: "Blocking",
          back: "A barrier across your torso: crossed arms, clutched tablet, bag hugged to the chest. Reads as protection or closed-ness. Visibly removing a barrier (anti-blocking) builds trust fast."
        },
        {
          front: "Steepling",
          back: "Fingertips together, palms facing — a power pose for your hands. Calm, confident, palms visible, and it anchors fidgeting. Don't drum the fingers."
        },
        {
          front: "Expansion",
          back: "Claim a little more space to signal confidence: shoulders down, feet slightly wider, thumbs forward. Inches, not superhero poses — and it calms YOU down too."
        },
        {
          front: "Uptalk",
          back: "Pitch rising at the end of a statement? You just asked your own price as a question. Reads as insecurity and invites haggling. Watch it on names, prices, and deadlines."
        },
        {
          front: "Downward Inflection",
          back: "Ending statements with level or falling pitch — the sound of certainty. \"The minimum is two bottles.\" Period. Practice it on your own name and your rate."
        },
        {
          front: "Vocal Fry",
          back: "The creaky bacon-sizzle rattle when you run out of breath at the end of sentences. Reads as anxious or careless, not cool. Fix: shorter sentences, more breath, a touch more volume."
        },
        {
          front: "Savor Smile",
          back: "A genuine smile that spreads slowly and crinkles the eyes. Rated more attractive and authentic than the instant flash. Fake smiles live on the lower face only — and don't fool anyone."
        },
        {
          front: "Eyebrow Flash",
          back: "A sub-second brow raise — the fastest interest and acknowledgment cue humans have. Great across a loud room. Brows up, NOT lids up: visible upper eye-whites reads as fear."
        },
        {
          front: "Mirroring",
          back: "Subtly match their posture, pace, volume, and even word choices. Builds fast trust (and better deals). Mirror only positive, open cues — and keep it subtle, never Simon Says."
        }
      ]
    }
  ]
};
