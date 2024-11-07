import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const SelectSection = ({ formData, setFormData, sections }) => {
  const handleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      section: event.target.value,
    }));
  };

  return (
    <TextField
      label="Section"
      select
      value={formData.section}
      onChange={handleChange}
      fullWidth
      required
      sx={{ mb: 2 }}
    >
      {sections.map((section, index) => (
        <MenuItem key={index} value={section}>
          {section}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectSection;
