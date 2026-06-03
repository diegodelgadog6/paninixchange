import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { STICKERS, ALBUM_STATS, statusFromCopies } from '../data/stickers'

// Global, editable collection state for the authenticated shell.
// Source of truth is `copiesById` ({ [id]: copies }), persisted to localStorage.
// The full sticker list and headline stats are derived live from it.
// Real app: this state hydrates from GET /api/album and writes back via PATCH /api/album.

const STORAGE_KEY = 'pxc:collection'

const CollectionContext = createContext(null)

// Seeds the copies map from the bundled catalog (deterministic mock distribution).
function seedCopiesById() {
  const seed = {}
  for (const s of STICKERS) seed[s.id] = s.copies
  return seed
}

// Reads the persisted copies map, merging defensively over the catalog seed so that
// cromos absent from storage fall back to their base copies (resilient to catalog changes).
function loadCopiesById() {
  const seed = seedCopiesById()
  if (typeof window === 'undefined') return seed
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seed
    const stored = JSON.parse(raw)
    for (const id of Object.keys(seed)) {
      if (typeof stored[id] === 'number' && stored[id] >= 0) seed[id] = stored[id]
    }
  } catch {
    // Corrupt/blocked storage → fall back to the seed.
  }
  return seed
}

export function CollectionProvider({ children }) {
  const [copiesById, setCopiesById] = useState(loadCopiesById)

  // Persist on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(copiesById))
    } catch {
      // Storage unavailable (private mode, quota) → keep working in-memory.
    }
  }, [copiesById])

  // Live sticker list: base catalog enriched with current copies + derived status.
  const stickers = useMemo(
    () =>
      STICKERS.map((s) => {
        const copies = copiesById[s.id] ?? 0
        return { ...s, copies, status: statusFromCopies(copies) }
      }),
    [copiesById],
  )

  // Headline stats, recomputed live from the copies map.
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

  const addCopy = (id) =>
    setCopiesById((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))

  const removeCopy = (id) =>
    setCopiesById((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) - 1) }))

  const value = useMemo(
    () => ({ stickers, stats, addCopy, removeCopy }),
    [stickers, stats],
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
