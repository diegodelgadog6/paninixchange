import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { fetchMatches } from '../lib/api'

// Trade suggestions for the authenticated shell. Hydrates from GET /api/radar/matches,
// where the matching engine runs server-side over real collections. The shape exposed
// here is exactly what UserMatchCard / MatchSuggestionCard already consume, so the UI
// didn't change when the engine moved off the browser.

const RadarContext = createContext(null)

// Traders get a neutral avatar derived from their name (the backend has no avatar
// field). Mirrors the convention used for the current user in src/data/users.js.
const collectorAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ece8e0&color=00241a&bold=true&size=96`

// Backend MatchSticker → the sticker shape the trade columns consume (code→id,
// category→position), matching CollectionContext's toSticker.
function toSticker(card) {
  return {
    id: card.code,
    number: card.number,
    name: card.name,
    team: card.team,
    position: card.category,
    rarity: card.rarity,
  }
}

// Backend MatchRead → the match shape the cards consume (snake_case → camelCase).
function toMatch(match) {
  return {
    collector: {
      id: match.collector.id,
      username: match.collector.username,
      name: match.collector.name,
      avatar: collectorAvatar(match.collector.name),
      distanceKm: match.collector.distance_km,
      demo: match.collector.demo,
    },
    theyOffer: match.they_offer.map(toSticker),
    iOffer: match.i_offer.map(toSticker),
    goldCount: match.gold_count,
    compatibility: match.compatibility,
  }
}

export function RadarProvider({ children }) {
  const { token } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Bumping this re-runs the fetch effect. `refresh` is an event-style trigger so we
  // never call setState synchronously inside an effect (matches depend on the live
  // collection, so the Radar page refreshes after album edits). Stale-while-revalidate:
  // existing matches stay visible during a refetch; `loading` only gates the first load.
  const [reloadKey, setReloadKey] = useState(0)
  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    if (!token) return undefined
    let cancelled = false
    fetchMatches(token)
      .then((data) => {
        if (!cancelled) {
          setMatches(data.map(toMatch))
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token, reloadKey])

  const value = useMemo(
    () => ({ matches, loading, error, refresh }),
    [matches, loading, error, refresh],
  )

  return <RadarContext.Provider value={value}>{children}</RadarContext.Provider>
}

// Read the ranked match suggestions. Must be used inside <RadarProvider>.
// eslint-disable-next-line react-refresh/only-export-components
export function useRadarMatches() {
  const ctx = useContext(RadarContext)
  if (!ctx) throw new Error('useRadarMatches must be used within a RadarProvider')
  return ctx
}
