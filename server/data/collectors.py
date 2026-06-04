# Demo collector roster — seeded into the DB so the Trade Radar has real inventories
# to match against before real peers join. Ported from src/data/collectors.js +
# nearbyUsers (src/data/users.js): same identities and distances.
#
# `distance_km` is fixed demo data (the source of truth lives here, not on the User
# model). Real user-to-user distance needs both users' coordinates and is deferred to
# the geolocation milestone; for now the radar shows these stable seeded distances.

import random


# Each demo collector becomes a real User row (+ a seeded UserCard inventory).
# `username` is the public handle the radar shows. Demo-only display data lives here
# (the source of truth, not the User model nor a computed value), same convention as
# `distance_km`:
#   - distance_km        — radar distance (real user-to-user distance needs geolocation).
#   - phone              — revealed on the negotiation table only after a trade is
#                          confirmed (ContactUnlockedModal); WhatsApp link uses its digits.
#   - rating             — the collector's reputation shown on the radar/negotiation
#                          (real reputation aggregation arrives with the reviews backend).
#   - successful_trades  — completed-trade count shown next to the rating.
DEMO_COLLECTORS = [
    {"username": "Goles2026", "name": "Goles 2026", "distance_km": 1.2, "phone": "+52 55 1234 5678", "rating": 4.9, "successful_trades": 38},
    {"username": "AlbumMaster", "name": "Album Master", "distance_km": 3.5, "phone": "+52 55 2345 6789", "rating": 4.7, "successful_trades": 52},
    {"username": "StickerHunter", "name": "Sticker Hunter", "distance_km": 5.1, "phone": "+52 55 3456 7890", "rating": 4.8, "successful_trades": 27},
    {"username": "MundialFan26", "name": "Mundial Fan", "distance_km": 0.8, "phone": "+52 55 4567 8901", "rating": 5.0, "successful_trades": 64},
    {"username": "CromoKing", "name": "Cromo King", "distance_km": 6.7, "phone": "+52 55 5678 9012", "rating": 4.6, "successful_trades": 19},
    {"username": "LaAlbiceleste", "name": "La Albiceleste", "distance_km": 2.3, "phone": "+52 55 6789 0123", "rating": 4.9, "successful_trades": 45},
    {"username": "PaniniPro", "name": "Panini Pro", "distance_km": 8.9, "phone": "+52 55 7890 1234", "rating": 4.5, "successful_trades": 73},
    {"username": "CanjeMX", "name": "Canje MX", "distance_km": 4.4, "phone": "+52 55 8901 2345", "rating": 4.8, "successful_trades": 31},
]


def demo_email(username: str) -> str:
    """Stable, non-routable email for a seeded demo account."""
    return f"{username.lower()}@demo.paninixchange.app"


def whatsapp_digits(phone: str) -> str:
    """Digits-only form of a phone number, for building a wa.me link."""
    return "".join(ch for ch in phone if ch.isdigit())


def build_demo_copies(seed_key: str, cards) -> dict[int, int]:
    """Deterministic inventory for one collector over the given cards.

    ~45% missing (0), ~40% single (1), ~15% duplicate (2). Seeded by the collector's
    username so the distribution is stable across re-seeds (seeding is idempotent
    anyway). Returns a {card_id: copies} map for the copies the collector actually owns.
    """
    rng = random.Random(seed_key)
    copies: dict[int, int] = {}
    for card in cards:
        r = rng.random()
        if r < 0.45:
            continue  # missing — no UserCard row needed
        copies[card.id] = 1 if r < 0.85 else 2
    return copies
