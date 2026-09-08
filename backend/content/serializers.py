from rest_framework import serializers

from content.models import (
    ComplianceArea,
    Founder,
    InsightArticle,
    PricingTier,
    Service,
    Stat,
    Testimonial,
    TeamMember,
)

# Field names below deliberately mirror src/types/index.ts's camelCase names, not
# Django's own snake_case convention — see code-standards.md's rule that a content
# model "keeps the same field names as the TypeScript type wherever reasonable," so the
# API is a simple, boring 1:1 mapping for Phase 11's frontend migration, not a second
# transform layer to maintain.


class ServiceSerializer(serializers.ModelSerializer):
    heroImage = serializers.FileField(source="hero_image")
    # Writable (a queryset, not read_only=True) so the admin app (Phase 14) can manage
    # these relations, not just read them — see progress-tracker.md's Phase 14 entry.
    # required=False only on these relation fields (a Service can have zero related
    # insights/team members) — the image stays required on create, same as the model.
    relatedInsightSlugs = serializers.SlugRelatedField(
        source="related_insights", slug_field="slug", many=True, queryset=InsightArticle.objects.all(), required=False
    )
    teamMemberSlugs = serializers.SlugRelatedField(
        source="team_members", slug_field="slug", many=True, queryset=TeamMember.objects.all(), required=False
    )

    class Meta:
        model = Service
        fields = [
            "slug", "title", "pillar", "icon", "summary", "description", "philosophy_title",
            "included", "heroImage", "relatedInsightSlugs", "teamMemberSlugs", "stats",
            "process", "faqs",
        ]


class ComplianceAreaSerializer(serializers.ModelSerializer):
    heroImage = serializers.FileField(source="hero_image")
    sourceName = serializers.CharField(source="source_name", required=False, allow_blank=True)
    relatedInsightSlugs = serializers.SlugRelatedField(
        source="related_insights", slug_field="slug", many=True, queryset=InsightArticle.objects.all(), required=False
    )

    class Meta:
        model = ComplianceArea
        fields = [
            "slug", "title", "summary", "description", "obligations",
            "notes", "sourceName", "heroImage", "relatedInsightSlugs",
        ]


class InsightArticleSerializer(serializers.ModelSerializer):
    coverImage = serializers.FileField(source="cover_image")
    publishDate = serializers.DateField(source="publish_date")
    touchesCompliance = serializers.BooleanField(source="touches_compliance")
    # Read-only: relate a service/compliance area to an insight from THAT model's own
    # related_insights field, not from here — see library-docs.md for the reasoning.
    relatedServiceSlugs = serializers.SlugRelatedField(
        source="related_services", slug_field="slug", many=True, read_only=True
    )
    # Writable — self-referential, so the admin app can link related insights to each
    # other (see progress-tracker.md's Phase 14 entry).
    relatedInsightSlugs = serializers.SlugRelatedField(
        source="related_insights", slug_field="slug", many=True, queryset=InsightArticle.objects.all(), required=False
    )

    class Meta:
        model = InsightArticle
        fields = [
            "slug", "title", "category", "summary", "body", "coverImage",
            "publishDate", "touchesCompliance", "relatedServiceSlugs", "relatedInsightSlugs",
        ]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ["slug", "name", "role", "bio", "photo", "email", "phone", "whatsapp", "linkedin"]


class FounderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Founder
        fields = ["name", "role", "bio", "photo", "email", "linkedin"]


class TestimonialSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="pk", read_only=True)

    class Meta:
        model = Testimonial
        fields = ["id", "quote", "name", "role", "avatar"]


class StatSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="key")

    class Meta:
        model = Stat
        # `order` added for Phase 14 (admin app) — staff need to control display
        # sequence; it existed on the model since Phase 10 but was never exposed here.
        fields = ["id", "value", "suffix", "label", "order"]


class PricingTierSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="key")

    class Meta:
        model = PricingTier
        # `order` added for Phase 14 (admin app) — same reasoning as StatSerializer above.
        fields = [
            "id", "name", "description", "price", "amount",
            "currency", "period", "features", "highlighted", "order",
        ]
