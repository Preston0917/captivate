/* ============================================================
   demos.js — original visual demos for quest techniques.
   Simple annotated SVG figures (no book imagery — the site is
   public). Quests reference these by id via quest.demo.

   Two shapes of demo:
     · static     — { title, caption, svg | html }
     · interactive— { title, caption, interactive: true, mount(box) }
   `mount` is called with the demo box AFTER it is in the DOM, so it
   can measure, listen for pointers, and read/write the save. Demos
   are re-mounted fresh every time a how-to opens; nothing persists
   in this module.
   ============================================================ */

const Demos = (() => {
  // Shared bits for stick figures
  const S = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"';
  const HEAD = (cx, cy, r = 13) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${S}/>`;
  const LBL = (x, y, t, anchor = "middle") =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="11" fill="currentColor" opacity="0.75" font-family="sans-serif">${t}</text>`;
  const ARROW = (x1, y1, x2, y2) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${S} stroke-width="2" marker-end="url(#ah)"/>`;
  const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>`;

  const wrap = (inner) =>
    `<svg viewBox="0 0 260 170" role="img" style="width:100%;max-width:340px;display:block;margin:0 auto">${DEFS}${inner}</svg>`;

  const demos = {
    "head-tilt": {
      title: "The Head Tilt",
      caption: "Tilt your head slightly toward one shoulder while they talk — it exposes the ear ('I'm listening') and reads as warmth.",
      svg: wrap(`
        <g transform="rotate(-15 80 60)">${HEAD(80, 55)}<line x1="80" y1="68" x2="80" y2="115" ${S}/></g>
        <line x1="80" y1="115" x2="80" y2="120" ${S}/>
        ${ARROW(120, 35, 98, 45)} ${LBL(150, 32, "tilt ~15°")}
        ${HEAD(190, 55)}<line x1="190" y1="68" x2="190" y2="120" ${S} opacity="0.3"/>
        ${LBL(190, 145, "not straight-on", "middle")} ${LBL(80, 145, "tilted = warm")}
      `),
    },
    "lean-in": {
      title: "The Lean",
      caption: "When they say something interesting, lean your torso a few degrees toward them. Distance = disinterest; a small lean = engagement.",
      svg: wrap(`
        ${HEAD(70, 40)}<line x1="70" y1="53" x2="82" y2="110" ${S}/>
        ${HEAD(185, 40)}<line x1="185" y1="53" x2="173" y2="110" ${S}/>
        ${ARROW(95, 60, 115, 66)} ${ARROW(160, 60, 140, 66)}
        ${LBL(128, 150, "both lean a little = the convo is working")}
      `),
    },
    "fronting": {
      title: "Fronting",
      caption: "Aim all three — toes, torso, and head — at the person. Angled-away feet quietly say you want to leave.",
      svg: wrap(`
        ${HEAD(75, 35)}<line x1="75" y1="48" x2="75" y2="100" ${S}/>
        <line x1="75" y1="100" x2="62" y2="128" ${S}/><line x1="75" y1="100" x2="88" y2="128" ${S}/>
        <ellipse cx="60" cy="133" rx="9" ry="4" ${S}/><ellipse cx="90" cy="133" rx="9" ry="4" ${S}/>
        ${ARROW(105, 90, 150, 90)}
        ${HEAD(190, 35)}<line x1="190" y1="48" x2="190" y2="100" ${S} opacity="0.5"/>
        ${LBL(75, 155, "toes + torso + head")} ${LBL(190, 155, "→ at them")}
      `),
    },
    "triple-nod": {
      title: "The Slow Triple Nod",
      caption: "When they finish a point, nod slowly three times. It signals 'keep going' — people talk 3–4× longer after a triple nod.",
      svg: wrap(`
        ${HEAD(130, 55)}<line x1="130" y1="68" x2="130" y2="115" ${S}/>
        <path d="M 95 35 q -12 12 0 24" ${S} stroke-width="2"/>
        <path d="M 165 35 q 12 12 0 24" ${S} stroke-width="2"/>
        ${LBL(130, 145, "nod · nod · nod — slowly")}
        ${LBL(130, 160, "(fast nodding reads as 'hurry up')")}
      `),
    },
    "eyebrow-flash": {
      title: "The Eyebrow Flash",
      caption: "A quick raise of both eyebrows when you greet someone — the universal 'I'm happy to see you' signal. Pair it with their name.",
      svg: wrap(`
        ${HEAD(130, 75, 34)}
        <path d="M 112 62 q 8 -8 16 0" ${S} stroke-width="2.5"/>
        <path d="M 132 62 q 8 -8 16 0" ${S} stroke-width="2.5"/>
        <circle cx="120" cy="74" r="2.5" fill="currentColor"/><circle cx="140" cy="74" r="2.5" fill="currentColor"/>
        <path d="M 118 94 q 12 8 24 0" ${S} stroke-width="2.5"/>
        ${ARROW(95, 45, 108, 55)} ${ARROW(165, 45, 152, 55)}
        ${LBL(130, 150, "brows up for a beat, then release")}
      `),
    },
    "eye-contact": {
      title: "60–70% Eye Contact",
      caption: "Aim for eye contact roughly two-thirds of the time — enough to build oxytocin and trust, without staring.",
      svg: wrap(`
        <rect x="40" y="70" width="180" height="18" rx="9" ${S}/>
        <rect x="40" y="70" width="120" height="18" rx="9" fill="currentColor" opacity="0.55"/>
        ${LBL(100, 63, "~60–70% while listening")}
        ${LBL(130, 115, "break gaze sideways (not down) to think")}
      `),
    },
    "steeple": {
      title: "The Steeple",
      caption: "Fingertips together, palms apart — the classic confidence cue. Use it when making a point you believe in.",
      svg: wrap(`
        <path d="M 95 120 L 130 55 L 165 120" ${S}/>
        <line x1="103" y1="118" x2="130" y2="68" ${S} stroke-width="2" opacity="0.55"/>
        <line x1="157" y1="118" x2="130" y2="68" ${S} stroke-width="2" opacity="0.55"/>
        ${LBL(130, 150, "fingertips touch, palms apart, relaxed")}
      `),
    },
    "palms-up": {
      title: "Visible Palms",
      caption: "Keep your hands visible and gesture with open palms — hidden hands trigger distrust; open palms read as honesty.",
      svg: wrap(`
        ${HEAD(130, 35)}<line x1="130" y1="48" x2="130" y2="100" ${S}/>
        <line x1="130" y1="62" x2="95" y2="88" ${S}/><line x1="130" y1="62" x2="165" y2="88" ${S}/>
        <ellipse cx="88" cy="92" rx="10" ry="6" ${S}/><ellipse cx="172" cy="92" rx="10" ry="6" ${S}/>
        ${LBL(130, 130, "hands out of pockets, palms showing")}
      `),
    },
    "power-pose": {
      title: "Claim Your Space",
      caption: "Shoulders back and down, chin level, feet shoulder-width, arms loose at your sides — take up the space you're entitled to.",
      svg: wrap(`
        ${HEAD(130, 30)}<line x1="130" y1="43" x2="130" y2="100" ${S}/>
        <line x1="130" y1="55" x2="98" y2="80" ${S}/><line x1="130" y1="55" x2="162" y2="80" ${S}/>
        <line x1="130" y1="100" x2="108" y2="135" ${S}/><line x1="130" y1="100" x2="152" y2="135" ${S}/>
        ${ARROW(70, 55, 90, 55)} ${ARROW(190, 55, 170, 55)}
        ${LBL(130, 160, "wide base · open chest · chin level")}
      `),
    },
    "no-blocking": {
      title: "Don't Block",
      caption: "Crossed arms, a phone, a bag, or a drink held at your chest all act as barriers. Keep the space between your torso and theirs clear.",
      svg: wrap(`
        ${HEAD(75, 35)}<line x1="75" y1="48" x2="75" y2="105" ${S}/>
        <line x1="55" y1="70" x2="95" y2="80" ${S}/><line x1="95" y1="70" x2="55" y2="80" ${S}/>
        <line x1="30" y1="140" x2="120" y2="140" ${S} stroke-width="2"/>
        <line x1="35" y1="20" x2="115" y2="130" stroke="currentColor" stroke-width="3" opacity="0.7"/>
        ${HEAD(190, 35)}<line x1="190" y1="48" x2="190" y2="105" ${S}/>
        <line x1="190" y1="62" x2="168" y2="90" ${S}/><line x1="190" y1="62" x2="212" y2="90" ${S}/>
        ${LBL(75, 158, "arms crossed = wall")} ${LBL(190, 158, "open torso = door")}
      `),
    },
    "zones-map": {
      title: "Work the Room: the Zones",
      caption: "Skip the Start Zone (entrance nerves) and the Side Zone (wallflower corners). The Social Zone — where people exit the bar/food line — is where conversations begin naturally.",
      svg: wrap(`
        <rect x="30" y="25" width="200" height="120" rx="8" ${S}/>
        <rect x="30" y="95" width="55" height="50" ${S} stroke-width="2" opacity="0.5"/>
        ${LBL(57, 122, "START")} ${LBL(57, 134, "(skip)")}
        <rect x="200" y="25" width="30" height="120" ${S} stroke-width="2" opacity="0.5"/>
        ${LBL(215, 88, "SIDE")}
        <circle cx="130" cy="70" r="26" ${S} stroke-width="2"/>
        ${LBL(130, 67, "SOCIAL")} ${LBL(130, 80, "ZONE ★")}
        ${LBL(130, 160, "stand where people leave the bar with fresh drinks")}
      `),
    },
    "downward-inflection": {
      title: "Downward Inflection",
      caption: "End statements with your pitch going down — it sounds sure. Ending on a rise ('uptalk?') turns your statement into a question.",
      svg: wrap(`
        <path d="M 40 70 q 40 -18 75 0 t 60 22" ${S} stroke-width="2.5" marker-end="url(#ah)"/>
        ${LBL(70, 45, "“I run the promo team”")} ${LBL(190, 120, "pitch falls = confident")}
        <path d="M 40 140 q 60 5 120 -28" ${S} stroke-width="2" opacity="0.45" marker-end="url(#ah)"/>
        ${LBL(75, 160, "rising end = sounds unsure?")}
      `),
    },
    "microexpressions": {
      title: "The 7 Microexpressions",
      caption: "Flashes under half a second that leak true feelings. Learn the facial markers, then respond to the emotion — not just the words.",
      html: `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;font-size:.72rem">
        <div><div style="font-size:30px">😀</div>Happiness<br><span style="opacity:.6">eye-corner crinkle</span></div>
        <div><div style="font-size:30px">😢</div>Sadness<br><span style="opacity:.6">lid droop, lip corners down</span></div>
        <div><div style="font-size:30px">😨</div>Fear<br><span style="opacity:.6">lids stretched wide</span></div>
        <div><div style="font-size:30px">😠</div>Anger<br><span style="opacity:.6">brows down + together</span></div>
        <div><div style="font-size:30px">🤢</div>Disgust<br><span style="opacity:.6">nose crinkle, lip raise</span></div>
        <div><div style="font-size:30px">😲</div>Surprise<br><span style="opacity:.6">brows up, jaw drops</span></div>
        <div><div style="font-size:30px">😏</div>Contempt<br><span style="opacity:.6">one-sided smirk</span></div>
        <div><div style="font-size:30px">👀</div><b>Spot it</b><br><span style="opacity:.6">then address it</span></div>
      </div>`,
    },
    "launch-stance": {
      title: "The Launch Stance",
      caption: "Before walking in: hands visible, shoulders down, feet planted — no phone-hunch. You get judged in the first seconds; launch from strength.",
      svg: wrap(`
        ${HEAD(80, 35)}<line x1="80" y1="48" x2="80" y2="100" ${S}/>
        <line x1="80" y1="58" x2="60" y2="85" ${S}/><line x1="80" y1="58" x2="100" y2="85" ${S}/>
        <line x1="80" y1="100" x2="66" y2="135" ${S}/><line x1="80" y1="100" x2="94" y2="135" ${S}/>
        <g opacity="0.4">${HEAD(190, 50)}<path d="M 190 63 q -14 18 -8 40" ${S}/><rect x="196" y="70" width="12" height="18" rx="2" ${S} stroke-width="2"/></g>
        ${LBL(80, 158, "ready ✔")} ${LBL(195, 158, "phone-hunch ✘")}
      `),
    },
    "mirroring": {
      title: "Subtle Mirroring",
      caption: "A few seconds after they shift posture, loosely echo it. Mirroring builds 'we're alike' rapport — keep it subtle, never instant.",
      svg: wrap(`
        ${HEAD(75, 40)}<line x1="75" y1="53" x2="85" y2="110" ${S}/><line x1="75" y1="65" x2="98" y2="80" ${S}/>
        ${HEAD(185, 40)}<line x1="185" y1="53" x2="175" y2="110" ${S}/><line x1="185" y1="65" x2="162" y2="80" ${S}/>
        ${LBL(130, 145, "same energy, mirrored — after a beat")}
      `),
    },
    "space-zones": {
      // The event-zone map (zones-map) is about WHERE to stand in a venue.
      // This one is proxemics: how CLOSE you stand, and what a bridge is.
      title: "Space Zones — and the Bridge",
      caption: "Intimate, personal, social, public. A bridge crosses a zone with one limb or an object instead of your whole body.",
      svg: wrap(`
        <circle cx="80" cy="88" r="60" ${S} stroke-width="1.5" opacity="0.3"/>
        <circle cx="80" cy="88" r="42" ${S} stroke-width="1.5" opacity="0.45"/>
        <circle cx="80" cy="88" r="24" ${S} stroke-width="1.5" opacity="0.65"/>
        ${HEAD(80, 88, 9)}
        ${LBL(80, 108, "intimate")} ${LBL(80, 126, "personal")} ${LBL(80, 152, "social")}
        ${LBL(30, 26, "public", "start")}
        ${HEAD(210, 78, 11)}<line x1="210" y1="89" x2="210" y2="130" ${S}/>
        <line x1="210" y1="98" x2="176" y2="104" ${S}/>
        <ellipse cx="170" cy="105" rx="7" ry="5" ${S} stroke-width="2"/>
        ${ARROW(196, 118, 152, 112)}
        ${LBL(200, 150, "one arm crosses,")} ${LBL(200, 162, "not your whole body")}
      `),
    },
    "charisma-grid": {
      title: "Warmth × Competence",
      caption: "Tap the square to place yourself. Warmth runs across, competence runs up — the top-right corner is the charisma zone.",
      interactive: true,
      mount: (box) => mountGrid(box),
    },
  };

  /* ==========================================================
     THE GRID — interactive warmth × competence placement.
     Zone ids match analyzer.js so a past analysis can be
     plotted on exactly the same square.
     ========================================================== */

  const GRID_ZONES = {
    danger_zone:        { name: "⚠️ Danger zone",       read: "Low warmth, low competence — easy to overlook.", nudge: "One warm cue moves you right: a real smile." },
    warm_but_soft:      { name: "🧸 Warm but soft",     read: "Liked, but easy to talk over.",                  nudge: "Move up: level your pitch, bring one number." },
    competent_but_cold: { name: "🧊 Competent but cold", read: "Respected, but not approached.",                 nudge: "Move right: one head tilt, one warm opener." },
    charisma_zone:      { name: "⭐ Charisma zone",      read: "Warm and capable — both signals landing.",        nudge: "Hold it. Match whichever axis the room asks for." },
  };

  const zoneOf = (w, c) => (w >= 5
    ? (c >= 5 ? "charisma_zone" : "warm_but_soft")
    : (c >= 5 ? "competent_but_cold" : "danger_zone"));

  const clamp10 = v => Math.max(0, Math.min(10, Math.round(v * 10) / 10));
  const LEVELS = ["low", "mid", "high"];

  // The save is the source of truth; old saves predate the key.
  function placements() {
    const s = Store.state;
    if (!Array.isArray(s.gridPlacements)) s.gridPlacements = [];
    return s.gridPlacements;
  }

  function mountGrid(box) {
    const E = UI.el;
    const past = placements().slice();          // ghosts = everything before this visit
    let mine = null;                            // this visit's entry, updated in place
    let dragging = false;

    const plane = E("div", { class: "cg-plane" });
    plane.innerHTML =
      '<svg class="cg-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<rect class="cg-z" data-z="competent_but_cold" x="0" y="0" width="50" height="50"/>' +
      '<rect class="cg-z" data-z="charisma_zone" x="50" y="0" width="50" height="50"/>' +
      '<rect class="cg-z" data-z="danger_zone" x="0" y="50" width="50" height="50"/>' +
      '<rect class="cg-z" data-z="warm_but_soft" x="50" y="50" width="50" height="50"/>' +
      '<line class="cg-mid" x1="50" y1="0" x2="50" y2="100"/>' +
      '<line class="cg-mid" x1="0" y1="50" x2="100" y2="50"/>' +
      '</svg>';

    // Corner names, in the app's own words (same labels the analyzer uses)
    for (const [z, pos] of [["competent_but_cold", "tl"], ["charisma_zone", "tr"],
                            ["danger_zone", "bl"], ["warm_but_soft", "br"]]) {
      plane.appendChild(E("div", { class: `cg-zlabel cg-${pos}`, "data-z": z, text: GRID_ZONES[z].name }));
    }

    // Accessible fallback: nine real buttons. Pointer taps are handled by the
    // plane (finer), so these only fire for keyboard activation (detail === 0).
    const cells = E("div", { class: "cg-cells" });
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const w = [1.7, 5, 8.3][col], c = [8.3, 5, 1.7][row];
        cells.appendChild(E("button", {
          type: "button", class: "cg-cell",
          "aria-label": `${LEVELS[col]} warmth, ${LEVELS[2 - row]} competence`,
          onclick: (e) => { if (e.detail === 0) { place(w, c); commit(); } },
        }));
      }
    }
    plane.appendChild(cells);

    // Ghost dots: faint = your own past placements, tiny = analyzed conversations
    for (const p of past.slice(-6)) plane.appendChild(dot("cg-ghost", p.w, p.c));
    const analyses = (Store.state.analyses || []).filter(a => a.warmth != null && a.competence != null);
    for (const a of analyses.slice(-6)) plane.appendChild(dot("cg-tiny", a.warmth, a.competence));

    const live = dot("cg-dot hidden", 5, 5);
    plane.appendChild(live);

    const readEl = E("div", { class: "cg-read", text: "Tap anywhere to place yourself." });
    const nudgeEl = E("div", { class: "cg-nudge" });

    const grid = E("div", { class: "cg" }, [
      E("div", { class: "cg-frame" }, [
        E("div", { class: "cg-yaxis", text: "Competence →" }),
        plane,
      ]),
      E("div", { class: "cg-xaxis", text: "Warmth →" }),
      readEl,
      nudgeEl,
      E("div", { class: "cg-words", text: "Warm: trustworthy, kind, team player. Competent: impressive, expert, capable." }),
      past.length ? E("div", { class: "cg-legend", text: "Faint dots are where you put yourself before." }) : null,
      analyses.length ? E("div", { class: "cg-legend", text: "Tiny dots come from your analyzed conversations." }) : null,
    ]);
    box.appendChild(grid);

    function dot(cls, w, c) {
      return E("div", { class: cls, style: `left:${w * 10}%; top:${(10 - c) * 10}%` });
    }

    function place(w, c) {
      w = clamp10(w); c = clamp10(c);
      live.style.left = `${w * 10}%`;
      live.style.top = `${(10 - c) * 10}%`;
      live.classList.remove("hidden");
      const z = zoneOf(w, c);
      live.dataset.z = z;
      readEl.textContent = `${GRID_ZONES[z].name} — ${GRID_ZONES[z].read}`;
      nudgeEl.textContent = GRID_ZONES[z].nudge;
      plane.querySelectorAll(".cg-z, .cg-zlabel").forEach(n =>
        n.classList.toggle("on", n.dataset.z === z));
      live._w = w; live._c = c;
    }

    // One entry per visit: dragging around does not spam the save.
    function commit() {
      if (live._w == null) return;
      const list = placements();
      if (mine) { mine.w = live._w; mine.c = live._c; mine.ts = Date.now(); }
      else {
        mine = { w: live._w, c: live._c, ts: Date.now() };
        list.push(mine);
        if (list.length > 20) list.splice(0, list.length - 20);
      }
      Store.save();
    }

    function fromEvent(e) {
      const r = plane.getBoundingClientRect();
      if (!r.width || !r.height) return;
      place(((e.clientX - r.left) / r.width) * 10, (1 - (e.clientY - r.top) / r.height) * 10);
    }

    plane.addEventListener("pointerdown", e => {
      dragging = true;
      try { plane.setPointerCapture(e.pointerId); } catch (err) { /* mouse in old webviews */ }
      fromEvent(e);
      e.preventDefault();
    });
    plane.addEventListener("pointermove", e => { if (dragging) fromEvent(e); });
    const end = () => { if (!dragging) return; dragging = false; commit(); };
    plane.addEventListener("pointerup", end);
    plane.addEventListener("pointercancel", end);
  }

  /* ---------- rendering ---------- */

  // Fills `box` with a demo. Static demos are innerHTML; interactive ones
  // mount live nodes. Both get the caption underneath.
  function render(id, box) {
    const d = demos[id];
    if (!d) return null;
    box.innerHTML = "";
    if (d.mount) d.mount(box);
    else if (d.svg) box.innerHTML = d.svg;
    else if (d.html) box.innerHTML = d.html;
    box.appendChild(UI.el("div", { class: "demo-caption", text: d.caption }));
    return d;
  }

  // Standalone: any surface can pop a demo without owning a quest.
  function open(id) {
    const d = demos[id];
    if (!d) return;
    const box = UI.el("div", { class: "demo-box" });
    const sheet = UI.el("div", {}, [UI.el("h3", { text: d.title }), box]);
    sheet.appendChild(UI.el("button", {
      class: "btn primary block", style: "margin-top:14px", text: "Got it", onclick: UI.closeModal,
    }));
    UI.modal(sheet);
    render(id, box);          // mount AFTER the box is in the DOM, so it can measure
  }

  return {
    get(id) { return demos[id] || null; },
    has(id) { return !!demos[id]; },
    ids: Object.keys(demos),
    render, open,
  };
})();
