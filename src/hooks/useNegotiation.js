import { useMemo, useState } from 'react'
import { negotiation } from '../data/negotiation'

const STICKER_VALUE = { legend: 5, gold: 4, base: 2 }

function computeBalance(youOffer, theyOffer) {
  const sum = (list) => list.reduce((acc, s) => acc + (STICKER_VALUE[s.rarity] ?? 0), 0)
  const diff = sum(theyOffer) - sum(youOffer) // positive = you receive more
  if (diff >= 2) return 'favorable'
  if (diff <= -2) return 'sacrificio'
  return 'justo'
}

export function useNegotiation() {
  const [youOffer, setYouOffer] = useState(negotiation.youOffer)
  const [theyOffer, setTheyOffer] = useState(negotiation.theyOffer)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const balance = useMemo(() => computeBalance(youOffer, theyOffer), [youOffer, theyOffer])
  const canConfirm = youOffer.length > 0 && theyOffer.length > 0

  const removeFromYou = (id) => setYouOffer((list) => list.filter((s) => s.id !== id))
  const removeFromThem = (id) => setTheyOffer((list) => list.filter((s) => s.id !== id))

  const handleConfirm = () => {
    setConfirmOpen(false)
    setContactOpen(true)
  }

  return {
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
