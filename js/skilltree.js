/* ============================================================
   skilltree.js — mastery view of the books' skills
   Skills come from CaptivateContent.skills + CuesContent.skills
   Skill: { id, name, icon, desc, branch, minLevel }
   Mastery pips light up from skillXp earned via quests/quizzes.
   ============================================================ */

const SkillTree = (() => {
  const PIP_THRESHOLDS = [20, 60, 140, 260, 420]; // xp → pips

  function pipsFor(xp) {
    let p = 0;
    for (const t of PIP_THRESHOLDS) if (xp >= t) p++;
    return p;
  }

  function allSkills() {
    return CaptivateContent.skills.concat(CuesContent.skills);
  }

  function render() {
    const pane = document.getElementById("pane-skilltree");
    const s = Store.state;
    pane.innerHTML = "";
    pane.appendChild(UI.el("h2", { class: "pane-title", text: "Skill Tree" }));
    pane.appendChild(UI.el("div", { class: "pane-sub", text: "Earn XP in a skill through its quests and quizzes to light up mastery pips." }));

    const branches = {};
    for (const sk of allSkills()) {
      (branches[sk.branch] ||= []).push(sk);
    }

    for (const [branch, skills] of Object.entries(branches)) {
      pane.appendChild(UI.el("div", { class: "section-label", text: branch }));
      for (const sk of skills) {
        const locked = (sk.minLevel || 1) > s.level;
        const xp = s.skillXp[sk.id] || 0;
        const pips = pipsFor(xp);
        const row = UI.el("div", { class: `skill-row ${locked ? "locked" : ""}` }, [
          UI.el("div", { class: "skill-ico", text: sk.icon }),
          UI.el("div", { class: "skill-info" }, [
            UI.el("div", { class: "skill-name", text: sk.name + (locked ? `  🔒 Lv ${sk.minLevel}` : "") }),
            UI.el("div", { class: "skill-desc", text: sk.desc }),
            UI.el("div", { class: "skill-mastery" },
              PIP_THRESHOLDS.map((_, i) => UI.el("div", { class: `pip ${i < pips ? "lit" : ""}` }))
            ),
          ]),
        ]);
        if (!locked) {
          row.style.cursor = "pointer";
          row.addEventListener("click", () => detailModal(sk, xp, pips));
        }
        pane.appendChild(row);
      }
    }
  }

  function detailModal(sk, xp, pips) {
    const wrap = UI.el("div", {}, [
      UI.el("h3", { text: `${sk.icon} ${sk.name}` }),
      UI.el("p", { class: "muted", style: "line-height:1.6; margin:8px 0 12px", text: sk.detail || sk.desc }),
      UI.meter("Mastery XP", xp, PIP_THRESHOLDS[PIP_THRESHOLDS.length - 1], "gold"),
      UI.el("div", { class: "muted", style: "font-size:.8rem", text: `${pips}/5 mastery pips` }),
      sk.actions ? UI.el("div", { style: "margin-top:12px" }, [
        UI.el("div", { class: "section-label", style: "margin-top:0", text: "Try this" }),
        ...sk.actions.map(a => UI.el("div", { class: "cue-hit positive" }, [
          UI.el("span", { class: "cue-tag", text: "▶" }),
          UI.el("span", { text: a }),
        ])),
      ]) : null,
      UI.el("button", { class: "btn primary block", style: "margin-top:14px", text: "Close", onclick: UI.closeModal }),
    ]);
    UI.modal(wrap);
  }

  return { render };
})();
