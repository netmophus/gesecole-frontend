

import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Box, TextField, MenuItem, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Ajoutez le contexte Auth pour récupérer le token utilisateur

const SubjectList = ({ formData, setFormData, teachers }) => {
  const { user } = useContext(AuthContext); // Récupérer le token utilisateur
  const [subjectsForTeachers, setSubjectsForTeachers] = useState({});
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const handleSubjectChange = (index, key, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index][key] = value;
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subject: '', teacher: '', grade: '', coefficient: 1 }],
    });
  };

  const removeSubject = (index) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const loadTeacherSubjects = useCallback(
    async (index, teacherId) => {
      if (!teacherId) return; // Skip if no teacher is selected
      if (subjectsForTeachers[teacherId]) return; // Skip if subjects already loaded for this teacher

      try {
        // Assurez-vous d'inclure le token utilisateur dans l'en-tête Authorization
        const token = user?.token; // Récupérer le token utilisateur depuis le contexte ou état global
        if (!token) {
          console.error('Token non disponible. Utilisateur non connecté.');
          return;
        }

        const res = await axios.get(`${apiBaseUrl}/api/teachers/${teacherId}/subjects`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token pour l'authentification
          },
        });

        setSubjectsForTeachers((prevState) => ({ ...prevState, [teacherId]: res.data }));
        console.log(`Matières récupérées pour l'enseignant ${teacherId}:`, res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des matières:', err);
      }
    },
    [subjectsForTeachers, user.token,apiBaseUrl] // Ajout du token dans les dépendances
  );

  // Utiliser useEffect pour charger les matières des enseignants sélectionnés
  useEffect(() => {
    formData.subjects.forEach((subject, index) => {
      if (subject.teacher && !subjectsForTeachers[subject.teacher]) {
        loadTeacherSubjects(index, subject.teacher);
      }
    });
  }, [formData.subjects, subjectsForTeachers, loadTeacherSubjects]);

  return (
    <Box>
      {formData.subjects.map((subject, index) => (
        <Box key={index} sx={{ display: 'flex', mb: 2 }}>
          <TextField
            select
            label="Enseignant"
            value={subject.teacher || ''}
            onChange={(e) => handleSubjectChange(index, 'teacher', e.target.value)}
            required
            sx={{ flexGrow: 1, mr: 2 }}
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>
                {teacher.nom}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Matière"
            value={subject.subject || ''}
            onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
            required
            sx={{ flexGrow: 1, mr: 2 }}
          >
            {(subjectsForTeachers[subject.teacher] || []).map((subj) => (
              <MenuItem key={subj._id} value={subj._id}>
                {subj.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Note"
            type="number"
            value={subject.grade}
            onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
            required
            sx={{ width: 80, mr: 2 }}
          />
          <TextField
            label="Coefficient"
            type="number"
            value={subject.coefficient}
            onChange={(e) => handleSubjectChange(index, 'coefficient', e.target.value)}
            required
            sx={{ width: 80 }}
          />

          <IconButton onClick={() => removeSubject(index)} color="secondary" sx={{ ml: 2 }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button onClick={addSubject} variant="contained" color="primary" sx={{ mb: 3 }}>
        Ajouter une Matière
      </Button>
    </Box>
  );
};

export default SubjectList;
