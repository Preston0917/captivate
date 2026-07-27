# Captivate — ADHD / decision-fatigue UX review

Audit date: 2026-07-27. Measured on headless Chromium, 390×844, fresh save (Level 1).
Screenshots + raw text dumps: `/private/tmp/claude-501/-Users-preston-Documents/66f3fa80-cb45-4139-abe8-531dd2338836/scratchpad/adhd-audit/` (`01-home.png` … `13-quest-howto-modal.png`, `metrics.json`).

Owner feedback driving this: *"I feel like i shouldnt be choosing the missions when im in night shift mode, too many options, want it to choose several quests/tasks for me instead. also we can make the UI more minimalistic, too wordy and too much going on."*

Scope: density and decision load only. The dark-neon Liquid Glass look stays. No streaks-as-pressure, no new notifications, no loss framing — all-carrot and real-world-reps stay intact.

---

## 1. Principles (the ones that actually apply here)

1. **Starting must cost zero decisions.** Task initiation is where ADHD fails, not task completion. Every choice placed *before* the first rep is a place to bail. Defaults beat menus; a pre-chosen concrete first action beats a well-organised list of options.
2. **Choice is a feature at rest, a tax under load.** Night Mode runs while Preston is on the floor, socially loaded, mid-shift. Configuration belongs before/after the shift or nowhere — never on the path into it.
3. **One primary action per screen.** Everything else demotes to secondary weight or hides behind disclosure. If two things are gold, neither is.
4. **Progressive disclosure over completeness.** Lead with the single line that tells you what to do; "how" is a tap away, not on the card.
5. **Text density is cognitive load.** Instruction copy over ~15 words gets skimmed, not read. Explanatory paragraphs ("How it works") are read once and then act as permanent visual noise.
6. **Swap, don't browse.** When the auto-choice is wrong, the escape hatch should be one button that replaces the item — not a list to shop through. Preserves agency at 1/10th the cognitive cost.
7. **Forgiving, low-stakes exits.** Pass/skip must stay cheap and unpunished (already true — keep it).
8. **Predictable, not surprising.** Auto-chosen sets should be seeded/stable within a night so the app doesn't feel like it's reshuffling under him.

---

## 2. Measured findings

| Screen | Screenshot | Tappables | Words | Cards | Section labels | Page height |
|---|---|---:|---:|---:|---:|---:|
| Home | `01-home.png` | 4 (+6 tabs) | 143 | 6 | 0 | 1242px |
| Quest Board | `02-quests.png` | 21 (+6) | 325 | 9 | 3 | 2204px |
| **Night setup** | `03-night-setup.png` | **7** (+6) | **137** | 2 | 0 | 844px |
| **Night goal modal (forced at start)** | `04-night-goalmodal.png` | **16** | 95 | — | — | — |
| Night countdown | `05-night-countdown.png` | 3 (+6) | 65 | 2 | 0 | 844px |
| Night mission | `06-night-prompt.png` | 5 (+6) | 84 | 2 | 1 | 966px |
| **Trainer** | `08-trainer.png` | 16 (+6) | 365 | **24** | 2 | **3734px** |
| Story hub | `09-story-hub.png` | 3 (+6) | 182 | 5 | 2 | 1172px |
| Skill Tree | `10-skilltree.png` | 0 (+6) | **472** | 0 | 7 | 2708px |
| Analyzer | `11-analyzer.png` | 4 (+6) | 50 | 2 | 0 | 844px |
| Settings | `12-settings.png` | 5 (+6) | 124 | 2 | 2 | 1225px |
| Quest how-to modal | `13-quest-howto-modal.png` | 1 | 146 | — | 2 | — |

Content-pool measurements:
- 60 quests. Mean card description **18.6 words**, max **34**. Mean how-to payload (desc+steps+examples) **147 words**, max **216** (`BOSS: Work the Room`).
- 26 night prompts. Mean text **17.3 words**, max **28** (`n-lean-front`).
- 36 UI strings in `js/*.js` are ≥14 words. Worst: `nightmode.js:456` (64w), `nightmode.js:428` (34w), `app.js:57` (29w).
- Trainer lists 1 glossary + 16 quiz decks + 7 flashcard sets = **24 cards, 4.4 screens of scroll, all optional, all equally weighted**.

