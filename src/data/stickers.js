// Sticker dataset for the Mundial 2026 album (994 cromos total).
// In the real app this comes from `GET /api/album` — the shape mirrors a sticker
// record: number, player, team, position plus the collector's ownership status.
//
// `status` is the collector's relationship to the cromo:
//   'tengo'    → owned (single copy)
//   'repetido' → owned with duplicates (available to trade)
//   'falta'    → missing (wanted)
// `rarity`: 'base' | 'gold' | 'legend'

// 30 hand-authored "featured" cromos. The full 994-card grid (feat/album-grid)
// is generated from these plus filler cards.
export const FEATURED_STICKERS = [
  { number: 412, name: 'Lionel Messi', team: 'ARG', position: 'Delantero', status: 'repetido', rarity: 'legend' },
  { number: 89, name: 'Kylian Mbappé', team: 'FRA', position: 'Delantero', status: 'falta', rarity: 'gold' },
  { number: 231, name: 'Vinícius Jr.', team: 'BRA', position: 'Delantero', status: 'tengo', rarity: 'gold' },
  { number: 511, name: 'Brasil — Emblema', team: 'BRA', position: 'Escudo', status: 'tengo', rarity: 'base' },
  { number: 5, name: 'Emiliano Martínez', team: 'ARG', position: 'Portero', status: 'tengo', rarity: 'base' },
  { number: 7, name: 'Lautaro Martínez', team: 'ARG', position: 'Delantero', status: 'tengo', rarity: 'base' },
  { number: 11, name: 'Rodrigo De Paul', team: 'ARG', position: 'Mediocampista', status: 'repetido', rarity: 'base' },
  { number: 220, name: 'Neymar Jr.', team: 'BRA', position: 'Delantero', status: 'falta', rarity: 'gold' },
  { number: 145, name: 'Rodri', team: 'ESP', position: 'Mediocampista', status: 'tengo', rarity: 'base' },
  { number: 150, name: 'Pedri', team: 'ESP', position: 'Mediocampista', status: 'tengo', rarity: 'base' },
  { number: 152, name: 'Gavi', team: 'ESP', position: 'Mediocampista', status: 'falta', rarity: 'base' },
  { number: 158, name: 'Lamine Yamal', team: 'ESP', position: 'Delantero', status: 'falta', rarity: 'gold' },
  { number: 60, name: 'Jude Bellingham', team: 'ENG', position: 'Mediocampista', status: 'tengo', rarity: 'gold' },
  { number: 64, name: 'Harry Kane', team: 'ENG', position: 'Delantero', status: 'repetido', rarity: 'base' },
  { number: 68, name: 'Bukayo Saka', team: 'ENG', position: 'Delantero', status: 'tengo', rarity: 'base' },
  { number: 300, name: 'Cristiano Ronaldo', team: 'POR', position: 'Delantero', status: 'falta', rarity: 'legend' },
  { number: 305, name: 'Bruno Fernandes', team: 'POR', position: 'Mediocampista', status: 'tengo', rarity: 'base' },
  { number: 309, name: 'Rafael Leão', team: 'POR', position: 'Delantero', status: 'tengo', rarity: 'base' },
  { number: 120, name: 'Jamal Musiala', team: 'GER', position: 'Mediocampista', status: 'falta', rarity: 'gold' },
  { number: 124, name: 'Florian Wirtz', team: 'GER', position: 'Mediocampista', status: 'tengo', rarity: 'base' },
  { number: 118, name: 'Manuel Neuer', team: 'GER', position: 'Portero', status: 'tengo', rarity: 'base' },
  { number: 401, name: 'Kevin De Bruyne', team: 'BEL', position: 'Mediocampista', status: 'repetido', rarity: 'gold' },
  { number: 350, name: 'Virgil van Dijk', team: 'NED', position: 'Defensa', status: 'tengo', rarity: 'base' },
  { number: 356, name: 'Cody Gakpo', team: 'NED', position: 'Delantero', status: 'falta', rarity: 'base' },
  { number: 430, name: 'Luka Modrić', team: 'CRO', position: 'Mediocampista', status: 'tengo', rarity: 'legend' },
  { number: 480, name: 'Christian Pulisic', team: 'USA', position: 'Delantero', status: 'tengo', rarity: 'base' },
  { number: 470, name: 'Hirving Lozano', team: 'MEX', position: 'Delantero', status: 'falta', rarity: 'base' },
  { number: 472, name: 'Santiago Giménez', team: 'MEX', position: 'Delantero', status: 'tengo', rarity: 'base' },
  { number: 460, name: 'Federico Valverde', team: 'URU', position: 'Mediocampista', status: 'repetido', rarity: 'base' },
  { number: 200, name: 'Erling Haaland', team: 'NOR', position: 'Delantero', status: 'falta', rarity: 'gold' },
]

