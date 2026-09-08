import { useEffect } from "react";

import Button from "@mui/joy/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FormTextField } from "@/components/common/form/FormTextField";
import { statsApi } from "@/lib/api/content";
import { statSchema, type StatFormValues } from "@/lib/validation/statSchema";
import { ApiError } from "@/lib/api/client";

export function StatFormPage() {
  const { id } = useParams();
  const isCreate = !id || id === "new";
  const navigate = useNavigate();
  const { data } = statsApi.useList();
  const existing = !isCreate ? data?.find((s) => s.id === id) : undefined;
  const createMutation = statsApi.useCreate();
  const updateMutation = statsApi.useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StatFormValues>({
    resolver: zodResolver(statSchema),
    defaultValues: { id: "", value: 0, suffix: "", label: "", order: 0 },
  });

  useEffect(() => {
    if (existing) reset(existing);
  }, [existing, reset]);

  async function onSubmit(values: StatFormValues) {
    try {
      if (isCreate) {
        await createMutation.mutateAsync(values);
        toast.success("Stat created.");
      } else {
        await updateMutation.mutateAsync({ id: values.id, data: values });
        toast.success("Stat saved.");
      }
      navigate("/stats");
    } catch (err) {
      console.error("[StatFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this stat right now.");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">{isCreate ? "New Stat" : "Edit Stat"}</h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormTextField label="ID (slug)" registration={register("id")} error={errors.id?.message} required />
        <FormTextField label="Label" registration={register("label")} error={errors.label?.message} required />
        <FormTextField
          label="Value"
          type="number"
          registration={register("value", { valueAsNumber: true })}
          error={errors.value?.message}
          required
        />
        <FormTextField label="Suffix (e.g. +, %)" registration={register("suffix")} error={errors.suffix?.message} />
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
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/stats")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
