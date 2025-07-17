import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  OutlinedInput,
  Box,
} from "@mui/material";

interface Amenity {
  _id: string;
  name: string;
}

interface Props {
  amenitiesList: Amenity[];
  selectedAmenities: string[];
  onChange: (val: string[]) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

export default function AmenitiesSelect({
  amenitiesList,
  selectedAmenities,
  onChange,
}: Props) {
  return (
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel id="amenities-label">Amenities</InputLabel>
      <Select
        labelId="amenities-label"
        multiple
        value={selectedAmenities}
        onChange={(e) => onChange(e.target.value as string[])}
        input={<OutlinedInput label="Amenities" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {amenitiesList
              .filter((a) => selected.includes(a._id))
              .map((a) => (
                <Chip key={a._id} label={a.name} size="small" />
              ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {amenitiesList.map((a) => (
          <MenuItem key={a._id} value={a._id}>
            <Checkbox checked={selectedAmenities.includes(a._id)} />
            <ListItemText primary={a.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}