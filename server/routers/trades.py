from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from database import get_session
from deps import get_current_user
from data.collectors import whatsapp_digits
from matching import collector_meta, copies_for, is_demo, spares_catalog, sticker
from models.card import Card
from models.review import Review
from models.trade import Trade, TradeItem
from models.user import User
from reputation import build_history
from schemas import (
    CatalogRead,
    CatalogSticker,
    ContactRead,
    MatchTradePartner,
    MatchTradeRead,
    TradeCreate,
    TradeDetailRead,
    TradeHistoryRead,
    TradeItemBody,
    TradeItemRead,
    TradeRead,
)

router = APIRouter(prefix="/api/trades", tags=["trades"])

TRADE_TTL = timedelta(hours=24)

# Trades shown in the Matches inbox (cancelled ones drop out).
INBOX_STATUSES = ("pending", "negotiating", "completed")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _contact_for(session: AsyncSession, partner: User) -> ContactRead:
    """Contact revealed ONLY when a trade is completed — privacy by design.
    Demo collectors carry a fixed phone; real users may have none yet."""
    meta = await collector_meta(session, partner)
    phone = partner.phone or ""
    return ContactRead(
        name=meta["name"],
        phone=phone,
        whatsapp=whatsapp_digits(phone) if phone else "",
        rating=meta["rating"],
    )


def _clear_confirmations(trade: Trade) -> None:
    """Reset both confirm flags — called whenever a committed offer changes."""
    trade.initiator_confirmed = False
    trade.receiver_confirmed = False


async def _partner_of(trade: Trade, user: User, session: AsyncSession) -> User:
    partner_id = trade.receiver_id if trade.initiator_id == user.id else trade.initiator_id
    partner = await session.get(User, partner_id)
    if partner is None:
        raise HTTPException(status_code=404, detail="Coleccionista no encontrado.")
    return partner


async def _build_detail(
    session: AsyncSession, trade: Trade, user: User
) -> TradeDetailRead:
    """Full negotiation-table payload from the caller's perspective."""
    is_initiator = trade.initiator_id == user.id
    partner = await _partner_of(trade, user, session)
    meta = await collector_meta(session, partner)

    items = (await session.execute(
        select(TradeItem, Card)
        .join(Card, Card.id == TradeItem.card_id)
        .where(TradeItem.trade_id == trade.id)
    )).all()

    my_offer: list[TradeItemRead] = []
    their_offer: list[TradeItemRead] = []
    for item, card in items:
        row = TradeItemRead(
            id=item.id,
            code=card.code,
            number=card.number,
            name=card.name,
            team=card.team,
            category=card.category,
            rarity=card.rarity,
            state=item.state,
        )
        if item.offered_by == user.id:
            my_offer.append(row)
        else:
            their_offer.append(row)

    contact = None
    if trade.status == "completed":
        contact = await _contact_for(session, partner)

    i_confirmed = trade.initiator_confirmed if is_initiator else trade.receiver_confirmed
    they_confirmed = trade.receiver_confirmed if is_initiator else trade.initiator_confirmed

    return TradeDetailRead(
        id=trade.id,
        status=trade.status,
        role="initiator" if is_initiator else "receiver",
        i_confirmed=i_confirmed,
        they_confirmed=they_confirmed,
        partner=MatchTradePartner(
            id=partner.id,
            username=partner.username,
            name=meta["name"],
            rating=meta["rating"],
            demo=meta["demo"],
        ),
        my_offer=my_offer,
        their_offer=their_offer,
        contact=contact,
    )


async def _try_complete(
    session: AsyncSession, trade: Trade, partner: User, user: User
) -> bool:
    """If both flags are set, seal the trade and seed the demo review. Returns True
    when the trade just completed."""
    if not (trade.initiator_confirmed and trade.receiver_confirmed):
        return False

    trade.status = "completed"
    session.add(trade)

    # Auto-review: the demo collector rates the real user once — seeds initial reputation.
    initiator = await session.get(User, trade.initiator_id)
    receiver = await session.get(User, trade.receiver_id)
    if initiator and receiver:
        demo_party = receiver if is_demo(receiver) else (initiator if is_demo(initiator) else None)
        real_party = initiator if demo_party is receiver else (receiver if demo_party is initiator else None)
        if demo_party and real_party:
            exists = (await session.execute(
                select(Review).where(
                    Review.trade_id == trade.id,
                    Review.rater_id == demo_party.id,
                )
            )).scalars().first()
            if exists is None:
                meta = await collector_meta(session, demo_party)
                session.add(Review(
                    trade_id=trade.id,
                    rater_id=demo_party.id,
                    ratee_id=real_party.id,
                    rating=round(meta["rating"]),
                ))

    await session.commit()
    return True


