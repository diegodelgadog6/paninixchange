import { useMemo } from 'react'
import { computeMatchSuggestions } from '../data/matches'
import { useCollection } from '../context/CollectionContext'

export function useMatches() {
  const { stickers } = useCollection()
  const matches = useMemo(() => computeMatchSuggestions(stickers), [stickers])
  return matches
}
