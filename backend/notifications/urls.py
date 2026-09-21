from django.urls import path

from notifications.views import MarkAllReadView, NotificationListView, NotificationMarkReadView

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="my-notifications"),
    path("notifications/<int:pk>/", NotificationMarkReadView.as_view(), name="notification-mark-read"),
    path("notifications/mark-all-read/", MarkAllReadView.as_view(), name="notifications-mark-all-read"),
]
