import { useEffect } from "react";

import Button from "@mui/joy/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FormFileField } from "@/components/common/form/FormFileField";
import { FormMultiSelectField } from "@/components/common/form/FormMultiSelectField";
import { FormStringListField } from "@/components/common/form/FormStringListField";
import { FormTextField } from "@/components/common/form/FormTextField";
import { FormTextareaField } from "@/components/common/form/FormTextareaField";
import { ApiError } from "@/lib/api/client";
import { complianceApi, insightsApi } from "@/lib/api/content";
import { buildContentPayload } from "@/lib/contentPayload";
import { complianceAreaSchema, type ComplianceAreaFormValues } from "@/lib/validation/complianceSchema";

export function ComplianceFormPage() {
  const { slug } = useParams();
  const isCreate = !slug || slug === "new";
  const navigate = useNavigate();
  const { data } = complianceApi.useList();
  const { data: insights } = insightsApi.useList();
  const existing = !isCreate ? data?.find((c) => c.slug === slug) : undefined;
  const createMutation = complianceApi.useCreate();
  const updateMutation = complianceApi.useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ComplianceAreaFormValues>({
    resolver: zodResolver(complianceAreaSchema),
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      description: "",
      obligations: [],
      notes: "",
      sourceName: "",
      relatedInsightSlugs: [],
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        slug: existing.slug,
        title: existing.title,
        summary: existing.summary,
        description: existing.description,
        obligations: existing.obligations,
        notes: existing.notes,
        sourceName: existing.sourceName,
        relatedInsightSlugs: existing.relatedInsightSlugs,
      });
    }
  }, [existing, reset]);

  async function onSubmit(values: ComplianceAreaFormValues) {
    try {
      const payload = buildContentPayload(values, { fileFields: ["heroImage"], jsonFields: ["obligations"] });
      if (isCreate) {
        await createMutation.mutateAsync(payload);
        toast.success("Compliance area created.");
      } else if (existing) {
        await updateMutation.mutateAsync({ id: existing.slug, data: payload });
        toast.success("Compliance area saved.");
      }
      navigate("/compliance");
    } catch (err) {
      console.error("[ComplianceFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this compliance area right now.");
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">{isCreate ? "New Compliance Area" : "Edit Compliance Area"}</h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormTextField label="Slug" registration={register("slug")} error={errors.slug?.message} required />
        <FormTextField label="Title" registration={register("title")} error={errors.title?.message} required />
        <FormTextareaField label="Summary" registration={register("summary")} error={errors.summary?.message} required />
        <FormTextareaField label="Description" registration={register("description")} minRows={5} error={errors.description?.message} required />
        <FormStringListField label="Obligations" name="obligations" control={control} />
        <FormTextareaField label="Notes" registration={register("notes")} error={errors.notes?.message} />
        <FormTextField label="Source Name" registration={register("sourceName")} error={errors.sourceName?.message} />
        <FormMultiSelectField
          label="Related Insights"
          name="relatedInsightSlugs"
          control={control}
          options={(insights ?? []).map((i) => ({ value: i.slug, label: i.title }))}
        />
        <FormFileField label="Hero Image" name="heroImage" control={control} currentUrl={existing?.heroImage} required={isCreate} />
        <div className="mt-2 flex gap-2">
          <Button type="submit" color="primary" loading={isSubmitting}>
            Save
          </Button>
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/compliance")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
