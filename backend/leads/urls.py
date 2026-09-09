from django.urls import path

from leads.views import AdminLeadListView, AdminLeadStatsView, AdminLeadUpdateView, LeadCreateView

urlpatterns = [
    path("leads/", LeadCreateView.as_view(), name="lead-create"),
    path("admin/leads/", AdminLeadListView.as_view(), name="admin-leads"),
    path("admin/leads/<int:pk>/", AdminLeadUpdateView.as_view(), name="admin-lead-update"),
    path("admin/leads/stats/", AdminLeadStatsView.as_view(), name="admin-leads-stats"),
]
