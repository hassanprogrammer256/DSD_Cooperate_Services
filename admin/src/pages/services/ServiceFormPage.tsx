import { useEffect } from "react";

import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { Controller, useForm, type Control } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { FormFileField } from "@/components/common/form/FormFileField";
import { FormMultiSelectField } from "@/components/common/form/FormMultiSelectField";
import { FormTextField } from "@/components/common/form/FormTextField";
import { FormTextareaField } from "@/components/common/form/FormTextareaField";
import { ApiError } from "@/lib/api/client";
import { insightsApi, servicesApi, teamApi } from "@/lib/api/content";
import { buildContentPayload } from "@/lib/contentPayload";
import { serviceSchema, type ServiceFormValues } from "@/lib/validation/serviceSchema";

const PILLAR_OPTIONS = [
  { value: "residency-solutions", label: "Residency Solutions" },
  { value: "business-incorporation", label: "Business Incorporation" },
  { value: "compliance-governance", label: "Compliance & Governance" },
];

function IncludedListField({ control }: { control: Control<ServiceFormValues> }) {
  return (
    <Controller
      name="included"
      control={control}
      render={({ field }) => {
        const items = field.value;

        function update(index: number, patch: Partial<ServiceFormValues["included"][number]>) {
          const next = [...items];
          next[index] = { ...next[index], ...patch };
          field.onChange(next);
        }

        function remove(index: number) {
          field.onChange(items.filter((_, i) => i !== index));
        }

        // Stacked per-item block, not the single-row layout the other list fields
        // below use — title/description/image don't fit three-across at this form's
        // max-w-lg width. `image` is a plain URL/data-URI text field for now (these
        // are seeded as generated placeholder art); a real per-item file upload would
        // need its own storage, not just a richer JSONField list entry.
        return (
          <div className="flex flex-col gap-1.5">
            <FormLabel>Included</FormLabel>
            <div className="flex flex-col gap-3">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col gap-2 rounded-md border border-border p-3">
                  <div className="flex items-start gap-2">
                    <Input
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) => update(index, { title: e.target.value })}
                      sx={{ flex: 1 }}
                    />
                    <IconButton variant="plain" color="danger" aria-label="Remove" onClick={() => remove(index)}>
                      <X size={16} />
                    </IconButton>
                  </div>
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => update(index, { description: e.target.value })}
                  />
                  <Input
                    placeholder="Image URL"
                    value={item.image}
                    onChange={(e) => update(index, { image: e.target.value })}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="soft"
                color="neutral"
                size="sm"
                startDecorator={<Plus size={14} />}
                onClick={() => field.onChange([...items, { title: "", description: "", image: "" }])}
                sx={{ alignSelf: "flex-start" }}
              >
                Add
              </Button>
            </div>
          </div>
        );
      }}
    />
  );
}

function StatsListField({ control }: { control: Control<ServiceFormValues> }) {
  return (
    <Controller
      name="stats"
      control={control}
      render={({ field }) => {
        const stats = field.value;

        function update(index: number, patch: Partial<ServiceFormValues["stats"][number]>) {
          const next = [...stats];
          next[index] = { ...next[index], ...patch };
          field.onChange(next);
        }

        function remove(index: number) {
          field.onChange(stats.filter((_, i) => i !== index));
        }

        // Plain div, not a Joy FormControl — FormControl allows exactly one control
        // component, and this renders 3 Inputs per stat row (see
        // FormStringListField.tsx's comment for the same reasoning).
        return (
          <div className="flex flex-col gap-1.5">
            <FormLabel>Stats</FormLabel>
            <div className="flex flex-col gap-2">
              {stats.map((stat, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Value"
                    type="number"
                    value={stat.value}
                    onChange={(e) => update(index, { value: Number(e.target.value) })}
                    sx={{ width: 90 }}
                  />
                  <Input
                    placeholder="Suffix (+, %)"
                    value={stat.suffix}
                    onChange={(e) => update(index, { suffix: e.target.value })}
                    sx={{ width: 100 }}
                  />
                  <Input
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => update(index, { label: e.target.value })}
                    sx={{ flex: 1 }}
                  />
                  <IconButton variant="plain" color="danger" aria-label="Remove" onClick={() => remove(index)}>
                    <X size={16} />
                  </IconButton>
                </div>
              ))}
              <Button
                type="button"
                variant="soft"
                color="neutral"
                size="sm"
                startDecorator={<Plus size={14} />}
                onClick={() => field.onChange([...stats, { value: 0, suffix: "", label: "" }])}
                sx={{ alignSelf: "flex-start" }}
              >
                Add
              </Button>
            </div>
          </div>
        );
      }}
    />
  );
}

function ProcessListField({ control }: { control: Control<ServiceFormValues> }) {
  return (
    <Controller
      name="process"
      control={control}
      render={({ field }) => {
        const steps = field.value;

        function update(index: number, patch: Partial<ServiceFormValues["process"][number]>) {
          const next = [...steps];
          next[index] = { ...next[index], ...patch };
          field.onChange(next);
        }

        function remove(index: number) {
          field.onChange(steps.filter((_, i) => i !== index));
        }

        return (
          <div className="flex flex-col gap-1.5">
            <FormLabel>Process Steps</FormLabel>
            <div className="flex flex-col gap-2">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Step title"
                    value={step.title}
                    onChange={(e) => update(index, { title: e.target.value })}
                    sx={{ width: 200 }}
                  />
                  <Input
                    placeholder="Step description"
                    value={step.description}
                    onChange={(e) => update(index, { description: e.target.value })}
                    sx={{ flex: 1 }}
                  />
                  <IconButton variant="plain" color="danger" aria-label="Remove" onClick={() => remove(index)}>
                    <X size={16} />
                  </IconButton>
                </div>
              ))}
              <Button
                type="button"
                variant="soft"
                color="neutral"
                size="sm"
                startDecorator={<Plus size={14} />}
                onClick={() => field.onChange([...steps, { title: "", description: "" }])}
                sx={{ alignSelf: "flex-start" }}
              >
                Add
              </Button>
            </div>
          </div>
        );
      }}
    />
  );
}

