import Icon from './Icon'

// Status chip styling per ownership state (see src/data/stickers.js).
const STATUS_META = {
  tengo: { label: 'Tengo', cls: 'bg-primary/10 text-primary' },
  repetido: { label: 'Repetido', cls: 'bg-secondary-container text-primary' },
  falta: { label: 'Me falta', cls: 'border border-error text-error' },
}

// Reusable cromo card: number badge, team, player/emblem visual and status chip.
// Used both in the dashboard "destacados" row and the full album grid.
function StickerCard({ sticker, onClick, className = '' }) {
  const { number, name, team, position, status, rarity } = sticker
  const meta = STATUS_META[status] ?? STATUS_META.falta
  const isSpecial = rarity === 'gold' || rarity === 'legend'
  const isEmblem = position === 'Escudo'
  const isMissing = status === 'falta'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex aspect-[3/4] flex-col rounded-lg border border-outline-variant/20 bg-white p-2 text-left transition-all hover:-translate-y-1 hover:shadow-md ${
        isMissing ? 'opacity-60 hover:opacity-100' : ''
      } ${className}`}
    >
      {/* Team + number badges */}
      <span className="absolute left-2 top-2 z-10 rounded bg-white/90 px-1 text-[10px] font-bold text-primary shadow-sm">
        {team}
      </span>
      <span className="absolute right-2 top-2 z-10 rounded bg-primary-container px-1 text-[10px] font-bold text-white">
        #{String(number).padStart(3, '0')}
      </span>

      {/* Visual */}
      <div
        className={`mb-2 flex h-3/5 w-full items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br ${
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

      {/* Meta */}
      <div className="flex items-start gap-1">
        {isSpecial && <Icon name="star" fill className="!text-[14px] shrink-0 text-secondary-fixed-dim" />}
        <p className="line-clamp-1 text-label-md leading-tight text-primary">{name}</p>
      </div>
      <p className="line-clamp-1 text-label-sm text-on-surface-variant">{position}</p>
      <span className={`mt-auto w-fit rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${meta.cls}`}>
        {meta.label}
      </span>
    </button>
  )
}

export default StickerCard
