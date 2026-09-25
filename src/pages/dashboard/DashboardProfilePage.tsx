import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { CountrySelect } from "@/components/common/CountrySelect";
import { CtaButton } from "@/components/common/CtaButton";
import { PasswordInput } from "@/components/common/PasswordInput";
import { useAuth } from "@/contexts/AuthContext";
import { useChangePasswordMutation, useUpdateProfileMutation } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from "@/lib/validation/authSchema";

export function DashboardProfilePage() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfileMutation();
  const changePassword = useChangePasswordMutation();

  const {
    register: registerProfile,
    control,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      company: user?.company ?? "",
      country: user?.country ?? "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  async function onProfileSubmit(values: ProfileFormValues) {
    try {
      await updateProfile.mutateAsync(values);
      toast.success("Profile updated.");
    } catch (err) {
      console.error("[DashboardProfilePage/onProfileSubmit]", err);
      toast.error("Couldn't save your profile right now, please try again shortly.");
    }
  }

  async function onPasswordSubmit(values: ChangePasswordFormValues) {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed.");
      resetPasswordForm();
    } catch (err) {
      console.error("[DashboardProfilePage/onPasswordSubmit]", err);
      toast.error(
        err instanceof ApiError && err.status === 400
          ? "Current password is incorrect."
          : "Couldn't change your password right now, please try again shortly.",
      );
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-xl border border-accent/30 bg-surface p-6">
        <h2 className="font-display text-lg font-bold capitalize text-accent">Profile Details</h2>

        <form
          onSubmit={(e) => void handleProfileSubmit(onProfileSubmit)(e)}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <FormControl error={!!profileErrors.name} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Full Name</FormLabel>
            <Input {...registerProfile("name")} />
            {profileErrors.name && <FormHelperText>{profileErrors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Email Address</FormLabel>
            <Input value={user?.email ?? ""} disabled />
            <FormHelperText>Contact us if you need to change your email address.</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Phone Number</FormLabel>
            <Input type="tel" {...registerProfile("phone")} />
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Company Name</FormLabel>
            <Input {...registerProfile("company")} />
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Country</FormLabel>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CountrySelect value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} />
              )}
            />
          </FormControl>

          <CtaButton type="submit" loading={isProfileSubmitting} disabled={isProfileSubmitting} sx={{ mt: 1 }}>
            Save Changes
          </CtaButton>
        </form>
      </div>

      <div className="rounded-xl border border-accent/30 bg-surface p-6">
        <h2 className="font-display text-lg font-bold capitalize text-accent">Change Password</h2>

        <form
          onSubmit={(e) => void handlePasswordSubmit(onPasswordSubmit)(e)}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <FormControl error={!!passwordErrors.currentPassword} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Current Password</FormLabel>
            <PasswordInput {...registerPassword("currentPassword")} />
            {passwordErrors.currentPassword && (
              <FormHelperText>{passwordErrors.currentPassword.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl error={!!passwordErrors.newPassword} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>New Password</FormLabel>
            <PasswordInput {...registerPassword("newPassword")} />
            {passwordErrors.newPassword && <FormHelperText>{passwordErrors.newPassword.message}</FormHelperText>}
          </FormControl>

          <FormControl error={!!passwordErrors.confirmNewPassword} required>
            <FormLabel sx={{ color: "var(--color-text-primary)" }}>Confirm New Password</FormLabel>
            <PasswordInput {...registerPassword("confirmNewPassword")} />
            {passwordErrors.confirmNewPassword && (
              <FormHelperText>{passwordErrors.confirmNewPassword.message}</FormHelperText>
            )}
          </FormControl>

          <CtaButton type="submit" loading={isPasswordSubmitting} disabled={isPasswordSubmitting} sx={{ mt: 1 }}>
            Change Password
          </CtaButton>
        </form>
      </div>
    </div>
  );
}
