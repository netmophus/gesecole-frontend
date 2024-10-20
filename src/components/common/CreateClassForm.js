
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, MenuItem, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';

const levels = [
  { value: 'Primaire', label: 'Primaire' },
  { value: 'Collège', label: 'Collège' },
  { value: 'Lycée', label: 'Lycée' },
];

const CreateClassForm = ({ onSubmit }) => {
  const [className, setClassName] = useState('');
  const [level, setLevel] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    // Fetch teachers from the backend to populate the options
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/teachers`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTeacherOptions(response.data.teachers || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des enseignants:', error);
      }
    };

    fetchTeachers();
  }, [apiBaseUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClass = { name: className, level, maxStudents: parseInt(maxStudents, 10), teachers };
    onSubmit(newClass);
    // Clear form after submission
    setClassName('');
    setLevel('');
    setMaxStudents('');
    setTeachers([]);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Créer une Nouvelle Classe
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Nom de la Classe"
                fullWidth
                variant="outlined"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Niveau de la Classe"
                fullWidth
                select
                variant="outlined"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
              >
                {levels.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre d'Élèves Maximum"
                fullWidth
                type="number"
                variant="outlined"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Enseignants Assignés (Optionnel)"
                fullWidth
                select
                variant="outlined"
                SelectProps={{ multiple: true }}
                value={teachers}
                onChange={(e) => setTeachers(e.target.value)}
              >
                {teacherOptions.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.nom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Créer la Classe
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateClassForm;
