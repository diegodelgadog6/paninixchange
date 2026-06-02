import { useState } from 'react'
import Icon from './Icon'

// Star rating — read-only by default, or interactive (RatingModal) when `onChange`
// is provided. Size with a text-size utility via `starClass`.
function StarRating({ value = 0, max = 5, interactive = false, onChange, starClass = '!text-[18px]', className = '' }) {
  const [hover, setHover] = useState(0)
  const shown = interactive ? hover || value : value

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, k) => k + 1).map((i) => {
        const filled = i <= Math.round(shown)
        const star = (
          <Icon
            name="star"
            fill={filled}
            className={`${starClass} ${filled ? 'text-secondary-container' : 'text-outline-variant'}`}
          />
        )
        if (!interactive) return <span key={i}>{star}</span>
        return (
          <button
            key={i}
            type="button"
            aria-label={`${i} de ${max} estrellas`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange?.(i)}
            className="transition-transform hover:scale-110"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
