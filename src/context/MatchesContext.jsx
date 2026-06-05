import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext'
import { acceptTrade, fetchTradeMatches, rejectTrade } from '../lib/api'

// The Matches inbox: pending invitations, active negotiations, and completed trades.
// Hydrates from GET /api/trades/matches and keeps the sidebar badge (unseen received
// invitations) in sync. The negotiation table itself is managed by useNegotiation.

const MatchesContext = createContext(null)

const SEEN_KEY = 'pxc:matches-seen'

const collectorAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ece8e0&color=00241a&bold=true&size=96`

// Backend MatchTradeRead → the trade shape the Matches page consumes.
function toTrade(t) {
  const avatar = collectorAvatar(t.partner.name)
  return {
    id: t.id,
    direction: t.direction,   // 'sent' | 'received'
    status: t.status,         // pending | negotiating | completed | cancelled
    createdAt: t.created_at,
    partner: {
      id: t.partner.id,
      username: t.partner.username,
      name: t.partner.name,
      avatar,
      rating: t.partner.rating,
      demo: t.partner.demo,
    },
    iOffer: t.i_offer,
    theyOffer: t.they_offer,
    iConfirmed: t.i_confirmed,
    theyConfirmed: t.they_confirmed,
    contact: t.contact
      ? { ...t.contact, avatar }
      : null,
  }
}

function loadSeen() {
  try {
    const raw = window.localStorage.getItem(SEEN_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

export function MatchesProvider({ children }) {
  const { token } = useAuth()
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seen, setSeen] = useState(loadSeen)
  const [reloadKey, setReloadKey] = useState(0)
  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    if (!token) return undefined
    let cancelled = false
    fetchTradeMatches(token)
      .then((data) => {
        if (!cancelled) {
          setTrades(data.map(toTrade))
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token, reloadKey])

  // Refetch when the tab regains focus (two-tab testing).
  useEffect(() => {
    if (!token) return undefined
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [token, refresh])

  // Inbox sections.
  const pendingReceived = useMemo(
    () => trades.filter((t) => t.status === 'pending' && t.direction === 'received'),
    [trades],
  )
  const pendingSent = useMemo(
    () => trades.filter((t) => t.status === 'pending' && t.direction === 'sent'),
    [trades],
  )
  const negotiating = useMemo(
    () => trades.filter((t) => t.status === 'negotiating'),
    [trades],
  )
  const completed = useMemo(
    () => trades.filter((t) => t.status === 'completed'),
    [trades],
  )

  // Badge: pending received invitations not yet seen.
  const unseenCount = useMemo(
    () => pendingReceived.filter((t) => !seen.has(t.id)).length,
    [pendingReceived, seen],
  )

  const markSeen = useCallback(() => {
    setSeen((prev) => {
      const next = new Set(prev)
      let changed = false
      for (const t of pendingReceived) {
        if (!next.has(t.id)) { next.add(t.id); changed = true }
      }
      if (!changed) return prev
      try { window.localStorage.setItem(SEEN_KEY, JSON.stringify([...next])) } catch { /* noop */ }
      return next
    })
  }, [pendingReceived])

  const accept = useCallback(
    async (id) => {
      await acceptTrade(token, id)
      refresh()
    },
    [token, refresh],
  )

  const reject = useCallback(
    async (id) => {
      await rejectTrade(token, id)
      refresh()
    },
    [token, refresh],
  )

  const value = useMemo(
    () => ({
      trades,
      pendingReceived,
      pendingSent,
      negotiating,
      completed,
      loading,
      error,
      unseenCount,
      refresh,
      markSeen,
      accept,
      reject,
    }),
    [trades, pendingReceived, pendingSent, negotiating, completed, loading, error,
      unseenCount, refresh, markSeen, accept, reject],
  )

  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMatches() {
  const ctx = useContext(MatchesContext)
  if (!ctx) throw new Error('useMatches must be used within a MatchesProvider')
  return ctx
}
