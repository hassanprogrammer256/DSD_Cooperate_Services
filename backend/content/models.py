from django.db import models

# FileField, not ImageField, on every photo/hero/cover field below — deliberately.
# Django's ImageField validates via Pillow, which can't open SVG (a raster-only
# library), and this project's current placeholder images are SVGs (see
# progress-tracker.md's Known Gaps — no real photography exists yet). FileField skips
# that validation and works identically for the real JPG/PNG photography that
# eventually replaces these placeholders — nothing here needs to change later.


class InsightArticle(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    summary = models.CharField(max_length=300)
    body = models.JSONField(default=list)  # list[str] — paragraphs
    cover_image = models.FileField(upload_to="insights/")
    publish_date = models.DateField()
    touches_compliance = models.BooleanField(default=False)
    related_insights = models.ManyToManyField("self", blank=True, symmetrical=False)

    class Meta:
        ordering = ["-publish_date"]

    def __str__(self) -> str:
        return self.title


class TeamMember(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    bio = models.TextField()
    photo = models.FileField(upload_to="team/")
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    whatsapp = models.CharField(max_length=32, blank=True)
    linkedin = models.URLField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Founder(models.Model):
    """Singleton in practice — the admin app only ever exposes one row. Not enforced at
    the DB layer (Django has no native singleton constraint); the admin UI (Phase 14)
    is what keeps this to one row, same way a "featured" flag would be enforced."""

    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    bio = models.TextField()
    photo = models.FileField(upload_to="founder/")
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.name


class Service(models.Model):
    class Pillar(models.TextChoices):
        RESIDENCY = "residency-solutions", "Residency Solutions"
        INCORPORATION = "business-incorporation", "Business Incorporation"
        COMPLIANCE = "compliance-governance", "Compliance & Governance"

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    pillar = models.CharField(max_length=32, choices=Pillar.choices)
    icon = models.CharField(max_length=32)  # matches src/lib/icons.ts's serviceIcons keys
    summary = models.CharField(max_length=300)
    description = models.TextField()
    included = models.JSONField(default=list)  # list[str]
    hero_image = models.FileField(upload_to="services/")
    stats = models.JSONField(default=list)  # list[{value, suffix, label}]
    philosophy_title = models.CharField(max_length=200, blank=True)  # optional — "Our Philosophy" section title
    process = models.JSONField(default=list)  # list[{title, description}] — "how we help" steps, optional
    faqs = models.JSONField(default=list)  # list[{question, answer}], optional
    related_insights = models.ManyToManyField(InsightArticle, blank=True, related_name="related_services")
    team_members = models.ManyToManyField(TeamMember, blank=True, related_name="services")

    class Meta:
        ordering = ["pillar", "title"]

    def __str__(self) -> str:
        return self.title


class ComplianceArea(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    summary = models.CharField(max_length=300)
    description = models.TextField()
    obligations = models.JSONField(default=list)  # list[str]
    notes = models.TextField(blank=True)
    # Rendered as plain "— Source Name" attribution text on the frontend — never a
    # fabricated clickable link. See architecture.md's regulatory-content invariant.
    source_name = models.CharField(max_length=200, blank=True)
    hero_image = models.FileField(upload_to="compliance/")
    related_insights = models.ManyToManyField(InsightArticle, blank=True, related_name="related_compliance_areas")

    class Meta:
        ordering = ["title"]
        verbose_name_plural = "compliance areas"

    def __str__(self) -> str:
        return self.title


class Testimonial(models.Model):
    quote = models.TextField()
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=200)
    avatar = models.FileField(upload_to="testimonials/")

    def __str__(self) -> str:
        return f"{self.name} — {self.role}"


class Stat(models.Model):
    key = models.SlugField(unique=True)  # matches the frontend Stat type's `id` field
    value = models.IntegerField()
    suffix = models.CharField(max_length=16, blank=True)
    label = models.CharField(max_length=150)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.label


class PricingTier(models.Model):
    key = models.SlugField(unique=True)  # matches the frontend PricingTier type's `id` field
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    # `price` is the display string ("AED 4,500", "Custom") — kept as-is from the
    # pre-pivot frontend type. `amount`/`currency` are NEW: the real numeric value Tap
    # actually charges. A tier with amount=None (the "Custom"/Enterprise tier) is not
    # purchasable through the Tap checkout flow — its CTA still routes to /contact even
    # after Phase 13 ships, since there's no fixed price to charge. See
    # orders/models.py's Order.clean() for where this is enforced.
    price = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default="AED")
    period = models.CharField(max_length=50, blank=True)
    features = models.JSONField(default=list)  # list[str]
    highlighted = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.name
