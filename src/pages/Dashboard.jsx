import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import StatCard from '../components/StatCard'
import StickerCard from '../components/StickerCard'
import MatchSuggestionCard from '../components/MatchSuggestionCard'
import { currentUser } from '../data/users'
import { ALBUM_STATS, dashboardFeatured } from '../data/stickers'
import { matchSuggestions } from '../data/matches'

// Collector hub. Lives inside AppLayout (sidebar + ml-64 main).
function Dashboard() {
  const firstName = currentUser.name.split(' ')[0]
  const progress = Math.round((ALBUM_STATS.owned / ALBUM_STATS.total) * 100)

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
                {ALBUM_STATS.owned}/{ALBUM_STATS.total} ({progress}%)
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
              <StatCard tone="primary" icon="content_copy" value={ALBUM_STATS.repetido} label="Cromos Repetidos" chip="Inventario" />
              <StatCard tone="tertiary" icon="bookmark_add" value={ALBUM_STATS.falta} label="Cromos Faltantes" chip="Faltantes" />
              <StatCard tone="secondary" icon="handshake" value={ALBUM_STATS.matches} label="Matches Disponibles" chip="Activo" />
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
                {dashboardFeatured.map((sticker) => (
                  <StickerCard key={sticker.number} sticker={sticker} />
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
                {matchSuggestions.map((match) => (
                  <MatchSuggestionCard key={match.id} match={match} />
                ))}
              </div>

              {/* Premium promo */}
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
                      Explorar Pro
                    </Link>
                  </div>
                  <Icon name="radar" className="absolute -bottom-4 -right-4 rotate-12 !text-[128px] text-primary/10" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
