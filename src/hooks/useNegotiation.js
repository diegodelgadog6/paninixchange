import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchMatch } from '../lib/api'
import { toNegotiation } from '../data/negotiation'

const STICKER_VALUE = { legend: 5, gold: 4, base: 2 }

function computeBalance(youOffer, theyOffer) {
  const sum = (list) => list.reduce((acc, s) => acc + (STICKER_VALUE[s.rarity] ?? 0), 0)
  const diff = sum(theyOffer) - sum(youOffer) // positive = you receive more
  if (diff >= 2) return 'favorable'
  if (diff <= -2) return 'sacrificio'
  return 'justo'
}

function parseTime(mmss) {
  const [m, s] = mmss.split(':').map(Number)
  return m * 60 + s
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Drives the negotiation table for one collector. Hydrates the proposed swap from
// GET /api/radar/matches/:collectorId (the same engine the radar uses), then keeps the
// offers editable, the expiry counting down, and the confirm/contact modals in sync.
export function useNegotiation(collectorId) {
  const { token } = useAuth()
  const [partner, setPartner] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [youOffer, setYouOffer] = useState([])
  const [theyOffer, setTheyOffer] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    if (!token || !collectorId) return undefined
    let cancelled = false
    fetchMatch(token, collectorId)
      .then((match) => {
        if (cancelled) return
        const data = toNegotiation(match)
        setPartner(data.partner)
        setYouOffer(data.youOffer)
        setTheyOffer(data.theyOffer)
        setSecondsLeft(parseTime(data.expiresIn))
        setError(null)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token, collectorId])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [secondsLeft])

  const balance = useMemo(() => computeBalance(youOffer, theyOffer), [youOffer, theyOffer])
  const canConfirm = youOffer.length > 0 && theyOffer.length > 0

  const removeFromYou = (id) => setYouOffer((list) => list.filter((s) => s.id !== id))
  const removeFromThem = (id) => setTheyOffer((list) => list.filter((s) => s.id !== id))

  const handleConfirm = () => {
    setConfirmOpen(false)
    setContactOpen(true)
  }

  return {
    loading,
    error,
    partner,
    timeLeft: formatTime(secondsLeft),
    youOffer,
    theyOffer,
    confirmOpen,
    contactOpen,
    balance,
    canConfirm,
    removeFromYou,
    removeFromThem,
    setConfirmOpen,
    setContactOpen,
    handleConfirm,
  }
}