### 2.1 Night Mode — the primary offense
Path to an active mission today: Home → `Start a shift` (1) → **setup pane with 2 config decisions (3 intervals × 3 intensities = 9 combos)** → `Start my shift` (2) → **forced 16-tappable goal modal** → `Skip — just the timer tonight` (3) → **20-second dead wait** → first mission.

That is 3 taps, 2 optional-but-presented config choices, 1 unrequested modal, 232 words read, and a wait — before a single real-world rep. It is the highest-friction entry in the app and it sits at the exact moment (arriving at the venue, socially loaded) when Preston has the least spare executive function.

Secondary problems on the same surface:
- **No set, no horizon.** Missions arrive one at a time with zero visibility of what tonight is. Preston asked for "several quests/tasks" chosen for him — the model doesn't exist yet.
- **In-shift screens carry 4 competing blocks** (mission card, goals card, 4-tile stat grid, End shift) plus a tab bar. On the mission screen the actual mission competes with a stat grid showing four zeroes.
- The 4-tile stat grid (`statsCard`) shows `done / combo / night XP / passes` — 4 numbers, 3 of which are derivable and none of which drive an action.

### 2.2 Home — six cards, four CTAs, no single next step
Six cards stack with near-identical visual weight: daily spark (technique reminder), Night Mode, Story Mode, trophy strip, 4-tile stat grid, quest shortcut, analyzer shortcut. Three carry gold primary buttons (`Start a shift`, `Continue the journey`, `Open quest board`) — three golds means no primary. 143 words before the fold is fine; the competition is structural, not verbal.

### 2.3 Quest Board — the 3 dailies are right, everything under them isn't
Daily 3 is exactly the correct pattern (seeded, auto-chosen, no browsing). But the pane then adds **5 side-quest cards** (`quests.js:244-256`) and a **custom-quest author** (`:259-266`) — 6 extra optional decisions, 1360px of extra scroll, directly under the thing that was already decided for him. Quest descriptions on the card average 18.6 words where ~8 would do; the how-to (147w average) is correctly behind a modal already.

### 2.4 Trainer, Story, Skill Tree, Settings
- **Trainer** (`trainer.js:45-86`): 24 undifferentiated cards, 3734px. No "start here", no resume, no recency. Pure browse.
- **Story hub** (`storymode.js:794+`): actually good — one gold CTA (`Open the field guide`). But locked floors are rendered **twice** (region strip at top + "Still ahead" list), and 182 words of prose sit above the fold.
- **Skill Tree**: 0 tappables, 472 words, 7 sections — a read-only wall. Not a decision problem; a density problem.
- **Settings**: fine. 124 words, but the API-key hint (29w) and reminders hint (26w) are the wordiest non-Night strings in the app.

---

## 3. Implementation plan

### P1 — Night Mode auto-pilot (owner mandate)

**Target:** from Home, **one tap** produces an active shift with **3 auto-chosen missions**, the first one already on screen, and one default goal pre-filled. Zero modals. Zero config on the path.

All changes in `js/nightmode.js` unless noted.

**P1.1 — Add a seeded nightly setlist.**
New function `buildSetlist(level, seed)`:
- Seed = `Store.seededRandom(Store.todayKey() + "|night" + shiftIndex)` where `shiftIndex` is the count of shifts started today (so a second shift the same night gets a different set, but reopening the app never reshuffles).
- Pick **3** prompt ids using the existing `LEVELS[level].tiers` distribution, no repeats, tier-ascending order (easiest first — lowest activation energy leads).
- Store as `n.setlist = [id, id, id]`, `n.setIdx = 0`.
- `drawPrompt()` changes from random-draw to: `n.current = n.setlist[n.setIdx]` — falling back to the existing random draw only if the setlist is exhausted.
- When `setIdx` reaches 3: auto-generate the next 3 with a toast (`"3 more queued"`). Never ask.

