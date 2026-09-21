from django.conf import settings
from django.db import models


class ServiceRequest(models.Model):
    """A customer's request for a specific Service, submitted from their dashboard's
    Services tab. Mirrors leads.Lead's shape closely (reference-code generation,
    status pipeline, single-file attachment) — see service_requests/emails.py and
    views.py for the rest of that mirrored pattern."""

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_REVIEW = "in_review", "In Review"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        REJECTED = "rejected", "Rejected"

    # "SR-000123" — same two-write pattern as Lead.save() below.
    reference = models.CharField(max_length=20, unique=True, editable=False, blank=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="service_requests")
    # Which subscription this was requested under, if any — set in the view from the
    # user's current active subscription for the request's service's tier(s). Nullable:
    # a user could in principle request before/without an active subscription record.
    subscription = models.ForeignKey(
        "orders.Subscription", on_delete=models.SET_NULL, null=True, blank=True, related_name="service_requests"
    )
    service = models.ForeignKey("content.Service", on_delete=models.PROTECT, related_name="requests")

    # Keyed by content.ServiceFormField.key — validated against that service's current
    # field schema at submission time (see serializers.py's validate()).
    form_data = models.JSONField(default=dict, blank=True)
    # At most one FILE-type field per service maps to this single slot — see
    # serializers.py's validate() and the plan's explicit scope note on
    # multi-attachment being a future enhancement, not built here.
    attachment = models.FileField(upload_to="service-requests/%Y/%m/", blank=True, null=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new and not self.reference:
            self.reference = f"SR-{self.pk:06d}"
            super().save(update_fields=["reference"])

    def __str__(self) -> str:
        return f"{self.reference} — {self.service.title} ({self.user})"
