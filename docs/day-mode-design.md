# Day Mode — daytime social practice

Design doc. Written 2026-07-27 against `js/nightmode.js` as reworked in `docs/adhd-ux-review.md` §4.
Binding inputs: the ADHD budgets in `adhd-ux-review.md` §3–§4, the all-carrot rules in §5, the
Liquid Glass hard rules in `liquid-glass-ui-plan.md` §5, and the owner mandate below.

> Owner mandate (2026-07-27): Day Mode integrates with the quest system — **no parallel silo**.
> And quests become time-of-day aware: *"i shouldnt be prompted to do something at the club when its 1pm."*

---

## Decision summary

1. **Day Mode is not a new mode — it is the Quest Board, rebuilt as a time-aware board.** Today's 3
   daily quests *become* today's day missions; one roll, one done-list, one ledger. No second "3".
2. **Model = (b) all-day mission board + optional (c) burst timer.** No timed session by default:
   3 missions live all day, checked off whenever the world offers a moment; a `▶ Burst` button
   borrows the night cadence for 30 minutes when he is deliberately out to practice.
3. **Engine sharing = extract the pure math, not the lifecycle.** New `js/live-engine.js` holds the
   seeded set-picker, swap-picker and combo/tier XP; `nightmode.js` re-points two functions at it and
   keeps its own state, render and notifications. No mode-config rewrite of the file e2e guards hardest.
4. **Time-awareness is one-directional.** Night-tagged content is gated to 17:00–04:00; day content is
   never gated. The daily slate is rolled once per calendar day from the night-free pool, so the
   1pm-club bug is impossible by construction and the boundary has nothing to re-roll.
5. **26 new day missions** (tiers 0–3) ship as quests in `js/data/day-missions-data.js`, merged into
   `QuestData.quests` — so they log reps, pay skill XP, count in `questLog`, and evolve Neons for free.

---

## 1. Engine reuse — what Day borrows from Night

**Recommendation: extract pure helpers into `js/live-engine.js` (`LiveEngine`); do not parameterize
`nightmode.js` into a generic mode engine.**

Night Mode is a *live timed session*: wake lock, interval cadence, 300-range notifications, goals with
deadlines, an end-of-shift summary, `visibilitychange` re-render. Day Mode is a *persistent board*: no
clock, no session, no end. A single engine with a `mode` config would thread ~6 conditionals through
the highest-risk file in the repo, guarded by the strictest steps in `tests/e2e.mjs` (4a–4i), to share
code that is ~40 lines of arithmetic. Wrong trade.

`LiveEngine` (pure — no DOM, no `Store` writes, no `Native` calls, fully unit-testable from `page.evaluate`):

| Export | Comes from | Used by |
|---|---|---|
| `TIER_XP = {0:8, 1:15, 2:25, 3:40}` | `nightmode.js:80` | both |
| `pickSet(pool, {tiers, rand, size, exclude})` | body of `buildSetlist()` | both |
| `swapPick(pool, {tier, rand, exclude})` | body of `swap()` | both |
| `comboBonus(n)` → `Math.min(25, (n-1)*5)` | `resolve()` | both |
| `fmtClock(ms)` → `"4:07"` | `fmt()` | both |

Migration rule for the build agent: **port the loops verbatim**, including the order of `rand()` calls
(tier draw, then pool draw). No e2e assertion pins specific prompt ids — 4d only pins *stability across
a reload* — so identical call order keeps every night step green without needing identical output.
`buildSetlist()` and `swap()` shrink to 5-line wrappers; everything else in `nightmode.js` is untouched.

Day Mode does **not** reuse: goals (`GOAL_PRESETS`, `tickGoal`, `goalModal`), wake lock, `endSession`,
the 300/400 notification builders, `setDots` (it gets its own 3-row board instead).

Day Mode **does** reuse, by calling existing code rather than copying it: `Quests.completeQuest()` for
logging (rep + XP + badges + reschedule), `Quests.howToModal()` for the expandable how-to,
`Store.seededRandom` / `Store.todayKey`, and the `.card` / `.gdot` / `.say-chip` CSS already in place.

---

## 2. The day model, and how it merges with daily quests