**P1.2 — Collapse the start flow.**
- `renderSetup(pane)` becomes a **single-card, single-button screen**: title, one line of sub, one gold `Start my shift` button. Interval and intensity segmented rows move out of the start path.
- Persist last-used config in `Store.state.settings.night = { interval: 12, level: 2 }` (add to `state.js` defaults). `start()` reads it; there is nothing to choose.
- Adjusting cadence/intensity moves to a **small ghost `⚙ Cadence` link under the start button** that toggles the two seg-rows inline (progressive disclosure). Collapsed by default, remembered per-session, never blocking.
- Home's `Start a shift` button (`home.js:70`) changes from `App.show("night")` to **starting the shift directly** and then showing the pane — making it genuinely one tap. Guard: if `NightMode.active`, keep current "Back to my shift" behaviour.

**P1.3 — Kill the forced goal modal; pre-fill one default goal.**
- Delete `goalModal(true)` from `start()` (`nightmode.js:113`).
- In `start()`, auto-add **exactly one** goal, seeded from `GOAL_PRESETS` by `Store.seededRandom(todayKey + "|goal")`, using its own `count`/deadline. It appears already on the card as a row with a `+1` button.
- `goalsCard` keeps `＋ Add` (ghost, small) as the opt-in for more, and gains a `Change` ghost link on the default row that opens the existing `goalModal(false)` — unchanged code, now opt-in only.
- Empty-state string at `:286` becomes dead code; remove.

**P1.4 — First mission arrives immediately, and the set is visible.**
- `start()` sets `nextAt = Date.now()` and calls `drawPrompt()` synchronously. Delete the 20-second settle-in (`:103`).
- `renderPrompt` gains a **3-dot setlist strip** under the pane-sub: `● ● ○` style, showing position in tonight's set (reuse `.quiz-dot` / `.gdot` styling). This is the "several quests chosen for me" made visible, in 3 glyphs and 0 words.

**P1.5 — Swap, not browse.**
- On the mission card, replace nothing; **add one ghost button `⇄ Swap`** next to `🛟 I'm frozen`. It swaps `n.current` for the next unused prompt of the same tier and rewrites `setlist[setIdx]`. Single tap, no list, no modal.
- `🛟 I'm frozen — make it smaller` stays (it is the correct escape hatch and already one tap).

**P1.6 — Strip in-shift competition.**
- Delete `statsCard()` from `renderPrompt` and `renderCountdown`. Fold the only live-relevant number into the pane-sub: `"2 done · ×2"`. Full numbers already appear in the end-of-shift summary, which is where they belong.
- On the **mission** screen, move `goalsCard` and `End shift` below the fold (they already are) and drop `goalsCard` from `renderPrompt` entirely — the goal is visible on the countdown screen; the mission screen should show the mission.
- Result: mission screen = mission card + Did it/Pass + 2 ghost buttons. One thing.

**Acceptance criteria (P1)**
- From Home, tapping `Start a shift` yields an **active session with a mission on screen in exactly 1 tap**, with **0 modals** shown.
- `Store.state.night.setlist.length === 3` immediately after `start()`; identical across a page reload on the same night.
- Night setup screen: **≤2 tappables** visible by default (`Start my shift`, `⚙ Cadence`), **≤25 words** of body text.
- Night mission screen: **≤4 tappables**, **≤45 words** excluding the mission text and opener lines.
- Night countdown screen: **≤4 tappables**, **≤35 words**.
- Exactly **one** goal exists after `start()` without any user input; `+1` on it still awards `GOAL_TICK_XP`.
- Completing the 3rd mission auto-queues 3 more with no prompt or modal.
- `tests/e2e.mjs` night-mode step updated: assert 1-tap start, assert no `#modal-layer` visible during start.

---

### P2 — Wordiness cuts

