/* ============================================================
   live-engine.js — the arithmetic Night Mode and Day Mode share.

   Pure math only: no DOM, no Store writes, no Native calls. Every
   function here was lifted VERBATIM out of nightmode.js, including
   the ORDER of rand() calls (tier draw, then pool draw), so a seed
   that produced a given night setlist before the extraction still
   produces the same one after it.

   Night Mode keeps its own state, render, notifications and
   lifecycle — only the arithmetic moved.
   ============================================================ */

const LiveEngine = (() => {

  // The one XP ladder. A tier-2 rep is worth the same at 2pm as at 2am.
  const TIER_XP = { 0: 8, 1: 15, 2: 25, 3: 40 };

  function tierOf(pool, id) {
    const p = pool.find(x => x.id === id);
    return p ? p.tier : 9;
  }

  /* ---------- the set-picker ----------
     pool     — [{ id, tier }]
     tiers    — the level's tier distribution, drawn from with rand()
     rand     — a seeded PRNG (Store.seededRandom)
     size     — how many to pick
     exclude  — ids already spent (night's usedIds); never mutated

     Returns { picks, reset }. `reset` is true when the pool ran dry and
     the exclusion list had to be dropped mid-draw — the caller clears its
     own list (nightmode.js did `n.usedIds = []` inline). Sorted easiest
     first: lowest activation energy leads. */
  function pickSet(pool, { tiers, rand, size, exclude }) {
    let ex = exclude || [];
    let reset = false;
    const picks = [];
    for (let i = 0; i < size; i++) {
      const tier = tiers[Math.floor(rand() * tiers.length)];
      let cand = pool.filter(p => p.tier === tier && !ex.includes(p.id) && !picks.includes(p.id));
      if (!cand.length) cand = pool.filter(p => p.tier > 0 && !ex.includes(p.id) && !picks.includes(p.id));
      if (!cand.length) { ex = []; reset = true; cand = pool.filter(p => p.tier > 0 && !picks.includes(p.id)); }
      if (!cand.length) break;
      picks.push(cand[Math.floor(rand() * cand.length)].id);
    }
    picks.sort((a, b) => tierOf(pool, a) - tierOf(pool, b));
    return { picks, reset };
  }

  /* ---------- one-tap replacement ----------
     Same tier if anything is left there, then anything non-rescue, then
     anything at all but the current one. Returns the picked object, or
     null when the pool has nothing else to offer. */
  function swapPick(pool, { tier, rand, exclude, current }) {
    const r = rand || Math.random;
    const ex = exclude || [];
    const off = id => id === current || ex.includes(id);
    let cand = pool.filter(p => p.tier === tier && !off(p.id));
    if (!cand.length) cand = pool.filter(p => p.tier > 0 && !off(p.id));
    if (!cand.length) cand = pool.filter(p => p.tier > 0 && p.id !== current);
    if (!cand.length) return null;
    return cand[Math.floor(r() * cand.length)];
  }

  // Chained actions pay more, capped so a long chain never dwarfs the rep.
  function comboBonus(n) {
    return Math.min(25, (n - 1) * 5);
  }

  // Milliseconds → "4:07".
  function fmtClock(ms) {
    const t = Math.max(0, Math.ceil(ms / 1000));
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  }

  return { TIER_XP, pickSet, swapPick, comboBonus, fmtClock, tierOf };
})();
