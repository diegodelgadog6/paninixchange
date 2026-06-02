import { useState } from 'react'
import Icon from '../components/Icon'
import StarRating from '../components/StarRating'
import RatingModal from '../components/RatingModal'
import { profile } from '../data/profile'

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
  const [rateOpen, setRateOpen] = useState(false)
  const lastPartner = profile.tradeHistory[0]?.partner ?? 'el coleccionista'

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

          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="rounded-lg bg-primary-container px-6 py-2.5 text-label-md text-white transition-opacity hover:opacity-90"
            >
              Contactar Coleccionista
            </button>
            <button
              type="button"
              className="rounded-lg border border-outline-variant/40 px-6 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              Compartir Perfil
            </button>
          </div>
        </header>

        {/* Badges + history */}
        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-4">
            <div className="rounded-xl border border-outline-variant/10 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-headline-md text-primary">Insignias</h2>
              <div className="space-y-3">
                {profile.badges.map((badge) => (
                  <Badge key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-8">
            <div className="rounded-xl border border-outline-variant/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-headline-md text-primary">Historial de Intercambios</h2>
                <button
                  type="button"
                  onClick={() => setRateOpen(true)}
                  className="flex items-center gap-1 text-label-md text-primary hover:underline"
                >
                  <Icon name="rate_review" className="!text-[18px]" />
                  Calificar reciente
                </button>
              </div>
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
                        <StarRating value={row.rating} starClass="!text-[14px]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Stat tiles */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {profile.stats.map((stat) => (
            <ProfileStat key={stat.id} stat={stat} />
          ))}
        </div>
      </div>

      <RatingModal open={rateOpen} onClose={() => setRateOpen(false)} partner={lastPartner} />
    </div>
  )
}

export default Perfil