function FaqsListField({ control }: { control: Control<ServiceFormValues> }) {
  return (
    <Controller
      name="faqs"
      control={control}
      render={({ field }) => {
        const faqs = field.value;

        function update(index: number, patch: Partial<ServiceFormValues["faqs"][number]>) {
          const next = [...faqs];
          next[index] = { ...next[index], ...patch };
          field.onChange(next);
        }

        function remove(index: number) {
          field.onChange(faqs.filter((_, i) => i !== index));
        }

        return (
          <div className="flex flex-col gap-1.5">
            <FormLabel>FAQs</FormLabel>
            <div className="flex flex-col gap-2">
              {faqs.map((faq, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => update(index, { question: e.target.value })}
                    sx={{ width: 200 }}
                  />
                  <Input
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => update(index, { answer: e.target.value })}
                    sx={{ flex: 1 }}
                  />
                  <IconButton variant="plain" color="danger" aria-label="Remove" onClick={() => remove(index)}>
                    <X size={16} />
                  </IconButton>
                </div>
              ))}
              <Button
                type="button"
                variant="soft"
                color="neutral"
                size="sm"
                startDecorator={<Plus size={14} />}
                onClick={() => field.onChange([...faqs, { question: "", answer: "" }])}
                sx={{ alignSelf: "flex-start" }}
              >
                Add
              </Button>
            </div>
          </div>
        );
      }}
    />
  );
}

export function ServiceFormPage() {
  const { slug } = useParams();
  const isCreate = !slug || slug === "new";
  const navigate = useNavigate();
  const { data } = servicesApi.useList();
  const { data: insights } = insightsApi.useList();
  const { data: team } = teamApi.useList();
  const existing = !isCreate ? data?.find((s) => s.slug === slug) : undefined;
  const createMutation = servicesApi.useCreate();
  const updateMutation = servicesApi.useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      slug: "",
      title: "",
      pillar: "residency-solutions",
      icon: "",
      summary: "",
      description: "",
      included: [],
      stats: [],
      process: [],
      faqs: [],
      relatedInsightSlugs: [],
      teamMemberSlugs: [],
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        slug: existing.slug,
        title: existing.title,
        pillar: existing.pillar,
        icon: existing.icon,
        summary: existing.summary,
        description: existing.description,
        included: existing.included,
        stats: existing.stats,
        process: existing.process,
        faqs: existing.faqs,
        relatedInsightSlugs: existing.relatedInsightSlugs,
        teamMemberSlugs: existing.teamMemberSlugs,
      });
    }
  }, [existing, reset]);

  async function onSubmit(values: ServiceFormValues) {
    try {
      const payload = buildContentPayload(values, {
        fileFields: ["heroImage"],
        jsonFields: ["included", "stats", "process", "faqs"],
      });
      if (isCreate) {
        await createMutation.mutateAsync(payload);
        toast.success("Service created.");
      } else if (existing) {
        await updateMutation.mutateAsync({ id: existing.slug, data: payload });
        toast.success("Service saved.");
      }
      navigate("/services");
    } catch (err) {
      console.error("[ServiceFormPage/onSubmit]", err);
      toast.error(err instanceof ApiError ? err.message : "Couldn't save this service right now.");
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">{isCreate ? "New Service" : "Edit Service"}</h1>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-4" noValidate>
        <FormTextField label="Slug" registration={register("slug")} error={errors.slug?.message} required />
        <FormTextField label="Title" registration={register("title")} error={errors.title?.message} required />

        <Controller
          name="pillar"
          control={control}
          render={({ field }) => (
            <FormControl required>
              <FormLabel>Pillar</FormLabel>
              <Select value={field.value} onChange={(_e, v) => field.onChange(v)}>
                {PILLAR_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <FormTextField label="Icon Key" registration={register("icon")} error={errors.icon?.message} required />
        <FormTextareaField label="Summary" registration={register("summary")} error={errors.summary?.message} required />
        <FormTextareaField label="Description" registration={register("description")} minRows={5} error={errors.description?.message} required />
        <IncludedListField control={control} />
        <StatsListField control={control} />
        <ProcessListField control={control} />
        <FaqsListField control={control} />
        <FormMultiSelectField
          label="Related Insights"
          name="relatedInsightSlugs"
          control={control}
          options={(insights ?? []).map((i) => ({ value: i.slug, label: i.title }))}
        />
        <FormMultiSelectField
          label="Team Members"
          name="teamMemberSlugs"
          control={control}
          options={(team ?? []).map((t) => ({ value: t.slug, label: t.name }))}
        />
        <FormFileField label="Hero Image" name="heroImage" control={control} currentUrl={existing?.heroImage} required={isCreate} />
        <div className="mt-2 flex gap-2">
          <Button type="submit" color="primary" loading={isSubmitting}>
            Save
          </Button>
          <Button type="button" variant="plain" color="neutral" onClick={() => void navigate("/services")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
