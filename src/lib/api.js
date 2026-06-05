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
// Returns null (not an error) for 204 No Content responses.
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
    throw new Error('No se pudo conectar con el servidor.')
  }

  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(errorMessage(data, res.status))
    err.status = res.status
    throw err
  }
  return data
}

// ── Auth ────────────────────────────────────────────────────────────────────

export const registerUser = ({ username, email, password }) =>
  apiFetch('/api/auth/register', { method: 'POST', body: { username, email, password } })

export const loginUser = ({ email, password }) =>
  apiFetch('/api/auth/login', { method: 'POST', body: { email, password } })

// ── User ────────────────────────────────────────────────────────────────────

export const fetchMe = (token) => apiFetch('/api/users/me', { token })

export const fetchReputation = (token) => apiFetch('/api/users/me/reputation', { token })

// ── Album ───────────────────────────────────────────────────────────────────

export const fetchAlbum = (token) => apiFetch('/api/cards/album', { token })

export const updateCardCopies = (token, code, copies) =>
  apiFetch(`/api/cards/album/${code}`, { method: 'PATCH', token, body: { copies } })

// ── Radar ───────────────────────────────────────────────────────────────────

// GET /api/radar/matches → [MatchRead]
export const fetchMatches = (token) => apiFetch('/api/radar/matches', { token })

// ── Trades: history (Perfil) ────────────────────────────────────────────────

// GET /api/trades → [TradeHistoryRead]
export const fetchTrades = (token) => apiFetch('/api/trades/', { token })

// ── Trades: Matches inbox ───────────────────────────────────────────────────

// GET /api/trades/matches → [MatchTradeRead]
export const fetchTradeMatches = (token) => apiFetch('/api/trades/matches', { token })

// ── Trades: invitation lifecycle ────────────────────────────────────────────

// POST /api/trades → TradeRead. Creates an empty invitation from the Radar.
export const createTrade = (token, { receiverId }) =>
  apiFetch('/api/trades/', { method: 'POST', token, body: { receiver_id: receiverId } })

// PATCH /api/trades/:id/accept → TradeDetailRead (receiver only, pending → negotiating)
export const acceptTrade = (token, tradeId) =>
  apiFetch(`/api/trades/${tradeId}/accept`, { method: 'PATCH', token })

// PATCH /api/trades/:id/reject → 204 (receiver only, pending → cancelled)
export const rejectTrade = (token, tradeId) =>
  apiFetch(`/api/trades/${tradeId}/reject`, { method: 'PATCH', token })

// ── Trades: negotiation table ───────────────────────────────────────────────

// GET /api/trades/:id → TradeDetailRead
export const fetchTrade = (token, tradeId) =>
  apiFetch(`/api/trades/${tradeId}`, { token })

// GET /api/trades/:id/catalog → CatalogRead
export const fetchTradeCatalog = (token, tradeId) =>
  apiFetch(`/api/trades/${tradeId}/catalog`, { token })

// POST /api/trades/:id/items → TradeDetailRead. Add one of my spare cards.
export const addTradeItem = (token, tradeId, code) =>
  apiFetch(`/api/trades/${tradeId}/items`, { method: 'POST', token, body: { code } })

// DELETE /api/trades/:id/items/:itemId → TradeDetailRead. Remove my committed card.
export const removeTradeItem = (token, tradeId, itemId) =>
  apiFetch(`/api/trades/${tradeId}/items/${itemId}`, { method: 'DELETE', token })

// POST /api/trades/:id/suggestions → TradeDetailRead. Suggest a partner's spare.
export const suggestTradeItem = (token, tradeId, code) =>
  apiFetch(`/api/trades/${tradeId}/suggestions`, { method: 'POST', token, body: { code } })

// PATCH /api/trades/:id/suggestions/:itemId/accept → TradeDetailRead.
export const acceptSuggestion = (token, tradeId, itemId) =>
  apiFetch(`/api/trades/${tradeId}/suggestions/${itemId}/accept`, { method: 'PATCH', token })

// DELETE /api/trades/:id/suggestions/:itemId → 204.
export const rejectSuggestion = (token, tradeId, itemId) =>
  apiFetch(`/api/trades/${tradeId}/suggestions/${itemId}`, { method: 'DELETE', token })

// ── Trades: mutual confirmation ─────────────────────────────────────────────

// PATCH /api/trades/:id/confirm → TradeDetailRead. Sets the caller's confirm flag.
export const confirmTrade = (token, tradeId) =>
  apiFetch(`/api/trades/${tradeId}/confirm`, { method: 'PATCH', token })

// PATCH /api/trades/:id/unconfirm → TradeDetailRead. Clears the caller's confirm flag.
export const unconfirmTrade = (token, tradeId) =>
  apiFetch(`/api/trades/${tradeId}/unconfirm`, { method: 'PATCH', token })

// ── Reviews ─────────────────────────────────────────────────────────────────

export const createReview = (token, { tradeId, rating, comment }) =>
  apiFetch('/api/reviews/', {
    method: 'POST',
    token,
    body: { trade_id: tradeId, rating, comment: comment || null },
  })
