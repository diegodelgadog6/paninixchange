import { NavLink, Link } from 'react-router-dom'
import Icon from './Icon'
import Logo from './Logo'
import { currentUser } from '../data/users'

// Primary navigation for the logged-in app shell. Active route is highlighted
// in golden accent, matching the Stitch dashboard/radar mockups.
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/album', label: 'Álbum Digital', icon: 'menu_book' },
  { to: '/radar', label: 'Trade Radar', icon: 'radar' },
  { to: '/negociacion', label: 'Mis Matches', icon: 'swap_horiz' },
  { to: '/perfil', label: 'Comunidad', icon: 'group' },
]

function Sidebar() {
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
          src={currentUser.avatar}
          alt={currentUser.name}
          className="h-9 w-9 rounded-full border-2 border-secondary-container object-cover"
        />
        <div className="leading-tight">
          <p className="text-label-md text-secondary-container">{currentUser.membership}</p>
          <p className="text-label-sm text-on-primary-container">Collector Profile</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
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
            <Icon name={item.icon} className="!text-[20px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-4 py-4 space-y-1 border-t border-white/10">
        <Link
          to="/radar"
          className="mb-2 flex items-center justify-center gap-2 rounded-lg bg-secondary-container px-3 py-2.5 text-label-md font-semibold text-primary hover:bg-secondary-fixed-dim transition-colors"
        >
          <Icon name="add" className="!text-[20px]" />
          Start New Swap
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-label-md text-primary-fixed-dim hover:bg-white/5 hover:text-white transition-colors"
        >
          <Icon name="settings" className="!text-[20px]" />
          Settings
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
