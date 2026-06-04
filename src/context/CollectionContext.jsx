import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { statusFromCopies, ALBUM_STATS } from '../data/stickers'
import { useAuth } from './AuthContext'
import { fetchAlbum, updateCardCopies } from '../lib/api'

// Global, editable collection state for the authenticated shell.
// Hydrates from GET /api/cards/album and writes back via PATCH /api/cards/album/:code.
// Each sticker carries its owned `copies`; `status` is derived via statusFromCopies().

const CollectionContext = createContext(null)

// Maps a backend card record to the sticker shape the UI consumes.
// The backend exposes `category`; the UI reads it as `position`.
function toSticker(card) {
  return {
    id: card.code,
    number: card.number,
    name: card.name,
    team: card.team,
    position: card.category,
    rarity: card.rarity,
    copies: card.copies,
    status: statusFromCopies(card.copies),
  }
}

export function CollectionProvider({ children }) {
  const { token } = useAuth()
  const [stickers, setStickers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Hydrate the collection from the backend once the token is available.
  // CollectionProvider only mounts inside ProtectedRoute, so `token` is set on
  // mount and `loading`/`error` start from their initial state (no resync needed).
  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetchAlbum(token)
      .then((cards) => {
        if (!cancelled) setStickers(cards.map(toSticker))
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
  }, [token])

  // Headline stats, recomputed live from the current copies.
  const stats = useMemo(() => {
    let tengo = 0
    let repetido = 0
    let falta = 0
    for (const s of stickers) {
      if (s.status === 'tengo') tengo++
      else if (s.status === 'repetido') repetido++
      else falta++
    }
    return {
      total: stickers.length,
      tengo,
      repetido,
      falta,
      owned: tengo + repetido,
      matches: ALBUM_STATS.matches,
    }
  }, [stickers])

  // Optimistic copy mutation: update local state immediately, persist to the
  // backend with the new absolute count, and roll back if the request fails.
  const setCopies = (id, next) => {
    const current = stickers.find((s) => s.id === id)
    if (!current || next === current.copies) return
    const previous = current.copies
    setStickers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, copies: next, status: statusFromCopies(next) } : s,
      ),
    )
    updateCardCopies(token, id, next).catch(() => {
      setStickers((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, copies: previous, status: statusFromCopies(previous) }
            : s,
        ),
      )
    })
  }

  const addCopy = (id) => {
    const s = stickers.find((x) => x.id === id)
    if (s) setCopies(id, s.copies + 1)
  }

  const removeCopy = (id) => {
    const s = stickers.find((x) => x.id === id)
    if (s) setCopies(id, Math.max(0, s.copies - 1))
  }

  const value = useMemo(
    () => ({ stickers, stats, loading, error, addCopy, removeCopy }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stickers, stats, loading, error, token],
  )

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

// Hook to read the collection. Must be used inside <CollectionProvider>.
// eslint-disable-next-line react-refresh/only-export-components
export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error('useCollection must be used within a CollectionProvider')
  return ctx
}
