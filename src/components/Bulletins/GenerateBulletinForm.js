



import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const GenerateBulletinForm = () => {
  const { user } = useContext(AuthContext);

  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');
  const [year, setYear] = useState('');
  const [period, setPeriod] = useState('');
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_URL;



  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/classes?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setClasses(res.data.classes);
      } catch (err) {
        console.error('Erreur lors de la récupération des classes:', err);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/students?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStudents(res.data.students);
      } catch (err) {
        console.error('Erreur lors de la récupération des élèves:', err);
      }
    };

    fetchClasses();
    fetchStudents();
  }, [user.schoolId, user.token,apiBaseUrl]);

  const handleGenerate = async () => {
    try {
      const response = await axios.post(`${apiBaseUrl}/bulletins/generate-student-pdf`, {
        studentId,
        classId,
        year,
        period
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: 'blob', // Pour recevoir le fichier PDF
      });

      const fileURL = URL.createObjectURL(new Blob([response.data]));
      window.open(fileURL, '_blank');

    } catch (err) {
      console.error('Erreur lors de la génération du bulletin:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Générer le Bulletin de l'Élève</Typography>
      <Box sx={{ mt: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Classe</InputLabel>
          <Select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            label="Classe"
          >
            {classes.map((cls) => (
              <MenuItem key={cls._id} value={cls._id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Élève</InputLabel>
          <Select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            label="Élève"
          >
            {students.map((student) => (
              <MenuItem key={student._id} value={student._id}>
                {student.firstName} {student.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Année"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Période</InputLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            label="Période"
          >
            <MenuItem value="1er Trimestre">1er Trimestre</MenuItem>
            <MenuItem value="2ème Trimestre">2ème Trimestre</MenuItem>
            <MenuItem value="3ème Trimestre">3ème Trimestre</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleGenerate} fullWidth>
          Générer le Bulletin
        </Button>
      </Box>
    </Container>
  );
};

export default GenerateBulletinForm;
