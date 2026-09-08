import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Textarea from "@mui/joy/Textarea";
import type { UseFormRegisterReturn } from "react-hook-form";

type FormTextareaFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  minRows?: number;
  required?: boolean;
};

export function FormTextareaField({ label, registration, error, minRows = 3, required }: FormTextareaFieldProps) {
  return (
    <FormControl error={!!error} required={required}>
      <FormLabel>{label}</FormLabel>
      <Textarea minRows={minRows} {...registration} />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
