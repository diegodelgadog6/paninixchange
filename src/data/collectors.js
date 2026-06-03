// Roster of other collectors, each with their own (mock) album collection.
// Real app: GET /api/radar / GET /api/matches return real collectors and the matching
// engine runs server-side. Here each collector gets a deterministic `copiesById` so the
// frontend matching engine (src/data/matches.js) has real inventories to cross.
//
// Reuses the identities already shown on the Trade Radar (nearbyUsers) so suggestions
// and the radar stay consistent. A2 will migrate Radar to read from this roster.

import { nearbyUsers } from './users'
import { STICKERS } from './stickers'
import { mulberry32, hashStringSeed } from './prng'

// Builds a stable per-collector collection: ~45% missing, ~40% single, ~15% duplicates.
// Seeded by the collector id so it never changes across reloads.
function buildCollection(id) {
  const rng = mulberry32(hashStringSeed(id))
  const copiesById = {}
  for (const s of STICKERS) {
    const r = rng()
    copiesById[s.id] = r < 0.45 ? 0 : r < 0.85 ? 1 : 2
  }
  return copiesById
}

export const collectors = nearbyUsers.map((u) => ({
  ...u,
  copiesById: buildCollection(u.id),
}))
