# Captivate — Liquid Glass UI Plan

Spec for a CSS-first visual upgrade of Captivate to Apple's Liquid Glass design language
(iOS 26 HIG), tuned to keep the app's dark-neon arcade identity.
Target: `css/style.css` (+ at most trivial `index.html` class additions).
**No DOM/JS restructuring.** Implementer follows §6 in order.

Research basis: Apple HIG *Materials* / WWDC25 "Meet Liquid Glass"; createwithswift
(Hierarchy / Harmony / Consistency); CSS-Tricks "Getting Clarity on Apple's Liquid Glass";
David Smith "Don't Liquid Glass All the Things"; MDN `backdrop-filter`,
`prefers-reduced-transparency`.

---

## 1. Principles (the reviewer's checklist)

Each is testable. A reviewer should be able to point at a screenshot and say pass/fail.

1. **Glass is the chrome layer, never the content layer.**
   *Here:* only `.hud`, `.tabbar`, `#modal-layer`, `.toast` get `backdrop-filter`.
   `.card`, `.stat-tile`, `.dex-tile`, `.skill-row`, quest/story rows stay opaque surfaces.
   Fail = a blurred quest card.

2. **Never stack glass on glass.**
   *Here:* when the modal is open, its backdrop is the only blur over the pane; the
   `.modal-card` itself is an opaque "lit" surface, not a second blur. Toasts sit over
   content, never over the open modal card. Max **3** blurring elements composited at once
   (HUD + tabbar + one overlay).

3. **Content leads; chrome recedes and floats.**
   *Here:* the tab bar becomes a floating capsule inset from the screen edges with content
   visibly passing *under* it; the HUD loses its hard bottom border for a hairline
   light-edge. Neither gains weight, color, or size.

4. **Light: refract, rim, specular.** Glass = blur + saturation boost + a bright top-edge
   inset stroke + a soft dark outer shadow. *Here:* every glass surface uses the
   `--glass-*` recipes in §3 — no ad-hoc `backdrop-filter: blur(Xpx)` anywhere else.

5. **Adaptive tint carries the brand, not Apple gray.**
   *Here:* glass tint is violet-ink (`#241f38` family), and the *active* state tints toward
   `--gold` (tab bar), `--violet` (story), `--warm` (streak hot). Stock white/gray glass is
   a fail.

6. **Concentric radii.** Inner radius = outer radius − padding, so nested corners share a
   center. *Here:* `--radius: 20px` / `--card-pad: 12px` / `--radius-inner: 8px`;
   modal 28px with 20px padding → inner 8px. Same 8px inner everywhere.

7. **Legibility beats effect.** Dense/secondary text (`.muted`, `.hint`, `.st-label`,
   `.dex-name`, `.goal-meta`) must never sit on a blurred backdrop. Body text ≥ 4.5:1,
   large/bold ≥ 3:1, measured against the *lightest* thing that can scroll behind glass.

8. **Degrade honestly.** Every glass surface has an opaque fallback that still looks
   deliberate, under `@supports not` and `prefers-reduced-transparency`. Turning glass off
   must not change layout by a single pixel.

---

## 2. Design spec per surface

### 2.0 Backdrop (new, enables everything)
Glass over a flat `#12101c` reads as gray mud — there is nothing to refract. Add a fixed
neon aurora behind the app via `body::before` (no DOM change):

```css
body::before{
  content:""; position:fixed; inset:-10%; z-index:-1; pointer-events:none;
  background:
    radial-gradient(48% 38% at 18% 6%,  rgba(155,123,255,.20), transparent 70%),
    radial-gradient(42% 34% at 88% 22%, rgba(255,138,92,.13), transparent 72%),
    radial-gradient(56% 44% at 50% 104%,rgba(92,184,255,.12), transparent 70%);
}
```
Static (no animation). Keeps `--bg` as the base color so the fallback path is unchanged.

