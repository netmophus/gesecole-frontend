
import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const SelectPeriod = ({ formData, setFormData }) => {
  const handleFieldChange = (field, value) => {
    setFormData(prevData => ({ ...prevData, [field]: value }));
  };

  return (
    <TextField
      select
      label="Période"
      name="period"
      value={formData.period || ''}
      onChange={(e) => handleFieldChange('period', e.target.value)}
      required
      fullWidth
      sx={{ mb: 2 }}
    >
      <MenuItem value="Semestre 1">Semestre 1</MenuItem>
      <MenuItem value="Semestre 2">Semestre 2</MenuItem>
    </TextField>
  );
};

export default SelectPeriod;