### 2.1 Why (b)+(c), not (a)

A timed session with shorter defaults (a) fails the actual constraint: daytime windows are *found*, not
scheduled. A 10-minute queue, three gym rest sets and a walk to the car are not a shift, and a timer
firing while he is mid-errand is a nag — which §5 forbids. The board (b) matches the world: the mission
is already decided and waiting, so the moment a window opens there is zero decision between noticing it
and acting. The burst (c) survives as an opt-in for the one case where a timer helps — deliberately
going out to practice for half an hour.

### 2.2 The integration: today's 3 daily quests *are* today's day missions

There is no second set of three. `Quests.ensureDaily()` keeps its seed (`todayKey + "|daily"`) and its
storage (`Store.state.dailyQuests`), and gains a **composition rule**:

| Slot | Pool | Tier |
|---|---|---|
| A | day missions (`when:"day"`, has `tier`) | 1 |
| B | day missions | 2 — upgraded to 3 on a seeded 1-in-4 of days once `Store.state.level >= 5` |
| C | book quests (`when !== "night"`, no `tier`, not boss) | — |

Slot C keeps the Captivate/Cues technique layer alive (and keeps skill coverage wide for Neon
evolution); slots A and B are the situational reps. Sorted easiest-first, exactly like the night setlist.

The Quest Board pane (`#pane-quests`, tab relabelled **Today**) becomes the single day surface:

1. **Today's 3** — the first unfinished one renders as a *focus card* (mission text, opener chips,
   `✔ Did it`, `⇄ Swap`, `🛟 Smaller`, ghost `▶ Burst`); the other two collapse to one-line rows with a
   check box. Finishing the focus card promotes the next row. This is Night's one-thing-at-a-time
   discipline applied to a board.
