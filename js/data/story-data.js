/* ============================================================
   story-data.js — "The Long Night in Nocturne"
   Pure content for Story Mode. No logic lives here.
   Original world, original creatures, original text.
   Global: StoryData  (var, not const — must survive re-eval)
   ============================================================ */

var StoryData = (function () {

  /* ---------- evolution tiers (see design doc §2.1) ----------
     stage is DERIVED at runtime from skill XP + distinct completed
     quests in that skill. Both conditions must be met. Apex lines
     additionally require their region badge for stage 3.          */
  function common() {
    return { s2: { xp: 45, quests: 2 }, s3: { xp: 160, quests: 5 } };
  }
  function standard() {
    return { s2: { xp: 60, quests: 2 }, s3: { xp: 220, quests: 6 } };
  }
  function apex(badge) {
    return { s2: { xp: 80, quests: 3 }, s3: { xp: 300, quests: 8, badge: badge } };
  }

  // ---------- story beats ----------
  const beats = {

    "beat-prologue":
      "Nocturne is one building pretending to be a city. Street level to roof, every floor is a room you could be good in — and on every floor there's already a version of you standing in the corner, saying nothing.\n" +
      "You've got a field guide with twenty-four blank pages and a long night ahead of you. Fair warning: nothing in this book fills itself in. It fills in when you go do the thing.",

    "beat-fade-0":
      "There's a guy leaning on the wall by the door with your exact posture. He doesn't introduce himself. People call him Fade.\n" +
      "\"You already came,\" he says, nodding at the entrance. \"Showing up counts. Honestly, nobody would even notice if you got back in the car right now.\"\n" +
      "He's not wrong. That's the problem with him — he's never quite wrong.",

    "beat-fade-0-win":
      "You go in. Fade doesn't follow; he never does. He just walks around to whichever exit you'll pass next and waits there. Behind you the door swings shut on the version of tonight where you didn't.",

    "beat-r1-intro":
      "Velvet Row is the block outside every door in Nocturne: rope, list, cold air, everyone quietly deciding about everyone. Two seconds is all anybody gets out here, and nobody's being cruel about it — that's just how fast the machinery runs.\n" +
      "At the end of the street, Reyna Cole works the rope. Eleven years on that door. She says the whole thing is learnable in one night, and she says it like she's tired of repeating it.",

    "beat-gym1-intro":
      "Reyna doesn't look at your shoes. \"Hands,\" she says. \"Shoulders. Eyes. That's the entire exam, and everybody flunks it standing in a huddle three feet inside the door.\"\n" +
      "She lifts the rope about four inches. \"Go stand where the night is actually happening, open three people properly, and come back and tell me their names.\"",

    "beat-gym1-win":
      "Reyna hears three names and doesn't ask how you got them. \"You walked past the door huddle,\" she says. \"Most people never do. They stand there all night and call it warming up.\"\n" +
      "She pins something small to your jacket and points down the hall. \"Long Bar's that way. Ivo'll talk your ear off. Let him.\"",

    "beat-fade-1":
      "Fade's waiting on the stairs with a drink he isn't drinking. \"Good door,\" he says. \"Easy door, though. Nice woman, low stakes, nobody you actually wanted to impress.\" He shrugs like he's on your team. \"You could stop here, on a win. That's the smart play.\"\n" +
      "It's the same sentence you've used on yourself at eleven at night, a hundred times, with the car already running.",

    "beat-fade-1-win":
      "You go do the thing he said wasn't worth doing, and it's mostly fine — which is the part he never mentions. When you look back, he's three rooms behind you, still nodding.",

    "beat-r2-intro":
      "The Long Bar runs the whole floor and never ends the same way twice. This is where the two seconds you bought at the door either turn into something or evaporate into weather talk.\n" +
      "Ivo Marchetti has been behind this bar since before you were old enough to be in front of it, and he claims he has never once had a dead conversation on his shift. Stand still long enough and he'll prove it on you.",

    "beat-gym2-intro":
      "Ivo pours something you didn't order and slides it over. \"Everybody thinks talking is the hard part. Talking's easy. Staying is hard.\"\n" +
      "He taps the bar twice. \"Find three things you've genuinely got in common with a stranger. Tell me one real story in under two minutes. Then make two people who've never met glad they met. Do that and this stool's yours whenever you want it.\"",

    "beat-gym2-win":
      "Ivo listens to your story with his arms uncrossed, which around here is a standing ovation. \"You stopped interviewing people,\" he says. \"That's the whole graduation.\"\n" +
      "He slides a stamped coaster across the bar and tips his head at the stairs. \"Mezzanine's up there. Flash is up there. She'll see you before you see her.\"",

    "beat-fade-2":
      "Fade falls into step beside you without being invited. \"You're doing a lot tonight,\" he says, gently, the way a friend would. \"People notice when someone's trying.\"\n" +
      "Then the actual knife, soft as anything: \"You were more likable when you were quiet.\"\n" +
      "You've believed that one before. On the ride home. Music off.",

    "beat-fade-2-win":
      "You take up the space anyway. Nobody flinches. Two people lean in. Fade goes quiet, which is the only thing he was ever genuinely good at.",

    "beat-r3-intro":
      "The Mezzanine hangs over the whole floor, and from up here a night reads like a chart — who's fronting who, which table's about to break up, where the energy went. Faces flash things for half a second and then take them back. The trick isn't seeing more. The trick is not convicting anybody on a single frame.\n" +
      "June Tanaka shoots from this rail every weekend and knows how a night ends before it's half over.",

    "beat-gym3-intro":
      "Flash doesn't lower the camera to talk to you. \"Everyone wants reading people to be a superpower. It's a habit. Look, wait, look again.\"\n" +
      "She finally glances over. \"Ten minutes at this rail, five cues, and I want the context with each one. Find one person whose mouth and face disagree and do something kind about it. Then figure out what somebody's actually here to get — and go check whether you're right.\"",

    "beat-gym3-win":
      "Flash scrolls back through the night and stops on a frame of you mid-conversation, leaned in, mouth shut. \"That's somebody listening,\" she says. \"Not somebody waiting for a gap to talk in. You can't fake that in a photo.\"\n" +
      "She hands you the print and points up. \"Roof. Cass has been asking about you, which is either very good or very annoying.\"",

    "beat-fade-3":
      "Fade's on the landing and this time he doesn't do the friendly voice. \"You like it up there,\" he says. \"Watching. Reading everybody. Very safe.\" He steps aside so you can get past, which is somehow worse than blocking it. \"You've turned hiding into a skill and given it a nice name.\"\n" +
      "He's found the true thing. That's the only thing he's ever really doing.",

    "beat-fade-3-win":
      "So you put the notebook down and get into the middle of it — badly, out loud, in front of people. It's clumsy. Somebody laughs. It's fine. Fade doesn't have a line ready for that one.",

    "beat-r4-intro":
      "The roof is the last floor and the smallest: one bar, string lights, the whole city breathing underneath you. Nobody up here is trying to be liked. They're busy making other people comfortable, which turns out to be the same thing viewed from the other side.\n" +
      "Cass Amari owns the place and started at coat check. She says the job never actually changed.",

    "beat-gym4-intro":
      "Cass hands you a tray you never agreed to carry. \"Up here you don't get to be a guest.\"\n" +
      "She counts it off on her fingers. \"Find whoever's standing at the edge and bring them in. Give one thing away with a because attached to it. Ask somebody for advice you actually need — real advice, not a favor you're pretending is advice.\"\n" +
      "Then she smiles. \"And tell somebody no tonight. Clean. No excuses. That last one's the hard one and you know it.\"",

    "beat-gym4-win":
      "Cass finds you an hour later in the middle of a conversation you didn't start and don't need to be running. \"There it is,\" she says. \"You stopped auditioning.\"\n" +
      "She pins the last badge on and looks out at the skyline. \"You know what coat check taught me? Everybody in that room is nervous. You just get to be the one who notices first.\"",

    "beat-fade-4":
      "Fade's on the roof, alone at the far rail. Up close he's exactly your height and wearing what you wore the first night.\n" +
      "\"You know I'm not leaving,\" he says. \"I'm the part of you that wants a quiet Tuesday and a closed door. Some nights I'm right about that.\"\n" +
      "He puts out a hand — an actual hand, visible, held the way you learned on Velvet Row. \"So. What do we do.\"",

    "beat-fade-4-win":
      "You don't beat him, because there was never anything there to beat. You give him the nights he's genuinely right about, and you keep the rest. Then you walk back into the middle of the roof, where the noise is, and you stay.",

    "beat-ending":
      "Twenty-four pages. Four badges. A city that turned out to be a building you now know your way around. And none of it happened in here — every creature in that book got bigger because you walked into a room you could have skipped and said a thing you could have swallowed.\n" +
      "Nocturne doesn't end. The rooms just get better. Go find the next door.",

    "beat-afterhours":
      "After Hours: the badges are done but the Cuedex isn't. Anything still faint in there is just a rep you haven't taken yet. Fade still turns up — some nights he's right, and now you can tell which nights those are.",
  };

  // Short display titles for the "Story so far" log.
  const beatTitles = {
    "beat-prologue": "Prologue — Twenty-four blank pages",
    "beat-fade-0": "Fade — The Car Door",
    "beat-fade-0-win": "Fade — The Car Door (cleared)",
    "beat-r1-intro": "Velvet Row",
    "beat-gym1-intro": "The Rope — Reyna Cole",
    "beat-gym1-win": "The Rope — cleared",
    "beat-fade-1": "Fade — The Smart Play",
    "beat-fade-1-win": "Fade — The Smart Play (cleared)",
    "beat-r2-intro": "The Long Bar",
    "beat-gym2-intro": "The Long Bar — Ivo Marchetti",
    "beat-gym2-win": "The Long Bar — cleared",
    "beat-fade-2": "Fade — You Were More Likable Quiet",
    "beat-fade-2-win": "Fade — You Were More Likable Quiet (cleared)",
    "beat-r3-intro": "The Mezzanine",
    "beat-gym3-intro": "The Long Lens — June \"Flash\" Tanaka",
    "beat-gym3-win": "The Long Lens — cleared",
    "beat-fade-3": "Fade — A Nice Name for Hiding",
    "beat-fade-3-win": "Fade — A Nice Name for Hiding (cleared)",
    "beat-r4-intro": "The Rooftop",
    "beat-gym4-intro": "The Rooftop — Cass Amari",
    "beat-gym4-win": "The Rooftop — cleared",
    "beat-fade-4": "Fade — What Do We Do",
    "beat-fade-4-win": "Fade — What Do We Do (cleared)",
    "beat-ending": "The Long Night",
    "beat-afterhours": "After Hours",
  };

  // ---------- regions ----------
  const regions = [
    {
      id: "r1",
      name: "Velvet Row",
      emoji: "🚪",
      subtitle: "the street, the line, the door",
      theme: "First Impressions",
      color: "var(--warm)",
      skills: ["cap-control", "cap-capture", "cap-spark", "cues-scale", "cues-warmth-body", "cues-imagery"],
      neonIds: ["n-mapp", "n-triplet", "n-dialla", "n-browflash", "n-hue", "n-sparque"],
      gymId: "gym-rope",
      introBeat: "beat-r1-intro",
      unlockRival: "fade-0",
    },
    {
      id: "r2",
      name: "The Long Bar",
      emoji: "🍸",
      subtitle: "main floor",
      theme: "Conversation",
      color: "var(--gold)",
      skills: ["cap-intrigue", "cap-highlight", "cap-connect", "cues-vocal", "cues-verbal", "cues-warmth-body"],
      neonIds: ["n-threadle", "n-gleam", "n-yarnix", "n-cadence", "n-echoquill", "n-noddle"],
      gymId: "gym-longbar",
      introBeat: "beat-r2-intro",
      unlockRival: "fade-1",
    },
    {
      id: "r3",
      name: "The Mezzanine",
      emoji: "👁️",
      subtitle: "the overlook",
      theme: "Reading People",
      color: "var(--comp)",
      skills: ["cap-decode", "cap-solve", "cap-appreciate", "cap-value", "cues-cycle", "cues-danger"],
      neonIds: ["n-microflash", "n-quintile", "n-fivetongue", "n-cipher", "n-clustrio", "n-redflagg"],
      gymId: "gym-lens",
      introBeat: "beat-r3-intro",
      unlockRival: "fade-2",
    },
    {
      id: "r4",
      name: "The Rooftop",
      emoji: "🌇",
      subtitle: "the top floor",
      theme: "Presence & Leadership",
      color: "var(--violet)",
      skills: ["cap-empower", "cap-reveal", "cap-protect", "cap-engage", "cues-power-body", "cues-imagery"],
      neonIds: ["n-becausaur", "n-favora", "n-defusa", "n-attuna", "n-steeple", "n-signature"],
      gymId: "gym-rooftop",
      introBeat: "beat-r4-intro",
      unlockRival: "fade-3",
    },
  ];

  // ---------- the 24 Neons ----------
  const neons = [

    /* ===== Region 1 — Velvet Row ===== */
    {
      id: "n-mapp", line: "Mapp", emoji: "🗺️", skill: "cap-control", region: "r1", tier: "standard",
      technique: "Sorting venues into thrive / neutral / survive, and working the event map — walk past the entry huddle, avoid the bathroom-hover and food-table traps, post up at the end of the bar or near the host.",
      stages: [
        { name: "Scoutle", flavor: "Hides behind the coat rack and maps the exits before it maps anything else." },
        { name: "Mapp", flavor: "Knows which three rooms make it good and which three make it small — and picks accordingly." },
        { name: "Grandplan", flavor: "Walks into a strange venue and owns the floor plan in about eleven seconds." },
      ],
      catch: "Before your next outing, pick your room and your exact spot in advance — then go stand there.",
      demo: "zones-map",
      evo: standard(),
    },
    {
      id: "n-triplet", line: "Triplet", emoji: "🤝", skill: "cap-capture", region: "r1", tier: "apex",
      technique: "The three-part nonverbal open — hands visible, launch stance (shoulders back and down, chin level, air between arms and torso), 60–70% eye contact, plus a dry vertical handshake.",
      stages: [
        { name: "Pocketpaw", flavor: "Both hands jammed in its pockets. Means well. Reads as nobody." },
        { name: "Triplet", flavor: "Hands out, shoulders down, chin level: three questions answered before it says a word." },
        { name: "Threshold Titan", flavor: "Wins the room in two seconds and never has to win it again." },
      ],
      catch: "Walk into one room today with hands visible, shoulders back, chin level — and hold it for the first sixty seconds.",
      evo: apex("badge-threshold"),
    },
    {
      id: "n-dialla", line: "Dialla", emoji: "⚖️", skill: "cues-scale", region: "r1", tier: "common",
      technique: "The warmth × competence grid and the charisma dial — read which axis a room is asking for and turn the knob toward it.",
      stages: [
        { name: "Tipling", flavor: "Wobbles: too warm to be taken seriously, or too sharp to be liked." },
        { name: "Dialla", flavor: "Reads which axis the room wants and turns the knob without announcing it." },
        { name: "Twinpeak", flavor: "Lives in the top-right corner and lends warmth or weight to whoever's short on it." },
      ],
      catch: "Place yourself on the grid below, say it out loud to one person, and ask whether they'd put you there too.",
      demo: "charisma-grid",
      evo: common(),
    },
    {
      id: "n-browflash", line: "Browflash", emoji: "🤨", skill: "cues-warmth-body", region: "r1", tier: "common",
      technique: "The eyebrow raise — the fastest interest signal there is — and the three-warmth-cues-in-three-minutes rule.",
      stages: [
        { name: "Flick", flavor: "A twitch of interest it doesn't dare finish." },
        { name: "Browflash", flavor: "Fastest warmth signal in the city. Fires before the mouth even opens." },
        { name: "Warmwave", flavor: "Three warmth cues inside three minutes, every time, without thinking about it." },
      ],
      catch: "Greet three people today with an eyebrow flash and their name. Count what comes back.",
      evo: common(),
    },
    {
      id: "n-hue", line: "Hue", emoji: "🎨", skill: "cues-imagery", region: "r1", tier: "common",
      technique: "Visual cues fire before words — a signature color or object as your nonverbal brand, because the brain reads an image in milliseconds.",
      stages: [
        { name: "Greyling", flavor: "Dresses to disappear, then wonders why nobody came over." },
        { name: "Hue", flavor: "Owns one color and wears it like a name tag." },
        { name: "Marquee", flavor: "You can tell it's in the building from the parking lot." },
      ],
      catch: "Pick one color or object as yours. Wear or carry it out once, on purpose.",
      evo: common(),
    },
    {
      id: "n-sparque", line: "Sparque", emoji: "⚡", skill: "cap-spark", region: "r1", tier: "apex",
      technique: "Killing the script — novelty openers instead of \"how are you,\" hunting hot buttons, and locking names in by repeating, spelling and anchoring them.",
      stages: [
        { name: "Fizzle", flavor: "Opens with \"how are you\" and dies on impact." },
        { name: "Sparque", flavor: "Trades the script for a question nobody's been asked all night." },
        { name: "Bonfire", flavor: "Turns a coat-check line into the best conversation of somebody's month." },
      ],
      catch: "Replace one \"how are you\" or \"what do you do\" with a real sparker today.",
      evo: apex("badge-threshold"),
    },

    /* ===== Region 2 — The Long Bar ===== */
    {
      id: "n-threadle", line: "Threadle", emoji: "🧵", skill: "cap-intrigue", region: "r2", tier: "apex",
      technique: "Hunting shared threads across people, context and interests, then following one with successive whys instead of announcing a mismatch.",
      stages: [
        { name: "Snag", flavor: "Finds one thing in common and immediately drops it." },
        { name: "Threadle", flavor: "Pulls a thread and keeps pulling. Three commonalities inside three minutes." },
        { name: "Tapestrix", flavor: "Weaves strangers into people who apparently knew each other all along." },
      ],
      catch: "Find three things in common with one new person before the conversation ends.",
      evo: apex("badge-opentab"),
    },
    {
      id: "n-gleam", line: "Gleam", emoji: "🖍️", skill: "cap-highlight", region: "r2", tier: "standard",
      technique: "Being the highlighter — raving introductions (name + genuine hype + a topic to start on), specific positive labels, matching other people's excitement.",
      stages: [
        { name: "Dimwick", flavor: "Waits to be noticed. A plan that has never once worked." },
        { name: "Gleam", flavor: "Introduces you better than you would have introduced yourself." },
        { name: "Limelight", flavor: "Everyone it touches leaves the night feeling like the good version of themselves." },
      ],
      catch: "Introduce two people with a genuine rave and a topic for them to start on.",
      evo: standard(),
    },
    {
      id: "n-yarnix", line: "Yarnix", emoji: "📖", skill: "cap-connect", region: "r2", tier: "apex",
      technique: "The story stack — one banked anecdote per trigger topic, built with a hook, a struggle and vivid sensory words, capped at two minutes, then boomeranged back.",
      stages: [
        { name: "Mumble", flavor: "Has three good stories and tells none of them." },
        { name: "Yarnix", flavor: "Hook, snag, payoff, ninety seconds, then hands the mic straight back." },
        { name: "Sagalore", flavor: "Two brains sync up, and neither of them notices the room went quiet." },
      ],
      catch: "Bank one story for a trigger topic (weekend, weather, work) and actually tell it tonight.",
      evo: apex("badge-opentab"),
    },
    {
      id: "n-cadence", line: "Cadence", emoji: "🎙️", skill: "cues-vocal", region: "r2", tier: "standard",
      technique: "Lowest comfortable pitch on the out-breath, firm downward inflection on statements, breathing pauses instead of fillers.",
      stages: [
        { name: "Uptick", flavor: "Ends every sentence like it's asking permission?" },
        { name: "Cadence", flavor: "Lands statements on the downbeat and stops apologizing with its voice." },
        { name: "Groundtone", flavor: "Says a hard number out loud and the room believes it before the sentence finishes." },
      ],
      catch: "Say one price, plan or hard statement today with a firm downward ending.",
      evo: standard(),
    },
    {
      id: "n-echoquill", line: "Echoquill", emoji: "✍️", skill: "cues-verbal", region: "r2", tier: "standard",
      technique: "Verbal mirroring in the other person's exact words, warm vs competent vs charismatic word choice, and killing sterile boilerplate.",
      stages: [
        { name: "Blurb", flavor: "Sends messages that could have been written by a printer." },
        { name: "Echoquill", flavor: "Gives your own words back to you, and you feel understood." },
        { name: "Wordwright", flavor: "Picks every word for warmth or weight, and never once sounds like a form letter." },
      ],
      catch: "Reuse three of someone's exact words back to them in one conversation.",
      evo: standard(),
    },
    {
      id: "n-noddle", line: "Noddle", emoji: "🙆", skill: "cues-warmth-body", region: "r2", tier: "standard",
      technique: "The slow triple nod, the head tilt, and listening sounds — the cues that make people keep talking.",
      stages: [
        { name: "Blink", flavor: "Nods at the wrong speed and the story stops dead." },
        { name: "Noddle", flavor: "Three slow nods, and people talk two-thirds longer without noticing why." },
        { name: "Confidante", flavor: "People tell it things they hadn't quite told themselves yet." },
      ],
      catch: "Slow-triple-nod when someone pauses tonight — and count how much longer they keep going.",
      evo: standard(),
    },

    /* ===== Region 3 — The Mezzanine ===== */
    {
      id: "n-microflash", line: "Microflash", emoji: "🎭", skill: "cap-decode", region: "r3", tier: "apex",
      technique: "The seven universal microexpressions, and the congruency check — when the words and the face disagree, answer the face.",
      stages: [
        { name: "Twitchling", flavor: "Sees something cross a face and immediately talks itself out of it." },
        { name: "Microflash", flavor: "Catches the half-second flash and names it silently." },
        { name: "Truthface", flavor: "Hears \"I'm fine,\" watches the face, and answers the face." },
      ],
      catch: "Catch one microexpression today and silently name it. Anger, contempt, fear — one is plenty.",
      evo: apex("badge-longlens"),
    },
    {
      id: "n-quintile", line: "Quintile", emoji: "🧩", skill: "cap-solve", region: "r3", tier: "standard",
      technique: "Speed-reading the five personality dials from questions, behavior and environment, then choosing to optimize or compromise rather than trying to change anyone.",
      stages: [
        { name: "Guessling", flavor: "Assumes everyone is wired the way it's wired. They are not." },
        { name: "Quintile", flavor: "Reads five dials off one question and one desk." },
        { name: "Pentarch", flavor: "Pitches the same idea five different ways and lands it every time." },
      ],
      catch: "Guess one person's five dials, then ask a single question to check just one of them.",
      evo: standard(),
    },
    {
      id: "n-fivetongue", line: "Fivetongue", emoji: "💝", skill: "cap-appreciate", region: "r3", tier: "common",
      technique: "The five appreciation languages — words, gifts, touch, acts of service, quality time — delivered in their language, not yours.",
      stages: [
        { name: "Giftgoof", flavor: "Gives everyone the thing it would have wanted. Nobody's face lights up." },
        { name: "Fivetongue", flavor: "Picks the right one out of five and watches the difference land." },
        { name: "Heartfluent", flavor: "Fluent in all five, and asks outright when it isn't sure." },
      ],
      catch: "Do one appreciation act in someone else's language rather than your own.",
      evo: common(),
    },
    {
      id: "n-cipher", line: "Cipher", emoji: "💎", skill: "cap-value", region: "r3", tier: "apex",
      technique: "Finding a person's primary value — love, service, status, money, goods or information — from their complaints, brags, and what keeps them up at night.",
      stages: [
        { name: "Hunchling", flavor: "Hears a complaint and hears only a complaint." },
        { name: "Cipher", flavor: "Hears a complaint and hears the resource somebody's starving for." },
        { name: "Keymaster", flavor: "Knows what every person in the room actually came here to get." },
      ],
      catch: "Listen for one person's complaint or brag today, and name the resource sitting underneath it.",
      evo: apex("badge-longlens"),
    },
    {
      id: "n-clustrio", line: "Clustrio", emoji: "🔍", skill: "cues-cycle", region: "r3", tier: "common",
      technique: "The cue-detective rules — no single cue is a verdict, require three flags on one topic, check context first, learn baselines and meaningless habit gestures.",
      stages: [
        { name: "Jumpling", flavor: "Sees one crossed arm and hands down a conviction." },
        { name: "Clustrio", flavor: "Waits for three flags on the same topic before it believes anything." },
        { name: "Baseliner", flavor: "Knows everyone's resting face and their pointless habits, so the real signal glows." },
      ],
      catch: "Before judging one negative cue today, list two innocent explanations for it first.",
      evo: common(),
    },
    {
      id: "n-redflagg", line: "Redflagg", emoji: "🚨", skill: "cues-danger", region: "r3", tier: "standard",
      technique: "Distancing, blocking, self-soothing, the shame cue and contempt — decoded in others with the cluster rule, and hunted down in your own leaks.",
      stages: [
        { name: "Fidgetling", flavor: "Leaks its own nerves everywhere and calls it a personality." },
        { name: "Redflagg", flavor: "Spots the arm-cross and clocks exactly what was said right before it." },
        { name: "Defuser", flavor: "Finds the trigger, fixes it, rebuilds the room — and leaks nothing itself." },
      ],
      catch: "Note one moment someone's body closed mid-conversation, and what was said immediately before.",
      evo: standard(),
    },

    /* ===== Region 4 — The Rooftop ===== */
    {
      id: "n-becausaur", line: "Becausaur", emoji: "🔑", skill: "cap-empower", region: "r4", tier: "standard",
      technique: "Handing out ownership instead of orders — attach a because to every request, solicit by skill rather than duty, and let people control the how.",
      stages: [
        { name: "Orderling", flavor: "Barks the what and never the why. Gets grudging compliance and a lot of sighing." },
        { name: "Becausaur", flavor: "Attaches a because to everything, and people start saying yes." },
        { name: "Kingmaker", flavor: "Gives away the entire how and gets back work better than it would have done itself." },
      ],
      catch: "Attach a real because to your next three asks.",
      evo: standard(),
    },
    {
      id: "n-favora", line: "Favora", emoji: "🪞", skill: "cap-reveal", region: "r4", tier: "apex",
      technique: "Vulnerability as a bonding tool — asking for advice you genuinely need, the humanizing power of visible flaws, and the anti-perfect list (\"I don't know,\" \"I was wrong,\" \"what does that mean?\").",
      stages: [
        { name: "Askling", flavor: "Would rather look fine than get help." },
        { name: "Favora", flavor: "Asks for the advice it actually needs — and the asking is the bond." },
        { name: "Openheart", flavor: "Says \"I don't know\" out loud and somehow gets more respect, not less." },
      ],
      catch: "Ask one person this week for advice you genuinely need.",
      evo: apex("badge-skyline"),
    },
    {
      id: "n-defusa", line: "Defusa", emoji: "🛡️", skill: "cap-protect", region: "r4", tier: "standard",
      technique: "Difficult behavior is hijacked fear — name the emotion in their words, understand what they're after, and only then transform. Plus the clean no: thanks, decline, zero reasons.",
      stages: [
        { name: "Flinchling", flavor: "Freezes when somebody gets loud, then replays it for three days." },
        { name: "Defusa", flavor: "Names the emotion out loud and the temperature drops ten degrees." },
        { name: "Ironcalm", flavor: "Says no with thanks, no excuses, and no aftermath." },
      ],
      catch: "Deliver one clean no this week: thanks, decline, no reasons given.",
      evo: standard(),
    },
    {
      id: "n-attuna", line: "Attuna", emoji: "🧲", skill: "cap-engage", region: "r4", tier: "apex",
      technique: "Attunement — bookending interactions with genuine gladness, pulling edge-standers into the group, and treating every interaction as yours to make interesting.",
      stages: [
        { name: "Edgeling", flavor: "Stands at the edge of the group, wanting in, saying nothing." },
        { name: "Attuna", flavor: "Opens and closes every interaction with something it genuinely means." },
        { name: "Magnetar", flavor: "The edge of the room quietly disappears wherever it's standing." },
      ],
      catch: "Find someone standing at the edge of a group tonight and pull them in.",
      evo: apex("badge-skyline"),
    },
    {
      id: "n-steeple", line: "Steeple", emoji: "🗿", skill: "cues-power-body", region: "r4", tier: "standard",
      technique: "The posture micro-fix (shoulders down, feet wider, thumbs forward), the steeple as a cure for fidgeting, explanatory gestures, and fluid economical movement.",
      stages: [
        { name: "Twiddle", flavor: "Its hands can't decide what to do, so they do all of it at once." },
        { name: "Steeple", flavor: "Parks the hands, and the sentence gets heavier." },
        { name: "Monolith", flavor: "Every gesture means something. The stillness in between means more." },
      ],
      catch: "Replace one bout of hand fidgeting with a steeple today.",
      evo: standard(),
    },
    {
      id: "n-signature", line: "Signature", emoji: "🖼️", skill: "cues-imagery", region: "r4", tier: "standard",
      technique: "The deliberate environment — props, backdrop, and a signature object that primes how people read you before you speak.",
      stages: [
        { name: "Blankslate", flavor: "Beige background, beige impression." },
        { name: "Signature", flavor: "Every frame it appears in is saying something on purpose." },
        { name: "Landmark", flavor: "People describe it to other people using the same three details, every time." },
      ],
      catch: "Put one deliberate warmth cue and one competence cue into a space you'll be seen in.",
      evo: standard(),
    },
  ];

  // ---------- gyms ----------
  const gyms = [
    {
      id: "gym-rope",
      name: "The Rope",
      title: "Two Seconds",
      region: "r1",
      leader: {
        name: "Reyna Cole",
        role: "head door host",
        blurb: "Eleven years on the rope, decides in two seconds, has never once been rude about it. Believes the door is a solvable problem and is faintly annoyed that people treat it like weather.",
      },
      badge: "badge-threshold",
      introBeat: "beat-gym1-intro",
      winBeat: "beat-gym1-win",
      challenge: [
        "Arrive somewhere and walk past the entry huddle to a real spot — end of the bar, near the host, edge of the action — inside sixty seconds of getting in the door.",
        "Open three separate people with a sparker (not \"how are you\"): hands visible, shoulders back, eyebrow flash.",
        "Get all three names, use each one out loud, and still have them when you leave.",
      ],
      rewardXp: 120,
      rewardSkill: "cap-capture",
    },
    {
      id: "gym-longbar",
      name: "The Long Bar",
      title: "Last Call for Small Talk",
      region: "r2",
      leader: {
        name: "Ivo Marchetti",
        role: "the bar's oldest bartender",
        blurb: "Pours you things you didn't order. Claims he has never had a dead conversation on his shift and treats that as a professional standard rather than a boast.",
      },
      badge: "badge-opentab",
      introBeat: "beat-gym2-intro",
      winBeat: "beat-gym2-win",
      challenge: [
        "Hold one conversation past the eight-minute mark using threads only — find three real commonalities and follow one of them down.",
        "Tell one prepared story: hook, snag, payoff, under two minutes, then boomerang a question back.",
        "Make one raving introduction between two people who hadn't met, and give one specific compliment about something somebody chose.",
      ],
      rewardXp: 120,
      rewardSkill: "cap-connect",
    },
    {
      id: "gym-lens",
      name: "The Long Lens",
      title: "Look, Wait, Look Again",
      region: "r3",
      leader: {
        name: "June \"Flash\" Tanaka",
        role: "house photographer",
        blurb: "Shoots from the rail, talks without lowering the camera, knows how a night ends before it's half over. Insists reading people is a habit, not a gift, and finds the \"superpower\" framing embarrassing.",
      },
      badge: "badge-longlens",
      introBeat: "beat-gym3-intro",
      winBeat: "beat-gym3-win",
      challenge: [
        "Spend ten minutes reading a room from one vantage point. Log five cues with their context — what was happening, what was said just before.",
        "Catch one incongruence (the words and the face disagree) and respond to it kindly — name it, soothe it, or just soften the moment — instead of pretending you didn't see.",
        "Guess one person's primary value and one personality dial, then ask a question that actually checks whether you were right.",
      ],
      rewardXp: 120,
      rewardSkill: "cap-decode",
    },
    {
      id: "gym-rooftop",
      name: "The Rooftop",
      title: "You Don't Get to Be a Guest",
      region: "r4",
      leader: {
        name: "Cass Amari",
        role: "owner",
        blurb: "Started at coat check and says the job never changed: notice who's nervous first. Hands you tasks you didn't agree to. Deeply unimpressed by charm and extremely impressed by people who make other people comfortable.",
      },
      badge: "badge-skyline",
      introBeat: "beat-gym4-intro",
      winBeat: "beat-gym4-win",
      challenge: [
        "Host: pull one edge-stander into a group, make one introduction, and run one small moment for the whole table — a toast, a poll, a question everybody answers.",
        "Give one real thing away with a because attached — a task, a decision, the how.",
        "Ask one person for advice you genuinely need, and deliver one clean no: thanks, decline, no excuses.",
      ],
      rewardXp: 120,
      rewardSkill: "cap-engage",
    },
  ];

  // ---------- badges (story-internal, also mirrored into Store.awardBadge) ----------
  const badges = [
    { id: "badge-threshold", name: "Threshold Badge", emoji: "🚪", icon: "🚪",
      desc: "Cleared The Rope on Velvet Row — past the huddle, three people opened, three names kept." },
    { id: "badge-opentab", name: "Open Tab Badge", emoji: "🍸", icon: "🍸",
      desc: "Cleared The Long Bar — threads, one real story, and two strangers glad they met." },
    { id: "badge-longlens", name: "Long Lens Badge", emoji: "📷", icon: "📷",
      desc: "Cleared The Long Lens on the Mezzanine — five cues with context, and you checked your read." },
    { id: "badge-skyline", name: "Skyline Badge", emoji: "🌇", icon: "🌇",
      desc: "Cleared The Rooftop — you hosted, you gave something away, and you said one clean no." },
  ];

  // ---------- rival: Fade (5 encounters) ----------
  const encounters = [
    {
      id: "fade-0", name: "Fade", title: "The Car Door", skill: "cap-control",
      beat: "beat-fade-0", winBeat: "beat-fade-0-win", gates: "r1",
      rungs: [
        { key: "a", text: "Say one full sentence to one person today. Staff counts. Cashiers count.", xp: 30 },
        { key: "b", text: "Walk into a room you'd normally skip and stay ten minutes.", xp: 45 },
        { key: "c", text: "Go out on a night you had already half-decided to cancel.", xp: 60 },
      ],
    },
    {
      id: "fade-1", name: "Fade", title: "The Smart Play", skill: "cap-capture",
      beat: "beat-fade-1", winBeat: "beat-fade-1-win", gates: "r2",
      rungs: [
        { key: "a", text: "Start one conversation with one stranger.", xp: 30 },
        { key: "b", text: "Stay thirty minutes past the first moment you wanted to leave.", xp: 45 },
        { key: "c", text: "Go somewhere social alone — no wingman, no safety person.", xp: 60 },
      ],
    },
    {
      id: "fade-2", name: "Fade", title: "You Were More Likable Quiet", skill: "cap-connect",
      beat: "beat-fade-2", winBeat: "beat-fade-2-win", gates: "r3",
      rungs: [
        { key: "a", text: "Say one thing out loud in a group of four or more.", xp: 30 },
        { key: "b", text: "Tell one story to a whole table.", xp: 45 },
        { key: "c", text: "Run the room for a full hour with your phone in your pocket the entire time.", xp: 60 },
      ],
    },
    {
      id: "fade-3", name: "Fade", title: "A Nice Name for Hiding", skill: "cap-reveal",
      beat: "beat-fade-3", winBeat: "beat-fade-3-win", gates: "r4",
      rungs: [
        { key: "a", text: "Say the awkward true thing once instead of the smooth safe thing.", xp: 30 },
        { key: "b", text: "Ask someone directly for something you want.", xp: 45 },
        { key: "c", text: "Introduce yourself to whoever in the room intimidates you most.", xp: 60 },
      ],
    },
    {
      id: "fade-4", name: "Fade", title: "What Do We Do", skill: "cap-engage",
      beat: "beat-fade-4", winBeat: "beat-fade-4-win", gates: "ending",
      rungs: [
        { key: "a", text: "Host something small. Two people, one hour, your idea.", xp: 30 },
        { key: "b", text: "Invite three people somewhere yourself, by name, in advance.", xp: 45 },
        { key: "c", text: "Do the thing you told yourself a year ago you weren't the type of person to do.", xp: 60 },
      ],
    },
  ];

  // ---------- post-game Fade (maintenance, never a threat) ----------
  const afterHours = {
    lines: [
      "\"Quiet one tonight,\" Fade says, without looking up. \"I'd take it.\" Some nights he's right. Tonight might not be one of them.",
      "Fade's on the corner with the same drink he never drinks. \"You've proved the point already,\" he says. He's half right, which is his usual score.",
      "\"You don't have to be on,\" Fade says — and for once that's just true. Doesn't mean you have to be off, either.",
      "Fade holds the door for you, which is new. \"Pick one,\" he says. \"Small is fine.\"",
    ],
    skill: "cap-engage",
    rungs: [
      { key: "a", text: "Say one full sentence to one stranger today.", xp: 30 },
      { key: "b", text: "Start one conversation you'd normally let pass.", xp: 45 },
      { key: "c", text: "Walk into one room tonight you'd already talked yourself out of.", xp: 60 },
    ],
  };

  // ---------- explicit unlock chain (design doc §5.1) ----------
  const order = [
    { kind: "beat", id: "beat-prologue" },
    { kind: "rival", id: "fade-0" },
    { kind: "region", id: "r1" },
    { kind: "rival", id: "fade-1" },
    { kind: "region", id: "r2" },
    { kind: "rival", id: "fade-2" },
    { kind: "region", id: "r3" },
    { kind: "rival", id: "fade-3" },
    { kind: "region", id: "r4" },
    { kind: "rival", id: "fade-4" },
    { kind: "ending", id: "beat-ending" },
  ];

  return {
    title: "The Long Night in Nocturne",
    guide: "Cuedex",
    creature: "Neon",
    gymUnlockCatches: 4,   // catch 4 of a region's 6 Neons to open its gym
    catchXp: 15,
    beatXp: 5,
    evoXp: { 2: 25, 3: 60 },
    regions: regions,
    neons: neons,
    gyms: gyms,
    badges: badges,
    // Fade — exposed both as `rival.encounters` and as the flat `rivals` list.
    rival: { name: "Fade", encounters: encounters, afterHours: afterHours },
    rivals: encounters,
    afterHours: afterHours,
    beats: beats,
    beatTitles: beatTitles,
    order: order,
  };
})();
