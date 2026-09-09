from rest_framework import serializers

from leads.models import Lead


class LeadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            "name",
            "mobile",
            "email",
            "country",
            "company",
            "mainService",
            "subService",
            "requirement",
            "preferredContactMethod",
            "preferredContactTime",
            "attachment",
            "deviceType",
        ]
        extra_kwargs = {
            "attachment": {"required": False},
        }

    # DRF doesn't camelCase automatically — mapped explicitly, same convention as every
    # other serializer in this project (see code-standards.md's field-naming rule).
    mainService = serializers.ChoiceField(source="main_service", choices=Lead.MainService.choices)
    subService = serializers.CharField(source="sub_service", required=False, allow_blank=True)
    preferredContactMethod = serializers.ChoiceField(
        source="preferred_contact_method", choices=Lead.ContactMethod.choices
    )
    preferredContactTime = serializers.CharField(source="preferred_contact_time", required=False, allow_blank=True)
    deviceType = serializers.CharField(source="device_type", required=False, allow_blank=True)


class LeadSerializer(serializers.ModelSerializer):
    """Staff-facing shape — camelCase, includes everything CreateSerializer accepts
    plus the server-assigned/read-only fields the admin app's list view needs."""

    class Meta:
        model = Lead
        fields = [
            "id",
            "reference",
            "name",
            "mobile",
            "email",
            "country",
            "company",
            "mainService",
            "subService",
            "requirement",
            "preferredContactMethod",
            "preferredContactTime",
            "attachment",
            "status",
            "sourceUrl",
            "deviceType",
            "createdAt",
        ]

    mainService = serializers.CharField(source="main_service")
    subService = serializers.CharField(source="sub_service")
    preferredContactMethod = serializers.CharField(source="preferred_contact_method")
    preferredContactTime = serializers.CharField(source="preferred_contact_time")
    sourceUrl = serializers.CharField(source="source_url")
    deviceType = serializers.CharField(source="device_type")
    createdAt = serializers.DateTimeField(source="created_at")


class LeadStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ["status"]
