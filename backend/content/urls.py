from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content.views import (
    ComplianceAreaViewSet,
    FounderDetailView,
    InsightArticleViewSet,
    PricingTierViewSet,
    ServiceViewSet,
    StatViewSet,
    TestimonialViewSet,
    TeamMemberViewSet,
)

router = DefaultRouter()
router.register("services", ServiceViewSet, basename="service")
router.register("compliance-areas", ComplianceAreaViewSet, basename="compliance-area")
router.register("insights", InsightArticleViewSet, basename="insight")
router.register("team", TeamMemberViewSet, basename="team-member")
router.register("testimonials", TestimonialViewSet, basename="testimonial")
router.register("stats", StatViewSet, basename="stat")
router.register("pricing-tiers", PricingTierViewSet, basename="pricing-tier")

urlpatterns = [
    path("founder/", FounderDetailView.as_view(), name="founder-detail"),
    path("", include(router.urls)),
]
