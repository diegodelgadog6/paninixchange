// Collector profile / reputation data.
// Identity (name, avatar, location, memberSince) comes from the live auth user
// (GET /api/users/me, via useAuth). The collection stat tiles are computed live from
// the real collection (GET /api/cards/album, via useCollection) by buildCollectionStats.
// Reputation comes from GET /api/users/me/reputation (aggregated from real trades and
// reviews). These adapters keep the UI's expected shape — only the source is the API.
const MONTHS_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

// "12 Nov 2025" from an ISO timestamp; empty string if unparseable.
function formatHistoryDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()} ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`
}

// Merges the live identity (from useAuth) with the reputation aggregate (from
// fetchReputation) into the shape the Perfil page consumes.
export const buildProfile = (user, reputation) => ({
  name: user.name,
  avatar: user.avatar,
  location: user.location,
  memberSince: user.memberSince,

  rating: reputation.rating,
  reviews: reputation.reviews,
  successfulTrades: reputation.successful_trades,
  level: reputation.level,
  points: reputation.points,

  // Backend badges already carry { id, icon, title, desc }.
  badges: reputation.badges,

  tradeHistory: reputation.history.map((h) => ({
    id: h.id,
    date: formatHistoryDate(h.date),
    partner: h.partner,
    cromos: `${h.cromo_count} ${h.cromo_count === 1 ? 'cromo' : 'cromos'}`,
    rating: h.my_rating, // null until the user rates this trade
    status: h.status,
  })),
})

const fmt = (n) => n.toLocaleString('es-MX')
const cardCode = (n) => `#${String(n).padStart(3, '0')}`

// The "Puntos de Honor" stat tile, now fed by real reputation (points + level).
export function buildPointsTile(reputation) {
  return {
    id: 's4',
    label: 'Puntos de Honor',
    value: fmt(reputation.points),
    sub: `Nivel: ${reputation.level}`,
    tone: 'gold',
  }
}

// The four headline stat tiles, computed live from the user's real collection.
// `collection` is the value returned by useCollection() ({ stickers, stats }).
export function buildCollectionStats({ stickers, stats }) {
  const totalCopies = stickers.reduce((acc, s) => acc + s.copies, 0)
  const spares = stickers.reduce((acc, s) => acc + Math.max(s.copies - 1, 0), 0)
  const spareNumbers = stickers
    .filter((s) => s.copies >= 2)
    .map((s) => s.number)
    .sort((a, b) => a - b)
  const progress = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0

  // "#012 · #034 · #056 (+N)" — a small preview of which cards are spare.
  const previewNumbers = spareNumbers.slice(0, 3).map(cardCode).join(' · ')
  const extra = spareNumbers.length - 3
  const spareSub = spareNumbers.length
    ? `${previewNumbers}${extra > 0 ? ` (+${extra})` : ''}`
    : 'Aún sin repetidos'

  return [
    {
      id: 's1',
      label: 'Cromos en Colección',
      value: fmt(totalCopies),
      sub: `${fmt(stats.owned)} cromos únicos`,
      tone: 'solid',
    },
    {
      id: 's2',
      label: 'Repetidos Disponibles',
      value: fmt(spares),
      sub: spareSub,
      tone: 'default',
    },
    {
      id: 's3',
      label: 'Progreso del Álbum',
      value: `${progress}%`,
      sub: `${fmt(stats.owned)}/${fmt(stats.total)} cromos`,
      tone: 'default',
    },
    // The 4th tile (Puntos de Honor) is built from reputation via buildPointsTile.
  ]
}
