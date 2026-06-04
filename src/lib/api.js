// Thin fetch client for the PaniniXchange backend (FastAPI).
// Base URL comes from VITE_API_URL; defaults to the local dev server.
// Every helper returns parsed JSON or throws an Error whose message is the
// backend's `detail` string (already in Spanish), ready to show in the UI.

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// Extracts a human-readable message from a FastAPI error body.
// HTTPException → { detail: "..." }; validation (422) → { detail: [ {msg}, ... ] }.
function errorMessage(body, status) {
  const detail = body?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return `Error ${status}. Inténtalo de nuevo.`
}

// Core request helper. Attaches JSON headers and an optional Bearer token.
async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // Network error / server down.
    throw new Error('No se pudo conectar con el servidor.')
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(errorMessage(data, res.status))
    err.status = res.status
    throw err
  }
  return data
}

// POST /api/auth/register → UserRead (does NOT return a token).
export const registerUser = ({ username, email, password }) =>
  apiFetch('/api/auth/register', {
    method: 'POST',
    body: { username, email, password },
  })

// POST /api/auth/login → { access_token, token_type }.
export const loginUser = ({ email, password }) =>
  apiFetch('/api/auth/login', { method: 'POST', body: { email, password } })

// GET /api/users/me → UserRead (requires a valid token).
export const fetchMe = (token) => apiFetch('/api/users/me', { token })

// GET /api/cards/album → [CardRead] (requires a valid token).
// Full 994-card album in physical order, with the user's copy count per card.
export const fetchAlbum = (token) => apiFetch('/api/cards/album', { token })

// PATCH /api/cards/album/:code → CardRead. Sets the absolute copy count
// (0 = missing) for one card in the authenticated user's collection.
export const updateCardCopies = (token, code, copies) =>
  apiFetch(`/api/cards/album/${code}`, { method: 'PATCH', token, body: { copies } })

// GET /api/radar/matches → [MatchRead] (requires a valid token). Ranked trade
// suggestions crossing the user's collection against nearby collectors, computed
// server-side (the matching engine no longer runs in the browser).
export const fetchMatches = (token) => apiFetch('/api/radar/matches', { token })

// GET /api/radar/matches/:collectorId → MatchRead (requires a valid token). The single
// trade suggestion against one collector — the proposed swap that fills the negotiation
// table. 404 when the collector isn't tradeable or no mutually beneficial trade exists.
export const fetchMatch = (token, collectorId) =>
  apiFetch(`/api/radar/matches/${collectorId}`, { token })

// POST /api/trades → TradeRead (requires a valid token). Persists a proposed swap from
// the negotiation table. `iOffer`/`theyOffer` are arrays of album codes (e.g. "MEX2").
export const createTrade = (token, { receiverId, iOffer, theyOffer }) =>
  apiFetch('/api/trades/', {
    method: 'POST',
    token,
    body: { receiver_id: receiverId, i_offer: iOffer, they_offer: theyOffer },
  })

// PATCH /api/trades/:id/confirm → ContactRead (requires a valid token). Seals the trade
// and reveals the partner's contact ({ name, phone, whatsapp, rating }) — by design the
// contact is only available after confirming.
export const confirmTrade = (token, tradeId) =>
  apiFetch(`/api/trades/${tradeId}/confirm`, { method: 'PATCH', token })
