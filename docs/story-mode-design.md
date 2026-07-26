# Story Mode — "The Long Night in Nocturne"

Design document for the Captivate story mode. Everything here is original writing and
original mechanics. The *inspiration* is the structure of a creature-collection RPG
(collect → evolve → gym-gate → rival → journey). **No third-party IP, names, characters,
creatures, text, or art appear anywhere in this design or its implementation.** This site
is public; every word below is written for this project.

The one non-negotiable design law:

> **Nothing in Story Mode grows because you tapped something in the app.**
> Creatures are *caught* by doing a small real-world action and *evolve* only from
> accumulated real-world reps (skill XP + completed field quests). In-app reading,
> browsing, and quizzing never move a creature forward.

The second non-negotiable law:

> **All carrot, no stick.** Passing on a challenge costs nothing — no timers, no decay,
> no lost progress, no guilt copy. Every gate is "not yet," never "you failed."

---

## 1. Story & World

### 1.1 Premise

**Nocturne** is a city that behaves like one enormous venue. Street level to roof, it is
four floors of the same long night, and each floor asks a different social question. You
are working your way up it with an empty field guide — **the Cuedex** — that has
twenty-four blank pages in it.

The creatures you collect are called **Neons**: small living signals made of the city's
sign-light, each one the embodiment of a single technique from the two books. A Neon is
faint and unreliable when you first catch it. It gets brighter, bigger and stranger only
when *you* practice the thing it is made of, out in the world. That's the whole metaphor:
the creature is your skill, wearing a body.

Following you up the building is **Fade** — the rival. Fade is the pull to go quiet. He is
the voice that says *you already came, that counts, nobody would notice if you left*. He
is never cruel and never wrong-sounding, which is exactly what makes him dangerous. He
appears five times, gets more personal each time, and each encounter is cleared by doing
one real-world exposure — your choice of three rungs.

### 1.2 Regions

| id | Region | Floor | Theme | Skill area |
|---|---|---|---|---|
| `r1` | **Velvet Row** 🚪 | the street, the line, the door | First Impressions | cap-control, cap-capture, cap-spark, cues-scale, cues-warmth-body, cues-imagery |
| `r2` | **The Long Bar** 🍸 | main floor | Conversation | cap-intrigue, cap-highlight, cap-connect, cues-vocal, cues-verbal, cues-warmth-body |
| `r3` | **The Mezzanine** 👁️ | the overlook | Reading People | cap-decode, cap-solve, cap-appreciate, cap-value, cues-cycle, cues-danger |
| `r4` | **The Rooftop** 🌇 | the top floor | Presence & Leadership | cap-empower, cap-reveal, cap-protect, cap-engage, cues-power-body, cues-imagery |

Six Neons per region, 24 total. Every one of the app's 22 skill ids is covered;
`cues-warmth-body` and `cues-imagery` each anchor two Neons (one early, one late), which is
deliberate — those two skills span the whole journey.

### 1.3 Story beats — the actual text

Every beat below is `beatId` → text. Beats are read once, award **+5 XP with no skillId**
(so reading can never move a creature), and are re-readable from a "Story so far" log.

---

**`beat-prologue`** — shown the first time Story Mode is opened

> Nocturne is one building pretending to be a city. Street level to roof, every floor is a
> room you could be good in — and on every floor there's already a version of you standing
> in the corner, saying nothing. You've got a field guide with twenty-four blank pages and
> a long night ahead of you. Fair warning: nothing in this book fills itself in. It fills
> in when you go do the thing.

---

**`beat-fade-0`** — Fade, outside, before you've gone in

> There's a guy leaning on the wall by the door with your exact posture. He doesn't
> introduce himself. People call him Fade.
> "You already came," he says, nodding at the entrance. "Showing up counts. Honestly,
> nobody would even notice if you got back in the car right now."
> He's not wrong. That's the problem with him — he's never quite wrong.

**`beat-fade-0-win`**

> You go in. Fade doesn't follow; he never does. He just walks around to whichever exit
> you'll pass next and waits there. Behind you the door swings shut on the version of
> tonight where you didn't.

---

**`beat-r1-intro`** — Velvet Row

> Velvet Row is the block outside every door in Nocturne: rope, list, cold air, everyone
> quietly deciding about everyone. Two seconds is all anybody gets out here, and nobody's
> being cruel about it — that's just how fast the machinery runs. At the end of the street,
> Reyna Cole works the rope. Eleven years on that door. She says the whole thing is
> learnable in one night, and she says it like she's tired of repeating it.

**`beat-gym1-intro`** — Reyna Cole, The Rope

> Reyna doesn't look at your shoes. "Hands," she says. "Shoulders. Eyes. That's the entire
> exam, and everybody flunks it standing in a huddle three feet inside the door."
> She lifts the rope about four inches. "Go stand where the night is actually happening,
> open three people properly, and come back and tell me their names."

**`beat-gym1-win`**

> Reyna hears three names and doesn't ask how you got them. "You walked past the door
> huddle," she says. "Most people never do. They stand there all night and call it warming
> up." She pins something small to your jacket and points down the hall. "Long Bar's that
> way. Ivo'll talk your ear off. Let him."

---

**`beat-fade-1`** — Fade at the bottom of the stairs

> Fade's waiting on the stairs with a drink he isn't drinking. "Good door," he says. "Easy
> door, though. Nice woman, low stakes, nobody you actually wanted to impress." He shrugs
> like he's on your team. "You could stop here, on a win. That's the smart play."
> It's the same sentence you've used on yourself at eleven at night, a hundred times, with
> the car already running.

**`beat-fade-1-win`**

> You go do the thing he said wasn't worth doing, and it's mostly fine — which is the part
> he never mentions. When you look back, he's three rooms behind you, still nodding.

---

**`beat-r2-intro`** — The Long Bar

> The Long Bar runs the whole floor and never ends the same way twice. This is where the
> two seconds you bought at the door either turn into something or evaporate into weather
> talk. Ivo Marchetti has been behind this bar since before you were old enough to be in
> front of it, and he claims he has never once had a dead conversation on his shift. Stand
> still long enough and he'll prove it on you.

**`beat-gym2-intro`** — Ivo Marchetti, The Long Bar

> Ivo pours something you didn't order and slides it over. "Everybody thinks talking is the
> hard part. Talking's easy. *Staying* is hard."
> He taps the bar twice. "Find three things you've genuinely got in common with a stranger.
> Tell me one real story in under two minutes. Then make two people who've never met glad
> they met. Do that and this stool's yours whenever you want it."

**`beat-gym2-win`**

> Ivo listens to your story with his arms uncrossed, which around here is a standing
> ovation. "You stopped interviewing people," he says. "That's the whole graduation."
> He slides a stamped coaster across the bar and tips his head at the stairs. "Mezzanine's
> up there. Flash is up there. She'll see you before you see her."

---

**`beat-fade-2`** — Fade, mid-lap

> Fade falls into step beside you without being invited. "You're doing a *lot* tonight," he
> says, gently, the way a friend would. "People notice when someone's trying."
> Then the actual knife, soft as anything: "You were more likable when you were quiet."
> You've believed that one before. On the ride home. Music off.

**`beat-fade-2-win`**

