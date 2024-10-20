

import React, { useState, useContext, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// Import des sous-composants
import SelectClass from '../../components/Bulletins/SelectClass';
import SelectStudent from '../../components/Bulletins/SelectStudent';
import SelectPeriod from '../../components/Bulletins/SelectPeriod';
import SubjectList from '../../components/Bulletins/SubjectList';
import BehavioralGrades from '../../components/Bulletins/BehavioralGrades';
import Summary from '../../components/Bulletins/Summary';

const BulletinEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    studentId: '',
    classId: '',
    year: '',
    period: '',
    subjects: [{ subject: '', teacher: '', grade: '', coefficient: 1 }],
    conductGrade: 0,
    disciplineGrade: 0,
  });

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalCoefficients, setTotalCoefficients] = useState(0);
  const [totalDefinitive, setTotalDefinitive] = useState(0);
  const [moyenneTrimestrielle, setMoyenneTrimestrielle] = useState(0);
  const [activeAcademicYear, setActiveAcademicYear] = useState(''); // Déclaration de l'état pour l'année académique
  const [classStatistics, setClassStatistics] = useState({
    lowestAverage: 0,
    highestAverage: 0,
    classAverage: 0,
  });
  const apiBaseUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchData = async () => {
      if (!user.schoolId || !user.token) {
        console.error("Identifiant de l'établissement ou token utilisateur manquant.");
        return;
      }
      try {
        console.log('Fetching bulletin data with ID:', id);

        const bulletinRes = await axios.get(`${apiBaseUrl}/api/bulletins/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const bulletinData = bulletinRes.data;

        console.log('Fetched bulletin data:', bulletinData);

        const currentSemesterData = bulletinData.semestres[bulletinData.period] || {};
        const noteConduite = currentSemesterData.noteConduite || 0;
        const noteDiscipline = currentSemesterData.noteDiscipline || 0;

        setFormData({
          studentId: bulletinData.student?._id || '',
          classId: bulletinData.classId?._id || '',
          year: bulletinData.year,
          period: bulletinData.period,
          subjects: (bulletinData.subjects || []).map((subject) => ({
            subject: subject.subject?._id || '',
            teacher: subject.teacher?._id || '',
            grade: subject.grade || '',
            coefficient: subject.coefficient || 1,
          })),
          conductGrade: noteConduite,
          disciplineGrade: noteDiscipline,
        });

        calculateTotals(bulletinData.subjects || []);

        const studentRes = await axios.get(`${apiBaseUrl}/api/students?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStudents(studentRes.data.students);

        const classRes = await axios.get(`${apiBaseUrl}/api/classes?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setClasses(classRes.data.classes);

        const teacherRes = await axios.get(`${apiBaseUrl}/api/teachers?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTeachers(teacherRes.data.teachers);

        // Fetch active academic year
        const academicYearRes = await axios.get(`${apiBaseUrl}/api/bulletins/academic-year/active`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const { startYear, endYear } = academicYearRes.data;
        setActiveAcademicYear(`${startYear}-${endYear}`); // Stocker l'année académique active

      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
      }
    };

    const fetchClassStatistics = async () => {
      if (!formData.classId || !formData.year || !formData.period) {
        console.warn('Classe, année ou période non sélectionnée.');
        return;
      }

      try {
        console.log('Fetching class statistics for:', formData.classId, formData.year, formData.period);

        const res = await axios.get(`${apiBaseUrl}/api/bulletins/class-statistics`, {
          params: {
            classId: formData.classId,
            year: formData.year,
            period: formData.period,
          },
          headers: { Authorization: `Bearer ${user.token}` },
        });

        console.log('Fetched class statistics:', res.data);

        setClassStatistics({
          lowestAverage: res.data.lowestAverage,
          highestAverage: res.data.highestAverage,
          classAverage: res.data.classAverage,
        });

      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques de la classe:', err.message);
      }
    };

    fetchData();
    fetchClassStatistics();
  }, [formData.classId, formData.year, formData.period, user.token, id]);

  const handleFieldChange = (field, value) => {
    console.log(`Changing field ${field} to ${value}`);
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubjectChange = (index, key, value) => {
    console.log(`Changing subject at index ${index}, key ${key} to ${value}`);
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index][key] = value;
    setFormData({ ...formData, subjects: updatedSubjects });
    calculateTotals(updatedSubjects);
  };

  const calculateTotals = (subjects) => {
    console.log('Calculating totals for subjects:', subjects);

    const totalNotesValue = subjects.reduce((acc, subject) => acc + (parseFloat(subject.grade) || 0) * (parseFloat(subject.coefficient) || 0), 0);
    const totalCoefficientsValue = subjects.reduce((acc, subject) => acc + (parseFloat(subject.coefficient) || 0), 0);

    setTotalNotes(totalNotesValue);
    setTotalCoefficients(totalCoefficientsValue);

    console.log('Total Notes:', totalNotesValue);
    console.log('Total Coefficients:', totalCoefficientsValue);

    const totalDefinitiveValue = totalNotesValue + parseFloat(formData.conductGrade || 0) - parseFloat(formData.disciplineGrade || 0);
    setTotalDefinitive(totalDefinitiveValue);

    console.log('Total Definitive:', totalDefinitiveValue);

    if (totalCoefficientsValue > 0) {
      const moyenne = (totalDefinitiveValue / (totalCoefficientsValue + 1)).toFixed(2);
      setMoyenneTrimestrielle(moyenne);
      console.log('Moyenne Trimestrielle:', moyenne);
    } else {
      setMoyenneTrimestrielle(0);
      console.log('Moyenne Trimestrielle set to 0 due to total coefficients being 0');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    const bulletinData = {
      studentId: formData.studentId,
      classId: formData.classId,
      year: formData.year,
      period: formData.period,
      subjects: formData.subjects,
      conductGrade: formData.conductGrade,
      disciplineGrade: formData.disciplineGrade,
      establishmentId: user.schoolId,
    };

    try {
      const res = await axios.put(`${apiBaseUrl}/api/bulletins/${id}`, bulletinData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Bulletin mis à jour avec succès:', res.data);
      alert('Bulletin mis à jour avec succès');
      navigate('/bulletins');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du bulletin:', err.response ? err.response.data : err.message);
      alert(err.response?.data?.msg || 'Erreur lors de la mise à jour du bulletin');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Modifier le Bulletin</Typography>
        <form onSubmit={handleSubmit}>
          <SelectClass formData={formData} setFormData={setFormData} classes={classes} />
          <SelectStudent formData={formData} setFormData={setFormData} students={students} />
          <SelectPeriod formData={formData} setFormData={setFormData} />
          <TextField
            label="Année Académique"
            value={activeAcademicYear} // Affichage de l'année académique active
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              readOnly: true, // Rendre le champ non modifiable
            }}
          />
          <SubjectList formData={formData} setFormData={setFormData} teachers={teachers} onSubjectChange={handleSubjectChange} />
          <BehavioralGrades 
            conductGrade={formData.conductGrade} 
            setConductGrade={(value) => handleFieldChange('conductGrade', value)} 
            disciplineGrade={formData.disciplineGrade} 
            setDisciplineGrade={(value) => handleFieldChange('disciplineGrade', value)} 
          />
          <Summary 
            totalNotes={totalNotes} 
            totalCoefficients={totalCoefficients} 
            totalDefinitive={totalDefinitive} 
            moyenneTrimestrielle={moyenneTrimestrielle} 
          />
          <Box>
            <Typography variant="h6">Statistiques de Classe</Typography>
            <Typography>Plus faible moyenne : {classStatistics.lowestAverage}</Typography>
            <Typography>Plus grande moyenne : {classStatistics.highestAverage}</Typography>
            <Typography>Moyenne de la classe : {classStatistics.classAverage}</Typography>
          </Box> 

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button type="submit" variant="contained" color="primary">
              Mettre à jour le Bulletin
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => navigate('/bulletins')}
              sx={{ backgroundColor: '#f5f5f5', ml: 2 }}
            >
              Annuler
            </Button>
          </Box>

        </form>
      </Box>
    </Container>
  );
};

export default BulletinEditPage;
