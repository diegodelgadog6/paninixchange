import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { useAuth } from '../context/AuthContext'
import { createTrade } from '../lib/api'

// Nearby collector card for the Trade Radar.
// `match` comes from the matching engine (GET /api/radar/matches):
//   { collector, theyOffer[], iOffer[], goldCount, compatibility }
// Tags are derived from live counts instead of hardcoded strings.
// `collector.demo` marks simulated data — shown as a subtle "Prueba" chip.
function UserMatchCard({ match }) {
  const { collector, theyOffer, iOffer, goldCount, compatibility } = match
  const { username, name, avatar, distanceKm, demo } = collector
  const { token } = useAuth()
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const secondaryTag =
    goldCount > 0
      ? `${goldCount} especiales`
      : iOffer.length > 0
        ? `Le ofreces ${iOffer.length}`
        : null

  const handleSend = async () => {
    if (sending) return
    setSending(true)
    setError(null)
    try {
      await createTrade(token, { receiverId: collector.id })
      navigate('/matches')
    } catch (err) {
      setError(err.message)
      setSending(false)
    }
  }

  return (
    <div className="group rounded-xl border border-outline-variant/20 bg-white p-4 transition-colors hover:border-primary/50">
      <div className="mb-3 flex items-center gap-3">
        <img src={avatar} alt={name} className="h-12 w-12 rounded-lg object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-label-md text-on-surface">{username}</h3>
            {demo && (
              <span className="rounded border border-outline-variant/50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-on-surface-variant">
                Prueba
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-label-sm text-on-surface-variant">
              {distanceKm == null ? 'Comunidad' : `${distanceKm} km`}
            </span>
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
            <span className="text-label-sm font-bold text-primary">{compatibility}% Match</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded border border-primary/10 bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary">
          Tiene {theyOffer.length} que necesitas
        </span>
        {secondaryTag && (
          <span className="rounded border border-secondary-container/20 bg-secondary-container/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
            {secondaryTag}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 rounded bg-error/10 px-2 py-1 text-[11px] text-error">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSend}
        disabled={sending}
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-label-md text-white transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Icon name={sending ? 'progress_activity' : 'send'} className={`!text-[18px] ${sending ? 'animate-spin' : ''}`} />
        {sending ? 'Enviando…' : 'Enviar invitación'}
      </button>
    </div>
  )
}

export default UserMatchCard