> You take up the space anyway. Nobody flinches. Two people lean in. Fade goes quiet, which
> is the only thing he was ever genuinely good at.

---

**`beat-r3-intro`** — The Mezzanine

> The Mezzanine hangs over the whole floor, and from up here a night reads like a chart —
> who's fronting who, which table's about to break up, where the energy went. Faces flash
> things for half a second and then take them back. The trick isn't seeing more. The trick
> is not convicting anybody on a single frame. June Tanaka shoots from this rail every
> weekend and knows how a night ends before it's half over.

**`beat-gym3-intro`** — June "Flash" Tanaka, The Long Lens

> Flash doesn't lower the camera to talk to you. "Everyone wants reading people to be a
> superpower. It's a habit. Look, wait, look again."
> She finally glances over. "Ten minutes at this rail, five cues, and I want the *context*
> with each one. Find one person whose mouth and face disagree and do something kind about
> it. Then figure out what somebody's actually here to get — and go check whether you're
> right."

**`beat-gym3-win`**

> Flash scrolls back through the night and stops on a frame of you mid-conversation, leaned
> in, mouth shut. "That's somebody listening," she says. "Not somebody waiting for a gap to
> talk in. You can't fake that in a photo."
> She hands you the print and points up. "Roof. Cass has been asking about you, which is
> either very good or very annoying."

---

**`beat-fade-3`** — Fade on the stairwell landing

> Fade's on the landing and this time he doesn't do the friendly voice. "You like it up
> there," he says. "Watching. Reading everybody. Very safe." He steps aside so you can get
> past, which is somehow worse than blocking it. "You've turned hiding into a skill and
> given it a nice name."
> He's found the true thing. That's the only thing he's ever really doing.

**`beat-fade-3-win`**

> So you put the notebook down and get into the middle of it — badly, out loud, in front of
> people. It's clumsy. Somebody laughs. It's fine. Fade doesn't have a line ready for that
> one.

---

**`beat-r4-intro`** — The Rooftop

> The roof is the last floor and the smallest: one bar, string lights, the whole city
> breathing underneath you. Nobody up here is trying to be liked. They're busy making other
> people comfortable, which turns out to be the same thing viewed from the other side. Cass
> Amari owns the place and started at coat check. She says the job never actually changed.

**`beat-gym4-intro`** — Cass Amari, The Rooftop

> Cass hands you a tray you never agreed to carry. "Up here you don't get to be a guest."
> She counts it off on her fingers. "Find whoever's standing at the edge and bring them in.
> Give one thing away with a *because* attached to it. Ask somebody for advice you actually
> need — real advice, not a favor you're pretending is advice."
> Then she smiles. "And tell somebody no tonight. Clean. No excuses. That last one's the
> hard one and you know it."

**`beat-gym4-win`**

> Cass finds you an hour later in the middle of a conversation you didn't start and don't
> need to be running. "There it is," she says. "You stopped auditioning."
> She pins the last badge on and looks out at the skyline. "You know what coat check taught
> me? Everybody in that room is nervous. You just get to be the one who notices first."

---

**`beat-fade-4`** — the final encounter, at the far rail

> Fade's on the roof, alone at the far rail. Up close he's exactly your height and wearing
> what you wore the first night.
> "You know I'm not leaving," he says. "I'm the part of you that wants a quiet Tuesday and
> a closed door. Some nights I'm right about that."
> He puts out a hand — an actual hand, visible, held the way you learned on Velvet Row.
> "So. What do we do."

**`beat-fade-4-win`**

> You don't beat him, because there was never anything there to beat. You give him the
> nights he's genuinely right about, and you keep the rest. Then you walk back into the
> middle of the roof, where the noise is, and you stay.

---

**`beat-ending`**

> Twenty-four pages. Four badges. A city that turned out to be a building you now know your
> way around. And none of it happened in here — every creature in that book got bigger
> because you walked into a room you could have skipped and said a thing you could have
> swallowed.
> Nocturne doesn't end. The rooms just get better. Go find the next door.

---

**`beat-afterhours`** — post-game, shown once after the ending

> After Hours: the badges are done but the Cuedex isn't. Anything still faint in there is
> just a rep you haven't taken yet. Fade still turns up — some nights he's right, and now
> you can tell which nights those are.

---

## 2. The Cuedex — 24 Neons

**Naming:** the collectibles are **Neons** (singular: *a Neon*). The field guide is the
**Cuedex**. Stage names are the creature's three forms: *faint → true → apex*.

Every Neon record carries: `id`, `line` (species name), `emoji`, `skill` (an existing skill
id), `region`, `technique` (the book method it embodies, paraphrased), `stages[3]`
(`{ name, flavor }`), `catch` (real-world action), `evo` (thresholds).

### 2.1 Evolution rules — how thresholds work

A Neon's stage is **derived, never stored**. Two measurable inputs, both of which only move
from real-world reps:

- `sx` = `Store.state.skillXp[skill]` — skill XP, awarded by completed field quests, Night
  Mode actions, catches, boss clears.
- `qc` = the number of entries in `Store.state.questLog` whose quest (`Quests.questById`)
  has `.skill === skill` — i.e. **distinct field quests actually completed in that skill.**

Both conditions must be met. `qc` is the anti-grind clamp: XP alone can't evolve anything,
you need *distinct different reps*.

Three tiers, chosen per Neon:

| Tier | Stage 2 | Stage 3 | Intent |
|---|---|---|---|
| **common** | `sx ≥ 45` and `qc ≥ 2` | `sx ≥ 160` and `qc ≥ 5` | ~4–6 days light play → stage 2 |
| **standard** | `sx ≥ 60` and `qc ≥ 2` | `sx ≥ 220` and `qc ≥ 6` | ~1 week → stage 2 |
| **apex** | `sx ≥ 80` and `qc ≥ 3` | `sx ≥ 300` and `qc ≥ 8` **and** holds the region badge | stage 3 is a genuine milestone |

Eight Neons (two per region) are **apex** tier — their final form additionally requires
that region's gym badge, so no Cuedex line completes without a real boss night.

Field quests award 20–40 XP each (bosses 100–150), so *standard* stage 2 ≈ two completed
quests in that skill; *standard* stage 3 ≈ six to eight, spread over weeks. That's the
intended shape: stage 2 in a week of light play, stage 3 an actual accomplishment.

### 2.2 Region 1 — Velvet Row 🚪 (First Impressions)

---

**`n-mapp` — Mapp** 🗺️ · skill `cap-control` · tier **standard**
Technique: sorting venues into thrive / neutral / survive, and working the event map —
walk past the entry huddle, avoid the bathroom-hover and food-table traps, post up at the
end of the bar or near the host.
- **Scoutle** — *Hides behind the coat rack and maps the exits before it maps anything else.*
- **Mapp** — *Knows which three rooms make it good and which three make it small — and picks accordingly.*
- **Grandplan** — *Walks into a strange venue and owns the floor plan in about eleven seconds.*
- **Catch:** Before your next outing, pick your room and your exact spot in advance — then go stand there.
- **Evolves:** S2 `cap-control` 60 XP & 2 quests · S3 220 XP & 6 quests.

