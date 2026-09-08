from django.contrib import admin

from content.models import ComplianceArea, Founder, InsightArticle, PricingTier, Service, Stat, Testimonial, TeamMember

# Registered here purely as a developer/debugging convenience while building Phases
# 10-13 — this is NOT the product's content-editing tool. That's the separate,
# custom-built admin app (Phase 14), per the explicit decision recorded in
# progress-tracker.md's pivot record.
admin.site.register(Service)
admin.site.register(ComplianceArea)
admin.site.register(InsightArticle)
admin.site.register(TeamMember)
admin.site.register(Founder)
admin.site.register(Testimonial)
admin.site.register(Stat)
admin.site.register(PricingTier)
