from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
import resend

import config

resend.api_key = config.RESEND_API_KEY

router = APIRouter(prefix="/api/support", tags=["support"])


class SupportRequest(BaseModel):
    subject: str
    message: str
    sender_email: EmailStr


@router.post("", status_code=status.HTTP_200_OK)
async def send_support_email(body: SupportRequest):
    if not config.RESEND_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="El servicio de soporte no está configurado.",
        )
    try:
        resend.Emails.send({
            "from": "PaniniXchange Support <onboarding@resend.dev>",
            "to": "a01646946@tec.mx",
            "reply_to": body.sender_email,
            "subject": f"[Soporte] {body.subject}",
            "text": f"De: {body.sender_email}\n\n{body.message}",
        })
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="No se pudo enviar el mensaje. Inténtalo de nuevo.",
        )
    return {"sent": True}
