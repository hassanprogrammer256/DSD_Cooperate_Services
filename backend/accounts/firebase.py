"""Verifies a Firebase Auth ID token using Google's published public keys — no
firebase-admin SDK and no service-account credentials needed. This is the documented
alternative Firebase itself describes for backends that can't use the Admin SDK: fetch
Google's current signing certs, check the RS256 signature, then check the standard
claims (aud/iss/exp/iat/sub) by hand. See:
https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
"""

import time

import jwt
import requests
from cryptography.x509 import load_pem_x509_certificate
from django.conf import settings

CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"

# Process-local cache — Google's response carries a Cache-Control max-age (usually
# several hours); refetching on every request would be wasteful and rate-limit-risky.
_certs_cache: dict[str, str] = {}
_certs_fetched_at: float = 0.0
_CERTS_TTL_SECONDS = 3600


class FirebaseTokenError(Exception):
    pass


def _get_certs() -> dict[str, str]:
    global _certs_cache, _certs_fetched_at
    now = time.time()
    if _certs_cache and (now - _certs_fetched_at) < _CERTS_TTL_SECONDS:
        return _certs_cache

    response = requests.get(CERTS_URL, timeout=10)
    response.raise_for_status()
    _certs_cache = response.json()
    _certs_fetched_at = now
    return _certs_cache


def verify_firebase_id_token(id_token: str) -> dict:
    """Returns the decoded token payload (email, name, sub/uid, ...) or raises
    FirebaseTokenError with a human-readable reason."""
    try:
        header = jwt.get_unverified_header(id_token)
    except jwt.InvalidTokenError as exc:
        raise FirebaseTokenError("Malformed token.") from exc

    kid = header.get("kid")
    if not kid:
        raise FirebaseTokenError("Token is missing a key id.")

    try:
        certs = _get_certs()
    except requests.RequestException as exc:
        raise FirebaseTokenError("Could not reach Google to verify this token.") from exc

    cert_pem = certs.get(kid)
    if not cert_pem:
        raise FirebaseTokenError("Token was signed with an unrecognised key.")

    # PyJWT's jwt.decode() needs a public key object, not a raw x509 PEM cert — extract
    # it via the cryptography library's x509 loader (already a PyJWT[RS256] dependency).
    certificate = load_pem_x509_certificate(cert_pem.encode())
    public_key = certificate.public_key()

    project_id = settings.FIREBASE_PROJECT_ID
    try:
        payload = jwt.decode(
            id_token,
            key=public_key,
            algorithms=["RS256"],
            audience=project_id,
            issuer=f"https://securetoken.google.com/{project_id}",
        )
    except jwt.ExpiredSignatureError as exc:
        raise FirebaseTokenError("This sign-in link has expired, please try again.") from exc
    except jwt.InvalidTokenError as exc:
        raise FirebaseTokenError("Could not verify this Google sign-in.") from exc

    if not payload.get("sub"):
        raise FirebaseTokenError("Token is missing a subject.")

    return payload
