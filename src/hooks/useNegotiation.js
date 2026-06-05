import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  acceptSuggestion,
  addTradeItem,
  confirmTrade,
  demoConfirmTrade,
  fetchTrade,
  fetchTradeCatalog,
  rejectSuggestion,
  removeTradeItem,
  suggestTradeItem,
  unconfirmTrade,
} from '../lib/api'

const POLL_MS = 3500  // live polling interval while on the table
const DEMO_CONFIRM_DELAY = 2500  // ms after user confirms before demo seals the trade

// Drives the live negotiation table for one trade (identified by tradeId).
// Hydrates from GET /api/trades/:id and keeps the table state in sync via polling.
export function useNegotiation(tradeId) {
  const { token } = useAuth()
  const [trade, setTrade] = useState(null)
  const [catalog, setCatalog] = useState(null)
  const [catalogOpen, setCatalogOpen] = useState(null)  // 'mine' | 'theirs' | null
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const demoConfirming = useRef(false)

  const loadTrade = useCallback(async () => {
    if (!token || !tradeId) return
    try {
      const data = await fetchTrade(token, tradeId)
      setTrade(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, tradeId])

  // Initial load + polling while the table is open.
  // The effect schedules the async call; setState only fires inside the async callbacks.
  useEffect(() => {
    const run = () => { loadTrade() }
    run()
    const id = setInterval(run, POLL_MS)
    return () => clearInterval(id)
  }, [loadTrade])

  // Refetch on tab focus (two-tab testing).
  useEffect(() => {
    window.addEventListener('focus', loadTrade)
    return () => window.removeEventListener('focus', loadTrade)
  }, [loadTrade])

  // Demo auto-confirm: ~2.5 s after the user confirms, fire demo-confirm so the trade
  // seals and feels like a real two-party close.
  useEffect(() => {
    if (!trade) return
    if (trade.status !== 'negotiating') return
    if (!trade.i_confirmed) return
    const partnerIsDemo = trade.partner?.demo
    if (!partnerIsDemo) return
    if (demoConfirming.current) return
    demoConfirming.current = true
    const timer = setTimeout(async () => {
      try {
        const updated = await demoConfirmTrade(token, tradeId)
        setTrade(updated)
      } catch {
        // ignore — the next poll will pick up any state change
      }
    }, DEMO_CONFIRM_DELAY)
    return () => clearTimeout(timer)
  }, [trade, token, tradeId])

  const loadCatalog = useCallback(async () => {
    if (!token || !tradeId) return
    try {
      const data = await fetchTradeCatalog(token, tradeId)
      setCatalog(data)
    } catch {
      setCatalog(null)
    }
  }, [token, tradeId])

  const openCatalog = useCallback(async (side) => {
    setCatalogOpen(side)
    await loadCatalog()
  }, [loadCatalog])

  const closeCatalog = useCallback(() => setCatalogOpen(null), [])

  // Wraps an action call: shows busy, clears errors, refreshes table + catalog after.
  const act = useCallback(async (fn) => {
    setBusy(true)
    setActionError(null)
    try {
      const updated = await fn()
      if (updated) setTrade(updated)
      await loadCatalog()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusy(false)
    }
  }, [loadCatalog])

  const addItem = useCallback((code) =>
    act(() => addTradeItem(token, tradeId, code)), [act, token, tradeId])

  const removeItem = useCallback((itemId) =>
    act(() => removeTradeItem(token, tradeId, itemId)), [act, token, tradeId])

  const suggestItem = useCallback((code) =>
    act(() => suggestTradeItem(token, tradeId, code)), [act, token, tradeId])

  const acceptSugg = useCallback((itemId) =>
    act(() => acceptSuggestion(token, tradeId, itemId)), [act, token, tradeId])

  const rejectSugg = useCallback((itemId) =>
    act(async () => { await rejectSuggestion(token, tradeId, itemId); await loadTrade() }),
    [act, loadTrade, token, tradeId])

  const confirm = useCallback(() =>
    act(() => confirmTrade(token, tradeId)), [act, token, tradeId])

  const unconfirm = useCallback(() =>
    act(() => unconfirmTrade(token, tradeId)), [act, token, tradeId])

  return {
    trade,
    catalog,
    catalogOpen,
    loading,
    error,
    busy,
    actionError,
    openCatalog,
    closeCatalog,
    addItem,
    removeItem,
    suggestItem,
    acceptSugg,
    rejectSugg,
    confirm,
    unconfirm,
  }
}
