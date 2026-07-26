# Engagement Audit — Captivate: Social Skills Quest

**Date:** 2026-07-26 · **Scope:** the shipped app (`state.js`, `quests.js`, `trainer.js`,
`skilltree.js`, `nightmode.js`, `home.js`, `analyzer.js`, content packs) **plus** Story Mode
as specified in `docs/story-mode-design.md` (treated as already part of the system).

**Frame.** This is a single-user personal app whose whole purpose is to increase *real-world
social reps*. So "engagement" here is only valuable insofar as it converts to reps in a room
with other humans. Every recommendation below is judged on **motivation-per-rep**, not on
time-in-app. Where a well-known mechanic would create in-app compulsion with no real-world
payoff, it is explicitly rejected (§4).

**Constraints assumed throughout:** static HTML, no backend, no push notifications, no
accounts, one user, localStorage only, all-carrot philosophy (nothing in the app may punish
passing, skipping, or missing).

---

## 0. What exists today (inventory)

| Layer | Content | Mechanics |
|---|---|---|
| Quests | 60 field quests (6 boss, 20 tally), 22 skills, XP 20–40 / boss 100–150 | 3 seeded daily picks, 1 weekly boss, 5 rotating side quests, custom quests |
| Trainer | 12 decks / 152 questions, 6 flashcard sets / 64 cards | 6-question runs, 8 XP per correct + 20 perfect bonus, flat 15 XP per flashcard set |
| Skills | 22 skills across 4 branches | 5 mastery pips at 20/60/140/260/420 skill XP |
| Night Mode | 27 live prompts (tiers 0–3) + 5 goal presets | timer-driven prompts, combo bonus (+5/chain, cap 25), call-your-shots goals (+10 tick, +50 hit), shift summary, panic rescue |
| Story Mode (spec) | 24 Neons, 4 regions, 4 gyms, 5 rival encounters, ~22 beats | derived evolution from real reps (skill XP **and** distinct completed quests), badge gates, three-rung self-selected exposures |
| Meta | 13 badges, 15 level titles, XP curve `80 + 45·(L−1)` | daily streak, lifetime XP, transcript analyzer with 50-entry history |

Content is genuinely rich. **The gap is almost entirely in the meta-layer: what brings him
back tomorrow, what protects a bad day, and what makes progress legible on the home screen.**

---

## 1. Scorecard

Severity = how much the gap costs *real-world reps*, not in-app minutes.

| # | Mechanic | What we have | What's missing | Severity |
|---|---|---|---|---|
| 1 | Commitment device (streak) | `streak` + 🔥 HUD chip, badges at 3 and 7 | **The streak measures the wrong thing** — see 1.1 | 🔴 Critical |
| 2 | Loss-aversion buffer | Nothing | No freeze, no repair, no `bestStreak`; hard reset to 1 | 🔴 Critical |
| 3 | Session ritual / daily goal | Home card wall, seeded daily spark | No single next action, no daily commitment, no explicit "minimum day" | 🟠 High |
| 4 | Re-engagement / lapse recovery | Nothing (no notifications by constraint) | No comeback path, no appointment mechanic, no calendar/badge substitute | 🟠 High |
| 5 | Progress endowment | Story Mode does this well (24 slots visible from open) | App-level endowment is weak; the badge case is **buried in Settings** | 🟠 High |
| 6 | Goal gradient (near-goal visibility) | Pips + Story Mode's two meters per Neon | Nothing surfaces the *closest* unfinished thing on Home | 🟠 High |
| 7 | Session-end evidence / debrief | Night-shift summary modal; analyzer history | No expectancy-violation capture, no "receipts" surface, no trend chart | 🟠 High |
| 8 | Mastery visibility & ceiling | 5 pips × 22 skills, level titles 1–15 | Titles stop at 15; pips stop at 420 XP; streak badges stop at 7 | 🟡 Medium |
| 9 | Identity & narrative | Strong — level titles, greeting uses the title, Story Mode's Fade arc | No self-authored identity statement; narrative lives in one pane | 🟢 Good |
| 10 | Variable reward | Deliberately deterministic (seeded dailies, published thresholds) | Curiosity is under-used at the *content* level (which challenge), which is safe | 🟡 Medium |
| 11 | Social accountability | None by design ("solo app", per PLAN.md §2) | Real-world accountability (the Winger) is in the *content* but not the *mechanics* | 🟡 Medium |
| 12 | Novelty budget | 60 quests / 152 questions / 27 night prompts | Level-gated: only **19 quests eligible at level 1**; daily picker ignores history; side list depletes | 🟡 Medium |
| 13 | Anti-grind integrity | Story Mode's quest-count clamp is excellent | Trainer XP routes to `skillXp` — in-app tapping *does* move creature progress halfway | 🟡 Medium |

