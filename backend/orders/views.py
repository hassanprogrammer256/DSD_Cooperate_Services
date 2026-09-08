from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response

from content.models import PricingTier
from orders.models import Order
from orders.serializers import AdminOrderSerializer, CreateOrderSerializer, OrderSerializer
from orders.services import process_order_payment


class OrderListCreateView(generics.ListCreateAPIView):
    """GET lists the logged-in customer's own orders. POST creates a pending order for
    a purchasable pricing tier and charges it through Tap in the same request — see
    library-docs.md's Tap Payments section for why the order is created before the
    charge call, not after."""

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        return CreateOrderSerializer if self.request.method == "POST" else OrderSerializer

    def create(self, request, *args, **kwargs):
        input_serializer = self.get_serializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        tier_key = input_serializer.validated_data["pricingTierId"]
        tap_token = input_serializer.validated_data["tapToken"]

        try:
            tier = PricingTier.objects.get(key=tier_key)
        except PricingTier.DoesNotExist as exc:
            raise NotFound("This pricing tier doesn't exist.") from exc
        if tier.amount is None:
            raise ValidationError(
                {"pricingTierId": "This tier isn't available for online checkout — please contact us instead."}
            )

        order = Order.objects.create(
            user=request.user,
            pricing_tier=tier,
            amount=tier.amount,
            currency=tier.currency,
        )
        process_order_payment(
            order,
            tap_token=tap_token,
            customer_email=request.user.email,
            customer_name=request.user.name or request.user.email,
        )

        output = OrderSerializer(order).data
        http_status = status.HTTP_201_CREATED if order.status == Order.Status.PAID else status.HTTP_402_PAYMENT_REQUIRED
        return Response(output, status=http_status)


class AdminOrderListView(generics.ListAPIView):
    """Staff-only, unfiltered — every customer's orders, for the admin app's read-only
    Orders view. No edit/refund actions in this phase — see build-plan.md's Phase 14.3
    and progress-tracker.md's Known Gaps."""

    serializer_class = AdminOrderSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Order.objects.select_related("user", "pricing_tier").all()
