from rest_framework import serializers

from content.models import Service, ServiceFormField
from service_requests.models import ServiceRequest


class ServiceRequestCreateSerializer(serializers.ModelSerializer):
    service = serializers.SlugRelatedField(slug_field="slug", queryset=Service.objects.all())
    # binary=True forces json.loads on the incoming string — this endpoint is
    # multipart (it accepts an optional file), so formData arrives as a JSON-encoded
    # form field, not a nested JSON body. See views.py's parser_classes.
    formData = serializers.JSONField(source="form_data", binary=True, required=False, default=dict)

    class Meta:
        model = ServiceRequest
        fields = ["service", "formData", "attachment"]
        extra_kwargs = {"attachment": {"required": False}}

    def validate(self, attrs):
        service = attrs["service"]
        form_data = attrs.get("form_data") or {}
        fields = list(service.form_fields.all())

        file_fields = [f for f in fields if f.field_type == ServiceFormField.FieldType.FILE]
        if len(file_fields) > 1:
            # Enforced here rather than at the model layer — this is a form-schema
            # authoring mistake (content/admin.py), not something a submitter caused.
            raise serializers.ValidationError(
                "This service defines more than one file field, which isn't supported yet."
            )

        for field in fields:
            if field.field_type == ServiceFormField.FieldType.FILE:
                if field.required and not attrs.get("attachment"):
                    raise serializers.ValidationError({"attachment": f"{field.label} is required."})
                continue

            value = form_data.get(field.key)
            if field.required and (value is None or value == ""):
                raise serializers.ValidationError({"formData": f"{field.label} is required."})
            if (
                field.field_type == ServiceFormField.FieldType.SELECT
                and value not in (None, "")
                and value not in field.options
            ):
                raise serializers.ValidationError({"formData": f"{field.label} must be one of {field.options}."})

        return attrs


class ServiceRequestSerializer(serializers.ModelSerializer):
    """The logged-in customer's own view of a request they submitted."""

    serviceSlug = serializers.CharField(source="service.slug", read_only=True)
    serviceTitle = serializers.CharField(source="service.title", read_only=True)
    formData = serializers.JSONField(source="form_data", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = ServiceRequest
        fields = ["id", "reference", "serviceSlug", "serviceTitle", "formData", "attachment", "status", "createdAt"]


class AdminServiceRequestSerializer(ServiceRequestSerializer):
    """Staff-facing — adds who submitted it, since the admin app lists every
    customer's requests, not just the logged-in user's own (same reasoning as
    orders.AdminOrderSerializer)."""

    customerName = serializers.CharField(source="user.name", read_only=True)
    customerEmail = serializers.CharField(source="user.email", read_only=True)

    class Meta(ServiceRequestSerializer.Meta):
        fields = ServiceRequestSerializer.Meta.fields + ["customerName", "customerEmail"]


class ServiceRequestStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = ["status"]