### 1.1 The critical finding — the streak currently rewards opening the app

`app.js` calls `Store.touchStreak()` on boot (line 117), and `touchStreak()` sets
`lastActiveDay` and increments the streak unconditionally. `addXp()` also calls it, but boot
already did the work.

**Net effect: launching the app and doing nothing extends the 🔥 streak.** That is precisely
the mechanic the brief says to avoid — a loop that pays for pure screen time with zero
real-world benefit. It also quietly undermines Story Mode's first design law ("nothing grows
because you tapped something"), because the streak is the most emotionally loaded number in
the HUD.

This is a small code change with an outsized philosophical payoff (R1).

### 1.2 The second critical finding — a missed day is unrecoverable

`touchStreak()` resets to `1` the moment `lastActiveDay !== yesterday`. There is no freeze,
no grace period, no repair window, and **no `bestStreak` field** — so a broken streak erases
the record of the achievement entirely. For a user with social anxiety, the failure mode is
well documented: one bad night → streak gone → "I'm not the kind of person who keeps this
up" → app abandoned. Duolingo's retention team has publicly described streak forgiveness as
one of their highest-yield experiments precisely because of this cliff.

### 1.3 Supporting detail on the medium-severity items

- **Daily picker (`quests.js:23`)**: the comment promises "one warm-skill, one comp-skill,
  one any", but the implementation is `shuffled.slice(0,3)` with a biased
  `sort(() => rand() - 0.5)`. It never consults `questLog`, so completed quests re-roll while
  the *side quest* list (which does filter `questLog`) permanently depletes to
  "You've seen it all for now."
- **Level gate math**: at level 1, 19 of 60 quests are eligible; 9 quests need level 6. Early
  novelty is thinner than the content total suggests, and Story Mode adds 24 more one-shot
  catch actions — front-loading is fine, but the mid-game (levels 3–6) is where the pool
  should widen and currently the widening isn't visible to the player.
- **Trainer XP integrity**: all 12 decks and 6 flashcard sets carry a `skill`, so quiz XP
  feeds `skillXp`, which is one of Story Mode's two evolution inputs. The distinct-quest
  clamp (`qc`) still blocks pure-tapping evolutions, which is the right defence — but the
  honest statement is "in-app study contributes half the fuel," not "none." Worth keeping the
  quiz XP small relative to field XP (R12 guardrail). *No edit to Story Mode files
  recommended here — this is an observation for the coordinator.*
- **Analyzer**: stores up to 50 analyses but renders only the last 5 as a list. The
  warmth/competence trend — the single most powerful "you are objectively getting better"
  artifact in the whole app — is never drawn.

---

## 2. Case studies — eight lessons worth stealing

### 2.1 Duolingo: the freeze has to already be in your pocket

