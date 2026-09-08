from rest_framework import serializers

from orders.models import Order


class OrderSerializer(serializers.ModelSerializer):
    tierName = serializers.CharField(source="pricing_tier.name", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    failureReason = serializers.CharField(source="failure_reason", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "tierName", "amount", "currency", "status", "createdAt", "failureReason"]


class AdminOrderSerializer(serializers.ModelSerializer):
    """Staff-only view of an order — adds who placed it, since the admin app (Phase
    14) lists every customer's orders, not just the logged-in user's own."""

    tierName = serializers.CharField(source="pricing_tier.name", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    failureReason = serializers.CharField(source="failure_reason", read_only=True)
    customerEmail = serializers.CharField(source="user.email", read_only=True)
    customerName = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "customerEmail", "customerName", "tierName",
            "amount", "currency", "status", "failureReason", "createdAt",
        ]


class CreateOrderSerializer(serializers.Serializer):
    """Input-only shape for POST /api/orders/ — the pricing tier lookup and the actual
    Tap charge happen in the view (orders/views.py), not here; this just validates the
    request body's shape before any of that runs."""

    pricingTierId = serializers.CharField()
    tapToken = serializers.CharField()
