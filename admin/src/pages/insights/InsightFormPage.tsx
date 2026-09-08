import { useEffect } from "react";

import Button from "@mui/joy/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FormFileField } from "@/components/common/form/FormFileField";
import { FormMultiSelectField } from "@/components/common/form/FormMultiSelectField";
import { FormStringListField } from "@/components/common/form/FormStringListField";
import { FormSwitchField } from "@/components/common/form/FormSwitchField";
import { FormTextField } from "@/components/common/form/FormTextField";
import { FormTextareaField } from "@/components/common/form/FormTextareaField";
import { ApiError } from "@/lib/api/client";
import { insightsApi } from "@/lib/api/content";
import { buildContentPayload } from "@/lib/contentPayload";
import { insightArticleSchema, type InsightArticleFormValues } from "@/lib/validation/insightSchema";

export function InsightFormPage() {
  const { slug } = useParams();
  const isCreate = !slug || slug === "new";
  const navigate = useNavigate();
  const { data } = insightsApi.useList();
  const existing = !isCreate ? data?.find((i) => i.slug === slug) : undefined;
  const createMutation = insightsApi.useCreate();
  const updateMutation = insightsApi.useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InsightArticleFormValues>({
    resolver: zodResolver(insightArticleSchema),
    defaultValues: {
      slug: "",
      title: "",
      category: "",
      summary: "",
      body: [],
      publishDate: "",
      touchesCompliance: false,
      relatedInsightSlugs: [],
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        slug: existing.slug,
        title: existing.title,
        category: existing.category,
        summary: existing.summary,
        body: existing.body,
        publishDate: existing.publishDate,
        touchesCompliance: existing.touchesCompliance,
        relatedInsightSlugs: existing.relatedInsightSlugs,
      });
    }
  }, [existing, reset]);

  async function onSubmit(values: InsightArticleFormValues) {
    try {
      const payload = buildContentPayload(values, { fileFields: ["coverImage"], jsonFields: ["body"] });
      if (isCreate) {
        await createMutation.mutateAsync(payload);
        toast.success("Insight created.");
      } else if (existing) {
        await updateMutation.mutateAsync({ id: existing.slug, data: payload });
        toast.success("Insight saved.");
      }
      navigate("/insights");
    } catch (err) {
      console.error("[InsightFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this insight right now.");
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">{isCreate ? "New Insight" : "Edit Insight"}</h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormTextField label="Slug" registration={register("slug")} error={errors.slug?.message} required />
        <FormTextField label="Title" registration={register("title")} error={errors.title?.message} required />
        <FormTextField label="Category" registration={register("category")} error={errors.category?.message} required />
        <FormTextareaField label="Summary" registration={register("summary")} error={errors.summary?.message} required />
        <FormStringListField label="Body (paragraphs)" name="body" control={control} multiline />
        <FormTextField label="Publish Date" type="date" registration={register("publishDate")} error={errors.publishDate?.message} required />
        <FormSwitchField label="Touches Compliance" name="touchesCompliance" control={control} />
        <FormMultiSelectField
          label="Related Insights"
          name="relatedInsightSlugs"
          control={control}
          options={(data ?? []).filter((i) => i.slug !== slug).map((i) => ({ value: i.slug, label: i.title }))}
        />
        <FormFileField label="Cover Image" name="coverImage" control={control} currentUrl={existing?.coverImage} required={isCreate} />
        <div className="mt-2 flex gap-2">
          <Button type="submit" color="primary" loading={isSubmitting}>
            Save
          </Button>
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/insights")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
