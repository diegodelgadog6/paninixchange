# Demo collector roster — seeded into the DB so the Trade Radar has real inventories
# to match against before real peers join. Ported from src/data/collectors.js +
# nearbyUsers (src/data/users.js): same identities and distances.
#
# `distance_km` is fixed demo data (the source of truth lives here, not on the User
# model). Real user-to-user distance needs both users' coordinates and is deferred to
# the geolocation milestone; for now the radar shows these stable seeded distances.

import random


# Each demo collector becomes a real User row (+ a seeded UserCard inventory).
# `username` is the public handle the radar shows; `distance_km` mirrors the old mock.
DEMO_COLLECTORS = [
    {"username": "Goles2026", "name": "Goles 2026", "distance_km": 1.2},
    {"username": "AlbumMaster", "name": "Album Master", "distance_km": 3.5},
    {"username": "StickerHunter", "name": "Sticker Hunter", "distance_km": 5.1},
    {"username": "MundialFan26", "name": "Mundial Fan", "distance_km": 0.8},
    {"username": "CromoKing", "name": "Cromo King", "distance_km": 6.7},
    {"username": "LaAlbiceleste", "name": "La Albiceleste", "distance_km": 2.3},
    {"username": "PaniniPro", "name": "Panini Pro", "distance_km": 8.9},
    {"username": "CanjeMX", "name": "Canje MX", "distance_km": 4.4},
]


def demo_email(username: str) -> str:
    """Stable, non-routable email for a seeded demo account."""
    return f"{username.lower()}@demo.paninixchange.app"


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
