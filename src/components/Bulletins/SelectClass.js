import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const SelectClass = ({ formData, setFormData, classes }) => {
  const handleClassChange = (e) => {
    setFormData(prevData => ({ ...prevData, classId: e.target.value, studentId: '' }));
  };

  return (
    <TextField
      select
      label="Classe"
      name="classId"
      value={formData.classId || ''}
      onChange={handleClassChange}
      required
      fullWidth
      sx={{ mb: 2 }}
    >
      {classes.map((cls) => (
        <MenuItem key={cls._id} value={cls._id}>
          {cls.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectClass;
