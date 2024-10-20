

import React from 'react';
import { TextField, MenuItem, Box } from '@mui/material';

const PeriodAndYearSelection = ({ onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <Box>
      <TextField
        label="Année"
        name="year"
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      <TextField
        select
        label="Période"
        name="period"
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      >
        <MenuItem value="1er Trimestre">1er Trimestre</MenuItem>
        <MenuItem value="2ème Trimestre">2ème Trimestre</MenuItem>
        <MenuItem value="3ème Trimestre">3ème Trimestre</MenuItem>
      </TextField>
    </Box>
  );
};

export default PeriodAndYearSelection;
