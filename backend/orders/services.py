"""Tap Payments integration — see library-docs.md's Tap Payments section for the full
reasoning (status mapping, why order-then-charge, why every call is timed out)."""

from datetime import timedelta

import requests
from django.conf import settings
from django.utils import timezone

from orders.emails import send_order_confirmation_email

TAP_CHARGE_URL = "https://api.tap.company/v2/charges"

# The full status enum Tap's Charges API can return, confirmed against Tap's live docs
# (not assumed) during Phase 13. CAPTURED is the only success state. INITIATED means
# Tap wants a 3D-Secure redirect — out of scope for this phase's synchronous charge
# flow, so it's treated as "not yet paid" rather than guessed at as paid or failed.
FAILURE_STATUSES = {
    "ABANDONED",
    "CANCELLED",
    "FAILED",
    "DECLINED",
    "RESTRICTED",
    "VOID",
    "TIMEDOUT",
    "UNKNOWN",
}


def charge_tap_token(*, tap_token: str, amount, currency: str, customer_email: str, customer_name: str) -> dict:
    response = requests.post(
        TAP_CHARGE_URL,
        headers={"Authorization": f"Bearer {settings.TAP_SECRET_KEY}"},
        json={
            "amount": float(amount),
            "currency": currency,
            "customer": {"first_name": customer_name, "email": customer_email},
            "source": {"id": tap_token},
            "redirect": {"url": f"{settings.PUBLIC_SITE_URL}/account"},
        },
        timeout=15,
    )
    response.raise_for_status()
    return response.json()


def _informational_expiry(period: str):
    """`PricingTier.period` is a free-text display string ("per year", "", ...), not a
    structured billing interval — there's no real recurring-billing engine here (no
    task queue exists anywhere in this repo), so this is a best-effort, purely
    informational expires_at for the "My Subscription" history view. Nothing reads
    this to auto-renew or auto-expire anything."""
    period = (period or "").lower()
    if "year" in period:
        return timezone.now() + timedelta(days=365)
    if "month" in period:
        return timezone.now() + timedelta(days=30)
    return None


def activate_subscription(*, user, pricing_tier, order=None):
    """Supersedes any of `user`'s other active subscriptions and creates a new active
    one. `order` is the Tap purchase that paid for this, if any — None for the
    no-payment dev bypass (see views.py's FreeSubscriptionActivateView), which refuses
    to run at all once real Tap credentials exist. Returns the new Subscription."""
    from orders.models import Subscription  # local import: avoids a circular import with orders/models.py

    Subscription.objects.filter(user=user, status=Subscription.Status.ACTIVE).update(
        status=Subscription.Status.EXPIRED
    )
    return Subscription.objects.create(
        user=user,
        pricing_tier=pricing_tier,
        order=order,
        status=Subscription.Status.ACTIVE,
        expires_at=_informational_expiry(pricing_tier.period),
    )


def process_order_payment(order, *, tap_token: str, customer_email: str, customer_name: str) -> None:
    """Charges `order` via Tap and updates its status in place. Never raises — a
    provider error or a declined card is recorded as a `failed` Order with a
    human-readable reason, never an unhandled exception that 500s the endpoint."""
    from orders.models import Payment  # local import: avoids a circular import with orders/models.py

    try:
        result = charge_tap_token(
            tap_token=tap_token,
            amount=order.amount,
            currency=order.currency,
            customer_email=customer_email,
            customer_name=customer_name,
        )
    except requests.RequestException:
        order.status = order.Status.FAILED
        order.failure_reason = "Could not reach the payment provider — please try again shortly."
        order.save(update_fields=["status", "failure_reason", "updated_at"])
        return

    tap_status = result.get("status", "UNKNOWN")
    charge_id = result.get("id")

    if charge_id:
        Payment.objects.create(order=order, tap_charge_id=charge_id, raw_response=result)

    if tap_status == "CAPTURED":
        order.status = order.Status.PAID
    elif tap_status in FAILURE_STATUSES:
        order.status = order.Status.FAILED
        order.failure_reason = result.get("response", {}).get("message") or "Your card was declined."
    else:
        # INITIATED (3D-Secure) or any other non-terminal status — left pending rather
        # than guessed at as paid or failed.
        order.failure_reason = "This card needs additional verification we don't yet support online — please try a different card or contact us."

    order.save(update_fields=["status", "failure_reason", "updated_at"])

    if order.status == order.Status.PAID:
        activate_subscription(user=order.user, pricing_tier=order.pricing_tier, order=order)
        send_order_confirmation_email(order)