2. **🌙 Tonight** — night-tagged quests, rendered *only* in the night window or during a shift (§4.2).
3. **More quests** — a single collapsed disclosure holding side quests + the custom-quest author
   (this is `adhd-ux-review.md` P3.2, finally landed; it is what pays for the focus card's height).

No new pane, no new tab, no duplicate ledger. Night Mode keeps `#pane-night` untouched, because a live
timed shift genuinely is a different surface.

### 2.3 Time-awareness

Single source of truth, added to `state.js`:

```js
Store.isNightHour()   // hour >= 17 || hour < 4
Store.nightKey()      // todayKey() of (now - 6h) — a shift that crosses midnight keeps one key
```

Rules:

- **Night content is gated; day content is not.** A club quest at 1pm is a wrong prompt; a coffee-shop
  mission at 11pm is merely an odd time to do it. The complaint is one-directional, so the fix is too.
  This is what keeps the boundary trivial.
- **The daily slate never re-rolls.** It is drawn once per calendar day from a pool that already
  excludes `when:"night"`. The clock only changes (a) whether the Tonight lane renders, (b) where the
  Home card points. A quest completed at 1pm is still completed at 1am — completion lives in
  `dailyQuests.done` + `questLog`, both keyed by day, and nothing in the window logic touches them.
- **The Tonight lane is seeded on `nightKey()`**, not `todayKey()`, so it does not silently swap out at
  midnight in the middle of a shift.

### 2.4 Tagging the existing pool

Add `when: "day" | "night" | "anytime"` to quest objects. **Missing ⇒ `"anytime"`** (fail-safe: night
requires an explicit opt-in). Audit of the 60 existing quests, done by reading every `desc`/`tip`/`how`:

- **Genuinely night-flavoured: exactly one.** `cap-q-boss-room` ("BOSS: Work the Room" — door, Start
  Zone, bar-end sweet spots, one real event) → `when: "night"`.
- **False hits from a lexical scan, all staying `anytime`:** `cap-q-belonging` ("lunch, party, meeting"),
  `cues-q-bridge` (a drink is one example of a handoff), `cues-q-front-day` / `cues-q-listening-sounds`
  ("door", "doorway" in tips), `cues-q-chameleon` ("venue"), `cap-q-valueaudit` ("keeps you up at
  night"), `cues-q-steeple-week` ("table"), `cap-q-congruency`, `cap-q-boss-cipher`.
- **Everything else** (desk/admin quests like `cues-q-email-audit`, `cues-q-photo-audit`,
  `cap-q-selfmatrix`; and event-shaped-but-hour-agnostic ones like `cap-q-raver`, `cap-q-3in3`) stays
  `anytime` and remains eligible for slot C.

So the 1pm-club bug is today mostly *latent* — the real night-tagged content is Night Mode's 26 prompts,
which are night by construction and never enter any roll. The tagging pays for itself the moment more
night quests are written, and step 14i (§7) enforces that they get tagged.

**Weekly boss:** `ensureBoss()` is unchanged (weekly, stable, deterministic). A night-tagged boss is a
week-scope commitment, not an hourly prompt — it renders with a `🌙 Tonight` chip and, during day hours,
sits inside the Tonight lane's collapsed position rather than above the fold.

---

## 3. The day mission pool — 26 missions

New file `js/data/day-missions-data.js`, exposing `DayMissions.quests`; `quests-data.js`'s getter
becomes `CaptivateContent.quests.concat(CuesContent.quests, DayMissions.quests)`. Each entry is a normal
quest object plus `when:"day"`, `tier`, `ctx`, and `xp = LiveEngine.TIER_XP[tier]` (8/15/25/40 — the same
ladder Night pays, so a tier-2 rep is worth the same at 2pm as at 2am). `type:"do"`, `minLevel:1`,
`source:"Day"`.

Copy rules baked in: card `desc` ≤ 20 words (the file is lint-exempt by location; the cap is
self-imposed so the focus card never bloats), fuller `how` steps live in the existing how-to modal,
compliments target **choices, never bodies**, and exit cues are respected — `day-clean-exit` makes that
its own rep so leaving well reads as a win, not a failure.

### Tier 0 — rescues (8 XP, never rolled; served only by `🛟 Smaller`)

| id | ctx | skill | card copy | opener / how-hint |
|---|---|---|---|---|
| `day-r-eyes` | any | `cues-warmth-body` | Make eye contact with one person, smile, look away. That's the whole rep. | no words needed — the smile is the rep |
| `day-r-thanks` | any | `cues-vocal` | Thank one worker with your eyes up and a full sentence. | "Thanks — I appreciate you." |
| `day-r-front` | any | `cues-warmth-body` | Point your feet and shoulders at the next person who talks to you. | fronting: toes, torso, top |
| `day-r-hey` | street | `cues-warmth-body` | Say hey to the next person who passes close. One word counts. | "Hey." — that's it |

### Tier 1 — people already next to you (15 XP)

| id | ctx | skill | card copy | opener / how-hint |
|---|---|---|---|---|
| `day-queue-wait` | queue | `cap-spark` | Say one line about the wait to whoever is behind you. | "Is this line always like this, or did we pick the worst time?" |
| `day-cafe-pick` | cafe | `cap-spark` | Ask the barista what they'd actually order here — then order it. | "What do you drink when nobody's watching?" |
| `day-store-rec` | store | `cap-intrigue` | Ask another shopper — not staff — which one they'd pick. | "You look like you've done this before — which of these is good?" |
| `day-gym-sets` | gym | `cap-spark` | Ask whoever's near your machine how many sets they have left. | "How many you got left? No rush." |
| `day-choice-compliment` | any | `cap-highlight` | Compliment something someone chose — bag, sneakers, order. Never their body. | "That jacket's great — where'd you find it?" |
| `day-worker-specific` | any | `cap-highlight` | Give one worker a specific thank-you that names what they actually did. | "You cleared that line without breaking a sweat. Genuinely impressive." |
| `day-transit-line` | transit | `cap-spark` | Say one situational line to whoever is waiting for the same ride. | "Any idea if this one's late, or are we both guessing?" |
| `day-listen-sounds` | any | `cues-vocal` | Use three listening sounds in one daytime conversation. Watch them keep going. | mmm · uh-huh · go on · tell me more |
| `day-eyebrow-three` | street | `cues-warmth-body` | Eyebrow flash and a hey for three people you pass today. | brow up, quick, then the word |
| `day-clean-exit` | any | `cap-engage` | Read one exit cue and close warmly first. Leaving well is the rep. | "I'll let you get back to it — good talking to you." |

### Tier 2 — start it yourself (25 XP)

| id | ctx | skill | card copy | opener / how-hint |
|---|---|---|---|---|
| `day-sparker` | any | `cap-spark` | Ask one stranger the highlight of their day instead of how they are. | "Best thing that's happened to you today — go." |
| `day-thread-two` | any | `cap-intrigue` | Find two things in common inside one daytime conversation. | hunt three lanes: people, context, interests |
| `day-get-name` | any | `cap-connect` | Get one stranger's name and use it out loud before you leave. | "I'm Preston, by the way — what's your name?" |
| `day-rec-riff` | store/cafe | `cap-intrigue` | Ask for a recommendation, then stay and riff on the answer. | follow their answer, don't fire a second question |
| `day-hobby-open` | park | `cap-spark` | Open on what someone is doing — dog, camera, book, board. | "Okay, I have to ask — what breed is that?" |
| `day-common-room` | campus | `cap-control` | Sit near people in a common area and open with a context line. | "Is this table taken? … What are you working on?" |
| `day-mirror-words` | any | `cues-verbal` | Reuse three of their exact words back to them in one conversation. | match their nouns — truck vs rig, client vs customer |

### Tier 3 — bigger daylight swings (40 XP)

| id | ctx | skill | card copy | opener / how-hint |
|---|---|---|---|---|
| `day-three-min` | any | `cap-connect` | Start a conversation with a stranger and keep it alive three minutes. | trade a story back instead of another question |
| `day-gym-workin` | gym | `cap-capture` | Ask to work in, or ask someone to watch one set of form. | "Mind if I work in? Two sets and I'm out of your way." |
| `day-intro-two` | campus | `cap-highlight` | Introduce two daytime people to each other with one highlight each. | "You two should meet — she just moved here, he knows every coffee spot." |
| `day-pair-open` | any | `cap-capture` | Open a pair or small group instead of one person alone. | aim the first line at the group, not one face |
| `day-tie-offer` | any | `cap-engage` | Close a daytime conversation by offering something real — then deliver it. | "Can I help you with anything? I know a spot for that." |

Coverage: queue, cafe, gym, store, street, transit, campus/common room, park, any. Every mission is
doable inside a normal errand; none requires a venue, alcohol, or an evening.

---

## 4. Notifications

### 4.1 Default: nothing new

No new scheduled notification ships on by default. The existing 10:00 quest nudge (`QUEST_IDS 100–106`)
already covers the day board, and its copy is now safe **by construction**: the daily slate can never
contain a `when:"night"` quest, so a day nudge can never tease a club mission. All-carrot, no new nags.

### 4.2 Opt-in: the burst

`▶ Burst` on the focus card starts a 30-minute burst (interval remembered in
`settings.day = { burstMins: 30, lastBurstDay, bursts }`). While a burst is live — and only then — the
cadence pings schedule in a new range:

```
500–511  day-burst cadence   (mirrors NIGHT_IDS 300–311, same builder shape)
```

Added to `native.js`: `const DAY_IDS = [500, 511];`, `ourId()` gains the range, and `dayNotifs()` joins
the `list` in `doReschedule()`. Body copy, one line, carrot: `"☀️ Next one's ready — small, then back to
your day."` Ending the burst (or the 30 minutes elapsing) cancels them via the existing
reschedule-from-state path. There is no "you didn't do it" ping, no evening day-mode ping, no
notification when no burst is running.

### 4.3 The time rule for notification copy

Hard rule for every future notification: **any body that names or implies a specific quest must check
`q.when` against the window at fire time.** Night-tagged content may only appear in bodies scheduled
inside 17:00–04:00. The 20:30 streak nudge stays generic (it never names a quest) and is unchanged.

---

## 5. Home card + navigation

Tab bar stays at 6 (`data-pane` values unchanged, so every e2e selector survives). The `⚔️ Quests` tab
label becomes **Today**; the icon stays.

Home's Night card becomes **one Live card that adapts by window** — this is how the new surface is paid
for inside the 110-word Home budget (`adhd-ux-review.md` §4, Home currently 109):

| Window / state | Label | Text | Button | → |
|---|---|---|---|---|
| shift active | `🌙 Shift in progress` | `You're on the clock — jump back in.` | `Back to my shift` | `night` |
| night hour | `🌙 Night Mode` | `Three missions, picked for you, on a timer.` | `Start a shift` | `NightMode.startShift()` |
| otherwise | `☀️ Day Mode` | `Three missions, waiting for the right moment.` | `Today's missions` | `quests` |

Word budget: the night variants are the existing strings (unchanged); the day variant is 2 + 7 + 2 = 11
words against the night variant's 2 + 7 + 3 = 12. **Net −1 word. Home lands at 108/110.** No new Home
card is added, and the quest-shortcut card (`home.js:117-126`) is *removed* — its job (open the board)
is now the Live card's job during the day, which buys back another 20 words of headroom for the
conditional "one rep away" card that currently pushes Home to ~127.

Day Mode is reachable in one tap from Home and one tap from the tab bar. Night Mode keeps its existing
one-tap Home entry.

---

## 6. Streak / XP / story integration

Zero new plumbing — this is the payoff of making day missions *quests*:

- **Reps/streak:** `Quests.completeQuest()` already calls `Store.logRep()`. A day mission is a real-world
  rep exactly like a night action.
- **XP:** `q.xp` = `LiveEngine.TIER_XP[tier]` (8/15/25/40), identical to Night's ladder. Skill XP routes
  through `q.skill` into `Store.state.skillXp`, which drives the mastery pips and Home's "one rep away".
- **Story / Neons:** `storymode.js:140 questCountFor()` counts `questLog` entries by `q.skill`, and
  `stageOf()` reads `skillXp` — so day missions evolve Neons through the existing path with **no new
  listener**. Every mission's `skill` is drawn from the existing 22 skill ids on purpose.
- **Combos:** the board has no combo (there is no session to chain). The burst does: `LiveEngine.comboBonus`
  applies to missions completed while a burst is live, capped at +25 like Night.
- **Badges** — 4 additions to `QuestData.badges`:
  `day-first` ☀️ *Daylight* — first day mission ·
  `day-ten` 🌞 *Broad Daylight* — 10 day missions ·
  `day-three-min` ⏱️ *Three Minutes* — complete `day-three-min` ·
  `round-clock` 🌗 *Round the Clock* — a day mission and a night action on the same day.
  All are carrots for things already tracked; none is losable.

---

## 7. Tests (`tests/e2e.mjs`)

Night steps 4a–4i **must stay green untouched** — that is the acceptance gate on the `LiveEngine`
refactor. New steps, numbered after the existing 13:

- **14a — slate composition + determinism.** After boot: `dailyQuests.ids.length === 3`; ids 0–1 resolve
  to quests with `when === "day"` and a `tier` (1 then 2/3, ascending); id 2 has no `tier` and
  `when !== "night"`. Reload → identical ids and `done`.
- **14b — no night content in a day roll.** `page.clock.install({ time: <today 13:00> })` on a fresh
  context, then boot: assert **zero** rendered quest in `#pane-quests` has `when === "night"`, the
  Tonight lane is absent, and Home's Live card reads `☀️ Day Mode` and routes to `quests`.
- **14c — night window shows the night lane.** Same fixture at 23:00: Tonight lane present, Live card
  reads `🌙 Night Mode`. **And `dailyQuests.ids` is byte-identical to the 13:00 run for the same date** —
  determinism holds across the window, because the window does not touch the roll.
- **14d — boundary preserves completion.** At 13:00 complete slot A → `done.length === 1`. Advance the
  clock to 23:00, reload: still complete, `questLog` entry intact, `dailyQuests.ids` unchanged, streak
  unchanged, no re-roll.
- **14e — day board budgets.** `#pane-quests` with disclosures collapsed: **≤ 12 tappables**, **≤ 180
  words**, **≤ 1500px**; the focus card itself **≤ 5 tappables** (`✔ Did it`, `⇄ Swap`, `🛟 Smaller`,
  `▶ Burst`, `How`) and **≤ 30 words** excluding mission text and openers.
- **14f — Swap replaces in place.** Click `⇄ Swap`: no modal opens, `dailyQuests.ids[i]` changed to a
  different `when:"day"` mission of the same tier, `done` untouched, and the replaced id is *not* in
  `questLog`.
- **14g — 🛟 Smaller.** Serves a `tier === 0` mission, consumes the focus slot (mirroring Night), pays
  8 XP, logs a rep; assert no tier-0 mission is ever present in a freshly rolled slate.
- **14h — burst notifications.** Expose `Native.notifPlan()` (debug export, no scheduling) returning the
  composed list. With no burst: zero ids in 500–511. Start a burst: ids in 500–511 only, all in the
  future, and `ourId(500) === true`. End the burst: back to zero. Also spy on
  `Native.rescheduleNotifications` at burst start/end (the 4f2 pattern).
- **14i — content lint: untagged night content.** Scan `js/data/*.js` quest objects; any whose
  `name|desc|tip|how` matches `/\b(club|nightclub|bar|venue|nightlife|bottle service|DJ|coat check)\b/i`
  must carry an explicit `when`. Guards the mandate against future untagged content.
- **13 (existing) still passes** with `daymode.js` / `live-engine.js` in the scan — all mission copy
  lives in `js/data/`, which is already lint-exempt.

---

## 8. Implementation checklist (ordered, file-by-file)

1. `js/data/day-missions-data.js` — **new.** `const DayMissions = { quests: [ … 26 … ] }` per §3. Card
   `desc` ≤ 20 words; add 3 `how` steps (≤ 20 words each) and 1–3 `examples` per mission from the
   opener column. Add `<script src="js/data/day-missions-data.js">` to `index.html` **before**
   `quests-data.js`.
2. `js/data/quests-data.js` — merge `DayMissions.quests` into the `quests` getter; add the 4 badges (§6).
3. `js/live-engine.js` — **new.** Port `TIER_XP`, `pickSet`, `swapPick`, `comboBonus`, `fmtClock`
   verbatim from `nightmode.js` (§1). Load it before `nightmode.js` in `index.html`.
4. `js/nightmode.js` — re-point `buildSetlist()` and `swap()` at `LiveEngine`; delete the duplicated
   `TIER_XP` and `fmt`. **Nothing else changes.** Run `npm test` — steps 4a–4i must be green before
   proceeding. If any night step goes red, revert this step and stop (2-strike escalation).
5. `js/state.js` — add `Store.isNightHour()`, `Store.nightKey()`, and
   `settings.day = { burstMins: 30, lastBurstDay: null, bursts: 0 }` to `defaults()` + the nested
   settings merge in `load()` (same treatment as `settings.night`).
6. Tag the existing pool — add `when: "night"` to `cap-q-boss-room` only (§2.4). Leave everything else
   untagged; `when` defaults to `"anytime"` at read time.
7. `js/quests.js` — (a) `ensureDaily()` gains the §2.2 composition rule (same seed string); (b) new
   `focusCard(q)` renderer with `✔ Did it` / `⇄ Swap` / `🛟 Smaller` / `▶ Burst` / `How`; (c) the other
   two slate items render as one-line rows; (d) the Tonight lane, gated on
   `Store.isNightHour() || NightMode.active` and seeded on `nightKey()`; (e) side quests + custom author
   move into one collapsed `More quests` disclosure.
8. `js/daymode.js` — **new, small.** Owns only what the board can't: `swap()` (writes
   `dailyQuests.ids[i]` via `LiveEngine.swapPick`), `rescue()` (tier-0 substitution), and the burst
   (`start/stop`, countdown strip, `LiveEngine.comboBonus`). Everything completion-related delegates to
   `Quests.completeQuest()`. Load after `quests.js`.
9. `js/native.js` — `DAY_IDS = [500, 511]`, extend `ourId()`, add `dayNotifs()` (burst-only, §4.2), join
   it in `doReschedule()`, export `notifPlan()` for step 14h.
10. `js/home.js` — Live card per §5; delete the quest-shortcut card.
11. `index.html` — tab label `Quests` → `Today` (leave `data-pane="quests"`).
12. `css/style.css` — `.focus-card` reusing `.night-prompt` shape; `.slate-row`; `.burst-strip`. No new
    tokens, no blur on repeating rows (Liquid Glass §5.3), keep border shorthands (§5.5).
13. `tests/e2e.mjs` — steps 14a–14i (§7).
14. `sw.js` — bump `CACHE_VERSION`; `npm run build`; `npm run sync` before any iOS check.
15. `docs/adhd-ux-review.md` — append a short "Day Mode as built" note with measured density; update
    `docs/PLAN.md` §3 to list the third content file.

---

## 9. Acceptance criteria

- From Home during day hours, **1 tap** reaches the day board with the first mission already expanded;
  **0 modals**.
- `dailyQuests.ids.length === 3`; **0** of them have `when === "night"`, at any hour, on any seed.
- Slate is **identical across a reload and across a window change** on the same calendar day; a mission
  completed at 13:00 is still complete at 23:00.
- Quest/Today pane, collapsed: **≤ 12 tappables**, **≤ 180 words**, **≤ 1500px** (from 21 / 252 / 1848).
- Focus card: **≤ 5 tappables**, **≤ 30 words** excluding mission text and openers.
- Home: **≤ 110 words** (target 108), **exactly one** card carrying the Live CTA, **6** tabs.
- Every mission `desc` **≤ 20 words**; every UI string in `js/*.js` **≤ 20 words** (step 13 unchanged).
- Day mission pool: **26** missions — tier 0 ×4, tier 1 ×10, tier 2 ×7, tier 3 ×5; every one carries
  `when`, `tier`, `ctx`, `skill`, `xp` from the shared ladder.
- Notifications: **0** new ids scheduled by default; ids **500–511** only while a burst is live.
- `tests/e2e.mjs` steps **1–13 all green, unchanged**, plus 14a–14i.

---

## 10. Out of scope / do not do

- **No new tab and no new pane.** Six tabs is the cap; Day Mode is the Quest Board.
- **No mode-config rewrite of `nightmode.js`.** Only `buildSetlist()`/`swap()` may change there.
- **No streak pressure, no loss framing, no guilt copy, no "you missed" states.** Passing and skipping
  stay free. No day-mode notification exists outside an explicitly started burst.
- **No location services, no geofencing, no context detection.** `ctx` is a label on the mission, read
  by a human, not a sensor. No permissions are added.
- **No number-getting, no rating people, no scripted persistence past a no.** Missions respect exit
  cues; compliments target choices, never bodies. Nothing in the pool is lifted from PUA material.
- **No re-rolling the slate mid-day**, no "refresh my quests" button, no per-window separate slates.
- **Not now:** streaks per context, a day-mode map, photo logging, weekly day-mode recap, Apple Watch
  surfacing, and any auto-detection of "he's out of the house".

---

## 11. As built (2026-07-27)

Shipped on `sw.js` `captivate-v9`. `tests/e2e.mjs` went **30 → 40 steps, all green**, with the
existing 30 unchanged in substance (two mechanical edits, noted below).

### Measured against §9

| Acceptance criterion | Target | Measured |
|---|---|---|
| Home → day board, first mission expanded | 1 tap, 0 modals | **1 tap, 0 modals** (16b) |
| `dailyQuests.ids.length` | 3 | **3** (16a) |
| night-tagged quests in the slate | 0 at any hour, any seed | **0** — impossible by construction (16a/16b) |
| slate stable across reload + window change | identical | **identical**; 13:00 roll === 23:00 roll (16a/16c) |
| 13:00 completion still complete at 23:00 | yes | **yes**, `questLog` + streak intact, no re-roll (16d) |
| Today pane, collapsed | ≤12 taps / ≤180 w / ≤1500px | **8 / 67 / 757px** (from 21 / 325 / 2204) |
| Focus card | ≤5 taps / ≤30 words | **5 / 13** (excl. mission + openers) |
| Home | ≤110 words, 1 Live CTA, 6 tabs | **96** fresh · **108** with the pip card · 1 · 6 |
| Every mission `desc` | ≤20 words | **≤20**, enforced by 16i |
| Day pool | 26 = 4/10/7/5, all tagged | **26 = 4/10/7/5**, `when`/`tier`/`ctx`/`skill`/ladder XP all present (16i) |
| Notifications | 0 new by default; 500–511 only in a burst | **0 / 500–511 only**, cancelled on end (16h) |
| Night steps 4a–4i | green, untouched | **green, untouched** |

### Night-regression proof

`js/nightmode.js` changed in exactly the four places §8.4 allows: `buildSetlist()`, `swap()`,
the `TIER_XP` literal, and `fmt()`. A 2190-case fixture (40 days × 3 levels × 3 shifts × 6 refills,
plus 30 swap draws) replayed through the pre-extraction code and through `LiveEngine` hashes to
the **same sha256 `eb62422f…`** — seeding is bit-identical, not merely stable.

### Deviations from §1–§8

1. **New steps are numbered 16a–16j, not 14a–14i.** Commit `b9cc8bd` had already taken 14a–15b
   for the grid/reference work. Content is per §7, plus a new **16j** that unit-tests `LiveEngine`
   itself (determinism, easiest-first sort, no tier-0, no mutation of the caller's `exclude`,
   ladder, `comboBonus`, `fmtClock`).
2. **The suite now pins a fake clock.** §5 makes Home's card time-dependent, so step 4b's
   `hasText: "Night Mode"` would have depended on what time of day the suite ran. Steps 1–15 now
   run against a clock pinned to 21:00 — the window they were all written in — and the Day Mode
   steps open their own contexts at 13:00 / 23:00. Not one line inside 4a–4i changed; the suite
   simply stopped being wall-clock dependent.
3. **Step 3 targets `.focus-card`** instead of the old `Today's Quests` → `.quest-card` walk.
   Same assertions (XP toast, HUD XP, streak); the board it walks no longer exists.
4. **`LiveEngine.pickSet` returns `{ picks, reset }`** rather than clearing the caller's
   `exclude` array inline (which is what `n.usedIds = []` did). Keeps the engine free of argument
   mutation; the night wrapper does the clear. rand() call order is unaffected.
5. **`Store.state.dayBurst` is a new top-level key**, not `settings.day`. `settings.day` holds the
   config §4.2 specifies (`burstMins`, `lastBurstDay`, `bursts`); live burst state needs to be
   wiped independently, exactly like `state.night` vs `settings.night`.
6. **Burst cadence = `burstMins / 3`** (10 min inside a 30-min burst), capped by the 12 slots.
   §4.2 calls 30 both "the burst" and "the interval"; twelve pings in half an hour would be a nag,
   which §5 of the ADHD review forbids. No extra settings key was added.
7. **`round-clock` is derived, not newly tracked.** §10 forbids touching `nightmode.js` beyond
   `buildSetlist`/`swap`, so the badge reads state that already persists: a day mission logged
   today **and** (a live shift with ≥1 action, or `settings.night.shifts > 0` for today). Slightly
   looser than "a night action"; still a pure carrot, still unlosable.
8. **The Tonight lane excludes the weekly boss.** §2.4 renders a night boss in its own section
   with a `🌙 Tonight` chip; listing it in the lane as well put the same quest on the board twice.
   With `cap-q-boss-room` as the only night-tagged quest in the pool today, the lane is therefore
   usually empty and correctly does not render — 16b/16c exercise it with an injected fixture,
   which is also the real regression guard for the night content §2.4 anticipates.
9. **`cues-q-chameleon` gained `when: "anytime"`.** §2.4 calls it a false hit, but the §7 lint
   demands an *explicit* tag on anything matching the night vocabulary. Tagging it is the lint
   working as designed. `cap-q-boss-room` is the only `when: "night"` quest.
10. **The how-to modal now renders `q.tip` beneath `q.how`** when a quest has both. Day missions
    carry their opener-hint in `tip`; it would otherwise never be shown.
11. **Day missions render their full `desc` on the focus card** (`.fc-text`), not the clamped
    first sentence. They are written to ≤20 words for exactly this reason. Book quests in the
    browse layer keep `.quest-desc` and its 2-line clamp, so step 13b is unaffected.
12. **The `More quests` disclosure is built eagerly and hidden**, so `display:none` costs no
    height and no tappables while the browse layer stays measurable.
13. **Not done:** nothing in §8's checklist was skipped.
