import { useEffect } from "react";

import Button from "@mui/joy/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FormStringListField } from "@/components/common/form/FormStringListField";
import { FormSwitchField } from "@/components/common/form/FormSwitchField";
import { FormTextField } from "@/components/common/form/FormTextField";
import { FormTextareaField } from "@/components/common/form/FormTextareaField";
import { ApiError } from "@/lib/api/client";
import { pricingApi } from "@/lib/api/content";
import { pricingTierSchema, type PricingTierFormValues } from "@/lib/validation/pricingSchema";

export function PricingFormPage() {
  const { id } = useParams();
  const isCreate = !id || id === "new";
  const navigate = useNavigate();
  const { data } = pricingApi.useList();
  const existing = !isCreate ? data?.find((p) => p.id === id) : undefined;
  const createMutation = pricingApi.useCreate();
  const updateMutation = pricingApi.useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PricingTierFormValues>({
    resolver: zodResolver(pricingTierSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: "",
      amount: null,
      currency: "AED",
      period: "",
      features: [],
      highlighted: false,
      order: 0,
    },
  });

  useEffect(() => {
    if (existing) reset(existing);
  }, [existing, reset]);

  async function onSubmit(values: PricingTierFormValues) {
    try {
      // Empty amount input means "not purchasable" (the Enterprise/Custom-tier
      // pattern) — send null, never an empty string, to the Decimal field.
      const payload = { ...values, amount: values.amount?.trim() ? values.amount.trim() : null };
      if (isCreate) {
        await createMutation.mutateAsync(payload);
        toast.success("Pricing tier created.");
      } else {
        await updateMutation.mutateAsync({ id: values.id, data: payload });
        toast.success("Pricing tier saved.");
      }
      navigate("/pricing");
    } catch (err) {
      console.error("[PricingFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this pricing tier right now.");
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">{isCreate ? "New Pricing Tier" : "Edit Pricing Tier"}</h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormTextField label="ID (slug)" registration={register("id")} error={errors.id?.message} required />
        <FormTextField label="Name" registration={register("name")} error={errors.name?.message} required />
        <FormTextareaField label="Description" registration={register("description")} error={errors.description?.message} required />
        <FormTextField
          label="Display Price (e.g. 'AED 4,500' or 'Custom')"
          registration={register("price")}
          error={errors.price?.message}
          required
        />
        <FormTextField
          label="Chargeable Amount (leave empty for non-purchasable tiers)"
          registration={register("amount")}
          error={errors.amount?.message as string | undefined}
        />
        <FormTextField label="Currency" registration={register("currency")} error={errors.currency?.message} required />
        <FormTextField label="Period Label (e.g. 'starting at')" registration={register("period")} error={errors.period?.message} />
        <FormStringListField label="Features" name="features" control={control} />
        <FormSwitchField label="Highlighted ('Most Popular')" name="highlighted" control={control} />
        <FormTextField
          label="Display Order"
          type="number"
          registration={register("order", { valueAsNumber: true })}
          error={errors.order?.message}
        />
        <div className="mt-2 flex gap-2">
          <Button type="submit" color="primary" loading={isSubmitting}>
            Save
          </Button>
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/pricing")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
