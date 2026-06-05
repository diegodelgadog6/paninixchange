import { useEffect, useRef } from 'react'

// Leaflet is loaded via CDN in index.html — window.L is available globally.
// react-leaflet is intentionally avoided to keep the bundle lean and avoid
// version conflicts with React 19.

const PRIMARY = '#00241a'
const PRIMARY_LIGHT = 'rgba(0,36,26,0.12)'
const PRIMARY_BORDER = 'rgba(0,36,26,0.35)'

// SVG pin icon that matches the app's primary color.
function makePinIcon(L) {
  return L.divIcon({
    className: '',
    html: `
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z"
              fill="${PRIMARY}"/>
        <circle cx="16" cy="16" r="7" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="${PRIMARY}"/>
      </svg>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

export default function RadarMap({ lat, lng, radiusKm, city }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const circleRef = useRef(null)

  // Mount the map once.
  useEffect(() => {
    const L = window.L
    if (!L || !containerRef.current) return
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return // bad coords — don't crash Leaflet
    if (mapRef.current) return // already mounted

    const map = L.map(containerRef.current, {
      zoomControl: false,        // we render our own zoom buttons
      attributionControl: true,
    }).setView([lat, lng], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    markerRef.current = L.marker([lat, lng], { icon: makePinIcon(L) })
      .addTo(map)
      .bindPopup(`<b>Tu zona de búsqueda</b><br/>${city}`)

    circleRef.current = L.circle([lat, lng], {
      radius: radiusKm * 1000,
      color: PRIMARY_BORDER,
      fillColor: PRIMARY_LIGHT,
      fillOpacity: 1,
      weight: 2,
    }).addTo(map)

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
      circleRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount once

  // Update marker + circle when coordinates or radius change.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const latlng = [lat, lng]
    markerRef.current?.setLatLng(latlng)
    markerRef.current?.setPopupContent(`<b>Tu zona de búsqueda</b><br/>${city}`)
    circleRef.current?.setLatLng(latlng)
    circleRef.current?.setRadius(radiusKm * 1000)
    map.setView(latlng, map.getZoom())
  }, [lat, lng, radiusKm, city])

  // Expose zoom helpers via window so Radar.jsx buttons can call them.
  useEffect(() => {
    window.__radarMapZoomIn  = () => mapRef.current?.zoomIn()
    window.__radarMapZoomOut = () => mapRef.current?.zoomOut()
    window.__radarMapCenter  = () => mapRef.current?.setView([lat, lng], 14)
    return () => {
      delete window.__radarMapZoomIn
      delete window.__radarMapZoomOut
      delete window.__radarMapCenter
    }
  }, [lat, lng])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ zIndex: 0 }}
    />
  )
}