// Headline album stats (412 owned of 994). Owned = tengo + repetido.
export const ALBUM_STATS = {
  total: 994,
  owned: 412,
  tengo: 358,
  repetido: 54,
  falta: 582,
  matches: 12,
}

// The four cromos highlighted on the dashboard ("Tus Cromos Destacados").
export const dashboardFeatured = FEATURED_STICKERS.slice(0, 4)

// ===== Full 994-card album =====
// Generated deterministically: the 30 featured cromos keep their data, the rest
// are filler cards. Status counts are forced to match ALBUM_STATS exactly so the
// grid filters line up with the dashboard numbers.
const TEAMS = [
  'ARG', 'BRA', 'FRA', 'ESP', 'ENG', 'POR', 'GER', 'NED',
  'BEL', 'CRO', 'URU', 'MEX', 'USA', 'ITA', 'COL', 'JPN',
]
const SURNAMES = [
  'González', 'Rodríguez', 'Fernández', 'Silva', 'Costa', 'Müller', 'Smith', 'Rossi',
  'Dubois', 'Kovač', 'Pérez', 'Santos', 'Nakamura', 'Okafor', 'Jansen', 'Ferrari',
  'Hansen', 'Torres', 'Romero', 'Bianchi', 'Walker', 'Schmidt', 'Moreno', 'Ibáñez',
]
const POSITIONS = ['Portero', 'Defensa', 'Mediocampista', 'Delantero']

// Small seedable PRNG so the album is identical on every render.
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildAlbum() {
  const featuredByNumber = new Map(FEATURED_STICKERS.map((s) => [s.number, s]))
  const countFeatured = (status) => FEATURED_STICKERS.filter((s) => s.status === status).length

  // Status pool for the filler cards: exact remaining counts after the featured ones.
  const pool = [
    ...Array(ALBUM_STATS.tengo - countFeatured('tengo')).fill('tengo'),
    ...Array(ALBUM_STATS.repetido - countFeatured('repetido')).fill('repetido'),
    ...Array(ALBUM_STATS.falta - countFeatured('falta')).fill('falta'),
  ]

  const rng = mulberry32(2026)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  const perTeam = Math.ceil(ALBUM_STATS.total / TEAMS.length)
  const stickers = []
  let poolIdx = 0

  for (let n = 1; n <= ALBUM_STATS.total; n++) {
    const featured = featuredByNumber.get(n)
    if (featured) {
      stickers.push({ id: n, ...featured })
      continue
    }
    stickers.push({
      id: n,
      number: n,
      name: SURNAMES[n % SURNAMES.length],
      team: TEAMS[Math.min(Math.floor((n - 1) / perTeam), TEAMS.length - 1)],
      position: POSITIONS[n % POSITIONS.length],
      status: pool[poolIdx++] ?? 'falta',
      rarity: rng() < 0.06 ? 'gold' : 'base',
    })
  }

  return stickers
}

// The complete 994-card album. Real app: GET /api/album.
export const STICKERS = buildAlbum()