### 2.1 HUD header (`.hud`)
- Material: **`--glass-chrome`**. Replace the `linear-gradient` background and the solid
  `border-bottom` with the recipe's tint + hairline top-light and a 1px
  `rgba(255,255,255,.06)` bottom rule (via the recipe's shadow, not `border-bottom`).
- **Untouched:** `position: sticky`, `height: calc(var(--hud-h) + env(safe-area-inset-top))`,
  `padding: env(safe-area-inset-top) 14px 0`, z-index 30, and all `.hud-*` typography/colors.
- Add `transform: translateZ(0)` (WKWebView sticky+blur flicker).
- `.avatar`: keep gold ring; add inset specular
  `inset 0 1px 0 rgba(255,255,255,.35)` and outer `0 2px 10px rgba(245,196,81,.22)`.

### 2.2 XP bar (`.xpbar` / `.xpbar-fill`)
- Track: `rgba(255,255,255,.07)` + `inset 0 1px 1px rgba(0,0,0,.45)`, border →
  `1px solid rgba(255,255,255,.08)`. Height 10px stays.
- Fill: keep the gold gradient; add `inset 0 1px 0 rgba(255,255,255,.45)` (specular top)
  and `0 0 10px rgba(245,196,81,.35)` bloom. Keep the existing 0.6s width transition.
- Same treatment for `.meter` / `.meter-fill` (analyzer) — track recessed, fill lit.
  Keep `.meter-fill.warm/.comp/.gold` gradients exactly.

### 2.3 Bottom tab bar (`.tabbar`) — the headline change
Becomes a **floating glass capsule**:

```css
.tabbar{
  position:fixed; z-index:30;
  left:12px; right:12px; bottom:calc(env(safe-area-inset-bottom) + 10px);
  height:var(--tabbar-h); padding-bottom:0;    /* safe area moves to `bottom` */
  border-radius:26px; overflow:hidden;
  /* + --glass-chrome recipe */
}
```
- Because `padding-bottom: env(...)` is gone, `#main` bottom padding becomes
  `calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 34px)`. Verify last card is fully
  scrollable above the capsule.
- Active tab: add a glass pill behind the icon via `.tab.active::before`
  (CSS-only, no DOM): inset 4px, `border-radius: 22px` (= 26 − 4, concentric —
  *corrected*: the original spec said 20px from "26 − 6", but the inset is 4px),
  `background: linear-gradient(180deg, rgba(245,196,81,.20), rgba(245,196,81,.08))`,
  `box-shadow: inset 0 1px 0 rgba(255,255,255,.28)`.
- **Untouched:** flex layout, `.tab` typography, `.tab-ico` grayscale→color logic,
  `.tab.active { color: var(--gold) }`.
- Desktop `@media (min-width: 720px)`: keep centered, `max-width: 560px`, drop the
  `18px 18px 0 0` radius override (capsule everywhere), keep `translateX(-50%)`.

### 2.4 Cards & panels (`.card`, `.stat-tile`, `.skill-row`, `.badge`, `.dex-tile`,
`.story-rail-node`, `.quest-card`, `.gym-card`)
**No `backdrop-filter`.** They get **`--glass-card`**: a lit opaque surface — layered
gradient + rim highlight + depth shadow.
- `--radius: 20px`, `--card-pad: 12px` (was 14px/14px).
- **Critical:** keep the `border: 1px solid var(--card-edge)` *shorthand* on `.card`,
  `.stat-tile`, `.skill-row`, `.badge`, `.dex-tile`, `.story-*`, `.gym-card`, `.chip`.
  `js/home.js`, `js/quests.js`, `js/storymode.js` set inline `style="border-color:var(--gold)"`
  etc. to signal state. If the rim moves to `box-shadow` only, **all state coloring dies.**
  Rim highlight is *additive* (`box-shadow`), the border stays.
- Accent cards (`.daily-spark`, `.night-prompt`, `.story-hero`, `.story-rival`) keep their
  violet/gold gradients — deepen them slightly and add the same rim, nothing more.
