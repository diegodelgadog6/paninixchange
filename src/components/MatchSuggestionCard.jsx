import { Link } from 'react-router-dom'
import Icon from './Icon'

// Compact match suggestion for the dashboard side panel: avatar, name, compatibility
// score, derived trade counts and a CTA into the negotiation table.
// `match` comes from the matching engine (src/data/matches.js):
//   { collector, theyOffer[], iOffer[], goldCount, compatibility }
function MatchSuggestionCard({ match }) {
  const { collector, theyOffer, iOffer, goldCount, compatibility } = match
  const { name, avatar } = collector

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

      <p className="mb-2 text-label-sm text-on-surface-variant">
        Tiene <span className="font-bold text-primary">{theyOffer.length}</span> que te faltan ·
        le ofreces <span className="font-bold text-primary">{iOffer.length}</span>
      </p>
      {goldCount > 0 && (
        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded bg-secondary-container px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
          <Icon name="star" fill className="!text-[12px]" />
          {goldCount} especiales
        </span>
      )}

      <Link
        to={`/negociacion/${collector.id}`}
        className="mt-1 block rounded bg-primary py-2 text-center text-label-md text-white transition-all hover:bg-primary-container"
      >
        Ver intercambio
      </Link>
    </div>
  )
}

export default MatchSuggestionCard
