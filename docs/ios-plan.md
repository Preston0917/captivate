# Captivate — iOS Plan (PWA + Capacitor)

Design doc for the mobile phase of docs/PLAN.md §5. One codebase, deployed two ways:
GitHub Pages (web/PWA) and a Capacitor-wrapped iOS app.

## Why Capacitor (decision)

- The app is framework-free static HTML/JS — Capacitor wraps a web directory as-is; zero
  rewrite, and the Pages deploy keeps working from the same files.
- A native SwiftUI rewrite means two codebases forever. React Native buys nothing (no React
  here). PWA-only can't do what we actually need from iOS: **scheduled local notifications**
  (iOS Web Push needs a server push; it cannot schedule offline/local), Keychain, share-sheet
  file import, real haptics.
- Capacitor plugins cover every want: `@capacitor/local-notifications`, `@capacitor/haptics`,
  `@capacitor/app` (URL-open events, resume), `@capacitor/filesystem`, plus a Keychain
  secure-storage plugin.

## Phase A — PWA layer (web feature, ships to Pages)

1. **`manifest.webmanifest`** — relative paths only (Pages serves under `/captivate/`):
   `start_url: "./"`, `scope: "./"`, `display: "standalone"`, theme/background `#12101c`,
   icons 192 + 512 (+ `purpose: maskable` variants) under `icons/`.
2. **Icons** — original artwork only (no book/Pokémon IP): dark card with the game's neon
   gradient (see css vars), a simple spark/mask motif. Author one SVG, rasterize to
   180 (apple-touch-icon), 192, 512 PNG via installed Playwright Chromium (screenshot of the
   SVG at size).
3. **`sw.js`** at repo root, scope `./`:
   - Versioned precache of the app shell: index.html, css, all js (incl. `js/data/*`),
     icons, manifest. Bump a `CACHE_VERSION` string on deploys (build-time content hash not
     needed; a manual version constant is fine — note it in the file header).
   - Fetch: same-origin GET → stale-while-revalidate (serve cache, refresh in background).
     Anything cross-origin (the Anthropic API call) or non-GET → passthrough, never cached.
   - `skipWaiting()` + `clients.claim()`.
4. **index.html** — link manifest, `apple-touch-icon`, `apple-mobile-web-app-capable` +
   status-bar meta. Register the SW **only** when `!window.Capacitor` and
   `location.protocol` is http/https (the native wrap must not run the SW).
5. **Verify with Playwright before push**: page loads clean (no console errors), SW
   registers, `context.setOffline(true)` + reload still renders and tabs work, analyzer
   pane still loads. Then commit, push, and confirm the Pages action goes green.

## Phase B — Capacitor iOS wrap

### Project layout

- `package.json` (private) — `@capacitor/{core,cli,ios}` v7 + plugins above + a
  Cap-7-compatible Keychain plugin (`@aparajita/capacitor-secure-storage` or
  `capacitor-secure-storage-plugin`; check npm for current Cap 7 support and pick one).
- `capacitor.config.json` — `appId: "com.preston.captivate"`, `appName: "Captivate"`,
  `webDir: "www"`.
- `scripts/build-www.sh` — copies `index.html css/ js/ icons/ manifest.webmanifest sw.js`
  into `www/` (fresh each run). `www/`, `node_modules/`, `ios/App/Pods`, build junk →
  `.gitignore`. The `ios/` project itself IS committed (Info.plist customizations must
  persist).
- `npx cap add ios`, then `npx cap sync`.

### `js/native.js` — the bridge (loaded before all engine scripts)

Exposes a `Native` global; every method is a safe no-op / localStorage fallback on web.
`Native.isNative` = `!!window.Capacitor?.isNativePlatform?.()`.

1. **API key in Keychain** — `Native.getApiKey()` / `Native.setApiKey(v)` (async).
   Native: Keychain plugin. Web: `Store.state.settings.apiKey` as today.
   Migration on first native run: if a key exists in the localStorage save, move it into
   Keychain and blank the localStorage copy. Settings pane + analyzer switch to the async
   accessors (small refactor; keep web behavior identical).
2. **Haptics** — `Native.haptic(kind)`: `tap` (light impact) on quest/tally actions,
   `success` (notification) on XP toast / level-up / badge / Neon evolution. Call sites:
   UI.toast XP paths, quest complete, night-mode pass, story-mode catch/evolve.