- Inner surfaces inside a card (`.tally`, `.quiz-opt`, `.quiz-explain`, `.say-chip`,
  `.goal-row`, `.story-rung`, `.gym-part`, `.dex-form`, `.cue-hit`, `.neon-catch`,
  `.story-done-row`) → `border-radius: var(--radius-inner)` (8px) and a recessed fill
  `rgba(0,0,0,.22)` + `inset 0 1px 0 rgba(255,255,255,.04)`. They read as wells cut into
  the card, not as more glass.

### 2.5 Modals (`#modal-layer`, `.modal-backdrop`, `.modal-card`)
- `.modal-backdrop`: **`--glass-overlay`** — `rgba(8,6,16,.62)` + `blur(24px) saturate(140%)`.
  This is the one heavy blur; it replaces the current `blur(3px)`.
- `.modal-card`: **`--glass-card`** (opaque, no blur — rule 2), `border-radius: 28px`,
  `padding: 20px`, stronger shadow `0 24px 60px rgba(0,0,0,.6)`, rim highlight.
- **Untouched:** `width: min(92vw,480px)`, `max-height: 82dvh`, `overflow-y: auto`,
  `.hidden { display:none !important }`.

### 2.6 Toasts (`.toast`, `#toast-layer`)
- `.toast`: **`--glass-overlay`** at a lighter weight (`blur(16px) saturate(170%)`), tint
  `rgba(36,31,56,.72)`, keep the gold border and pill radius, add
  `inset 0 1px 0 rgba(255,255,255,.22)`.
- Fix while here: `#toast-layer` top must clear the notch —
  `top: calc(var(--hud-h) + env(safe-area-inset-top) + 10px)`.
- Keep `pointer-events: none` and the 3.1s removal timing in `js/ui.js`.

### 2.7 Buttons & chips (`.btn`, `.chip`, `.seg`, `.tally-btn`, `.goal-plus`)
- `.btn` → **capsule**: `border-radius: 999px`, `padding: 11px 18px`. Applies to
  `.btn.small` (`8px 14px`) and `.btn.block`. This is the single strongest iOS-26 signal
  and costs zero DOM.
- Default `.btn`: `background: rgba(255,255,255,.07)`, `border: 1px solid rgba(255,255,255,.12)`,
  `inset 0 1px 0 rgba(255,255,255,.14)`. No blur (buttons live on cards → would be glass-on-glass).
- `.btn.primary`: keep the gold gradient; add `inset 0 1px 0 rgba(255,255,255,.5)` and
  `0 4px 14px rgba(245,196,81,.28)`.
- `.btn.ghost` / `.btn.danger` keep transparent + colored border. `:disabled` unchanged.
- `.chip` already a pill — keep radius 20px, add the rim inset. All `.chip.xp/.warm/.comp/.boss`
  color rules untouched.
- `.seg.on`, `.tally-btn:active`, `.goal-plus` behavior unchanged; radii → `--radius-inner`
  where they nest.

### 2.8 Pane backgrounds & typography
Panes stay transparent over the aurora — that's what the chrome refracts. No pane gets a
background. `h2.pane-title`, `.pane-sub`, `.section-label`, all story/neon typography:
**untouched**. Text color tokens `--ink/--ink-dim/--ink-faint` unchanged.

---

## 3. Material recipes (the system)

Add near the top of `css/style.css`, right after `:root`. Nothing else may declare
`backdrop-filter`.

```css
:root{
  --radius: 20px;
  --card-pad: 12px;
  --radius-inner: 8px;               /* = --radius - --card-pad (concentric) */

  --glass-tint:      rgba(36,31,56,.62);
  --glass-tint-deep: rgba(14,11,26,.72);
  --glass-blur: 18px;
  --glass-sat: 165%;
  --rim:      inset 0 1px 0 rgba(255,255,255,.16);
  --rim-soft: inset 0 1px 0 rgba(255,255,255,.08);
  --hairline: 0 0 0 1px rgba(255,255,255,.07);
  --lift:     0 10px 30px rgba(0,0,0,.45);
}

/* 1 — CHROME: HUD + tab bar. Floats above content. */
.glass-chrome{
  background: linear-gradient(180deg, rgba(58,48,96,.42), var(--glass-tint));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
          backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  box-shadow: var(--rim), var(--hairline), var(--lift);
  border: none;
  transform: translateZ(0);          /* WKWebView compositing stability */
}

/* 2 — CARD: opaque lit surface. NO backdrop-filter. Keeps its border shorthand. */
.glass-card{
  background:
    linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,0) 42%),
    linear-gradient(160deg, var(--bg-3), var(--card));
  border: 1px solid var(--card-edge);            /* JS overrides border-color — keep it */
  border-radius: var(--radius);
  box-shadow: var(--rim-soft), 0 6px 18px rgba(0,0,0,.32);
}

/* 3 — OVERLAY: modal backdrop + toasts. Heaviest blur, one at a time. */
.glass-overlay{
  background: var(--glass-tint-deep);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
          backdrop-filter: blur(24px) saturate(140%);
}
```

