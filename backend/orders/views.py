from django.conf import settings
from django.db.models import Count
from rest_framework import generics, permissions, status, viewsets
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from content.models import PricingTier
from orders.models import Order, Subscription
from orders.serializers import (
    AdminOrderSerializer,
    AdminSubscriptionSerializer,
    CreateOrderSerializer,
    OrderSerializer,
    SubscriptionSerializer,
)
from orders.services import activate_subscription, process_order_payment


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


class SubscriptionListView(generics.ListAPIView):
    """The logged-in customer's own subscription history — the dashboard's
    "My Subscription" tab. Current + past rows, newest first."""

    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user).select_related("pricing_tier")


class FreeSubscriptionActivateView(APIView):
    """Dev-only bypass: while Tap isn't configured (no TAP_SECRET_KEY set on this
    backend), lets an authenticated user activate a purchasable tier's subscription
    without paying, so the rest of the dashboard (Services, requests) is testable
    end to end. Refuses outright the moment TAP_SECRET_KEY exists — it can never grant
    a free plan once real payment is live, regardless of what the frontend sends."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if settings.TAP_SECRET_KEY:
            return Response(
                {"detail": "Online payment is configured — please complete checkout instead."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tier_key = request.data.get("pricingTierId")
        try:
            tier = PricingTier.objects.get(key=tier_key)
        except PricingTier.DoesNotExist as exc:
            raise NotFound("This pricing tier doesn't exist.") from exc
        if tier.amount is None:
            raise ValidationError(
                {"pricingTierId": "This tier isn't self-serve — please contact us instead."}
            )

        subscription = activate_subscription(user=request.user, pricing_tier=tier)
        return Response(SubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)


class AdminSubscriptionViewSet(viewsets.ModelViewSet):
    """Staff-only full CRUD. Optional ?status= filter on list — same manual
    query-param approach as leads.AdminLeadListView. Creating/editing a subscription
    into status=active supersedes the user's other active ones, preserving the "at
    most one active subscription per user" invariant that orders.services's
    activate_subscription() also maintains for the real payment flow."""

    serializer_class = AdminSubscriptionSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Subscription.objects.select_related("user", "pricing_tier").all()
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    def perform_create(self, serializer):
        self._save_and_supersede(serializer)

    def perform_update(self, serializer):
        self._save_and_supersede(serializer)

    def _save_and_supersede(self, serializer):
        subscription = serializer.save()
        if subscription.status == Subscription.Status.ACTIVE:
            Subscription.objects.filter(user=subscription.user, status=Subscription.Status.ACTIVE).exclude(
                pk=subscription.pk
            ).update(status=Subscription.Status.EXPIRED)


class AdminSubscriptionStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        by_status = dict(Subscription.objects.values_list("status").annotate(count=Count("id")).order_by())
        by_tier = dict(
            Subscription.objects.filter(status=Subscription.Status.ACTIVE)
            .values_list("pricing_tier__key")
            .annotate(count=Count("id"))
            .order_by()
        )
        return Response(
            {
                "total": Subscription.objects.count(),
                "byStatus": by_status,
                "activeByTier": by_tier,
            }
        )
