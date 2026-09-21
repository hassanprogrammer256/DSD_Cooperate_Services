from rest_framework import serializers

from notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    isRead = serializers.BooleanField(source="is_read")
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "kind", "title", "body", "isRead", "createdAt"]
        read_only_fields = ["id", "kind", "title", "body", "createdAt"]
