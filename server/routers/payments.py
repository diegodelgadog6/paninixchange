from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
import stripe

import config
from database import get_session
from deps import get_current_user
from models.user import User

stripe.api_key = config.STRIPE_SECRET_KEY

router = APIRouter(prefix="/api/payments", tags=["payments"])

# Map plan id → Stripe Price ID (set real IDs in env or replace here).
PRICE_IDS: dict[str, str] = {
    "pro": "price_1Tf1SUKLWqpBKTV6vSFzO58t",
    "legend": "price_1Tf1TBKLWqpBKTV6hnNT8Oui",
}


class CheckoutRequest(BaseModel):
    plan: str          # "pro" | "legend"
    success_url: str
    cancel_url: str


@router.post("/create-checkout-session")
async def create_checkout_session(
    body: CheckoutRequest,
    current_user: User = Depends(get_current_user),
):
    price_id = PRICE_IDS.get(body.plan)
    if not price_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Plan inválido")

    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": price_id, "quantity": 1}],
        success_url=body.success_url,
        cancel_url=body.cancel_url,
        client_reference_id=str(current_user.id),
        customer_email=current_user.email,
    )
    return {"url": session.url}


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
    session: AsyncSession = Depends(get_session),
):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, config.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        checkout = event["data"]["object"]
        user_id = int(getattr(checkout, "client_reference_id", None) or 0)
        line_items = stripe.checkout.Session.list_line_items(checkout["id"], limit=1)
        price_id = line_items["data"][0]["price"]["id"] if line_items["data"] else ""
        membership = next(
            (plan for plan, pid in PRICE_IDS.items() if pid == price_id), None
        )
        if user_id and membership:
            user = await session.get(User, user_id)
            if user:
                user.membership = membership
                session.add(user)
                await session.commit()

    return {"received": True}


@router.post("/cancel-subscription", status_code=status.HTTP_200_OK)
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Downgrade the authenticated user's membership to free."""
    current_user.membership = "free"
    session.add(current_user)
    await session.commit()
    return {"membership": "free"}
