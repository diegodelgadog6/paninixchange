import { useState } from 'react'
import Icon from '../components/Icon'
import UserMatchCard from '../components/UserMatchCard'
import { nearbyUsers } from '../data/users'

function Radar() {
  const [radius, setRadius] = useState(5.2)
  const circleSize = `${120 + radius * 18}px`
  const visibleUsers = nearbyUsers.filter((u) => u.distanceKm <= radius)

  return (
    <div className="relative flex h-screen flex-col">
      {/* Top bar: location search + radius + new swap */}
      <div className="z-20 flex items-center gap-4 border-b border-outline-variant/10 bg-surface/95 px-8 py-4 backdrop-blur-md">
        <div className="relative max-w-md flex-1">
          <Icon name="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Buscar ubicación..."
            className="h-11 w-full rounded-xl border border-outline-variant/30 bg-white pl-10 pr-4 text-body-md shadow-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-white px-4 py-2 shadow-sm">
          <label htmlFor="radius" className="whitespace-nowrap text-label-md text-on-surface-variant">
            Radio: <span className="font-bold text-primary">{radius} km</span>
          </label>
          <input
            id="radius"
            type="range"
            min="0.5"
            max="15"
            step="0.5"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-48 cursor-pointer accent-primary"
          />
        </div>

        <button
          type="button"
          className="ml-auto flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-white transition-all hover:bg-primary-container active:scale-[0.98]"
        >
          <Icon name="add" className="!text-[20px]" />
          Start New Swap
        </button>
      </div>

      {/* Map + overlays */}
      <div className="relative flex-1 overflow-hidden">
        {/*
          Map placeholder. A real Google Maps instance would mount here:
          new google.maps.Map(document.getElementById('map'), { center, zoom })
          and place markers from each collector's lat/lng.
        */}
        <div id="map" className="map-container absolute inset-0 bg-surface-bright">
          {/* Coverage radius (grows with the slider) + "you are here" */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="rounded-full border-2 border-primary/20 bg-primary/5 transition-all duration-300"
              style={{ width: circleSize, height: circleSize }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute -inset-3 animate-ping rounded-full bg-primary/20" />
              <span className="relative block h-3 w-3 rounded-full bg-primary ring-4 ring-white" />
            </div>
          </div>

          {/* Collector pins */}
          {visibleUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              title={`${user.username} · ${user.distanceKm} km · ${user.compatibility}%`}
              style={{ top: user.map.top, left: user.map.left }}
              className="group absolute -translate-x-1/2 -translate-y-full"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container shadow-md ring-2 ring-white transition-transform group-hover:-translate-y-1">
                <Icon name="person_pin" fill className="!text-[22px] text-primary" />
              </span>
              <span className="mx-auto mt-1 block w-max max-w-[120px] truncate rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                {user.username}
              </span>
            </button>
          ))}

          {/* Placeholder watermark */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1 text-label-sm text-on-surface-variant">
            <Icon name="map" className="!text-[14px] align-middle" /> Mapa interactivo (Google Maps)
          </div>
        </div>

        {/* Nearby traders panel */}
        <aside className="absolute bottom-6 left-6 top-6 flex w-[360px] flex-col rounded-xl border border-outline-variant/20 bg-white shadow-xl">
          <div className="border-b border-outline-variant/10 p-4">
            <h2 className="text-headline-md text-primary">Coleccionistas Cercanos</h2>
            <p className="text-label-sm text-on-surface-variant">
              {visibleUsers.length} coleccionistas compatibles encontrados
            </p>
          </div>
          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
            {visibleUsers.map((user) => (
              <UserMatchCard key={user.id} user={user} />
            ))}
          </div>
          <div className="border-t border-outline-variant/10 p-4">
            <button
              type="button"
              className="w-full rounded-lg border border-outline-variant/40 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              Ver todos los cercanos (14)
            </button>
          </div>
        </aside>

        {/* Zoom controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button
            type="button"
            aria-label="Acercar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/20 bg-white shadow-sm transition-colors hover:bg-surface-container"
          >
            <Icon name="add" className="text-on-surface" />
          </button>
          <button
            type="button"
            aria-label="Alejar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/20 bg-white shadow-sm transition-colors hover:bg-surface-container"
          >
            <Icon name="remove" className="text-on-surface" />
          </button>
          <button
            type="button"
            aria-label="Mi ubicación"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm transition-colors hover:bg-primary-container"
          >
            <Icon name="my_location" className="!text-[20px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Radar
