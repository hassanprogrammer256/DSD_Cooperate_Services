import uuid

from django.core.files.storage import default_storage
from rest_framework import generics, permissions, viewsets
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

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


ALLOWED_UPLOAD_EXTENSIONS = {"jpg", "jpeg", "png", "svg", "webp"}
MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024  # 5MB


class MediaUploadView(APIView):
    """Generic staff-only file upload for images embedded inside a JSONField — a
    Service.included item's own image has no model FileField to upload against
    directly, unlike hero_image/photo/avatar, which already had real file upload via
    their own model field. Returns the saved file's absolute URL; the admin app stores
    that string in the JSON, replacing what used to be a raw data: URI. See
    progress-tracker.md's 2026-09-09 entry."""

    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser]

    def post(self, request):
        upload = request.FILES.get("file")
        if not upload:
            return Response({"detail": "No file provided."}, status=400)

        ext = upload.name.rsplit(".", 1)[-1].lower() if "." in upload.name else ""
        if ext not in ALLOWED_UPLOAD_EXTENSIONS:
            return Response({"detail": "Unsupported file type. Use JPG, PNG, SVG, or WebP."}, status=400)
        if upload.size > MAX_UPLOAD_SIZE_BYTES:
            return Response({"detail": "File is too large — the limit is 5MB."}, status=400)

        filename = f"uploads/{uuid.uuid4().hex}.{ext}"
        saved_path = default_storage.save(filename, upload)
        url = request.build_absolute_uri(default_storage.url(saved_path))
        return Response({"url": url}, status=201)