Duolingo grants Streak Freezes automatically at milestones rather than only selling them,
and their retention team has publicly described giving new users multiple freezes up front as
one of the biggest early wins on daily retention. The mechanism is obvious once stated: a
person who has already missed a day will not open the app to buy protection in time — the
only freeze that ever saves a streak is one that was granted before it was needed. The
underlying force is loss aversion (Kahneman & Tversky): a 180-day streak holder is motivated
by not losing 180, not by reaching 181. **For us:** auto-grant 2 freezes at streak start and
1 more every 5 days, cap 3, consume silently, and tell him afterwards ("A freeze covered
Tuesday"). Never sell them, never let him grind them.

### 2.2 Duolingo: commit to the streak *before* the first session ends

Duolingo's onboarding has the user pick a daily goal and commit to a streak target, and shows
Day 1 already started, before the sign-up screen appears. The streak is not a feature
discovered later — it is a promise the user made to themselves in minute one. This is
Gollwitzer's implementation-intention research operationalized: naming *when and how much*
massively outperforms a vague intention. **For us:** a one-tap "tonight I'm going for
casual / normal / big night" selector that sets the day's rep target (1 / 3 / 5) and rewrites
the Home copy around it.

### 2.3 Duolingo: one screen, one obvious next action

Duolingo's home is a path with exactly one lit node. Every redesign has pushed further toward
a single unambiguous CTA, because choice cost is the enemy of a two-minute habit — the Fogg
Behavior Model puts ability/simplicity on equal footing with motivation. Our Home currently
presents five sibling cards (spark, Night Mode, Story Mode, quests, analyzer) of roughly
equal visual weight. **For us:** a Home hierarchy where "today's one thing" is 3× the size of
everything else, and everything else collapses under it.

### 2.4 Duolingo's mascot: the emotional layer, and where it turns ugly

Duo works because the mascot maps to user *states* — celebrating, sleeping, waiting — turning
a system message into something with a face. The failure mode is equally documented: the
guilt-notification genre ("you're scaring me") that made Duolingo a meme is loss framing
pointed at a person who has already lapsed. **For us:** Fade is already a far better version
of this idea — a rival written as anticipatory processing (Clark & Wells's model of social
phobia), sympathetic and never punitive. Give Fade a *presence outside the story pane* (a
rotating one-liner on Home after a lapse) but keep the design doc's rule: he never has a
"winning" state and never guilts.

### 2.5 Habitica: punishment mechanics backfire on exactly this user

Habitica gives tasks HP damage for misses. The published analysis ("Counterproductive effects
of gamification: an analysis on the example of the gamified task manager Habitica",
*International Journal of Human-Computer Studies*) found *every* participant experienced some
counterproductive effect, with only about half rating the rewards as appropriate — and the
most-reported failure was being punished during genuinely busy, productive periods. A 2026
*Frontiers in Public Health* study of gamified health education traced a similar arc:
immersion → anxiety → burnout, with anxiety mediating the path. **For us:** this validates
the existing all-carrot law, and it is the reason R2 recommends freezes rather than any form
of decay, and why no recommendation below adds a resource that can be lost.

### 2.6 Finch: care-for-something-else beats perform-for-yourself

Finch's loop is that *your bird* benefits when you do self-care, with no penalty for an off
day. Externalizing the beneficiary removes the self-evaluative sting — the user isn't grading
themselves, they're feeding something. Finch also earns long-run retention by having the pet
visibly change over months. **For us:** Story Mode's Neons are already this mechanic and are
better-motivated, because a Neon's growth is a literal receipt of a real rep (Bandura's
mastery experiences — the strongest source of self-efficacy). The lesson to import is
**visibility**: Finch's bird is on the home screen and in a widget; our 24 Neons live behind
a tab. Put the nearest-to-evolving Neon on Home.

### 2.7 Strava: accountability without a leaderboard

Strava's strongest retention force isn't personal stats, it's kudos — one-tap, zero-composition
social acknowledgement — plus segments, which shrink the comparison set from "everyone on
earth" to "people who ran this hill," so wins stay attainable. We have no backend and one
user, so the naive port is impossible. But the *real* social graph is available: Captivate's
own content already names the **Winger** (the wing-person) and the **Riser**. **For us:** a
weekly recap card rendered to an image and pushed through `navigator.share` — accountability
delivered by iMessage instead of by a server. No follower counts, no comparison, opt-in.

### 2.8 Pokémon GO: the daily bonus that pays consistency over intensity

Pokémon GO's first-catch and first-stop-of-the-day bonuses escalate on a 7-day chain, so a
player who does one small thing daily out-earns someone who grinds the same volume in a
single session. It rewards *showing up in the world*, and the bonus escalates just enough to
make day 7 feel worth defending. The genre origin matters too: creature collection began as
Satoshi Tajiri's bug-collecting hobby — a record of going outside. **For us:** an escalating
first-rep-of-the-day bonus (small, published, capped) is the cleanest way to pay consistency
without paying screen time, since the trigger is a logged real-world action. Ties directly to
Lally et al. (2010), whose habit-formation data found missing a single day doesn't derail
automaticity while missing repeatedly does — so the design should defend *rate*, not
perfection.

### 2.9 Cross-cutting: variable ratio is the wrong tool here

Skinner's variable-ratio schedule is the most powerful reinforcement pattern known, and it is
the engine of slot machines and loot boxes. Story Mode's design doc already rejects it, for
the right reason: unpredictable payouts train *app-checking*, which is pure screen time with
no rep attached. The safe substitute is **variable content with deterministic payout** —
he doesn't know *which* challenge is behind the envelope, but he knows exactly what it pays.
Curiosity intact, compulsion loop absent.

