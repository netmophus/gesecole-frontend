import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Container, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem, IconButton, TablePagination,
  InputAdornment, Card, CardContent, Grid, Snackbar,Alert
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { AuthContext } from '../../context/AuthContext';
//import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';


const ClassPage = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState({ name: '', level: '', maxStudents: '' });
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user } = useContext(AuthContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

 
  // État pour stocker les élèves récupérés
  const [students, setStudents] = useState([]);
  // État pour contrôler l'ouverture du modal
  const [openStudentModal, setOpenStudentModal] = useState(false);


  const [openStudentDetailModal, setOpenStudentDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [notes, setNotes] = useState([]); // État pour les notes
  const [openNotesModal, setOpenNotesModal] = useState(false); // État pour le modal des notes
  const apiBaseUrl = process.env.REACT_APP_API_URL;
 
  // Ajoute ceci dans ton composant ClassPage.js ou un autre composant pertinent
const [academicYear, setAcademicYear] = useState('N/A');

// État pour gérer le dialog de confirmation
const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
const [classToDelete, setClassToDelete] = useState(null);




// Fonction pour récupérer l'année académique active
const fetchAcademicYear = async () => {
  try {

    const token = localStorage.getItem('token');
      const establishmentId = localStorage.getItem('schoolId');
  
      if (!establishmentId) {
        console.error("Aucun identifiant d'établissement trouvé");
        return;
      }
     



    const res = await axios.get(`${apiBaseUrl}/api/academic-years/active`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Année académique active:', res.data); // Vérification des données
    setAcademicYear(`${res.data.startYear}-${res.data.endYear}`); // Met à jour l'état
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'année académique active:', err);
    setAcademicYear('Non disponible');
  }
};

// Appelle la fonction lors du chargement du composant
useEffect(() => {
  if (user) {
    fetchAcademicYear();
  }
}, [user]);

  



  const fetchClasses = useCallback(async () => {
    try {
    
      const token = localStorage.getItem('token');
      const establishmentId = localStorage.getItem('schoolId');
  
      if (!establishmentId) {
        console.error("Aucun identifiant d'établissement trouvé");
        return;
      }
     
      const res = await axios.get(`${apiBaseUrl}/api/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          search: searchTerm,
          page: page + 1,
          limit: rowsPerPage,
        }
      });
  
      console.log('Données des classes récupérées depuis l\'API:', res.data.classes);
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des classes:', err);
      setClasses([]);
    }
  }, [user, searchTerm, page, rowsPerPage]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);


  useEffect(() => {
    console.log('Données des étudiants récupérées:', students);
  }, [students]);
  

  const handleSearchChange = debounce((event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(0);
  }, 300);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setCurrentClass({ name: '', level: '', maxStudents: '' });
    setEditing(false);
  };



  const handleSave = async () => {
    if (!user || !user.token) {
      setSnackbar({ open: true, message: 'Vous devez être connecté pour effectuer cette action', severity: 'error' });
      return;
    }
  
    try {
      // Préparer les données de la classe
      const classData = { ...currentClass, establishment: user.schoolId };
      console.log("Données de la classe avant envoi:", classData);
  
      // Si le niveau est "Lycée", valider la série
      if (classData.level === 'Lycée' && !classData.series) {
        setSnackbar({ open: true, message: 'Veuillez sélectionner une série pour le lycée.', severity: 'warning' });
        return;
      }
  
      // S'assurer que maxStudents est un nombre valide
      classData.maxStudents = parseInt(classData.maxStudents, 10);
      if (isNaN(classData.maxStudents) || classData.maxStudents <= 0) {
        setSnackbar({ open: true, message: 'Le nombre maximal d\'étudiants doit être un nombre positif.', severity: 'warning' });
        return;
      }
  
      // Vérifier si le niveau change de manière interdite avant l'envoi de la requête au backend
      if (editing) {
        if ((currentClass.level === 'Collège' && classData.level === 'Lycée') ||
            (currentClass.level === 'Lycée' && classData.level === 'Collège') ||
            (currentClass.level === 'Primaire' && (classData.level === 'Collège' || classData.level === 'Lycée')) ||
            ((currentClass.level === 'Collège' || currentClass.level === 'Lycée') && classData.level === 'Primaire')) {
          setSnackbar({ open: true, message: "Modification du niveau entre 'Primaire', 'Collège', et 'Lycée' est interdite.", severity: 'error' });
          return;
        }
      }
  
      // Supprimer la série si le niveau n'est pas "Lycée"
      if (classData.level !== 'Lycée') {
        delete classData.series;
      }
  
      // Envoyer la requête au backend
      if (editing) {
        await axios.put(`${apiBaseUrl}/api/classes/${classData._id}`, classData, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        });
      } else {
        await axios.post(`${apiBaseUrl}/api/classes`, classData, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        });
      }
  
      fetchClasses();
      handleClose();
      setSnackbar({ open: true, message: 'Classe sauvegardée avec succès.', severity: 'success' });
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la classe:', err);
      // Afficher le message d'erreur du backend en dernier recours
      if (err.response && err.response.data && err.response.data.msg) {
        setSnackbar({ open: true, message: err.response.data.msg, severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Erreur du serveur lors de la sauvegarde de la classe.', severity: 'error' });
      }
    }
  };
  
  
  const handleEdit = (classItem) => {
    setCurrentClass(classItem);
    setEditing(true);
    handleOpen();
  };
 


  const handleDelete = async (id) => {
    if (!user || !user.token) {
      setSnackbar({ open: true, message: 'Vous devez être connecté pour effectuer cette action', severity: 'error' });
      return;
    }
  
    try {
      await axios.delete(`${apiBaseUrl}/api/classes/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
  
      fetchClasses(); // Recharge la liste des classes après suppression
      setSnackbar({ open: true, message: 'Classe supprimée avec succès', severity: 'success' });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setSnackbar({ open: true, message: err.response.data.msg, severity: 'warning' });
      } else {
        console.error('Erreur lors de la suppression de la classe:', err);
        setSnackbar({ open: true, message: 'Erreur du serveur lors de la suppression de la classe', severity: 'error' });
      }
    }
  };



   // Fonction pour ouvrir le dialog de confirmation
   const handleOpenConfirmDialog = (id) => {
    setClassToDelete(id);
    setOpenConfirmDialog(true);
  };

  // Fonction pour fermer le dialog de confirmation
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setClassToDelete(null);
  };

  // Fonction pour confirmer la suppression
  const handleConfirmDelete = () => {
    if (classToDelete) {
      handleDelete(classToDelete);
    }
    handleCloseConfirmDialog();
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


// Fonction pour récupérer les élèves d'une classe spécifique
const handleViewStudents = async (classId) => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/students/class/${classId}/students`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    console.log('Données des étudiants:', res.data.students);

    const fetchedStudents = res.data.students || [];

    if (fetchedStudents.length === 0) {
      // Afficher un message clair avec Snackbar s'il n'y a aucun élève
      setSnackbar({ open: true, message: 'Cette classe n\'a actuellement aucun élève. Veuillez en ajouter.', severity: 'info' });
    } else {
      setStudents(fetchedStudents);
      setOpenStudentModal(true); // Ouvre le modal pour afficher les élèves si des données existent
    }
  } catch (err) {
    console.error('Erreur lors de la récupération des élèves:', err);
    const errorMessage = err.response?.data?.msg || 'Une erreur est survenue lors de la récupération des élèves. Veuillez réessayer plus tard.';
    setSnackbar({ open: true, message: errorMessage, severity: 'error' });
  }
};



const handleViewNotes = async (student) => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/students/${student._id}/notes`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    console.log('Notes de l\'élève:', res.data.notes);
    setNotes(res.data.notes); // Mettre à jour les notes de l’élève
    setSelectedStudent(student); // Stocker les informations de l'élève sélectionné
    setOpenNotesModal(true); // Ouvrir le modal des notes
  } catch (err) {
    console.error('Erreur lors de la récupération des notes:', err);
    alert('Erreur lors de la récupération des notes');
  }
};

const handleCloseStudentModal = () => {
  setOpenStudentModal(false);
};



const handleCloseStudentDetailModal = () => {
  setOpenStudentDetailModal(false); // Fermer le modal
  setSelectedStudent(null); // Réinitialiser l'élève sélectionné
};

// Fonction pour organiser et calculer les moyennes par matière et semestre
const organizeNotesBySemester = (notes) => {
  const result = {};

  // Regrouper par semestre et matière
  notes.forEach(note => {
    const { semester, subject, type, note: noteValue, coefficient } = note;
    const subjectName = subject?.name || 'N/A';

    if (!result[semester]) result[semester] = {};  // Initialise le semestre
    if (!result[semester][subjectName]) {
      result[semester][subjectName] = { devoirs: [], composition: null }; // Initialise la matière
    }

    // Ajouter les notes aux devoirs ou enregistrer la composition
    if (type === 'Devoir 1' || type === 'Devoir 2') {
      result[semester][subjectName].devoirs.push({ noteValue, coefficient });
    } else if (type === 'Composition') {
      result[semester][subjectName].composition = noteValue;
    }
  });

  return result;
};

// Fonction pour calculer la moyenne des devoirs
const calculateAverageDevoirs = (devoirs) => {
  const totalNotes = devoirs.reduce((acc, devoir) => acc + (devoir.noteValue * devoir.coefficient), 0);
  const totalCoefficients = devoirs.reduce((acc, devoir) => acc + devoir.coefficient, 0);
  return totalCoefficients > 0 ? (totalNotes / totalCoefficients).toFixed(2) : 'N/A';
};


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Left side: Classes Table in a Card */}
        <Grid item xs={12} md={12}>
          <Card sx={{ backgroundColor: '#f5f5f5', padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                 {/* Bouton de retour vers le dashboard */}
          <Button
            variant="outlined"
            onClick={() => navigate('/etablissement/dashboardPage')}
            sx={{
              marginBottom: 2,
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

                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>Gestion des Classes</Typography>
                <TextField
                  variant="outlined"
                  placeholder="Rechercher..."
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpen}
                  sx={{
                    backgroundColor: '#00796b',
                    '&:hover': {
                      backgroundColor: '#004d40',
                    },
                  }}
                >
                  Ajouter
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nom</TableCell>
                      <TableCell>Niveau</TableCell>
                      <TableCell>Série</TableCell> {/* Nouvelle colonne */}
                      <TableCell>Élèves Max</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classes.length > 0 ? (
                      classes.map((classItem) => (
                        <TableRow key={classItem._id} hover>
                          <TableCell>{classItem.name}</TableCell>
                          <TableCell>{classItem.level}</TableCell>
                          <TableCell>{classItem.series || 'N/A'}</TableCell> {/* Affichage de la série */}
                          <TableCell>{classItem.maxStudents}</TableCell>
                          
                          <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleEdit(classItem)}>
                            <EditIcon />
                          </IconButton>
                         
                          {/* Modifier le bouton de suppression pour ouvrir le dialog de confirmation */}
                          <IconButton color="secondary" onClick={() => handleOpenConfirmDialog(classItem._id)}>
                            <DeleteIcon />
                          </IconButton>

                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => handleViewStudents(classItem._id, classItem.name)} // Appel de la fonction pour voir les élèves
                            sx={{ ml: 1 }}
                          >
                            Voir les élèves
                          </Button>
                        </TableCell>






                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Aucune classe trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={classes.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

  


        
      </Grid>

      {/* Dialog for Add/Edit Class */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
  <DialogTitle>{editing ? 'Modifier la Classe' : 'Ajouter une Classe'}</DialogTitle>
  <DialogContent>
    <Grid container spacing={2}>
      {/* Left side: Form */}
      <Grid item xs={12} md={6}>
        <Card sx={{ backgroundColor: '#f0f0f0', padding: 2 }}>
          <CardContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom de la Classe"
              type="text"
              fullWidth
              value={currentClass.name}
              onChange={(e) => setCurrentClass({ ...currentClass, name: e.target.value })}
            />
            <TextField
              select
              margin="dense"
              label="Niveau"
              fullWidth
              value={currentClass.level}
              onChange={(e) => setCurrentClass({ ...currentClass, level: e.target.value })}
            >
              <MenuItem value="Primaire">Primaire</MenuItem>
              <MenuItem value="Collège">Collège</MenuItem>
              <MenuItem value="Lycée">Lycée</MenuItem>
            </TextField>


            {currentClass.level === 'Lycée' && (
              <TextField
                select
                margin="dense"
                label="Série"
                fullWidth
                value={currentClass.series || ''}
                onChange={(e) => setCurrentClass({ ...currentClass, series: e.target.value })}
              >
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
                <MenuItem value="E">E</MenuItem>
                <MenuItem value="F">F</MenuItem>
                <MenuItem value="G">G</MenuItem>
              </TextField>
            )}






            <TextField
              margin="dense"
              label="Nombre Maximum d'Élèves"
              type="number"
              fullWidth
              value={currentClass.maxStudents}
              onChange={(e) => setCurrentClass({ ...currentClass, maxStudents: e.target.value })}
            />
            
            {/* Buttons moved under the form */}
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                onClick={handleClose}
                sx={{
                  backgroundColor: '#ff5722', // Custom background color for "Annuler" button
                  color: 'white', // Text color
                  '&:hover': {
                    backgroundColor: '#e64a19', // Hover background color
                  },
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                sx={{
                  backgroundColor: '#30b570', // Custom background color for "Ajouter/Mettre à jour" button
                  color: 'white', // Text color
                  '&:hover': {
                    backgroundColor: '#45a049', // Hover background color
                  },
                }}
              >
                {editing ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

     
    </Grid>
  </DialogContent>
</Dialog>


   {/* Modal pour afficher les élèves */}
      <Dialog
        open={openStudentModal}
        onClose={handleCloseStudentModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Liste des élèves de la classe</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Matricule</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Date de Naissance</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>Actions</TableCell> {/* Colonne des actions */}
                </TableRow>
              </TableHead>
              <TableBody>
                   {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.matricule ? student.matricule : 'Matricule non défini'}</TableCell> {/* Afficher le matricule */}
                    <TableCell>{student.firstName} {student.lastName}</TableCell>
                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>
                 

                    <IconButton color="primary" onClick={() => handleViewNotes(student)}>
                    <VisibilityIcon />
                  </IconButton>




                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

 

        <DialogActions>
          <Button onClick={handleCloseStudentModal} color="secondary">Fermer</Button>
        </DialogActions>
      </Dialog>







{/* Modal pour afficher les details de l'élève */}
<Dialog
  open={openStudentModal}
  onClose={handleCloseStudentModal}
  maxWidth="lg"
  fullWidth
>
  <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
    Liste des élèves de la classe
  </DialogTitle>
  <DialogContent sx={{ padding: 3, backgroundColor: '#f9f9f9' }}>
    {students.length > 0 ? (
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Matricule</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date de Naissance</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Genre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id} hover sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
                <TableCell>{student.matricule || 'N/A'}</TableCell>
                <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                <TableCell>{new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleViewNotes(student)}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Box textAlign="center" p={2}>
        <Typography variant="h6" sx={{ color: '#757575' }}>
          Aucun élève trouvé dans cette classe. Veuillez ajouter des élèves.
        </Typography>
      </Box>
    )}
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center', backgroundColor: '#f5f5f5', padding: 2 }}>
    <Button
      onClick={handleCloseStudentModal}
      variant="contained"
      sx={{
        backgroundColor: '#1976d2',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#1565c0',
        },
        textTransform: 'none',
      }}
    >
      Fermer
    </Button>
  </DialogActions>
</Dialog>





<Dialog open={openNotesModal} onClose={() => setOpenNotesModal(false)} maxWidth="md" fullWidth>
  <DialogTitle>Situation de l'élève</DialogTitle>
  <DialogContent>
    <Box mb={2}>
      <Typography><strong>Nom :</strong> {selectedStudent?.lastName || 'N/A'}</Typography>
      <Typography><strong>Prénom :</strong> {selectedStudent?.firstName || 'N/A'}</Typography>
      <Typography>
        <strong>Date de Naissance :</strong> 
        {selectedStudent?.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A'}
      </Typography>
      <Typography><strong>Matricule :</strong> {selectedStudent?.matricule || 'N/A'}</Typography>
      <Typography><strong>Année Académique :</strong> {academicYear || 'N/A'}</Typography>
    </Box>

    {/* Tableau récapitulatif avec moyenne et composition par matière */}
    {Object.entries(organizeNotesBySemester(notes)).map(([semester, subjects]) => (
      <Box key={semester} mb={3}>
        <Typography variant="h6">{semester}</Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Matière</strong></TableCell>
                <TableCell><strong>Moyenne Devoirs</strong></TableCell>
                <TableCell><strong>Composition</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(subjects).map(([subjectName, { devoirs, composition }]) => (
                <TableRow key={subjectName}>
                  <TableCell>{subjectName}</TableCell>
                  <TableCell>{calculateAverageDevoirs(devoirs)}</TableCell>
                  <TableCell>{composition || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    ))}

    {/* Détails des notes individuelles */}
    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Détails des Notes</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Matière</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Note</strong></TableCell>
            <TableCell><strong>Coefficient</strong></TableCell>
            <TableCell><strong>Semestre</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notes.map((note) => (
            <TableRow key={note._id}>
              <TableCell>{note.subject?.name || 'N/A'}</TableCell>
              <TableCell>{note.type}</TableCell>
              <TableCell>{note.note}</TableCell>
              <TableCell>{note.coefficient}</TableCell>
              <TableCell>{note.semester}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenNotesModal(false)} color="primary">Fermer</Button>
  </DialogActions>
</Dialog>


{/* Dialog de confirmation pour supprimer une classe */}
<Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        maxWidth="xs"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" variant="contained">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>



<Snackbar
  open={snackbar.open}
  autoHideDuration={6000} // Ferme automatiquement après 6 secondes
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position en haut et centré
>
  <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
    {snackbar.message}
  </Alert>
</Snackbar>


    </Container>
  );
};

export default ClassPage;
