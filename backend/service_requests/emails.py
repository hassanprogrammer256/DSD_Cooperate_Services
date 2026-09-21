"""Service-request notification emails — same "never break the request that already
succeeded" discipline as leads/emails.py and orders/emails.py. A failed/misconfigured
send must never turn an already-created ServiceRequest into an error response; it's
logged and swallowed."""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_service_request_notifications(service_request) -> None:
    try:
        send_mail(
            subject=f"We received your request — {service_request.reference}",
            message=(
                f"Thank you for your request for {service_request.service.title}.\n\n"
                "Our team will review your requirements and contact you shortly.\n\n"
                f"Reference No.: {service_request.reference}\n\n"
                "— DSD Corporate Services"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[service_request.user.email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send customer confirmation email for %s", service_request.reference)

    try:
        send_mail(
            subject=f"New Service Request — {service_request.service.title} ({service_request.reference})",
            message=(
                f"Service: {service_request.service.title}\n"
                f"Customer: {service_request.user.name} ({service_request.user.email})\n\n"
                f"View in admin: {settings.PUBLIC_SITE_URL}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.SERVICE_REQUEST_NOTIFICATION_EMAIL],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send internal notification email for %s", service_request.reference)


def send_status_change_email(service_request) -> None:
    try:
        send_mail(
            subject=f"Update on your request — {service_request.reference}",
            message=(
                f"Your request for {service_request.service.title} is now "
                f"{service_request.get_status_display()}.\n\n"
                f"Reference No.: {service_request.reference}\n\n"
                "— DSD Corporate Services"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[service_request.user.email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Failed to send status-change email for %s", service_request.reference)
