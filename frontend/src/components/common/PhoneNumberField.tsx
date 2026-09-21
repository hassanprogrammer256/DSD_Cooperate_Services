import Input from "@mui/joy/Input";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

import { COUNTRIES } from "@/lib/countries";

// Deduplicated by dial code — several countries share one (e.g. +1), and the select
// only needs to pick the calling code, not the specific country.
const DIAL_CODES = Array.from(new Map(COUNTRIES.map((c) => [c.dialCode, c])).values()).sort(
  (a, b) => Number(a.dialCode.slice(1)) - Number(b.dialCode.slice(1)),
);

type Props<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  countryCodeName: Path<TFieldValues>;
  numberName: Path<TFieldValues>;
};

// Two react-hook-form fields (dial code + local number) rendered as one control —
// kept as two fields rather than one combined string so each can be validated and
// recombined independently (see authSchema.ts's registerSchema).
export function PhoneNumberField<TFieldValues extends FieldValues>({
  control,
  countryCodeName,
  numberName,
}: Props<TFieldValues>) {
  return (
    <div className="flex gap-2">
      <Controller
        name={countryCodeName}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value || null}
            onChange={(_event, value) => field.onChange(value ?? "")}
            onBlur={field.onBlur}
            placeholder="Code"
            sx={{ minWidth: 110 }}
          >
            {DIAL_CODES.map((c) => (
              <Option key={c.iso2} value={c.dialCode}>
                {c.dialCode} {c.iso2}
              </Option>
            ))}
          </Select>
        )}
      />
      <Controller
        name={numberName}
        control={control}
        render={({ field }) => (
          <Input {...field} type="tel" placeholder="50 123 4567" className="flex-1" />
        )}
      />
    </div>
  );
}
