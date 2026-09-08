from django.urls import path

from orders.views import AdminOrderListView, OrderListCreateView

urlpatterns = [
    path("orders/", OrderListCreateView.as_view(), name="my-orders"),
    path("admin/orders/", AdminOrderListView.as_view(), name="admin-orders"),
]