---

## 3. Prioritized recommendations

Ranked by impact-per-effort. Effort: **S** ≈ under an hour, **M** ≈ a half-day, **L** ≈ a day+.
Every item is implementable in static HTML with localStorage unless marked **[PWA]**.

---

### R1 — Make the streak measure real-world reps, not app opens · **S** · 🔴 highest value

**Build:** Remove `Store.touchStreak()` from the `app.js` boot sequence. Introduce
`Store.logRep(source)` called from exactly the places a real-world action is claimed:
`Quests.completeQuest`, tally goal-reached, Night Mode `resolve(true)` and `tickGoal`, and
(via the Story lane's existing calls to `Store.addXp`) catches, rungs and gym parts. Keep a
separate, silent `lastOpenedDay` for analytics only — never shown, never rewarded. Rename the
HUD label to **rep streak** so the meaning is explicit.

**Expected effect:** The most emotionally loaded number in the app starts pointing at the
behavior that actually helps. Removes the app's only pure screen-time reward.
**Guardrail:** this recommendation *reduces* engagement-for-its-own-sake on purpose. In-app
study (quizzes, flashcards, reading beats) must **not** count toward the rep streak.

---

### R2 — Streak freezes, auto-granted, plus an unerasable best streak · **S/M** · 🔴

**Build:** `state.js` gains `freezes: 2`, `bestStreak: 0`, `freezeLog: []`. On load, if the
gap is exactly one missed day and `freezes > 0`, spend one, keep the streak, and queue a calm
toast: *"A freeze covered Tuesday. 2 left."* Grant +1 freeze every 5 streak days, cap 3.
`bestStreak` updates on every increment and is displayed permanently next to the current
streak ("best: 23"). Add a 48-hour **repair** window: after a lapse, the Home comeback card
offers "Do one rep today and Tuesday's chain is restored" — once per lapse.

**Expected effect:** Converts the single most common quit-trigger (one bad night) into a
non-event. This is the highest-yield published retention lever in the case studies.
**Guardrail:** freezes are *granted only*, never purchasable, never farmable, hard cap 3, and
the repair is once-per-lapse — so protection never becomes numbness.

---

### R3 — "Today's one thing": a session ritual with a single CTA · **M** · 🟠

**Build:** Restructure `home.js` into a strict hierarchy: (1) streak line + freeze count,
(2) **one** large card containing today's single highest-priority action — the day's minimum
rep, chosen deterministically from the daily quests / active Fade rung / next Neon catch,
with the exact opening line already visible, (3) a compact "also today" strip (spark, Night
Mode, Story, analyzer) at half weight. Add a defined **minimum viable day**: one sentence to
one human, staff counts — always available, always satisfies the streak.

**Expected effect:** Removes choice cost at the exact moment activation energy is lowest.
The floor makes a bad-anxiety day survivable without breaking the chain.
**Guardrail:** the minimum must stay genuinely tiny; never escalate it automatically because
he's been doing well.

---

### R4 — Comeback path for lapses (no guilt copy) · **S** · 🟠

**Build:** If `daysSince(lastRepDay) >= 2`, Home leads with a warm return card: best streak
shown intact, a rotating Fade one-liner (reusing Story Mode's voice, read-only from
`StoryData`), and a single tier-0 rung — "one sentence to one person; staff counts" — paying
**full** XP, not reduced. Never any variation of "you're losing progress."

**Expected effect:** Lapse recovery is where habit apps lose users permanently; a kind,
one-tap re-entry is worth more than any acquisition-side polish.
**Guardrail:** no counting of days missed, no red, no comparison to his past self, no
escalating nags. One card, dismissible.

---

### R5 — Surface the nearest goal (goal gradient) · **S/M** · 🟠

**Build:** A `closestWins()` helper scanning: skill pips within 25 XP of lighting, Neons
within 1 distinct quest of evolving, decks 1 question short of a perfect, streak N days from
the next milestone, badges one condition away. Render the top 2 on Home as
"**⚡ One rep away**" chips that deep-link to the exact quest that would finish them.

**Expected effect:** Kivetz/Urminsky/Zheng's goal-gradient effect showed measurable
acceleration near a reward; there is currently *no* surface in the app that says "you are
close to something." This is the cheapest motivation-per-line-of-code in the list.
**Guardrail:** compute from published, deterministic thresholds only — never invent urgency
or fake scarcity ("expires soon").

---

### R6 — Evidence log: capture expectancy violations · **M** · 🟠

**Build:** After a completed field quest or a night shift, one optional two-field card:
*"What did you expect?"* / *"What actually happened?"* (chips: went fine / better than
expected / awkward but survivable / hard, plus optional free text). Store in
`state.receipts[]`. Surface as a **Receipts** section — a rotating "proof card" on Home
("6 weeks ago you expected to be ignored. You weren't.") and a full list in Skills.

**Expected effect:** This is the highest-value *psychological* mechanic available and it
doubles as inexhaustible re-engagement content generated by his own life. It directly
implements Craske's inhibitory-learning model (the durable ingredient of exposure is a
predicted bad outcome failing to arrive) and counters Clark & Wells's post-event processing
by putting an accurate record next to the ride-home post-mortem.
**Guardrail:** always skippable in one tap; skipping is never mentioned again; no XP penalty
for skipping (a small XP *bonus* for filling it in is fine).

