# Captivate — Apple Watch Companion Plan

Design doc. Nothing here is implemented. Written against the code as of 2026-07-26:
`js/state.js`, `js/nightmode.js`, `js/quests.js`, `js/native.js`, and the SPM-based
Capacitor 7 project at `ios/App/App.xcodeproj` (no CocoaPods, no `.xcworkspace`).

---

## 1. Why a watch app

Every mechanic in this app exists to produce a real-world rep, and pulling a phone out
mid-conversation is the single most reliable way to end one — the phone is a social exit,
which is exactly the behavior the app is trying to unlearn. The wrist is the only surface
that can take a rep log, deliver a Night Mode prompt, and tick a goal without breaking eye
contact or signalling "I'm done talking to you."

**Rejection rule for this whole doc:** if a feature adds wrist screen time without
producing or capturing a real-world rep, it does not ship. No Trainer, no Analyzer, no
Skill Tree, no badge gallery, no Dex browsing on the watch.

---

## 2. Use cases, ranked

### v1 — earns its place

1. **One-tap rep log.** The hero interaction. A single large button on the root view →
   `Store.logRep()` on the phone. Today six call sites do this (`js/quests.js:63`,
   `js/home.js:40`, `js/storymode.js:237/277/292/319`, `js/nightmode.js:189/325`); the
   watch adds a seventh that is *unattributed* by default and can optionally be aimed at
   one of today's `dailyQuests.ids` or a `type: "tally"` quest (+1 to `state.tallies[qid]`,
   completing at `q.goal`). Confirm haptic (`.success`) and nothing else — no XP animation,
   no modal, wrist down in under two seconds.
2. **Streak + freeze glance.** `streak`, `bestStreak`, `freezes`, and "rep logged today?"
   (`lastRepDay === todayKey()`). This is the whole all-carrot loop in four numbers, and
   it's the thing worth checking at 1 a.m. without unlocking a phone.
3. **Night Mode on the wrist — the killer feature.** Preston works nightlife; the phone is
   unusable while hosting. The watch is the only device that can run a shift. Needs:
   - a wrist tap when `n.nextAt` elapses, showing `PROMPTS[i].text` and the first `say[]`
     line, full-screen, readable in a dark venue at a glance;
   - **✔ Did it** / **Pass** buttons that mirror `NightMode.resolve(true|false)` semantics;
   - **🛟 I'm frozen** → `panic()`, drawing a tier-0 rescue;
   - per-goal **+1** buttons mirroring `tickGoal(g)`, with `g.done`/`g.target` and the
     `g.deadlineAt` countdown;
   - the countdown to the next prompt on the root view.
4. **Daily quest list, read-only + tappable-as-rep-target.** Three rows: `q.icon`,
   `q.name`, done state from `dailyQuests.done`. Tapping one is how you aim use case #1.
   No `q.how`, no `q.examples`, no demo art — that's phone reading.

### Later

5. **Complications** (P3): `.accessoryCircular` streak ring, `.accessoryInline`
   "🔥 12 · rep today ✓", `.accessoryCorner` gauge. Watch-face-glanceable streak is the
   single highest-value non-interactive surface.
6. **Story-mode Neon progress** (P4, optional): stage-up proximity for the Neon whose
   `n.skill` you're closest to advancing. Read-only pride surface; low priority.

### Explicitly rejected

Flashcard/Trainer drills on the wrist, the Analyzer, badge browsing, the full Dex, custom
quest authoring, and any "open the app to see your XP" nudge. All screen time, no reps.

---

## 3. Architecture

### Decision

**A native SwiftUI watchOS app target added to `ios/App/App.xcodeproj`, talking to the
phone over WatchConnectivity through a small first-party Capacitor plugin. Snapshot down
(application context), events up (queued user-info transfers). The phone's localStorage
save stays the single source of truth.**

Target: `CaptivateWatch`, bundle id `com.preston.captivate.watchkitapp`, `WKApplication =
YES`, `WKCompanionAppBundleIdentifier = com.preston.captivate`,
`WKRunsIndependentlyOfCompanionApp = NO` (this app is meaningless without the phone's
save). Deployment target watchOS 26 — that unlocks `.glassEffect()` and the Control
Widget API unconditionally, and Preston is the only user, so there is no back-compat
argument. Note: watchOS 27 was announced at WWDC26 (June 2026) and ships this fall; nothing
here depends on it.

### The hard problem

Game state lives in `localStorage` under `captivate.save.v1`, inside the WKWebView, reached
only through the `Store` IIFE in `js/state.js`. The watch cannot see it. Three options:

