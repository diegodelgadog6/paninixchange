import Icon from './Icon'

// Balanza de equilibrio — tells the collector whether a trade is fair, favourable
// or a sacrifice before they confirm. Driven by computeBalance() in negotiation.js.
const BALANCE = {
  justo: {
    label: 'Justo',
    icon: 'balance',
    desc: 'El trato es equitativo para ambos.',
    iconColor: 'text-secondary',
    dot: 'bg-primary-container',
    pill: 'bg-primary-fixed text-on-primary-fixed border-primary/20',
  },
  favorable: {
    label: 'Favorable',
    icon: 'trending_up',
    desc: 'Recibes más valor del que entregas.',
    iconColor: 'text-secondary',
    dot: 'bg-secondary',
    pill: 'bg-secondary-container text-on-secondary-container border-secondary/30',
  },
  sacrificio: {
    label: 'Sacrificio',
    icon: 'trending_down',
    desc: 'Entregas más valor del que recibes.',
    iconColor: 'text-error',
    dot: 'bg-error',
    pill: 'bg-error-container text-on-error-container border-error/30',
  },
}

function BalanzaIndicator({ balance = 'justo' }) {
  const b = BALANCE[balance] ?? BALANCE.justo

  return (
    <div className="flex flex-col items-center">
      <div className="z-10 flex flex-col items-center gap-2 rounded-full border border-outline-variant/20 bg-surface p-4 shadow-sm">
        <Icon name={b.icon} className={`!text-[36px] ${b.iconColor}`} />
      </div>
      <div className={`mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm ${b.pill}`}>
        <span className={`h-2 w-2 animate-pulse rounded-full ${b.dot}`} />
        <span className="text-label-md font-bold">{b.label}</span>
      </div>
      <p className="mt-3 max-w-[150px] text-center text-label-sm text-on-surface-variant">{b.desc}</p>
    </div>
  )
}

export default BalanzaIndicator
