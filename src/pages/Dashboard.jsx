import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import StatCard from '../components/StatCard'
import StickerCard from '../components/StickerCard'
import Spinner from '../components/Spinner'
import MatchSuggestionCard from '../components/MatchSuggestionCard'
import { FEATURED_IDS } from '../data/stickers'
import { useAuth } from '../context/AuthContext'
import { useCollection } from '../context/CollectionContext'
import { useRadarMatches } from '../context/RadarContext'

// Collector hub. Lives inside AppLayout (sidebar + ml-64 main).
function Dashboard() {
  const { user } = useAuth()
  const membershipCode = user?.membershipCode ?? 'free'
  const { stickers, stats, loading } = useCollection()
  const firstName = user.name.split(' ')[0]
  const progress = stats.total ? Math.round((stats.owned / stats.total) * 100) : 0
  const featured = FEATURED_IDS.map((id) => stickers.find((s) => s.id === id)).filter(Boolean)

  // Match suggestions from the server-side engine (GET /api/radar/matches).
  const { matches, loading: matchesLoading } = useRadarMatches()

  if (loading) return <Spinner />

  return (
    <div className="p-12">
      <div className="mx-auto max-w-[1280px] space-y-8">
        {/* Header + album progress */}
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-1">
            <h2 className="text-headline-lg text-primary">¡Hola, {firstName}!</h2>
            <p className="text-body-md text-on-surface-variant">
              Bienvenido a tu panel de control de PaniniXchange.
            </p>
          </div>
          <div className="max-w-xl flex-1 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-label-md text-primary">Progreso del Álbum</span>
              <span className="text-label-md text-primary">
                {stats.owned}/{stats.total} ({progress}%)
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full border border-outline-variant/10 bg-surface-container">
              <div
                className="h-full rounded-full bg-secondary-container shadow-[0_0_12px_rgba(253,204,34,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Center column */}
          <div className="col-span-12 space-y-6 lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <StatCard tone="primary" icon="content_copy" value={stats.repetido} label="Cromos Repetidos" chip="Inventario" />
              <StatCard tone="tertiary" icon="bookmark_add" value={stats.falta} label="Cromos Faltantes" chip="Faltantes" />
              <StatCard tone="secondary" icon="handshake" value={matches.length} label="Matches Disponibles" chip="Activo" />
            </div>

            {/* Featured cromos */}
            <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-headline-md text-primary">Tus Cromos Destacados</h3>
                <Link to="/album" className="text-label-md text-primary hover:underline">
                  Ver todo
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {featured.map((sticker) => (
                  <StickerCard key={sticker.id} sticker={sticker} />
                ))}
              </div>
            </section>
          </div>

          {/* Right column: match suggestions */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="flex h-full flex-col rounded-xl border border-outline-variant/10 bg-surface-container-low p-4">
              <div className="mb-4 flex items-center gap-2">
                <Icon name="auto_awesome" fill className="text-primary" />
                <h3 className="text-headline-md text-primary">Sugerencias de Match</h3>
              </div>

              <div className="space-y-4">
                {matchesLoading ? (
                  <p className="rounded-lg border border-dashed border-outline-variant/40 px-4 py-6 text-center text-label-sm text-on-surface-variant">
                    Buscando matches cercanos…
                  </p>
                ) : matches.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-outline-variant/40 px-4 py-6 text-center text-label-sm text-on-surface-variant">
                    Sin matches por ahora. Marca tus repetidos y faltantes en el álbum para encontrar intercambios.
                  </p>
                ) : (
                  matches.slice(0, 3).map((match) => (
                    <MatchSuggestionCard key={match.collector.id} match={match} />
                  ))
                )}
              </div>

              {/* Premium promo — hidden for Leyenda members */}
              {membershipCode !== 'leyenda' && (
                <div className="mt-8">
                  <div className="group relative overflow-hidden rounded-xl bg-secondary-container p-6">
                    <div className="relative z-10">
                      <h4 className="mb-2 text-headline-md text-primary">Trade Radar Pro</h4>
                      <p className="mb-4 text-label-md text-on-secondary-container">
                        Encuentra matches a 5km de distancia automáticamente.
                      </p>
                      <Link
                        to="/premium"
                        className="inline-block rounded bg-primary px-4 py-2 text-label-md text-white shadow-sm transition-transform group-hover:scale-105"
                      >
                        {membershipCode === 'pro' ? 'Explorar Leyenda' : 'Explorar Pro'}
                      </Link>
                    </div>
                    <Icon name="radar" className="absolute -bottom-4 -right-4 rotate-12 !text-[128px] text-primary/10" />
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
