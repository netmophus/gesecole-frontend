
import React, { useEffect, useState } from 'react';
import { TextField, Button,FormControlLabel, Checkbox, Grid, MenuItem, Paper, Typography } from '@mui/material';
import axios from 'axios';

const levels = [
  { value: 'Primaire', label: 'Primaire' },
  { value: 'Collège', label: 'Collège' },
  { value: 'Lycée', label: 'Lycée' },
];

const apiBaseUrl = process.env.REACT_APP_API_URL;

const SubjectForm = ({ subjectData, setSubjectData, onSubmit }) => {
  const [activeAcademicYear, setActiveAcademicYear] = useState('');

  // Récupérer l'année académique active depuis le backend
  useEffect(() => {
    const fetchActiveYear = async () => {
      try {
        console.log('Appel à l\'API pour récupérer l\'année académique active...');
        const res = await axios.get(`${apiBaseUrl}/api/academic-years/active`);
        
        // Log de la réponse
        console.log('Réponse de l\'API pour l\'année académique active:', res.data);
  
        if (!res.data || !res.data.startYear || !res.data.endYear) {
          console.log('Aucune année académique active trouvée.');
        } else {
          const activeYear = `${res.data.startYear}-${res.data.endYear}`;  // Combiner startYear et endYear
          console.log('Année académique active trouvée:', activeYear);
          setActiveAcademicYear(activeYear);  // Stocker l'année académique active sous forme "2023-2024"
        
          // Mettre à jour subjectData avec l'ID de l'année académique active
          setSubjectData((prevData) => ({
            ...prevData,
            academicYear: res.data._id,  // Utiliser l'ID pour la soumission au backend
          }));
        }
        
        
    





      } catch (error) {
        console.error('Erreur lors de la récupération de l\'année académique active:', error);
      }
    };
  
    fetchActiveYear();
  }, [setSubjectData]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // Appeler la fonction de soumission passée en prop
  };

  return (
    <Paper 
      elevation={6} 
      sx={{ 
        p: 5, 
        background: 'linear-gradient(145deg, #f0f4f7, #dae0e6)',  // Subtle gradient background
        borderRadius: '20px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'  // Enhanced shadow for depth
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: '#1a237e',  // Darker blue text for title
          fontWeight: 'bold',
          textAlign: 'center',  // Centered title
          letterSpacing: '0.5px',  // Letter spacing for readability
          marginBottom: '30px'
        }}
      >
        {subjectData._id ? 'Modifier la Matière' : 'Créer une Nouvelle Matière'}
      </Typography>
  
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              label="Nom de la Matière"
              fullWidth
              variant="outlined"
              name="name"
              value={subjectData.name}
              onChange={handleInputChange}
              required
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                '& .MuiInputBase-input': { color: '#1a237e', fontWeight: '500' },  // Text color and weight
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e88e5' },  // Border color
                '& .MuiInputLabel-root': { color: '#1e88e5', fontWeight: '600' },  // Label color
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',  // Shadow effect
              }}
            />
          </Grid>
  
          <Grid item xs={12}>
            <TextField
              label="Niveau"
              fullWidth
              select
              variant="outlined"
              name="level"
              value={subjectData.level}
              onChange={handleInputChange}
              required
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                '& .MuiInputBase-input': { color: '#1a237e', fontWeight: '500' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e88e5' },
                '& .MuiInputLabel-root': { color: '#1e88e5', fontWeight: '600' },
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',  // Consistent shadow for input fields
              }}
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
              label="Année Académique"
              fullWidth
              variant="outlined"
              name="academicYear"
              value={activeAcademicYear || 'Aucune année active'}
              disabled
              sx={{
                backgroundColor: '#e0e0e0',  // Subtle grey for disabled input
                borderRadius: 2,
                '& .MuiInputBase-input': { color: '#1a237e', fontWeight: '500' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1e88e5' },
                '& .MuiInputLabel-root': { color: '#1e88e5', fontWeight: '600' },
              }}
            />
          </Grid>
  
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={subjectData.isActive || false}
                  onChange={(e) => setSubjectData({ ...subjectData, isActive: e.target.checked })}
                  color="primary"
                  sx={{
                    '&.Mui-checked': {
                      color: '#1e88e5',  // Custom checkbox color when checked
                    },
                  }}
                />
              }
              label={<Typography sx={{ fontWeight: '500', color: '#1a237e' }}>Activer la matière</Typography>}
            />
          </Grid>
  
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#1e88e5',
                color: '#fff',
                fontWeight: '600',
                fontSize: '16px',
                borderRadius: '12px',  // Rounded button
                padding: '12px 20px',  // More padding for larger buttons
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              {subjectData._id ? 'Mettre à jour' : 'Créer la Matière'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
  
 
  
};

export default SubjectForm;
