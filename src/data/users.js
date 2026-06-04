// Identity of the logged-in collector.
// Real source: GET /api/users/me (see backend UserRead: id, username, email,
// membership, location, created_at). AuthContext hydrates the live user and maps
// it through `toCurrentUser` below; `currentUser` stays as the fallback seed shown
// before hydration resolves and as the canonical shape the UI consumes.
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

// Backend membership codes → user-facing labels (UI shows the label, not the code).
const MEMBERSHIP_LABELS = { free: 'Free Member', pro: 'Pro Member', legend: 'Legend' }

const MONTHS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

// Turns a username into a display name: "mateo_h" → "Mateo H".
// The backend has no real name field yet; derive one until it does.
function displayNameFromUsername(username) {
  return username
    .split(/[_.\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

// "Nov 2025" from an ISO timestamp; empty string if unparseable.
function formatMemberSince(createdAt) {
  const d = new Date(createdAt)
  if (Number.isNaN(d.getTime())) return ''
  return `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`
}

// Maps the backend UserRead into the `currentUser` shape the UI already consumes,
// deriving the fields the API doesn't carry yet (name, avatar). Keeping this here
// preserves the convention: when the backend grows a real name, only this adapter
// changes — never the UI's expected shape.
export function toCurrentUser(apiUser) {
  const name = displayNameFromUsername(apiUser.username)
  return {
    id: apiUser.id,
    username: apiUser.username,
    name,
    email: apiUser.email,
    membership: MEMBERSHIP_LABELS[apiUser.membership] ?? apiUser.membership,
    location: apiUser.location ?? '',
    memberSince: formatMemberSince(apiUser.created_at),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name,
    )}&background=0d3b2e&color=fdcc22&bold=true&size=128`,
  }
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
