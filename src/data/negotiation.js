// Active trade proposal shown on the negotiation table.
// Real source: GET /api/radar/matches/:collectorId — the matching engine returns the
// proposed swap (the cards each side gives) plus the collector's identity, rating and
// completed-trade count. useNegotiation hydrates the live match through `toNegotiation`.
//
// Contact details (phone/whatsapp) are revealed only after the trade is confirmed
// (POST /api/trades + PATCH /api/trades/:id/confirm → ContactRead) — privacy by design.
// `toContact` maps that response onto the partner; until then the partner has no contact.

// Traders get a neutral avatar derived from their name (the backend has no avatar field).
// Mirrors the convention used in src/context/RadarContext.jsx.
const collectorAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d3b2e&color=fff&bold=true&size=96`

// rarity (+ category for base) → the short "tier" label OfferCard shows under each card.
function tierLabel(rarity, category) {
  if (rarity === 'legend') return 'Leyenda • Brillante'
  if (rarity === 'gold') return 'Estrella • Oro'
  return category // base: the album category (Escudo, Jugador, Especial…)
}

// Backend MatchSticker → the offer-card shape the columns consume.
function toOfferSticker(card) {
  return {
    id: card.code,
    number: card.number,
    team: card.team,
    name: card.name,
    tier: tierLabel(card.rarity, card.category),
    rarity: card.rarity,
  }
}

// Backend MatchRead → the negotiation shape the page/hook consume.
// i_offer = cards they're missing that I have spare → what *you* offer.
// they_offer = cards I'm missing that they have spare → what *they* offer.
export function toNegotiation(match) {
  return {
    partner: {
      username: `@${match.collector.username}`,
      name: match.collector.name,
      avatar: collectorAvatar(match.collector.name),
      rating: match.collector.rating,
      successfulTrades: match.collector.successful_trades,
      // Contact (phone/whatsapp) stays empty until the trade is confirmed (toContact).
    },
    // UX-only countdown: the negotiation table is pre-trade (no Trade row exists yet),
    // so there's no server-side expiry to show — the real 24h TTL starts when the trade
    // is created on confirm. Kept as a UI detail.
    expiresIn: '24:00',
    youOffer: match.i_offer.map(toOfferSticker),
    theyOffer: match.they_offer.map(toOfferSticker),
  }
}

// Backend ContactRead → the contact fields merged onto the partner after confirming.
export function toContact(contact) {
  return {
    phone: contact.phone,
    whatsapp: contact.whatsapp,
    rating: contact.rating,
  }
}
