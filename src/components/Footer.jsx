import Logo from './Logo'

// Public footer used on the landing and premium pages.
function Footer() {
  const linkClass = 'text-on-surface-variant hover:text-secondary transition-colors text-label-sm'

  return (
    <footer className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low border-t border-outline-variant/20">
      <div className="flex flex-col items-center md:items-start">
        <Logo className="text-headline-md mb-1" />
        <p className="text-label-sm text-on-surface-variant">© 2026 PaniniXchange. All rights reserved.</p>
      </div>
      <nav className="flex gap-6">
        <a className={linkClass} href="#">Privacy Policy</a>
        <a className={linkClass} href="#">Terms of Service</a>
        <a className={linkClass} href="#">Cookie Policy</a>
      </nav>
    </footer>
  )
}

export default Footer
