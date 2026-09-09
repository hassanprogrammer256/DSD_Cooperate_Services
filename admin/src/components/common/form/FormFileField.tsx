import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

import { FileDropzone } from "@/components/common/FileDropzone";

type FormFileFieldProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  currentUrl?: string;
  required?: boolean;
};

// Every photo/heroImage/coverImage/avatar field is a drag-and-drop FileDropzone bound
// via Controller (a File object, not a string) — PATCH omits this field entirely when
// no new file is chosen (see backend/content/serializers.py: partial updates leave an
// unset FileField untouched), so editing other fields never forces a re-upload.
export function FormFileField<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  currentUrl,
  required,
}: FormFileFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FileDropzone
          label={label}
          required={required}
          currentUrl={currentUrl}
          accept="image/*"
          helperText={currentUrl ? undefined : "Required."}
          onFileChange={(file) => field.onChange(file)}
        />
      )}
    />
  );
}
