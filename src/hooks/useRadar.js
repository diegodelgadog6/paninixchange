import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRadarMatches } from '../context/RadarContext'
import { updateMe } from '../lib/api'

// Manages the full Trade Radar state: location search config persisted to localStorage,
// setup modal visibility, delete confirmation, and live-filtered match list.
// search shape: { city, radius, lat, lng }

const STORAGE_KEY = 'pxc:radar-search'

// A saved search is only usable if it carries numeric coordinates — the map needs
// them to render (RadarMap.setView). Older app versions stored { city, radius } without
// lat/lng; treat those as "no location" so the user re-runs setup instead of crashing
// the map with "Invalid LatLng object: (undefined, undefined)".
function isValidSearch(s) {
  return (
    !!s &&
    Number.isFinite(s.lat) &&
    Number.isFinite(s.lng) &&
    Number.isFinite(s.radius)
  )
}

function loadSearch() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (isValidSearch(parsed)) return parsed
    // Drop stale/incompatible entries so they don't linger.
    if (parsed !== null) window.localStorage.removeItem(STORAGE_KEY)
    return null
  } catch {
    return null
  }
}

export function useRadar() {
  const { token, refreshUser } = useAuth()
  const { matches: allMatches, loading, refresh } = useRadarMatches()
  const [search, setSearch] = useState(loadSearch)
  const [showSetup, setShowSetup] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    refresh()
  }, [refresh])

  const hasLocation = search !== null

  const visible = useMemo(
    () =>
      search
        ? allMatches.filter(
            (m) => m.collector.distanceKm == null || m.collector.distanceKm <= search.radius,
          )
        : [],
    [allMatches, search],
  )

  async function confirmSearch(newSearch) {
    // newSearch includes { city, radius, lat, lng }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearch))
    setSearch(newSearch)
    setShowSetup(false)
    if (token) {
      try {
        await updateMe(token, { location: newSearch.city, lat: newSearch.lat, lng: newSearch.lng })
        await refreshUser()
      } catch { /* non-blocking: localStorage already saved */ }
      refresh()
    }
  }

  async function deleteSearch() {
    window.localStorage.removeItem(STORAGE_KEY)
    setSearch(null)
    setConfirmDelete(false)
    if (token) {
      try {
        await updateMe(token, { location: null, lat: null, lng: null })
        await refreshUser()
      } catch { /* non-blocking */ }
      refresh()
    }
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
