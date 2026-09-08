import { useEffect } from "react";

import Button from "@mui/joy/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FormFileField } from "@/components/common/form/FormFileField";
import { FormTextField } from "@/components/common/form/FormTextField";
import { FormTextareaField } from "@/components/common/form/FormTextareaField";
import { ApiError } from "@/lib/api/client";
import { testimonialsApi } from "@/lib/api/content";
import { buildContentPayload } from "@/lib/contentPayload";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validation/testimonialSchema";

export function TestimonialFormPage() {
  const { id } = useParams();
  const isCreate = !id || id === "new";
  const navigate = useNavigate();
  const { data } = testimonialsApi.useList();
  const existing = !isCreate ? data?.find((t) => t.id === id) : undefined;
  const createMutation = testimonialsApi.useCreate();
  const updateMutation = testimonialsApi.useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { quote: "", name: "", role: "" },
  });

  useEffect(() => {
    if (existing) reset({ quote: existing.quote, name: existing.name, role: existing.role });
  }, [existing, reset]);

  async function onSubmit(values: TestimonialFormValues) {
    try {
      const payload = buildContentPayload(values, { fileFields: ["avatar"] });
      if (isCreate) {
        await createMutation.mutateAsync(payload);
        toast.success("Testimonial created.");
      } else if (existing) {
        await updateMutation.mutateAsync({ id: existing.id, data: payload });
        toast.success("Testimonial saved.");
      }
      navigate("/testimonials");
    } catch (err) {
      console.error("[TestimonialFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this testimonial right now.");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">{isCreate ? "New Testimonial" : "Edit Testimonial"}</h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormTextField label="Name" registration={register("name")} error={errors.name?.message} required />
        <FormTextField label="Role" registration={register("role")} error={errors.role?.message} required />
        <FormTextareaField label="Quote" registration={register("quote")} error={errors.quote?.message} required />
        <FormFileField label="Avatar" name="avatar" control={control} currentUrl={existing?.avatar} required={isCreate} />
        <div className="mt-2 flex gap-2">
          <Button type="submit" color="primary" loading={isSubmitting}>
            Save
          </Button>
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/testimonials")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
