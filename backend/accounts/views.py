import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import ProtectedError
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.firebase import FirebaseTokenError, verify_firebase_id_token
from accounts.serializers import (
    AdminUserCreateSerializer,
    AdminUserSerializer,
    ChangePasswordSerializer,
    GoogleAuthSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()

REFRESH_COOKIE_NAME = "refresh_token"
REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60  # matches SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    # See library-docs.md's simplejwt section for why this exists: the refresh token
    # must never be reachable from JS (httponly)  must never be present in a JSON
    # response body.
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        refresh_token,
        httponly=True,
        secure=settings.JWT_REFRESH_COOKIE_SECURE,
        samesite="Lax",
        max_age=REFRESH_COOKIE_MAX_AGE,
    )


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        response = Response(
            {"access": str(refresh.access_token), "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )
        _set_refresh_cookie(response, str(refresh))
        return response


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code != status.HTTP_200_OK:
            return response
        refresh = response.data.pop("refresh")
        _set_refresh_cookie(response, refresh)
        return response


class GoogleAuthView(APIView):
    """POST {idToken} — a Firebase Auth ID token from the frontend's
    signInWithPopup(GoogleAuthProvider). Verified via accounts/firebase.py (Google's
    public keys, no service-account credentials). Gets-or-creates a User by the
    token's email — an existing password-registered account with the same email just
    signs in, matching this project's USERNAME_FIELD = email convention. New users
    get an unusable password (set_password(None)) since they'll only ever
    authenticate via Google."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            payload = verify_firebase_id_token(serializer.validated_data["idToken"])
        except FirebaseTokenError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_401_UNAUTHORIZED)

        email = payload.get("email")
        if not email:
            return Response(
                {"detail": "This Google account has no email address on file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user, created = User.objects.get_or_create(
            email=email, defaults={"name": payload.get("name", "") or email}
        )
        if created:
            user.set_unusable_password()
            user.save(update_fields=["password"])

        refresh = RefreshToken.for_user(user)
        response = Response(
            {"access": str(refresh.access_token), "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
        _set_refresh_cookie(response, str(refresh))
        return response


class RefreshView(APIView):
    """Reads the httpOnly cookie, not the request body — this is why simplejwt's own
    TokenRefreshView can't be used directly here. See library-docs.md."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        raw_refresh = request.COOKIES.get(REFRESH_COOKIE_NAME)
        if not raw_refresh:
            return Response({"detail": "No refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(raw_refresh)
        except TokenError:
            return Response({"detail": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"access": str(refresh.access_token)})


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(REFRESH_COOKIE_NAME)
        return response


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        current_password = serializer.validated_data["currentPassword"]
        new_password = serializer.validated_data["newPassword"]

        if not request.user.check_password(current_password):
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save(update_fields=["password"])
        return Response(status=status.HTTP_200_OK)


class AdminUserViewSet(viewsets.ModelViewSet):
    """Staff-only full CRUD over registered accounts — the admin app's Users view.
    Create sets a real password (AdminUserCreateSerializer); update never touches
    password (see AdminUserResetPasswordView for that)."""

    queryset = User.objects.all().order_by("-date_joined")
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        return AdminUserCreateSerializer if self.action == "create" else AdminUserSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            # Order.user is on_delete=PROTECT — a customer with purchase history can't
            # be hard-deleted without destroying financial records. Staff should
            # deactivate/edit instead, not delete.
            return Response(
                {"detail": "This user has orders on file and can't be deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class AdminUserResetPasswordView(APIView):
    """Staff-only — issues a new random password for an account (e.g. a locked-out
    customer) without needing the old one. Returned once in the response; not stored
    anywhere staff can read it again, same as any "reset" flow."""

    permission_classes = [permissions.IsAdminUser]

    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.get(pk=kwargs["pk"])
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        new_password = secrets.token_urlsafe(12)
        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({"newPassword": new_password})


class AdminUserStatsView(APIView):
    """Staff-only. Total + a 7-day signup trend — enough for the admin dashboard's
    "users signed up" chart without building a general-purpose time-series endpoint."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        by_day = []
        for offset in range(6, -1, -1):
            day = today - timedelta(days=offset)
            count = User.objects.filter(date_joined__date=day).count()
            by_day.append({"date": day.isoformat(), "count": count})

        return Response(
            {
                "total": User.objects.count(),
                "staffCount": User.objects.filter(is_staff=True).count(),
                "newLast7Days": User.objects.filter(date_joined__gte=timezone.now() - timedelta(days=7)).count(),
                "newLast30Days": User.objects.filter(date_joined__gte=timezone.now() - timedelta(days=30)).count(),
                "signupsByDay": by_day,
            }
        )
