import { useEffect, useMemo, useState } from 'react'
import { useRadarMatches } from '../context/RadarContext'

// Manages the full Trade Radar state: location search config persisted to localStorage,
// setup modal visibility, delete confirmation, and live-filtered match list.
// Real app: search.city/radius would come from a user profile setting via PATCH /api/me.

const STORAGE_KEY = 'pxc:radar-search'

function loadSearch() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// TODO: Google Maps integration — replace city text input with a navigable map.
//   GPS path: navigator.geolocation.getCurrentPosition() pre-fills the map pin.
//   Manual path: map loads centered on the Americas, user drags pin to desired spot.

export function useRadar() {
  const { matches: allMatches, loading, refresh } = useRadarMatches()
  const [search, setSearch] = useState(loadSearch)   // { city, radius } | null
  const [showSetup, setShowSetup] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Re-fetch on entry so suggestions reflect any album edits made since last visit
  // (the engine is server-side; the provider only fetched once on shell mount).
  useEffect(() => {
    refresh()
  }, [refresh])

  const hasLocation = search !== null

  const visible = useMemo(
    () => (search ? allMatches.filter((m) => m.collector.distanceKm <= search.radius) : []),
    [allMatches, search],
  )

  function confirmSearch(newSearch) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearch))
    setSearch(newSearch)
    setShowSetup(false)
  }

  function deleteSearch() {
    window.localStorage.removeItem(STORAGE_KEY)
    setSearch(null)
    setConfirmDelete(false)
  }

  function openSetup() {
    setConfirmDelete(false)
    setShowSetup(true)
  }

  return {
    search,
    hasLocation,
    loading,
    allMatches,
    visible,
    showSetup,
    confirmDelete,
    setShowSetup,
    setConfirmDelete,
    confirmSearch,
    deleteSearch,
    openSetup,
  }
}
