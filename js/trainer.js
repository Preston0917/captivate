/* ============================================================
   trainer.js — quiz decks, flashcards, and the book-lingo glossary
   Decks come from CaptivateContent, CuesContent, and LingoContent
   Glossary terms: LingoContent.terms { id, term, emoji, book, def, example, related }
   Deck: { id, name, icon, desc, minLevel, questions: [{q, options[], answer, explain}] }
   Flashcard sets: { id, name, icon, cards: [{front, back}] }
   ============================================================ */

const Trainer = (() => {
  const QUIZ_LEN = 6;   // questions pulled per run
  const XP_PER_CORRECT = 8;
  const XP_PERFECT_BONUS = 20;

  function allDecks() {
    return CaptivateContent.decks.concat(CuesContent.decks, LingoContent.decks);
  }
  function allFlashSets() {
    return CaptivateContent.flashcards.concat(CuesContent.flashcards, LingoContent.flashcards);
  }

  function render() {
    const pane = document.getElementById("pane-trainer");
    const s = Store.state;
    pane.innerHTML = "";
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "Training Grounds" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Drill the science — microexpressions, cues, and conversation weapons." }));

    // Glossary shortcut — plain-English decoder for every phrase the books coin
    const gloss = UI.el("div", { class: "card quest-card" });
    gloss.appendChild(UI.el("div", { class: "quest-head" }, [
      UI.el("div", { class: "quest-ico", text: "📖" }),
      UI.el("div", { class: "quest-body" }, [
        UI.el("div", { class: "quest-name", text: "Book Lingo Glossary" }),
        UI.el("div", { class: "quest-desc", text: "Sparker, thread theory, cue cluster — decoded." }),
        UI.el("div", { class: "quest-meta" }, [
          UI.el("span", { class: "chip", text: `${LingoContent.terms.length} terms` }),
        ]),
      ]),
    ]));
    gloss.appendChild(UI.el("div", { class: "quest-actions" }, [
      UI.el("button", { class: "btn primary small", text: "Browse the glossary", onclick: renderGlossary }),
    ]));
    pane.appendChild(gloss);

    pane.appendChild(UI.el("div", { class: "section-label", text: "Quiz Decks" }));
    for (const deck of allDecks()) {
      const locked = (deck.minLevel || 1) > s.level;
      const stats = s.quizStats[deck.id];
      const card = UI.el("div", { class: `card quest-card ${locked ? "" : ""}`, style: locked ? "opacity:.5" : "" });
      card.appendChild(UI.el("div", { class: "quest-head" }, [
        UI.el("div", { class: "quest-ico", text: deck.icon }),
        UI.el("div", { class: "quest-body" }, [
          UI.el("div", { class: "quest-name", text: deck.name }),
          UI.el("div", { class: "quest-desc", text: deck.desc }),
          UI.el("div", { class: "quest-meta" }, [
            UI.el("span", { class: "chip", text: `${deck.questions.length} questions` }),
            stats ? UI.el("span", { class: "chip xp", text: `best ${stats.best}/${Math.min(QUIZ_LEN, deck.questions.length)}` }) : null,
            locked ? UI.el("span", { class: "chip", text: `🔒 Lv ${deck.minLevel}` }) : null,
          ]),
        ]),
      ]));
      if (!locked) {
        card.appendChild(UI.el("div", { class: "quest-actions" }, [
          UI.el("button", { class: "btn primary small", text: "Start quiz", onclick: () => startQuiz(deck) }),
        ]));
      }
      pane.appendChild(card);
    }

    pane.appendChild(UI.el("div", { class: "section-label", text: "Flashcards" }));
    for (const set of allFlashSets()) {
      const card = UI.el("div", { class: "card quest-card" });
      card.appendChild(UI.el("div", { class: "quest-head" }, [
        UI.el("div", { class: "quest-ico", text: set.icon }),
        UI.el("div", { class: "quest-body" }, [
          UI.el("div", { class: "quest-name", text: set.name }),
          UI.el("div", { class: "quest-meta" }, [
            UI.el("span", { class: "chip", text: `${set.cards.length} cards` }),
          ]),
        ]),
      ]));
      card.appendChild(UI.el("div", { class: "quest-actions" }, [
        UI.el("button", { class: "btn small", text: "Review", onclick: () => startFlashcards(set) }),
      ]));
      pane.appendChild(card);
    }
  }

  // ---------- glossary ----------
  function termById(id) {
    return LingoContent.terms.find(t => t.id === id);
  }

  function renderGlossary(initialFilter) {
    const pane = document.getElementById("pane-trainer");
    pane.innerHTML = "";
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "📖 Book Lingo" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Every phrase the books coin, in plain English." }));

    const search = UI.el("input", {
      class: "lingo-search", type: "search", placeholder: "🔎 Search terms… (e.g. baseline, sparker)",
      value: typeof initialFilter === "string" ? initialFilter : "",
    });
    search.addEventListener("input", () => drawList(search.value));
    pane.appendChild(search);

    const list = UI.el("div");
    pane.appendChild(list);
    pane.appendChild(UI.el("button", { class: "btn block", style: "margin-top:14px", text: "← Back to Training Grounds", onclick: render }));

    function drawList(q) {
      list.innerHTML = "";
      const needle = (q || "").trim().toLowerCase();
      const hits = LingoContent.terms.filter(t =>
        !needle ||
        t.term.toLowerCase().includes(needle) ||
        t.def.toLowerCase().includes(needle)
      );
      if (!hits.length) {
        list.appendChild(UI.el("div", { class: "card muted", text: "No terms match — try a shorter search." }));
        return;
      }
      for (const book of ["Captivate", "Cues"]) {
        const group = hits.filter(t => t.book === book)
          .slice().sort((a, b) => a.term.localeCompare(b.term));
        if (!group.length) continue;
        list.appendChild(UI.el("div", { class: "section-label", text: `${book === "Captivate" ? "💬" : "👁️"} From ${book}` }));
        for (const t of group) {
          list.appendChild(UI.el("div", { class: "lingo-row", onclick: () => termModal(t) }, [
            UI.el("span", { class: "lingo-emoji", text: t.emoji || "🔤" }),
            UI.el("div", { class: "lingo-body" }, [
              UI.el("div", { class: "lingo-term", text: t.term }),
              UI.el("div", { class: "lingo-def", text: t.def }),
            ]),
          ]));
        }
      }
    }
    drawList(search.value);
  }

  function termModal(t) {
    const wrap = UI.el("div", {}, [
      UI.el("h3", { text: `${t.emoji || "🔤"} ${t.term}` }),
      UI.el("div", { class: "quest-meta", style: "margin-top:6px" }, [
        UI.el("span", { class: "chip", text: `from ${t.book}` }),
      ]),
      UI.el("p", { class: "muted", style: "line-height:1.6; margin-top:10px", text: t.def }),
      UI.el("div", { class: "section-label", text: "In real life" }),
      UI.el("div", { class: "say-chip", text: t.example }),
    ]);
    const related = (t.related || []).map(termById).filter(Boolean);
    if (related.length) {
      wrap.appendChild(UI.el("div", { class: "section-label", text: "Related lingo" }));
      wrap.appendChild(UI.el("div", { class: "quest-meta" },
        related.map(r => UI.el("span", {
          class: "chip", style: "cursor:pointer", text: (r.emoji || "🔤") + " " + r.term,
          onclick: () => { UI.closeModal(); termModal(r); },
        }))
      ));
    }
    wrap.appendChild(UI.el("button", { class: "btn primary block", text: "Got it", style: "margin-top:14px", onclick: UI.closeModal }));
    UI.modal(wrap);
  }

  // ---------- quiz runner ----------
  function startQuiz(deck) {
    const qs = deck.questions.slice().sort(() => Math.random() - 0.5).slice(0, QUIZ_LEN);
    const run = { deck, qs, i: 0, correct: 0, results: [] };
    renderQuestion(run);
  }

  function renderQuestion(run) {
    const pane = document.getElementById("pane-trainer");
    pane.innerHTML = "";
    const q = run.qs[run.i];

    pane.appendChild(UI.el("h2", { class: "pane-title", text: run.deck.name }));
    const dots = UI.el("div", { class: "quiz-progress" },
      run.qs.map((_, idx) => {
        let cls = "quiz-dot";
        if (idx < run.i) cls += run.results[idx] ? " hit" : " miss";
        else if (idx === run.i) cls += " now";
        return UI.el("div", { class: cls });
      })
    );
    pane.appendChild(dots);
    pane.appendChild(UI.el("div", { class: "quiz-q", text: q.q }));

    // Shuffle options but remember which is correct
    const opts = q.options.map((text, idx) => ({ text, correct: idx === q.answer }))
      .sort(() => Math.random() - 0.5);

    let answered = false;
    const optEls = [];
    for (const opt of opts) {
      const btn = UI.el("button", {
        class: "quiz-opt", text: opt.text,
        onclick: () => {
          if (answered) return;
          answered = true;
          run.results.push(opt.correct);
          if (opt.correct) run.correct++;
          for (const [el2, o2] of optEls) {
            if (o2.correct) el2.classList.add("correct");
            else if (el2 === btn) el2.classList.add("wrong");
          }
          if (q.explain) pane.appendChild(UI.el("div", { class: "quiz-explain", text: q.explain }));
          pane.appendChild(UI.el("button", {
            class: "btn primary block", style: "margin-top:14px",
            text: run.i + 1 < run.qs.length ? "Next →" : "Finish",
            onclick: () => {
              run.i++;
              if (run.i < run.qs.length) renderQuestion(run);
              else finishQuiz(run);
            },
          }));
        },
      });
      optEls.push([btn, opt]);
      pane.appendChild(btn);
    }
  }

  function finishQuiz(run) {
    const s = Store.state;
    const total = run.qs.length;
    const stats = s.quizStats[run.deck.id] || { attempts: 0, best: 0, lastScore: 0 };
    stats.attempts++;
    stats.lastScore = run.correct;
    stats.best = Math.max(stats.best, run.correct);
    s.quizStats[run.deck.id] = stats;
    Store.save();

    let xp = run.correct * XP_PER_CORRECT;
    const perfect = run.correct === total;
    if (perfect) xp += XP_PERFECT_BONUS;
    const leveled = xp > 0 ? Store.addXp(xp, run.deck.skill) : false;

    if (perfect) Store.awardBadge("perfect-quiz") &&
      UI.badgeModal(QuestData.badges.find(b => b.id === "perfect-quiz"));

    const pane = document.getElementById("pane-trainer");
    pane.innerHTML = "";
    pane.appendChild(UI.el("div", { class: "card levelup" }, [
      UI.el("div", { class: "lv-big", text: perfect ? "🏆" : run.correct >= total * 0.6 ? "✨" : "📖" }),
      UI.el("div", { class: "lv-title", text: `${run.correct} / ${total}` }),
      UI.el("div", { class: "lv-sub", text: perfect ? "Perfect run! The science is sinking in." : "Every rep rewires the instinct. Run it again." }),
      UI.el("div", { class: "lv-sub", style: "color:var(--gold); font-weight:800", text: `+${xp} XP` }),
      UI.el("div", { style: "display:flex; gap:8px; margin-top:16px" }, [
        UI.el("button", { class: "btn primary", style: "flex:1", text: "Retry deck", onclick: () => startQuiz(run.deck) }),
        UI.el("button", { class: "btn", style: "flex:1", text: "All decks", onclick: render }),
      ]),
    ]));
    UI.refreshHud();
    if (leveled) UI.levelUpModal();
  }

  // ---------- flashcards ----------
  function startFlashcards(set) {
    const cards = set.cards.slice().sort(() => Math.random() - 0.5);
    let i = 0, flipped = false;

    function draw() {
      const pane = document.getElementById("pane-trainer");
      pane.innerHTML = "";
      pane.appendChild(UI.el("h2", { class: "pane-title", text: set.name }));
      pane.appendChild(UI.el("div", { class: "pane-sub", text: `Card ${i + 1} of ${cards.length} — tap to flip` }));
      const c = cards[i];
      const fc = UI.el("div", { class: "card flashcard", onclick: () => { flipped = !flipped; draw(); } }, [
        UI.el("div", { class: "fc-hint", text: flipped ? "answer" : "prompt" }),
        flipped
          ? UI.el("div", { class: "fc-back", text: c.back })
          : UI.el("div", { class: "fc-front", text: c.front }),
      ]);
      pane.appendChild(fc);
      pane.appendChild(UI.el("div", { style: "display:flex; gap:8px" }, [
        UI.el("button", {
          class: "btn", style: "flex:1", text: "← Prev", disabled: i === 0 ? "" : null,
          onclick: () => { if (i > 0) { i--; flipped = false; draw(); } },
        }),
        UI.el("button", {
          class: "btn primary", style: "flex:1",
          text: i + 1 < cards.length ? "Next →" : "Done",
          onclick: () => {
            if (i + 1 < cards.length) { i++; flipped = false; draw(); }
            else {
              const leveled = Store.addXp(15, set.skill);
              UI.xpToast(15, leveled);
              render();
            }
          },
        }),
      ]));
    }
    draw();
  }

  return { render, renderGlossary };
})();
