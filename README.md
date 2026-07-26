# Captivate — Social Skills Quest 🎭

A personal, gamified social-skills trainer built on the methods in Vanessa Van Edwards'
**Captivate** and **Cues**. HTML-first (no build step, no backend) — designed to become
a mobile app later.

> Personal-use project. Content is paraphrased study material from books I own.

## Run it

Open `index.html` in a browser. That's it. Everything (progress, XP, streaks, settings)
is stored in `localStorage` on your device.

For the **Conversation Analyzer**, add your Claude API key in **Settings** — the key is
stored only in your browser and calls `api.anthropic.com` directly (personal use only;
don't host the page publicly with a key saved).

## What's inside

| Feature | What it does |
|---|---|
| **Quest Board** | 3 daily real-world missions + a weekly boss challenge, drawn from the books' exercises. Cue-spotting quests have tap-to-tally counters. |
| **Training Grounds** | Quiz decks + flashcards drilling the science: the 7 microexpressions, warmth/competence cues, danger-zone cues, conversation sparkers, study numbers. |
| **Skill Tree** | The 14 Captivate skills + the Cues channels, with mastery pips lit by the XP you earn in each skill. |
| **Conversation Analyzer** | Paste a transcript of a recorded conversation → Claude scores each speaker on the Cues charisma scale (warmth × competence), catches named verbal cues with quotes, maps the emotional arc, and gives 3 coaching moves tied to book techniques. |
| **Progression** | XP, 15 level titles (Wallflower → Captivator), streaks, badges, daily "spark" tips. |

## Project layout

```
index.html          app shell
css/style.css       all styling (dark, game-like, mobile-first)
js/state.js         save data, XP/levels, streaks (localStorage)
js/ui.js            shared UI helpers (toasts, modals, meters)
js/app.js           tab router + settings pane
js/quests.js        quest board engine
js/trainer.js       quizzes + flashcards
js/skilltree.js     mastery view
js/analyzer.js      transcript coach (Claude API)
js/home.js          dashboard
js/data/*.js        game content generated from the two books
docs/PLAN.md        design doc: gamification model, analyzer design, mobile roadmap
```

## Roadmap (short)

1. **v0 (this)** — static HTML app, full game loop + text-transcript analyzer.
2. **v1** — audio upload: AssemblyAI for diarization + timing, richer vocal-cue coaching.
3. **v2** — wrap as mobile app (Capacitor) with notifications for daily quests.

See `docs/PLAN.md` for the full plan.