3. **Notifications** — all-carrot copy everywhere: reminders invite, never guilt-trip.
   `Native.rescheduleNotifications()` reads Store.state, cancels our pending IDs, and
   schedules:
   - **Daily quest nudge** (ids 100–106): next 7 days at `settings.notifs.questHour`
     (default 10:00). Skip today's if a rep is already logged today or all dailies done.
     Copy rotates through warm lines ("3 fresh quests are up — any one of them counts").
   - **Streak keeper** (ids 200–206): next 7 evenings at `settings.notifs.streakHour`
     (default 20:30), skipped any day a rep is already in. Mention the freeze safety net,
     never "you'll lose your streak".
   - **Night Mode** (ids 300+ prompts, 400+ goal deadlines): scheduled only while a night
     session is active — prompt cadence follows the session's interval config (next ~12),
     each goal gets a 10-min-warning + at-deadline pair. Canceled on session end / goal
     completion (goal ids must be deterministic from goal id → hash to int range).
   - Recompute triggers: app launch, `appStateChange` resume, after `logRep`, quest
     completion, night session start/end/goal change, settings change.
   - Permission: a "Reminders" section in Settings (shown only when `isNative`) with an
     enable toggle (requests permission on first enable) + time pickers for the two daily
     nudges. `settings.notifs = { enabled, questHour, streakHour }` in the save.
   - Tap routing: `localNotificationActionPerformed` → `extra.pane` → `UI.showPane(...)`.
4. **Share-sheet transcript import** — Info.plist `CFBundleDocumentTypes` for
   `public.plain-text`/`public.text` (+ LSSupportsOpeningDocumentsInPlace false), so
   "Open in Captivate" appears in the share sheet for .txt files. `@capacitor/app`
   `appUrlOpen` → `@capacitor/filesystem` read → switch to analyzer pane with the textarea
   pre-filled (and a toast). No custom share extension in v1 (that's a separate Xcode
   target; revisit if "Open in" feels too buried).

### iOS project config

- Portrait-only, dark appearance (`UIUserInterfaceStyle: Dark`), status bar to match
  `#12101c`. Display name "Captivate".
- Viewport already has `viewport-fit=cover`; verify safe-area insets in the wrap.

### Phase B verification (on this Mac)

`bash scripts/build-www.sh && npx cap sync ios`, then build for the iOS simulator
(xcodebuild, scheme App) and launch. Verify: app boots, tabs navigate, a quest completes
(haptic call doesn't throw), Settings shows the Reminders section, scheduling pending
notifications lists them (`LocalNotifications.getPending()` via console or a debug toast).
Web regression: re-run the Phase A Playwright checks — index.html changes must not break
Pages.

### Phase B as built (deviations from the design above)

- **Swift Package Manager, not CocoaPods.** CocoaPods can't be installed on this Mac
  (system Ruby 2.6, no Homebrew; modern pod dependencies need Ruby ≥ 3.1). The project was
  created with the Cap 7 SPM template, so there is **no `App.xcworkspace`** — open
  `ios/App/App.xcodeproj` and build the `App` scheme. All five plugins ship a `Package.swift`.
- **Keychain plugin: `capacitor-secure-storage-plugin` 0.12.0** (peer `@capacitor/core >= 7`).
  `@aparajita/capacitor-secure-storage` is CocoaPods-only (no `Package.swift`) and its
  current release peers on Capacitor 8, so it was ruled out.
- `ios/App/CapApp-SPM/Package.swift` references plugins by **relative path into
  `node_modules/`** — run `npm install` before opening Xcode on a fresh clone.
- Added a safe-area fix: `.hud` now pads by `env(safe-area-inset-top)` (it rendered under
  the Dynamic Island in the wrap; `env()` is 0 on the web, so Pages is unchanged).
- Emoji render as tofu in the iOS Simulator — reproduced in the simulator's own Safari on
  the same page, i.e. a simulator font-fallback quirk, not an app bug.

## Phase C — device install (Preston's Mac-side steps)

Documented at the end of the session: open `ios/App/App.xcworkspace`, set the signing team,
plug in the phone (or same-LAN CoreDevice), Product ▸ Run. Notifications + Keychain need a
real device to fully exercise (simulator supports local notifications, so most of it
verifies there).

## Out of scope this session

- Audio pipeline (PLAN.md §5.4), remaining engagement-audit recs, share *extension* target,
  App Store distribution (personal side-load is fine; free-team 7-day resigning noted).
