from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from content.models import PricingTier


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders")
    pricing_tier = models.ForeignKey(PricingTier, on_delete=models.PROTECT, related_name="orders")
    # Snapshotted at purchase time — a later price change in the admin app must never
    # alter what a past order says the customer paid.
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="AED")
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    failure_reason = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def clean(self):
        if self.pricing_tier_id and self.pricing_tier.amount is None:
            raise ValidationError(
                "This tier has no fixed price and can't be purchased through checkout — "
                "route the customer to /contact instead."
            )

    def __str__(self) -> str:
        return f"Order #{self.pk} — {self.user} — {self.status}"


class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.PROTECT, related_name="payment")
    tap_charge_id = models.CharField(max_length=100, unique=True)
    # The raw Tap response, minus anything sensitive — see orders/services.py for what
    # gets stripped before this is stored. Useful for support/debugging a disputed
    # charge without needing to call Tap's API again.
    raw_response = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Payment for Order #{self.order_id} — {self.tap_charge_id}"
