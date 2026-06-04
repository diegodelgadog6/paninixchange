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
