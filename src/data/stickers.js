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
