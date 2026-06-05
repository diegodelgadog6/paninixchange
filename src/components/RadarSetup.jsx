import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

// Nominatim (OpenStreetMap) — free, no key required.
const NOMINATIM = 'https://nominatim.openstreetmap.org'

async function geocodeCity(city) {
  const url = `${NOMINATIM}/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=0`
  const res = await fetch(url, { headers: { 'Accept-Language': 'es' } })
  const data = await res.json()
  if (!data.length) throw new Error('Ciudad no encontrada')
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name }
}

async function searchCities(query) {
  if (query.length < 3) return []
  const url = `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&featuretype=city`
  const res = await fetch(url, { headers: { 'Accept-Language': 'es' } })
  return res.json()
}

// ── City autocomplete input ──────────────────────────────────────────────────
function CityInput({ value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const debounce = useRef(null)

  const handleChange = (e) => {
    const q = e.target.value
    onChange(q)
    clearTimeout(debounce.current)
    if (q.length < 3) { setSuggestions([]); setOpen(false); return }
    debounce.current = setTimeout(async () => {
      try {
        const results = await searchCities(q)
        setSuggestions(results)
        setOpen(results.length > 0)
      } catch {
        setSuggestions([])
      }
    }, 350)
  }

  const handleSelect = (item) => {
    const city = item.address?.city || item.address?.town || item.address?.village || item.display_name.split(',')[0]
    const country = item.address?.country ?? ''
    const label = country ? `${city}, ${country}` : city
    onChange(label)
    onSelect({ lat: parseFloat(item.lat), lng: parseFloat(item.lon), label })
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="relative mb-6">
      <Icon name="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
      <input
        type="text"
        placeholder="Ej. Guadalajara, México..."
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        className="h-11 w-full rounded-xl border border-outline-variant/30 pl-10 pr-4 text-body-md focus:border-primary focus:outline-none"
      />
      {open && (
        <ul className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-outline-variant/20 bg-white shadow-lg">
          {suggestions.map((s) => {
            const city = s.address?.city || s.address?.town || s.address?.village || s.display_name.split(',')[0]
            const country = s.address?.country ?? ''
            return (
              <li key={s.place_id}>
                <button
                  type="button"
                  onMouseDown={() => handleSelect(s)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  <Icon name="location_on" className="!text-[16px] shrink-0 text-outline" />
                  <span className="truncate">{city}{country ? `, ${country}` : ''}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ── Main modal ───────────────────────────────────────────────────────────────
function RadarSetup({ initial = null, onConfirm, onClose }) {
  const isEditing = initial !== null
  const [step, setStep] = useState(isEditing ? 2 : 1)
  const [city, setCity] = useState(initial?.city ?? '')
  const [radius, setRadius] = useState(initial?.radius ?? 5)
  const [coords, setCoords] = useState(
    initial?.lat ? { lat: initial.lat, lng: initial.lng } : null
  )
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState(null)

  // GPS path: get browser position → reverse geocode with Nominatim.
  const handleGps = async () => {
    setGpsLoading(true)
    setGpsError(null)
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      )
      const { latitude: lat, longitude: lng } = position.coords
      const url = `${NOMINATIM}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'es' } })
      const data = await res.json()
      const cityName =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        'Mi ubicación'
      const country = data.address?.country ?? ''
      const label = country ? `${cityName}, ${country}` : cityName
      setCity(label)
      setCoords({ lat, lng })
      setStep(2)
    } catch (err) {
      setGpsError(
        err.code === 1
          ? 'Permiso de ubicación denegado. Usa la opción manual.'
          : 'No se pudo obtener tu ubicación. Intenta de nuevo.'
      )
    } finally {
      setGpsLoading(false)
    }
  }

  const handleManual = () => {
    setCoords(null)
    setStep(2)
  }

  // When the user types manually and doesn't pick a suggestion,
  // geocode on confirm.
  const handleConfirm = async () => {
    let finalCoords = coords
    if (!finalCoords) {
      try {
        const result = await geocodeCity(city)
        finalCoords = { lat: result.lat, lng: result.lng }
      } catch {
        // If geocoding fails use a default center (Mexico City) so the map
        // still renders — the city name is what matters for display.
        finalCoords = { lat: 19.4326, lng: -99.1332 }
      }
    }
    onConfirm({ city: city.trim(), radius, lat: finalCoords.lat, lng: finalCoords.lng })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <Icon name="close" className="!text-[20px]" />
          </button>
        )}

        {step === 1 ? (
          <>
            <Icon name="radar" className="mb-4 !text-[40px] text-primary" />
            <h2 className="mb-2 text-headline-md text-primary">
              ¿Cómo quieres establecer tu ubicación?
            </h2>
            <p className="mb-6 text-label-sm text-on-surface-variant">
              Elige el método para definir tu zona de búsqueda.
            </p>

            {gpsError && (
              <p className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-label-sm text-error">
                {gpsError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGps}
                disabled={gpsLoading}
                className="flex flex-col items-center gap-3 rounded-xl border border-outline-variant/30 p-5 text-center transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:opacity-60"
              >
                {gpsLoading
                  ? <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  : <Icon name="gps_fixed" className="!text-[32px] text-primary" />
                }
                <span className="text-label-md text-on-surface">Usar GPS</span>
                <span className="text-[10px] text-on-surface-variant">
                  Detecta tu posición actual
                </span>
              </button>

              <button
                type="button"
                onClick={handleManual}
                className="flex flex-col items-center gap-3 rounded-xl border border-outline-variant/30 p-5 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <Icon name="edit_location" className="!text-[32px] text-primary" />
                <span className="text-label-md text-on-surface">Manual</span>
                <span className="text-[10px] text-on-surface-variant">
                  Escribe tu ciudad
                </span>
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="h-2 w-2 rounded-full bg-outline-variant" />
            </div>
          </>
        ) : (
          <>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mb-4 flex items-center gap-1 text-label-sm text-on-surface-variant transition-colors hover:text-primary"
              >
                <Icon name="arrow_back" className="!text-[16px]" />
                Volver
              </button>
            )}
            <h2 className="mb-6 text-headline-md text-primary">Tu zona de búsqueda</h2>

            <label className="mb-1 block text-label-sm text-on-surface-variant">
              Ubicación
            </label>

            <CityInput
              value={city}
              onChange={(val) => { setCity(val); setCoords(null) }}
              onSelect={({ lat, lng, label }) => { setCity(label); setCoords({ lat, lng }) }}
            />

            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-label-sm text-on-surface-variant">
                  Radio de búsqueda
                </label>
                <span className="text-label-md font-bold text-primary">{radius} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.5"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full cursor-pointer accent-primary"
              />
              <div className="mt-1 flex justify-between text-[10px] text-on-surface-variant">
                <span>0.5 km</span>
                <span>15 km</span>
              </div>
            </div>

            <button
              type="button"
              disabled={!city.trim()}
              onClick={handleConfirm}
              className="w-full rounded-lg bg-primary py-3 text-label-md text-white transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirmar y buscar
            </button>

            {!isEditing && (
              <div className="mt-4 flex justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-outline-variant" />
                <span className="h-2 w-2 rounded-full bg-primary" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RadarSetup
