/* ============================================================
   analyzer.js — conversation transcript coach
   Calls the Claude API directly from the browser (personal use)
   with the user's own key, using structured JSON output graded
   against the Captivate / Cues frameworks.
   ============================================================ */

const Analyzer = (() => {

  const SCHEMA = {
    type: "object",
    additionalProperties: false,
    required: ["speakers", "cue_events", "dynamics", "emotional_arc", "coaching", "headline"],
    properties: {
      headline: { type: "string", description: "One-sentence overall read of how the user did, warm and direct." },
      speakers: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "is_user", "talk_share_pct", "warmth", "competence", "zone", "summary"],
          properties: {
            name: { type: "string" },
            is_user: { type: "boolean" },
            talk_share_pct: { type: "integer", description: "Approx % of total words spoken, 0-100" },
            warmth: { type: "integer", description: "Warmth signals 0-10 per the Cues charisma scale" },
            competence: { type: "integer", description: "Competence signals 0-10 per the Cues charisma scale" },
            zone: { type: "string", enum: ["charisma_zone", "warm_but_soft", "competent_but_cold", "danger_zone"] },
            summary: { type: "string" }
          }
        }
      },
      cue_events: {
        type: "array",
        description: "Notable verbal cues detected, max ~10, prioritize the user's",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["speaker", "polarity", "cue_name", "quote", "note"],
          properties: {
            speaker: { type: "string" },
            polarity: { type: "string", enum: ["positive", "negative"] },
            cue_name: { type: "string", description: "Named cue/technique from the books, e.g. 'conversation sparker', 'uptalk', 'distancing language', 'story stacking', 'dead-end question'" },
            quote: { type: "string", description: "Short verbatim quote from the transcript" },
            note: { type: "string" }
          }
        }
      },
      dynamics: {
        type: "object",
        additionalProperties: false,
        required: ["question_balance", "spark_count", "dead_end_count", "threads_dropped", "note"],
        properties: {
          question_balance: { type: "string", description: "Who asked more / better questions, one sentence" },
          spark_count: { type: "integer", description: "How many novelty/dopamine-triggering openers or topics the user used" },
          dead_end_count: { type: "integer", description: "Autopilot questions or thread-killers by the user" },
          threads_dropped: { type: "integer", description: "Conversational threads the other person offered that the user did not pick up" },
          note: { type: "string" }
        }
      },
      emotional_arc: {
        type: "array",
        description: "3-5 phases of the conversation's emotional temperature",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["phase", "tone", "note"],
          properties: {
            phase: { type: "string", description: "e.g. 'opening', 'mid', 'peak', 'close'" },
            tone: { type: "string", description: "1-3 word emotional label" },
            note: { type: "string" }
          }
        }
      },
      coaching: {
        type: "array",
        description: "Top 3 concrete actions, each tied to a named book technique",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["technique", "book", "advice"],
          properties: {
            technique: { type: "string" },
            book: { type: "string", enum: ["Captivate", "Cues"] },
            advice: { type: "string", description: "Specific, doable next time — reference what actually happened" }
          }
        }
      }
    }
  };

  function systemPrompt() {
    return [
      "You are a social-skills coach whose entire methodology comes from Vanessa Van Edwards' books 'Captivate' and 'Cues'.",
      "You will receive a transcript of a real recorded conversation (all parties knew they were recorded). Analyze it strictly through the books' frameworks:",
      "",
      "CUES framework: charisma = warmth signals (likability, approachability: warm words, affirmations, 'we' language, humor, vulnerability, emotional acknowledgment) + competence signals (capability, credibility: precise language, downward inflections, confident claims, no excessive hedging). Danger-zone verbal cues: uptalk on statements, vocal-fry-style trailing off written as '...', excessive softeners/hedges ('just', 'kind of', 'sorry but'), distancing language, self-deprecation loops, question-inflected statements.",
      "CAPTIVATE framework: conversation sparkers vs autopilot scripts ('what do you do?' = autopilot); dopamine of novelty; the Highlight (making the other person feel like the most interesting person in the room); follow the thread — pick up hooks the other person offers; story stacking (trade boomerang facts for stories); big talk over small talk; ask follow-up questions that dig for values and passions; end on a high note.",
      "",
      "Since this is TEXT ONLY, judge only verbal/linguistic cues — never invent body-language or vocal-tone observations. When quoting, quote exactly.",
      "Score each speaker's warmth and competence 0-10 from their verbal cues. zone: both >=6 -> charisma_zone; warmth high/competence low -> warm_but_soft; competence high/warmth low -> competent_but_cold; both low -> danger_zone.",
      "Be an encouraging but honest coach: name what the user did well with the same rigor as what to fix. Coaching must cite the named technique and reference concrete moments from this transcript."
    ].join("\n");
  }

  async function analyze(transcript, userName) {
    const { apiKey, model } = Store.state.settings;
    const body = {
      model: model || "claude-opus-5",
      max_tokens: 8000,
      system: systemPrompt(),
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [{
        role: "user",
        content:
          `The user being coached is the speaker named/labeled: "${userName}". ` +
          `If speaker labels are missing, infer turns as best you can and set is_user on your best guess for "${userName}".\n\n` +
          `TRANSCRIPT:\n${transcript}`
      }]
    };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      let msg = `API error ${res.status}`;
      try { msg = (await res.json()).error?.message || msg; } catch (_) {}
      throw new Error(msg);
    }
    const data = await res.json();
    if (data.stop_reason === "refusal") throw new Error("The model declined to analyze this transcript.");
    const textBlock = (data.content || []).find(b => b.type === "text");
    if (!textBlock) throw new Error("No analysis returned.");
    return JSON.parse(textBlock.text);
  }

  // ---------- rendering ----------
  function render() {
    const pane = document.getElementById("pane-analyzer");
    const s = Store.state;
    pane.innerHTML = "";
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "Conversation Analyzer" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Paste a transcript from a recorded conversation. Get scored on the Cues charisma scale and coached with Captivate techniques. +40 XP per analysis." }));

    if (!s.settings.apiKey) {
      pane.appendChild(UI.el("div", { class: "card" }, [
        UI.el("h3", { text: "🔑 API key needed" }),
        UI.el("div", { class: "muted", text: "Add your Claude API key in Settings to enable the analyzer." }),
        UI.el("button", { class: "btn primary", style: "margin-top:10px", text: "Open Settings", onclick: () => App.show("settings") }),
      ]));
    }

    const nameInput = UI.el("input", { type: "text", placeholder: "e.g. Preston, or SPEAKER_1", value: s.lastUserName || "" });
    const ta = UI.el("textarea", {
      class: "analyzer-input",
      placeholder: "Paste transcript here…\n\nWorks best with speaker labels, e.g.:\nPreston: hey! how'd the show go?\nGuest: honestly better than I expected…"
    });

    const goBtn = UI.el("button", {
      class: "btn primary block", style: "margin-top:10px", text: "🔍 Analyze conversation",
      onclick: async () => {
        const transcript = ta.value.trim();
        const userName = nameInput.value.trim() || "the first speaker";
        if (!transcript) { UI.toast("Paste a transcript first"); return; }
        if (!s.settings.apiKey) { UI.toast("Add your API key in Settings"); return; }
        if (transcript.length > 400000) { UI.toast("Transcript too long — trim it down"); return; }

        s.lastUserName = userName; Store.save();
        resultWrap.innerHTML = "";
        resultWrap.appendChild(UI.el("div", { class: "card", style: "text-align:center" }, [
          UI.el("div", { class: "spinner" }),
          UI.el("div", { class: "muted", text: "Coach is reading the tape…" }),
        ]));
        goBtn.disabled = true;
        try {
          const result = await analyze(transcript, userName);
          renderResult(resultWrap, result);
          // Save a small summary + award XP
          const me = result.speakers.find(x => x.is_user) || result.speakers[0];
          s.analyses.push({
            at: Date.now(),
            headline: result.headline,
            warmth: me?.warmth, competence: me?.competence, zone: me?.zone,
          });
          if (s.analyses.length > 50) s.analyses = s.analyses.slice(-50);
          Store.save();
          const leveled = Store.addXp(40, "analyzer");
          UI.xpToast(40, leveled);
          if (Store.awardBadge("first-analysis")) {
            const b = QuestData.badges.find(x => x.id === "first-analysis");
            if (b) UI.badgeModal(b);
          }
          Quests.checkBadges();
        } catch (err) {
          resultWrap.innerHTML = "";
          resultWrap.appendChild(UI.el("div", { class: "card", style: "border-color:var(--danger)" }, [
            UI.el("h3", { text: "😵 Analysis failed" }),
            UI.el("div", { class: "muted", text: String(err.message || err) }),
          ]));
        } finally {
          goBtn.disabled = false;
        }
      },
    });

    pane.appendChild(UI.el("div", { class: "card" }, [
      UI.el("div", { class: "field" }, [UI.el("label", { text: "Which speaker are you?" }), nameInput]),
      UI.el("div", { class: "field", style: "margin-bottom:0" }, [UI.el("label", { text: "Transcript" }), ta]),
      goBtn,
    ]));

    const resultWrap = UI.el("div");
    pane.appendChild(resultWrap);

    // Progress over time
    if (s.analyses.length > 1) {
      pane.appendChild(UI.el("div", { class: "section-label", text: "Your last analyses" }));
      const recent = s.analyses.slice(-5).reverse();
      for (const a of recent) {
        pane.appendChild(UI.el("div", { class: "card" }, [
          UI.el("div", { class: "muted", style: "font-size:.75rem", text: new Date(a.at).toLocaleString() }),
          UI.el("div", { style: "font-size:.9rem; margin-top:4px", text: a.headline }),
          (a.warmth != null) ? UI.el("div", { class: "quest-meta", style: "margin-top:8px" }, [
            UI.el("span", { class: "chip warm", text: `Warmth ${a.warmth}/10` }),
            UI.el("span", { class: "chip comp", text: `Competence ${a.competence}/10` }),
            UI.el("span", { class: "chip", text: zoneLabel(a.zone) }),
          ]) : null,
        ]));
      }
    }
  }

  function zoneLabel(zone) {
    return {
      charisma_zone: "⭐ Charisma Zone",
      warm_but_soft: "🧸 Warm but soft",
      competent_but_cold: "🧊 Competent but cold",
      danger_zone: "⚠️ Danger zone",
    }[zone] || zone || "";
  }

  function renderResult(wrap, r) {
    wrap.innerHTML = "";

    // Headline
    wrap.appendChild(UI.el("div", { class: "card daily-spark" }, [
      UI.el("div", { class: "spark-label", text: "Coach's verdict" }),
      UI.el("div", { class: "spark-text", text: r.headline }),
    ]));

    // Speakers
    wrap.appendChild(UI.el("div", { class: "section-label", text: "Charisma scale (Cues)" }));
    for (const sp of r.speakers) {
      const card = UI.el("div", { class: `card ${sp.is_user ? "speaker-card" : ""}` }, [
        UI.el("h3", { text: `${sp.is_user ? "🫵 " : ""}${sp.name} — ${zoneLabel(sp.zone)}` }),
        UI.meter("Warmth", sp.warmth, 10, "warm"),
        UI.meter("Competence", sp.competence, 10, "comp"),
        UI.el("div", { class: "muted", style: "margin-top:6px", text: sp.summary }),
        UI.el("div", { class: "quest-meta", style: "margin-top:8px" }, [
          UI.el("span", { class: "chip", text: `~${sp.talk_share_pct}% of the talking` }),
        ]),
      ]);
      wrap.appendChild(card);
    }

    // Dynamics
    const d = r.dynamics;
    wrap.appendChild(UI.el("div", { class: "section-label", text: "Conversation dynamics (Captivate)" }));
    wrap.appendChild(UI.el("div", { class: "card" }, [
      UI.el("div", { class: "stat-grid" }, [
        miniStat(d.spark_count, "sparks used"),
        miniStat(d.dead_end_count, "dead-end Qs"),
        miniStat(d.threads_dropped, "threads dropped"),
      ]),
      UI.el("div", { class: "muted", style: "margin-top:10px", text: d.question_balance }),
      UI.el("div", { class: "muted", style: "margin-top:6px", text: d.note }),
    ]));

    // Emotional arc
    wrap.appendChild(UI.el("div", { class: "section-label", text: "Emotional arc" }));
    const arcCard = UI.el("div", { class: "card" });
    for (const ph of r.emotional_arc) {
      arcCard.appendChild(UI.el("div", { class: "cue-hit" }, [
        UI.el("span", { class: "cue-tag", text: ph.phase }),
        UI.el("span", {}, [
          UI.el("strong", { text: ph.tone + " — " }),
          UI.el("span", { class: "cue-quote", text: ph.note }),
        ]),
      ]));
    }
    wrap.appendChild(arcCard);

    // Cue events
    wrap.appendChild(UI.el("div", { class: "section-label", text: "Cues caught on tape" }));
    const cueCard = UI.el("div", { class: "card" });
    for (const c of r.cue_events) {
      cueCard.appendChild(UI.el("div", { class: `cue-hit ${c.polarity}` }, [
        UI.el("span", { class: "cue-tag", text: c.polarity === "positive" ? "✔" : "✘" }),
        UI.el("span", {}, [
          UI.el("strong", { text: `${c.speaker} · ${c.cue_name}: ` }),
          UI.el("span", { class: "cue-quote", text: `"${c.quote}" ` }),
          UI.el("span", { text: "— " + c.note }),
        ]),
      ]));
    }
    wrap.appendChild(cueCard);

    // Coaching
    wrap.appendChild(UI.el("div", { class: "section-label", text: "Your next 3 moves" }));
    r.coaching.forEach((c, i) => {
      wrap.appendChild(UI.el("div", { class: "card quest-card" }, [
        UI.el("div", { class: "quest-head" }, [
          UI.el("div", { class: "quest-ico", text: ["1️⃣", "2️⃣", "3️⃣"][i] || "▶️" }),
          UI.el("div", { class: "quest-body" }, [
            UI.el("div", { class: "quest-name", text: c.technique }),
            UI.el("div", { class: "quest-desc", text: c.advice }),
            UI.el("div", { class: "quest-meta" }, [
              UI.el("span", { class: "chip", text: `📖 ${c.book}` }),
            ]),
          ]),
        ]),
      ]));
    });
  }

  function miniStat(num, label) {
    return UI.el("div", { class: "stat-tile" }, [
      UI.el("div", { class: "st-num", text: String(num ?? "–") }),
      UI.el("div", { class: "st-label", text: label }),
    ]);
  }

  return { render };
})();