**`n-triplet` — Triplet** 🤝 · skill `cap-capture` · tier **apex**
Technique: the three-part nonverbal open — hands visible, launch stance (shoulders back and
down, chin level, air between arms and torso), 60–70% eye contact, plus a dry vertical
handshake.
- **Pocketpaw** — *Both hands jammed in its pockets. Means well. Reads as nobody.*
- **Triplet** — *Hands out, shoulders down, chin level: three questions answered before it says a word.*
- **Threshold Titan** — *Wins the room in two seconds and never has to win it again.*
- **Catch:** Walk into one room today with hands visible, shoulders back, chin level — and hold it for the first sixty seconds.
- **Evolves:** S2 `cap-capture` 80 XP & 3 quests · S3 300 XP & 8 quests **+ Threshold Badge**.

**`n-dialla` — Dialla** ⚖️ · skill `cues-scale` · tier **common**
Technique: the warmth × competence grid and the charisma dial — read which axis a room is
asking for and turn the knob toward it.
- **Tipling** — *Wobbles: too warm to be taken seriously, or too sharp to be liked.*
- **Dialla** — *Reads which axis the room wants and turns the knob without announcing it.*
- **Twinpeak** — *Lives in the top-right corner and lends warmth or weight to whoever's short on it.*
- **Catch:** Place yourself on the warmth/competence grid out loud to one person, and ask whether they'd put you there too.
- **Evolves:** S2 `cues-scale` 45 XP & 2 quests · S3 160 XP & 5 quests.

**`n-browflash` — Browflash** 🤨 · skill `cues-warmth-body` · tier **common**
Technique: the eyebrow raise — the fastest interest signal there is — and the three-warmth-
cues-in-three-minutes rule.
- **Flick** — *A twitch of interest it doesn't dare finish.*
- **Browflash** — *Fastest warmth signal in the city. Fires before the mouth even opens.*
- **Warmwave** — *Three warmth cues inside three minutes, every time, without thinking about it.*
- **Catch:** Greet three people today with an eyebrow flash and their name. Count what comes back.
- **Evolves:** S2 `cues-warmth-body` 45 XP & 2 quests · S3 160 XP & 5 quests.

**`n-hue` — Hue** 🎨 · skill `cues-imagery` · tier **common**
Technique: visual cues fire before words — a signature color or object as your nonverbal
brand, because the brain reads an image in milliseconds.
- **Greyling** — *Dresses to disappear, then wonders why nobody came over.*
- **Hue** — *Owns one color and wears it like a name tag.*
- **Marquee** — *You can tell it's in the building from the parking lot.*
- **Catch:** Pick one color or object as yours. Wear or carry it out once, on purpose.
- **Evolves:** S2 `cues-imagery` 45 XP & 2 quests · S3 160 XP & 5 quests.

**`n-sparque` — Sparque** ⚡ · skill `cap-spark` · tier **apex**
Technique: killing the script — novelty openers instead of "how are you," hunting hot
buttons, and locking names in by repeating, spelling and anchoring them.
- **Fizzle** — *Opens with "how are you" and dies on impact.*
- **Sparque** — *Trades the script for a question nobody's been asked all night.*
- **Bonfire** — *Turns a coat-check line into the best conversation of somebody's month.*
- **Catch:** Replace one "how are you" or "what do you do" with a real sparker today.
- **Evolves:** S2 `cap-spark` 80 XP & 3 quests · S3 300 XP & 8 quests **+ Threshold Badge**.

### 2.3 Region 2 — The Long Bar 🍸 (Conversation)

---

**`n-threadle` — Threadle** 🧵 · skill `cap-intrigue` · tier **apex**
Technique: hunting shared threads across people, context and interests, then following one
with successive whys instead of announcing a mismatch.
- **Snag** — *Finds one thing in common and immediately drops it.*
- **Threadle** — *Pulls a thread and keeps pulling. Three commonalities inside three minutes.*
- **Tapestrix** — *Weaves strangers into people who apparently knew each other all along.*
- **Catch:** Find three things in common with one new person before the conversation ends.
- **Evolves:** S2 `cap-intrigue` 80 XP & 3 quests · S3 300 XP & 8 quests **+ Open Tab Badge**.

**`n-gleam` — Gleam** 🖍️ · skill `cap-highlight` · tier **standard**
Technique: being the highlighter — raving introductions (name + genuine hype + a topic to
start on), specific positive labels, matching other people's excitement.
- **Dimwick** — *Waits to be noticed. A plan that has never once worked.*
- **Gleam** — *Introduces you better than you would have introduced yourself.*
- **Limelight** — *Everyone it touches leaves the night feeling like the good version of themselves.*
- **Catch:** Introduce two people with a genuine rave and a topic for them to start on.
- **Evolves:** S2 `cap-highlight` 60 XP & 2 quests · S3 220 XP & 6 quests.

**`n-yarnix` — Yarnix** 📖 · skill `cap-connect` · tier **apex**
Technique: the story stack — one banked anecdote per trigger topic, built with a hook, a
struggle and vivid sensory words, capped at two minutes, then boomeranged back.
- **Mumble** — *Has three good stories and tells none of them.*
- **Yarnix** — *Hook, snag, payoff, ninety seconds, then hands the mic straight back.*
- **Sagalore** — *Two brains sync up, and neither of them notices the room went quiet.*
- **Catch:** Bank one story for a trigger topic (weekend, weather, work) and actually tell it tonight.
- **Evolves:** S2 `cap-connect` 80 XP & 3 quests · S3 300 XP & 8 quests **+ Open Tab Badge**.

**`n-cadence` — Cadence** 🎙️ · skill `cues-vocal` · tier **standard**
Technique: lowest comfortable pitch on the out-breath, firm downward inflection on
statements, breathing pauses instead of fillers.
- **Uptick** — *Ends every sentence like it's asking permission?*
- **Cadence** — *Lands statements on the downbeat and stops apologizing with its voice.*
- **Groundtone** — *Says a hard number out loud and the room believes it before the sentence finishes.*
- **Catch:** Say one price, plan or hard statement today with a firm downward ending.
- **Evolves:** S2 `cues-vocal` 60 XP & 2 quests · S3 220 XP & 6 quests.

**`n-echoquill` — Echoquill** ✍️ · skill `cues-verbal` · tier **standard**
Technique: verbal mirroring in the other person's exact words, warm vs competent vs
charismatic word choice, and killing sterile boilerplate.
- **Blurb** — *Sends messages that could have been written by a printer.*
- **Echoquill** — *Gives your own words back to you, and you feel understood.*
- **Wordwright** — *Picks every word for warmth or weight, and never once sounds like a form letter.*
- **Catch:** Reuse three of someone's exact words back to them in one conversation.
- **Evolves:** S2 `cues-verbal` 60 XP & 2 quests · S3 220 XP & 6 quests.

**`n-noddle` — Noddle** 🙆 · skill `cues-warmth-body` · tier **standard**
Technique: the slow triple nod, the head tilt, and listening sounds — the cues that make
people keep talking.
- **Blink** — *Nods at the wrong speed and the story stops dead.*
- **Noddle** — *Three slow nods, and people talk two-thirds longer without noticing why.*
- **Confidante** — *People tell it things they hadn't quite told themselves yet.*
- **Catch:** Slow-triple-nod when someone pauses tonight — and count how much longer they keep going.
- **Evolves:** S2 `cues-warmth-body` 60 XP & 2 quests · S3 220 XP & 6 quests.

