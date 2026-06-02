import Icon from './Icon'

// Summary stat tile (dashboard + profile). `tone` drives the accent color of the
// big number, the icon and the corner chip.
const TONES = {
  primary: { num: 'text-primary-container', icon: 'text-primary', chip: 'bg-primary/5 text-primary' },
  tertiary: { num: 'text-tertiary', icon: 'text-tertiary', chip: 'bg-tertiary/5 text-tertiary' },
  secondary: { num: 'text-secondary', icon: 'text-secondary', chip: 'bg-secondary/5 text-secondary' },
}

function StatCard({ icon, value, label, chip, tone = 'primary' }) {
  const t = TONES[tone] ?? TONES.primary

  return (
    <div className="group rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 transition-all hover:-translate-y-1 hover:shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Icon name={icon} className={`opacity-30 transition-colors group-hover:opacity-100 ${t.icon}`} />
        {chip && <span className={`rounded px-2 py-1 text-label-sm ${t.chip}`}>{chip}</span>}
      </div>
      <h3 className={`font-display text-display-lg ${t.num}`}>{value}</h3>
      <p className="text-label-md text-on-surface-variant">{label}</p>
    </div>
  )
}

export default StatCard
