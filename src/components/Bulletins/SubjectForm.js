

import React, { useState, useEffect, useContext } from 'react';
import { Container, TextField, Button,  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const SubjectForm = ({ onChange }) => {
  const [subjects, setSubjects] = useState([{ subject: '', teacher: '', grade: '', coefficient: 1 }]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const { user } = useContext(AuthContext);
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectRes = await axios.get(`${apiBaseUrl}/api/subjects`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAvailableSubjects(subjectRes.data.subjects);

        const teacherRes = await axios.get(`${apiBaseUrl}/api/teachers`, {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { establishmentId: user.schoolId }
        });
        setTeachers(teacherRes.data.teachers);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
      }
    };

    fetchData();
  }, [user.token, user.schoolId,apiBaseUrl]);

  const handleSubjectChange = (index, key, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][key] = value;
    setSubjects(updatedSubjects);
    onChange('subjects', updatedSubjects); // Remonte les données au parent
  };

  const addSubject = () => {
    setSubjects([...subjects, { subject: '', teacher: '', grade: '', coefficient: 1 }]);
  };

  const removeSubject = (index) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
    onChange('subjects', updatedSubjects); // Remonte les données au parent
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Matières et Notes
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matière</TableCell>
              <TableCell>Enseignant</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Coefficient</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    select
                    value={subject.subject || ''}
                    onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                    fullWidth
                  >
                    {availableSubjects.map((subj) => (
                      <MenuItem key={subj._id} value={subj._id}>
                        {subj.name} ({subj.level})
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    value={subject.teacher || ''}
                    onChange={(e) => handleSubjectChange(index, 'teacher', e.target.value)}
                    fullWidth
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher._id} value={teacher._id}>
                        {teacher.nom}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={subject.grade}
                    onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={subject.coefficient}
                    onChange={(e) => handleSubjectChange(index, 'coefficient', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => removeSubject(index)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5}>
                <Button onClick={addSubject} variant="contained" startIcon={<AddIcon />} fullWidth>
                  Ajouter une Matière
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SubjectForm;

