import { Link } from 'react-router-dom'
import Icon from './Icon'

// Compact match suggestion for the dashboard side panel: avatar, name,
// compatibility score and a CTA into the negotiation table.
function MatchSuggestionCard({ match }) {
  const { name, avatar, compatibility, description } = match

  return (
    <div className="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-4 transition-colors hover:border-secondary">
      <div className="mb-3 flex items-center gap-3">
        <img src={avatar} alt={name} className="h-12 w-12 rounded-full bg-surface-container object-cover" />
        <div>
          <h4 className="text-label-md text-primary">{name}</h4>
          <div className="flex items-center gap-1">
            <Icon name="stars" fill className="!text-[16px] text-secondary" />
            <p className="text-label-sm font-bold text-secondary">{compatibility}% Compatibilidad</p>
          </div>
        </div>
      </div>
      <p className="mb-4 text-label-sm text-on-surface-variant">{description}</p>
      <Link
        to="/negociacion"
        className="block rounded bg-primary py-2 text-center text-label-md text-white transition-all hover:bg-primary-container"
      >
        Ver intercambio
      </Link>
    </div>
  )
}

export default MatchSuggestionCard
