
import React, { useState, useContext, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, MenuItem, CircularProgress, Grid } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';  // Assurez-vous que le chemin est correct
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
const apiBaseUrl = process.env.REACT_APP_API_URL;

// Composant de création d'un Devoir/Composition
const CreateDevoirCompoPage = () => {
  const navigate = useNavigate();
  
 
  const [formData, setFormData] = useState({
    studentId: '',
    classId: '',
    subject: '',
    type: 'Devoir 1',  // Par défaut, c'est un devoir 1
    note: '',
    coefficient: 1,
    semester: 'Semestre 1',  // Défaut à 1er Semestre
    academicYear: '',  // Ajout du champ pour l'année académique
  });

 // const [activeAcademicYear, setActiveAcademicYear] = useState('');
  const [academicYears, setAcademicYears] = useState([]);  // Pour stocker toutes les années académiques
  const [devoirCompos, setDevoirCompos] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);  // Ajout de l'état de chargement
 // Initialiser l'état pour l'année scolaire
  const [selectedYear, setSelectedYear] = useState('');
  const { user } = useContext(AuthContext); // Assume que l'utilisateur connecté est dans ce contexte
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
 
  useEffect(() => {
    if (!user || !user.token || !user.schoolId) {
      console.error("L'utilisateur ou ses informations ne sont pas disponibles.");
      return;
    }
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const studentRes = await axios.get(`http://localhost:5000/api/students?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStudents(studentRes.data.students);
  
        const classRes = await axios.get(`${apiBaseUrl}/api/classes?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setClasses(classRes.data.classes);
  
        const subjectRes = await axios.get(`${apiBaseUrl}/api/subjects?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSubjects(subjectRes.data.subjects);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [user]);
  



// Fonction pour récupérer toutes les années académiques
useEffect(() => {
  if (!user || !user.token) {
    console.error("L'utilisateur ou son token ne sont pas disponibles.");
    return;
  }

  const fetchAcademicYears = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/academic-years`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAcademicYears(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des années académiques:', err.response ? err.response.data : err.message);
      alert('Impossible de récupérer les années académiques.');
    }
  };

  fetchAcademicYears();
}, [user]);


 

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  

   // Votre fonction handleSubmit adaptée
   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      console.error("L'utilisateur ou son token ne sont pas disponibles.");
      return;
    }
  
    const devoirCompoData = {
      studentId: formData.studentId,
      classId: formData.classId,
      subject: formData.subject,
      type: formData.type,
      note: formData.note,
      coefficient: formData.coefficient,
      semester: formData.semester,
      academicYear: selectedYear,
    };
  
    try {
      const res = await axios.post(`${apiBaseUrl}/api/devoircompo`, devoirCompoData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
  
      setDevoirCompos([...devoirCompos, res.data]);
      setSnackbarMessage('Devoir/Composition créé avec succès');
      setSnackbarOpen(true);
      navigate('/devoircompos/create');
    } catch (err) {
      console.error('Erreur lors de la création du devoir/composition:', err.response ? err.response.data : err.message);
      setSnackbarMessage('Erreur lors de la création du devoir/composition');
      setSnackbarOpen(true);
    }
  };
  


  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        {/* Colonne pour le formulaire */}
        {/* <Grid item xs={12} md={8}> */}
        <Grid item xs={12} md={8} sx={{ mb: 4 }}>
          <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', padding: 3, mt: 4, boxShadow: 3 }}>
            {/* Bouton de retour au dashboard */}
 <Grid item xs={12}>
    <Button
      variant="outlined"
      onClick={() => navigate('/etablissement/dashboardPage')}
      sx={{
        marginTop: 2,        
        marginLeft: 2,
        backgroundColor: '#004d40',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#00332d',
          color: '#fff',
        },
        borderRadius: 2,
        padding: '10px 20px',
      }}
    >
      Retour au Dashboard
    </Button>
  </Grid>
            <CardContent>
              <Typography variant="h4" gutterBottom>Créer un Devoir/Composition</Typography>
              {loading ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>




<TextField
      select
      label="Année Scolaire"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
      fullWidth
      sx={{ mb: 2 }}
    >
      {academicYears.map((year) => (
        <MenuItem key={year._id} value={`${year.startYear}-${year.endYear}`}>
          {year.startYear}-{year.endYear}
        </MenuItem>
      ))}
    </TextField>



                  {/* Sélection de la classe */}
                  <TextField
                    select
                    label="Classe"
                    name="classId"
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  >
                    {classes.map((classe) => (
                      <MenuItem key={classe._id} value={classe._id}>
                        {classe.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Sélection de l'élève */}
                  <TextField
                    select
                    label="Élève"
                    name="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                    disabled={!formData.classId}
                  >
                    {students
                      .filter(student => student.classId._id === formData.classId)
                      .map((student) => (
                        <MenuItem key={student._id} value={student._id}>
                          {student.firstName} {student.lastName}
                        </MenuItem>
                    ))}
                  </TextField>









                  {/* Sélection de la matière */}
                  <TextField
                    select
                    label="Matière"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject._id} value={subject._id}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Sélection du type (Devoir ou Composition) */}
                  <TextField
                    select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="Devoir 1">Devoir 1</MenuItem>
                    <MenuItem value="Devoir 2">Devoir 2</MenuItem>
                    <MenuItem value="Composition">Composition</MenuItem>
                  </TextField>

                  {/* Champ pour la note */}
                  <TextField
                    label="Note"
                    name="note"
                    type="number"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />

                  {/* Coefficient */}
                  <TextField
                    label="Coefficient"
                    name="coefficient"
                    type="number"
                    value={formData.coefficient}
                    onChange={(e) => setFormData({ ...formData, coefficient: e.target.value })}
                    fullWidth
                    sx={{ mb: 2 }}
                  />

                  {/* Sélection du semestre */}
                  <TextField
                    select
                    label="Semestre"
                    name="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="Semestre 1">1er Semestre</MenuItem>
                    <MenuItem value="Semestre 2">2ème Semestre</MenuItem>
                  </TextField>

                 {/* Bouton de soumission */}
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button type="submit" variant="contained" color="primary">
                 
                    Créer Devoir/Composition
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => navigate('/view-devoircompos')}>
                    Annuler
                  </Button>
                </Box>

                </form>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Colonne pour la carte de visualisation */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', padding: 3, mt: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Visualiser les Notes</Typography>
              <Typography variant="body2" gutterBottom>
                Consultez le tableau récapitulatif des notes pour les élèves par matière, type d’évaluation, et semestre.
              </Typography>
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={() => navigate('/view-devoircompos')}>
                  Voir les Notes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>


        <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />

      </Grid>
    </Container>
  );
};

export default CreateDevoirCompoPage;
