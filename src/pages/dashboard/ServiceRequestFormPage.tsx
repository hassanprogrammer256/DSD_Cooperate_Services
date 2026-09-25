import { useState } from "react";

import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Textarea from "@mui/joy/Textarea";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { CtaButton } from "@/components/common/CtaButton";
import { FileDropzone } from "@/components/common/FileDropzone";
import { QueryState } from "@/components/common/QueryState";
import { useServiceDetailQuery } from "@/lib/api/services";
import { useCreateServiceRequestMutation } from "@/lib/api/serviceRequests";
import { ApiError } from "@/lib/api/client";
import type { ServiceFormField } from "@/types";

const labelSx = { color: "var(--color-text-primary)" };

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: ServiceFormField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (field.fieldType) {
    case "textarea":
      return (
        <Textarea
          minRows={4}
          required={field.required}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          required={field.required}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "date":
      return (
        <Input
          type="date"
          required={field.required}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "select":
      return (
        <Select
          placeholder="Choose an option"
          value={(value as string) || null}
          onChange={(_event, newValue) => onChange(newValue ?? "")}
        >
          {field.options.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      );
    case "checkbox":
      return (
        <Checkbox
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          label={field.helpText || "Yes"}
          slotProps={{ label: { sx: { color: "var(--color-text-secondary)" } } }}
        />
      );
    case "text":
    default:
      return (
        <Input
          required={field.required}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

export function ServiceRequestFormPage() {
  const { slug } = useParams<{ slug: string }>();
  const serviceQuery = useServiceDetailQuery(slug ?? "");
  const createRequest = useCreateServiceRequestMutation();

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [file, setFile] = useState<File | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const service = serviceQuery.data;
  const fileField = service?.formFields.find((f) => f.fieldType === "file");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!service) return;
    try {
      const result = await createRequest.mutateAsync({
        service: service.slug,
        formData: values,
        attachment: file,
      });
      setReference(result.reference);
    } catch (err) {
      console.error("[ServiceRequestFormPage/onSubmit]", err);
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't submit your request right now, please try again shortly.",
      );
    }
  }

  if (reference) {
    return (
      <div className="rounded-xl border border-success bg-success-light px-6 py-10 text-center">
        <h3 className="font-display text-xl font-bold capitalize text-accent">Request Received</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
          Thank you for your request. Our team will review your requirements and contact you shortly.
        </p>
        <p className="mt-2 font-mono text-sm text-text-primary">Reference: {reference}</p>
        <div className="mt-6">
          <CtaButton to="/dashboard/services">Back to Services</CtaButton>
        </div>
      </div>
    );
  }

  return (
    <QueryState isLoading={serviceQuery.isLoading} isError={serviceQuery.isError} onRetry={() => void serviceQuery.refetch()}>
      {service && (
        <div className="rounded-xl border border-accent/30 bg-surface p-6 md:p-8">
          <Link
            to="/dashboard/services"
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Services
          </Link>

          <h2 className="mt-4 font-display text-xl font-bold capitalize text-accent">Request: {service.title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{service.summary}</p>

          <form onSubmit={(e) => void onSubmit(e)} noValidate className="mt-6 flex flex-col gap-4">
            {service.formFields.length === 0 && (
              <p className="text-sm text-text-secondary">
                No additional details are needed — submit your request and our team will follow up with you.
              </p>
            )}

            {service.formFields
              .filter((field) => field.fieldType !== "file")
              .map((field) => (
                <FormControl key={field.key} required={field.required}>
                  <FormLabel sx={labelSx}>{field.label}</FormLabel>
                  <DynamicField
                    field={field}
                    value={values[field.key]}
                    onChange={(value) => setValues((prev) => ({ ...prev, [field.key]: value }))}
                  />
                  {field.helpText && field.fieldType !== "checkbox" && (
                    <FormHelperText>{field.helpText}</FormHelperText>
                  )}
                </FormControl>
              ))}

            {fileField && (
              <FileDropzone
                label={fileField.label + (fileField.required ? "" : " (Optional)")}
                helperText={fileField.helpText}
                onFileChange={setFile}
              />
            )}

            <CtaButton type="submit" loading={createRequest.isPending} disabled={createRequest.isPending} size="lg" sx={{ mt: 2 }}>
              Submit Request
            </CtaButton>
          </form>
        </div>
      )}
    </QueryState>
  );
}
