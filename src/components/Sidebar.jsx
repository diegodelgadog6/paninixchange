import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useMatches } from '../context/MatchesContext'
import { sendSupportEmail } from '../lib/api'

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
  const [supportOpen, setSupportOpen] = useState(false)

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
          <p className="text-label-md font-semibold text-white">{user.name}</p>
          <p className="text-label-sm text-secondary-container">{user.membership}</p>
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
          onClick={() => setSupportOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-label-md text-primary-fixed-dim hover:bg-white/5 hover:text-white transition-colors"
        >
          <Icon name="help" className="!text-[20px]" />
          Support
        </button>
      </div>

      <SupportModal
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        userEmail={user?.email}
      />
    </aside>
  )
}

const SUBJECTS = [
  'Reporte de bug',
  'Problema con intercambio',
  'Problema con cuenta',
  'Pago o suscripción',
  'Otro',
]

function SupportModal({ open, onClose, userEmail }) {
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      await sendSupportEmail({ subject, message, senderEmail: userEmail })
      setSent(true)
      setMessage('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setSent(false)
    setError(null)
    setMessage('')
    setSubject(SUBJECTS[0])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-headline-md text-primary">Contactar soporte</h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="text-on-surface-variant transition-colors hover:text-primary"
          >
            <Icon name="close" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Icon name="check_circle" fill className="!text-[48px] text-secondary" />
            <p className="text-headline-sm text-primary">¡Mensaje enviado!</p>
            <p className="text-body-md text-on-surface-variant">
              Te responderemos a <span className="font-semibold">{userEmail}</span> a la brevedad.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 rounded-lg bg-primary px-6 py-2.5 text-label-md font-bold text-white hover:bg-primary/90"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-label-md text-on-surface-variant">Asunto</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-outline-variant/40 bg-surface px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-label-md text-on-surface-variant">Mensaje</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe tu problema con el mayor detalle posible…"
                className="w-full resize-none rounded-lg border border-outline-variant/40 bg-surface px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <p className="text-label-sm text-on-surface-variant">
              Responderemos a <span className="font-semibold">{userEmail}</span>
            </p>
            {error && <p className="text-label-sm text-error">{error}</p>}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg px-5 py-2.5 text-label-md text-on-surface-variant hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={sending}
                className="rounded-lg bg-primary px-5 py-2.5 text-label-md font-bold text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {sending ? 'Enviando…' : 'Enviar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Sidebar
