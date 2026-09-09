"""
Local development. SQLite, not Postgres — see architecture.md's Hosting Proposal and
progress-tracker.md's pivot record for why: no local Postgres/Docker was available in
this build environment, and SQLite-for-dev / Postgres-for-prod is Django's own default
pattern, not a project-specific hack. Swap DATABASES below for a local Postgres the
moment one is available, to catch dev/prod differences earlier.
"""

from .base import *  # noqa: F401,F403
from .base import BASE_DIR, env

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1","dsd-cooperate-services.onrender.com"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # public site
    "http://localhost:5174", "https://dsdcooperateservices-q9q98tzhp-hassanprogrammer256s-projects.vercel.app/" # admin app (once scaffolded, Phase 14)
]

# Refresh-token cookie (see accounts/views.py) — "Secure" requires HTTPS, which local
# dev doesn't have. Never set this to False in prod.py.
JWT_REFRESH_COOKIE_SECURE = False

# No real SMTP credentials in this build environment (EMAIL_HOST is empty) — prints
# order-confirmation emails to the runserver console instead of actually sending them.
# Same reasoning as SQLite-for-dev above: a real backend the moment real credentials
# exist, never set this in prod.py.
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
