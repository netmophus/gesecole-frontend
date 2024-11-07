
import React, { useState, useContext, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import des sous-composants
import SelectClass from '../../components/Bulletins/SelectClass';
import SelectStudent from '../../components/Bulletins/SelectStudent';
import SelectPeriod from '../../components/Bulletins/SelectPeriod';
import SubjectList from '../../components/Bulletins/SubjectList';
import BehavioralGrades from '../../components/Bulletins/BehavioralGrades';
import Summary from '../../components/Bulletins/Summary';

const CreateBulletinPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    studentId: '',
    classId: '',
    year: '',  // Ajout de l'année académique ici
    period: '',
    subjects: [{ subject: '', teacher: '', grade: '', coefficient: 1 }]
  });
  const [academicYear, setAcademicYear] = useState('');  // Nouvel état pour l'année académique active
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalCoefficients, setTotalCoefficients] = useState(0);
  const [conductGrade, setConductGrade] = useState(0);
  const [disciplineGrade, setDisciplineGrade] = useState(0);
  const [totalDefinitive, setTotalDefinitive] = useState(0);
  const [moyenneTrimestrielle, setMoyenneTrimestrielle] = useState(0);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
 
  useEffect(() => {
    const fetchAcademicYear = async () => {
      try {
        console.log('Tentative de récupération de l\'année académique active...');
  
        // Appel API pour récupérer l'année académique active
        const res = await axios.get(`${apiBaseUrl}/api/bulletins/academic-year/active`, {
          headers: { Authorization: `Bearer ${user.token}` },  // Ajout du token utilisateur pour l'authentification
        });
  
        // Récupération des données de l'année académique (startYear et endYear)
        const { startYear, endYear } = res.data;
        console.log('Année académique active récupérée:', { startYear, endYear });
  
        // Mise à jour de l'état de l'année académique
        setAcademicYear(`${startYear}-${endYear}`);
        
        // Mise à jour de l'état du formulaire pour inclure l'année académique
        setFormData(prevData => ({ ...prevData, year: `${startYear}-${endYear}` }));
        console.log('Mise à jour du formulaire avec l\'année académique:', `${startYear}-${endYear}`);
  
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'année académique active:', err);
      }
    };
  
    // Appel de la fonction fetchAcademicYear lors du montage du composant
    fetchAcademicYear();
  }, [user.token,apiBaseUrl]);
  

 
  
  // Fonction pour calculer les totaux et moyennes
  const calculateTotals = (subjects = []) => {
    if (!Array.isArray(subjects) || subjects.length === 0) {
      setTotalNotes(0);
      setTotalCoefficients(0);
      setTotalDefinitive(0);
      setMoyenneTrimestrielle(0);
      return;
    }
    const totalNotesValue = subjects.reduce((acc, subject) => acc + (parseFloat(subject.grade) || 0) * (parseFloat(subject.coefficient) || 0), 0);
    const totalCoefficientsValue = subjects.reduce((acc, subject) => acc + (parseFloat(subject.coefficient) || 0), 0);

    setTotalNotes(totalNotesValue);
    setTotalCoefficients(totalCoefficientsValue);

    const totalDefinitiveValue = totalNotesValue + parseFloat(formData.conductGrade || 0) - parseFloat(formData.disciplineGrade || 0);
    setTotalDefinitive(totalDefinitiveValue);

    if (totalCoefficientsValue > 0) {
      const moyenne = (totalDefinitiveValue / (totalCoefficientsValue + 1)).toFixed(2); // Inclut la conduite
      setMoyenneTrimestrielle(moyenne);
    } else {
      setMoyenneTrimestrielle(0);
    }
  };

  useEffect(() => {
    calculateTotals(); // Calculer les totaux et les moyennes lorsque les matières ou les notes changent
  }, [formData.subjects, conductGrade, disciplineGrade]);

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

        const teacherRes = await axios.get(`${apiBaseUrl}/api/teachers?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTeachers(teacherRes.data.teachers);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
      }
    };

    fetchData();
  }, [user.token, user.schoolId, apiBaseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bulletinData = {
      studentId: formData.studentId,
      classId: formData.classId,
      year: formData.year,
      period: formData.period,
      subjects: formData.subjects,
      establishmentId: user.schoolId,
      conductGrade: conductGrade,
      disciplineGrade: disciplineGrade,
    };

    try {
       await axios.post(`${apiBaseUrl}/api/bulletins`, bulletinData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Bulletin créé avec succès');
      navigate('/bulletins');
    } catch (err) {
      console.error('Erreur lors de la création du bulletin:', err.response ? err.response.data : err.message);
      alert(err.response?.data?.msg || 'Erreur lors de la création du bulletin');
    }
  };


  useEffect(() => {
    console.log('formData mis à jour:', formData); // Log de formData pour vérifier la photo
  }, [formData]);
  

  return (
    <Container maxWidth="md">
      <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', padding: 3, mt: 4, boxShadow: 3, marginBottom: '25px' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Créer un Nouveau Bulletin</Typography>
          <form onSubmit={handleSubmit}>
            <SelectClass formData={formData} setFormData={setFormData} classes={classes} />
            <SelectStudent formData={formData} setFormData={setFormData} students={students} />
            <SelectPeriod formData={formData} setFormData={setFormData} />

            {/* Affichage de l'année académique */}
            <TextField
              label="Année Académique"
              value={academicYear || formData.year}
              fullWidth
              InputProps={{
                readOnly: true,  // Champ en lecture seule
              }}
              sx={{ mb: 2 }}
            />

            <SubjectList formData={formData} setFormData={setFormData} teachers={teachers} />
            <BehavioralGrades
              conductGrade={conductGrade}
              setConductGrade={setConductGrade}
              disciplineGrade={disciplineGrade}
              setDisciplineGrade={setDisciplineGrade}
            />
            <Summary
              totalNotes={totalNotes}
              totalCoefficients={totalCoefficients}
              totalDefinitive={totalDefinitive}
              moyenneTrimestrielle={moyenneTrimestrielle}
            />



            <Box mt={2} display="flex" justifyContent="space-between">
              
            {formData.studentPhoto && (

              
  <Box mt={2} display="flex" justifyContent="center">
    <img
      src={`${apiBaseUrl}/${formData.studentPhoto.replace(/\\/g, '/')}`} // Remplacement des backslashes
      alt="Portait de l'élève"
      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
    />
  </Box>
)}


              
              
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#115293',
                  },
                }}
              >
                Créer le Bulletin
              </Button>
              <Button
                onClick={() => navigate('/bulletins')}
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#9a0007',
                  },
                }}
              >
                Annuler
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateBulletinPage;