def _assert_participant(trade: Trade, user: User) -> None:
    if trade.initiator_id != user.id and trade.receiver_id != user.id:
        raise HTTPException(status_code=403, detail="No tienes acceso a este intercambio.")


# ---------------------------------------------------------------------------
# Trade history (Perfil)
# ---------------------------------------------------------------------------

@router.get("/", response_model=list[TradeHistoryRead])
async def list_trades(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The authenticated user's trade history, newest first (Perfil page)."""
    return await build_history(session, user.id)


# ---------------------------------------------------------------------------
# Matches inbox  — declared before /{trade_id} so FastAPI doesn't capture it
# ---------------------------------------------------------------------------

@router.get("/matches", response_model=list[MatchTradeRead])
async def list_match_trades(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The Matches inbox: pending invitations (sent/received), active negotiations and
    completed trades. Cancelled ones are excluded. Contact only on completed."""
    trades = (await session.execute(
        select(Trade)
        .where(
            (Trade.initiator_id == user.id) | (Trade.receiver_id == user.id),
            Trade.status.in_(INBOX_STATUSES),
        )
        .order_by(Trade.created_at.desc())
    )).scalars().all()
    if not trades:
        return []

    trade_ids = [t.id for t in trades]

    # Only committed items for the inbox cards (suggestions are internal to the table).
    item_rows = (await session.execute(
        select(TradeItem, Card)
        .join(Card, Card.id == TradeItem.card_id)
        .where(TradeItem.trade_id.in_(trade_ids), TradeItem.state == "committed")
    )).all()
    items_by_trade: dict[int, list[tuple[int, Card]]] = {tid: [] for tid in trade_ids}
    for item, card in item_rows:
        items_by_trade[item.trade_id].append((item.offered_by, card))

    partner_ids = {
        t.receiver_id if t.initiator_id == user.id else t.initiator_id for t in trades
    }
    partners = {
        u.id: u
        for u in (
            await session.execute(select(User).where(User.id.in_(partner_ids)))
        ).scalars().all()
    }
    meta_by_id = {pid: await collector_meta(session, partners[pid]) for pid in partner_ids}

    result: list[MatchTradeRead] = []
    for t in trades:
        is_initiator = t.initiator_id == user.id
        partner_id = t.receiver_id if is_initiator else t.initiator_id
        partner = partners.get(partner_id)
        meta = meta_by_id.get(partner_id, {})

        i_offer = [sticker(c) for owner, c in items_by_trade[t.id] if owner == user.id]
        they_offer = [sticker(c) for owner, c in items_by_trade[t.id] if owner != user.id]

        contact = None
        if t.status == "completed" and partner is not None:
            contact = await _contact_for(session, partner)

        i_confirmed = t.initiator_confirmed if is_initiator else t.receiver_confirmed
        they_confirmed = t.receiver_confirmed if is_initiator else t.initiator_confirmed

        result.append(MatchTradeRead(
            id=t.id,
            direction="sent" if is_initiator else "received",
            status=t.status,
            created_at=t.created_at,
            partner=MatchTradePartner(
                id=partner_id,
                username=partner.username if partner else "—",
                name=meta.get("name", partner.username if partner else "—"),
                rating=meta.get("rating", 0.0),
                demo=meta.get("demo", False),
            ),
            i_offer=i_offer,
            they_offer=they_offer,
            i_confirmed=i_confirmed,
            they_confirmed=they_confirmed,
            contact=contact,
        ))
    return result


# ---------------------------------------------------------------------------
# Create invitation (from the Radar — empty, no cards yet)
# ---------------------------------------------------------------------------

@router.post("/", response_model=TradeRead)
async def create_trade(
    payload: TradeCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create an empty invitation to negotiate. The receiver sees it in their inbox and
    accepts or rejects. Demo receivers are moved straight to negotiating (instant accept).
    Duplicates are rejected: only one active invitation per pair at a time."""
    if payload.receiver_id == user.id:
        raise HTTPException(status_code=400, detail="No puedes intercambiar contigo mismo.")
    receiver = await session.get(User, payload.receiver_id)
    if receiver is None:
        raise HTTPException(status_code=404, detail="Coleccionista no encontrado.")

    # One active trade per pair (either direction).
    existing = (await session.execute(
        select(Trade).where(
            Trade.status.in_(("pending", "negotiating")),
            (
                ((Trade.initiator_id == user.id) & (Trade.receiver_id == receiver.id))
                | ((Trade.initiator_id == receiver.id) & (Trade.receiver_id == user.id))
            ),
        )
    )).scalars().first()
    if existing is not None:
        raise HTTPException(
            status_code=400,
            detail="Ya tienes una negociación activa con este coleccionista.",
        )

    # Demo collectors accept instantly — create already in negotiating.
    initial_status = "negotiating" if is_demo(receiver) else "pending"

    trade = Trade(
        initiator_id=user.id,
        receiver_id=receiver.id,
        status=initial_status,
        expires_at=datetime.utcnow() + TRADE_TTL,
    )
    session.add(trade)
    await session.commit()
    await session.refresh(trade)
    return trade


# ---------------------------------------------------------------------------
# Accept / Reject invitation (receiver only, pending trades)
# ---------------------------------------------------------------------------

@router.patch("/{trade_id}/accept", response_model=TradeDetailRead)
async def accept_trade(
    trade_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The receiver accepts a pending invitation → negotiating. Returns the full table
    detail (no contact yet — that comes only after both parties complete the trade)."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    if trade.receiver_id != user.id:
        raise HTTPException(status_code=403, detail="No puedes aceptar esta invitación.")
    if trade.status != "pending":
        raise HTTPException(status_code=400, detail="Esta invitación ya no está pendiente.")

    trade.status = "negotiating"
    session.add(trade)
    await session.commit()
    return await _build_detail(session, trade, user)


@router.patch("/{trade_id}/reject", status_code=204)
async def reject_trade(
    trade_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The receiver rejects a pending invitation, cancelling the trade."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    if trade.receiver_id != user.id:
        raise HTTPException(status_code=403, detail="No puedes rechazar esta invitación.")
    if trade.status != "pending":
        raise HTTPException(status_code=400, detail="Esta invitación ya no está pendiente.")

    trade.status = "cancelled"
    session.add(trade)
    await session.commit()


# ---------------------------------------------------------------------------
# Read one trade (negotiation table)
# ---------------------------------------------------------------------------

@router.get("/{trade_id}", response_model=TradeDetailRead)
async def get_trade(
    trade_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Full live state of the negotiation table for one participant."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)
    return await _build_detail(session, trade, user)


# ---------------------------------------------------------------------------
# Catalog (add/suggest pickers)
# ---------------------------------------------------------------------------

@router.get("/{trade_id}/catalog", response_model=CatalogRead)
async def get_catalog(
    trade_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Spare cards for the negotiation table's add/suggest pickers.

    my_spares: my cards with copies >= 2 (for my offer), tagged useful = the partner
               needs it. their_spares: the partner's spare cards (for suggestions).
    Cards already on the table (any state) are excluded from both lists."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)
    if trade.status != "negotiating":
        raise HTTPException(status_code=400, detail="El intercambio no está en negociación.")

    partner = await _partner_of(trade, user, session)

    cards = (await session.execute(select(Card).order_by(Card.number))).scalars().all()
    my_copies = await copies_for(session, user.id)
    their_copies = await copies_for(session, partner.id)

    # card ids already on the table (any state) — excluded from both pickers.
    on_table = {
        item.card_id
        for item in (await session.execute(
            select(TradeItem).where(TradeItem.trade_id == trade_id)
        )).scalars().all()
    }

    my_spares = [
        CatalogSticker(**{**sticker(c).model_dump(), "useful": useful})
        for c, useful in spares_catalog(cards, my_copies, their_copies)
        if c.id not in on_table
    ]
    their_spares = [
        CatalogSticker(**{**sticker(c).model_dump(), "useful": useful})
        for c, useful in spares_catalog(cards, their_copies, my_copies)
        if c.id not in on_table
    ]

    return CatalogRead(my_spares=my_spares, their_spares=their_spares)


# ---------------------------------------------------------------------------
# Edit offers (committed items — reset both confirm flags)
# ---------------------------------------------------------------------------

@router.post("/{trade_id}/items", response_model=TradeDetailRead)
async def add_item(
    trade_id: int,
    payload: TradeItemBody,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Add one of my spare cards (copies >= 2) to my committed offer."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)
    if trade.status != "negotiating":
        raise HTTPException(status_code=400, detail="El intercambio no está en negociación.")

    card = (await session.execute(
        select(Card).where(Card.code == payload.code)
    )).scalars().first()
    if card is None:
        raise HTTPException(status_code=404, detail="Cromo no encontrado.")

    my_copies = await copies_for(session, user.id)
    if my_copies.get(card.id, 0) < 2:
        raise HTTPException(status_code=400, detail="No tienes copias suficientes de este cromo.")

    # Reject duplicates on the table.
    dup = (await session.execute(
        select(TradeItem).where(
            TradeItem.trade_id == trade_id,
            TradeItem.card_id == card.id,
        )
    )).scalars().first()
    if dup is not None:
        raise HTTPException(status_code=400, detail="Este cromo ya está en la mesa.")

    session.add(TradeItem(
        trade_id=trade_id,
        card_id=card.id,
        offered_by=user.id,
        state="committed",
    ))
    _clear_confirmations(trade)
    session.add(trade)
    await session.commit()
    return await _build_detail(session, trade, user)


@router.delete("/{trade_id}/items/{item_id}", response_model=TradeDetailRead)
async def remove_item(
    trade_id: int,
    item_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Remove one of my committed cards from my offer."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)
    if trade.status != "negotiating":
        raise HTTPException(status_code=400, detail="El intercambio no está en negociación.")

    item = await session.get(TradeItem, item_id)
    if item is None or item.trade_id != trade_id:
        raise HTTPException(status_code=404, detail="Ítem no encontrado.")
    if item.offered_by != user.id or item.state != "committed":
        raise HTTPException(status_code=403, detail="No puedes quitar este cromo.")

    await session.delete(item)
    _clear_confirmations(trade)
    session.add(trade)
    await session.commit()
    return await _build_detail(session, trade, user)


# ---------------------------------------------------------------------------
# Suggestions (cross-side proposals — no flag reset until accepted)
# ---------------------------------------------------------------------------

@router.post("/{trade_id}/suggestions", response_model=TradeDetailRead)
async def suggest_item(
    trade_id: int,
    payload: TradeItemBody,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Suggest a spare card from the partner's repertoire for their offer.

    For demo partners, suggestions are accepted immediately (auto-commit) and DO reset
    confirmations because they immediately change the committed offer. For real partners,
    the suggestion waits for their explicit accept — confirmations are not touched."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)
    if trade.status != "negotiating":
        raise HTTPException(status_code=400, detail="El intercambio no está en negociación.")

    partner = await _partner_of(trade, user, session)

    card = (await session.execute(
        select(Card).where(Card.code == payload.code)
    )).scalars().first()
    if card is None:
        raise HTTPException(status_code=404, detail="Cromo no encontrado.")

    their_copies = await copies_for(session, partner.id)
    if their_copies.get(card.id, 0) < 2:
        raise HTTPException(
            status_code=400,
            detail="El coleccionista no tiene copias suficientes de este cromo.",
        )

    dup = (await session.execute(
        select(TradeItem).where(
            TradeItem.trade_id == trade_id,
            TradeItem.card_id == card.id,
        )
    )).scalars().first()
    if dup is not None:
        raise HTTPException(status_code=400, detail="Este cromo ya está en la mesa.")

    partner_is_demo = is_demo(partner)
    new_state = "committed" if partner_is_demo else "suggested"

    session.add(TradeItem(
        trade_id=trade_id,
        card_id=card.id,
        offered_by=partner.id,
        state=new_state,
    ))
    if partner_is_demo:
        # Auto-accepted → changes the real offer, so reset flags.
        _clear_confirmations(trade)
        session.add(trade)

    await session.commit()
    return await _build_detail(session, trade, user)


@router.patch("/{trade_id}/suggestions/{item_id}/accept", response_model=TradeDetailRead)
async def accept_suggestion(
    trade_id: int,
    item_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """The card's owner accepts a suggestion → committed. Resets both confirm flags."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)
    if trade.status != "negotiating":
        raise HTTPException(status_code=400, detail="El intercambio no está en negociación.")

    item = await session.get(TradeItem, item_id)
    if item is None or item.trade_id != trade_id:
        raise HTTPException(status_code=404, detail="Sugerencia no encontrada.")
    if item.offered_by != user.id or item.state != "suggested":
        raise HTTPException(status_code=403, detail="No puedes aceptar esta sugerencia.")

    item.state = "committed"
    session.add(item)
    _clear_confirmations(trade)
    session.add(trade)
    await session.commit()
    return await _build_detail(session, trade, user)


@router.delete("/{trade_id}/suggestions/{item_id}", status_code=204)
async def reject_suggestion(
    trade_id: int,
    item_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Owner rejects or suggester withdraws a pending suggestion. No flag reset."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)

    item = await session.get(TradeItem, item_id)
    if item is None or item.trade_id != trade_id:
        raise HTTPException(status_code=404, detail="Sugerencia no encontrada.")
    if item.state != "suggested":
        raise HTTPException(status_code=400, detail="Este ítem ya no es una sugerencia.")

    # Both the owner (reject) and the suggester (withdraw) can remove it.
    partner = await _partner_of(trade, user, session)
    if user.id not in (item.offered_by, partner.id):
        raise HTTPException(status_code=403, detail="No puedes eliminar esta sugerencia.")

    await session.delete(item)
    await session.commit()


# ---------------------------------------------------------------------------
# Mutual confirmation
# ---------------------------------------------------------------------------

@router.patch("/{trade_id}/confirm", response_model=TradeDetailRead)
async def confirm_trade(
    trade_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Set the caller's confirm flag. If both parties are now confirmed the trade seals
    and the detail response will include the partner's contact."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)
    if trade.status != "negotiating":
        raise HTTPException(status_code=400, detail="El intercambio no está en negociación.")

    # At least one committed card on each side to confirm.
    my_items = (await session.execute(
        select(TradeItem).where(
            TradeItem.trade_id == trade_id,
            TradeItem.offered_by == user.id,
            TradeItem.state == "committed",
        )
    )).scalars().all()
    partner = await _partner_of(trade, user, session)
    their_items = (await session.execute(
        select(TradeItem).where(
            TradeItem.trade_id == trade_id,
            TradeItem.offered_by == partner.id,
            TradeItem.state == "committed",
        )
    )).scalars().all()
    if not my_items or not their_items:
        raise HTTPException(
            status_code=400,
            detail="Ambos lados necesitan al menos un cromo para confirmar.",
        )

    if trade.initiator_id == user.id:
        trade.initiator_confirmed = True
    else:
        trade.receiver_confirmed = True
    session.add(trade)
    await session.flush()

    await _try_complete(session, trade, partner, user)
    await session.commit()
    return await _build_detail(session, trade, user)


@router.patch("/{trade_id}/unconfirm", response_model=TradeDetailRead)
async def unconfirm_trade(
    trade_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Cancel the caller's confirm flag (misclick correction)."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    _assert_participant(trade, user)
    if trade.status != "negotiating":
        raise HTTPException(status_code=400, detail="El intercambio no está en negociación.")

    if trade.initiator_id == user.id:
        trade.initiator_confirmed = False
    else:
        trade.receiver_confirmed = False
    session.add(trade)
    await session.commit()
    return await _build_detail(session, trade, user)


@router.patch("/{trade_id}/demo-confirm", response_model=TradeDetailRead)
async def demo_confirm_trade(
    trade_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Sets the demo receiver's confirm flag on behalf of the initiator's client.

    The frontend fires this ~2–3 s after the real user confirms, so the close feels like
    a real two-party interaction. Only valid when the receiver is a demo collector."""
    trade = await session.get(Trade, trade_id)
    if trade is None:
        raise HTTPException(status_code=404, detail="Intercambio no encontrado.")
    if trade.initiator_id != user.id:
        raise HTTPException(status_code=403, detail="Solo el iniciador puede ejecutar esta acción.")
    if trade.status != "negotiating":
        raise HTTPException(status_code=400, detail="El intercambio no está en negociación.")

    receiver = await session.get(User, trade.receiver_id)
    if receiver is None or not is_demo(receiver):
        raise HTTPException(
            status_code=400,
            detail="Este endpoint solo aplica a coleccionistas demo.",
        )

    trade.receiver_confirmed = True
    session.add(trade)
    await session.flush()

    await _try_complete(session, trade, receiver, user)
    await session.commit()
    return await _build_detail(session, trade, user)