**P2.1 — Delete outright.**
| File:line | Current | Action |
|---|---|---|
| `nightmode.js:454-458` | "How it works" card, **64 words** | **Delete the card.** The mission screen teaches itself. |
| `nightmode.js:462-464` | "Session state survives closing the app…" (11w) | Delete. |
| `nightmode.js:286` | Goals empty state (18w) | Delete (P1.3 makes it unreachable). |
| `nightmode.js:449` | Intensity hint (22w) | Delete; encode in the labels (P2.2 #4). |
| `storymode.js` region strip **or** "Still ahead" list | Locked floors rendered twice | Delete the top strip; keep the list. |

**P2.2 — Rewrite, worst 10 (before → after).**

1. `nightmode.js:428` (pane-sub, 34w)
   → *"For when you're working. A timer feeds you one small social action at a time — with the exact line to open with — so you're never stuck waiting for someone to talk first."*
   → **"Three missions, one at a time, with the line to open with."** (11w)

2. `nightmode.js:478` (countdown hint, 13w)
   → *"Live your night — this will buzz when it's time. Or jump the gun:"*
   → **"It'll buzz."** (2w) — and rename the button `⚡ Give me one now` → **`⚡ Now`**.

3. `nightmode.js:251` (goal modal blurb, 26w)
   → *"A target with a deadline — every +1 pays 10 XP instantly, hit the number before the clock for +50. Add as many as you want."*
   → **"+10 each. +50 if you hit the number in time."** (10w)

4. `nightmode.js:439` intensity labels
   → `Warm-up / Steady / Bold` + 22w hint
   → **`Nearby / Mixed / Big swings`**, no hint (0w).

5. `nightmode.js:30` (`n-lean-front`, 28w — longest prompt)
   → *"For the next 5 minutes: front the person talking to you — toes, torso, face — and hold 60% eye contact. Say nothing extra; just be fully aimed."*
   → **"Next 5 minutes: point toes, torso and face at whoever's talking. Nothing else."** (13w)

6. `nightmode.js:44` (`n-quiet-one`, 24w)
   → *"Find the quietest girl at your table and make her the star for 2 minutes — one question, then follow-ups only about her answers."*
   → **"Make the quietest girl at your table the star for 2 minutes."** (12w)

7. `nightmode.js:32` (`n-name-use`, 21w)
   → *"Use someone's name in a sentence within the next 2 minutes. If you don't know it yet, that IS the mission."*
   → **"Say someone's name out loud in the next 2 minutes. Don't know it? Go get it."** (15w)

8. `quests.js:225` (pane-sub, 20w)
   → *"Real-world practice missions from Captivate & Cues. Complete them out in the wild, then log them here."*
   → **"Do them out there. Log them here."** (7w)

9. `app.js:57` (API hint, 29w)
   → *"Used for the transcript analyzer. The key never leaves your device except to call api.anthropic.com directly. Personal use only — don't host this page publicly with a key saved."*
   → **"Stays on this device. Used only by the analyzer."** (9w)

10. `trainer.js:98` (glossary sub, 21w)
   → *"The books coin a lot of phrases. Here's every one in plain English — tap a term for the full story."*
   → **"Every phrase the books coin, in plain English."** (8w)

Bonus, same treatment: `app.js:102` reminders hint (26w → **"Two nudges a day. Off any time."**, 7w); `analyzer.js:154` (23w → **"Paste a transcript. Get scored and coached."**, 7w); `trainer.js:34` glossary card desc (20w → **"Sparker, thread theory, cue cluster — decoded."**, 6w).

**P2.3 — Progressive disclosure on quest cards.**
`quests.js:101` renders `q.desc` in full (avg 18.6w, max 34w) on every card, ×8 cards = the 325-word Quest Board.
- Render **only the first sentence, clamped to 2 lines** (`-webkit-line-clamp: 2` on `.quest-desc`) on the card.
- Full `q.desc` already appears in `howToModal` (`quests.js:168`) — no content is lost.
- Rename the disclosure buttons: `How do I do this?` → **`How`**; `What am I looking for?` → **`What`**. (Both are already ghost-weight; shortening them stops them competing with `I did it ✔`.)

**Acceptance criteria (P2)**
- No string literal in `js/*.js` (excluding `js/data/`) exceeds **20 words**. Add a check to `tests/e2e.mjs` or a small lint script.
- Quest Board body text ≤ **180 words** (from 325); page height ≤ **1500px** (from 2204).
- Night setup screen ≤ **25 words** (from 137).
- Home ≤ **110 words** (from 143).

---

### P3 — Structural simplifications

**P3.1 — Home: one primary, rest secondary.** (`js/home.js`)
- Exactly **one** gold `btn primary` on the pane, chosen by context: evening hours (≥17:00) or an active shift → Night Mode; otherwise → the quest shortcut. All other card CTAs become `btn` (not `primary`).
- Merge the trophy strip (`:99-105`) and the 4-tile stat grid (`:108-113`) into **one 3-tile row**: `🔥 streak · quests today · 🏅 badges`. Drops 4 numbers and one whole card.
- Move the analyzer shortcut card (`:128-132`) off Home — it is already a tab. Saves a card and 21 words.
- Result target: **4 cards** (spark, contextual primary, secondary shortcut, stats), from 6.

**P3.2 — Quest Board: hide the browse layer.** (`js/quests.js:244-266`)
- Wrap "Side Quests (anytime)" + "Create your own" in a **single collapsed disclosure**: one ghost row reading `More quests` that expands them. Default collapsed.
- Nothing is removed — the daily 3 is what the pane is, and everything optional is one tap away.

**P3.3 — Trainer: give it a default.** (`js/trainer.js:45-86`)
- Add a single top card: **`Today's drill`** — one deck picked by `Store.seededRandom(todayKey + "|deck")` from unlocked decks, with the only gold button on the pane. Same seeded-default pattern as daily quests.
- Collapse the 16 quiz decks and 7 flashcard sets behind **two disclosure rows** (`All decks (16)`, `Flashcards (7)`), collapsed by default.
- Target: Trainer page height ≤ **1400px** (from 3734), ≤ **6 tappables** by default (from 16).

**P3.4 — Story hub: stop rendering locked floors twice.** (`js/storymode.js:650-680, 794-870`)
Keep the "Still ahead" list, delete the top locked-tile strip. Target ≤ **140 words** (from 182).

**P3.5 — Add Night Mode to the tab bar.** (`index.html:53-60`)
Night Mode has no tab and is only reachable via a Home card — a hidden mode for the mode Preston uses at work. Replace the `Analyze` tab (moved off Home in P3.1 but low frequency) with `🌙 Night`, or make the 6th tab context-swap to Night after 17:00. One less navigation decision at the moment it matters most.

**Acceptance criteria (P3)**
- Home: exactly **1** `.btn.primary` in `#pane-home`; ≤4 `.card` elements.
- Quest Board: ≤ **9 tappables** and ≤4 cards visible before expanding `More quests`.
- Trainer: ≤6 tappables, ≤1400px, exactly 1 gold button, default drill deck is stable across reloads on the same day.
- Night Mode reachable from the tab bar in 1 tap.

---

## 4. As built (P1 + P2 shipped 2026-07-27)

P1 and P2 are implemented. P3 was left alone — nothing in §3 P3 is marked low-risk/cheap.

**Measured, fresh save, headless Chromium 390×844** (counters live in `tests/e2e.mjs`; a "word" is any whitespace-run containing a letter or digit, so `·` and bare emoji don't inflate counts):

| Screen | Tappables before → after | Words before → after | Height |
|---|---|---|---|
| Night setup | 7 → **2** | 137 → **18** | 844 → 171px |
| Night goal modal at start | 16 → **gone** | 95 → **0** | — |
| Night mission | 5 → **4** | 84 → **24** (11 excl. mission + openers) | 966 → 335px |
| Night countdown | 3 → **4** | 65 → **28** | 525px |
| Home | 4 → **4** | 143 → **109** | 1015px |
| Quest Board | 21 → **21** | 325 → **252** | 2204 → 1848px |
| Story hub | 3 → 3 | 182 → **151** | 909px |
| Settings | 5 → 5 | 124 → **84** | — |

Path to a live mission: **3 taps + 1 modal + a 20s wait → 1 tap, 0 modals, 0 wait.**

**Deviations from §3, and why**

1. **`End shift` is not on the mission screen.** P1.6's prose keeps it; the P1 acceptance cap of ≤4 tappables does not fit `Did it / Pass / ⇄ Swap / 🛟 Smaller` *plus* an exit. The cap won (it matches P1.6's own "mission card + Did it/Pass + 2 ghost buttons"). Ending a shift lives on the countdown screen, which is one free `Pass` away. On a tier-0 rescue — where 🛟 is meaningless — the 4th slot becomes `End shift`.
2. **No per-row `Change` link on the auto goal** (P1.3). It would have made the countdown 5 tappables against a ≤4 cap. `＋ Add` still opens the same `goalModal()`, so the goal set is still editable mid-shift.
3. **`Pass` advances the setlist** (unspecified in §3). A passed mission is spent, not re-served — passing stays free, it just moves you down the set. Same for a 🛟 rescue: it consumes the slot it replaced.
4. **Quest Board 180-word / 1500px targets not met** (252w / 1848px, from 325w / 2204px). The remaining bulk is the 5 side-quest cards + custom-quest author, which only P3.2 removes. Same story for Home: 109 words hits the ≤110 target on a fresh save, but the conditional "one rep away" card pushes it to ~127 when it appears — P3.1 territory.
5. **The 20-word UI-string cap is scoped to UI copy.** `js/data/` (content), `js/demos.js` (demo captions) and `analyzer.js`'s `systemPrompt()` (model instructions, fenced with `lint-copy-ignore-*`) are exempt. Every other string literal in `js/*.js` is ≤20 words, enforced by e2e step 13.
6. **Extra copy trims beyond the §3 list**, all same-flavour: `n-triple-nod` (21w → 12w, it was over the cap), Home sub / Night card / quest-shortcut / analyzer-card lines, side-quest empty state, custom-quest blurb, and two Home stat labels (`day streak` → `streak`, `lifetime XP` → `XP`) to land the ≤110 Home budget.

**Mechanics**
- Seed: `Store.seededRandom(todayKey + "|night<shiftIndex>|set<setNo>")`. `shiftIndex` counts shifts started today (`settings.night.day/shifts`), `setNo` counts refills within the shift — so a reload never rerolls, a second shift the same night gets a fresh set, and each refill differs.
- Save schema (additive, safe for old saves): `settings.night = { interval, level, day, shifts }` gets the same nested-merge treatment as `settings.notifs`; `night.setlist / setIdx / setNo / shiftIndex` are backfilled in `ns()` so a mid-shift save from the old shape renders and resolves without throwing (e2e step 4i).
- Notifications unchanged in shape: session pings still schedule on `start()` (from `nextAt`, so the first push is one interval out, not instant) and cancel on `endSession()`; the auto goal is added *before* the reschedule, so its warning/deadline pair goes out with the rest.

---

## 5. Explicitly out of scope / do not do

- No streaks-as-pressure, no loss framing, no new notification types, no "you missed" copy. Passing stays free (`resolve(false)` behaviour unchanged).
- No restyle: Liquid Glass tokens, blur, neon borders, gold primary all stay. Every change above is density, defaults, or disclosure.
- Don't remove the ability to configure — demote it. Cadence, intensity, extra goals, side quests, deck browsing all survive, one tap off the main path.

---

## 6. Day Mode as built (2026-07-27)

The Quest Board became **Today** — one time-aware board (`docs/day-mode-design.md`). P3.2 landed
as a side effect: side quests + the custom-quest author now live behind one collapsed
`More quests` row, which is what paid for the focus card's height.

Measured, fresh save, headless Chromium 390×844 (counters unchanged, e2e steps 16e / 13):

| Screen | Tappables | Words | Height |
|---|---:|---:|---:|
| Quest Board → **Today** (collapsed) | 21 → 20 → **8** | 325 → 252 → **67** | 2204 → 1848 → **757px** |
| Focus card (the day mission itself) | **5** | **13** excl. mission + openers | — |
| Home, fresh save | 4 → **4** | 143 → 109 → **96** | — |
| Home, with the "one rep away" card up | **4** | ~127 → **108** | — |

Deviation 4 of §4 is closed: the Quest Board's 180-word / 1500px targets are met (67w / 757px),
and Home holds ≤110 in **both** states — the pip card lost its 6-word sub-line and 3 words of
headline, and the quest-shortcut card is gone (its job is the Live card's during the day).
