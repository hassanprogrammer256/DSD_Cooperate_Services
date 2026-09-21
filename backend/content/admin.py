from django.contrib import admin

from content.models import (
    ComplianceArea,
    Founder,
    InsightArticle,
    PricingTier,
    Service,
    ServiceFormField,
    Stat,
    Testimonial,
    TeamMember,
)

# Registered here purely as a developer/debugging convenience while building Phases
# 10-13 — this is NOT the product's content-editing tool. That's the separate,
# custom-built admin app (Phase 14), per the explicit decision recorded in
# progress-tracker.md's pivot record.


class ServiceFormFieldInline(admin.TabularInline):
    """Lets staff define a Service's per-service intake-form schema without a
    dedicated editor in the custom admin app — see content/models.py's
    ServiceFormField docstring."""

    model = ServiceFormField
    extra = 1


class ServiceAdmin(admin.ModelAdmin):
    inlines = [ServiceFormFieldInline]


admin.site.register(Service, ServiceAdmin)
admin.site.register(ComplianceArea)
admin.site.register(InsightArticle)
admin.site.register(TeamMember)
admin.site.register(Founder)
admin.site.register(Testimonial)
admin.site.register(Stat)
admin.site.register(PricingTier)
