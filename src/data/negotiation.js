// Active trade proposal shown on the negotiation table.
// Real source: GET /api/radar/matches/:collectorId — the matching engine returns the
// proposed swap (the cards each side gives) plus the collector's identity. useNegotiation
// hydrates the live match and maps it through `toNegotiation` below.
//
// Contact details (phone/whatsapp/rating) have NO backend yet — the User model has no
// phone field and there's no reputation system — so they stay clearly-marked placeholders
// here. By design the contact is only revealed after both sides confirm the trade
// (ContactUnlockedModal) — privacy by design. When those endpoints exist, only this
// adapter changes, never the shape the page/hook consume.

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
      // PLACEHOLDERS — no reputation/contact backend yet (see header).
      rating: 4.9,
      phone: '+52 55 0000 0000',
      whatsapp: '5215500000000', // digits only, for the wa.me link
    },
    expiresIn: '24:00', // PLACEHOLDER — no server-side expiry yet
    youOffer: match.i_offer.map(toOfferSticker),
    theyOffer: match.they_offer.map(toOfferSticker),
  }
}
