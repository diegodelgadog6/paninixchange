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
