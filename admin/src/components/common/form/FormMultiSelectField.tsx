import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

export type SelectOption = { value: string; label: string };

type FormMultiSelectFieldProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: SelectOption[];
};

// Slug-based relation pickers — Service.relatedInsightSlugs/teamMemberSlugs,
// ComplianceArea.relatedInsightSlugs, InsightArticle.relatedInsightSlugs.
export function FormMultiSelectField<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  options,
}: FormMultiSelectFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const values: string[] = Array.isArray(field.value) ? field.value : [];
        return (
          <FormControl>
            <FormLabel>{label}</FormLabel>
            <Select
              multiple
              value={values}
              onChange={(_e, newValue) => field.onChange(newValue)}
              renderValue={(selected) => selected.map((s) => s.label).join(", ") || "None selected"}
            >
              {options.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </FormControl>
        );
      }}
    />
  );
}
