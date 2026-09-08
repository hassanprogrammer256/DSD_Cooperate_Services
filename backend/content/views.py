from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import NotFound

from content.models import ComplianceArea, Founder, InsightArticle, PricingTier, Service, Stat, Testimonial, TeamMember
from content.serializers import (
    ComplianceAreaSerializer,
    FounderSerializer,
    InsightArticleSerializer,
    PricingTierSerializer,
    ServiceSerializer,
    StatSerializer,
    TestimonialSerializer,
    TeamMemberSerializer,
)


class PublicReadStaffWriteMixin:
    """The whole security model for content: anyone can read, only staff can write. See
    library-docs.md's viewset permission-split pattern — every content viewset uses
    this, don't special-case one without a documented reason."""

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ServiceViewSet(PublicReadStaffWriteMixin, viewsets.ModelViewSet):
    queryset = Service.objects.prefetch_related("related_insights", "team_members").all()
    serializer_class = ServiceSerializer
    lookup_field = "slug"


class ComplianceAreaViewSet(PublicReadStaffWriteMixin, viewsets.ModelViewSet):
    queryset = ComplianceArea.objects.prefetch_related("related_insights").all()
    serializer_class = ComplianceAreaSerializer
    lookup_field = "slug"


class InsightArticleViewSet(PublicReadStaffWriteMixin, viewsets.ModelViewSet):
    queryset = InsightArticle.objects.prefetch_related("related_services", "related_insights").all()
    serializer_class = InsightArticleSerializer
    lookup_field = "slug"


class TeamMemberViewSet(PublicReadStaffWriteMixin, viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    lookup_field = "slug"


class TestimonialViewSet(PublicReadStaffWriteMixin, viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class StatViewSet(PublicReadStaffWriteMixin, viewsets.ModelViewSet):
    queryset = Stat.objects.all()
    serializer_class = StatSerializer
    lookup_field = "key"


class PricingTierViewSet(PublicReadStaffWriteMixin, viewsets.ModelViewSet):
    queryset = PricingTier.objects.all()
    serializer_class = PricingTierSerializer
    lookup_field = "key"


class FounderDetailView(generics.RetrieveUpdateAPIView):
    """Singleton endpoint — GET/PATCH /api/founder/, no list, no pk in the URL. Public
    read, staff write, same split as every other content type."""

    serializer_class = FounderSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_object(self):
        founder = Founder.objects.first()
        if founder is None:
            raise NotFound("No founder profile has been set yet.")
        return founder
