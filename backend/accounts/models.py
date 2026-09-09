from django.contrib.auth.models import AbstractUser
from django.db import models

from accounts.managers import UserManager


class User(AbstractUser):
    # Email is the username — no separate username field. is_staff (inherited from
    # AbstractUser) is the ONLY distinction between a customer and a staff account; see
    # architecture.md's Auth Flow.
    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=32, blank=True)
    # Shown in the admin app's sidebar (name + photo) — see progress-tracker.md's
    # 2026-09-09 entry. Set via Django's own /admin/ (accounts/admin.py) for now; no
    # self-service profile editor exists yet. Optional — the sidebar falls back to an
    # initials avatar rather than a fabricated stock photo when this is unset.
    photo = models.FileField(upload_to="staff/", blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    objects = UserManager()

    def __str__(self) -> str:
        return self.email
