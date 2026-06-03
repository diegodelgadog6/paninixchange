// Sticker dataset for the Mundial 2026 album (994 cromos total).
// Real app: this data comes from GET /api/album — shape mirrors a sticker record:
// code, name, team, category plus the collector's owned copy count.
//
// `copies` is the source of truth for ownership (integer):
//   0   → missing (wanted)
//   1   → owned (single copy)
//   >=2 → owned with duplicates (available to trade)
// `status` is derived from `copies` via statusFromCopies() — see CollectionContext.
// `rarity`: 'base' | 'gold' | 'legend'
// `position`: category label — 'Jugador' | 'Escudo' | 'Foto del equipo' | 'Especial' | 'Coca-Cola'

import { STICKER_NAMES, ALBUM_SECTIONS, getTier, getRarity, getCategory } from './catalog'
import { mulberry32 } from './prng'

// Derives the collector's relationship to a cromo from its copy count.
// Single source of the copies → status mapping (consumed by the context and StickerCard).
export function statusFromCopies(copies) {
  if (copies <= 0) return 'falta'
  if (copies === 1) return 'tengo'
  return 'repetido'
}

// Headline album stats. Real app: derived from the user's collection via GET /api/album.
// tengo(358) + repetido(54) + falta(582) must equal total(994).
export const ALBUM_STATS = {
  total: 994,
  owned: 412,
  tengo: 358,
  repetido: 54,
  falta: 582,
  matches: 12,
}

// Builds the complete 994-card album in physical order using real catalog data.
// Initial copy counts are distributed deterministically via PRNG to match ALBUM_STATS
// totals (falta→0, tengo→1, repetido→2). These seed the collection on first load.
// Real app: GET /api/album returns this array with real per-user copy counts.
function buildRealAlbum() {
  const pool = [
    ...Array(ALBUM_STATS.tengo).fill(1),
    ...Array(ALBUM_STATS.repetido).fill(2),
    ...Array(ALBUM_STATS.falta).fill(0),
  ]

  const rng = mulberry32(2026)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  const stickers = []
  let number = 1
  let poolIdx = 0

  for (const { section, count } of ALBUM_SECTIONS) {
    for (let pos = 1; pos <= count; pos++) {
      const code =
        section === '00'  ? '00'  :
        section === 'FWC' ? `FWC${pos}` :
        section === 'CC'  ? `CC${pos}`  :
        `${section}${pos}`

      const tier = getTier(section, pos)
      stickers.push({
        id:       code,
        number:   number++,
        name:     STICKER_NAMES[code] ?? code,
        team:     section,
        position: getCategory(tier),
        rarity:   getRarity(tier),
        copies:   pool[poolIdx++] ?? 0,
      })
    }
  }

  return stickers
}

// The complete 994-card album in physical order, with seed copy counts.
// Real app: GET /api/album. The live, editable collection is derived in CollectionContext.
export const STICKERS = buildRealAlbum()

// IDs of the four cromos shown on the dashboard ("Tus Cromos Destacados").
// Resolved against the live collection so their status reflects current ownership.
// Real app: GET /api/dashboard → highlighted cards from the user's collection.
export const FEATURED_IDS = ['ARG17', 'CC1', 'FRA20', 'BRA1']
