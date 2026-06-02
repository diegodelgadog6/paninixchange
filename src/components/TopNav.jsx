import { Link } from 'react-router-dom'
import Logo from './Logo'

// Public top navigation shell, used on the landing and premium pages.
// There is no auth, so "Sign In" / "Register" simply enter the app at /dashboard.
function TopNav() {
  const linkClass = 'text-on-surface-variant hover:text-primary transition-colors text-label-md'

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 h-20 bg-surface/95 backdrop-blur-md border-b border-outline-variant/10">
      <Link to="/" aria-label="PaniniXchange — inicio">
        <Logo className="text-headline-md" />
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        <Link className={linkClass} to="/">How it Works</Link>
        <Link className={linkClass} to="/premium">Pricing</Link>
        <Link className={linkClass} to="/perfil">Community</Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-2 text-primary text-label-md rounded hover:bg-primary/5 transition-all active:scale-[0.98]"
        >
          Sign In
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-2 bg-primary text-on-primary rounded text-label-md hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          Register
        </Link>
      </div>
    </header>
  )
}

export default TopNav