---

### R7 — Appointment mechanic without push: `.ics` export + next-shift countdown · **S/M** · 🟠

**Build:** "Set my next night" on Home → time picker → (a) a persistent countdown card
("Friday 10pm · Velvet Row · 2 days"), (b) a generated `.ics` blob download with a `VALARM`
30 minutes prior. iOS Calendar delivers the reminder that the web app cannot. Optionally ship
a documented Shortcuts recipe in the README.

**Expected effect:** Appointment mechanics are the standard substitute for push. Committing
to a specific night in advance is also a textbook implementation intention.
**Guardrail:** one event per commitment; never auto-generate recurring reminders he didn't
ask for.
**Note:** true push notifications are **not** achievable in a static PWA without a push
server and VAPID keys; local scheduled notifications need a Capacitor wrapper (already on
PLAN.md's mobile roadmap step 3). Calendar export is the honest no-backend answer.

---

### R8 — Move the collection out of Settings; add app-level endowed progress · **S** · 🟠

**Build:** The 13-badge grid currently lives at the bottom of **Settings**. Move it to a
"Trophy Room" block on Home (or Skills) showing badges, Story badges, and Neon count as
`x / N` with locked items visible as silhouettes. Show all 22 skills with their pip state in
a compact grid, not just a long list.

**Expected effect:** Nunes & Drèze's endowed-progress work (pre-stamped loyalty cards roughly
doubled completion) says visible-but-incomplete sets pull hard. Story Mode already applies
this correctly; the base app hides its collection in a settings screen, which is close to
throwing the mechanic away.
**Guardrail:** keep every set **finishable** — no infinitely-expanding badge list.

---

### R9 — Extend the ceilings: streak milestones past 7, titles past 15, pips past mastery · **S** · 🟡

**Build:** Add streak badges at 14 / 30 / 60 / 100 with distinct art and a small escalating
first-rep-of-the-day XP bonus (e.g. +5 at streak ≥7, +10 at ≥30, capped). Add level titles
16–25 in an "After Hours" register that matches Story Mode's post-game tone. Add a 6th
"living mastery" pip state for skills past 420 XP that shows reps-in-the-last-30-days rather
than lifetime XP.

**Expected effect:** Every one of the three progression tracks currently dead-ends
(streak at 7, titles at 15, pips at 420). Dead ends are where novelty decay converts into
quitting.
**Guardrail:** the escalating daily bonus is capped and triggered by a *logged real rep*, so
it can never reward opening the app; the 30-day pip decays gracefully with no penalty text.

---

### R10 — Weekly recap card he can send to his Winger · **M** · 🟡

**Build:** Every Sunday, generate a recap: reps logged, best combo, Neons evolved, skills
that moved, one quoted receipt from R6, next week's stated intention. Render to canvas →
`navigator.share` (iOS Safari supports sharing a File) with a PNG download fallback.
Captivate's own content already defines the **Winger** — let him name one in Settings, and
have the card address them.

**Expected effect:** The only credible social-accountability mechanic available with no
backend, and it borrows Strava's real lesson (lightweight acknowledgement from someone who
knows you) without a leaderboard.
**Guardrail:** entirely opt-in, no automatic sharing, no streak-shaming copy on the card, and
nothing on it that compares him to anyone.

---

### R11 — Fix the daily picker; add a novelty budget meter · **M** · 🟡

