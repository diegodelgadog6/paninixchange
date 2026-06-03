// Matching engine — derives trade suggestions by crossing the user's live collection
// (copies from CollectionContext) against the other collectors' inventories.
// Real app: GET /api/matches — compatibility is computed server-side (overlap between
// this collector's duplicates and another's needs). Here it runs in the browser over
// the mock roster in src/data/collectors.js.

import { collectors } from './collectors'

// Compatibility score for a potential trade. A match is only viable when BOTH sides gain
// (each can hand the other something they lack). Returns 0 when one-sided, else ~40–100.
function scoreMatch(theyOffer, iOffer) {
  const get = theyOffer.length
  const give = iOffer.length
  if (get === 0 || give === 0) return 0
  const balance = Math.min(give, get) / Math.max(give, get) // 0..1 — how even the trade is
  const volume = Math.min(get, 20) / 20 // 0..1 — capped how much I gain
  return Math.round(40 + balance * 30 + volume * 30)
}

// Crosses my live collection against one collector.
//   theyOffer: cromos I'm missing (copies 0) that they have spare (copies >= 2)
//   iOffer:    cromos they're missing (0) that I have spare (>= 2)
export function findMatches(myStickers, collector) {
  const theyOffer = []
  const iOffer = []
  let goldCount = 0

  for (const s of myStickers) {
    const mine = s.copies
    const theirs = collector.copiesById[s.id] ?? 0
    if (mine === 0 && theirs >= 2) {
      theyOffer.push(s)
      if (s.rarity !== 'base') goldCount++
    }
    if (theirs === 0 && mine >= 2) {
      iOffer.push(s)
    }
  }

  return { collector, theyOffer, iOffer, goldCount, compatibility: scoreMatch(theyOffer, iOffer) }
}

// All viable matches for my collection, sorted by compatibility (best first).
// The caller decides how many to show.
export function computeMatchSuggestions(myStickers) {
  return collectors
    .map((c) => findMatches(myStickers, c))
    .filter((m) => m.compatibility > 0)
    .sort((a, b) => b.compatibility - a.compatibility)
}
