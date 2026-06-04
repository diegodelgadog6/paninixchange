import { Link } from 'react-router-dom'
import Logo from './Logo'

// Centered card layout shared by the Login and Register pages.
// Keeps the public auth screens visually consistent (pitch-green panel + form card)
// without pulling in the full app shell.
function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-container-low">
      <header className="flex h-20 items-center px-8 md:px-12">
        <Link to="/" aria-label="PaniniXchange — inicio">
          <Logo className="text-headline-md" />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-outline-variant/10 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-headline-lg text-primary">{title}</h1>
            <p className="text-body-md text-on-surface-variant">{subtitle}</p>
          </div>
          {children}
          {footer && <div className="mt-6 text-center text-label-md text-on-surface-variant">{footer}</div>}
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
