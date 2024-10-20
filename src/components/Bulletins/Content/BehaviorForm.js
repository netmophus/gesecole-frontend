import React, { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';

const BehaviorForm = ({ onChange }) => {
  const [behavior, setBehavior] = useState([{ criterion: '', grade: '', appreciation: '' }]);

  const handleBehaviorChange = (index, key, value) => {
    const updatedBehavior = [...behavior];
    updatedBehavior[index][key] = value;
    setBehavior(updatedBehavior);
    onChange(updatedBehavior);
  };

  const addBehavior = () => {
    setBehavior([...behavior, { criterion: '', grade: '', appreciation: '' }]);
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      {behavior.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <TextField
            label="Critère"
            name="criterion"
            value={item.criterion}
            onChange={(e) => handleBehaviorChange(index, 'criterion', e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Note"
            name="grade"
            type="number"
            value={item.grade}
            onChange={(e) => handleBehaviorChange(index, 'grade', e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Appréciation"
            name="appreciation"
            value={item.appreciation}
            onChange={(e) => handleBehaviorChange(index, 'appreciation', e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
        </Box>
      ))}
      <Button onClick={addBehavior} variant="contained" fullWidth>
        Ajouter un Critère de Comportement
      </Button>
    </Box>
  );
};

export default BehaviorForm;
