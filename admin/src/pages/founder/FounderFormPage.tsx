import { useEffect } from "react";

import Button from "@mui/joy/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { QueryState } from "@/components/common/QueryState";
import { FormFileField } from "@/components/common/form/FormFileField";
import { FormTextField } from "@/components/common/form/FormTextField";
import { FormTextareaField } from "@/components/common/form/FormTextareaField";
import { ApiError } from "@/lib/api/client";
import { useFounderQuery, useUpdateFounderMutation } from "@/lib/api/founder";
import { buildContentPayload } from "@/lib/contentPayload";
import { founderSchema, type FounderFormValues } from "@/lib/validation/founderSchema";

export function FounderFormPage() {
  const { data, isLoading, isError, refetch } = useFounderQuery();
  const updateMutation = useUpdateFounderMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FounderFormValues>({
    resolver: zodResolver(founderSchema),
    defaultValues: { name: "", role: "", bio: "", email: "", linkedin: "" },
  });

  useEffect(() => {
    if (data) reset({ name: data.name, role: data.role, bio: data.bio, email: data.email, linkedin: data.linkedin });
  }, [data, reset]);

  async function onSubmit(values: FounderFormValues) {
    try {
      const payload = buildContentPayload(values, { fileFields: ["photo"] });
      await updateMutation.mutateAsync(payload);
      toast.success("Founder profile saved.");
    } catch (err) {
      console.error("[FounderFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save the founder profile right now.");
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">Founder</h1>
      <QueryState isLoading={isLoading} isError={isError} onRetry={() => void refetch()}>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
          <FormFileField label="Photo" name="photo" control={control} currentUrl={data?.photo} />
          <FormTextField label="Name" registration={register("name")} error={errors.name?.message} required />
          <FormTextField label="Role" registration={register("role")} error={errors.role?.message} required />
          <FormTextareaField label="Bio" registration={register("bio")} error={errors.bio?.message} required />
          <FormTextField label="Email" registration={register("email")} error={errors.email?.message} />
          <FormTextField label="LinkedIn URL" registration={register("linkedin")} error={errors.linkedin?.message} />
          <div className="mt-2">
            <Button type="submit" color="primary" loading={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </QueryState>
    </div>
  );
}
