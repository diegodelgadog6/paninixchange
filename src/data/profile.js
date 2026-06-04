// Collector profile / reputation data.
// Identity (name, avatar, location, memberSince) comes from the live auth user
// (GET /api/users/me, via useAuth). The collection stat tiles are computed live from
// the real collection (GET /api/cards/album, via useCollection) by buildCollectionStats.
//
// Reputation below (rating, reviews, successfulTrades, level, badges, tradeHistory)
// has NO backend yet — there's no completed-trade or rating data to aggregate — so it
// stays a clearly-marked placeholder until a reputation endpoint exists.
export const buildProfile = (user) => ({
  name: user.name,
  avatar: user.avatar,
  location: user.location,
  memberSince: user.memberSince,

  // --- PLACEHOLDER reputation (no backend yet) ---
  rating: 4.8,
  reviews: 42,
  successfulTrades: 124,
  level: 'Diamante',

  badges: [
    { id: 'b1', icon: 'verified', title: 'Intercambiador confiable', desc: 'Sin incidencias en 50+ envíos.' },
    { id: 'b2', icon: 'military_tech', title: 'Veterano del álbum', desc: 'Coleccionista activo por 5 años.' },
    { id: 'b3', icon: 'workspace_premium', title: 'Completista', desc: '3 álbumes mundiales al 100%.' },
  ],

  tradeHistory: [
    { id: 'h1', date: '12 Nov 2025', partner: 'Roberto M.', cromos: '1 (FIFA 2026)', rating: 5 },
    { id: 'h2', date: '08 Nov 2025', partner: 'Elena L.', cromos: '5 (Champions League)', rating: 4 },
    { id: 'h3', date: '02 Nov 2025', partner: 'Juan C.', cromos: '24 (Copa Oro)', rating: 5 },
    { id: 'h4', date: '28 Oct 2025', partner: 'Sofía R.', cromos: '3 (Mundial 2026)', rating: 5 },
    { id: 'h5', date: '21 Oct 2025', partner: 'Andrés P.', cromos: '7 (Eurocopa)', rating: 4 },
  ],
})

const fmt = (n) => n.toLocaleString('es-MX')
const cardCode = (n) => `#${String(n).padStart(3, '0')}`

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
    // PLACEHOLDER — Honor points need the reputation backend (see buildProfile).
    { id: 's4', label: 'Puntos de Honor', value: '8,450', sub: 'Nivel: Diamante', tone: 'gold' },
  ]
}
