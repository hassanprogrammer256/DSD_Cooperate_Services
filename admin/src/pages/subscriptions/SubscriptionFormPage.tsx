import { useEffect, useState } from "react";

import Autocomplete from "@mui/joy/Autocomplete";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { ConfirmDeleteModal } from "@/components/common/ConfirmDeleteModal";
import { ApiError } from "@/lib/api/client";
import { pricingApi } from "@/lib/api/content";
import {
  useAdminSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from "@/lib/api/subscriptions";
import { usersApi } from "@/lib/api/users";
import { subscriptionSchema, type SubscriptionFormValues } from "@/lib/validation/subscriptionSchema";
import type { AdminUser, SubscriptionStatus } from "@/types";

const STATUS_OPTIONS: { value: SubscriptionStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

export function SubscriptionFormPage() {
  const { id } = useParams();
  const isCreate = !id || id === "new";
  const navigate = useNavigate();

  const { data: subscriptions } = useAdminSubscriptionsQuery();
  const existing = !isCreate ? subscriptions?.find((s) => String(s.id) === id) : undefined;
  const { data: users } = usersApi.useList();
  const { data: tiers } = pricingApi.useList();

  const createMutation = useCreateSubscriptionMutation();
  const updateMutation = useUpdateSubscriptionMutation();
  const deleteMutation = useDeleteSubscriptionMutation();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { userId: 0, tierId: "", status: "active", expiresAt: "" },
  });

  useEffect(() => {
    if (existing && users) {
      const matchedUser = users.find((u) => u.email === existing.customerEmail);
      reset({
        userId: matchedUser?.id ?? 0,
        tierId: existing.tierId,
        status: existing.status,
        expiresAt: existing.expiresAt ? existing.expiresAt.slice(0, 10) : "",
      });
    }
  }, [existing, users, reset]);

  async function onSubmit(values: SubscriptionFormValues) {
    const payload = {
      userId: values.userId,
      tierId: values.tierId,
      status: values.status,
      expiresAt: values.expiresAt || null,
    };
    try {
      if (isCreate) {
        await createMutation.mutateAsync(payload);
        toast.success("Subscription created.");
      } else if (existing) {
        await updateMutation.mutateAsync({ id: existing.id, data: payload });
        toast.success("Subscription saved.");
      }
      navigate("/subscriptions");
    } catch (err) {
      console.error("[SubscriptionFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this subscription right now.");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">
        {isCreate ? "New Subscription" : "Edit Subscription"}
      </h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormControl error={!!errors.userId} required>
          <FormLabel>Customer</FormLabel>
          <Controller
            name="userId"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={users ?? []}
                getOptionLabel={(option: AdminUser) => `${option.name || option.email} (${option.email})`}
                isOptionEqualToValue={(option: AdminUser, val: AdminUser) => option.id === val.id}
                value={users?.find((u) => u.id === field.value) ?? null}
                onChange={(_event, newValue) => field.onChange(newValue?.id ?? 0)}
                placeholder="Select customer"
              />
            )}
          />
          {errors.userId && <FormHelperText>{errors.userId.message}</FormHelperText>}
        </FormControl>

        <FormControl error={!!errors.tierId} required>
          <FormLabel>Plan</FormLabel>
          <Controller
            name="tierId"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Select plan"
                value={field.value || null}
                onChange={(_event, value) => field.onChange(value ?? "")}
              >
                {(tiers ?? []).map((tier) => (
                  <Option key={tier.id} value={tier.id}>
                    {tier.name}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.tierId && <FormHelperText>{errors.tierId.message}</FormHelperText>}
        </FormControl>

        <FormControl required>
          <FormLabel>Status</FormLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onChange={(_event, value) => field.onChange(value)}>
                {STATUS_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Expires (optional)</FormLabel>
          <Controller
            name="expiresAt"
            control={control}
            render={({ field }) => <Input type="date" {...field} />}
          />
          <FormHelperText>Informational only — nothing auto-expires or auto-renews.</FormHelperText>
        </FormControl>

        <div className="mt-2 flex flex-wrap gap-2">
          <Button type="submit" color="primary" loading={isSubmitting}>
            Save
          </Button>
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/subscriptions")}>
            Cancel
          </Button>
          {!isCreate && (
            <Button type="button" variant="plain" color="danger" onClick={() => setConfirmingDelete(true)}>
              Delete
            </Button>
          )}
        </div>
      </form>

      <ConfirmDeleteModal
        open={confirmingDelete}
        itemLabel={existing ? `${existing.customerName}'s ${existing.tierName} subscription` : ""}
        loading={deleteMutation.isPending}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          if (!existing) return;
          deleteMutation.mutate(existing.id, {
            onSuccess: () => {
              toast.success("Subscription deleted.");
              navigate("/subscriptions");
            },
            onError: (err) => {
              console.error("[SubscriptionFormPage/onDelete]", err);
              toast.error(err instanceof ApiError ? err.message : "Couldn't delete this subscription.");
            },
          });
        }}
      />
    </div>
  );
}
