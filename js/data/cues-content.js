/* cues-content.js — content pack distilled from Vanessa Van Edwards' "Cues".
   Plain script (non-module). Defines one global: CuesContent.
   All text paraphrased from the Cues brief; study numbers per the brief. */

var CuesContent = {

  /* ============================== SKILLS ============================== */
  skills: [
    {
      id: "cues-scale", name: "The Charisma Scale", icon: "⚖️",
      branch: "Cues — Charisma Foundations", minLevel: 1,
      desc: "Map yourself and others on the warmth x competence grid, then dial toward the Charisma Zone.",
      detail: "Charisma is warmth plus competence, and cues on those two axes drive about 82% of the impression you make. People scan you constantly, in order: can I trust you (warmth), then can I rely on you (competence). High warmth alone gets you liked but interrupted and underpaid; high competence alone gets you respected but read as intimidating. Low on both is the Danger Zone — and muting all your cues is what drops you there, not villainy. The most charismatic people stay in the high/high zone and flex a dial: more warmth when they need buy-in, more competence when they need credibility.",
      actions: [
        "Self-place on the scale using the word test: which fits you more — trustworthy, kind, team player (warm) or impressive, powerful, expert (competent)?",
        "Diagnose the lean of the next person you talk to, then match it: chitchat and stories for warm people, agenda and data for competent people.",
        "Do one interaction today dialing your non-default axis up a notch."
      ]
    },
    {
      id: "cues-cycle", name: "Cue Cycle & Detective Rules", icon: "🔍",
      branch: "Cues — Charisma Foundations", minLevel: 1,
      desc: "Decode, internalize, encode — and never convict anyone on a single cue.",
      detail: "Every cue runs a loop: you decode signals from others, they change your own internal state, and you encode signals back. Moods jump between people within minutes, so what you spot literally shapes what you send. The detective rules keep decoding honest: no single cue is a verdict, require a cluster of three incongruent cues around one topic, check context first, learn each person's baseline and their meaningless habit gestures (punctuators), and expect the best — trusting decoders are measurably more accurate. When you do catch a negative cue, run Research, Resolve, Rapport: find the trigger, fix or soothe it, rebuild connection.",
      actions: [
        "Silently label the next negative cue you catch (that is contempt, that is a self-soothe) — naming it calms your own amygdala.",
        "Before judging any negative cue, list two innocent explanations (tired, cold room, deadline) first.",
        "Run the Rule of Three: try any new cue three times in three scenarios before keeping or discarding it."
      ]
    },
    {
      id: "cues-warmth-body", name: "Body-Language Warmth", icon: "🔥",
      branch: "Cues — Body Language", minLevel: 1,
      desc: "Head tilts, nods, eyebrow raises, real smiles, touch, and mirroring — the trust builders.",
      detail: "Warmth cues answer the question people ask first: can I trust you? The core kit is the head tilt (I want to hear more), the slow triple nod (keep going), the quick eyebrow raise (fastest interest signal there is), the savor smile that spreads slowly and reaches the eyes, appropriate touch in the hand-and-forearm zone, and subtle mirroring of posture and energy. They work fast — interviewers who nodded got people talking 67% more, and smiling makes you nearly ten times more likely to read as warm. The book's rule of thumb: show three warmth cues in the first three minutes of any interaction.",
      actions: [
        "Deploy a slow triple nod when someone shares — count how much longer they keep talking.",
        "Swap one fake smile today for either a genuine savor smile or no smile at all.",
        "Open your next new conversation with the 3-in-3 rule: three warmth cues in three minutes."
      ]
    },
    {
      id: "cues-power-body", name: "Body-Language Power", icon: "🗿",
      branch: "Cues — Body Language", minLevel: 2,
      desc: "Expansion, steepling, purposeful gestures, and palm power — the credibility builders.",
      detail: "Competence cues answer the second scan: can I rely on you? Power posture is inches, not superhero poses — shoulders down, feet planted a bit wider, thumbs rotated forward. The steeple is a power pose for your hands and a cure for fidgeting. Explanatory gestures (number gestures, big/small, me-vs-you, character hands) boost listener comprehension by roughly 60%, and the most-viewed TED speakers gesture nearly twice as much as the least viewed. The deeper principle is fluidity: smooth, economical movement signals confidence, while jerky purposeless motion leaks nerves — poker observers read hand strength best from arms alone.",
      actions: [
        "Run the posture micro-fix before your next meeting: shoulders down, feet three inches wider, thumbs forward.",
        "Replace one bout of hand fidgeting with a steeple.",
        "Show every number you say on your fingers for one whole conversation."
      ]
    },
    {
      id: "cues-danger", name: "Danger-Zone Detection", icon: "🚨",
      branch: "Cues — Body Language", minLevel: 2,
      desc: "Spot distancing, blocking, self-soothing, shame, and contempt — in others and in yourself.",
      detail: "Danger Zone cues are red flags of anxiety, discomfort, or withholding — not proof of lying, since no single Pinocchio cue exists. The big families: distancing (leaning away, stepping back, phubbing), blocking (body, mouth, and eye blocks), self-comfort (rubbing, ventilating, preening, nose touches), the shame cue (fingers to forehead, gaze down), and the negative resting expressions — brow-furrow anger, droopy sadness, and the one-sided contempt smirk that Gottman found predicts divorce with 93% accuracy. Decode them with the cluster rule and respond with Research, Resolve, Rapport; encode-side, hunt down your own leaks and retrain them.",
      actions: [
        "Do an RBF audit: photograph your neutral thinking face and check for furrow, downturned mouth, or a one-sided lift.",
        "When you spot a sudden arm-cross mid-conversation, note what was said right before it — that is the trigger.",
        "Replace one absent-minded fidget with a displacement tactic: hold a pen or press thumb to index finger at your side."
      ]
    },
    {
      id: "cues-vocal", name: "Vocal Cues", icon: "🎙️",
      branch: "Cues — Voice & Words", minLevel: 2,
      desc: "Confident pitch, no uptalk, breathing pauses, and warm vocal invitations.",
      detail: "Your voice is audited for both confidence and emotion — listeners judge you within the first 200 milliseconds of your hello. Power side: speak at your lowest comfortable natural pitch on the out-breath, kill the question inflection on statements (uptalk makes listeners scrutinize instead of listen), avoid vocal fry with shorter sentences and more breath, and swap fillers for breathing pauses — a filler-free speech with wrong facts out-persuaded an accurate one with ums. Warmth side: vocal variety (monotone reads as careless, not cool), listening sounds like mmm and uh-huh, verbal nudges like tell me more, and warm openers that show delight at the person.",
      actions: [
        "Say one price, deadline, or hard statement today with firm downward inflection.",
        "Answer your next call on the out-breath — never at the top of an inhale.",
        "Use three listening sounds in one conversation and watch the speaker extend."
      ]
    },
    {
      id: "cues-verbal", name: "Verbal Cues", icon: "✍️",
      branch: "Cues — Voice & Words", minLevel: 3,
      desc: "Warm, competent, and charismatic words — in emails, openers, closers, and compliments.",
      detail: "Words carry warmth and competence just like the body does. Warm words (together, we, collaborate, enjoy) work like a smile in text; competent words (effective, data, streamline, outcomes) work like a steeple; charismatic words (excited, team, kickoff) do both. The killer is sterile boilerplate — it signals nothing and drops you into the Danger Zone. Renaming one identical game from Wall Street to Community doubled cooperation, which is the whole thesis in one study. Verbal mirroring is the multiplier: servers who repeated orders in the customer's exact words earned about 70% more in tips, and matched compliments land hardest — praise competence to competent people, warmth to warm people.",
      actions: [
        "Audit your last five important sent emails: count warm, competent, charismatic, and sterile words.",
        "Rewrite one sterile opener or sign-off into a warm or competent one.",
        "Reuse three of the other person's exact words in your next conversation."
      ]
    },
    {
      id: "cues-imagery", name: "Image & Presence", icon: "🖼️",
      branch: "Cues — Image & Presence", minLevel: 4,
      desc: "Colors, props, backgrounds, and your nonverbal brand — cues that fire before you speak.",
      detail: "The brain registers an image in as little as 13 milliseconds and forms judgments of a person or product within 90 seconds — most of that assessment driven by color. Visual cues fire neural maps before a word lands: blue primes calm and trust, red primes dominance and attention (use it for the one callout that matters, never decoration), yellow is joy in small pops. Props and environment prime behavior too — a briefcase in a lab increased competitive behavior while a backpack increased cooperation, and glasses added 8% perceived competence at zero warmth cost. A signature object, color, or look becomes your nonverbal brand: it changes how others read you and how you read yourself.",
      actions: [
        "Audit your profile photo: head tilt, open torso, gaze direction, no sun-squint furrow, no fear-smile eye whites.",
        "Add one deliberate warmth cue and one competence cue to your video-call background.",
        "Pick a personal brand color and apply it to three assets this week."
      ]
    }
  ],

  /* ============================== DECKS ============================== */
  decks: [
    {
      id: "cues-deck-foundations", name: "Charisma Foundations", icon: "⚖️",
      desc: "The formula, the scale, the cycle, and the detective rules.", minLevel: 1, skill: "cues-scale",
      questions: [
        { q: "The charisma formula is:", options: ["Confidence + likability", "Warmth + competence", "Status + attractiveness", "Energy + eye contact"], answer: 1,
          explain: "Princeton research (Fiske) found highly charismatic people blend warmth and competence — that pair is the whole framework." },
        { q: "How dominant are warmth and competence cues in the impression you make on people?", options: ["A minor factor next to looks and status", "They drive the overwhelming majority of impressions", "They only matter in job interviews", "They only matter at first meetings"], answer: 1,
          explain: "About 82% of our impressions of others come down to warmth and competence signals — which is why the whole framework runs on those two axes, in every interaction." },
        { q: "Which question do people scan you for FIRST?", options: ["Can I rely on you? (competence)", "Can I trust you? (warmth)", "Are you high status?", "Are you like me?"], answer: 1,
          explain: "Warmth is assessed first — trust before reliability. Competence gets audited second." },
        { q: "Which doctors get sued for malpractice most?", options: ["Those who make the most mistakes", "Those rated low on warmth", "Those rated low on competence", "The youngest ones"], answer: 1,
          explain: "A JAMA study found low-warmth doctors — not the more error-prone ones — get sued. Without warmth, people won't believe your competence." },
        { q: "Trying to hide ALL your cues (neutral face, sterile tone) makes you read as:", options: ["Mysterious and powerful", "Neutral and safe", "Boring, forgettable, cold — Danger Zone", "Highly competent"], answer: 2,
          explain: "Muting is itself a cue. Sending too few cues drops you into the Danger Zone — an MIT poker study found bluffers' tell is showing no tells." },
        { q: "How much exposure do people need before they've already judged a leader's charisma?", options: ["A full meeting or more", "Mere seconds", "About an hour of conversation", "Several encounters over weeks"], answer: 1,
          explain: "Charisma can be predicted from just 5 seconds of exposure, and debate viewers judge dominance within a minute — the audit starts before you've said anything meaningful." },
        { q: "The Charisma Dial says that when you need buy-in and rapport, you should:", options: ["Dial up competence cues", "Dial up warmth cues", "Mute your cues", "Talk faster"], answer: 1,
          explain: "Warmth cues win collaboration and trust; competence cues are for when you need credibility or negotiation power." },
        { q: "The Cue Cycle runs in this order:", options: ["Encode → decode → internalize", "Decode → internalize → encode", "Internalize → encode → decode", "Decode → encode → forget"], answer: 1,
          explain: "You read others' signals, they change your own state, and then you send signals back — a continuous loop." },
        { q: "Labeling a negative cue you observe (silently naming it) does what?", options: ["Makes you more anxious", "Has no measurable effect", "Disengages the amygdala and reduces fear", "Makes the other person defensive"], answer: 2,
          explain: "Lieberman's fMRI work shows naming an emotion calms the amygdala — the scientific case for learning cue names at all." },
        { q: "You sit near a stressed-out coworker without even talking. What does emotional-contagion research predict?", options: ["Nothing transfers without conversation", "You'll start catching their mood within minutes", "Moods only transfer between close friends", "You'll compensate by getting happier"], answer: 1,
          explain: "Moods jump within roughly 5 minutes of proximity, no interaction needed — facial mimicry starts instantly. Silently labeling the cue you're catching is the antidote." },
        { q: "Before concluding anything from negative cues, the cluster rule requires:", options: ["One clear cue", "Two cues in a day", "Three incongruent cues around the same topic", "A written confession"], answer: 2,
          explain: "No single cue is a verdict — one cue can be a mosquito bite or a cold room. Three around one topic is the safe threshold." },
        { q: "Who decodes hidden emotions MORE accurately?", options: ["Suspicious people hunting for lies", "More trusting people", "People who avoid eye contact", "Trained interrogators only"], answer: 1,
          explain: "Expect-the-best is rule #1: trusting decoders are measurably more accurate than suspicious ones." }
      ]
    },
    {
      id: "cues-deck-body-warm", name: "Warmth Body Language", icon: "🕺",
      desc: "Head tilts, nods, smiles, touch, mirroring, and the space around you.", minLevel: 1, skill: "cues-warmth-body",
      questions: [
        { q: "The head tilt primarily signals:", options: ["Competence", "Warmth", "Danger / discomfort", "Dominance"], answer: 1,
          explain: "Tilting exposes the ear and neck — a vulnerability display that says I want to hear more. It raises likability but lowers perceived power." },
        { q: "In an analysis of 1,498 historical portraits, higher social status predicted:", options: ["More head tilt", "Less head tilt", "More smiling", "Bigger gestures"], answer: 1,
          explain: "About half the portraits tilt, but higher-rank subjects tilt less — the tilt warms you while trading away power." },
        { q: "What did interviewers who nodded do to their interviewees?", options: ["Made them nervous and brief", "Got them talking dramatically more", "Made them suspicious of the interviewer", "Had no measurable effect"], answer: 1,
          explain: "Nodding interviewers got people talking 67% more. The slow triple nod is the gold-standard keep-going signal; fast nodding says wrap it up." },
        { q: "What distinguishes a genuine smile from a fake one?", options: ["How wide the mouth opens", "Showing teeth", "Eye crinkles (crow's-feet)", "How long it lasts"], answer: 2,
          explain: "Real smiles reach the eyes; fake smiles live on the lower half of the face only." },
        { q: "What does a genuine smile do to how warm you're perceived to be?", options: ["Helps slightly, at the margins", "Makes you close to ten times more likely to read as warm", "Only helps if you're conventionally attractive", "Reads as unprofessional in business settings"], answer: 1,
          explain: "Smiling makes you 9.7x more likely to be seen as warm — and brains work harder to remember smiling faces because they activate reward centers. Only real smiles (eye crinkles) count." },
        { q: "The savor smile is:", options: ["A quick flash smile", "A smile that spreads slowly, over about half a second or more", "Smiling with the mouth closed", "Smiling while talking"], answer: 1,
          explain: "Slow-spreading smiles rate as more attractive and authentic — like relishing the person." },
        { q: "The NBA touch study found that teams who touched more (high fives, fist bumps):", options: ["Got more fouls", "Won more games", "Showed no difference", "Had worse chemistry"], answer: 1,
          explain: "More touch predicted more cooperative play and more wins. Light touch also raised servers' tips — 40% for men, 23% for women." },
        { q: "In the MIT study, what happened to new hires who subtly mirrored the other side in salary negotiations?", options: ["They got caught and penalized", "They earned substantially more — and both sides enjoyed the negotiation more", "They earned the same but felt more confident", "They talked themselves out of offers"], answer: 1,
          explain: "Mirrorers earned 20-30% more in final pay, and the counterparties LIKED the negotiation more. Keep it subtle and mirror only positive, open cues." },
        { q: "The mirroring rule is: mirror...", options: ["Everything they do", "Only their words", "What you want to magnetize — positive, open cues only", "Only their negative cues, to show empathy"], answer: 2,
          explain: "Never mirror negative cues (you'll catch and amplify them), and keep it subtle — copying everything reads as creepy." },
        { q: "The quick eyebrow raise (under a second) signals:", options: ["Fear", "Interest, curiosity, acknowledgment", "Disagreement", "Confusion"], answer: 1,
          explain: "It's the fastest interest cue — a nonverbal shortcut. Careful: raising the LIDS and showing upper eye-whites is a fear cue." },
        { q: "Leaning forward toward a person or idea does what to YOU, the leaner?", options: ["Nothing — it only signals outward", "Activates motivation circuitry in the left frontal cortex", "Raises your stress", "Lowers your status"], answer: 1,
          explain: "Encoding a lean literally creates motivation in yourself; leaning back doesn't. It also works as nonverbal boldface on what was just said." },
        { q: "Fronting means aiming which three things at your target of attention?", options: ["Eyes, ears, mouth", "Toes, torso, top (head)", "Hands, hips, head", "Feet, fists, face"], answer: 1,
          explain: "The three T's. Orientation telegraphs attention — toes toward the exit means someone wants to leave." },
        { q: "In Edward T. Hall's space zones, a handshake-range chat with a friend or colleague happens in which zone?", options: ["The Intimate zone", "The Personal zone", "The Social zone", "The Public zone"], answer: 1,
          explain: "Personal runs about 18 inches to 4 feet — friends, colleagues, handshakes. Intimate (0-18 in) is high-trust only; business and parties live in Social (4-7 ft). Use bridges (lean, prop, handshake) to cross zones safely." },
        { q: "A website split test swapped a crossed-arms header photo for an open-arms one. What happened?", options: ["Nothing — nobody notices stock photos", "Conversions measurably rose with the open pose", "Conversions fell — crossed arms looked more confident", "Visitors stayed longer but bought less"], answer: 1,
          explain: "Across 237,797 visitors, the open-arms photo lifted conversions 5.4%. Crossed arms rate as distant and defensive — with or without sound, in person or in pixels." }
      ]
    },
    {
      id: "cues-deck-power", name: "Power Body Language", icon: "🗿",
      desc: "Expansion, steepling, gestures, palms, and turn-taking control.", minLevel: 2, skill: "cues-power-body",
      questions: [
        { q: "The steeple (fingertips together, palms facing) signals:", options: ["Warmth", "Competence — calm, confident contemplation", "Danger / deception", "Submission"], answer: 1,
          explain: "It's a power pose for your hands: relaxed, maximally expansive, palms visible. Kevin O'Leary steeples when seriously considering a deal." },
        { q: "In the speed-dating study, which trait turned out to be the MOST romantically appealing?", options: ["Physical attractiveness", "Postural expansiveness — taking up space", "A soft, quiet voice", "Expensive clothing"], answer: 1,
          explain: "Expansive posture made daters 76% more likely to get another date — the single strongest predictor. Small fixes get you there: shoulders down, feet a bit wider, thumbs forward." },
        { q: "How did the most-viewed TED speakers differ from the least-viewed in the gesture analysis?", options: ["They gestured far more — nearly double", "They kept their hands still for gravitas", "They gripped the podium throughout", "They pointed at their slides instead"], answer: 0,
          explain: "The most-viewed talkers averaged 465 gestures per 18-minute talk versus 272 for the least-viewed. Purposeful gestures also improve listener comprehension by roughly 60%." },
        { q: "Poker observers guessed players' hand strength BEST by watching:", options: ["Faces", "Full body", "Arms and hands only", "Chip stacks"], answer: 2,
          explain: "Face-watchers did worse than chance; arm-watchers did best. Winners handle chips with smooth, fluid motion — fluidity signals confidence." },
        { q: "A palm-up gesture signals:", options: ["Dominance and command", "Openness and invitation — nothing concealed", "Impatience", "Disagreement"], answer: 1,
          explain: "Palms are attention magnets; a visible palm says no weapon, no secret. Palm-down is the power/directive counterpart." },
        { q: "Instead of pointing a finger at a person, use:", options: ["A fist", "The thumb pinch or an open palm", "Both index fingers", "A pen"], answer: 1,
          explain: "People hate being pointed AT — it reads as accusatory. The loose-fist thumb pinch is the politician's polite pointer; pointing at objects is fine." },
        { q: "The Fish — letting your mouth hang open an inch — is used to:", options: ["Show shock", "Signal you have something to say and reclaim the floor", "Look relaxed", "Stifle a yawn"], answer: 1,
          explain: "It's the universal I-have-something-to-say cue. Pair it with the Bookmark (raised palm-out hand) to stop interrupters." },
        { q: "Good powerful posture involves:", options: ["A dramatic superhero stance", "Shoulders down, feet slightly wider, thumbs rotated forward", "Chest puffed and chin high", "Hands on hips at all times"], answer: 1,
          explain: "Small fixes only — inches, not Superman poses. Expansion also lowers your stress and raises belief in your own statements." },
        { q: "The lower lid flex (steely eyes) signals:", options: ["Warmth", "Fear", "Intensity and focused scrutiny", "Boredom"], answer: 2,
          explain: "Narrowing the lower lids physically sharpens detail vision — a pure intensity cue. In your audience it means they've shifted to scrutinizing: rephrase or invite questions." },
        { q: "What did the 1960 Nixon-Kennedy debate autopsy reveal about nonverbal cues and votes?", options: ["Debate content alone decided the race", "Enough voters were swayed by the debates to decide a close election — and the cues told the story", "TV viewers and radio listeners agreed on the winner", "Voters ignored body language entirely"], answer: 1,
          explain: "6% of voters said the debates ALONE decided their vote, and over half said they were influenced. Nixon leaked runner's feet, white knuckling, and shifty gaze; Kennedy planted his feet, folded humility hands, and stayed still until movement mattered." },
        { q: "Nixon's runner's feet cue means:", options: ["Athletic confidence", "One foot pulled back like a sprint start — impatience, ready to flee", "Standing on tiptoe", "Feet planted wide"], answer: 1,
          explain: "A flee-readiness leak. Kennedy planted his feet and stayed still until movement mattered." },
        { q: "Speaking while sitting on your hands does what?", options: ["Improves focus", "Nothing", "Impairs your own verbal fluency", "Reads as humble"], answer: 2,
          explain: "Gestures help the speaker think — suppressing them measurably hurts fluency. Keep gestures in the strike zone: shoulders to waist." }
      ]
    },
    {
      id: "cues-deck-danger", name: "Danger-Zone Cues", icon: "🚨",
      desc: "Contempt, blocking, distancing, self-soothing, and the honest-read rules.", minLevel: 2, skill: "cues-danger",
      questions: [
        { q: "Why does the book treat contempt as the single most urgent cue to catch and address?", options: ["It's the most frequent negative expression", "Gottman found it predicts divorce with striking accuracy — and it festers if ignored", "It always means someone is lying", "It's the easiest expression to spot"], answer: 1,
          explain: "Contempt flashed about a partner predicted divorce with 93% accuracy — the book's flagship stat. Find the trigger, reassure, resolve — unaddressed contempt curdles into disrespect." },
        { q: "When people are shown the contempt expression, what usually happens?", options: ["Nearly everyone names it correctly", "Most people misread it — often as boredom or a half smile", "Only trained coders recognize it", "People confuse it with fear"], answer: 1,
          explain: "Only about 43% identify contempt — the worst-recognized expression; people even misuse the smirk emoji as happiness. If a smirk flashes at your table, don't file it under \"partial smile.\"" },
        { q: "Contempt looks like:", options: ["Both mouth corners pulled down", "A one-sided mouth raise (smirk)", "Lips pressed to a hard line", "Wide eyes and open mouth"], answer: 1,
          explain: "The asymmetry is the tell: one side raised = scorn. Both corners down is the mouth shrug (doubt); pressed lips are the lip purse (withholding)." },
        { q: "Thermal imaging shows lying does what to the nose?", options: ["Cools it", "Heats it, causing itch and touching", "Makes it twitch", "Nothing measurable"], answer: 1,
          explain: "Lying measurably heats the nose — Clinton touched his 26 times during untruthful testimony. Still just a flag, not proof." },
        { q: "Fidgety speakers do what to their audience?", options: ["Bore them", "Relax them", "Raise their cortisol", "Make them fidget less"], answer: 2,
          explain: "Comfort cues are contagious and stress listeners. Fix with displacement: hold a pen, lean on a podium, or press thumb to index finger." },
        { q: "The shame cue looks like:", options: ["Crossed arms", "Fingertips to the forehead with gaze down", "A hard swallow", "Rapid nodding"], answer: 1,
          explain: "Part eye-block, part self-soothe, hiding the face. Top triggers: money talk, confusion, over-personal questions. Never shame the shame." },
        { q: "A sudden arm-cross mid-conversation most reliably means:", options: ["The person is angry at you", "The person is lying", "The person just got nervous and wants security — note the trigger", "The room is definitely cold"], answer: 2,
          explain: "It's a self-hug. The decode move is spotting WHAT was said right before it, then Research, Resolve, Rapport." },
        { q: "Phubbing (turning to your phone mid-conversation) is which cue family?", options: ["Self-soothing", "Blocking", "Distancing — and it measurably lowers perceived trustworthiness", "A punctuator"], answer: 2,
          explain: "Phone plus snubbing is distancing via device, and studies show it costs you trust." },
        { q: "The fear smile is:", options: ["A smile with eye crinkles", "A smile with upper eye-whites showing — nerves masked by a grin", "A slow-spreading smile", "Smiling at bad news on purpose"], answer: 1,
          explain: "The incongruent combo (happy mouth, fearful eyes) is a red flag. Check your own profile photos for it." },
        { q: "A fidget that suddenly STOPS or STARTS on one specific topic means:", options: ["Nothing — fidgets are random", "The topic is loaded — that change is signal", "The person is bored", "The person is lying for certain"], answer: 1,
          explain: "Habitual fidgeting is often just a tic; the change tied to a topic is what marks the topic as meaningful." },
        { q: "A punctuator is:", options: ["A deliberate power pause", "A habitual emphasis gesture with no emotional meaning", "The final cue in a cluster", "A verbal filler"], answer: 1,
          explain: "Some people flare nostrils or furrow for emphasis, feeling nothing negative. A cue repeated at random moments is a punctuator, not a feeling." },
        { q: "In negotiation, deliberately showing neutrality/ambivalence about an offer:", options: ["Protects your position", "Hurts your outcome AND trust", "Extracts bigger concessions", "Is the recommended strategy"], answer: 1,
          explain: "Visible disappointment extracts concessions; masked ambivalence backfires. Let congruent cues do the negotiating." },
        { q: "Stroking the suprasternal notch (dent between the collarbones) is:", options: ["Always a lie tell", "A self-protective comfort cue — and deliberately, a fast way to calm yourself pre-speech", "A power cue", "A greeting in some cultures"], answer: 1,
          explain: "It protects the neck when done absent-mindedly, but used on purpose it genuinely calms you before speaking." }
      ]
    },
    {
      id: "cues-deck-voice-words", name: "Voice & Words", icon: "🎙️",
      desc: "Pitch, pauses, fillers, hellos, and the warm/competent word system.", minLevel: 2, skill: "cues-vocal",
      questions: [
        { q: "How quickly do listeners judge your confidence when they first hear your voice?", options: ["By your first word", "After a sentence or two", "About a minute in", "Only once the call ends"], answer: 0,
          explain: "Confidence is judged within the first 200 milliseconds — your first word IS your vocal first impression, which is why the out-breath hello matters." },
        { q: "In the recorded-hello study, which hellos rated BEST?", options: ["Power-pose hello", "Happy and normal/neutral (tied)", "Sad hello", "Whispered hello"], answer: 1,
          explain: "Happy and neutral tied for best; the power-pose hello came third (pride can read as aggression), sad was worst." },
        { q: "Raters hearing garbled 10-second voice clips could predict:", options: ["Surgeons' ages", "Which surgeons got sued for malpractice", "Surgeons' specialties", "Nothing at all"], answer: 1,
          explain: "Tone alone — content removed — predicted lawsuits. The voice carries the warmth/competence audit." },
        { q: "Uptalk (question inflection on a statement) makes listeners:", options: ["Listen more closely", "Switch from listening to scrutinizing", "Trust you more", "Relax"], answer: 1,
          explain: "Rising pitch on an assertion asks your own statement as a question — it signals insecurity and invites doubt (and haggling on prices)." },
        { q: "In the filler study, a filler-free speech with WRONG facts vs an accurate speech with fillers:", options: ["Accuracy won easily", "They tied", "The filler-free speech won — 57% vs 36% judged the speaker well-educated", "Both rated poorly"], answer: 2,
          explain: "Delivery beat accuracy: fillers cost more credibility than wrong facts did." },
        { q: "The recommended replacement for a verbal filler is:", options: ["Speaking faster", "A sip of water", "A breathing pause — inhale instead of um", "The word basically"], answer: 2,
          explain: "The breathing pause lowers pitch, prevents fry, enables volume, buys thinking time, and sounds confident." },
        { q: "Where should you place a pause to hold the floor and build intrigue?", options: ["At the end of every sentence", "Mid-arc, right BEFORE your reveal or punchline", "Only when you lose your train of thought", "Never — pauses read as weakness"], answer: 1,
          explain: "Short pauses (about a quarter to half a second) aid comprehension, but end-of-sentence pauses signal \"done\" and invite interruption. The power pause lands just before the payoff — and anything over 4 seconds starts to hurt." },
        { q: "Brown University found fast vs slow speech:", options: ["Fast conveys more information", "Slow conveys more information", "Both convey information at the same rate", "Neither is understood well"], answer: 2,
          explain: "Fast talk carries less per burst, so the rates equalize — and slower pace earns higher perceived competence." },
        { q: "Epley & Schroeder found identical job credentials rated more competent when:", options: ["Read as text", "Heard as voice", "Seen on video", "Summarized by a third party"], answer: 1,
          explain: "Voice beat text, replicated with Fortune 500 recruiters. When it matters, call — don't write." },
        { q: "Vocal fry is best fixed by:", options: ["Speaking more quietly", "Longer sentences", "More breath and slightly more volume, shorter sentences", "Lowering pitch further"], answer: 2,
          explain: "Fry is insufficient breath through the cords; volume instantly forces them together properly. If someone else fries, ask them to speak up." },
        { q: "Renaming an identical game from Wall Street Game to Community Game did what to cooperation?", options: ["Nothing", "Roughly doubled it (about 2/3 vs 1/3)", "Slightly reduced it", "Eliminated it"], answer: 1,
          explain: "Words alone changed behavior — the flagship case for warm word choice." },
        { q: "What happened to servers who repeated orders back in the customer's EXACT words, versus merely polite servers?", options: ["No difference", "They earned noticeably less — it seemed robotic", "They earned dramatically more in tips", "They got more compliments but the same money"], answer: 2,
          explain: "About 70% more in tips. Verbal mirroring builds fast trust — and in chat negotiations, mimicking within the FIRST ten minutes worked best. Echo their words for the order, the drink, the vibe." },
        { q: "The second-most-read part of a message, after the opener, is:", options: ["The subject line", "The middle paragraph", "The postscript (PS)", "The signature"], answer: 2,
          explain: "Luntz's finding — which is why Hotmail's PS line (warm phrase + free offer) went viral." },
        { q: "In the video-intro experiments, what happened when a female presenter used competence-forward wording?", options: ["It backfired and read as cold", "Her perceived competence rose sharply — counter-stereotype wording works", "Nothing changed on video", "Only her warmth score moved"], answer: 1,
          explain: "Competent wording lifted her perceived competence 15% on video; warm wording lifted the male presenter's warmth 11.5%. Cue deliberately AGAINST your default read: women often need competence cues, men warmth cues." }
      ]
    },
    {
      id: "cues-deck-imagery", name: "Image & Presence", icon: "🖼️",
      desc: "Color, images, props, and nonverbal brand.", minLevel: 4, skill: "cues-imagery",
      questions: [
        { q: "When someone sizes up a person or product in the first minute or two, which visual factor dominates the judgment?", options: ["Typeface", "Color", "Image sharpness", "Logo placement"], answer: 1,
          explain: "Judgments form within 90 seconds, and 62-90% of that assessment is color-based — which is why brand color choice is a real cue, not decoration." },
        { q: "What did Netflix learn actually drives most viewing choices?", options: ["The written descriptions", "The artwork", "Star ratings", "Autoplay trailers"], answer: 1,
          explain: "82% of viewing choices are driven by artwork, not descriptions — and images with 3 or fewer people outperform, villains beat heroes, complex expressions beat plain smiles." },
        { q: "Fundraising callers got a photo of a runner winning a race printed on their call script. What happened?", options: ["Nothing — they barely noticed it", "They raised dramatically more money in the same shift", "They talked longer per call but raised less", "Donors complained about the scripts"], answer: 1,
          explain: "60% more money raised in the same shift — the winning image primed achievement in the callers before a word was spoken. Images cue the person USING them, too." },
        { q: "Why do visual cues — colors, props, backgrounds — hit before anything you say?", options: ["They don't; words always land first", "The brain registers an image almost instantly, firing its associations before a sentence lands", "People consciously study visuals before listening", "Only designers notice visual details"], answer: 1,
          explain: "The brain registers an image in as little as 13 milliseconds and fires the neural map it's linked to — your backdrop, glasses, and brand color have spoken before you have." },
        { q: "Glasses changed perceived competence and warmth how?", options: ["+8% competence, warmth unchanged", "+8% warmth, competence unchanged", "-8% competence", "No effect on either"], answer: 0,
          explain: "Same person, +8% perceived competence with glasses and zero warmth cost." },
        { q: "Red is best used for:", options: ["Backgrounds and decoration", "The one callout that matters", "Calming an anxious person", "Blending into a group"], answer: 1,
          explain: "Red maps to dominance, arousal, and attention. Wear it to stand out; never put someone you want calm in red." },
        { q: "The best default color for trust-building materials is:", options: ["Red", "Yellow", "Blue", "Black"], answer: 2,
          explain: "Blue maps to sky and water — calm, trust, quality — and boosts alertness and productivity." },
        { q: "Yellow's catch as a color is:", options: ["It reads as anger", "It is the most eye-fatiguing color — pops only, never backgrounds", "It lowers memory", "It reads as cheap in every culture"], answer: 1,
          explain: "Yellow means joy across 50+ countries, but fatigues the eye fastest — use it as an accent." },
        { q: "In the lab priming study, a mere briefcase in the room increased:", options: ["Cooperation", "Competitive behavior", "Generosity", "Boredom"], answer: 1,
          explain: "The briefcase primed competition (competence map); a backpack primed cooperation (warmth map). Props cue behavior without anyone noticing." },
        { q: "In embodied-priming research, offering someone a warm drink tends to:", options: ["Make them sleepy", "Increase their trust", "Make them more critical", "Have no effect"], answer: 1,
          explain: "Warm drinks prime trust; cold temperatures reduce empathy. Offer the cocoa, not the ice water." },
        { q: "A nonverbal brand is:", options: ["Your logo", "Visual cues that broadcast your values and personality — a signature look, prop, or color", "Your email signature", "Your handshake"], answer: 1,
          explain: "Think Bill Nye's bow tie or Chanel's pearls: a signature cue changes how others read you and how you read yourself." },
        { q: "Pizza coupons disguised as parking tickets produced:", options: ["Record sales", "Anger, not appetite — incongruent visual cues backfire", "Neutral results", "Viral goodwill"], answer: 1,
          explain: "A visual cue that clashes with the message triggers the wrong neural map. Congruence rules imagery too." }
      ]
    }
  ],

  /* ============================ FLASHCARDS ============================ */
  flashcards: [
    {
      id: "cues-fc-warmth", name: "Warmth Cues", icon: "🔥", skill: "cues-warmth-body",
      cards: [
        { front: "Head Tilt",
          back: "Head tips sideways, ear exposed. Signals: I want to hear more — interest, warmth, appeasement. Use when delivering bad news or drawing someone out; skip it when you need to look powerful (high-status portraits tilt less)." },
        { front: "Slow Triple Nod",
          back: "Three slow vertical nods while someone talks. Signals: keep going, I have time. Interviewer nods got people talking 67% more. Fast nodding means wrap it up; over-nodding (bobblehead) reads as indiscriminate agreement." },
        { front: "Eyebrow Raise",
          back: "A sub-one-second brow lift. The fastest interest and acknowledgment cue — great for greetings, muted video calls, and inviting an introvert to speak. Brow up, NOT lids up: visible upper eye-whites is a fear cue." },
        { front: "Savor Smile",
          back: "A genuine smile that spreads slowly (over about half a second) and reaches the eyes (crow's-feet). Rated more attractive and authentic. Start and end interactions with one; smile WITH people at eye-lock moments, and never perma-smile." },
        { front: "Appropriate Touch",
          back: "Hands and forearms are the safe professional zone. Triggers oxytocin: trust, closeness, better decoding. NBA teams that touched more won more. Watch invitation vs patience cues, and mind big cultural variance." },
        { front: "Mirroring",
          back: "Subtly match posture, gestures, energy, volume. MIT: mirroring negotiators earned 20-30% more. Mirror only what you want to magnetize — never negative cues — and keep it subtle or it turns into creepy Simon Says." },
        { front: "Leaning",
          back: "Tilt a few inches toward a person or idea — nonverbal boldface. It also creates motivation in you (left frontal cortex). Withhold the lean to politely disagree; never lean so far it becomes a bow." },
        { front: "Fronting",
          back: "Aim toes, torso, and top (head) at your target. The fastest you-matter signal: swivel the chair, stop typing, square up. Decode: toes at the exit = wants to leave; parallel bodies = deep engagement, do not interrupt." },
        { front: "Nonverbal Bridges",
          back: "Cross into a closer space zone with one limb or object instead of your whole body: a lean, leveling to someone's height, a you-and-I gesture, a brief touch, or handing over a prop. Successful Shark Tank pitchers used bridges to enter the Sharks' zones safely." },
        { front: "Listening Sounds & Verbal Nudges",
          back: "Nonword encouragers (mmm, uh-huh, ooo) and three-words-or-less nudges (Go on, Tell me more, Fascinating). Instant vocal warmth — ideal for stoic faces and phone calls. The dark twin: vocal denials (ugh, yikes) shut speakers down." },
        { front: "The 3-in-3 Rule",
          back: "Show three warmth cues in the first three minutes of any interaction — a tilt, a real smile, a lean, an eyebrow flash, a warm opener. Warmth is scanned first, so front-load it." }
      ]
    },
    {
      id: "cues-fc-power", name: "Power & Competence Cues", icon: "🗿", skill: "cues-power-body",
      cards: [
        { front: "Powerful Posture (Expansion)",
          back: "Shoulders down away from the ears, feet about 3 inches wider, thumbs rotated forward. More space claimed = more perceived power; expansion also lowers your stress. Inches, not Superman poses. Skip it for apologies and de-escalation." },
        { front: "The Steeple",
          back: "Fingertips together, palms facing, fingers splayed — a power pose for the hands. Signals calm, confident contemplation; anchors fidgety hands. Warning: drumming fingers while steepled reads as scheming." },
        { front: "Explanatory Gestures",
          back: "Number gestures (show digits on fingers), big/small, me-vs-you, character hands for each side of a story. Comprehension improves about 60%; top TED talks average 465 gestures in 18 minutes. Keep them in the strike zone: shoulders to waist." },
        { front: "Palm Power",
          back: "Palms are attention magnets. Palm up = invitation and openness; palm down = directive authority; palm out = stop. Flash a palm to win a speaking turn; open-palm point at slides instead of finger-pointing at people." },
        { front: "Lower Lid Flex",
          back: "Harden and narrow the lower eyelids — pure intensity and focused scrutiny (it literally sharpens detail vision). Decode alert: a sudden lid flex in your listener means they shifted to scrutiny — rephrase or invite questions. Do not hold over 5 seconds." },
        { front: "Fluidity of Movement",
          back: "Smooth, economical, purposeful motion signals confidence; jerky hesitant movement leaks nerves. Poker observers read hand strength best from arms alone. Hands are honest: liars clasp them or stop gesturing." },
        { front: "Confident (Low) Pitch",
          back: "Your lowest COMFORTABLE natural pitch, spoken on the out-breath — never a forced baritone (the Elizabeth Holmes trap). Anxiety shrinks lung space and raises pitch, and listeners instinctively distrust nervous pitch." },
        { front: "Downward Inflection",
          back: "End statements — names, prices, deadlines — with neutral or falling pitch. Uptalk turns your assertion into a question and invites doubt and haggling. Practice on your own name and voicemail greeting." },
        { front: "Power Pause",
          back: "Pause mid-arc right BEFORE your reveal or punchline — it creates intrigue and holds the floor. Pausing at sentence ends signals done and invites interruption. Replace every would-be filler with an inhale." },
        { front: "Volume Dynamism",
          back: "Louder on the points that matter, softer plus a lean-in for insider info. Liars and the nervous drop volume. Introverts: do not go uniformly loud — selective emphasis is more effective anyway." },
        { front: "Turn-Taking Ladder",
          back: "The Fish (mouth open an inch: I have something to say) → the Bookmark (raised palm-out hand: not done yet) → the Anchor Touch (light touch grounds a monologuer) → the Preview (I have three things to say, counted on fingers)." },
        { front: "Complement Cues",
          back: "Pair a cue with the message it supports: steeple + directive, head tilt + hard news, lean + key point, fronting + inviting an introvert, eyebrow raise + asking someone by name." }
      ]
    },
    {
      id: "cues-fc-danger", name: "Danger-Zone Cues", icon: "🚨", skill: "cues-danger",
      cards: [
        { front: "Contempt (Smirk)",
          back: "One-sided mouth raise = scorn, disdain, superiority. Only about 43% of people identify it; Gottman found it predicts divorce with 93% accuracy. Decode it immediately: find the trigger, reassure, resolve — it festers if ignored." },
        { front: "Lip Purse",
          back: "Lips pressed into a hard line: suppression, withholding, keeping something in — often pre-anger. Armstrong pursed right after his doping lie. In yourself, notice what you are holding back and decide to say it or release it." },
        { front: "Mouth Shrug",
          back: "Both mouth corners pulled down into a deep frown shape: disbelief, doubt, disconnection — a bid to end the exchange, not boredom. When you see it, pause and clarify before pushing forward." },
        { front: "Distancing",
          back: "Leaning back, stepping back, angling away, turning to a phone (phubbing). The urge to escape something threatening — including one's own lie. Response protocol: Research the trigger, Resolve it, rebuild Rapport." },
        { front: "Blocking (Body / Mouth / Eye)",
          back: "Body: crossed arms, clutched objects, suprasternal-notch touch. Mouth: hands over mouth, knuckle-biting. Eye: covering eyes, long lid closure. All buy protection or processing time. Anti-blocking — visibly removing a barrier — is a trust builder." },
        { front: "Self-Comfort Cluster",
          back: "Rubbing arms or thighs, hand-wringing, ventilating a collar, preening, nail biting, swaying. Self-touch rises with anxiety. Fix with displacement: hold a pen, lean on a podium, or the invisible thumb-hold at your side." },
        { front: "Shame Cue",
          back: "Fingertips to the forehead, gaze down — hiding the embarrassed face. Top triggers: money talk, confusion, over-personal questions, self-caught mistakes. Never shame the shame; offer reassurance and mutual vulnerability." },
        { front: "Fear Smile",
          back: "Smile plus visible upper eye-whites — a nerves-masking grin, incongruent by definition. Audit your own posed photos for it." },
        { front: "Uptalk & Halt Cue",
          back: "Uptalk: rising pitch on a statement — asking your own assertion, a low-confidence leak. Halt: an out-of-place mid-sentence stop — liars halt, so do the very nervous; listeners distrust it either way." },
        { front: "Vocal Fry & Vocal Denials",
          back: "Fry: creaky bacon-sizzle from too little breath — reads as anxiety, not cool; fix with volume and shorter sentences. Vocal denials (ugh, yikes, eeek) shut speakers down — usually an accidental habit." },
        { front: "Nose Touch & Blink Spike",
          back: "Lying heats the nose (thermal imaging) — itching and touching follow; Clinton touched his 26 times in untruthful testimony. Blink rate spikes with nerves. Both are flags to investigate, never verdicts." },
        { front: "The Cluster Rule",
          back: "No single cue is proof — there is no Pinocchio's nose. Require three incongruent cues around the same topic, check context and baseline first, and remember congruent negative cues (words match body) are honest, not suspicious." }
      ]
    }
  ],

  /* ============================== SPARKS ============================== */
  sparks: [
    { kind: "cue of the day", text: "Deliver one slow triple nod while someone talks today.",
      why: "Nodding interviewers got people to speak 67% more — the slow triple nod says keep going, I have time." },
    { kind: "cue of the day", text: "Aim your toes, torso, and head at whoever is speaking to you.",
      why: "Fronting the three T's is the fastest you-matter signal a body can send." },
    { kind: "cue of the day", text: "Answer your next call on the out-breath.",
      why: "People inhale when the phone rings and hold it — producing their tightest, highest-pitched word of the call. Confidence is judged in the first 200 ms." },
    { kind: "cue hunt", text: "Catch one fake smile in the wild today.",
      why: "Real smiles crinkle the eyes; fake ones live on the lower face only. Spotting the difference is a core decode skill." },
    { kind: "cue of the day", text: "Make a visible show of putting your phone away when a conversation starts.",
      why: "The anti-blocking cue — removing a barrier where they can see it — is one of the fastest trust builders." },
    { kind: "cue of the day", text: "State one price, deadline, or opinion with firm downward inflection.",
      why: "Uptalk turns your statement into a question and invites doubt — sales reps who dropped it on their price stopped getting haggled." },
    { kind: "cue hunt", text: "Watch for toes today: whose feet point at the exit?",
      why: "Orientation telegraphs attention — toes toward the door mean someone wants to leave, no matter what their face says." },
    { kind: "cue of the day", text: "Replace every would-be um with an inhale.",
      why: "The breathing pause lowers pitch, prevents fry, buys thinking time, and sounds confident. A filler-free speech beat an accurate one 57% to 36%." },
    { kind: "cue of the day", text: "Steeple your hands once while listening in a meeting or call.",
      why: "The steeple is a power pose for your hands — calm, expansive, palms visible — and it anchors fidgeting." },
    { kind: "cue hunt", text: "Spot one self-soothing cue today: arm rubbing, collar pulling, hand-wringing.",
      why: "Self-touch rises with anxiety. Noting the trigger topic is the real decode win." },
    { kind: "cue of the day", text: "Flash a quick eyebrow raise at someone you are glad to see.",
      why: "The sub-second brow lift is the fastest interest and acknowledgment cue humans have." },
    { kind: "cue of the day", text: "Use three listening sounds — mmm, ooo, uh-huh — in one conversation.",
      why: "Vocal invitations are the cheapest warmth there is, and they visibly extend the speaker." },
    { kind: "cue hunt", text: "Hunt for one contempt flash today — a one-sided mouth raise.",
      why: "Only about 43% of people recognize contempt, yet it is the single most predictive negative cue (93% divorce prediction in Gottman's work)." },
    { kind: "cue of the day", text: "Show every number you say on your fingers today.",
      why: "Number gestures are the easiest explanatory gesture — purposeful gestures lift listener comprehension about 60%." },
    { kind: "cue of the day", text: "Run the posture micro-fix before one meeting: shoulders down, feet wider, thumbs forward.",
      why: "Expansive posture made speed daters 76% more likely to get another date — and it lowers your own stress." },
    { kind: "cue of the day", text: "Open one interaction with three warmth cues in the first three minutes.",
      why: "The 3-in-3 rule front-loads warmth, which is the first thing everyone scans you for." },
    { kind: "cue hunt", text: "Notice one punctuator today — a gesture someone repeats with no feeling behind it.",
      why: "Separating habit gestures from real signal is what keeps you from over-reading people." },
    { kind: "cue of the day", text: "Reuse three of the other person's exact words in your reply.",
      why: "Verbal mirroring builds fast trust — servers who echoed orders verbatim earned about 70% more in tips." },
    { kind: "cue of the day", text: "Give one charisma-matched compliment today.",
      why: "Competent people want competence confirmed; warm people want warmth confirmed. Matched praise lands hardest — and only say true things." },
    { kind: "cue of the day", text: "Pause right BEFORE your best point, not after your sentence.",
      why: "The power pause creates intrigue and holds the floor; end-of-sentence pauses signal done and invite interruption." },
    { kind: "cue hunt", text: "Before judging any negative cue today, list two innocent explanations first.",
      why: "Context first: a furrow can be concentration, a step back can be a long flight. Trusting decoders are more accurate." },
    { kind: "cue of the day", text: "Swap one sterile email line for a warm or competent one.",
      why: "Sterile boilerplate signals nothing — words like together or effective work like a smile or a steeple in text." }
  ],

  /* ============================== QUESTS ============================== */
  quests: [
    { id: "cues-q-scale-place", name: "Map Yourself", icon: "🗺️", xp: 30, type: "do", minLevel: 1,
      skill: "cues-scale", source: "Cues Ch.1",
      desc: "Self-place on the Charisma Scale using the word-column test, then ask one trusted person to place you too.",
      tip: "Word test: warm = trustworthy, kind, team player; competent = impressive, powerful, expert. Compare the two placements.",
      how: [
        "Sketch a quick 2x2 grid: warmth up the side, competence across the bottom.",
        "Read the two word columns and pick whichever sounds more like you: trustworthy / kind / team player (warm) vs impressive / powerful / expert (competent).",
        "Mark a dot for yourself — strong on one axis, both, or neither.",
        "Ask one person who knows you well to place you on the same grid before you show them your dot.",
        "Compare the two dots: the gap between how you see yourself and how they see you is your training target."
      ],
      examples: [
        "Random question — when we first met, did I come off more friendly or more like I knew my stuff?",
        "Be honest: am I more the warm one or the sharp one?",
        "If you had to pick one word for me: trustworthy or impressive?"
      ] },
    { id: "cues-q-lean-spot", name: "Read the Lean", icon: "🧭", xp: 25, type: "tally", goal: 3, minLevel: 1,
      skill: "cues-scale", source: "Cues Ch.1",
      desc: "Identify the warmth-vs-competence lean of 3 people you talk to regularly.",
      tip: "Warm-leaning people open with chitchat and stories; competent-leaning people want agendas, data, and no tangents.",
      how: [
        "Pick three people you talk to regularly — a coworker, a client, a friend.",
        "Listen to how each one opens: straight into small talk and stories reads warm; straight into plans, times, and numbers reads competent.",
        "Check their questions: how-are-you and gut-feel talk lean warm; what's-the-plan and proof-seeking lean competent.",
        "Scan their texting too: emojis and exclamation points lean warm; short, bullet-like replies lean competent.",
        "Count one read per person once you can name their lean AND the evidence for it."
      ] },
    { id: "cues-q-dial-flip", name: "Flip Your Dial", icon: "🎛️", xp: 35, type: "do", minLevel: 1,
      skill: "cues-scale", source: "Cues Ch.1",
      desc: "In one interaction, deliberately dial up your NON-default axis — competence cues if you lean warm, warmth cues if you lean competent.",
      tip: "Warm-leaning: add data, downward inflection, a steeple. Competent-leaning: add a head tilt, a savor smile, a warm opener.",
      how: [
        "Name your default lean first — most people already know which way they tilt.",
        "Pick one low-stakes conversation today to run the opposite setting.",
        "If you lean warm: sit taller, land your sentence endings at a level-or-falling pitch, bring one concrete number or plan, and rest your hands in a steeple instead of fidgeting.",
        "If you lean competent: open with a personal question, tilt your head while they answer, and let a real smile arrive before any business talk.",
        "Afterward, jot how the person responded differently than they usually do with you."
      ],
      examples: [
        "Before we catch up — two quick things I want to lock in.",
        "Numbers first: we doubled the door last Friday, so same setup this week.",
        "Wait, first — how did the move go?",
        "It's honestly really good to see you."
      ] },
    { id: "cues-q-label", name: "Name That Cue", icon: "🏷️", xp: 25, type: "tally", goal: 3, minLevel: 1,
      skill: "cues-cycle", source: "Cues Ch.2",
      desc: "Silently label 3 negative cues you catch in the wild (that is contempt, that is a self-soothe, that is distancing).",
      tip: "Labeling disengages your amygdala — note whether the mood contagion weakens once you name it.",
      how: [
        "Watch faces, arms, and posture during any conversation, meeting, or livestream today.",
        "When something negative flickers — a one-sided smirk, arms suddenly folding, a step backward, hands rubbing an arm — say its name in your head: contempt, blocking, distancing, self-soothe.",
        "One silent, specific label equals one tally; a vague 'they seem off' does not count — the name does.",
        "Check your own body right after labeling: naming the cue usually stops you from catching the mood yourself."
      ],
      demo: "microexpressions",
      search: "contempt smirk negative facial expressions" },
    { id: "cues-q-headtilt", name: "Tilt Spotter", icon: "👀", xp: 20, type: "tally", goal: 3, minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Cues Ch.4",
      desc: "Spot 3 head tilts in the wild — calls, streams, checkout lines.",
      tip: "The tilt says I want to hear more. Bonus: notice whether higher-status people in the room tilt less.",
      how: [
        "Look for a head cocked sideways, one ear dropping toward the shoulder — it usually appears while someone is listening, not talking.",
        "Best hunting grounds: video calls, interview clips, baristas taking orders, anyone drawing a story out of a friend.",
        "Count one sighting when you catch both the tilt AND its effect — the speaker relaxes, keeps going, or opens up.",
        "Bonus read: notice whether the highest-status person in the room is the one tilting least."
      ],
      demo: "head-tilt",
      search: "head tilt listening body language" },
    { id: "cues-q-triple-nod", name: "The Slow Triple Nod", icon: "🙆", xp: 30, type: "tally", goal: 3, minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Cues Ch.4",
      desc: "Use a slow triple nod 3 times when you want someone to keep talking; note how long they extend.",
      tip: "Slow is the whole trick — fast nodding means wrap it up.",
      how: [
        "Wait for a moment when someone is mid-story and you want more, not less.",
        "Nod exactly three times, slowly — roughly one nod per second, chin dropping only an inch.",
        "Keep your mouth closed while you nod; the nod IS the message.",
        "Common mistake: speeding up. Rapid nodding tells people to hurry and finish.",
        "Count one rep per conversation, and clock roughly how much longer they kept talking."
      ],
      demo: "triple-nod" },
    { id: "cues-q-3in3", name: "Three in Three", icon: "⏱️", xp: 30, type: "do", minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Cues Ch.4",
      desc: "Open a new interaction with 3 warmth cues in the first 3 minutes.",
      tip: "Pick from: head tilt, eyebrow raise, savor smile, lean, warm opener phrase.",
      how: [
        "Choose your three before the interaction — for example: a real smile at the greeting, a head tilt while they answer, a small lean at their first interesting line.",
        "Fire the first one in the opening seconds — a slow genuine smile or a sub-second eyebrow flash as you say hi.",
        "Land the other two inside three minutes, spaced apart, each tied to something the person actually said.",
        "Do not stack all three at once — bunched cues read as performance, not warmth."
      ],
      examples: [
        "Hey! I was hoping I'd run into you.",
        "Okay, tell me everything — how was it?",
        "Good to see you, man — it's been a minute.",
        "This is the best part of my day so far."
      ] },
    { id: "cues-q-fakesmile-fast", name: "Fake-Smile Fast", icon: "😐", xp: 35, type: "do", minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Cues Ch.4",
      desc: "Go one full day with zero fake smiles — smile only when you mean it.",
      tip: "Fake smiles are not memorable anyway. Be smile-READY instead: relaxed face, quick to genuine.",
      how: [
        "For one full day, catch every reflex smile before it launches — the polite flash you give at nothing.",
        "Know the difference: a real smile builds slowly and squeezes the outer corners of your eyes; a fake one snaps on instantly and lives on the mouth only.",
        "When you don't mean it, hold a relaxed, pleasant neutral face instead — no scowl required.",
        "Stay smile-ready: loose jaw, easy eyes, so a genuine smile can arrive fast when something earns it.",
        "Log the moments a real smile showed up anyway — those are your actual warmth triggers."
      ],
      search: "genuine smile vs fake smile eye crinkles" },
    { id: "cues-q-bridge", name: "Build a Bridge", icon: "🌉", xp: 30, type: "tally", goal: 2, minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Cues Ch.3",
      desc: "Use 2 nonverbal bridges with newer acquaintances: hand someone something, level to their height, or a brief arm touch.",
      tip: "Bridges cross a space zone with one limb or object instead of your whole body — sample, handout, high five.",
      how: [
        "Pick someone newer — a client, a new coworker, a friend-of-a-friend at an event.",
        "Instead of stepping into their space, send one thing across it: hand them a drink, your phone with a photo, a flyer, a sample.",
        "Or level to them — crouch to a kid's height, sit when they sit, come around the counter.",
        "Keep the rest of your body at normal social distance; only the object or one arm crosses the gap.",
        "Count one bridge when it's accepted — they take the item or match your level."
      ],
      examples: [
        "Here — grabbed you a water.",
        "Check this out real quick.",
        "This one's for you."
      ],
      demo: "zones-map",
      search: "personal space zones proxemics diagram" },
    { id: "cues-q-front-day", name: "Full Fronting Day", icon: "🧍", xp: 35, type: "do", minLevel: 1,
      axis: "warm", skill: "cues-warmth-body", source: "Cues Ch.3",
      desc: "Front fully — toes, torso, top — with every person who speaks to you today.",
      tip: "Swivel the chair, stop typing, square up. Note who suddenly opens up more.",
      how: [
        "All day, whenever someone speaks to you, aim three things at them: toes, chest, and face.",
        "At a desk, swivel the whole chair — don't just turn your head over a shoulder.",
        "Hands off the keyboard, phone face-down, then square up fully.",
        "Hold the position while they talk; feet drifting toward the door leak that you want out.",
        "Track who suddenly gives you more — full fronting tends to open people up fast."
      ],
      demo: "fronting",
      search: "fronting body language facing toes torso" },
    { id: "cues-q-posture-fix", name: "The Micro-Fix Hold", icon: "🏛️", xp: 30, type: "do", minLevel: 2,
      axis: "comp", skill: "cues-power-body", source: "Cues Ch.5",
      desc: "Hold the posture micro-fix through one full meeting: shoulders down, feet 3 inches wider, thumbs rotated forward.",
      tip: "The two-pens test: held in your hands, the pens should point forward like parallel laser beams.",
      how: [
        "Right before the meeting, roll your shoulders up, back, and down — away from your ears.",
        "Set your feet about three inches wider than feels normal; seated, keep both feet planted.",
        "Rotate your hands until your thumbs point forward, arms relaxed and slightly off your torso.",
        "Self-check: hold a pen in each hand — both should aim straight ahead, parallel.",
        "Every time you catch yourself shrinking or hunching over your phone, quietly reset all three points."
      ],
      demo: "power-pose",
      search: "open expansive confident posture" },
    { id: "cues-q-steeple-week", name: "Steeple Sampler", icon: "⛪", xp: 30, type: "tally", goal: 3, minLevel: 2,
      axis: "comp", skill: "cues-power-body", source: "Cues Ch.5",
      desc: "Steeple in 3 different contexts — a video call, a friend chat, a meeting — and note how it feels each time.",
      tip: "Rule of Three: first time feels weird, second feels empowering, third you decide keep or discard.",
      how: [
        "Touch the fingertips of one hand to their partners on the other, palms apart, fingers spread — like lightly holding an invisible ball.",
        "Rest your elbows on the table or hold it at chest height, and keep it while listening or thinking.",
        "Deploy it once in each of three settings: a video call, a casual hang, a real meeting.",
        "Avoid the two fails: pressing hands flat together (praying) and tapping the fingertips (scheming).",
        "After each rep, note the feel — weird, powerful, or natural. Rep three decides if it stays in your kit."
      ],
      demo: "steeple",
      search: "steepling hands confidence gesture" },
    { id: "cues-q-number-gestures", name: "Count It Out", icon: "🤟", xp: 25, type: "do", minLevel: 2,
      axis: "comp", skill: "cues-power-body", source: "Cues Ch.5",
      desc: "Tell one story or explanation using number gestures plus a them-vs-us character-hand assignment.",
      tip: "Assign each side of the story to one hand and keep it consistent — listeners track the plot by your hands.",
      how: [
        "Pick a story or explanation with at least two sides or a few steps.",
        "Every number you say, show on your fingers at chest height the moment you say it.",
        "Assign each side of the story to one hand — left is them, right is you — and never swap mid-story.",
        "Keep every gesture between shoulders and waist, within about a foot of your body.",
        "Watch your listener's eyes start tracking your hands — that tracking is the comprehension boost."
      ],
      examples: [
        "There are three things you need to know about Friday.",
        "Two options: early entry on this hand, table package on this one.",
        "First the venue, second the guest list, third the after."
      ],
      search: "counting on fingers presentation hand gestures" },
    { id: "cues-q-fish-bookmark", name: "Land the Fish", icon: "🐟", xp: 35, type: "tally", goal: 2, minLevel: 2,
      axis: "comp", skill: "cues-power-body", source: "Cues Ch.5",
      desc: "Use the Fish or the Bookmark on a real interrupter 2 times.",
      tip: "Fish: let your mouth hang open an inch — I have something to say. Bookmark: raised hand, palm out — not done yet.",
      how: [
        "When someone cuts you off, do not snap your mouth shut — let it hang open about an inch.",
        "Hold that open-mouth pause a couple of seconds while looking at them; it reads universally as not-finished-yet.",
        "If they keep rolling, raise one hand to chest height, palm facing them — a calm stop sign, not a wave.",
        "Resume exactly where you left off, at normal volume — no apology, no rushing.",
        "Count one rep each time the move wins you the floor back."
      ],
      examples: [
        "One sec — let me land this thought.",
        "Hold that — I'm almost there.",
        "Quick pause — two more points, then you."
      ],
      search: "palm out stop hand gesture" },
    { id: "cues-q-crossarm-trigger", name: "Trigger Tracker", icon: "🕵️", xp: 30, type: "tally", goal: 3, minLevel: 2,
      skill: "cues-danger", source: "Cues Ch.6",
      desc: "Spot 3 sudden mid-conversation arm-crosses and identify what was said right before each.",
      tip: "The cross is a self-hug for security. The trigger — not the cross — is the information.",
      how: [
        "Watch torsos, not faces, in your meetings and conversations today.",
        "The cue: arms were open, then suddenly fold across the chest mid-conversation — a self-hug for security.",
        "The instant you see it, rewind five seconds in your head: what exact words landed right before the fold?",
        "Write down the trigger topic, not the gesture — the topic is the intel.",
        "One tally per cross-plus-trigger pair; someone who always sits arms-crossed is baseline, not signal."
      ],
      demo: "no-blocking",
      search: "crossed arms defensive body language" },
    { id: "cues-q-rbf-audit", name: "RBF Audit", icon: "🪞", xp: 25, type: "do", minLevel: 2,
      skill: "cues-danger", source: "Cues Ch.6",
      desc: "Photograph or record your neutral thinking face; check for brow furrow, downturned mouth, or a one-sided lift. Plan one fix.",
      tip: "Concentration mimics anger. If sun-squint furrows are yours, sunglasses genuinely help your mood too.",
      how: [
        "Film or photograph yourself while genuinely concentrating on something — not posing.",
        "Check three spots: vertical lines between the brows, mouth corners pulled downward, and one side of the mouth sitting higher than the other.",
        "Any hit means people may be reading anger, sadness, or scorn while you're just thinking.",
        "Pick one fix: consciously relax the brow when you catch it, lift the mouth corners slightly on camera, or wear sunglasses outside so squinting stops training the furrow."
      ],
      demo: "microexpressions",
      search: "resting facial expression brow furrow" },
    { id: "cues-q-shame-response", name: "Catch and Cushion", icon: "🫂", xp: 35, type: "do", minLevel: 2,
      skill: "cues-danger", source: "Cues Ch.6",
      desc: "Spot the shame cue once (fingers to forehead, gaze down) and respond with reassurance instead of pursuit.",
      tip: "Common triggers: money talk, confusion, over-personal questions. A this-took-me-months-to-learn story turns shame into bonding.",
      how: [
        "Know the cue: fingertips go to the forehead or brow while the eyes drop to the floor — often when money, confusion, or something too personal comes up.",
        "The moment you spot it, stop pushing on that topic.",
        "Soften your body first: head tilt, quieter volume, maybe a small lean back to give them room.",
        "Then cushion with words — normalize the moment and offer a stumble of your own so it becomes bonding instead of embarrassment."
      ],
      examples: [
        "Honestly, nobody gets this stuff the first time — I sure didn't.",
        "No stress — we can sort the money part later.",
        "Took me months to learn that, for what it's worth.",
        "We don't have to go there — tell me about the fun part instead."
      ],
      search: "hand to forehead embarrassment gesture" },
    { id: "cues-q-nonverbal-no", name: "The Silent No", icon: "🤐", xp: 30, type: "do", minLevel: 3,
      skill: "cues-danger", source: "Cues Ch.6",
      desc: "In a minor negotiation, replace one verbal no with a nonverbal cue: lip purse, lean back, or crossed arms.",
      tip: "Visible disappointment extracts bigger concessions; masked neutrality hurts your outcome AND trust.",
      how: [
        "Pick a low-stakes ask — a price, a schedule, a favor you'd normally decline out loud.",
        "When the offer lands, say nothing for a beat.",
        "Press your lips into a flat line, lean back a few inches, or fold your arms — one clear cue, held, not flashed.",
        "Let the silence sit; most people start revising their own offer against a visible no.",
        "If they ask you directly, answer honestly — the cue opens the negotiation, it doesn't replace words forever."
      ],
      search: "pursed lips leaning back disagreement body language" },
    { id: "cues-q-voicemail", name: "Voicemail Reboot", icon: "📱", xp: 25, type: "do", minLevel: 2,
      axis: "comp", skill: "cues-vocal", source: "Cues Ch.7",
      desc: "Re-record your voicemail greeting: low register, spoken on the out-breath, zero uptalk.",
      tip: "Quiet room, headphones, warm up first, imagine greeting someone you love. Greeting + name + request + warm sign-off.",
      how: [
        "Find a quiet room, put headphones on, and warm up: a few slow belly breaths, then a minute of humming.",
        "Find your low natural register by saying hello a few times on a long exhale — comfortably low, never forced.",
        "Record while picturing someone you're genuinely glad to hear from; keep the script to greeting, name, ask, warm close.",
        "Make every line end level or falling in pitch — especially your own name.",
        "Play it back; if any line curls upward like a question, re-record just that take."
      ],
      examples: [
        "Hey, you've reached Marcus — leave your name and I'll hit you back today.",
        "It's Dana. Drop a message after the tone and consider it handled.",
        "Hey, it's Jay — can't grab the phone, but leave a message and I got you."
      ],
      demo: "downward-inflection" },
    { id: "cues-q-filler-hunt", name: "Filler Hunt", icon: "🎯", xp: 35, type: "do", minLevel: 2,
      axis: "comp", skill: "cues-vocal", source: "Cues Ch.7",
      desc: "Record one call, count your ums, then run a similar call using breathing pauses instead.",
      tip: "Never apologize for a filler — just breathe after it. The inhale is the replacement.",
      how: [
        "Record one real call or voice memo — your side of the audio is enough.",
        "Play it back and tally every um, uh, like, so, and you-know.",
        "Find the pattern: fillers usually spike when you're reaching for the next thought or afraid of being interrupted.",
        "On the next similar call, each time a filler is coming, close your mouth and inhale through your nose instead.",
        "Never apologize for a slip — breathe after it and keep going. Compare the two calls' counts."
      ] },
    { id: "cues-q-downward-3", name: "Say It Like You Mean It", icon: "📉", xp: 30, type: "tally", goal: 3, minLevel: 2,
      axis: "comp", skill: "cues-vocal", source: "Cues Ch.7",
      desc: "Deliver 3 prices, deadlines, or hard statements with firm downward inflection.",
      tip: "Danger spots: your own name, introductions, prices, timelines. Practice each with neutral-or-falling pitch.",
      how: [
        "Pick your three statements in advance — a price, a deadline, an opinion you'd normally soften.",
        "Say each one with the last word landing at the same pitch or lower than the rest of the sentence — like setting a glass down, not lifting it.",
        "Then stop talking. No trailing if-that-works tacked onto the end.",
        "Rehearse once out loud first — rising endings love to hide in names, numbers, and dates.",
        "One tally per statement delivered flat-or-falling to a real person."
      ],
      examples: [
        "Cover is forty at the door.",
        "I need the final list by Thursday.",
        "Doors at ten. We start on time.",
        "That rate is two-fifty for the night."
      ],
      demo: "downward-inflection" },
    { id: "cues-q-listening-sounds", name: "The Encourager", icon: "🎧", xp: 20, type: "tally", goal: 3, minLevel: 2,
      axis: "warm", skill: "cues-vocal", source: "Cues Ch.8",
      desc: "Use 3 listening sounds or verbal nudges in one conversation and watch the speaker extend.",
      tip: "Mmm, uh-huh, Go on, Tell me more. Ideal if smiling more feels forced — vocal warmth is easier than facial warmth.",
      how: [
        "In one conversation, swap your urge to comment for small sounds while the other person talks.",
        "Use nonword encouragers — a low mmm, an interested ooo, an easy uh-huh — timed to their key beats.",
        "When they pause, add one tiny nudge of three words or fewer.",
        "Never use the negative versions — ugh, yikes, oof — they slam the door on a speaker.",
        "Count each sound or nudge, and watch how much longer they keep going."
      ],
      examples: [
        "Mmm.",
        "No way — go on.",
        "Tell me more.",
        "Okay, and then?"
      ] },
    { id: "cues-q-email-audit", name: "Email Audit", icon: "📧", xp: 35, type: "do", minLevel: 3,
      skill: "cues-verbal", source: "Cues Ch.9",
      desc: "Score your last 5 important sent emails for warm, competent, charismatic, and sterile words; rewrite the worst one at the same length.",
      tip: "Look for different registers per recipient — you are cueing each person how to treat you.",
      how: [
        "Open your five most recent important sent emails or DMs.",
        "Highlight four kinds of words: warm (together, happy, we), competent (plan, results, data), charismatic (excited, team), and sterile filler that signals nothing.",
        "Score each message — the one that's all logistics and zero personality is the one costing you.",
        "Rewrite the worst one at the same length: swap one sterile line for a warm or competent one and upgrade the sign-off.",
        "Compare how you write to different people — you're teaching each one how to treat you."
      ],
      examples: [
        "So glad we're building this together — here's the plan.",
        "Quick win: Friday's numbers doubled, so let's lock the same setup.",
        "Excited for this one. Talk tomorrow.",
        "We got this — see you at kickoff."
      ] },
    { id: "cues-q-chameleon", name: "Verbal Chameleon", icon: "🦎", xp: 25, type: "tally", goal: 3, minLevel: 3,
      axis: "warm", skill: "cues-verbal", source: "Cues Ch.9",
      desc: "In one conversation, reuse 3 of the other person's exact words or phrases.",
      tip: "Match their vocabulary (client vs customer, truck vs rig) — early mirroring beats late mirroring. Never mimic what feels fake.",
      how: [
        "In one conversation, listen for the exact words the other person picks — their names for things, their slang, their pet phrases.",
        "When you reply, reuse one of those words verbatim instead of your own synonym — their 'spot' stays 'spot', never becomes 'venue'.",
        "Do it early: echoing in the first minutes builds trust fastest.",
        "Keep it to a few words at a time — repeating whole sentences turns into parroting.",
        "Never echo negative words or anything that feels fake in your mouth. Three natural echoes and you're done."
      ],
      examples: [
        "Okay, so we make it a whole vibe — I'm in.",
        "Low-key night it is, then.",
        "So the rooftop spot — what time does it pop off?"
      ] },
    { id: "cues-q-photo-audit", name: "Profile Photo Audit", icon: "📸", xp: 30, type: "do", minLevel: 4,
      skill: "cues-imagery", source: "Cues Ch.10",
      desc: "Audit your main profile photo: head tilt, open torso, gaze direction, no sun furrow, no fear-smile eye whites. Fix and reshoot if needed.",
      tip: "LinkedIn finding: open-mouth smile plus slight head tilt rated best. Western hero-shot bonus: gaze up-and-to-the-right reads upbeat.",
      how: [
        "Pull up your main profile photo at full size.",
        "Run the checklist: slight head tilt, torso open to the camera (no crossed arms or objects in front), eyes aimed where you want them — at the lens or up-and-off.",
        "Hunt for two silent killers: vertical squint lines between the brows, and white showing above the iris while grinning — the nervous smile.",
        "Confirm the smile reaches the eyes — corners crinkled, not just teeth showing.",
        "Any item fails? Reshoot in soft shade with the camera at or slightly above eye level, and keep the frame where the smile looks mid-bloom."
      ],
      demo: "head-tilt",
      search: "best profile photo head tilt open posture" },
    { id: "cues-q-background", name: "Backdrop Upgrade", icon: "🖥️", xp: 30, type: "do", minLevel: 4,
      skill: "cues-imagery", source: "Cues Ch.10",
      desc: "Redesign your video-call background with one deliberate warmth cue and one competence cue.",
      tip: "Warmth: people photos, plants, warm light. Competence: books, certifications, clean lines. Sit at least 2 feet from the camera.",
      how: [
        "Join a test call alone and screenshot exactly what your camera shows.",
        "Add one warmth signal in frame: a plant, a warm lamp, or a photo with people in it.",
        "Add one credibility signal: real books, an award, or clean organized lines.",
        "Clear the noise — laundry, clutter, and glare are cues too, just bad ones.",
        "Sit about two feet back from the camera so head, shoulders, and gesturing hands all fit."
      ],
      search: "video call background setup bookshelf plant" },
    { id: "cues-q-brand-color", name: "Claim Your Color", icon: "🎨", xp: 25, type: "tally", goal: 3, minLevel: 4,
      skill: "cues-imagery", source: "Cues Ch.10",
      desc: "Pick a personal brand color and apply it to 3 assets (slides, profile, signature, notebook).",
      tip: "Blue for trust and calm, red only for the single callout that matters, yellow as a pop — never a background.",
      how: [
        "Choose by job, not taste: blue for calm trust, red if you must command attention, green for easy well-being, yellow only as a small pop.",
        "Lock one exact shade and save its hex code so every use matches.",
        "Apply it to three things people actually see: slide accents, profile banner, email signature, a notebook, an event shirt.",
        "Reserve red for the single element that must get noticed — never as wallpaper.",
        "One tally per asset wearing your color."
      ],
      search: "personal brand color palette examples" },
    { id: "cues-q-boss-lietome", name: "BOSS: Lie to Me", icon: "🎬", xp: 120, type: "do", minLevel: 3, boss: true,
      skill: "cues-danger", source: "Cues Ch.6",
      desc: "Record yourself answering three prompts — a factual recall, an embarrassing true story, an invented story — then code your own tells against the 17-cue Danger Zone checklist.",
      tip: "Check lip purse, distancing, blocking, self-soothes, nose touch, shame — plus the vocal recheck: did you uptalk or drop volume on the lie? You are learning YOUR tells.",
      how: [
        "Set up your phone camera and record three answers, about a minute each: a factual memory you know cold, an embarrassing story that's true, and a story you invent on the spot.",
        "Watch the footage muted first — per answer, log every lip press, lean-away, barrier, self-touch, nose touch, and hand-to-forehead moment.",
        "Watch again with sound: did your pitch curl upward or your volume drop anywhere in the invented story?",
        "Compare columns — cues that show up only in the lie, or only in the embarrassing truth, are your personal tells.",
        "Write down your top three tells; those are what you'll now catch in real time."
      ],
      demo: "microexpressions" },
    { id: "cues-q-boss-meeting-reset", name: "BOSS: The Meeting Reset", icon: "👑", xp: 150, type: "do", minLevel: 4, boss: true,
      skill: "cues-power-body", source: "Cues Ch.5",
      desc: "Run one full meeting or call with a planned cue stack: warm entrance, barriers visibly removed, round-robin fronting, steeple while listening, purposeful gestures, open-palm Q&A close.",
      tip: "Script it beforehand as a nonverbal script: annotate your agenda with [smile], [steeple], [pause] marks like Reagan and Thatcher did.",
      how: [
        "Annotate your agenda beforehand with cue marks — [smile], [steeple], [pause], [palms] — next to the moments they belong.",
        "Enter warm: real smile, greet people by name, and visibly push your laptop and phone aside.",
        "As each person speaks, front them fully — chair, torso, face — going around the room one at a time.",
        "While listening, hold a relaxed steeple instead of fidgeting; while explaining, show your numbers on your fingers.",
        "Close Q&A with open palms and a direct invitation, then end on a genuine smile."
      ],
      examples: [
        "Morning, everyone — genuinely good to see this group.",
        "Phone's away on my end; you've got my full attention.",
        "Floor's open — what did I miss?",
        "Great session. Let's go make it happen."
      ],
      demo: "no-blocking" },
    { id: "cues-q-boss-chart-row", name: "BOSS: Full Chart Row", icon: "📊", xp: 100, type: "do", minLevel: 2, boss: true,
      skill: "cues-cycle", source: "Cues Conclusion",
      desc: "Complete one full Cues Chart row for a cue of your choice: decode it 3 times in different scenarios, encode it 3 times, and write an internalize note on whether it feels like you.",
      tip: "First try feels uncomfortable, second feels empowering, third you decide: keeper or not. Keep only cues that pass the feels-like-me test.",
      how: [
        "Pick one cue you care about — say the lean, the steeple, or the slow triple nod.",
        "Decode phase: catch other people using it three times, in three different settings, and jot who, where, and what it did.",
        "Encode phase: perform it yourself three times in three different settings — vary the stakes.",
        "After every rep, write one line on how it felt and how the other person reacted.",
        "Verdict: if by rep three it feels like you, it joins your permanent kit; if not, drop it guilt-free."
      ] }
  ]
};
