


// components/Bulletins/BehavioralGrades.js
import React from 'react';
import { Box, TextField } from '@mui/material';

const BehavioralGrades = ({ conductGrade, setConductGrade, disciplineGrade, setDisciplineGrade }) => {
  return (
    <Box sx={{ display: 'flex', mb: 2 }}>
      <TextField
        label="Note de Conduite"
        type="number"
        value={conductGrade}
        onChange={(e) => setConductGrade(e.target.value)}
        required
        sx={{ flexGrow: 1, mr: 2 }}
      />
      <TextField
        label="Note de Discipline"
        type="number"
        value={disciplineGrade}
        onChange={(e) => setDisciplineGrade(e.target.value)}
        required
        sx={{ flexGrow: 1 }}
      />
    </Box>
  );
};

export default BehavioralGrades;
