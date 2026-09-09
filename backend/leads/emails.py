"""Lead-notification emails — same "never break the request that already succeeded"
discipline as orders/emails.py. A failed/misconfigured send must never turn an already
-created Lead into an error response; it's logged and swallowed."""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_lead_notifications(lead) -> None:
    try:
        send_mail(
            subject=f"Thank you for contacting DSD Corporate Services — {lead.reference}",
            message=(
                "Thank you for contacting DSD Corporate Services.\n\n"
                "We have received your enquiry and our team will review your requirements "
                "and contact you shortly.\n\n"
                f"Reference No.: {lead.reference}\n\n"
                "— DSD Corporate Services"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[lead.email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send customer confirmation email for %s", lead.reference)

    try:
        send_mail(
            subject=f"New Website Enquiry — {lead.get_main_service_display()} ({lead.reference})",
            message=(
                f"Service: {lead.get_main_service_display()}\n"
                f"Sub-Service: {lead.sub_service or '—'}\n"
                f"Name: {lead.name}\n"
                f"Mobile: {lead.mobile}\n"
                f"Email: {lead.email}\n"
                f"Preferred Contact: {lead.get_preferred_contact_method_display()}\n\n"
                f"Requirement:\n{lead.requirement}\n\n"
                f"View in admin: {settings.PUBLIC_SITE_URL}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.LEAD_NOTIFICATION_EMAIL],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send internal notification email for %s", lead.reference)
