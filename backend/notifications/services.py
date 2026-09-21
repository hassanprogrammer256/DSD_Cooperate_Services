"""The one place a Notification row gets created — callers (service_requests today)
use notify() instead of instantiating the model directly, so every notification stays
consistent and this stays the single seam to extend later (e.g. push/websocket)."""

from notifications.models import Notification


def notify(user, *, kind: str, title: str, body: str = "") -> Notification:
    return Notification.objects.create(user=user, kind=kind, title=title, body=body)
