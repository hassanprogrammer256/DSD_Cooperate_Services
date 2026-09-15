"""
Production. DEBUG is hardcoded False here — never an env var default — per
architecture.md's invariant that a stack trace must never reach a public response.
"""

from .base import *  # noqa: F401,F403
from .base import env

DEBUG = False

ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS")

DATABASES = {
    "default": env.db("DATABASE_URL"),
}

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")

# Off by default until a real domain + TLS cert exist in front of this deploy (see
# the EC2 runbook's Phase 8) — with no HTTPS listener, SECURE_SSL_REDIRECT sends every
# request into a redirect loop to a port nothing answers on, and the three
# *_COOKIE_SECURE flags make the browser silently drop cookies (including the JWT
# refresh cookie) since Secure cookies are never sent over plain HTTP. Set
# HTTPS_ENABLED=True in the environment once certbot is wired up.
HTTPS_ENABLED = env.bool("HTTPS_ENABLED", default=True)

SECURE_SSL_REDIRECT = HTTPS_ENABLED
SESSION_COOKIE_SECURE = HTTPS_ENABLED
CSRF_COOKIE_SECURE = HTTPS_ENABLED
SECURE_HSTS_SECONDS = 60 * 60 * 24 * 7 if HTTPS_ENABLED else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = HTTPS_ENABLED

JWT_REFRESH_COOKIE_SECURE = HTTPS_ENABLED
