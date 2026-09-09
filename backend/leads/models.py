from django.db import models


class Lead(models.Model):
    """One row per website enquiry — the CRM system of record for this pass (see
    progress-tracker.md's 2026-09-09 entry). There is no real external CRM to forward
    to yet, so this app IS the CRM for now, with an inert LEAD_WEBHOOK_URL hook
    (leads/webhooks.py) ready for whenever one exists."""

    class MainService(models.TextChoices):
        INCORPORATION = "incorporation", "Incorporation"
        RESIDENCY = "residency", "Residency"
        COMPLIANCE = "compliance", "Compliance"
        PARTNER = "partner", "Partner with Us"
        GENERAL = "general", "General Enquiry"

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        QUALIFIED = "qualified", "Qualified"
        PROPOSAL = "proposal", "Proposal / Quotation"
        DOCUMENTATION = "documentation", "Documentation"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        LOST = "lost", "Lost / Not Qualified"

    class ContactMethod(models.TextChoices):
        WHATSAPP = "whatsapp", "WhatsApp"
        PHONE = "phone", "Phone"
        EMAIL = "email", "Email"

    # "DSD-000123" — set once, after the first save gives this row a pk. Assigned here
    # rather than a random token so support staff can read it out over the phone.
    reference = models.CharField(max_length=20, unique=True, editable=False, blank=True)

    name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=32)
    email = models.EmailField()
    country = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=150, blank=True)

    main_service = models.CharField(max_length=20, choices=MainService.choices)
    # Free label, not a foreign key — the sub-service list is fixed frontend copy
    # (src/lib/leadOptions.ts), not a content type staff manage, same reasoning as
    # servicePillarMeta. "Other" is a valid value, same as every dropdown in the spec.
    sub_service = models.CharField(max_length=100, blank=True)

    requirement = models.TextField()
    preferred_contact_method = models.CharField(
        max_length=10, choices=ContactMethod.choices, default=ContactMethod.WHATSAPP
    )
    preferred_contact_time = models.CharField(max_length=100, blank=True)
    attachment = models.FileField(upload_to="leads/%Y/%m/", blank=True, null=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)

    # Real, captured-not-fabricated technical context (spec section 7's tracking
    # fields) — only what the browser can honestly report, nothing inferred/guessed.
    source_url = models.URLField(max_length=500, blank=True)
    device_type = models.CharField(max_length=10, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new and not self.reference:
            self.reference = f"DSD-{self.pk:06d}"
            super().save(update_fields=["reference"])

    def __str__(self) -> str:
        return f"{self.reference} — {self.name} ({self.get_main_service_display()})"