### 2.4 Region 3 — The Mezzanine 👁️ (Reading People)

---

**`n-microflash` — Microflash** 🎭 · skill `cap-decode` · tier **apex**
Technique: the seven universal microexpressions, and the congruency check — when the words
and the face disagree, answer the face.
- **Twitchling** — *Sees something cross a face and immediately talks itself out of it.*
- **Microflash** — *Catches the half-second flash and names it silently.*
- **Truthface** — *Hears "I'm fine," watches the face, and answers the face.*
- **Catch:** Catch one microexpression today and silently name it. Anger, contempt, fear — one is plenty.
- **Evolves:** S2 `cap-decode` 80 XP & 3 quests · S3 300 XP & 8 quests **+ Long Lens Badge**.

**`n-quintile` — Quintile** 🧩 · skill `cap-solve` · tier **standard**
Technique: speed-reading the five personality dials from questions, behavior and
environment, then choosing to optimize or compromise rather than trying to change anyone.
- **Guessling** — *Assumes everyone is wired the way it's wired. They are not.*
- **Quintile** — *Reads five dials off one question and one desk.*
- **Pentarch** — *Pitches the same idea five different ways and lands it every time.*
- **Catch:** Guess one person's five dials, then ask a single question to check just one of them.
- **Evolves:** S2 `cap-solve` 60 XP & 2 quests · S3 220 XP & 6 quests.

**`n-fivetongue` — Fivetongue** 💝 · skill `cap-appreciate` · tier **common**
Technique: the five appreciation languages — words, gifts, touch, acts of service, quality
time — delivered in *their* language, not yours.
- **Giftgoof** — *Gives everyone the thing it would have wanted. Nobody's face lights up.*
- **Fivetongue** — *Picks the right one out of five and watches the difference land.*
- **Heartfluent** — *Fluent in all five, and asks outright when it isn't sure.*
- **Catch:** Do one appreciation act in someone else's language rather than your own.
- **Evolves:** S2 `cap-appreciate` 45 XP & 2 quests · S3 160 XP & 5 quests.

**`n-cipher` — Cipher** 💎 · skill `cap-value` · tier **apex**
Technique: finding a person's primary value — love, service, status, money, goods or
information — from their complaints, brags, and what keeps them up at night.
- **Hunchling** — *Hears a complaint and hears only a complaint.*
- **Cipher** — *Hears a complaint and hears the resource somebody's starving for.*
- **Keymaster** — *Knows what every person in the room actually came here to get.*
- **Catch:** Listen for one person's complaint or brag today, and name the resource sitting underneath it.
- **Evolves:** S2 `cap-value` 80 XP & 3 quests · S3 300 XP & 8 quests **+ Long Lens Badge**.

**`n-clustrio` — Clustrio** 🔍 · skill `cues-cycle` · tier **common**
Technique: the cue-detective rules — no single cue is a verdict, require three flags on one
topic, check context first, learn baselines and meaningless habit gestures.
- **Jumpling** — *Sees one crossed arm and hands down a conviction.*
- **Clustrio** — *Waits for three flags on the same topic before it believes anything.*
- **Baseliner** — *Knows everyone's resting face and their pointless habits, so the real signal glows.*
- **Catch:** Before judging one negative cue today, list two innocent explanations for it first.
- **Evolves:** S2 `cues-cycle` 45 XP & 2 quests · S3 160 XP & 5 quests.

**`n-redflagg` — Redflagg** 🚨 · skill `cues-danger` · tier **standard**
Technique: distancing, blocking, self-soothing, the shame cue and contempt — decoded in
others with the cluster rule, and hunted down in your own leaks.
- **Fidgetling** — *Leaks its own nerves everywhere and calls it a personality.*
- **Redflagg** — *Spots the arm-cross and clocks exactly what was said right before it.*
- **Defuser** — *Finds the trigger, fixes it, rebuilds the room — and leaks nothing itself.*
- **Catch:** Note one moment someone's body closed mid-conversation, and what was said immediately before.
- **Evolves:** S2 `cues-danger` 60 XP & 2 quests · S3 220 XP & 6 quests.

### 2.5 Region 4 — The Rooftop 🌇 (Presence & Leadership)

---

**`n-becausaur` — Becausaur** 🔑 · skill `cap-empower` · tier **standard**
Technique: handing out ownership instead of orders — attach a because to every request,
solicit by skill rather than duty, and let people control the how.
- **Orderling** — *Barks the what and never the why. Gets grudging compliance and a lot of sighing.*
- **Becausaur** — *Attaches a because to everything, and people start saying yes.*
- **Kingmaker** — *Gives away the entire how and gets back work better than it would have done itself.*
- **Catch:** Attach a real because to your next three asks.
- **Evolves:** S2 `cap-empower` 60 XP & 2 quests · S3 220 XP & 6 quests.

