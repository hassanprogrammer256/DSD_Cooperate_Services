from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password", "name", "phone", "company", "country"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    isStaff = serializers.BooleanField(source="is_staff", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "phone", "company", "country", "photo", "isStaff"]
        read_only_fields = ["id", "email"]


class ChangePasswordSerializer(serializers.Serializer):
    """Input-only — validated then applied in the view (accounts/views.py), same
    division of responsibility as CreateOrderSerializer in orders/serializers.py."""

    currentPassword = serializers.CharField(write_only=True)
    newPassword = serializers.CharField(write_only=True, min_length=8)


class GoogleAuthSerializer(serializers.Serializer):
    idToken = serializers.CharField(write_only=True)


class AdminUserSerializer(serializers.ModelSerializer):
    """Staff-only view of a registered account — the admin app's Users list/edit.
    Writable (name/phone/company/country/email/isStaff) for update; password is never
    read or written here — see AdminUserCreateSerializer (create) and
    accounts.views.AdminUserResetPasswordView (reset)."""

    isStaff = serializers.BooleanField(source="is_staff")
    dateJoined = serializers.DateTimeField(source="date_joined", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "name", "phone", "company", "country", "isStaff", "dateJoined"]
        read_only_fields = ["id"]


class AdminUserCreateSerializer(serializers.ModelSerializer):
    """Staff creating a new account from the admin app — the one place a password is
    set outside self-registration/Google sign-in."""

    password = serializers.CharField(write_only=True, min_length=8)
    isStaff = serializers.BooleanField(source="is_staff", default=False)

    class Meta:
        model = User
        fields = ["id", "email", "password", "name", "phone", "company", "country", "isStaff"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
