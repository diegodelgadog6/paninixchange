import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import StarRating from '../components/StarRating'
import RatingModal from '../components/RatingModal'
import { buildProfile, buildCollectionStats, buildPointsTile } from '../data/profile'
import { createReview, updateMe, cancelSubscription } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useCollection } from '../context/CollectionContext'
import { useReputation } from '../hooks/useReputation'

const STAT_TONES = {
  solid: 'bg-primary text-white',
  gold: 'bg-secondary-container text-primary',
  default: 'bg-surface-container-lowest border border-outline-variant/10 text-primary',
}

function ProfileStat({ stat }) {
  const solid = stat.tone === 'solid' || stat.tone === 'gold'
  return (
    <div className={`rounded-xl p-5 ${STAT_TONES[stat.tone] ?? STAT_TONES.default}`}>
      <p className={`mb-1 text-label-sm ${solid ? 'opacity-80' : 'text-on-surface-variant'}`}>{stat.label}</p>
      <p className="font-display text-display-lg leading-none">{stat.value}</p>
      <p className={`mt-2 text-label-sm ${solid ? 'opacity-80' : 'text-on-surface-variant'}`}>{stat.sub}</p>
    </div>
  )
}

function Badge({ badge }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-outline-variant/10 bg-surface-container-low p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container/20">
        <Icon name={badge.icon} fill className="!text-[22px] text-secondary" />
      </div>
      <div>
        <p className="text-label-md font-bold text-primary">{badge.title}</p>
        <p className="text-label-sm text-on-surface-variant">{badge.desc}</p>
      </div>
    </div>
  )
}

