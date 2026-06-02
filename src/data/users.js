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
// Real app: GET /api/radar?lat=&lng=&radius= — the engine returns compatible
// collectors within range. `map` holds mock screen coordinates for the pins
// (a real Google Maps instance would place markers from lat/lng instead).
export const nearbyUsers = [
  { id: 'n-01', username: '@Goles2026', name: 'Goles 2026', avatar: traderAvatar('Goles 2026'), distanceKm: 1.2, compatibility: 88, tags: ['Tiene 12 que necesitas', 'Oro raro x2'], map: { top: '32%', left: '54%' } },
  { id: 'n-02', username: '@AlbumMaster', name: 'Album Master', avatar: traderAvatar('Album Master'), distanceKm: 3.5, compatibility: 92, tags: ['Tiene 4 que necesitas', 'Completista'], map: { top: '63%', left: '40%' } },
  { id: 'n-03', username: '@StickerHunter', name: 'Sticker Hunter', avatar: traderAvatar('Sticker Hunter'), distanceKm: 5.1, compatibility: 74, tags: ['Tiene 25 que necesitas', 'Volumen alto'], map: { top: '24%', left: '74%' } },
  { id: 'n-04', username: '@MundialFan26', name: 'Mundial Fan', avatar: traderAvatar('Mundial Fan'), distanceKm: 0.8, compatibility: 81, tags: ['Tiene 6 que necesitas', 'Nuevo'], map: { top: '48%', left: '46%' } },
  { id: 'n-05', username: '@CromoKing', name: 'Cromo King', avatar: traderAvatar('Cromo King'), distanceKm: 6.7, compatibility: 69, tags: ['Tiene 18 que necesitas'], map: { top: '70%', left: '66%' } },
  { id: 'n-06', username: '@LaAlbiceleste', name: 'La Albiceleste', avatar: traderAvatar('La Albiceleste'), distanceKm: 2.3, compatibility: 85, tags: ['Tiene 9 que necesitas', 'Oro x1'], map: { top: '40%', left: '30%' } },
  { id: 'n-07', username: '@PaniniPro', name: 'Panini Pro', avatar: traderAvatar('Panini Pro'), distanceKm: 8.9, compatibility: 77, tags: ['Tiene 14 que necesitas'], map: { top: '78%', left: '50%' } },
  { id: 'n-08', username: '@CanjeMX', name: 'Canje MX', avatar: traderAvatar('Canje MX'), distanceKm: 4.4, compatibility: 90, tags: ['Tiene 5 que necesitas', 'Confiable'], map: { top: '54%', left: '72%' } },
]
