from django.conf import settings
from django.db import models


class Notification(models.Model):
    """A generic in-app notification row. Kept deliberately small so other apps
    (service_requests today, orders/subscriptions potentially later) can create rows
    into it via notifications.services.notify() without a circular app dependency —
    see that module's docstring."""

    class Kind(models.TextChoices):
        SERVICE_REQUEST = "service_request", "Service Request"
        SUBSCRIPTION = "subscription", "Subscription"
        SYSTEM = "system", "System"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.SYSTEM)
    title = models.CharField(max_length=200)
    body = models.CharField(max_length=500, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user} — {self.title}"
