from django.urls import path

from service_requests.views import (
    AdminServiceRequestListView,
    AdminServiceRequestStatsView,
    AdminServiceRequestUpdateView,
    ServiceRequestListCreateView,
)

urlpatterns = [
    path("service-requests/", ServiceRequestListCreateView.as_view(), name="my-service-requests"),
    path("admin/service-requests/", AdminServiceRequestListView.as_view(), name="admin-service-requests"),
    path(
        "admin/service-requests/<int:pk>/",
        AdminServiceRequestUpdateView.as_view(),
        name="admin-service-request-update",
    ),
    path(
        "admin/service-requests/stats/",
        AdminServiceRequestStatsView.as_view(),
        name="admin-service-requests-stats",
    ),
]
