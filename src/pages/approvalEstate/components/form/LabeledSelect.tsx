// components/form/LabeledSelect.tsx
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface Option {
  id: string;
  // plus any other fields you need, e.g. `name: { en: string; ar: string }`
}

type Props<T extends Option> = {
  label: string;
  value: string;
  options: T[];
  onChange: (id: string) => void;
  getOptionLabel: (opt: T) => string;
};

export default function LabeledSelect<T extends Option>({
  label,
  value,
  options,
  onChange,
  getOptionLabel,
}: Props<T>) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e: SelectChangeEvent<string>) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            {getOptionLabel(opt)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
