import { useEffect, useState } from "react";

import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { FormTextField } from "@/components/common/form/FormTextField";
import { ApiError } from "@/lib/api/client";
import { useResetUserPasswordMutation, usersApi } from "@/lib/api/users";
import { userFormSchema, type UserFormValues } from "@/lib/validation/userSchema";

export function UserFormPage() {
  const { id } = useParams();
  const isCreate = !id || id === "new";
  const navigate = useNavigate();
  const { data } = usersApi.useList();
  const existing = !isCreate ? data?.find((u) => String(u.id) === id) : undefined;
  const createMutation = usersApi.useCreate();
  const updateMutation = usersApi.useUpdate();
  const deleteMutation = usersApi.useDelete();
  const resetPasswordMutation = useResetUserPasswordMutation();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {
    register,
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { email: "", name: "", phone: "", company: "", country: "", isStaff: false, password: "" },
  });

  useEffect(() => {
    if (existing) reset({ ...existing, password: "" });
  }, [existing, reset]);

  async function onSubmit(values: UserFormValues) {
    if (isCreate && values.password.length < 8) {
      setError("password", { message: "Password must be at least 8 characters" });
      return;
    }
    try {
      if (isCreate) {
        await createMutation.mutateAsync(values);
        toast.success("User created.");
      } else if (existing) {
        const { password: _password, ...data } = values;
        await updateMutation.mutateAsync({ id: String(existing.id), data });
        toast.success("User saved.");
      }
      navigate("/users");
    } catch (err) {
      console.error("[UserFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this user right now.");
    }
  }

  async function onResetPassword() {
    if (!existing) return;
    try {
      const result = await resetPasswordMutation.mutateAsync(existing.id);
      // autoClose: false — this is a one-time secret; auto-dismissing before staff can
      // copy it would lose it permanently (it's never shown again).
      toast.info(`New password for ${existing.email}: ${result.newPassword}`, { autoClose: false });
    } catch (err) {
      console.error("[UserFormPage/onResetPassword]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't reset this user's password.");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">{isCreate ? "New User" : "Edit User"}</h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormTextField label="Full Name" registration={register("name")} error={errors.name?.message} required />
        <FormTextField
          label="Email Address"
          type="email"
          registration={register("email")}
          error={errors.email?.message}
          required
        />
        {isCreate && (
          <FormTextField
            label="Password"
            type="password"
            registration={register("password")}
            error={errors.password?.message}
            required
          />
        )}
        <FormTextField label="Phone" registration={register("phone")} error={errors.phone?.message} />
        <FormTextField label="Company" registration={register("company")} error={errors.company?.message} />
        <FormTextField label="Country" registration={register("country")} error={errors.country?.message} />

        <Controller
          name="isStaff"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              label="Staff account (has admin access)"
            />
          )}
        />

        <div className="mt-2 flex flex-wrap gap-2">
          <Button type="submit" color="primary" loading={isSubmitting}>
            Save
          </Button>
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/users")}>
            Cancel
          </Button>
          {!isCreate && (
            <>
              <Button
                type="button"
                variant="outlined"
                color="neutral"
                loading={resetPasswordMutation.isPending}
                onClick={() => void onResetPassword()}
              >
                Reset Password
              </Button>
              <Button type="button" variant="plain" color="danger" onClick={() => setConfirmingDelete(true)}>
                Delete
              </Button>
            </>
          )}
        </div>
      </form>

      <ConfirmDeleteModal
        open={confirmingDelete}
        itemLabel={existing?.email ?? ""}
        loading={deleteMutation.isPending}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          if (!existing) return;
          deleteMutation.mutate(String(existing.id), {
            onSuccess: () => {
              toast.success("User deleted.");
              navigate("/users");
            },
            onError: (err) => {
              console.error("[UserFormPage/onDelete]", err);
              toast.error(err instanceof ApiError ? err.message : "Couldn't delete this user.");
            },
          });
        }}
      />
    </div>
  );
}
