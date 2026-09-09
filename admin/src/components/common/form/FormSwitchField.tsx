import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Switch from "@mui/joy/Switch";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

type FormSwitchFieldProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
};

export function FormSwitchField<TFieldValues extends FieldValues>({ label, name, control }: FormSwitchFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl orientation="horizontal" sx={{ justifyContent: "space-between" }}>
          <FormLabel sx={{ color: "var(--color-text-primary)" }}>{label}</FormLabel>
          <Switch checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
        </FormControl>
      )}
    />
  );
}
