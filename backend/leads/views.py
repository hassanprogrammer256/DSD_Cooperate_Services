from django.db.models import Count
from rest_framework import generics, permissions
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from leads.emails import send_lead_notifications
from leads.models import Lead
from leads.serializers import LeadCreateSerializer, LeadSerializer, LeadStatusUpdateSerializer
from leads.webhooks import forward_to_external_crm


class LeadCreateView(generics.CreateAPIView):
    """Public — any visitor can submit an enquiry. Never requires auth; this is the
    site's whole conversion mechanism, not a customer-account feature."""

    permission_classes = [permissions.AllowAny]
    serializer_class = LeadCreateSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        lead = serializer.save(source_url=self.request.META.get("HTTP_REFERER", ""))
        send_lead_notifications(lead)
        forward_to_external_crm(lead)
        self._created_lead = lead

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {"reference": self._created_lead.reference}
        return response


class AdminLeadListView(generics.ListAPIView):
    """Staff-only. Optional ?status=&mainService= filters — a plain query-param check
    rather than adding django-filter as a new dependency for two simple equality
    filters (see code-standards.md's "does DRF already provide this" dependency rule)."""

    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Lead.objects.all()
        status_param = self.request.query_params.get("status")
        service_param = self.request.query_params.get("mainService")
        if status_param:
            queryset = queryset.filter(status=status_param)
        if service_param:
            queryset = queryset.filter(main_service=service_param)
        return queryset


class AdminLeadUpdateView(generics.UpdateAPIView):
    """Staff-only — the one write action this phase supports (see
    progress-tracker.md's 2026-09-09 entry for what's deliberately out of scope: the
    8-stage-pipeline UI, auto-routing, auto-priority, and dedup all stay unbuilt)."""

    queryset = Lead.objects.all()
    serializer_class = LeadStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminLeadStatsView(APIView):
    """Staff-only — the "basic lead-count stats" scope decision, short of the spec's
    full analytics/lead-source dashboard."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        by_status = dict(Lead.objects.values_list("status").annotate(count=Count("id")).order_by())
        by_service = dict(Lead.objects.values_list("main_service").annotate(count=Count("id")).order_by())
        return Response(
            {
                "total": Lead.objects.count(),
                "byStatus": by_status,
                "byService": by_service,
            }
        )