**(a) WatchConnectivity via a custom Capacitor plugin.** JS calls into a Swift plugin that
owns a `WCSession`; the plugin pushes a state snapshot and emits rep events back to JS as
plugin listener events. Cost: one Swift file + one JS module. This is the only option that
can move data between two physical devices at all.

**(b) App Group shared UserDefaults / file that the JS syncs through the same plugin.**
**Rejected as a phone↔watch mechanism — it does not work.** App Group containers do not
span devices; since watchOS 2 the watch app runs entirely on the watch, and a shared
`UserDefaults(suiteName:)` with the same group id silently gives you two independent
stores. App Groups remain correct *within* the watch, between the watch app and its widget
extension — which is exactly how the P3 complication gets its data, and the only place
App Groups appear in this plan.

**(c) Watch-independent mode with eventual sync.** Rejected for v1. The watch would need
its own quest pool, its own streak arithmetic, and a merge algorithm — a second
implementation of `logRep`/`tickGoal`/`resolve` in Swift that must stay in lockstep with
the JS forever. The watch does need a *local outbox* so taps survive being out of range
(that's in (a)), but it must never compute streak, XP, or level itself.

**Verdict: (a), with a durable outbox on the watch and an App Group used only on the watch
for the complication.** The watch is a remote control with a queue, not a second brain.

### The plugin

`Captivate​Watch` — Swift files added **directly to the App target** at
`ios/App/App/Watch/` (`WatchPlugin.swift`, `WatchSession.swift`), not into
`ios/App/CapApp-SPM/`, whose `Package.swift` is stamped `DO NOT MODIFY THIS FILE - managed
by Capacitor CLI commands` and is rewritten by every `cap sync`. Verify at implementation
time that an app-target-local `CAPPlugin` + `CAPBridgedPlugin` is still discovered by
`Capacitor.registerPlugin()` under Cap 7 SPM; if not, fall back to a *separate* local
Swift package under `ios/Bridge/` referenced by the App target directly (still outside
CapApp-SPM).

JS side: a new section in `js/native.js` following the existing `plugin(name)` helper
(lines 25–36), so everything is a no-op on the web exactly like `haptic()` and
`rescheduleNotifications()` already are.

```
Native.watch = {
  isPaired,                    // bool, from WCSession.isPaired && isWatchAppInstalled
  push(),                      // build snapshot, updateApplicationContext (coalesced ~300ms
                               //   like rescheduleNotifications does)
  onEvents(cb),                // plugin listener "watchEvents" → [Event]
}
```

`Native.boot()` registers the listener and calls `Native.watch.push()`; `Store.save()`
gains a debounced `Native.watch.push()` tail, which is the one intrusive edit to
`js/state.js`.

### Transport

| Direction | Mechanism | Why |
|---|---|---|
| Phone → Watch, state | `updateApplicationContext(_:)` | Latest-state-only, overwrites, delivered in the background when the watch app is not running. Exactly matches "snapshot." |
| Watch → Phone, events | `transferUserInfo(_:)` | FIFO queue, delivered even if the phone app is suspended or terminated. Nothing is lost when the phone is in a pocket all night. |
| Either, when reachable | `sendMessage(_:replyHandler:)` | Low-latency fast path only. Requires `isReachable`; always have the queued path as the real mechanism and treat this as an optimization. |

Everything except `sendMessage` is best-effort with seconds-to-minutes latency. The UI must
never block on delivery: the watch shows optimistic state immediately and reconciles when
the next snapshot lands.

### Snapshot schema (phone → watch)

Subset only. Never ship the whole save — no `analyses`, no `questLog`, no `skillXp`, no
`settings` (the Keychain API key must never cross the wire).

```jsonc
{
  "v": 1,
  "ts": 1769472000000,
  "day": "2026-07-26",              // Store.todayKey() at build time; watch compares to
                                    //   its own local day to detect a stale snapshot
  "streak": 12,
  "bestStreak": 19,
  "freezes": 2,
  "repToday": true,                 // lastRepDay === todayKey()
  "level": 7,
  "levelTitle": "Cue Detective",
  "xp": 45,
  "xpNeeded": 350,                  // Store.xpForLevel(level)
  "dailies": [                      // from dailyQuests.ids, resolved via Quests.questById
    { "id": "cap-sparker-3", "icon": "✨", "name": "Fire a sparker",
      "type": "tally", "goal": 3, "count": 1, "xp": 30, "done": false }
  ],
  "night": {                        // omitted entirely when !state.night.active
    "active": true,
    "startedAt": 1769470000000,
    "nextAt": 1769472720000,        // absolute ms — the watch renders its own countdown
    "interval": 12,
    "level": 2,
    "current": {                    // null while counting down
      "id": "n-drink-check", "tier": 1, "icon": "🥂",
      "text": "Do a drink check-in…", "say": ["You good on your drink? …"],
      "xp": 15, "comboBonus": 5
    },
    "done": 4, "passed": 1, "combo": 2, "xp": 120,
    "goals": [
      { "id": "g1769470", "text": "Talk to new guys", "target": 3, "done": 1,
        "deadlineAt": 1769473800000, "completedAt": null, "expired": false }
    ]
  }
}
```

Absolute timestamps only (`nextAt`, `deadlineAt`) — never remaining-seconds. `nightmode.js`
already works this way ("Timestamps (not intervals) drive everything") and it makes stale
snapshots harmless.

### Event schema (watch → phone)

```jsonc
{ "v": 1, "events": [
  { "id": "5F3A…", "ts": 1769472100000, "type": "rep",        "questId": null },
  { "id": "9C21…", "ts": 1769472140000, "type": "rep",        "questId": "cap-sparker-3" },
  { "id": "1B04…", "ts": 1769472300000, "type": "night.resolve", "did": true,
                                                                 "promptId": "n-drink-check" },
  { "id": "77E9…", "ts": 1769472400000, "type": "night.panic"  },
  { "id": "A0D2…", "ts": 1769472500000, "type": "night.goalTick", "goalId": "g1769470" },
  { "id": "C4B8…", "ts": 1769472900000, "type": "night.end"     }
]}
```

`id` is a UUID minted on the watch. `ts` is when the human tapped, not when it was
delivered. Events are batched — the outbox flushes on a 5-second debounce or immediately on
`isReachable`.

---

## 4. Conflict rules

Reps originate on both devices. The phone is the only writer to the save; the watch never
mutates streak, XP, or level. Replay happens in one new function, `Native.watch.apply(evts)`,
called from the plugin listener.

1. **Dedupe by UUID.** Keep `state.watch = { seen: [] }` — a ring buffer of the last ~200
   event ids. Any event whose `id` is already in `seen` is dropped before anything else
   happens. This is the only defense that covers non-idempotent operations
   (`tickGoal`, `resolve`), and `transferUserInfo` can legitimately redeliver.
2. **Reps are naturally idempotent per day.** `logRep()` opens with
   `if (s.lastRepDay === today) return { counted: false, frozeUsed: 0 }` — a second rep on
   the same day is a no-op by construction. So even if dedupe fails, a duplicate `rep`
   event cannot inflate the streak, double-spend `freezes`, or re-trigger the
   `s.streak % 5 === 0` freeze grant. XP attached to a quest still needs rule 1.
3. **Sort by `ts` before applying**, then apply in order. A watch event that arrives after
   midnight but carries a `ts` from before it is still applied with the phone's *current*
   `todayKey()` — `logRep` has no timestamp parameter and adding one would fork the streak
   logic. Accept the edge case: a 1:58 a.m. rep delivered at 2:03 a.m. counts for the new
   day. For a nightlife user this is the friendlier failure anyway (it starts tomorrow's
   chain), and Night Mode's own state is timestamp-driven and unaffected.
4. **`night.*` events are dropped if `!Store.state.night.active`** (session already ended on
   the phone), except `night.end`, which is idempotent by the same check.
   `night.resolve` additionally requires `evt.promptId === state.night.current` — if the
   phone already resolved that prompt, the watch's tap is stale and is discarded.
   `night.goalTick` requires the goal to exist and be neither `completedAt` nor `expired`;
   `tickGoal` already guards this (`js/nightmode.js:176`).
5. **Two exports must widen.** `NightMode` currently returns only `{ render, active }` and
   `Quests` returns `{ render, ensureDaily, questById, checkBadges }`. Replay needs
   `NightMode.resolve`, `NightMode.panic`, `NightMode.tickGoalById`, `NightMode.endSession`,
   and `Quests.completeQuest`. Widening the IIFE return is the whole change — do **not**
   reimplement the XP/combo/badge math in the replay path. It must go through the same
   functions the buttons call so `UI.xpToast`, `Store.awardBadge`, and
   `Native.rescheduleNotifications()` all fire identically.
6. **UI side effects when the app is backgrounded.** `resolve()` and `tickGoal()` call
   `UI.xpToast` and can open `UI.modal`. Replaying a night of queued events on resume would
   stack modals. Replay must set a `replaying` flag that `UI.modal` respects by queueing —
   `js/storymode.js` already has exactly this machinery (`pushModal`/`nextModal`, lines
   35–55); reuse the pattern rather than inventing a second one.
7. **After replay: one `Store.save()`, one `Native.rescheduleNotifications()`, one
   `Native.watch.push()`** — a fresh snapshot back to the watch closes the loop and
   corrects any optimistic state the watch guessed wrong.

---

## 5. Phased roadmap

### P0 — free, do first, costs nothing (0.5 h)

Buy/borrow the watch and pair it. **The existing `nightNotifs()` cadence already forwards
to a paired Apple Watch** — iOS mirrors local notifications to the wrist when the phone is
locked. Ids 300–311 (prompt cadence) and 400–499 (goal warnings/deadlines) will tap
Preston's wrist tonight with zero code. Run a real shift this way first and find out how
much of P2 is actually needed before building it.

### P1 — glance + one-tap rep

- **New:** `CaptivateWatch` watchOS app target; `WatchApp.swift`, `RootView.swift`,
  `QuestPickerView.swift`, `WatchStore.swift` (ObservableObject holding the decoded
  snapshot + the outbox), `WatchSession.swift` (WCSessionDelegate).
- **Phone:** `ios/App/App/Watch/WatchPlugin.swift` + `WatchSession.swift`; new
  `Native.watch` section in `js/native.js`; debounced push tail on `Store.save()`;
  `Native.watch.apply()` replay with the dedupe ring in `state.watch.seen`;
  `Quests.completeQuest` exported.
- **Plugin surface:** `push({snapshot})`, `isPaired()`, listener `watchEvents`.
- **Effort:** ~1.5–2 days.
- **Hardware:** simulator gets you the UI and layout. **WatchConnectivity between paired
  simulators is unreliable-to-nonfunctional** — every sync behavior needs a physical watch
  paired to a physical iPhone. Budget for that from day one.

### P2 — Night Mode live session

- **New (watch):** `NightView.swift`, `PromptView.swift`, `GoalsView.swift`,
  `NightScheduler.swift`.
- **Prompt delivery, in preference order:**
  1. **Baseline: local notifications scheduled on the watch itself**, mirroring the
     existing `nightNotifs()` logic. Zero background execution, a real haptic, works for a
     whole shift. Schedule them from the snapshot's `nextAt` + `interval`, and reschedule
     whenever a new snapshot arrives (a resolve shifts the cadence — see
     `js/nightmode.js:341`).
  2. **Opt-in: `WKExtendedRuntimeSession(.physicalTherapy)`** for genuinely silent wrist
     taps via `notifyUser(hapticType:repeatHandler:)`. **Hard cap 1 hour**, must be started
     from the foreground, and an app may support only one session type. Frame it as a
     "power hour" the user starts deliberately, not the default.
  3. **`HKWorkoutSession` — rejected.** It is the only multi-hour background path, but it
     requires HealthKit permission for a social-skills app, files a fake workout in Health,
     and only one workout session exists system-wide, so it would collide with any real
     workout. Wrong trade.
- **Watch → phone:** `night.resolve`, `night.panic`, `night.goalTick`, `night.end`; all
  optimistic locally, all queued.
- **Effort:** ~2–3 days, most of it in delivery testing.
- **Hardware:** physical watch, in a venue, at night. Nothing else proves this works.

### P3 — complications

- **New:** `CaptivateWatchWidget` watchOS Widget Extension target; App Group
  `group.com.preston.captivate.watch` shared **between the watch app and this extension
  only**. The watch app writes `{streak, repToday, freezes}` to the group container on
  every snapshot, then calls `WidgetCenter.shared.reloadTimelines(ofKind:)`.
- Families: `.accessoryCircular` (ring, `Gauge`), `.accessoryInline`, `.accessoryCorner`.
  `StaticConfiguration` + a trivial `TimelineProvider` with `.after(nextMidnight)`.
- Consider the watchOS 26 Smart Stack Relevance API with a POI relevance keyed to the venue
  — the app surfacing itself when he arrives at work is genuinely on-philosophy.
- **Effort:** ~1 day. **Blocked on App Group entitlements** (see risks).

### P4 — Neon progress (optional)

One read-only `.accessoryRectangular`-style card or an in-app tab showing the closest
Neon's stage progress from `skillXp` / quest counts (`stageOf`, `js/storymode.js:157`).
Half a day. Skip unless P1–P3 have proven the watch gets used.

---

## 6. Risks and unknowns

1. **Free personal team signing — the biggest constraint.** The 7-day provisioning expiry
   applies to the watch too, and a companion app burns **two** App IDs (iOS + watch), three
   with the widget extension, against a personal team's cap of 10 App IDs and 3 devices,
   all expiring every 7 days. Worse: **App Group entitlements generally cannot be
   provisioned by a personal team**, which blocks P3 outright. If the complication matters,
   the $99 Apple Developer Program membership is a prerequisite, not a nice-to-have.
   *Verify the App Group/personal-team limitation directly before committing P3 — this is
   inferred from general free-provisioning entitlement restrictions, not a watchOS-specific
   source.*
2. **Watch installs go through the paired iPhone.** Xcode talks to the watch via the phone;
   cable is more reliable than wireless. The Personal Team certificate must be trusted in
   Settings ▸ General ▸ VPN & Device Management on **both** the phone and the watch, and
   the first launch often doesn't auto-start on the wrist — tap the icon manually. Expect
   re-signing every 7 days, which for a nightlife shift schedule means a re-install ritual
   before roughly every other weekend.
3. **`cap sync` and the watch target — verified safe, with a caveat.** `cap sync` =
   `cap copy` + `cap update`. On iOS with SPM, `update` writes only
   `ios/App/CapApp-SPM/Package.swift` and the plugin `Package.swift` files; `copy` writes
   web assets into `ios/App/App/public` (a folder reference, so no pbxproj churn) plus
   `capacitor.config.json`. **It does not write `project.pbxproj`.** The widely-reported
   "cap sync overwrites project.pbxproj" complaint is about the *Pods* project, which this
   repo doesn't have. Caveat: this was read from the Capacitor CLI source, not proven
   locally — after adding the watch target, run `npm run sync` and confirm `git diff` shows
   nothing under `App.xcodeproj/`. The whole `ios/` tree is already committed
   (see `.gitignore`), so any regression is visible in a diff. Never hand-edit
   `CapApp-SPM/`.
4. **Do not use `@capacitor/watch`.** The official Ionic plugin is at 0.1.12, peers on
   `@capacitor/core ^5.0.0`, and hasn't shipped meaningfully since 2023 — not Cap 7
   compatible. It also works by sending a UI-over-the-wire string DSL (`Text(...)`,
   `Button(...)`, vertical ScrollView only), which cannot render a Night Mode prompt card,
   a countdown, or a goal list. `@capgo/capacitor-watch` is the maintained fork with real
   bidirectional messaging and is a reasonable fallback if writing the WCSession wrapper
   turns painful, but a hand-rolled plugin is ~200 lines of Swift and keeps the schema ours.
5. **WatchConnectivity background delivery is best-effort.** Apple states transfers may be
   delayed "to improve power usage." `transferCurrentComplicationUserInfo` has a **daily
   quota** (`remainingComplicationUserInfoTransfers`) — for P3, push complication data from
   the watch app's own snapshot handling, not by burning quota per update. Design every
   screen to be correct with a snapshot that's five minutes stale.
6. **Simulator can't prove sync.** Both major community plugins state flatly that
   simulators don't support app↔watch communication. Layout, Liquid Glass, and haptic call
   sites verify in the simulator; delivery, latency, and the outbox do not.
7. **`Store.save()` is called constantly.** `tickGoal` alone calls it twice per tap.
   Pushing a snapshot on every save would hammer WCSession. Debounce at ~300 ms using the
   same `rescheduleTimer` pattern already in `js/native.js:288–298`, and skip the push
   entirely if the serialized snapshot is byte-identical to the last one sent.
8. **watchOS Liquid Glass specifics unverified.** `.glassEffect(_:in:)` is documented as
   watchOS 26.0+, and standard SwiftUI containers adopt the material on recompile, but
   whether `GlassEffectContainer` morphing behaves well on a 41 mm display is untested.
   Build the standard-container version first; reach for explicit `.glassEffect()` only on
   the Night Mode prompt card. Do not stack glass on glass, and remember the Night Mode
   surface has to be legible in a dark, loud room — legibility beats the material.
9. **Xcode target-picker wording.** Apple's "Setting up a watchOS project" page is stale
   (still documents the pre-Xcode-14 two-target `WKWatchKitApp` /
   `WKExtensionDelegateClassName` era). Use File ▸ New ▸ Target ▸ watchOS ▸ App and
   associate it with the existing iOS app in the sheet that follows; trust the per-key
   Info.plist reference pages over that overview.
