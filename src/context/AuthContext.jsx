import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchMe, loginUser, registerUser } from '../lib/api'
import { currentUser as seedUser, toCurrentUser } from '../data/users'

// Authentication state for the app shell. Mirrors CollectionContext: a single
// source of truth (the JWT) persisted to localStorage, with the live user derived
// from it via GET /api/users/me. The mapped user keeps the `currentUser` shape the
// UI already consumes (see toCurrentUser in data/users.js).

const STORAGE_KEY = 'pxc:token'

const AuthContext = createContext(null)

function loadToken() {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveToken(token) {
  try {
    if (token) window.localStorage.setItem(STORAGE_KEY, token)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable (private mode, quota) → keep working in-memory.
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(loadToken)
  const [user, setUser] = useState(null)
  // Only block on startup if there's a token to validate against the backend.
  const [loading, setLoading] = useState(() => Boolean(loadToken()))

  // Hydrate (or re-validate) the user against the backend whenever the token
  // changes. The logged-out state is handled by the setters in login/logout, so
  // the effect only runs the async fetch (no synchronous setState in its body).
  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetchMe(token)
      .then((apiUser) => {
        if (!cancelled) setUser(toCurrentUser(apiUser))
      })
      .catch(() => {
        // Invalid/expired token → drop it and fall back to logged-out.
        if (!cancelled) {
          saveToken(null)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const login = useCallback(async ({ email, password }) => {
    const { access_token } = await loginUser({ email, password })
    saveToken(access_token)
    setToken(access_token) // triggers hydration effect
    return access_token
  }, [])

  // register() has no token in its response, so chain a login with the same
  // credentials to drop the user straight into the shell (auto-login).
  const register = useCallback(
    async ({ username, email, password }) => {
      await registerUser({ username, email, password })
      return login({ email, password })
    },
    [login],
  )

  const logout = useCallback(() => {
    saveToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) return
    const apiUser = await fetchMe(token)
    setUser(toCurrentUser(apiUser))
  }, [token])

  const value = useMemo(
    () => ({
      token,
      // Before hydration resolves, fall back to the seed user so the shell renders.
      user: user ?? seedUser,
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [token, user, loading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to read auth state. Must be used inside <AuthProvider>.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
