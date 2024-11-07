




import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f0f4f8',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledButton = styled(Button)({
  backgroundColor: '#4CAF50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#45a049',
  },
  borderRadius: '20px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  marginTop: '20px',
  width: '100%',
});

const DevoirCompoPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State Management
  const [levels, setLevels] = useState(['Primaire', 'Collège', 'Lycée']);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedEvaluationType, setSelectedEvaluationType] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const semestersData = ['Semestre 1', 'Semestre 2'];
  const evaluationTypes = ['Devoir 1', 'Devoir 2', 'Composition'];

  useEffect(() => {
    if (user && user.token && user.schoolId) {
      fetchAcademicYears();
    } else {
      console.error("L'utilisateur ou ses informations ne sont pas disponibles.");
    }
  }, [user]);

  useEffect(() => {
    if (selectedLevel ) {
      fetchClassesByLevel(selectedLevel);
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass(selectedClass);
    }
  }, [selectedClass]);
  
 
  useEffect(() => {
    if (selectedClass && selectedLevel) {
        fetchSubjectsByClass(selectedClass, selectedLevel);
    }
}, [selectedClass, selectedLevel]);

  

  // Fetching Data Functions
  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/academic-years`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Filtrer pour récupérer uniquement l'année académique active
      const activeYear = res.data.find(year => year.isActive);

      if (activeYear) {
        setAcademicYears([activeYear]);  // Mettre à jour avec l'année académique active seulement
        setSelectedYear(activeYear._id); // Sélectionner automatiquement l'année active
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des années académiques:', err);
    } finally {
      setLoading(false);
    }
};


  const fetchClassesByLevel = async (level) => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/classes`, {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { level }, // On ne filtre que sur le niveau 
      });
      setClassesData(res.data.classes); 
    } catch (err) {
      console.error('Erreur lors de la récupération des classes:', err);
    } finally {
      setLoading(false);
    }
  };

 

  const fetchStudentsByClass = async (classId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/students/class/${classId}/students`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStudentsData(response.data.students); 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn('Aucun élève trouvé pour cette classe.');
        setStudentsData([]); 
      } else {
        console.error('Erreur lors de la récupération des élèves :', error);
      }
    } finally {
      setLoading(false);
    }
  };



 
 
  const fetchSubjectsByClass = async (classId, level) => {
    try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects/by-level`, {
            headers: { Authorization: `Bearer ${user.token}` },
            params: {
                level,
                classId, // On envoie également l'ID de la classe en paramètre
            },
        });

        console.log('Données des matières récupérées du backend:', response.data.subjects);
        setSubjectsData(response.data.subjects);
    } catch (error) {
        console.error('Erreur lors de la récupération des matières:', error);
    } finally {
        setLoading(false);
    }
};







  
  const handleSelectChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleGradeChange = (studentId) => (event) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], note: event.target.value },
    }));
  };

  const handleCoefficientChange = (studentId) => (event) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], coefficient: event.target.value },
    }));
  };

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     const requests = Object.keys(grades).map((studentId) => {
  //       return axios.post(`${process.env.REACT_APP_API_URL}/api/devoircompo`, {
  //         studentId,
  //         classId: selectedClass,
  //         subject: selectedSubject,
  //         type: selectedEvaluationType,
  //         note: grades[studentId].note,
  //         coefficient: grades[studentId].coefficient || 1,
  //         semester: selectedSemester,
  //         academicYear: selectedYear,
  //       }, {
  //         headers: { Authorization: `Bearer ${user.token}` },
  //       });
  //     });

  //     await Promise.all(requests);
  //     setSnackbarMessage('Les notes ont été sauvegardées avec succès !');
  //     setSnackbarOpen(true);
  //     setGrades({});
  //   } catch (error) {
  //     console.error('Erreur lors de la sauvegarde des notes :', error);
  //     setSnackbarMessage('Une erreur est survenue lors de la sauvegarde des notes.');
  //     setSnackbarOpen(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };




  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Construire un tableau d'objets pour chaque note
      const devoirsData = Object.keys(grades).map((studentId) => ({
        studentId,
        classId: selectedClass,
        subject: selectedSubject,
        type: selectedEvaluationType,
        note: grades[studentId].note,
        coefficient: grades[studentId].coefficient || 1,
        semester: selectedSemester,
        academicYear: selectedYear,
      }));
  
      // Envoyer une seule requête avec le tableau de devoirs
      await axios.post(`${process.env.REACT_APP_API_URL}/api/devoircompo`, devoirsData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
  
      setSnackbarMessage('Les notes ont été sauvegardées avec succès !');
      setSnackbarOpen(true);
      setGrades({});
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notes :', error);
      setSnackbarMessage('Une erreur est survenue lors de la sauvegarde des notes.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewDevoirCompos = () => {
    navigate('/view-devoircompos');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#004d40', // Couleur de fond
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    margin: '10px 0', // Espacement pour séparer les boutons
    '&:hover': {
      backgroundColor: '#00332d', // Couleur de fond au survol
    },
  }));

  // Render
  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom style={{ color: '#333', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
        Saisie des Notes - Devoir Compo
      </Typography>

      <form>
        {/* Année académique */}
        <Box mb={2}>
          <Select
            value={selectedYear}
            onChange={handleSelectChange(setSelectedYear)}
            displayEmpty
            fullWidth
            style={{ backgroundColor: '#fff' }}
          >
            <MenuItem value="" disabled>Sélectionner une année académique</MenuItem>
            {academicYears.map((year) => (
              <MenuItem key={year._id} value={year._id}>
                {year.startYear}-{year.endYear}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Niveau */}
        <Box mb={2}>
          <Select
            value={selectedLevel}
            onChange={handleSelectChange(setSelectedLevel)}
            displayEmpty
            fullWidth
            style={{ backgroundColor: '#fff' }}
          >
            <MenuItem value="" disabled>Sélectionner un niveau</MenuItem>
            {levels.map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </Box>

        {/* Classe */}
        <Box mb={2}>
          <Select
            value={selectedClass}
            onChange={handleSelectChange(setSelectedClass)}
            displayEmpty
            fullWidth
            style={{ backgroundColor: '#fff' }}
          >
            <MenuItem value="" disabled>Sélectionner une classe</MenuItem>
            {classesData.map((classe) => (
              <MenuItem key={classe._id} value={classe._id}>{classe.name}</MenuItem>
            ))}
          </Select>
        </Box>

      
        {/* Matière */}
{/* Matière */}
<Box mb={2}>
    <Select
        value={selectedSubject}
        onChange={handleSelectChange(setSelectedSubject)}
        displayEmpty
        fullWidth
        style={{ backgroundColor: '#fff' }}
    >
        <MenuItem value="" disabled>Sélectionner une matière</MenuItem>
        {subjectsData && subjectsData.map((subject) => (
            <MenuItem key={subject._id} value={subject._id}>{subject.name}</MenuItem>
        ))}
    </Select>
</Box>




        {/* Semestre et Type d'évaluation */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} mb={2}>
          <Select
            value={selectedSemester}
            onChange={handleSelectChange(setSelectedSemester)}
            displayEmpty
            fullWidth
            style={{ backgroundColor: '#fff', margin: '10px' }}
          >
            <MenuItem value="" disabled>Sélectionner un semestre</MenuItem>
            {semestersData.map((semester) => (
              <MenuItem key={semester} value={semester}>{semester}</MenuItem>
            ))}
          </Select>
          <Select
            value={selectedEvaluationType}
            onChange={handleSelectChange(setSelectedEvaluationType)}
            displayEmpty
            fullWidth
            style={{ backgroundColor: '#fff', margin: '10px' }}
          >
            <MenuItem value="" disabled>Sélectionner le type d'évaluation</MenuItem>
            {evaluationTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </Box>
      </form>

      {/* Table des élèves */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#004d40' }}>
            <TableRow>
              <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Élève</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Note</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Coefficient</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsData.length > 0 ? (
              studentsData.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={grades[student._id]?.note || ''}
                      onChange={handleGradeChange(student._id)}
                      inputProps={{ min: 0, max: 20 }}
                      style={{ width: '100%' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={grades[student._id]?.coefficient || 1}
                      onChange={handleCoefficientChange(student._id)}
                      inputProps={{ min: 1 }}
                      style={{ width: '100%' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Aucun élève trouvé pour cette classe et année académique.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Boutons */}


    {/* Section des boutons avec alignement */}
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
      {loading ? (
        <CircularProgress />
      ) : (
        <StyledButton onClick={handleSubmit}>
          Valider
        </StyledButton>
      )}

      <StyledButton onClick={handleViewDevoirCompos}>
        Voir les Notes et Moyennes
      </StyledButton>
    </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </StyledContainer>
  );
};

export default DevoirCompoPage;
