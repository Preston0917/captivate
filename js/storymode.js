/* ============================================================
   storymode.js — "The Long Night in Nocturne"
   Story Mode engine: journey → regions → catches → gyms → Fade.

   Design law: nothing in here grows because you tapped something
   in the app. A Neon's stage is DERIVED from real-world reps —
   skill XP + distinct completed field quests — and never stored.

   Global: StoryMode  (var, not const — must survive re-eval)
   Public API (hard contract, called by app.js + home.js):
     StoryMode.render()  → renders into #pane-story
     StoryMode.teaser()  → one-line string for the Home card
   ============================================================ */

var StoryMode = (() => {

  /* ---------- module-local view state (never persisted logic) ---------- */
  let view = "journey";       // "journey" | "region" | "dex"
  let openRegion = null;      // region id when view === "region"

  /* ---------- modal queue (catch / evolution / beat / badge) ----------
     Story moments can stack (catch → evolution → badge), so they play one
     at a time. A level-up earned mid-chain is held back and shown at the
     end, otherwise UI's own level-up modal would overwrite the story one. */
  let modalQueue = [];
  let modalShowing = false;
  let pendingLevelUp = false;
  let rendering = false;

  function modalOpen() {
    const layer = document.getElementById("modal-layer");
    return !!layer && !layer.classList.contains("hidden");
  }

  function pushModal(build) {
    if (modalShowing && !modalOpen()) modalShowing = false;   // someone closed it on us
    modalQueue.push(build);
    if (!modalShowing) nextModal();
  }

  function nextModal() {
    const build = modalQueue.shift();
    if (!build) {
      modalShowing = false;
      UI.closeModal();
      redraw();
      return;
    }
    modalShowing = true;
    UI.modal(build(nextModal), { sticky: true });
    setTimeout(watchModal, 500);
  }

  // If anything outside this module closes the layer mid-chain, resume.
  function watchModal() {
    if (!modalShowing) return;
    if (!modalOpen()) { modalShowing = false; nextModal(); return; }
    setTimeout(watchModal, 500);
  }

  // Every XP award in Story Mode goes through here.
  function awardXp(amount, skillId) {
    const leveled = Store.addXp(amount, skillId);
    if (leveled && (modalShowing || modalQueue.length || rendering)) {
      pendingLevelUp = true;
      UI.xpToast(amount, false);
    } else {
      UI.xpToast(amount, leveled);
    }
  }

  function flushLevelUp() {
    if (pendingLevelUp && !modalShowing && !modalQueue.length) {
      pendingLevelUp = false;
      UI.levelUpModal();
    }
  }

  /* ============================================================
     STATE
     ============================================================ */

  function st() {
    const s = Store.state;
    if (!s.story || typeof s.story !== "object") s.story = {};
    const d = s.story;
    d.v = 1;
    if (typeof d.started !== "boolean") d.started = false;
    if (!d.catches || typeof d.catches !== "object") d.catches = {};
    if (!Array.isArray(d.evolutionsSeen)) d.evolutionsSeen = [];
    if (!Array.isArray(d.regionsCompleted)) d.regionsCompleted = [];
    if (!Array.isArray(d.badges)) d.badges = [];
    if (!d.gyms || typeof d.gyms !== "object") d.gyms = {};
    if (!d.rivals || typeof d.rivals !== "object") d.rivals = {};
    if (!Array.isArray(d.beatsRead)) d.beatsRead = [];
    if (typeof d.view !== "string") d.view = "journey";
    return d;
  }

  function ready() {
    return typeof StoryData !== "undefined" && StoryData && Array.isArray(StoryData.neons);
  }

  /* ---------- lookups ---------- */
  const neonById = id => StoryData.neons.find(n => n.id === id);
  const regionById = id => StoryData.regions.find(r => r.id === id);
  const gymById = id => StoryData.gyms.find(g => g.id === id);
  const gymOfRegion = rid => StoryData.gyms.find(g => g.region === rid);
  const rivalById = id => StoryData.rival.encounters.find(r => r.id === id);
  const badgeById = id => StoryData.badges.find(b => b.id === id);

  let _skillIndex = null;
  function skillMeta(id) {
    if (!_skillIndex) {
      _skillIndex = {};
      try {
        const all = CaptivateContent.skills.concat(CuesContent.skills);
        for (const sk of all) _skillIndex[sk.id] = sk;
      } catch (e) { /* content not loaded — fall back to ids */ }
    }
    return _skillIndex[id] || { id: id, name: id, icon: "•" };
  }

  // "Control (Social Game Plan)" → "Control"
  function skillShort(id) {
    const n = skillMeta(id).name || id;
    return n.split(" (")[0];
  }

  /* ============================================================
     DERIVED PROGRESS  (real-world reps only)
     ============================================================ */

  function skillXpFor(skillId) {
    const m = Store.state.skillXp || {};
    return m[skillId] || 0;
  }

  // Distinct completed field quests in a skill — the anti-grind clamp.
  function questCountFor(skillId) {
    const log = Store.state.questLog || {};
    let n = 0;
    for (const qid of Object.keys(log)) {
      let q = null;
      try { q = Quests.questById(qid); } catch (e) { q = null; }
      if (q && q.skill === skillId) n++;
    }
    return n;
  }

  function hasBadge(badgeId) {
    if (!badgeId) return true;
    const d = st();
    return d.badges.indexOf(badgeId) >= 0 || (Store.state.badges || []).indexOf(badgeId) >= 0;
  }

  function stageOf(neon) {
    if (!neon || !neon.evo) return 1;
    const sx = skillXpFor(neon.skill);
    const qc = questCountFor(neon.skill);
    const s3 = neon.evo.s3, s2 = neon.evo.s2;
    if (sx >= s3.xp && qc >= s3.quests && hasBadge(s3.badge)) return 3;
    if (sx >= s2.xp && qc >= s2.quests) return 2;
    return 1;
  }

  const isCaught = id => !!st().catches[id];
  const totalCaught = () => StoryData.neons.filter(n => isCaught(n.id)).length;
  const caughtInRegion = rid => regionById(rid).neonIds.filter(isCaught).length;
  const regionUnlocked = rid => !!st().rivals[regionById(rid).unlockRival];
  const regionComplete = rid => st().regionsCompleted.indexOf(rid) >= 0;
  const postGame = () => st().beatsRead.indexOf("beat-afterhours") >= 0;

  function gymStateFor(gymId) {
    const d = st();
    let g = d.gyms[gymId];
    if (!g || typeof g !== "object" || !Array.isArray(g.parts) || g.parts.length !== 3) {
      g = { parts: [false, false, false], cleared: !!(g && g.cleared), at: (g && g.at) || null };
      d.gyms[gymId] = g;
    }
    return g;
  }

  const gymUnlocked = gym => caughtInRegion(gym.region) >= StoryData.gymUnlockCatches;

  /* ---------- the unlock chain ---------- */
  function stepDone(step) {
    const d = st();
    if (step.kind === "beat") return d.started;
    if (step.kind === "rival") return !!d.rivals[step.id];
    if (step.kind === "region") return regionComplete(step.id);
    if (step.kind === "ending") return postGame();
    return true;
  }

  function activeStep() {
    for (const step of StoryData.order) if (!stepDone(step)) return step;
    return null;
  }

  function unlockedRegions() {
    return StoryData.regions.filter(r => regionUnlocked(r.id));
  }

  function chapterTitle() {
    const step = activeStep();
    if (!step) return "After Hours";
    if (step.kind === "beat") return "Prologue";
    if (step.kind === "rival") return "Fade — " + rivalById(step.id).title;
    if (step.kind === "region") return regionById(step.id).name;
    if (step.kind === "ending") return "The Long Night";
    return "Nocturne";
  }

  /* ============================================================
     MUTATIONS  (every one saves; XP always via Store.addXp)
     ============================================================ */

  function readBeat(beatId) {
    const d = st();
    if (!beatId || !StoryData.beats[beatId]) return false;
    if (d.beatsRead.indexOf(beatId) >= 0) return false;
    d.beatsRead.push(beatId);
    Store.save();
    // Beat XP carries NO skillId on purpose: reading can never move a creature.
    awardXp(StoryData.beatXp);
    return true;
  }

  function catchNeon(id) {
    const d = st();
    const n = neonById(id);
    if (!n || d.catches[id]) return;
    d.catches[id] = { at: Date.now(), seenStage: 1 };
    Store.save();
    awardXp(StoryData.catchXp, n.skill);
    pushModal(done => catchModalNode(n, done));
  }

  function checkEvolutions() {
    const d = st();
    for (const n of StoryData.neons) {
      const c = d.catches[n.id];
      if (!c) continue;
      const stage = stageOf(n);
      const seen = c.seenStage || 1;
      if (stage > seen) {
        c.seenStage = stage;
        Store.save();
        for (let s = seen + 1; s <= stage; s++) queueEvolution(n, s);
      }
    }
  }

  function queueEvolution(neon, stage) {
    const d = st();
    const key = neon.id + ":" + stage;
    if (d.evolutionsSeen.indexOf(key) >= 0) return;
    d.evolutionsSeen.push(key);
    Store.save();
    const xp = (StoryData.evoXp && StoryData.evoXp[stage]) || 25;
    awardXp(xp, neon.skill);
    pushModal(done => evolutionModalNode(neon, stage, done));
  }

  function clearRung(rivalId, rungKey) {
    const d = st();
    const rv = rivalById(rivalId);
    if (!rv || d.rivals[rivalId]) return;
    const rung = rv.rungs.find(r => r.key === rungKey);
    if (!rung) return;
    d.rivals[rivalId] = { rung: rungKey, at: Date.now() };
    Store.save();
    awardXp(rung.xp, rv.skill);
    readBeat(rv.winBeat);
    pushModal(done => beatModalNode(rv.winBeat, "Keep going", done));
  }

  function clearAfterHoursRung(rungKey) {
    const d = st();
    const id = "ah-" + Store.todayKey();
    if (d.rivals[id]) return;
    const ah = StoryData.afterHours;
    const rung = ah.rungs.find(r => r.key === rungKey);
    if (!rung) return;
    d.rivals[id] = { rung: rungKey, at: Date.now() };
    Store.save();
    awardXp(rung.xp, ah.skill);
    UI.toast("Logged. Fade takes the night off.");
    redraw();
  }

  function toggleGymPart(gymId, i) {
    const g = gymStateFor(gymId);
    if (g.cleared) return;
    g.parts[i] = !g.parts[i];
    Store.save();
    if (g.parts.every(Boolean)) claimBadge(gymId);
    else redraw();
  }

  function claimBadge(gymId) {
    const d = st();
    const gym = gymById(gymId);
    const g = gymStateFor(gymId);
    if (!gym || g.cleared) return;
    g.parts = [true, true, true];
    g.cleared = true;
    g.at = Date.now();
    if (d.badges.indexOf(gym.badge) < 0) d.badges.push(gym.badge);
    if (d.regionsCompleted.indexOf(gym.region) < 0) d.regionsCompleted.push(gym.region);
    Store.save();
    Store.awardBadge(gym.badge);                       // counts in the global badge list
    awardXp(gym.rewardXp, gym.rewardSkill);
    readBeat(gym.winBeat);
    view = "journey";
    openRegion = null;
    pushModal(done => beatModalNode(gym.winBeat, "…", done));
    pushModal(done => badgeModalNode(badgeById(gym.badge), done));
  }

  /* ============================================================
     SMALL VIEW HELPERS
     ============================================================ */

  const E = UI.el;

  function beatParas(beatId, cls) {
    const text = StoryData.beats[beatId] || "";
    return E("div", { class: cls || "story-beat" },
      text.split("\n").map(p => E("p", { text: p })));
  }

  function chip(text, cls) {
    return E("span", { class: "chip " + (cls || ""), text: text });
  }

  function skillChip(skillId) {
    const sk = skillMeta(skillId);
    return chip(`${sk.icon || "•"} ${skillShort(skillId)}`, "comp");
  }

  function stageDots(stage, caught) {
    return E("div", { class: "neon-dots" }, [1, 2, 3].map(i =>
      E("span", { class: "ndot " + (caught && i <= stage ? "lit" : "") })));
  }

  /* ---------- modals ---------- */

  function catchModalNode(n, done) {
    const s2 = n.evo.s2;
    return E("div", { class: "levelup" }, [
      E("div", { class: "lv-big", text: n.emoji }),
      E("div", { class: "lv-title", text: `Caught: ${n.stages[0].name}!` }),
      E("div", { class: "lv-sub", text: n.stages[0].flavor }),
      E("div", { class: "story-note", text:
        `Evolves at ${s2.xp} ${n.skill} XP and ${s2.quests} completed ${skillShort(n.skill)} quests — earned out there, not in here.` }),
      E("button", { class: "btn primary block", style: "margin-top:16px", text: "Into the Cuedex it goes", onclick: done }),
    ]);
  }

  function evolutionModalNode(n, stage, done) {
    const from = n.stages[stage - 2];
    const to = n.stages[stage - 1];
    const qc = questCountFor(n.skill);
    return E("div", { class: "levelup" }, [
      E("div", { class: "lv-big story-evo-glyph", text: n.emoji }),
      E("div", { class: "lv-title", text: `${from.name} evolved into ${to.name}!` }),
      E("div", { class: "lv-sub", text: to.flavor }),
      E("div", { class: "story-note", text:
        `${qc} ${skillShort(n.skill)} quest${qc === 1 ? "" : "s"}. None of them happened in here.` }),
      E("button", { class: "btn primary block", style: "margin-top:16px", text: "Nice", onclick: done }),
    ]);
  }

  function badgeModalNode(b, done) {
    if (!b) return E("div", {}, [E("button", { class: "btn primary block", text: "Close", onclick: done })]);
    return E("div", { class: "levelup" }, [
      E("div", { class: "lv-big", text: b.emoji }),
      E("div", { class: "lv-title", text: `Badge earned: ${b.name}` }),
      E("div", { class: "lv-sub", text: b.desc }),
      E("button", { class: "btn primary block", style: "margin-top:16px", text: "Pin it on", onclick: done }),
    ]);
  }

  function beatModalNode(beatId, btnText, done) {
    return E("div", {}, [
      E("h3", { text: StoryData.beatTitles[beatId] || "Story" }),
      beatParas(beatId),
      E("button", { class: "btn primary block", style: "margin-top:14px", text: btnText || "Close",
        onclick: done || UI.closeModal }),
    ]);
  }

  function openBeatModal(beatId) {
    UI.modal(E("div", {}, [
      E("h3", { text: StoryData.beatTitles[beatId] || "Story" }),
      beatParas(beatId),
      E("button", { class: "btn ghost block", style: "margin-top:14px", text: "Close", onclick: UI.closeModal }),
    ]));
  }

  function openStoryLog() {
    const d = st();
    const wrap = E("div", {}, [
      E("h3", { text: "Story so far" }),
      E("div", { class: "muted", style: "font-size:.8rem; margin-bottom:8px",
        text: `${d.beatsRead.length} of ${Object.keys(StoryData.beats).length} pages written.` }),
    ]);
    let any = false;
    for (const id of Object.keys(StoryData.beats)) {
      if (d.beatsRead.indexOf(id) < 0) continue;
      any = true;
      wrap.appendChild(E("div", { class: "section-label", text: StoryData.beatTitles[id] || id }));
      wrap.appendChild(beatParas(id, "story-beat log"));
    }
    if (!any) wrap.appendChild(E("div", { class: "muted", text: "Nothing written yet. Open the guide and start the night." }));
    wrap.appendChild(E("button", { class: "btn primary block", style: "margin-top:14px", text: "Close", onclick: UI.closeModal }));
    UI.modal(wrap);
  }

  /* ============================================================
     NEON CARDS + CUEDEX
     ============================================================ */

  function nextThreshold(n, stage) {
    if (stage >= 3) return null;
    return stage === 1 ? n.evo.s2 : n.evo.s3;
  }

  function neonMeters(n, stage) {
    const t = nextThreshold(n, stage);
    if (!t) return E("div", { class: "story-note", text: "Final form. This one is finished — the reps aren't." });
    const wrap = E("div", { style: "margin-top:10px" }, [
      UI.meter(`${skillShort(n.skill)} XP`, Math.min(skillXpFor(n.skill), t.xp), t.xp, "gold"),
      UI.meter(`${skillShort(n.skill)} quests`, Math.min(questCountFor(n.skill), t.quests), t.quests, "comp"),
    ]);
    if (t.badge && !hasBadge(t.badge)) {
      const b = badgeById(t.badge);
      wrap.appendChild(E("div", { class: "story-note", text: `Final form also needs the ${b ? b.name : t.badge} — beat the gym for it.` }));
    }
    return wrap;
  }

  function neonCard(n) {
    const caught = isCaught(n.id);
    const stage = caught ? stageOf(n) : 1;
    const form = n.stages[stage - 1];
    const card = E("div", { class: "card neon-card " + (caught ? "caught" : "wild") });

    card.appendChild(E("div", { class: "neon-head" }, [
      E("div", { class: "neon-emoji " + (caught ? "" : "sil"), text: n.emoji }),
      E("div", { class: "neon-id" }, [
        E("div", { class: "neon-name", text: caught ? form.name : "???" }),
        E("div", { class: "neon-line", text: caught ? `${n.line} line · stage ${stage} of 3` : `unrecorded · ${regionById(n.region).name}` }),
        E("div", { class: "quest-meta" }, [skillChip(n.skill), caught ? null : chip("wild", "warm")]),
      ]),
      stageDots(stage, caught),
    ]));

    const body = E("div", { class: "neon-body" });
    if (caught) {
      body.appendChild(E("div", { class: "neon-flavor", text: form.flavor }));
      body.appendChild(neonMeters(n, stage));
      body.appendChild(E("button", {
        class: "btn ghost small", style: "margin-top:10px", text: "Field notes",
        onclick: () => openNeonSheet(n.id),
      }));
    } else {
      body.appendChild(E("div", { class: "section-label", style: "margin-top:10px", text: "The technique" }));
      body.appendChild(E("div", { class: "neon-technique", text: n.technique }));
      body.appendChild(E("div", { class: "section-label", text: "To catch it" }));
      body.appendChild(E("div", { class: "neon-catch", text: n.catch }));
      body.appendChild(E("div", { class: "quest-actions" }, [
        E("button", { class: "btn primary small", text: "I did it ✔", onclick: () => catchNeon(n.id) }),
        E("button", {
          class: "btn ghost small", text: "Not yet",
          onclick: () => {
            body.style.display = "none";
            card.appendChild(E("button", {
              class: "btn ghost small story-reopen", text: "Show this one again",
              onclick: () => { body.style.display = ""; card.querySelectorAll(".story-reopen").forEach(b => b.remove()); },
            }));
          },
        }),
      ]));
    }
    card.appendChild(body);
    return card;
  }

  function openNeonSheet(id) {
    const n = neonById(id);
    if (!n) return;
    const caught = isCaught(n.id);
    const stage = caught ? stageOf(n) : 1;
    const r = regionById(n.region);

    const wrap = E("div", { class: "dex-sheet" }, [
      E("div", { class: "dex-sheet-head" }, [
        E("div", { class: "neon-emoji big " + (caught ? "" : "sil"), text: n.emoji }),
        E("div", {}, [
          E("h3", { text: caught ? n.line : "???" }),
          E("div", { class: "quest-meta" }, [
            chip(`${r.emoji} ${r.name}`),
            skillChip(n.skill),
            caught ? chip(`stage ${stage}/3`, "xp") : chip("uncaught", "warm"),
          ]),
        ]),
      ]),
      E("div", { class: "section-label", text: "The technique" }),
      E("div", { class: "neon-technique", text: n.technique }),
    ]);

    if (caught) {
      wrap.appendChild(E("div", { class: "section-label", text: "Forms" }));
      n.stages.forEach((s, i) => {
        wrap.appendChild(E("div", { class: "dex-form " + (i + 1 === stage ? "now" : (i + 1 < stage ? "past" : "")) }, [
          E("div", { class: "df-name", text: `${i + 1}. ${s.name}` + (i + 1 === stage ? "  ← now" : "") }),
          E("div", { class: "df-flavor", text: s.flavor }),
        ]));
      });
      wrap.appendChild(E("div", { class: "section-label", text: "Next form" }));
      wrap.appendChild(neonMeters(n, stage));
      wrap.appendChild(E("div", { class: "section-label", text: "How you caught it" }));
      wrap.appendChild(E("div", { class: "neon-catch", text: n.catch }));
    } else {
      wrap.appendChild(E("div", { class: "section-label", text: "To catch it" }));
      wrap.appendChild(E("div", { class: "neon-catch", text: n.catch }));
      wrap.appendChild(E("div", { class: "story-note", text: "Its three forms stay blank until you've met it out there." }));
      wrap.appendChild(E("button", {
        class: "btn primary block", style: "margin-top:12px", text: "I did it ✔",
        onclick: () => { UI.closeModal(); catchNeon(n.id); },
      }));
    }

    wrap.appendChild(E("button", { class: "btn ghost block", style: "margin-top:10px", text: "Close", onclick: UI.closeModal }));
    UI.modal(wrap);
  }

  function viewDex() {
    view = "dex";
    redraw();
  }

  function renderDex(pane) {
    pane.appendChild(E("button", { class: "btn ghost small story-back", text: "← The journey", onclick: () => { view = "journey"; redraw(); } }));
    pane.appendChild(E("h2", { class: "pane-title", text: "📓 The Cuedex" }));
    pane.appendChild(E("div", { class: "pane-sub", text: `${totalCaught()} of ${StoryData.neons.length} pages filled in. Every one of them was filled in out there.` }));

    for (const r of StoryData.regions) {
      const locked = !regionUnlocked(r.id);
      pane.appendChild(E("div", { class: "dex-band" }, [
        E("span", { class: "dex-band-name", text: `${r.emoji} ${r.name}` }),
        E("span", { class: "dex-band-count", text: locked ? "locked" : `${caughtInRegion(r.id)}/6` }),
      ]));
      const grid = E("div", { class: "dex-grid" });
      for (const nid of r.neonIds) {
        const n = neonById(nid);
        if (!n) continue;
        const caught = isCaught(n.id);
        const stage = caught ? stageOf(n) : 1;
        grid.appendChild(E("button", {
          class: "dex-tile " + (caught ? "caught" : "uncaught"),
          title: caught ? n.stages[stage - 1].name : "Uncaught",
          onclick: () => openNeonSheet(n.id),
        }, [
          E("div", { class: "dex-emoji " + (caught ? "" : "sil"), text: n.emoji }),
          E("div", { class: "dex-name", text: caught ? n.stages[stage - 1].name : "???" }),
          stageDots(stage, caught),
          locked && !caught ? E("div", { class: "dex-lock", text: `${r.name} · locked` }) : null,
        ]));
      }
      pane.appendChild(grid);
    }
  }

  /* ============================================================
     REGION VIEW
     ============================================================ */

  function viewRegion(id) {
    openRegion = id;
    view = "region";
    redraw();
  }

  function gymCard(gym, region) {
    const g = gymStateFor(gym.id);
    const caught = caughtInRegion(region.id);
    const need = StoryData.gymUnlockCatches;

    if (!gymUnlocked(gym)) {
      return E("div", { class: "card gym-card locked" }, [
        E("h3", { text: `🔒 ${gym.name}` }),
        E("div", { class: "muted", text: `Catch ${need} of ${region.neonIds.length} ${region.name} Neons to open the gym. You have ${caught}.` }),
        UI.meter("Neons caught", caught, need, "gold"),
      ]);
    }

    readBeat(gym.introBeat);

    if (g.cleared) {
      const b = badgeById(gym.badge);
      return E("div", { class: "card gym-card done" }, [
        E("h3", { text: `${b ? b.emoji : "🏅"} ${gym.name} — cleared` }),
        E("div", { class: "muted", text: `${gym.leader.name} signed off. ${b ? b.name : ""} is yours.` }),
        E("button", { class: "btn ghost small", style: "margin-top:10px", text: "Re-read the scene", onclick: () => openBeatModal(gym.winBeat) }),
      ]);
    }

    const card = E("div", { class: "card gym-card open" }, [
      E("div", { class: "gym-leader" }, [
        E("div", { class: "gym-ico", text: region.emoji }),
        E("div", {}, [
          E("h3", { text: `${gym.name} — "${gym.title}"` }),
          E("div", { class: "muted", text: `${gym.leader.name} · ${gym.leader.role}` }),
        ]),
      ]),
      beatParas(gym.introBeat),
      E("div", { class: "section-label", text: "The challenge — check each part when it's really done" }),
    ]);

    gym.challenge.forEach((part, i) => {
      const on = !!g.parts[i];
      card.appendChild(E("button", {
        class: "gym-part " + (on ? "on" : ""),
        onclick: () => toggleGymPart(gym.id, i),
      }, [
        E("span", { class: "gp-box", text: on ? "✔" : String(i + 1) }),
        E("span", { class: "gp-text", text: part }),
      ]));
    });

    card.appendChild(E("div", { class: "quest-meta", style: "margin-top:10px" }, [
      chip(`+${gym.rewardXp} XP`, "xp"),
      chip(`${skillShort(gym.rewardSkill)}`, "comp"),
      chip(`${(badgeById(gym.badge) || {}).emoji || "🏅"} ${(badgeById(gym.badge) || {}).name || "Badge"}`, "warm"),
    ]));
    card.appendChild(E("div", { class: "story-note", text: "Nothing here expires. Clear part one tonight and the rest next weekend." }));
    return card;
  }

  function renderRegion(pane) {
    const r = regionById(openRegion);
    if (!r) { view = "journey"; renderJourney(pane); return; }

    pane.appendChild(E("button", { class: "btn ghost small story-back", text: "← The journey", onclick: () => { view = "journey"; openRegion = null; redraw(); } }));
    pane.appendChild(E("h2", { class: "pane-title", text: `${r.emoji} ${r.name}` }));
    pane.appendChild(E("div", { class: "pane-sub", text: `${r.subtitle} · ${r.theme}` }));

    if (!regionUnlocked(r.id)) {
      const rv = rivalById(r.unlockRival);
      pane.appendChild(E("div", { class: "card story-locked" }, [
        E("h3", { text: "🔒 Not yet" }),
        E("div", { class: "muted", text: `Get past Fade — "${rv.title}" — and this floor opens.` }),
        E("button", { class: "btn primary small", style: "margin-top:10px", text: "Back to Fade", onclick: () => { view = "journey"; openRegion = null; redraw(); } }),
      ]));
      return;
    }

    readBeat(r.introBeat);
    const intro = beatParas(r.introBeat);
    intro.appendChild(E("div", { class: "story-reread", text: "tap to re-read" }));
    intro.addEventListener("click", () => openBeatModal(r.introBeat));
    pane.appendChild(E("div", { class: "card story-intro" }, [intro]));

    pane.appendChild(E("div", { class: "section-label", text: `Neons here — ${caughtInRegion(r.id)} of ${r.neonIds.length} caught` }));
    for (const nid of r.neonIds) {
      const n = neonById(nid);
      if (n) pane.appendChild(neonCard(n));
    }

    pane.appendChild(E("div", { class: "section-label", text: "The gym" }));
    pane.appendChild(gymCard(gymOfRegion(r.id), r));
  }

  /* ============================================================
     JOURNEY VIEW
     ============================================================ */

  function rivalCard(rv) {
    readBeat(rv.beat);
    const card = E("div", { class: "card story-rival" });
    const body = E("div", {}, [
      E("div", { class: "story-kicker", text: `Fade · ${rv.title}` }),
      beatParas(rv.beat),
      E("div", { class: "section-label", text: "Three ways past him — any one clears it" }),
    ]);
    for (const rung of rv.rungs) {
      body.appendChild(E("button", {
        class: "story-rung", onclick: () => clearRung(rv.id, rung.key),
      }, [
        E("span", { class: "rung-key", text: rung.key.toUpperCase() }),
        E("span", { class: "rung-text", text: rung.text }),
        E("span", { class: "chip xp rung-xp", text: `+${rung.xp}` }),
      ]));
    }
    body.appendChild(E("button", {
      class: "btn ghost block", style: "margin-top:10px", text: "Not tonight",
      onclick: () => {
        card.innerHTML = "";
        card.appendChild(E("div", { class: "story-kicker", text: `Fade · ${rv.title}` }));
        card.appendChild(E("div", { class: "muted", text: "Not tonight. Nothing lost, nothing expires — the page just stays open." }));
        card.appendChild(E("button", { class: "btn ghost small", style: "margin-top:10px", text: "Look again", onclick: redraw }));
      },
    }));
    card.appendChild(body);
    return card;
  }

  function regionActiveCard(r) {
    const caught = caughtInRegion(r.id);
    const gym = gymOfRegion(r.id);
    const open = gymUnlocked(gym);
    return E("div", { class: "card story-hero", style: `border-color:${r.color}` }, [
      E("div", { class: "story-hero-top" }, [
        E("div", { class: "story-hero-emoji", text: r.emoji }),
        E("div", {}, [
          E("h3", { text: r.name }),
          E("div", { class: "muted", text: `${r.subtitle} · ${r.theme}` }),
        ]),
      ]),
      UI.meter("Neons caught", caught, r.neonIds.length, "gold"),
      E("div", { class: "muted", text: open
        ? `${gym.leader.name} is waiting at ${gym.name}.`
        : `The gym opens when you've caught ${StoryData.gymUnlockCatches} of ${r.neonIds.length}.` }),
      E("button", { class: "btn primary block", style: "margin-top:12px", text: `Walk into ${r.name}`, onclick: () => viewRegion(r.id) }),
    ]);
  }

  function prologueCard() {
    readBeat("beat-prologue");
    return E("div", { class: "card story-hero" }, [
      E("div", { class: "story-kicker", text: "Prologue" }),
      beatParas("beat-prologue"),
      E("button", {
        class: "btn primary block", style: "margin-top:12px", text: "Open the field guide",
        onclick: () => { st().started = true; Store.save(); redraw(); },
      }),
    ]);
  }

  function endingCard() {
    readBeat("beat-ending");
    return E("div", { class: "card story-hero" }, [
      E("div", { class: "story-kicker", text: "The Long Night" }),
      beatParas("beat-ending"),
      E("button", {
        class: "btn primary block", style: "margin-top:12px", text: "After Hours →",
        onclick: () => {
          readBeat("beat-afterhours");
          pushModal(done => beatModalNode("beat-afterhours", "Back to the floor", done));
        },
      }),
    ]);
  }

  function afterHoursCard() {
    const ah = StoryData.afterHours;
    const day = Store.todayKey();
    const doneToday = !!st().rivals["ah-" + day];
    const rand = Store.seededRandom(day + "|fade");
    const line = ah.lines[Math.floor(rand() * ah.lines.length)];
    const card = E("div", { class: "card story-rival afterhours" }, [
      E("div", { class: "story-kicker", text: "Fade · after hours" }),
      E("div", { class: "story-beat" }, [E("p", { text: line })]),
    ]);
    if (doneToday) {
      card.appendChild(E("div", { class: "muted", text: "Logged tonight. Maintenance done — he'll be back around, and that's fine." }));
      return card;
    }
    card.appendChild(E("div", { class: "section-label", text: "One rung, your pick" }));
    for (const rung of ah.rungs) {
      card.appendChild(E("button", { class: "story-rung", onclick: () => clearAfterHoursRung(rung.key) }, [
        E("span", { class: "rung-key", text: rung.key.toUpperCase() }),
        E("span", { class: "rung-text", text: rung.text }),
        E("span", { class: "chip xp rung-xp", text: `+${rung.xp}` }),
      ]));
    }
    card.appendChild(E("button", {
      class: "btn ghost block", style: "margin-top:10px", text: "Not tonight",
      onclick: () => UI.toast("Not tonight. Costs nothing."),
    }));
    return card;
  }

  function renderJourney(pane) {
    const d = st();
    const caught = totalCaught();

    pane.appendChild(E("h2", { class: "pane-title", text: `🗺️ ${chapterTitle()}` }));
    pane.appendChild(E("div", { class: "pane-sub", text: `The Long Night in Nocturne · ${caught}/${StoryData.neons.length} caught · ${d.badges.length}/${StoryData.badges.length} badges` }));

    // region rail
    const rail = E("div", { class: "story-rail" });
    for (const r of StoryData.regions) {
      const done = regionComplete(r.id);
      const unl = regionUnlocked(r.id);
      rail.appendChild(E("div", { class: "story-rail-node " + (done ? "done" : (unl ? "open" : "locked")), title: r.name }, [
        E("div", { class: "srn-ico", text: done ? (badgeById(gymOfRegion(r.id).badge) || {}).emoji || r.emoji : r.emoji }),
        E("div", { class: "srn-name", text: r.name }),
        E("div", { class: "srn-count", text: unl ? `${caughtInRegion(r.id)}/6` : "🔒" }),
      ]));
    }
    pane.appendChild(rail);

    // completed regions, collapsed above the active card
    const doneRegions = StoryData.regions.filter(r => regionComplete(r.id));
    if (doneRegions.length) {
      pane.appendChild(E("div", { class: "section-label", text: "Floors behind you" }));
      for (const r of doneRegions) {
        const b = badgeById(gymOfRegion(r.id).badge) || {};
        pane.appendChild(E("div", { class: "story-done-row" }, [
          E("span", { class: "sdr-ico", text: r.emoji }),
          E("span", { class: "sdr-name", text: r.name }),
          E("span", { class: "sdr-badge", text: b.emoji || "🏅" }),
          E("span", { class: "sdr-count", text: `${caughtInRegion(r.id)}/6` }),
          E("button", { class: "btn ghost small", text: "Revisit", onclick: () => viewRegion(r.id) }),
        ]));
      }
    }

    // the active card
    const step = activeStep();
    pane.appendChild(E("div", { class: "section-label", text: step ? "Right now" : "After Hours" }));
    if (!step) {
      pane.appendChild(afterHoursCard());
    } else if (step.kind === "beat") {
      pane.appendChild(prologueCard());
    } else if (step.kind === "rival") {
      pane.appendChild(rivalCard(rivalById(step.id)));
    } else if (step.kind === "region") {
      pane.appendChild(regionActiveCard(regionById(step.id)));
    } else if (step.kind === "ending") {
      pane.appendChild(endingCard());
    }

    // locked / upcoming floors below
    const upcoming = StoryData.regions.filter(r => !regionComplete(r.id) && (!step || step.kind !== "region" || step.id !== r.id));
    if (upcoming.length) {
      pane.appendChild(E("div", { class: "section-label", text: "Still ahead" }));
      for (const r of upcoming) {
        const unl = regionUnlocked(r.id);
        const rv = rivalById(r.unlockRival);
        pane.appendChild(E("div", { class: "card story-upcoming " + (unl ? "" : "locked") }, [
          E("div", { class: "story-hero-top" }, [
            E("div", { class: "story-hero-emoji", text: r.emoji }),
            E("div", {}, [
              E("div", { class: "neon-name", text: r.name }),
              E("div", { class: "muted", text: unl
                ? `${r.theme} · ${caughtInRegion(r.id)} of 6 caught`
                : `Locked — clear Fade, "${rv.title}", to open this floor.` }),
            ]),
          ]),
          unl ? E("button", { class: "btn ghost small", style: "margin-top:8px", text: `Go to ${r.name}`, onclick: () => viewRegion(r.id) }) : null,
        ]));
      }
    }

    // badge case
    if (d.badges.length) {
      pane.appendChild(E("div", { class: "section-label", text: "Badges" }));
      const grid = E("div", { class: "badge-grid" });
      for (const b of StoryData.badges) {
        const owned = d.badges.indexOf(b.id) >= 0;
        grid.appendChild(E("div", { class: "badge " + (owned ? "" : "locked"), title: b.desc }, [
          E("div", { class: "b-ico", text: b.emoji }),
          E("div", { class: "b-name", text: b.name }),
        ]));
      }
      pane.appendChild(grid);
    }

    // nav
    pane.appendChild(E("div", { class: "story-nav" }, [
      E("button", { class: "btn primary", text: "📓 Open the Cuedex", onclick: viewDex }),
      E("button", { class: "btn ghost", text: "📖 Story so far", onclick: openStoryLog }),
    ]));
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */

  // Public entry (app.js). Per the design, entering the pane always lands
  // back on the journey view; internal repaints use redraw().
  function render() {
    view = "journey";
    openRegion = null;
    redraw();
  }

  function redraw() {
    const pane = document.getElementById("pane-story");
    if (!pane) return;
    if (!ready()) {
      pane.innerHTML = "";
      pane.appendChild(E("h2", { class: "pane-title", text: "🗺️ Story Mode" }));
      pane.appendChild(E("div", { class: "pane-sub", text: "The story content failed to load." }));
      return;
    }
    const d = st();
    pane.innerHTML = "";
    rendering = true;
    try {
      if (view === "region" && openRegion) renderRegion(pane);
      else if (view === "dex") renderDex(pane);
      else { view = "journey"; renderJourney(pane); }
    } finally {
      rendering = false;
    }
    d.view = view;
    Store.save();
    checkEvolutions();
    flushLevelUp();
  }

  function teaser() {
    try {
      if (!ready()) return "A journey is waiting in Nocturne.";
      const d = st();
      const caught = totalCaught();
      if (!d.started) return "Fade is waiting outside. The journey hasn't started.";
      if (postGame()) return `After Hours — ${caught} of ${StoryData.neons.length} Neons, all four badges.`;
      const step = activeStep();
      if (!step) return `${caught} of ${StoryData.neons.length} Neons. The night's still going.`;
      if (step.kind === "beat") return "Twenty-four blank pages and a long night ahead.";
      if (step.kind === "rival") {
        const rv = rivalById(step.id);
        return `Fade is waiting: "${rv.title}" — three ways past him, pick one.`;
      }
      if (step.kind === "region") {
        const r = regionById(step.id);
        const gym = gymOfRegion(r.id);
        const c = caughtInRegion(r.id);
        if (gymUnlocked(gym)) return `${r.name} · ${c} of 6 caught · ${gym.leader.name} is waiting at ${gym.name}.`;
        return `${r.name} · ${c} of 6 caught · the gym opens at ${StoryData.gymUnlockCatches}.`;
      }
      if (step.kind === "ending") return "The far rail, the last page. One thing left to do.";
      return `${caught} of ${StoryData.neons.length} Neons caught.`;
    } catch (e) {
      return "Your story is waiting in Nocturne.";
    }
  }

  return {
    render, teaser,
    // internals exposed for debugging / console play (not required by the app)
    st, stageOf, questCountFor, catchNeon, checkEvolutions, clearRung,
    toggleGymPart, claimBadge, readBeat, unlockedRegions,
    viewJourney: () => { view = "journey"; openRegion = null; redraw(); },
    viewRegion, viewDex,
  };
})();
