import { Link } from 'react-router-dom'
import Icon from './Icon'

// Nearby collector card for the Trade Radar: avatar, handle, distance,
// compatibility badge, inventory tags and a "Conectar" CTA into the negotiation.
function UserMatchCard({ user }) {
  const { username, name, avatar, distanceKm, compatibility, tags = [] } = user

  return (
    <div className="group rounded-xl border border-outline-variant/20 bg-white p-4 transition-colors hover:border-primary/50">
      <div className="mb-3 flex items-center gap-3">
        <img src={avatar} alt={name} className="h-12 w-12 rounded-lg object-cover" />
        <div className="flex-1">
          <h3 className="text-label-md text-on-surface">{username}</h3>
          <div className="flex items-center gap-2">
            <span className="text-label-sm text-on-surface-variant">{distanceKm} km</span>
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
            <span className="text-label-sm font-bold text-primary">{compatibility}% Match</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={tag}
            className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
              i === 0
                ? 'border-primary/10 bg-primary/5 text-primary'
                : 'border-secondary-container/20 bg-secondary-container/10 text-secondary'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Connecting reveals contact and opens the trade table (see ContactUnlockedModal) */}
      <Link
        to="/negociacion"
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-label-md text-white transition-all hover:bg-primary-container"
      >
        <Icon name="chat" className="!text-[18px]" />
        Conectar
      </Link>
    </div>
  )
}

export default UserMatchCard
