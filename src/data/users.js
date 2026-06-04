// Mock identity of the logged-in collector.
// In the real app this would come from `GET /api/me` once auth is wired up
// (see Server-Postify UserRead: id, username, name, lastname, email, created_at).
// Auth is intentionally NOT implemented — the user is always considered logged in.
export const currentUser = {
  id: 'u-001',
  username: 'mateo_h',
  name: 'Mateo Hernández',
  lastname: 'Hernández',
  email: 'mateo@paninixchange.app',
  membership: 'Elite Member',
  location: 'Ciudad de México',
  memberSince: 'Nov 2025',
  avatar:
    'https://ui-avatars.com/api/?name=Mateo+Hernandez&background=0d3b2e&color=fdcc22&bold=true&size=128',
}

const traderAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ece8e0&color=00241a&bold=true&size=96`

// Nearby collectors shown on the Trade Radar.
// Real app: GET /api/radar?lat=&lng=&radius= returns real collectors within range.
// Fields removed vs. original mock: `compatibility`, `tags` (now derived live by the
// matching engine in src/data/matches.js), `map` (collector positions are never shown
// on the map for privacy — only the current user's pin and search radius are rendered).
// `demo: true` marks simulated data; real backend users won't carry this flag, enabling
// clean filtering/mixing when the backend arrives.
export const nearbyUsers = [
  { id: 'n-01', username: '@Goles2026',    name: 'Goles 2026',    avatar: traderAvatar('Goles 2026'),    distanceKm: 1.2, demo: true },
  { id: 'n-02', username: '@AlbumMaster',  name: 'Album Master',  avatar: traderAvatar('Album Master'),  distanceKm: 3.5, demo: true },
  { id: 'n-03', username: '@StickerHunter',name: 'Sticker Hunter',avatar: traderAvatar('Sticker Hunter'),distanceKm: 5.1, demo: true },
  { id: 'n-04', username: '@MundialFan26', name: 'Mundial Fan',   avatar: traderAvatar('Mundial Fan'),   distanceKm: 0.8, demo: true },
  { id: 'n-05', username: '@CromoKing',    name: 'Cromo King',    avatar: traderAvatar('Cromo King'),    distanceKm: 6.7, demo: true },
  { id: 'n-06', username: '@LaAlbiceleste',name: 'La Albiceleste',avatar: traderAvatar('La Albiceleste'),distanceKm: 2.3, demo: true },
  { id: 'n-07', username: '@PaniniPro',    name: 'Panini Pro',    avatar: traderAvatar('Panini Pro'),    distanceKm: 8.9, demo: true },
  { id: 'n-08', username: '@CanjeMX',      name: 'Canje MX',      avatar: traderAvatar('Canje MX'),      distanceKm: 4.4, demo: true },
]