function Perfil() {
  const { user, token, refreshUser } = useAuth()
  const [searchParams] = useSearchParams()
  const collection = useCollection()
  const { reputation, loading: repLoading, error: repError, refresh } = useReputation()
  const [rateOpen, setRateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('config') === '1') setConfigOpen(true)
  }, [searchParams])

  const profile = useMemo(
    () => (reputation ? buildProfile(user, reputation) : null),
    [user, reputation],
  )
  const stats = useMemo(
    () =>
      reputation
        ? [...buildCollectionStats(collection), buildPointsTile(reputation)]
        : [],
    [collection, reputation],
  )

  // The most recent confirmed trade is the one "Calificar reciente" rates.
  const recentTrade = useMemo(
    () => profile?.tradeHistory.find((t) => t.status === 'completed') ?? null,
    [profile],
  )

  const submitReview = async ({ rating, comment }) => {
    await createReview(token, { tradeId: recentTrade.id, rating, comment })
    refresh()
  }

  if (collection.loading || repLoading) return <Spinner />

  if (repError || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <Icon name="error" className="!text-[48px] text-outline-variant" />
        <h2 className="text-headline-md text-primary">No se pudo cargar tu reputación</h2>
        <p className="max-w-sm text-body-md text-on-surface-variant">{repError}</p>
      </div>
    )
  }

  return (
    <div className="p-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Profile header */}
        <header className="mb-8 flex flex-col items-center gap-8 rounded-xl border border-outline-variant/10 bg-white p-8 shadow-sm md:flex-row md:items-start">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-28 w-28 rounded-2xl object-cover"
            />
            <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-secondary-container">
              <Icon name="verified" fill className="!text-[20px] text-primary" />
            </span>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="mb-1 text-headline-lg text-primary">{profile.name}</h1>
            <div className="mb-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-label-md text-on-surface-variant md:justify-start">
              <span className="flex items-center gap-1">
                <Icon name="location_on" className="!text-[18px]" /> {profile.location}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="calendar_month" className="!text-[18px]" /> Miembro desde {profile.memberSince}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <span className="flex items-center gap-2 rounded-full bg-surface-container px-3 py-1">
                <StarRating value={profile.rating} starClass="!text-[16px]" />
                <span className="text-label-md font-bold text-primary">{profile.rating}/5</span>
                <span className="text-label-sm text-on-surface-variant">({profile.reviews} reseñas)</span>
              </span>
              <span className="flex items-center gap-1 text-label-md font-bold text-primary">
                <Icon name="swap_horiz" className="!text-[18px] text-secondary" />
                {profile.successfulTrades} Intercambios exitosos
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 self-center">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="rounded-lg border border-outline-variant/40 px-6 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              Editar Perfil
            </button>
          </div>
        </header>

        {/* Badges + history */}
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-4">
            <div className="rounded-xl border border-outline-variant/10 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-headline-md text-primary">Insignias</h2>
              {profile.badges.length ? (
                <div className="space-y-3">
                  {profile.badges.map((badge) => (
                    <Badge key={badge.id} badge={badge} />
                  ))}
                </div>
              ) : (
                <p className="text-body-md text-on-surface-variant">
                  Completa intercambios para ganar tus primeras insignias.
                </p>
              )}
            </div>
          </section>

          <section className="col-span-12 lg:col-span-8">
            <div className="rounded-xl border border-outline-variant/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-headline-md text-primary">Historial de Intercambios</h2>
                {recentTrade && (
                  <button
                    type="button"
                    onClick={() => setRateOpen(true)}
                    className="flex items-center gap-1 text-label-md text-primary hover:underline"
                  >
                    <Icon name="rate_review" className="!text-[18px]" />
                    Calificar reciente
                  </button>
                )}
              </div>
              {profile.tradeHistory.length ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                      <th className="py-2 font-semibold">Fecha</th>
                      <th className="py-2 font-semibold">Socio</th>
                      <th className="py-2 font-semibold">Cromos</th>
                      <th className="py-2 font-semibold">Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.tradeHistory.map((row, i) => (
                      <tr key={row.id} className={`border-t border-outline-variant/10 ${i % 2 === 1 ? 'bg-primary/5' : ''}`}>
                        <td className="py-3 text-label-md text-on-surface-variant">{row.date}</td>
                        <td className="py-3 text-label-md font-bold text-primary">{row.partner}</td>
                        <td className="py-3 text-label-md text-on-surface">{row.cromos}</td>
                        <td className="py-3">
                          {row.rating ? (
                            <StarRating value={row.rating} starClass="!text-[14px]" />
                          ) : (
                            <span className="text-label-sm text-on-surface-variant">Sin calificar</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="py-6 text-center text-body-md text-on-surface-variant">
                  Aún no tienes intercambios. Encuentra un trato en el Radar.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Stat tiles */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <ProfileStat key={stat.id} stat={stat} />
          ))}
        </div>
      </div>

      <RatingModal
        open={rateOpen}
        onClose={() => setRateOpen(false)}
        partner={recentTrade?.partner ?? 'el coleccionista'}
        onSubmit={submitReview}
      />

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        token={token}
        onSaved={refreshUser}
      />

      <ConfigModal
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        user={user}
        token={token}
        onSaved={refreshUser}
      />
    </div>
  )
}

function EditProfileModal({ open, onClose, user, token, onSaved }) {
  const [username, setUsername] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const passwordMismatch = password !== '' && confirmPassword !== '' && password !== confirmPassword

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (passwordMismatch) return
    setSaving(true)
    setError(null)
    const payload = {}
    if (username !== user?.username) payload.username = username
    if (email !== user?.email) payload.email = email
    if (phone !== (user?.phone ?? '')) payload.phone = phone
    if (password) payload.password = password
    try {
      if (avatarPreview) {
        try { window.localStorage.setItem('pxc:avatar', avatarPreview) } catch {}
      }
      await updateMe(token, payload)
      await onSaved()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-outline-variant/40 bg-surface px-4 py-2.5 text-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary'

  const currentAvatar = avatarPreview ?? user?.avatar

  return (
    <Modal open={open} onClose={onClose} title="Editar Perfil">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Avatar upload */}
        <div className="flex justify-center">
          <label className="group relative cursor-pointer">
            <img
              src={currentAvatar}
              alt="Avatar"
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Icon name="photo_camera" className="!text-[24px] text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        <div>
          <label className="mb-1 block text-label-md text-on-surface-variant">Nombre de usuario</label>
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-1 block text-label-md text-on-surface-variant">Correo electrónico</label>
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-label-md text-on-surface-variant">Número de WhatsApp</label>
          <input
            type="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="+52 55 1234 5678"
          />
          <p className="mt-1 text-label-sm text-on-surface-variant/70">
            Solo se comparte con tu socio de intercambio tras confirmar el trato.
          </p>
        </div>
        <div>
          <label className="mb-1 block text-label-md text-on-surface-variant">
            Nueva contraseña <span className="text-on-surface-variant/60">(dejar vacío para no cambiar)</span>
          </label>
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="mb-1 block text-label-md text-on-surface-variant">Confirmar contraseña</label>
          <input
            type="password"
            className={`${inputClass} ${passwordMismatch ? 'border-error focus:border-error focus:ring-error' : ''}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          {passwordMismatch && (
            <p className="mt-1 text-label-sm text-error">Las contraseñas no coinciden</p>
          )}
        </div>
        {error && <p className="text-label-md text-error">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-label-md text-on-surface-variant hover:bg-surface-container"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || passwordMismatch}
            className="rounded-lg bg-primary px-5 py-2.5 text-label-md font-bold text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

const PLAN_LABELS = { free: 'Gratis', pro: 'Pro', leyenda: 'Leyenda' }
const PLAN_ICONS = { free: 'workspace_premium', pro: 'star', leyenda: 'military_tech' }
const PLAN_FEATURES = {
  free: ['Álbum digital de 994 cromos', 'Radar hasta 5 km', '3 intercambios al mes'],
  pro: ['Radar ilimitado hasta 15 km', 'Matches automáticos en tiempo real', 'Intercambios ilimitados', 'Insignia Pro'],
  leyenda: ['Todo lo de Pro', 'Acceso anticipado a cromos especiales', 'Analítica avanzada', 'Soporte prioritario 24/7'],
}

function ConfigModal({ open, onClose, user, token, onSaved }) {
  const navigate = useNavigate()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState(null)

  const plan = user?.membershipCode ?? 'free'

  const handleCancel = async () => {
    setCancelling(true)
    setError(null)
    try {
      await cancelSubscription(token)
      await onSaved()
      setConfirmCancel(false)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Configuración">
      {/* Current plan card */}
      <div className="mb-4 rounded-xl bg-surface-container-low p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-container/20">
            <Icon name={PLAN_ICONS[plan] ?? 'workspace_premium'} fill className="!text-[22px] text-secondary" />
          </div>
          <div>
            <p className="text-label-sm text-on-surface-variant">Plan actual</p>
            <p className="text-headline-sm font-bold text-primary">{PLAN_LABELS[plan] ?? plan}</p>
          </div>
        </div>
        <ul className="space-y-1">
          {(PLAN_FEATURES[plan] ?? []).map((f) => (
            <li key={f} className="flex items-center gap-2 text-label-md text-on-surface-variant">
              <Icon name="check" className="!text-[16px] text-secondary" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        {plan === 'free' && (
          <button
            type="button"
            onClick={() => { onClose(); navigate('/premium') }}
            className="w-full rounded-lg bg-primary py-2.5 text-label-md font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Ver planes
          </button>
        )}
        {plan === 'pro' && (
          <button
            type="button"
            onClick={() => { onClose(); navigate('/premium') }}
            className="w-full rounded-lg bg-primary py-2.5 text-label-md font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Mejorar a Leyenda
          </button>
        )}
        {plan === 'leyenda' && (
          <button
            type="button"
            onClick={() => { onClose(); navigate('/premium') }}
            className="w-full rounded-lg bg-primary py-2.5 text-label-md font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Cambiar a Pro
          </button>
        )}
        {plan !== 'free' && !confirmCancel && (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="w-full rounded-lg border border-error/40 py-2.5 text-label-md text-error hover:bg-error/5 transition-colors"
          >
            Cancelar suscripción
          </button>
        )}
      </div>
      {confirmCancel && (
        <div className="mt-2 rounded-xl border border-error/30 bg-error/5 p-4">
          <p className="mb-1 text-label-md font-bold text-error">
            ¿Cancelar tu suscripción {PLAN_LABELS[plan]}?
          </p>
          <p className="mb-4 text-label-sm text-on-surface-variant">
            Perderás acceso a las funciones premium al final del período actual.
          </p>
          {error && <p className="mb-3 text-label-sm text-error">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="flex-1 rounded-lg border border-outline-variant/40 py-2 text-label-md text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 rounded-lg bg-error py-2 text-label-md font-bold text-white hover:bg-error/90 disabled:opacity-60 transition-colors"
            >
              {cancelling ? 'Cancelando…' : 'Sí, cancelar'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default Perfil
