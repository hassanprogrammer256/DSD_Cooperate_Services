import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import type { UseFormRegisterReturn } from "react-hook-form";

type FormTextFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
  required?: boolean;
};

export function FormTextField({ label, registration, error, type = "text", required }: FormTextFieldProps) {
  return (
    <FormControl error={!!error} required={required}>
      <FormLabel>{label}</FormLabel>
      <Input type={type} {...registration} />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