**Build:** In `ensureDaily()`: (a) implement the variety rule the comment already promises —
one warmth-axis, one competence-axis, one wildcard; (b) weight selection toward
least-recently-completed and never-seen quests using `questLog[].day`; (c) replace the biased
`sort(() => rand() - 0.5)` with a seeded Fisher–Yates; (d) show a small "fresh content left"
line ("31 quests you haven't run yet · 4 unlock at level 4") so the pool feels deep instead
of depleted. Expand the side-quest list beyond 5 items with a "show more" toggle.

**Expected effect:** Directly attacks novelty decay — the documented long-run killer in every
case study. Also makes the level-gate a visible carrot rather than an invisible wall.
**Guardrail:** keep daily picks deterministic per date (no reroll button, no paid reroll) so
the app can't become a slot machine for content.

---

### R12 — Spaced repetition in Trainer, with XP that stays honest · **M** · 🟡

**Build:** A three-box Leitner scheduler over the 152 questions and 64 flashcards: missed
items return tomorrow, correct items in 3 then 10 days. Home shows "12 cards due" only when
something is genuinely due. Keep per-correct XP at its current 8 and **do not** raise it.

**Expected effect:** Gives the Train tab a reason to exist on days he can't get out, and
converts one-shot decks into a durable loop — without inflating in-app earning.
**Guardrail:** the ratio matters. Field quests pay 20–40 XP and bosses 100–150; a full quiz
run pays ~68. Keep study XP strictly below field XP so screen practice never out-earns a
real rep — and consider capping study XP per day (e.g. 60) so a long session can't
substitute for going out.

---

### R13 — Nightly intention selector ("what kind of night is this?") · **S** · 🟡

**Build:** One-tap selector on Home: **quiet night (1 rep) / normal (3) / big night (5)**.
Sets the day's target, rewrites the Home headline, and drives a small progress ring. Stored
per-day so the weekly recap can report "you called 4 normal nights and hit 3."

**Expected effect:** Autonomy is one of SDT's three needs (Deci & Ryan), and self-set targets
outperform imposed ones; it also converts a vague "practice today" into an
implementation intention.
**Guardrail:** choosing "quiet night" must be styled identically to "big night" — no dimming,
no discouraging copy, no reduced XP rate. Missing a self-set target produces no message at all.

---

### R14 — The envelope: variable content, fixed payout · **S** · 🟡

**Build:** A single face-down "🎴 Wildcard" card on the quest board each day. The XP is
printed on the back of the card *before* he flips it; only the challenge identity is unknown.
Flipping reveals one quest drawn from tiers he's unlocked. One per day, seeded by date.

**Expected effect:** Recovers curiosity — Octalysis core drive 7, currently the app's thinnest
drive — without any of the harm.
**Guardrail:** the payout is **fixed and published**; there is no jackpot, no rarity tier, no
"try again," and no way to open more than one per day. This is deliberately *not* a
variable-ratio schedule.

---

### R15 — PWA install: manifest, service worker, app badge · **M** · **[PWA]** · 🟡

**Build:** `manifest.webmanifest` + icons + a cache-first service worker (everything except
the analyzer already works offline). Once installed, use `navigator.setAppBadge(n)` to show
reps remaining today on the home-screen icon, cleared when the target is hit.

**Expected effect:** Home-screen presence is itself a trigger (the "red dot" is one of the
most reliably reported DAU levers in the Duolingo literature), and offline capability makes
the app usable in a basement venue with no signal — a real constraint for this user.
**Guardrail:** the badge shows **reps remaining**, never unread-style noise, and disappears
at zero rather than nagging. Do not add a badge that counts in-app tasks.
**Depends on:** install-to-home-screen. Push notifications remain out of reach without a
server (see R7 note).

---

### Suggested build order

**Batch 1 (half a day, transforms the app):** R1 → R2 → R4 → R5 → R8.
Together these fix what the streak means, make a bad day survivable, make a lapse recoverable,
and put "you're one rep away" and the trophy case on screen.
**Batch 2:** R3 → R6 → R7 → R9.
**Batch 3:** R10 → R11 → R13 → R14 → R12 → R15.

---

## 4. Do NOT do

Mechanics that are proven elsewhere and would be counterproductive here.

1. **Leaderboards or leagues.** Single user. A synthetic ladder against fake rivals is
   fabricated social proof, and Story Mode's SDT reasoning explicitly chooses relatedness
   *with real people* over in-app competition.
