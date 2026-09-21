from django.contrib.auth import get_user_model
from rest_framework import serializers

from content.models import PricingTier
from orders.models import Order, Subscription

User = get_user_model()


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


class SubscriptionSerializer(serializers.ModelSerializer):
    """The logged-in customer's own subscription history — current + past rows,
    newest first (Subscription.Meta.ordering)."""

    tierId = serializers.CharField(source="pricing_tier.key", read_only=True)
    tierName = serializers.CharField(source="pricing_tier.name", read_only=True)
    startedAt = serializers.DateTimeField(source="started_at", read_only=True)
    expiresAt = serializers.DateTimeField(source="expires_at", read_only=True)

    class Meta:
        model = Subscription
        fields = ["id", "tierId", "tierName", "status", "startedAt", "expiresAt"]


class AdminSubscriptionSerializer(serializers.ModelSerializer):
    """Staff-only, full CRUD — the admin app's Subscriptions view. `userId`/`tierId`
    are how a subscription is created/reassigned (write); `customerEmail`/
    `customerName`/`tierName` are the read-only display of what those resolve to."""

    userId = serializers.PrimaryKeyRelatedField(source="user", queryset=User.objects.all(), write_only=True)
    tierId = serializers.SlugRelatedField(source="pricing_tier", slug_field="key", queryset=PricingTier.objects.all())
    tierName = serializers.CharField(source="pricing_tier.name", read_only=True)
    startedAt = serializers.DateTimeField(source="started_at", read_only=True)
    expiresAt = serializers.DateTimeField(source="expires_at", required=False, allow_null=True)
    customerEmail = serializers.CharField(source="user.email", read_only=True)
    customerName = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = Subscription
        fields = [
            "id", "userId", "customerEmail", "customerName", "tierId", "tierName",
            "status", "startedAt", "expiresAt",
        ]


class CreateOrderSerializer(serializers.Serializer):
    """Input-only shape for POST /api/orders/ — the pricing tier lookup and the actual
    Tap charge happen in the view (orders/views.py), not here; this just validates the
    request body's shape before any of that runs."""

    pricingTierId = serializers.CharField()
    tapToken = serializers.CharField()