Apply by **extending existing selectors** (`.hud, .tabbar { … }` copying the chrome
declarations, or `.hud, .tabbar` added to the `.glass-chrome` selector list) — do **not**
require new class attributes in JS-generated markup. Adding `class="tabbar glass-chrome"`
in `index.html` is acceptable; adding classes to JS output is not.

### Fallbacks (ship with the recipes, not after)

```css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))){
  .hud, .tabbar { background: #1b1730; }
  .modal-backdrop { background: rgba(8,6,16,.92); }
  .toast { background: var(--bg-3); }
}
@media (prefers-reduced-transparency: reduce){
  .hud, .tabbar, .modal-backdrop, .toast{
    -webkit-backdrop-filter: none; backdrop-filter: none;
  }
  .hud, .tabbar { background: #1b1730; }
  .modal-backdrop { background: rgba(8,6,16,.94); }
  .toast { background: var(--bg-3); }
  body::before { opacity: .35; }
}
```
Both fallbacks are color-only — zero layout change.

---

## 4. Motion (small, purposeful, all opt-out)

1. **Pane transition** — replace `@keyframes fadein` easing on `.pane` with a spring:
   `opacity 0→1, transform: translateY(8px) scale(.995)→none`, `.30s cubic-bezier(.22,1,.36,1)`.
2. **Tab press** — `.tab:active { transform: scale(.94) }` (.12s); `.tab.active::before`
   fades/scales in (`opacity/transform` only — never animate `backdrop-filter` or `blur`).
3. **XP bar specular sweep** — on `.xpbar-fill::after`, a 1.1s translateX gradient sheen,
   triggered by the existing width transition (pure CSS `animation` on the fill; runs on
   render, cheap, no JS).
4. **Level-up sheen** — `.levelup .lv-big` keeps its scale pop; add a one-shot diagonal
   sheen sweep across `.modal-card::after` (`.9s`, `pointer-events:none`, then transparent).
5. **Button press** — keep `transform: scale(.97)`; add `filter: brightness(1.08)` on
   `:active` for primary.
6. Keep `story-evo-pop` and `spin` as they are.

```css
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after{
    animation-duration:.001ms !important; animation-iteration-count:1 !important;
    transition-duration:.001ms !important;
  }
}
```
No parallax, no motion-linked highlights, no continuously animating background.

---

## 5. Constraints (hard rules)

1. **Cross-engine:** must render in plain Chromium (GitHub Pages) *and* WKWebView
   (Capacitor). Every `backdrop-filter` ships with `-webkit-backdrop-filter` **first**.
2. **No SVG `feDisplacementMap` refraction.** Chrome-only as a backdrop filter, expensive,
   breaks in WKWebView. Simulate refraction with gradients + rim only.
3. **Blur budget:** at most **3** blurring elements alive at once; blur radius ≤ 24px.
   No blur on any element that repeats in a list (cards, tiles, rows, chips, buttons).
4. **No DOM changes.** `js/*.js` markup is off-limits. Permitted `index.html` edits: adding
   a class attribute to an existing element. Nothing else.
5. **Keep border shorthands** on `.card`, `.stat-tile`, `.skill-row`, `.badge`, `.dex-tile`,
   `.story-*`, `.gym-card`, `.chip`, `.goal-row`, `.seg` — JS sets inline `border-color`
   for state (gold/good/violet/comp). Verify after: comeback card = green rim, Night Mode
   shortcut = gold, Story shortcut = blue, `.goal-row.hit` = green.
