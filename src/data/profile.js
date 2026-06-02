import { currentUser } from './users'

// Collector profile / reputation data.
// Real app: GET /api/users/:id with aggregated reputation (rating, trades, badges).
export const profile = {
  name: currentUser.name,
  avatar: currentUser.avatar,
  location: currentUser.location,
  memberSince: currentUser.memberSince,
  rating: 4.8,
  reviews: 42,
  successfulTrades: 124,
  level: 'Diamante',

  badges: [
    { id: 'b1', icon: 'verified', title: 'Intercambiador confiable', desc: 'Sin incidencias en 50+ envíos.' },
    { id: 'b2', icon: 'military_tech', title: 'Veterano del álbum', desc: 'Coleccionista activo por 5 años.' },
    { id: 'b3', icon: 'workspace_premium', title: 'Completista', desc: '3 álbumes mundiales al 100%.' },
  ],

  stats: [
    { id: 's1', label: 'Cromos en Colección', value: '1,402', sub: '+12 esta semana', tone: 'solid' },
    { id: 's2', label: 'Repetidos Disponibles', value: '345', sub: '#42 · #10 · #21 (+342)', tone: 'default' },
    { id: 's3', label: 'Álbumes Activos', value: '4', sub: '85% progreso promedio', tone: 'default' },
    { id: 's4', label: 'Puntos de Honor', value: '8,450', sub: 'Nivel: Diamante', tone: 'gold' },
  ],

  tradeHistory: [
    { id: 'h1', date: '12 Nov 2025', partner: 'Roberto M.', cromos: '1 (FIFA 2026)', rating: 5 },
    { id: 'h2', date: '08 Nov 2025', partner: 'Elena L.', cromos: '5 (Champions League)', rating: 4 },
    { id: 'h3', date: '02 Nov 2025', partner: 'Juan C.', cromos: '24 (Copa Oro)', rating: 5 },
    { id: 'h4', date: '28 Oct 2025', partner: 'Sofía R.', cromos: '3 (Mundial 2026)', rating: 5 },
    { id: 'h5', date: '21 Oct 2025', partner: 'Andrés P.', cromos: '7 (Eurocopa)', rating: 4 },
  ],
}
