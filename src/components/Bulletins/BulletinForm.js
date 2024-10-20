



// src/components/Bulletins/BulletinForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import StudentSelect from './StudentSelect';
import ClassSelect from './ClassSelect';
import PeriodSelect from './PeriodSelect';
import SubjectsInput from './SubjectsInput';
import GradesInput from './GradesInput';
import Summary from './Summary';
import axios from 'axios';

const BulletinForm = ({ onSubmit, initialData = {} }) => {
  const { user } = useContext(AuthContext);

  // État initial du formulaire
  const [formData, setFormData] = useState({
    studentId: initialData.studentId || '',
    classId: initialData.classId || '',
    year: initialData.year || '',
    period: initialData.period || '',
    subjects: initialData.subjects || [{ subject: '', teacher: '', grade: '', coefficient: 1 }],
    conductGrade: initialData.conductGrade || 0,
    disciplineGrade: initialData.disciplineGrade || 0,
  });

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalCoefficients, setTotalCoefficients] = useState(0);
  const [totalDefinitive, setTotalDefinitive] = useState(0);
  const [moyenneTrimestrielle, setMoyenneTrimestrielle] = useState(0);

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  // Fonction pour charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      if (!user.schoolId || !user.token) {
        console.error("Identifiant de l'établissement ou token utilisateur manquant.");
        return;
      }
      try {
        const studentRes = await axios.get(`${apiBaseUrl}/api/students?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStudents(studentRes.data.students);

        const classRes = await axios.get(`${apiBaseUrl}/api/classes?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setClasses(classRes.data.classes);

        const teacherRes = await axios.get(`${apiBaseUrl}/api/teachers`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTeachers(teacherRes.data.teachers);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
      }
    };

    fetchData();
  }, [user.schoolId, user.token,apiBaseUrl]);

  // Gestion des changements de données du formulaire
  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Fonction pour calculer les totaux et les moyennes
  const calculateTotals = (subjects) => {
    const totalNotesValue = subjects.reduce(
      (acc, subject) => acc + (parseFloat(subject.grade) || 0) * (parseFloat(subject.coefficient) || 0),
      0
    );
    const totalCoefficientsValue = subjects.reduce((acc, subject) => acc + (parseFloat(subject.coefficient) || 0), 0);

    setTotalNotes(totalNotesValue);
    setTotalCoefficients(totalCoefficientsValue);

    const totalDefinitiveValue = totalNotesValue + parseFloat(formData.conductGrade || 0) - parseFloat(formData.disciplineGrade || 0);
    setTotalDefinitive(totalDefinitiveValue);

    if (totalCoefficientsValue > 0) {
      const moyenne = (totalDefinitiveValue / totalCoefficientsValue).toFixed(2);
      setMoyenneTrimestrielle(moyenne);
    } else {
      setMoyenneTrimestrielle(0);
    }
  };

  // Fonction de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {initialData._id ? 'Modifier le Bulletin' : 'Créer un Nouveau Bulletin'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <ClassSelect classes={classes} value={formData.classId} onChange={(value) => handleChange('classId', value)} />
          <StudentSelect students={students} value={formData.studentId} onChange={(value) => handleChange('studentId', value)} classId={formData.classId} />
          <PeriodSelect value={formData.period} onChange={(value) => handleChange('period', value)} />
          <SubjectsInput subjects={formData.subjects} teachers={teachers} onSubjectsChange={(subjects) => { handleChange('subjects', subjects); calculateTotals(subjects); }} />
          <GradesInput conductGrade={formData.conductGrade} disciplineGrade={formData.disciplineGrade} onChange={handleChange} />
          <Summary totalNotes={totalNotes} totalCoefficients={totalCoefficients} totalDefinitive={totalDefinitive} moyenneTrimestrielle={moyenneTrimestrielle} />

          <Box>
            <Button type="submit" variant="contained" color="primary">
              {initialData._id ? 'Mettre à jour le Bulletin' : 'Créer le Bulletin'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default BulletinForm;
