from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from .views import HealthCheck

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/", include("accounts.admin_urls")),
    path("api/", include("content.urls")),
    path("api/", include("orders.urls")),
    path("api/", include("leads.urls")),
    path("api/", include("notifications.urls")),
    path("api/", include("service_requests.urls")),
    path("", HealthCheck,name="health_check"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
