// Active trade proposal shown on the negotiation table.
// Real app: GET /api/trades/:id. The partner's contact details stay hidden until
// the trade is confirmed (privacy by design) — that's what ContactUnlockedModal reveals.

// Relative trade value per rarity, used to compute the balanza de equilibrio.
export const STICKER_VALUE = { legend: 5, gold: 4, base: 2 }

export const negotiation = {
  partner: {
    username: '@ColeccionistaPro',
    name: 'Diego Fuentes',
    avatar: 'https://ui-avatars.com/api/?name=Diego+Fuentes&background=0d3b2e&color=fff&bold=true&size=96',
    rating: 4.9,
    phone: '+52 55 1234 5678',
    whatsapp: '5215512345678', // digits only, for the wa.me link
  },
  expiresIn: '23:54',
  youOffer: [
    { id: 'y1', number: 10, team: 'ARG', name: 'Lionel Messi', tier: 'Leyenda • Brillante', rarity: 'legend' },
    { id: 'y2', number: 12, team: 'ESP', name: 'Pedri', tier: 'Joven Promesa', rarity: 'base' },
  ],
  theyOffer: [
    { id: 't1', number: 7, team: 'FRA', name: 'Kylian Mbappé', tier: 'Estrella • Oro', rarity: 'gold' },
    { id: 't2', number: 1, team: 'GER', name: 'Manuel Neuer', tier: 'Portero • Base', rarity: 'base' },
  ],
}

// Compares the total value of both sides → 'justo' | 'favorable' | 'sacrificio'.
export function computeBalance(youOffer, theyOffer) {
  const sum = (list) => list.reduce((acc, s) => acc + (STICKER_VALUE[s.rarity] ?? 0), 0)
  const diff = sum(theyOffer) - sum(youOffer) // positive = you receive more
  if (diff >= 2) return 'favorable'
  if (diff <= -2) return 'sacrificio'
  return 'justo'
}
