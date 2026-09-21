from django.urls import include, path
from rest_framework.routers import SimpleRouter

from accounts.views import AdminUserResetPasswordView, AdminUserStatsView, AdminUserViewSet

# Separate from accounts/urls.py (mounted at /api/auth/) so these land under the same
# /api/admin/... prefix every other admin-facing endpoint uses (leads, orders,
# service-requests) — see config/urls.py.
router = SimpleRouter()
router.register("admin/users", AdminUserViewSet, basename="admin-user")

urlpatterns = [
    # Listed before the router's own admin/users/<pk>/ pattern — SimpleRouter's
    # default lookup regex ([^/.]+) would otherwise greedily match "stats" as a pk.
    # Django resolves urlpatterns in list order, first match wins.
    path("admin/users/stats/", AdminUserStatsView.as_view(), name="admin-users-stats"),
    path("admin/users/<int:pk>/reset-password/", AdminUserResetPasswordView.as_view(), name="admin-user-reset-password"),
    path("", include(router.urls)),
]
