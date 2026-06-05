import { Suspense, lazy } from 'react'
import Icon from '../components/Icon'
import UserMatchCard from '../components/UserMatchCard'
import RadarSetup from '../components/RadarSetup'
import ErrorBoundary from '../components/ErrorBoundary'
import { useRadar } from '../hooks/useRadar'

// Shown when the map subtree throws (e.g. Leaflet CDN blocked) so the page keeps
// working — the nearby-collectors panel still renders on top of this.
const mapFallback = (
  <div className="absolute inset-0 flex items-center justify-center bg-surface-bright">
    <div className="mx-4 max-w-sm rounded-2xl bg-white/90 p-6 text-center shadow-lg">
      <Icon name="map" className="mb-2 !text-[40px] text-outline-variant" />
      <p className="text-label-sm text-on-surface-variant">
        No se pudo cargar el mapa. Revisa tu conexión e inténtalo de nuevo.
      </p>
    </div>
  </div>
)

// RadarMap uses Leaflet (loaded via CDN) — lazy-load so it never blocks
// pages that don't need a map.
const RadarMap = lazy(() => import('../components/RadarMap'))

function Radar() {
  const {
    search,
    hasLocation,
    loading,
    allMatches,
    visible,
    showSetup,
    confirmDelete,
    confirmSearch,
    deleteSearch,
    openSetup,
    setShowSetup,
    setConfirmDelete,
  } = useRadar()

  return (
    <div className="relative flex h-screen flex-col">
      {showSetup && (
        <RadarSetup
          initial={search}
          onConfirm={confirmSearch}
          onClose={hasLocation ? () => setShowSetup(false) : null}
        />
      )}

      {/* Top bar */}
      <div className="z-20 flex items-center gap-4 border-b border-outline-variant/10 bg-surface/95 px-8 py-4 backdrop-blur-md">
        <div className="relative max-w-md flex-1">
          <Icon name="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            readOnly
            value={search?.city ?? ''}
            placeholder="Sin ubicación configurada"
            className="h-11 w-full cursor-default rounded-xl border border-outline-variant/30 bg-white pl-10 pr-4 text-body-md shadow-sm focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {hasLocation ? (
            confirmDelete ? (
              <div className="flex items-center gap-2 rounded-xl border border-error/30 bg-error/5 px-4 py-2">
                <span className="text-label-sm text-error">¿Eliminar ubicación?</span>
                <button type="button" onClick={deleteSearch}
                  className="rounded bg-error px-2 py-1 text-[10px] font-bold text-white hover:opacity-80">
                  Sí
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)}
                  className="rounded border border-outline-variant/40 px-2 py-1 text-[10px] font-bold text-on-surface-variant hover:bg-surface-container">
                  No
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 rounded-xl border border-outline-variant/20 bg-white px-3 py-2 shadow-sm">
                  <Icon name="radar" className="!text-[16px] text-primary" />
                  <span className="text-label-sm text-on-surface-variant">{search.radius} km</span>
                </div>
                <button type="button" onClick={openSetup}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-white transition-all hover:bg-primary-container active:scale-[0.98]">
                  <Icon name="edit_location" className="!text-[18px]" />
                  Cambiar
                </button>
                <button type="button" aria-label="Eliminar ubicación" onClick={() => setConfirmDelete(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/20 bg-white text-on-surface-variant shadow-sm transition-colors hover:border-error/40 hover:bg-error/5 hover:text-error">
                  <Icon name="delete" className="!text-[20px]" />
                </button>
              </>
            )
          ) : (
            <button type="button" onClick={openSetup}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-white transition-all hover:bg-primary-container active:scale-[0.98]">
              <Icon name="add_location" className="!text-[20px]" />
              Agregar ubicación
            </button>
          )}
        </div>
      </div>

      {/* Map + overlays */}
      <div className="relative flex-1 overflow-hidden">

        {/* ── Leaflet map ── */}
        {hasLocation ? (
          <ErrorBoundary fallback={mapFallback}>
            <Suspense fallback={<div className="absolute inset-0 bg-surface-bright" />}>
              <RadarMap
                lat={search.lat}
                lng={search.lng}
                radiusKm={search.radius}
                city={search.city}
              />
            </Suspense>
          </ErrorBoundary>
        ) : (
          /* Placeholder when no location is set */
          <div className="absolute inset-0 bg-surface-bright">
            <div className="absolute inset-0 flex items-center justify-center bg-surface/60 backdrop-blur-sm">
              <div className="mx-4 max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
                <Icon name="radar" className="mb-4 !text-[48px] text-primary" />
                <h3 className="mb-2 text-headline-md text-primary">Activa el Trade Radar</h3>
                <p className="mb-6 text-label-sm text-on-surface-variant">
                  Para ver coleccionistas cercanos necesitas definir tu zona de búsqueda.
                </p>
                <button type="button" onClick={openSetup}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md text-white transition-all hover:bg-primary-container">
                  <Icon name="add_location" className="!text-[20px]" />
                  Agregar mi ubicación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nearby traders panel */}
        <aside className="absolute bottom-6 left-6 top-6 z-10 flex w-[360px] flex-col rounded-xl border border-outline-variant/20 bg-white shadow-xl">
          <div className="border-b border-outline-variant/10 p-4">
            <h2 className="text-headline-md text-primary">Coleccionistas Cercanos</h2>
            <p className="text-label-sm text-on-surface-variant">
              {!hasLocation
                ? 'Configura tu ubicación para comenzar'
                : loading
                  ? 'Buscando coleccionistas cercanos…'
                  : `${visible.length} coleccionistas compatibles en ${search.radius} km`}
            </p>
          </div>

          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
            {!hasLocation ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
                <Icon name="lock" className="!text-[40px] text-outline-variant" />
                <p className="text-label-sm text-on-surface-variant">
                  Agrega tu ubicación para descubrir coleccionistas cercanos.
                </p>
              </div>
            ) : loading ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
                  role="status" aria-label="Buscando coleccionistas" />
                <p className="text-label-sm text-on-surface-variant">
                  Cruzando tu colección con los coleccionistas cercanos…
                </p>
              </div>
            ) : visible.length === 0 ? (
              <p className="rounded-lg border border-dashed border-outline-variant/40 px-4 py-6 text-center text-label-sm text-on-surface-variant">
                Sin coleccionistas compatibles en este radio. Amplía el radio o marca tus
                repetidos y faltantes en el álbum.
              </p>
            ) : (
              visible.map((match) => (
                <UserMatchCard key={match.collector.id} match={match} />
              ))
            )}
          </div>

          {hasLocation && (
            <div className="border-t border-outline-variant/10 p-4">
              <button type="button"
                className="w-full rounded-lg border border-outline-variant/40 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container">
                Ver todos los compatibles ({allMatches.length})
              </button>
            </div>
          )}
        </aside>

        {/* Zoom controls — wired to Leaflet via window helpers set in RadarMap */}
        {hasLocation && (
          <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
            <button type="button" aria-label="Acercar"
              onClick={() => window.__radarMapZoomIn?.()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/20 bg-white shadow-sm transition-colors hover:bg-surface-container">
              <Icon name="add" className="text-on-surface" />
            </button>
            <button type="button" aria-label="Alejar"
              onClick={() => window.__radarMapZoomOut?.()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/20 bg-white shadow-sm transition-colors hover:bg-surface-container">
              <Icon name="remove" className="text-on-surface" />
            </button>
            <button type="button" aria-label="Mi ubicación"
              onClick={() => window.__radarMapCenter?.()}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm transition-colors hover:bg-primary-container">
              <Icon name="my_location" className="!text-[20px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Radar