**`n-favora` — Favora** 🪞 · skill `cap-reveal` · tier **apex**
Technique: vulnerability as a bonding tool — asking for advice you genuinely need, the
humanizing power of visible flaws, and the anti-perfect list ("I don't know," "I was
wrong," "what does that mean?").
- **Askling** — *Would rather look fine than get help.*
- **Favora** — *Asks for the advice it actually needs — and the asking is the bond.*
- **Openheart** — *Says "I don't know" out loud and somehow gets more respect, not less.*
- **Catch:** Ask one person this week for advice you genuinely need.
- **Evolves:** S2 `cap-reveal` 80 XP & 3 quests · S3 300 XP & 8 quests **+ Skyline Badge**.

**`n-defusa` — Defusa** 🛡️ · skill `cap-protect` · tier **standard**
Technique: difficult behavior is hijacked fear — name the emotion in their words,
understand what they're after, and only then transform. Plus the clean no: thanks, decline,
zero reasons.
- **Flinchling** — *Freezes when somebody gets loud, then replays it for three days.*
- **Defusa** — *Names the emotion out loud and the temperature drops ten degrees.*
- **Ironcalm** — *Says no with thanks, no excuses, and no aftermath.*
- **Catch:** Deliver one clean no this week: thanks, decline, no reasons given.
- **Evolves:** S2 `cap-protect` 60 XP & 2 quests · S3 220 XP & 6 quests.

**`n-attuna` — Attuna** 🧲 · skill `cap-engage` · tier **apex**
Technique: attunement — bookending interactions with genuine gladness, pulling
edge-standers into the group, and treating every interaction as yours to make interesting.
- **Edgeling** — *Stands at the edge of the group, wanting in, saying nothing.*
- **Attuna** — *Opens and closes every interaction with something it genuinely means.*
- **Magnetar** — *The edge of the room quietly disappears wherever it's standing.*
- **Catch:** Find someone standing at the edge of a group tonight and pull them in.
- **Evolves:** S2 `cap-engage` 80 XP & 3 quests · S3 300 XP & 8 quests **+ Skyline Badge**.

**`n-steeple` — Steeple** 🗿 · skill `cues-power-body` · tier **standard**
Technique: the posture micro-fix (shoulders down, feet wider, thumbs forward), the steeple
as a cure for fidgeting, explanatory gestures, and fluid economical movement.
- **Twiddle** — *Its hands can't decide what to do, so they do all of it at once.*
- **Steeple** — *Parks the hands, and the sentence gets heavier.*
- **Monolith** — *Every gesture means something. The stillness in between means more.*
- **Catch:** Replace one bout of hand fidgeting with a steeple today.
- **Evolves:** S2 `cues-power-body` 60 XP & 2 quests · S3 220 XP & 6 quests.

**`n-signature` — Signature** 🖼️ · skill `cues-imagery` · tier **standard**
Technique: the deliberate environment — props, backdrop, and a signature object that primes
how people read you before you speak.
- **Blankslate** — *Beige background, beige impression.*
- **Signature** — *Every frame it appears in is saying something on purpose.*
- **Landmark** — *People describe it to other people using the same three details, every time.*
- **Catch:** Put one deliberate warmth cue and one competence cue into a space you'll be seen in.
- **Evolves:** S2 `cues-imagery` 60 XP & 2 quests · S3 220 XP & 6 quests.

### 2.6 Coverage check

All 22 skill ids used. `cues-warmth-body` → `n-browflash` (R1, common) + `n-noddle` (R2,
standard). `cues-imagery` → `n-hue` (R1, common) + `n-signature` (R4, standard). Eight apex
lines: `n-triplet`, `n-sparque`, `n-threadle`, `n-yarnix`, `n-microflash`, `n-cipher`,
`n-favora`, `n-attuna`.

---

## 3. Gyms

One per region. Each has a named leader, a three-part real-world boss challenge doable in
one night out or one social day, a badge, and an unlock condition. Parts are individually
checkable and persist — you can clear part 1 tonight and parts 2–3 next weekend. Nothing
expires.

**Unlock rule (uniform):** the gym opens when you have caught **4 of the region's 6 Neons**.

### `gym-rope` — The Rope · Velvet Row
- **Leader:** **Reyna Cole**, head door host. Eleven years on the rope, decides in two
  seconds, has never once been rude about it. Believes the door is a solvable problem and is
  faintly annoyed that people treat it like weather.
- **Badge:** **Threshold Badge** 🚪 (`badge-threshold`)
- **Challenge — "Two Seconds":**
  1. Arrive somewhere and walk *past* the entry huddle to a real spot — end of the bar, near
     the host, edge of the action — inside sixty seconds of getting in the door.
  2. Open three separate people with a sparker (not "how are you"): hands visible, shoulders
     back, eyebrow flash.
  3. Get all three names, use each one out loud, and still have them when you leave.
- **Reward:** +120 XP to `cap-capture`, Threshold Badge, Velvet Row marked complete.

### `gym-longbar` — The Long Bar · The Long Bar
- **Leader:** **Ivo Marchetti**, the bar's oldest bartender. Pours you things you didn't
  order. Claims he has never had a dead conversation on his shift and treats that as a
  professional standard rather than a boast.
- **Badge:** **Open Tab Badge** 🍸 (`badge-opentab`)
- **Challenge — "Last Call for Small Talk":**
  1. Hold one conversation past the eight-minute mark using threads only — find three real
     commonalities and follow one of them down.
  2. Tell one prepared story: hook, snag, payoff, under two minutes, then boomerang a
     question back.
  3. Make one raving introduction between two people who hadn't met, and give one specific
     compliment about something somebody *chose*.
- **Reward:** +120 XP to `cap-connect`, Open Tab Badge, The Long Bar marked complete.

### `gym-lens` — The Long Lens · The Mezzanine
- **Leader:** **June "Flash" Tanaka**, house photographer. Shoots from the rail, talks
  without lowering the camera, knows how a night ends before it's half over. Insists reading
  people is a habit, not a gift, and finds the "superpower" framing embarrassing.
- **Badge:** **Long Lens Badge** 📷 (`badge-longlens`)
- **Challenge — "Look, Wait, Look Again":**
  1. Spend ten minutes reading a room from one vantage point. Log five cues *with their
     context* — what was happening, what was said just before.
  2. Catch one incongruence (the words and the face disagree) and respond to it kindly —
     name it, soothe it, or just soften the moment — instead of pretending you didn't see.
  3. Guess one person's primary value and one personality dial, then ask a question that
     actually checks whether you were right.
- **Reward:** +120 XP to `cap-decode`, Long Lens Badge, The Mezzanine marked complete.

### `gym-rooftop` — The Rooftop · The Rooftop
- **Leader:** **Cass Amari**, owner. Started at coat check and says the job never changed:
  notice who's nervous first. Hands you tasks you didn't agree to. Deeply unimpressed by
  charm and extremely impressed by people who make other people comfortable.
- **Badge:** **Skyline Badge** 🌇 (`badge-skyline`)
- **Challenge — "You Don't Get to Be a Guest":**
  1. Host: pull one edge-stander into a group, make one introduction, and run one small
     moment for the whole table — a toast, a poll, a question everybody answers.
  2. Give one real thing away with a because attached — a task, a decision, the how.
  3. Ask one person for advice you genuinely need, **and** deliver one clean no: thanks,
     decline, no excuses.
- **Reward:** +120 XP to `cap-engage`, Skyline Badge, The Rooftop marked complete.

---

## 4. Rival Encounters — Fade

Five encounters. Each presents the story beat, then **three rungs** of the same exposure —
easy / medium / hard. **Any one rung clears it.** You choose. There is always a visible
"Not tonight" that closes the card with no consequence and no dark-pattern copy.

Rung XP: **a = +30, b = +45, c = +60**, all routed to the encounter's themed skill.

### `fade-0` — "The Car Door" · gates Velvet Row · skill `cap-control`
- **a.** Say one full sentence to one person today. Staff counts. Cashiers count.
- **b.** Walk into a room you'd normally skip and stay ten minutes.
- **c.** Go out on a night you had already half-decided to cancel.

### `fade-1` — "The Smart Play" · gates The Long Bar · skill `cap-capture`
- **a.** Start one conversation with one stranger.
- **b.** Stay thirty minutes past the first moment you wanted to leave.
- **c.** Go somewhere social alone — no wingman, no safety person.

### `fade-2` — "You Were More Likable Quiet" · gates The Mezzanine · skill `cap-connect`
- **a.** Say one thing out loud in a group of four or more.
- **b.** Tell one story to a whole table.
- **c.** Run the room for a full hour with your phone in your pocket the entire time.

### `fade-3` — "A Nice Name for Hiding" · gates The Rooftop · skill `cap-reveal`
- **a.** Say the awkward true thing once instead of the smooth safe thing.
- **b.** Ask someone directly for something you want.
- **c.** Introduce yourself to whoever in the room intimidates you most.

### `fade-4` — "What Do We Do" · gates the ending · skill `cap-engage`
- **a.** Host something small. Two people, one hour, your idea.
- **b.** Invite three people somewhere yourself, by name, in advance.
- **c.** Do the thing you told yourself a year ago you weren't the type of person to do.

**Fade is never punitive.** He has no timer, no score, no "he's winning" state. If you skip
an encounter it just stays open. His post-game behavior: after the ending, the story pane
shows a small recurring Fade card with a rotating one-liner and a fresh rung — framed as
maintenance, never as a threat.

---

## 5. Progression Rules

### 5.1 The unlock chain (exact)

```
open Story Mode                → beat-prologue           (auto, +5 XP)
                               → beat-fade-0 card unlocked
fade-0 cleared (any rung)      → r1 unlocked, beat-r1-intro
4 of 6 r1 Neons caught         → gym-rope unlocked, beat-gym1-intro
gym-rope 3/3 parts checked     → beat-gym1-win, badge-threshold, r1 complete
r1 complete                    → fade-1 card unlocked
fade-1 cleared                 → r2 unlocked, beat-r2-intro
4 of 6 r2 Neons caught         → gym-longbar unlocked …
… same pattern for r3, r4 …
r4 complete                    → fade-4 card unlocked
fade-4 cleared                 → beat-fade-4-win, beat-ending, beat-afterhours
                               → After Hours (post-game) state
```

The **Cuedex is browsable from the very first open**, with all 24 slots visible as
silhouettes showing region and skill but not name — the collection is "already yours,
just empty." Locked-region Neons show a small "Velvet Row · locked" tag rather than being
hidden.

### 5.2 Catching (UI)

Honor system, identical in spirit to the quest board.

1. In a region view, an uncaught Neon renders as a card with its silhouette (`❓` + region
   colour), the **technique name**, and the **catch condition** in full.
2. Buttons: **`I did it`** (primary) and **`Not yet`** (ghost, just collapses the card).
3. Tapping `I did it`:
   - writes `story.catches[neonId] = { at: Date.now(), seenStage: 1 }`
   - `Store.addXp(15, neon.skill)` → `UI.xpToast(15, leveled)`
   - opens a **catch modal**: big emoji, `"Caught: Scoutle!"`, the stage-1 flavor line, and
     a single line showing what stage 2 needs (`"Evolves at 60 cap-control XP and 2
     completed Control quests"`).
4. A caught Neon's card flips to show its current stage name, current flavor, and two
   `UI.meter` bars: skill XP toward the next threshold and quests toward the next threshold.
5. Catches are **never revocable from the UI** (no un-catch button) — but a long-press /
   secondary "logged this by mistake" link in the detail sheet may remove it. Optional.

### 5.3 Evolution (UI)

Evolutions are **discovered, not triggered**. On every `StoryMode.render()` and on every
return to the story pane:

1. For each caught Neon, compute `stage = stageOf(neon)`.
2. If `stage > catches[id].seenStage`, queue an **evolution modal** (one at a time,
   sequentially):
   - big emoji, `"Scoutle evolved into Mapp!"`, the new stage's flavor line
   - `Store.addXp(stage === 2 ? 25 : 60, neon.skill)`
   - a single line naming the real reps that did it: `"6 Control quests. None of them
     happened in here."`
   - set `seenStage = stage`, push `"n-mapp:2"` into `story.evolutionsSeen`
3. Because stage is derived, evolutions can also fire from XP earned in Quests, Night Mode
   or the Analyzer — the modal simply appears next time the story pane is opened. That's
   intentional: the reward arrives *after* the real-world work, not during app use.

### 5.4 XP integration (no new currencies)

Everything routes through the existing `Store.addXp(amount, skillId)`. No new counters, no
new bars, no story-only currency.

| Action | XP | skillId |
|---|---|---|
| Read a story beat (first time) | 5 | *none* |
| Catch a Neon | 15 | the Neon's skill |
| Evolve to stage 2 | 25 | the Neon's skill |
| Evolve to stage 3 | 60 | the Neon's skill |
| Rival rung a / b / c | 30 / 45 / 60 | encounter's themed skill |
| Gym boss cleared | 120 | region anchor skill |

Rough full-journey total: 24 catches (360) + 48 evolutions (~2,040) + 5 rivals (~150–300) +
4 gyms (480) + ~22 beats (110) ≈ **3,100–3,300 XP**, which lands around level 9–10 on the
existing `80 + 45·(level−1)` curve. That's deliberately *not* the fastest path to levels —
quests and Night Mode remain the XP engine, and Story Mode is the spine that gives them
shape.

Beat XP carries **no skillId on purpose**: reading story text must be incapable of moving
any creature.

### 5.5 Badges

`StoryData.badges` declares the four story badges. On earning one, call **both**:
- `Store.awardBadge(badgeId)` — so it counts in the global badge list and lifetime stats
- push into `story.badges` — so the story pane can render the badge case without depending
  on `QuestData.badges`

(The coordinator may later add the four ids to `QuestData.badges` so they also render in
Settings. The build agent does not need that and must not edit that file.)

### 5.6 Screen sequence

The pane has three views held in a module-local `view` variable (`"journey"`, `"region"`,
`"dex"`), plus modals. No routing changes — `App.show("story")` always re-enters at
`"journey"`.

1. **Journey** (default) — vertical timeline:
   - header: current chapter name + a `x/24 caught · x/4 badges` line
   - the **active card** (whatever is next: a rival encounter, a region's catch list, or a
     gym) rendered large at top
   - completed regions collapsed above it with their badge emoji
   - locked regions below, dimmed, showing name + emoji + the unlock requirement in words
   - buttons: `Open the Cuedex`, `Story so far` (beat log)
2. **Region** — intro beat text at top (tap to re-read), the six Neon cards, then the gym
   card (locked with "Catch 4 to open the gym" or unlocked with the leader intro).
3. **Cuedex** — 4×6 emoji grid, one row band per region; tapping a tile opens a detail
   sheet with all three stage names, all three flavors, the technique, the catch condition,
   and progress meters.

Modals reuse `UI.modal` and the existing `.levelup` layout class (big glyph + title + sub +
button), which is exactly the right shape for catch/evolution/badge moments.

---

## 6. Science Appendix

*Why each mechanic is shaped the way it is.* Plain language; only researchers and concepts
named where the attribution is solid.

- **Graded exposure beats willpower.** Joseph Wolpe formalized systematic desensitization
  in the 1950s: build a hierarchy of feared situations rated on a subjective distress scale
  (0–100) and work up it in stages rather than white-knuckling the worst one. That's exactly
  why every Fade encounter offers three rungs of the same challenge instead of one fixed
  demand — the three rungs *are* the hierarchy, and the player rates and picks their own.
- **Expectancy violation, not just anxiety reduction.** Michelle Craske's inhibitory
  learning model (2014) reframes what exposure is doing: the durable ingredient is forming a
  new "this situation isn't dangerous" memory by having a predicted bad outcome fail to
  arrive — expectancy violation — rather than waiting for anxiety to habituate down within a
  session. Hence the win-text formula: Fade states a prediction out loud ("people notice when
  someone's trying," "you were more likable quiet") and the win text reports what actually
  happened ("nobody flinched; two people leaned in"). The prediction is named so reality can
  contradict it.
- **Craske's other two levers, both built in.** The same model recommends *dropping safety
  behaviors* and *varying context*. Several gym parts explicitly remove a safety behavior
  ("phone in your pocket the entire hour," "go alone, no wingman"), and the distinct-quest
  requirement for every evolution forces reps across varied situations rather than one
  repeated safe one.
- **Avoidance is what maintains the fear.** Clark & Wells's 1995 cognitive model of social
  phobia names four maintaining processes: self-focused attention, in-situation safety
  behaviors, anticipatory processing (the dread beforehand), and post-event processing (the
  ride-home post-mortem). Fade is literally written as anticipatory processing with a face —
  he only ever appears *before* something, and his final beat happens on the ride up rather
  than after a failure. That's why he's sympathetic and plausible rather than villainous:
  you don't beat him, you stop letting him drive.
- **Behavioral activation: action precedes motivation.** The behavioral activation
  tradition — Peter Lewinsohn's 1970s work, manualized by Neil Jacobson, Christopher Martell
  and Michael Addis — schedules valued activity *before* the person feels like doing it,
  working outside-in rather than waiting to feel ready. It exists precisely to break the
  withdrawal spiral where avoiding lowers mood, which fuels more avoiding. Story Mode never
  asks "how do you feel about this?" — it hands you one small specific action and a button.
- **Mastery experiences are the strongest source of self-efficacy.** Bandura identified
  four sources of self-efficacy — mastery experiences, vicarious experience, verbal
  persuasion, and physiological/affective states — and ranked personal mastery highest.
  This is the direct justification for the design law: creatures evolve *only* from real
  reps. An evolution is a mastery experience receipt. In-app grinding would be, at best,
  verbal persuasion — the weakest source.
- **Make the mastery visible.** Self-efficacy grows when progress is legible. A creature
  that visibly changes name, form and flavor text is a far better mastery record than a
  number going up, because it encodes *what changed about you*, not just how much.
- **Distinct reps, not repeated ones.** Every evolution requires a count of **different
  completed quests** in that skill, not just XP. This mirrors the exposure principle that
  varied contexts generalize better than repeating one safe situation — and it blocks the
  degenerate strategy of farming a single easy action.
- **Implementation intentions.** Gollwitzer's research on if-then plans shows that
  specifying *when, where and how* dramatically increases follow-through versus a general
  goal. Every catch condition and every gym part is written as a concrete situated action
  ("walk past the entry huddle inside sixty seconds"), never as an aspiration ("be more
  confident").
- **Habits take much longer than folk wisdom says, and one missed day is fine.** Phillippa
  Lally and colleagues at UCL (2010) found a median of roughly 66 days to near-automatic
  behavior, with an enormous range across individuals — and, importantly, that missing a
  single occasion did not derail habit formation, while missing repeatedly each week did.
  That finding is the direct justification for the no-punishment rule: skipping one Fade
  encounter genuinely doesn't cost you anything, and the design should not pretend otherwise.
  It also justifies stage 3 being slow — weeks and ~8 distinct reps — rather than a
  weekend's work.
- **Context stability does the heavy lifting.** Wendy Wood's habit research emphasizes that
  automaticity is built by stable cue-routine-reward loops tied to consistent contexts. That's
  why every region is a *place* and every gym challenge is written against a recurring venue
  Preston is actually in, rather than an abstract "practice confidence."
- **Implementation intentions, again.** Gollwitzer's if-then plans are the reason catch
  conditions read as situated triggers ("next time someone pauses, slow-triple-nod") rather
  than intentions ("be a better listener").
- **Endowed progress.** Nunes and Drèze (2006) gave car-wash customers a 10-stamp loyalty
  card pre-stamped with 2, versus an 8-stamp card starting empty — identical remaining work.
  Completion roughly doubled (about 34% vs 19%). It's why the Cuedex shows all 24 slots from
  the very first open, and why the prologue beat awards XP before any real challenge: the
  journey is framed as already underway when you arrive.
- **Goal gradient.** Kivetz, Urminsky and Zheng (2006) found effort accelerates measurably as
  a reward gets closer (coffee-card holders sped up roughly 20% near the free drink). Every
  caught Neon card shows two meters filling toward its next form, so there is always a
  visible near-complete bar somewhere in the Cuedex.
- **Collection completeness — used carefully.** The pull of a set is the visible gap, and
  collection research links completionism to a desire for structure and control. But the
  classic "unfinished tasks stick in memory" claim (the Zeigarnik effect) has held up poorly
  in recent replication work; the safer related finding is a general tendency to resume
  interrupted tasks. So the design leans on published, deterministic progress bars — which
  are well supported — rather than on completionism as the primary hook. Twenty-four is
  chosen to be genuinely *finishable*: big enough to feel like a world, small enough that
  completion is a real target rather than a treadmill.
- **Why creature collection works at all.** The genre's origin is a real hobby — Satoshi
  Tajiri's childhood bug collecting, which he set out to give kids who no longer had fields
  to look in. That's a useful north star here: the collection is supposed to be a record of
  going outside, not a substitute for it.
- **Badges as permission tokens, not trophies.** In the genre's structure, a badge is a
  functional gate: it unlocks new territory and new capability, not just a display case. This
  design copies that structure rather than the trophy-case version — a badge unlocks the next
  region *and* is a hard requirement for all eight apex final forms, so no Cuedex line can be
  completed without an actual boss night.
- **The rival's psychological function is a design inference, not a cited finding.** No solid
  published design analysis of the rival archetype turned up in research, so treat the whole
  Fade arc as an applied use of the Clark & Wells model (anticipatory processing given a
  character) rather than as an evidence-backed game-design pattern.
- **Self-determination: autonomy, competence, relatedness.** Deci and Ryan's SDT, applied to
  games by Rigby and Ryan, predicts that intrinsically motivating games satisfy all three.
  Autonomy = choosing your rung, your region order within a region, which Neon to chase.
  Competence = evolutions and badges. Relatedness = the actual point, since every action is
  with real people; the game deliberately has no leaderboard and no other players.
- **Deliberately no variable-ratio reward.** Skinner's variable-ratio schedule is the most
  powerful reinforcement pattern known and the engine behind slot machines and loot boxes —
  which is exactly why it's wrong here. Unpredictable payouts would train app-checking, not
  social behavior. Every threshold in this design is *published and deterministic*: you can
  read exactly what your next form costs. The only unpredictability left is the honest kind —
  how the real conversation goes.
- **Avoid the overjustification trap.** Extrinsic rewards layered onto something already
  intrinsically meaningful (real human connection) can crowd out the intrinsic motivation,
  especially when the reward feels controlling rather than informational. SDT-based
  gamification work suggests it cuts both ways depending on whether the system supports
  autonomy and competence. The mitigations here: rewards are *descriptive* — the evolution
  modal names the real behavior that caused it ("six Control quests; none of them happened in
  here") — challenges are self-selected from three rungs, and the app never sets a quota.
- **Never punish avoidance.** Punishing a skipped exposure would reproduce the exact
  self-criticism that fuels post-event rumination in social anxiety. There are no timers, no
  decay, no "Fade is winning" state, and "Not tonight" is always a visible, neutral, equally
  styled option. The only cost of skipping is that the page stays blank — which is
  information, not punishment.
- **The rival is you, and the ending says so.** The final beat refuses a "cured" narrative:
  Fade stays, and the win condition is accurate self-appraisal (knowing which nights he's
  right about) rather than the elimination of anxiety. That matches how exposure-based work
  actually resolves — the fear becomes navigable, not absent — and avoids setting up a
  relapse-as-failure story.
- **Arousal is data, not a verdict.** Bandura's fourth self-efficacy source is how you read
  your own physiological state. The copy throughout treats nerves as ordinary and shared
  ("everybody in that room is nervous — you just get to be the one who notices first")
  rather than as a signal that something has gone wrong.
- **Scope honesty.** Gamified and VR-assisted exposure show genuine promise for social
  anxiety, but the consumer-app evidence base is still mostly pilot-stage rather than
  large-trial confirmed. This is a personal training aid built on two popular-science books
  and borrowed clinical *structure*; it is not treatment, and no copy anywhere in Story Mode
  should imply otherwise.

---

## 7. Build Spec

Terse implementation contract. Two files, two globals, no build step, plain `<script>`
scripts in the existing style (`var`/`const` module IIFE, no imports, no frameworks).

> **Note:** `js/data/story-data.js` and `js/storymode.js` already exist as placeholder
> stubs. The stub `StoryMode` exposes exactly `teaser()` and `render()` — that is the live
> contract the rest of the app is already calling. **Replace both stub files wholesale**;
> do not create new files alongside them.

### 7.1 Files to create (replace the existing stubs)

**`js/data/story-data.js`** — defines one global, `StoryData`, pure data, zero logic:

```js
var StoryData = {
  regions: [ { id, name, emoji, subtitle, color, skills:[...], neonIds:[...], gymId,
               introBeat, unlockRival } ],           // 4
  neons:   [ { id, line, emoji, skill, region, technique,
               stages: [ {name, flavor}, {name, flavor}, {name, flavor} ],
               catch: "…",
               evo: { s2:{xp, quests}, s3:{xp, quests, badge?} } } ],   // 24
  gyms:    [ { id, name, region, leader:{name, blurb}, badge,
               introBeat, winBeat, challenge:[ "part1", "part2", "part3" ],
               rewardXp: 120, rewardSkill } ],       // 4
  badges:  [ { id, name, emoji, desc } ],            // 4
  rivals:  [ { id, name:"Fade", title, beat, winBeat, skill,
               rungs: [ {key:"a", text, xp:30}, {key:"b", …45}, {key:"c", …60} ],
               gates } ],                            // 5
  beats:   { beatId: "text…" },                      // ~22
  order:   [ /* explicit unlock chain, see §5.1 */ ],
};
```

**`js/storymode.js`** — defines one global, `StoryMode`:

```js
const StoryMode = (() => {
  // required public API (index.html + app.js + home.js already call these):
  function render() { … }        // renders into document.getElementById("pane-story")
  function teaser() { … }        // SHORT string for the Home card — REQUIRED, home.js calls it
  return { render, teaser };
})();
```

`teaser()` must return a one-sentence string reflecting current state, e.g.
`"Fade is waiting outside. The journey hasn't started."` /
`"Velvet Row · 3 of 6 caught · the gym opens at 4."` /
`"After Hours — 19 of 24 Neons, all four badges."`

Internal helpers the build agent should implement:
`st()` (lazy-init story state), `stageOf(neon)`, `questCountFor(skillId)`,
`catchNeon(id)`, `checkEvolutions()`, `clearRung(rivalId, rungKey)`,
`toggleGymPart(gymId, i)`, `claimBadge(gymId)`, `readBeat(beatId)`,
`unlockedRegions()`, `viewJourney() / viewRegion(id) / viewDex()`.

### 7.2 State shape to add

Lazily created on first Story Mode open (mirroring how `nightmode.js` creates
`Store.state.night`) — **do not edit `state.js` defaults**:

```js
Store.state.story = {
  v: 1,
  started: false,              // set true after beat-prologue is read
  catches: {},                 // neonId -> { at: <epoch ms>, seenStage: 1|2|3 }
  evolutionsSeen: [],          // ["n-mapp:2", "n-mapp:3", …] — modal dedupe + history
  regionsCompleted: [],        // ["r1", …]
  badges: [],                  // ["badge-threshold", …] (also mirrored via Store.awardBadge)
  gyms: {},                    // gymId -> { parts: [bool,bool,bool], cleared: false, at: null }
  rivals: {},                  // rivalId -> { rung: "a"|"b"|"c", at: <epoch ms> }
  beatsRead: [],               // ["beat-prologue", …]
  view: "journey",             // last view, for re-entry (optional)
};
```

**Stage is derived, never stored.** `stageOf(neon)` reads `Store.state.skillXp[skill]`,
counts matching `questLog` entries via `Quests.questById`, and checks `story.badges` for
apex gates. `seenStage` exists only to decide whether to show the evolution modal.

Every mutation calls `Store.save()`. Missing-key defensive reads throughout (a save from
before Story Mode existed must load cleanly).

### 7.3 Integration points — DO NOT TOUCH

These are already wired by the coordinator and are **off-limits**:

- **`index.html`** — already has `<section id="pane-story" class="pane"></section>` and
  already loads `js/data/story-data.js` and `js/storymode.js` in the correct order.
- **`js/app.js`** — already routes `story: () => StoryMode.render()`.
- **`js/home.js`** — already renders the Story Mode card and **already calls
  `StoryMode.teaser()`**. That method is a hard contract: it must exist and return a string
  on the very first load with no saved story state.
- **`js/state.js`**, **`js/quests.js`**, **`js/data/quests-data.js`**,
  **`js/data/captivate-content.js`**, **`js/data/cues-content.js`**, **`js/nightmode.js`**
  — read-only. Consume `Store.addXp`, `Store.awardBadge`, `Store.save`, `Quests.questById`,
  and the skill lists; change none of them.

### 7.4 Allowed edits

- The two new files above.
- **`css/style.css` — append only**, inside a single fenced block at the very end of the
  file:
  ```css
  /* ===== story mode ===== */
  … 
  /* ===== end story mode ===== */
  ```
  Reuse existing classes wherever possible: `.card`, `.card h3`, `.muted`, `.chip`,
  `.chip.xp`, `.chip.warm`, `.chip.comp`, `.chip.boss`, `.btn`, `.btn.primary`,
  `.btn.ghost`, `.btn.small`, `.btn.block`, `.section-label`, `.pane-title`, `.pane-sub`,
  `.stat-grid`, `.stat-tile`, `.badge-grid`, `.badge`, `.levelup`, `.lv-big`, `.lv-title`,
  `.lv-sub`, and `UI.meter`'s `.meter-row / .meter / .meter-fill`. New selectors should be
  namespaced `.story-*` / `.dex-*` / `.neon-*`.

### 7.5 Acceptance checks

1. Fresh save (`Store.reset()`): Home renders, `StoryMode.teaser()` returns a string, story
   pane opens on the prologue with no console errors.
2. Reading every beat cannot change any Neon's stage (beat XP has no skillId).
3. Catching a Neon adds exactly 15 XP to its declared skill and one `catches` entry.
4. Manually setting `Store.state.skillXp["cap-control"] = 300` **alone** does not evolve
   `n-mapp` past stage 1 → the quest-count clamp is enforced.
5. Apex Neons stay at stage 2 until the region badge is held, even at 999 XP.
6. Locked regions render but cannot be entered; every gate states its requirement in words.
7. Every rival card shows a neutral, equally-weighted "Not tonight" that closes with no
   state change.
8. Reload preserves catches, gym part checkboxes, rival clears, and read beats.
9. Original-content check: no third-party franchise names, creature names, or quoted text
   anywhere in either new file.
