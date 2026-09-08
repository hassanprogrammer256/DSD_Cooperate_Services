import { Plus, X } from "lucide-react";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

type FormStringListFieldProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  // Textarea (multi-line, for a paragraph list like InsightArticle.body) vs a plain
  // single-line Input (a feature/obligation list) — same component, different row editor.
  multiline?: boolean;
};

// Editable list of plain strings — used for Service.included, ComplianceArea.obligations,
// PricingTier.features, InsightArticle.body (its paragraphs).
export function FormStringListField<TFieldValues extends FieldValues>({
  label,
  name,
  control,
  multiline,
}: FormStringListFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const items: string[] = Array.isArray(field.value) ? field.value : [];

        function updateItem(index: number, value: string) {
          const next = [...items];
          next[index] = value;
          field.onChange(next);
        }

        function removeItem(index: number) {
          field.onChange(items.filter((_, i) => i !== index));
        }

        function addItem() {
          field.onChange([...items, ""]);
        }

        // Not wrapped in a Joy FormControl — FormControl allows exactly one control
        // component as a child, and this field renders one Input/Textarea per list
        // item (Joy logs "A FormControl can contain only one control component" and
        // its aria wiring gets confused otherwise, since FormLabel/FormControl are
        // designed around a single field, not a repeating group).
        return (
          <div className="flex flex-col gap-1.5">
            <FormLabel>{label}</FormLabel>
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  {multiline ? (
                    <Textarea
                      minRows={2}
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      sx={{ flex: 1 }}
                    />
                  ) : (
                    <Input value={item} onChange={(e) => updateItem(index, e.target.value)} sx={{ flex: 1 }} />
                  )}
                  <IconButton variant="plain" color="danger" aria-label="Remove" onClick={() => removeItem(index)}>
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
                onClick={addItem}
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
