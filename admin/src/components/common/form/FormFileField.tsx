import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

type FormFileFieldProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  currentUrl?: string;
  required?: boolean;
};

// Every photo/heroImage/coverImage/avatar field is a plain <input type="file"> bound
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
        <FormControl required={required}>
          <FormLabel>{label}</FormLabel>
          {currentUrl && (
            <img src={currentUrl} alt="" className="mb-2 h-20 w-32 rounded-md border border-border object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => field.onChange(e.target.files?.[0])}
            className="text-sm text-text-secondary"
          />
          <FormHelperText>{currentUrl ? "Leave empty to keep the current image." : "Required."}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
