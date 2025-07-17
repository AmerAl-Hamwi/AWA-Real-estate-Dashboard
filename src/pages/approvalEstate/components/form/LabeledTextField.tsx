import { TextField } from "@mui/material";

type Props = {
  label: string;
  value;
  onChange: (val) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
   disabled?: boolean;
};

export default function LabeledTextField({ label, value, onChange, type = "text", disabled = false,...rest }: Props) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      fullWidth
      size="small"
      type={type}
      disabled={disabled}
      {...rest}
    />
  );
}
