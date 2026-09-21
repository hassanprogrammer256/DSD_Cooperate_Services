from django.db.models import Count
from rest_framework import generics, permissions
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.models import Notification
from notifications.services import notify
from orders.models import Subscription
from service_requests.emails import send_service_request_notifications, send_status_change_email
from service_requests.models import ServiceRequest
from service_requests.serializers import (
    AdminServiceRequestSerializer,
    ServiceRequestCreateSerializer,
    ServiceRequestSerializer,
    ServiceRequestStatusUpdateSerializer,
)


def _current_subscription_for(user, service):
    # Prefer a subscription whose plan actually includes this service; fall back to
    # any other active subscription so the request isn't left unlinked just because
    # the allow-list doesn't (yet) cover it.
    subscription = Subscription.objects.filter(
        user=user, status=Subscription.Status.ACTIVE, pricing_tier__services=service
    ).first()
    if subscription is None:
        subscription = Subscription.objects.filter(user=user, status=Subscription.Status.ACTIVE).first()
    return subscription


class ServiceRequestListCreateView(generics.ListCreateAPIView):
    """GET lists the logged-in customer's own submitted requests. POST submits a new
    one — authenticated customers only, a dashboard feature, not a public conversion
    mechanism (contrast with leads.LeadCreateView). Mirrors
    orders.OrderListCreateView's GET/POST-on-one-path shape."""

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return ServiceRequest.objects.filter(user=self.request.user).select_related("service")

    def get_serializer_class(self):
        return ServiceRequestCreateSerializer if self.request.method == "POST" else ServiceRequestSerializer

    def perform_create(self, serializer):
        service = serializer.validated_data["service"]
        service_request = serializer.save(
            user=self.request.user,
            subscription=_current_subscription_for(self.request.user, service),
        )
        send_service_request_notifications(service_request)
        notify(
            service_request.user,
            kind=Notification.Kind.SERVICE_REQUEST,
            title=f"We received your request ({service_request.reference})",
            body=f"Your request for {service_request.service.title} is being reviewed.",
        )
        self._created_request = service_request

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = ServiceRequestSerializer(self._created_request).data
        return response


class AdminServiceRequestListView(generics.ListAPIView):
    """Staff-only. Optional ?status= filter — same manual query-param approach as
    leads.AdminLeadListView (see that view's comment for the dependency reasoning)."""

    serializer_class = AdminServiceRequestSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = ServiceRequest.objects.select_related("service", "user").all()
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset


class AdminServiceRequestUpdateView(generics.UpdateAPIView):
    """Staff-only — status is the one write action, same scope decision as
    leads.AdminLeadUpdateView. Also notifies + emails the customer on change."""

    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_update(self, serializer):
        service_request = serializer.save()
        notify(
            service_request.user,
            kind=Notification.Kind.SERVICE_REQUEST,
            title=f"Your request {service_request.reference} is now {service_request.get_status_display()}",
        )
        send_status_change_email(service_request)


class AdminServiceRequestStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        by_status = dict(ServiceRequest.objects.values_list("status").annotate(count=Count("id")).order_by())
        return Response({"total": ServiceRequest.objects.count(), "byStatus": by_status})
