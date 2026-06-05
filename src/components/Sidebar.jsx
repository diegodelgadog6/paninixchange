import { NavLink, Link, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useMatches } from '../context/MatchesContext'

// Primary navigation for the logged-in app shell. Active route is highlighted
// in golden accent, matching the Stitch dashboard/radar mockups.
// `badge` keys into the live counts resolved below (red dot for unseen invitations).
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/album', label: 'Álbum Digital', icon: 'menu_book' },
  { to: '/radar', label: 'Trade Radar', icon: 'radar' },
  { to: '/matches', label: 'Mis Matches', icon: 'swap_horiz', badge: 'matches' },
  { to: '/perfil', label: 'Perfil', icon: 'group' },
]

function Sidebar() {
  const { user, logout } = useAuth()
  const { unseenCount } = useMatches()
  const navigate = useNavigate()
  const badgeCounts = { matches: unseenCount }

  const onLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-primary text-on-primary flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6">
        <Logo variant="light" withIcon className="text-headline-md" />
      </div>

      {/* Collector chip */}
      <Link
        to="/perfil"
        className="mx-4 mb-4 flex items-center gap-3 rounded-lg px-3 py-3 hover:bg-white/5 transition-colors"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="h-9 w-9 rounded-full border-2 border-secondary-container object-cover"
        />
        <div className="leading-tight">
          <p className="text-label-md text-secondary-container">{user.membership}</p>
          <p className="text-label-sm text-on-primary-container">Collector Profile</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const count = item.badge ? badgeCounts[item.badge] : 0
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-label-md transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-primary font-semibold'
                    : 'text-primary-fixed-dim hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="relative flex shrink-0">
                <Icon name={item.icon} className="!text-[20px]" />
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-on-error">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </span>
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-4 py-4 space-y-1 border-t border-white/10">
        <Link
          to="/perfil?config=1"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-label-md text-primary-fixed-dim hover:bg-white/5 hover:text-white transition-colors"
        >
          <Icon name="settings" className="!text-[20px]" />
          Configuración
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-label-md text-primary-fixed-dim hover:bg-white/5 hover:text-white transition-colors"
        >
          <Icon name="logout" className="!text-[20px]" />
          Cerrar sesión
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-label-md text-primary-fixed-dim hover:bg-white/5 hover:text-white transition-colors"
        >
          <Icon name="help" className="!text-[20px]" />
          Support
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
