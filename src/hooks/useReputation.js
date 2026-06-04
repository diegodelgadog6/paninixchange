import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchReputation } from '../lib/api'

// Loads the authenticated user's reputation (GET /api/users/me/reputation): rating,
// reviews, completed trades, points, level, badges and trade history. Bumping `nonce`
// (via refresh) re-runs the fetch so the page can re-pull after the user leaves a review.
export function useReputation() {
  const { token } = useAuth()
  const [reputation, setReputation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!token) return undefined
    let cancelled = false
    fetchReputation(token)
      .then((data) => {
        if (cancelled) return
        setReputation(data)
        setError(null)
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
  }, [token, nonce])

  const refresh = () => setNonce((n) => n + 1)

  return { reputation, loading, error, refresh }
}