2. **HP / hearts / damage for misses.** Habitica's documented failure mode, and a direct
   violation of the all-carrot law. Never add anything that can be *lost* through inaction.
3. **Streak decay, streak leaderboards, or "Fade is winning" states.** Loss framing pointed
   at someone who has already lapsed is the guilt-notification pattern that made Duolingo a
   meme, and it is the exact self-criticism that fuels post-event rumination in social anxiety.
4. **Variable-ratio payouts, loot boxes, gacha, rarity tiers, or mystery XP amounts.** Trains
   app-checking, not social behavior. Variable *content* with fixed payout (R14) is the
   permitted version.
5. **A currency + shop economy (gems, cosmetics, purchasable freezes).** Creates an in-app
   earning loop with no real-world correlate, and turns streak protection into a grind.
   Freezes are granted, full stop.
6. **Timed "double XP" boosts or happy-hour windows.** Rewards binge sessions and punishes
   the person whose social opportunities land at fixed times — which is exactly this user,
   whose nights are scheduled by work.
7. **Idle / tap / cosmetic-pet loops that grow from app time.** Directly violates Story Mode's
   first design law.
8. **Infinite collections or endlessly-expanding badge lists.** Keep the Cuedex at 24 and the
   badge set finishable; a completable set is a milestone, a treadmill is a chore.
9. **Reroll buttons or paid rerolls for daily quests.** Determinism is what stops the daily
   roll from becoming a slot pull; PLAN.md already made this call correctly.
10. **Nag escalation of any kind** — repeated prompts, increasingly urgent copy, red counts
    of days missed, or "we haven't seen you in a while" guilt. One calm comeback card (R4),
    dismissible, then silence.
11. **Mandatory reflection or journaling.** R6 is high value precisely because it is optional;
    made compulsory it becomes friction at the worst possible moment.
12. **Any mechanic that makes in-app study out-earn a real rep.** The XP ratio is a policy,
    not an accident — protect it in every future feature.

---

## Sources

- Duolingo streaks: [Jackson Shuttleworth on Lenny's Podcast](https://www.getrecall.ai/summary/lennys-podcast/behind-the-product-duolingo-streaks-or-jackson-shuttleworth-group-pm-retention-team) · [Deconstructor of Fun](https://duolingo.deconstructoroffun.com/mechanics/streaks) · [Duolingo blog](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/) · [Trophy case study](https://trophy.so/blog/duolingo-gamification-case-study)
- Duolingo notifications: [Deconstructor of Fun](https://duolingo.deconstructoroffun.com/mechanics/notifications)
- Streak design and its failure modes: [Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-streak-system-ux-psychology/) · [Yu-kai Chou](https://yukaichou.com/gamification-analysis/streak-design-gamification-motivation-burnout/)
- [Counterproductive effects of gamification: Habitica — International Journal of Human-Computer Studies](https://www.sciencedirect.com/science/article/abs/pii/S1071581918305135)
- [From immersion to burnout: anxiety and motivational exhaustion in gamified health education — Frontiers in Public Health (2026)](https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2026.1732924/full)
- [Finch's gamified widgets and retention — Deconstructor of Fun](https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl)
- Strava: [gamification strategy](https://trophy.so/blog/strava-gamification-case-study) · [segmented leaderboards](https://trophy.so/blog/how-strava-uses-segmented-leaderboards-to-drive-engagement)
- [Daily bonuses and streaks in Pokémon GO — Forbes](https://www.forbes.com/sites/davidthier/2016/11/08/first-catch-of-the-day-pokestop-how-daily-bonuses-and-streaks-work-in-pokemon-go/)
- [Endowed progress](https://learningloop.io/plays/psychology/endowed-progress-effect) · [goal gradient](https://learningloop.io/plays/psychology/goal-gradient-effect) — Learning Loop

Named research referenced above and already documented in `docs/story-mode-design.md` §6:
Kahneman & Tversky (loss aversion), Nunes & Drèze 2006 (endowed progress), Kivetz, Urminsky &
Zheng 2006 (goal gradient), Gollwitzer (implementation intentions), Lally et al. 2010 (habit
formation, missed days), Craske 2014 (inhibitory learning), Clark & Wells 1995 (social phobia
maintenance), Bandura (self-efficacy sources), Deci & Ryan (self-determination theory),
Skinner (variable-ratio schedules), BJ Fogg (behavior model), Yu-kai Chou (Octalysis).
