"""Order-confirmation email — separate from the existing EmailJS-based Contact flow
(see library-docs.md), which is client-side and unrelated to this."""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_order_confirmation_email(order) -> None:
    """Never allowed to break the purchase itself — the charge already succeeded by
    the time this runs, so a failed/misconfigured email must be logged and swallowed,
    never turn a successful Order back into an error response."""
    try:
        send_mail(
            subject=f"Your DSD order #{order.id} is confirmed",
            message=(
                f"Thank you for your purchase.\n\n"
                f"Package: {order.pricing_tier.name}\n"
                f"Amount: {order.currency} {order.amount}\n"
                f"Order #: {order.id}\n\n"
                f"View this order any time in My Account: {settings.PUBLIC_SITE_URL}/account\n\n"
                "— DSD Corporate Services"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.user.email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send order confirmation email for Order #%s", order.id)
