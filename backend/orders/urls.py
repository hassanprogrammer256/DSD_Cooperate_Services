from django.urls import include, path
from rest_framework.routers import SimpleRouter

from orders.views import (
    AdminOrderListView,
    AdminSubscriptionStatsView,
    AdminSubscriptionViewSet,
    FreeSubscriptionActivateView,
    OrderListCreateView,
    SubscriptionListView,
)

router = SimpleRouter()
router.register("admin/subscriptions", AdminSubscriptionViewSet, basename="admin-subscription")

urlpatterns = [
    path("orders/", OrderListCreateView.as_view(), name="my-orders"),
    path("admin/orders/", AdminOrderListView.as_view(), name="admin-orders"),
    path("subscriptions/", SubscriptionListView.as_view(), name="my-subscriptions"),
    path("subscriptions/activate-free/", FreeSubscriptionActivateView.as_view(), name="activate-free-subscription"),
    # Listed before the router's own admin/subscriptions/<pk>/ pattern — SimpleRouter's
    # default lookup regex ([^/.]+) would otherwise greedily match "stats" as a pk.
    path("admin/subscriptions/stats/", AdminSubscriptionStatsView.as_view(), name="admin-subscriptions-stats"),
    path("", include(router.urls)),
]
