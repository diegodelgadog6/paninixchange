import Icon from './Icon'
import { statusFromCopies } from '../data/stickers'

// Status chip styling per ownership state (derived from `copies`).
const STATUS_META = {
  tengo: { label: 'Tengo', cls: 'bg-primary/10 text-primary' },
  repetido: { label: 'Repetido', cls: 'bg-secondary-container text-primary' },
  falta: { label: 'Me falta', cls: 'border border-error text-error' },
}

// Reusable cromo card: code badge, player/emblem visual, status chip and copy controls.
// Used both in the dashboard "destacados" row and the full album grid.
// When `onAdd`/`onRemove` are provided, a [➖ chip ➕] control row is rendered so the
// collector can edit ownership in place.
function StickerCard({ sticker, onClick, onAdd, onRemove, className = '' }) {
  const { id, name, position, status: rawStatus, copies = 0, rarity } = sticker
  const status = rawStatus ?? statusFromCopies(copies)
  const meta = STATUS_META[status] ?? STATUS_META.falta
  const isSpecial = rarity === 'gold' || rarity === 'legend'
  const isEmblem = position === 'Escudo'
  const editable = Boolean(onAdd || onRemove)

  // Frame styling per ownership state: repetido = solid gold border (duplicates to
  // trade), missing/tengo = plain. Missing cards desaturate only their visual + name
  // (mutedCls below) so the "Me falta" chip, the + control and the star keep their color.
  const frameCls =
    status === 'repetido'
      ? 'border-2 border-secondary-container bg-white'
      : 'border border-outline-variant/20 bg-white'

  // Desaturate the cromo's visual content while it's missing (no hover recolor).
  const mutedCls = status === 'falta' ? 'grayscale' : ''

  return (
    <div
      onClick={onClick}
      className={`group relative flex aspect-[3/4] flex-col rounded-lg p-2 text-left transition-all hover:-translate-y-1 hover:shadow-md ${frameCls} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Code badge (real catalog code, e.g. MEX15 / FWC7) */}
      <span className="absolute left-2 top-2 z-10 rounded bg-white/90 px-1 text-[10px] font-bold text-primary shadow-sm">
        {id}
      </span>

      {/* Visual */}
      <div
        className={`mb-2 flex h-3/5 w-full items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br ${mutedCls} ${
          isSpecial ? 'from-secondary-fixed-dim to-secondary-container' : 'from-primary-container to-primary'
        }`}
      >
        <Icon
          name={isEmblem ? 'shield' : 'person'}
          fill
          className={`!text-[44px] transition-transform group-hover:scale-110 ${
            isSpecial ? 'text-primary/40' : 'text-white/40'
          }`}
        />
      </div>

      {/* Meta — star stays colored even when missing; name/category desaturate */}
      <div className="flex items-start gap-1">
        {isSpecial && <Icon name="star" fill className="!text-[14px] shrink-0 text-secondary-fixed-dim" />}
        <p className={`line-clamp-1 text-label-md leading-tight text-primary ${mutedCls}`}>{name}</p>
      </div>
      <p className={`line-clamp-1 text-label-sm text-on-surface-variant ${mutedCls}`}>{position}</p>

      {editable ? (
        // Copy controls: decrement / status chip / increment.
        <div className="mt-auto flex items-center justify-between gap-1 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            disabled={copies === 0}
            aria-label="Quitar copia"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-colors hover:bg-outline-variant/30 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Icon name="remove" className="!text-[16px]" />
          </button>
          <span className={`truncate rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${meta.cls}`}>
            {status === 'repetido' ? `Repetido ×${copies}` : meta.label}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAdd?.()
            }}
            aria-label="Agregar copia"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-110"
          >
            <Icon name="add" className="!text-[16px]" />
          </button>
        </div>
      ) : (
        <span className={`mt-auto w-fit rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${meta.cls}`}>
          {status === 'repetido' ? `Repetido ×${copies}` : meta.label}
        </span>
      )}
    </div>
  )
}

export default StickerCard
