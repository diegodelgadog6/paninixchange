// Active trade proposal shown on the negotiation table.
// Real app: GET /api/trades/:id. The partner's contact details stay hidden until
// the trade is confirmed (privacy by design) — that's what ContactUnlockedModal reveals.

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
