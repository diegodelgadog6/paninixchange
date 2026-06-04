import { useState } from 'react'
import Icon from './Icon'

// Two-step modal for configuring the radar search zone.
// Step 1: choose GPS or manual (both lead to step 2 for now —
//   future task: GPS calls navigator.geolocation and pre-fills the city field;
//   manual opens a navigable map with a draggable pin).
// Step 2: city input + radius slider + confirm.
// When `initial` is provided (edit mode), starts at step 2 pre-filled.
// `onClose` is only provided in edit mode; first-time setup has no dismiss.
function RadarSetup({ initial = null, onConfirm, onClose }) {
  const isEditing = initial !== null
  const [step, setStep] = useState(isEditing ? 2 : 1)
  const [city, setCity] = useState(initial?.city ?? '')
  const [radius, setRadius] = useState(initial?.radius ?? 5)

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
            <div className="grid grid-cols-2 gap-4">
              {/* GPS — future: calls navigator.geolocation and pre-fills city */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex flex-col items-center gap-3 rounded-xl border border-outline-variant/30 p-5 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <Icon name="gps_fixed" className="!text-[32px] text-primary" />
                <span className="text-label-md text-on-surface">Usar GPS</span>
                <span className="text-[10px] text-on-surface-variant">
                  Detecta tu posición actual
                </span>
              </button>
              {/* Manual — future: opens navigable map with draggable pin */}
              <button
                type="button"
                onClick={() => setStep(2)}
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
            <div className="relative mb-6">
              <Icon name="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder="Ej. Ciudad de México..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 w-full rounded-xl border border-outline-variant/30 pl-10 pr-4 text-body-md focus:border-primary focus:outline-none"
              />
            </div>

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
              onClick={() => onConfirm({ city: city.trim(), radius })}
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
