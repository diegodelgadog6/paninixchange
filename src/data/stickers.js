// Sticker dataset for the Mundial 2026 album (994 cromos total).
// Real app: this data comes from GET /api/album — shape mirrors a sticker record:
// code, name, team, category plus the collector's ownership status.
//
// `status` is the collector's relationship to the cromo:
//   'tengo'    → owned (single copy)
//   'repetido' → owned with duplicates (available to trade)
//   'falta'    → missing (wanted)
// `rarity`: 'base' | 'gold' | 'legend'
// `position`: category label — 'Jugador' | 'Escudo' | 'Foto del equipo' | 'Especial' | 'Coca-Cola'

import { STICKER_NAMES, ALBUM_SECTIONS, getTier, getRarity, getCategory } from './catalog'

// Small seedable PRNG — used only for deterministic status assignment.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
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
// Status is distributed deterministically via PRNG to match ALBUM_STATS totals.
// Real app: GET /api/album returns this array with real per-user status values.
function buildRealAlbum() {
  const pool = [
    ...Array(ALBUM_STATS.tengo).fill('tengo'),
    ...Array(ALBUM_STATS.repetido).fill('repetido'),
    ...Array(ALBUM_STATS.falta).fill('falta'),
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
        status:   pool[poolIdx++] ?? 'falta',
      })
    }
  }

  return stickers
}

// The complete 994-card album in physical order. Real app: GET /api/album.
export const STICKERS = buildRealAlbum()

// Four notable cromos shown on the dashboard ("Tus Cromos Destacados").
// Picked from STICKERS so status matches the deterministic mock distribution.
// Real app: GET /api/dashboard → highlighted cards from the user's collection.
export const dashboardFeatured = ['ARG17', 'CC1', 'FRA20', 'BRA1'].map(
  (id) => STICKERS.find((s) => s.id === id),
)
