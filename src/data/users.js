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
