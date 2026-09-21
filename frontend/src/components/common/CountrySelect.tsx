import Autocomplete from "@mui/joy/Autocomplete";

import { COUNTRIES, type Country } from "@/lib/countries";

type Props = {
  value: string; // country name, e.g. "United Arab Emirates"
  onChange: (name: string) => void;
  onBlur?: () => void;
  error?: boolean;
  placeholder?: string;
};

// First consumer of Joy's Autocomplete in this repo (@mui/joy is beta — API may shift
// between betas). Wraps the option-object <-> plain-string mismatch: react-hook-form
// tracks the country as a name string, Autocomplete itself wants the option object.
export function CountrySelect({ value, onChange, onBlur, error, placeholder = "Select country" }: Props) {
  const selected = COUNTRIES.find((c) => c.name === value) ?? null;

  return (
    <Autocomplete
      options={COUNTRIES}
      getOptionLabel={(option: Country) => option.name}
      isOptionEqualToValue={(option: Country, val: Country) => option.iso2 === val.iso2}
      value={selected}
      onChange={(_event, newValue) => onChange(newValue?.name ?? "")}
      onBlur={onBlur}
      error={error}
      placeholder={placeholder}
      autoHighlight
    />
  );
}