6. **Safe areas intact:** `.hud` keeps `env(safe-area-inset-top)` in both height and
   padding; `.tabbar` keeps `env(safe-area-inset-bottom)` (now in `bottom`);
   `viewport-fit=cover` and `black-translucent` status bar stay.
7. **Contrast:** body copy ≥ 4.5:1, ≥ 3:1 for ≥18.66px bold, measured on glass over the
   brightest scrollable content. If a glass tint fails, raise tint alpha — never lighten text.
8. **Fallbacks are mandatory**, per §3, and must not shift layout.
9. **PWA/offline:** bump `CACHE_VERSION` in `sw.js` (`captivate-v2` → `v3`) or users keep
   the old stylesheet forever. No new files, no external fonts, no CDN — offline shell must
   still be self-contained.
10. **Build:** `www/` is a copy, not a source. After editing `css/style.css`, run
    `npm run build` (`scripts/build-www.sh`) — and `npm run sync` before any iOS check.
11. `.hidden { display: none !important }` and `.pane.active { display: block }` must keep
    winning. Don't introduce `display`/`visibility` on glass surfaces.
12. No new CSS custom properties beyond §3; no renaming of existing tokens
    (`--gold`, `--warm`, `--comp`, `--violet`, `--good`, `--danger`, `--ink*`).

---

## 6. Implementation checklist (in order)

1. Add the `:root` additions + three recipes + `@supports`/`prefers-reduced-transparency`
   blocks (§3). Change nothing else yet; confirm the app still renders identically.
2. Add `body::before` aurora (§2.0). Check the HUD/tabbar now have something to refract.
3. Apply `--glass-chrome` to `.hud`. Remove `border-bottom` + old gradient. Verify notch
   clearance on an iPhone-sized viewport.
4. Convert `.tabbar` to the floating capsule; update `#main` bottom padding; update the
   `min-width: 720px` override. Verify last card scrolls clear on Home and Settings.
5. Add `.tab.active::before` pill + `:active` press.
6. Apply `--glass-card` to `.card` (and `.stat-tile`, `.skill-row`, `.badge`, `.dex-tile`,
   `.story-rail-node`, `.gym-card`). Keep every existing border shorthand.
7. Retune inner surfaces (§2.4 list) to `--radius-inner` + recessed fill.
8. Buttons → capsule + rim; chips → rim. Check `.btn.block` and `.btn.small`.
9. Modal backdrop → `--glass-overlay`; `.modal-card` → glass-card at radius 28.
10. Toasts → overlay recipe; fix `#toast-layer` safe-area top.
11. XP bar + `.meter` recessed track / lit fill + specular.
12. Motion (§4) + the `prefers-reduced-motion` block.
13. Bump `sw.js` `CACHE_VERSION`; run `npm run build`.

### Visual QA screens (check every one, phone width 390×844 and desktop 1280)
- Home — comeback card (green rim), daily spark, Night Mode (gold rim), Story (blue rim),
  trophy strip, stat grid, both shortcuts.
- Quests — quest card with chips, tally counter, done/faded card, how-to modal + `.say-chip`.
- Trainer — quiz question, correct + wrong option states, explain block, progress dots,
  flashcard.
- Skills — locked vs unlocked rows, mastery pips.
- Analyzer — textarea focus ring, three meters, cue-hit rows, spinner.
- Settings — API key field, select, badge grid (locked + owned), danger button.
- Night Mode — segmented row, clock, night prompt, goal rows (hit/expired).
- Story Mode — region rail, hero card, rival card, rungs, Cuedex grid + sheet, gym card.
- Overlays — level-up modal, badge modal, toast stack of 2, toast while a modal is open.
- States — Reduce Transparency ON, Reduce Motion ON, `@supports` fallback (disable
  backdrop-filter in devtools), offline reload after cache bump, iOS Dynamic Island top and
  home-indicator bottom.
