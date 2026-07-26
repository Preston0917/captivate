# Captivate — Design Plan

Personal social-skills training game based on *Captivate* and *Cues* (Vanessa Van Edwards).
HTML-first, later mobile.

## 1. Goals

- Make daily social-skills practice **engaging enough to actually do** (the user has social
  anxiety; the game loop lowers activation energy: small quests, instant XP, streaks).
- Teach the books' systems two ways: **knowledge reps** (quizzes/flashcards) and
  **field reps** (real-world quests).
- Close the loop with **evidence**: analyze real conversation transcripts (from streams /
  recordings where everyone knows they're recorded) against the books' frameworks and
  track improvement over time.

## 2. Gamification model (Octalysis mapping)

The game systems map onto Yu-kai Chou's Octalysis core drives:

| Core drive | Feature |
|---|---|
| 1. Epic Meaning & Calling | The "charisma journey" narrative; level titles from Wallflower → Captivator |
| 2. Development & Accomplishment | XP, levels, mastery pips per skill, badges, quiz best-scores |
| 3. Empowerment & Creativity | Custom quests; choice of which side quests to run; analyzer as a feedback sandbox |
| 4. Ownership & Possession | Badge collection, streaks, lifetime stats, saved analysis history |
| 5. Social Influence | Solo app by design — the "leaderboard" is your own past analyses (warmth/competence trend) |
| 6. Scarcity & Impatience | Only 3 daily quests per day; one boss per week; decks locked behind levels |
| 7. Unpredictability & Curiosity | Daily quests and the daily spark are seeded-random per day; mystery of what tomorrow rolls |
| 8. Loss & Avoidance | Streak resets if a day is skipped (touching the app + any XP keeps it alive) |

Design choices:
- **Deterministic daily rolls** (seeded by date) so refreshing can't reroll quests.
- **Self-report completion** is fine — it's a personal tool; friction is the enemy.
- **XP curve**: `80 + 45·(level−1)` per level — fast early levels for momentum.
- **Skill XP** routes every reward to a book skill, powering the mastery pips.

## 3. Content pipeline

Both books were distilled into structured briefs (chapter → techniques → quiz facts →
quest ideas), then converted to JS data files:

- `js/data/captivate-content.js` — 14 skills (Control, Capture, Spark, Highlight, Intrigue,
  Decode, Solve, Appreciate, Value, Connect, Empower, Reveal, Protect, Engage), quiz decks,
  microexpression flashcards, sparker tips, ~25 quests.
- `js/data/cues-content.js` — charisma scale + cue channels (body warmth/power, danger zone,
  vocal, verbal, imagery), cue decks/flashcards, cue-spotting tally quests.

Adding content = appending to those arrays; the engine picks it up automatically.

## 4. Conversation Analyzer

### Research findings (July 2026)

- **Hume AI's Expression Measurement API was sunset June 2026** — not an option anymore.
  Its successor (EVI) is realtime-voice only.
- For **text transcripts**, an LLM with a structured rubric beats dimensional emotion APIs
  anyway: it can score directly against the books' constructs (warmth/competence, danger-zone
  language, sparkers vs autopilot questions) and produce coaching, which a "53 emotion
  scores" vector cannot.
- For a later **audio** version, AssemblyAI (~$0.19/hr) adds speaker diarization, per-sentence
  sentiment, pauses/talk-time — feed that metadata + transcript to Claude. True prosody
  models (audEERING, openSMILE) are optional beyond that.

### v0 implementation (shipped)

- Paste transcript (speaker labels ideal; the model infers turns otherwise) + "which speaker
  am I".
- One Claude API call (`claude-opus-5` default), browser-direct with the
  `anthropic-dangerous-direct-browser-access` header; key stored in localStorage.
  **Acceptable only because this is a personal, local app** — a hosted version must move the
  call behind a tiny proxy (e.g. Cloudflare Worker).
- **Structured output** (`output_config.format` json_schema) returns: per-speaker
  warmth/competence 0–10 + charisma-zone verdict + talk share; named cue events with verbatim
  quotes; conversation dynamics (sparks used, dead-end questions, dropped threads); emotional
  arc; top-3 coaching moves each tied to a named book technique.
- Text-only guardrail: the system prompt forbids inventing body-language/vocal observations.
- Each analysis awards XP and appends a small summary to a local history so warmth/competence
  trends are visible over time.

## 5. Mobile roadmap

1. **Now**: works as a mobile web page (mobile-first layout, safe-area insets). Can be
   "installed" via Add to Home Screen.
2. **Next**: add a manifest + service worker → installable PWA, offline-capable (everything
   but the analyzer already works offline).
3. **Then**: wrap with **Capacitor** for a real iOS app: local notifications for daily
   quests/streak protection, share-sheet ingestion of transcript files, secure key storage
   (Keychain instead of localStorage).
4. **Audio pipeline** (v1.5): upload recording → serverless function → AssemblyAI
   (diarization + sentiment + timing) → Claude coaching pass → merged report. Requires a tiny
   backend; the browser-direct pattern doesn't extend safely to more keys.

## 6. Known limits / next ideas

- Quest completion is honor-system by design.
- The analyzer's talk-share numbers are model estimates, not word counts — good enough for
  coaching, not for metrics.
- Ideas: spaced repetition for flashcards; "pre-game" screen (Captivate's social game plan
  builder before an event); analyzer diffing two transcripts; weekly recap card.
