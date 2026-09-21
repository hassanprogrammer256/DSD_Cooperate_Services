from django.contrib import admin

from orders.models import Order, Payment, Subscription

admin.site.register(Order)
admin.site.register(Payment)
# Also how staff manually activate a Subscription for the non-purchasable Enterprise
# tier — pick the user + tier here and save (see orders/models.py's Subscription
# docstring).
admin.site.register(Subscription)
