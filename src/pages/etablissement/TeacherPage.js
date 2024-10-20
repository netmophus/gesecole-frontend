
import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Card,
  CardContent,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const TeacherPage = () => {
  const navigate = useNavigate(); // Initialisation de navigate
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSubjectsDialog, setOpenSubjectsDialog] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState({ nom: '', telephone: '', email: '', educationLevel: '' });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { user } = useContext(AuthContext);
  const apiBaseUrl = process.env.REACT_APP_API_URL;


  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // Fonction pour récupérer les enseignants avec les matières assignées peuplées
  const fetchTeachers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const establishmentId = localStorage.getItem('schoolId');
  
      if (!establishmentId) {
        console.error("Aucun identifiant d'établissement trouvé");
        return;
      }
  
      // Assurez-vous que `educationLevel` est bien défini ici avant de l'envoyer
      const res = await axios.get(`${apiBaseUrl}/api/teachers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: searchTerm,
          page: page + 1,
          limit: rowsPerPage,
          establishmentId,
          educationLevel: currentTeacher.educationLevel || '', // Assurez-vous que cette variable est bien définie
        },
      });
  
      if (res.data && Array.isArray(res.data.teachers) && res.data.teachers.length > 0) {
        setTeachers(res.data.teachers);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des enseignants:', err);
      setTeachers([]);
    }
  }, [searchTerm, page, rowsPerPage, currentTeacher.educationLevel]);
  
 

  // Fonction pour récupérer les matières selon le niveau d'enseignement
  const fetchSubjects = useCallback(async (educationLevel) => {
    try {
      if (!user || !user.token) {
        console.error('Aucun token trouvé dans le contexte utilisateur');
        alert('Vous devez être connecté pour effectuer cette action');
        return;
      }

      const res = await axios.get(`${apiBaseUrl}/api/subjects`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          educationLevel,
        },
      });

      setSubjects(res.data.subjects || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error('Erreur lors de la récupération des matières:', err);
      setSubjects([]);
    }
  }, [user]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSearchChange = debounce((event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(0);
  }, 300);

  const handleClose = () => {
    setOpen(false);
    setCurrentTeacher({ nom: '', telephone: '', email: '' });
    setEditing(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenSubjectsDialog = (teacher) => {
    setCurrentTeacher(teacher);
    setSelectedSubjects(teacher.assignedSubjects || []);
    fetchSubjects(teacher.educationLevel);
    setOpenSubjectsDialog(true);
  };
  
 

  const handleCloseSubjectsDialog = () => {
    setOpenSubjectsDialog(false);
  };

const handleChange = (key, value) => {
  if (key === 'telephone') {
    setCurrentTeacher({ ...currentTeacher, telephone: value, telephoneChanged: true });
  } else {
    setCurrentTeacher({ ...currentTeacher, [key]: value });
  }
};





const handleCreateTeacher = async () => {
  const formData = new FormData();

  // Ajouter les données du formulaire
  formData.append('nom', currentTeacher.nom);
  formData.append('telephone', currentTeacher.telephone); // Téléphone est toujours requis lors de la création
  formData.append('email', currentTeacher.email);
  formData.append('educationLevel', currentTeacher.educationLevel);

  if (currentTeacher.photo && typeof currentTeacher.photo !== 'string') {
    formData.append('photo', currentTeacher.photo); // Ajout de la photo si elle est présente
  }

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${apiBaseUrl}/api/teachers`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Enseignant créé avec succès :', res.data);
    fetchTeachers(); // Actualiser la liste des enseignants
    handleClose(); // Fermer le formulaire
  } catch (err) {
    console.error("Erreur lors de la création de l'enseignant :", err.response ? err.response.data : err.message);
    setSnackbar({ open: true, message: 'Erreur du serveur lors de la création.', severity: 'error' });
  }
};



const handleUpdateTeacher = async () => {
  const formData = new FormData();

  // Ajouter les données du formulaire
  if (currentTeacher.nom) {
    formData.append('nom', currentTeacher.nom);
  } else {
    setSnackbar({ open: true, message: 'Le champ nom est requis.', severity: 'error' });
    return; // Arrêter si le nom est manquant
  }

  if (currentTeacher.email) {
    formData.append('email', currentTeacher.email);
  }

  formData.append('educationLevel', currentTeacher.educationLevel);

  // Ne pas ajouter le téléphone si l'administrateur ne l'a pas changé
  if (currentTeacher.telephoneChanged && currentTeacher.telephone) {
    formData.append('telephone', currentTeacher.telephone); // Ajouter uniquement si modifié
  }

  if (currentTeacher.photo && typeof currentTeacher.photo !== 'string') {
    formData.append('photo', currentTeacher.photo); // Ajout de la photo si elle est modifiée
  }

  console.log('Données envoyées pour la mise à jour:', {
    nom: currentTeacher.nom,
    email: currentTeacher.email,
    telephone: currentTeacher.telephone,
    educationLevel: currentTeacher.educationLevel,
    photo: currentTeacher.photo,
  });
  

  try {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${apiBaseUrl}/api/teachers/${currentTeacher._id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Enseignant mis à jour avec succès :', res.data);
    fetchTeachers(); // Actualiser la liste des enseignants
    handleClose(); // Fermer le formulaire
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'enseignant :", err.response ? err.response.data : err.message);
    setSnackbar({ open: true, message: err.response?.data?.msg || 'Erreur du serveur', severity: 'error' });
  }
};

const handleSave = (e) => {
  e.preventDefault();
  if (editing) {
    handleUpdateTeacher(); // Appeler la fonction de mise à jour si en mode édition
  } else {
    handleCreateTeacher(); // Appeler la fonction de création si en mode création
  }
};



  const handleSaveSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const establishmentId = localStorage.getItem('schoolId');
  
      if (!token) {
        setSnackbar({ open: true, message: 'Vous devez être connecté pour effectuer cette action.', severity: 'error' });
        return;
      }
  
      if (!currentTeacher._id) {
        setSnackbar({ open: true, message: 'Aucun enseignant sélectionné pour l\'assignation des matières.', severity: 'warning' });
        return;
      }
  
      if (!establishmentId) {
        setSnackbar({ open: true, message: 'Aucun identifiant d\'établissement trouvé.', severity: 'warning' });
        return;
      }
  
      if (selectedSubjects.length === 0) {
        setSnackbar({ open: true, message: 'Aucune matière sélectionnée à assigner.', severity: 'warning' });
        return;
      }
  
      const dataToSend = {
        teacherId: currentTeacher._id,
        subjectIds: selectedSubjects,
        establishmentId,
      };
  
      console.log('Données envoyées pour l\'assignation:', dataToSend);
  
      const response = await axios.post(
        `${apiBaseUrl}/api/teachers/${currentTeacher._id}/assign-subjects`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        fetchTeachers();
        handleCloseSubjectsDialog();
        setSnackbar({ open: true, message: 'Les matières ont été assignées avec succès.', severity: 'success' });
      } else {
        throw new Error('Échec de l\'assignation des matières. Veuillez réessayer.');
      }
    } catch (err) {
      console.error("Erreur lors de l'assignation des matières à l'enseignant:", err);
  
      if (err.response) {
        const errorMessage = err.response.data?.msg || 'Erreur lors de l\'assignation des matières.';
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      } else if (err.request) {
        setSnackbar({ open: true, message: 'Erreur réseau : Veuillez vérifier votre connexion et réessayer.', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
      }
    }
  };
  




  const handleOpen = () => {
    setCurrentTeacher({ nom: '', telephone: '', email: '', educationLevel: '' });
    setSelectedSubjects([]);
    setEditing(false);
    setOpen(true);
  };




  const handleEdit = (teacher) => {
    setCurrentTeacher({
      ...teacher,
      photo: teacher.photo || null  // Affiche la photo actuelle s'il y en a une
    });
    setSelectedSubjects(teacher.assignedSubjects ? teacher.assignedSubjects.map((matiere) => matiere._id) : []);
    fetchSubjects(teacher.educationLevel);
    setEditing(true);
    setOpen(true);
  };
  
  
  const handleDelete = async (id) => {
    if (!user?.permissions?.delete) {
      setSnackbar({ open: true, message: 'Vous n\'avez pas la permission de supprimer cet enseignant.', severity: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBaseUrl}/api/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchTeachers();  // Met à jour la liste des enseignants après suppression
      setSnackbar({ open: true, message: 'Enseignant supprimé avec succès.', severity: 'success' });
    } catch (err) {
      console.error("Erreur lors de la suppression de l'enseignant:", err.response ? err.response.data : err.message);
      setSnackbar({ open: true, message: 'Erreur lors de la suppression de l\'enseignant.', severity: 'error' });
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRemoveSubject = async (teacherId, subjectId) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        setSnackbar({ open: true, message: 'Vous devez être connecté pour effectuer cette action.', severity: 'error' });
        return;
      }
  
      await axios.delete(`${apiBaseUrl}/api/teachers/${teacherId}/subjects/${subjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchTeachers();
      handleCloseSubjectsDialog();
  
      setSnackbar({ open: true, message: 'Matière supprimée avec succès.', severity: 'success' });
    } catch (err) {
      console.error('Erreur lors de la suppression de la matière associée:', err);
      setSnackbar({ open: true, message: 'Erreur lors de la suppression de la matière associée.', severity: 'error' });
    }
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchTeachers();
  };

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers, page, rowsPerPage, searchTerm]);



  const handleDeleteClick = (teacherId) => {
    setTeacherToDelete(teacherId);
    setDeleteDialogOpen(true);  // Ouvre le dialogue de confirmation
  };
  
  const confirmDelete = async () => {
    if (teacherToDelete) {
      await handleDelete(teacherToDelete);  // Appelle la fonction de suppression avec l'ID sélectionné
      setDeleteDialogOpen(false);  // Ferme le dialogue
      setTeacherToDelete(null);  // Réinitialise l'enseignant à supprimer
    }
  };
  


  return (
    <Container>
      <Card sx={{ backgroundColor: 'rgba(0, 128, 0, 0.1)', padding: 2, marginBottom: '10px', marginTop: '10px' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
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


            <Typography variant="h4">Gestion des Enseignants</Typography>
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
            />         

            <Button
              variant="contained"
              color="inherit"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              disabled={!user?.permissions?.create}
              sx={{
                backgroundColor: user?.permissions?.create ? '#004d40' : '#ccc',
                color: 'white',
                '&:hover': {
                  backgroundColor: user?.permissions?.create ? '#00332d' : '#ccc',
                },
              }}
            >
              Ajouter
            </Button>

          


          </Box>



<TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2, overflow: 'hidden' }}>
  <Table>
    <TableHead sx={{ backgroundColor: '#004d40' }}>
      <TableRow>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Photo</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Nom</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Téléphone</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Email</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Niveau d'Enseignement</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Matières</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }} align="right">Actions</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {teachers && teachers.length > 0 ? (
        teachers.map((teacher) => (
          <TableRow 
            key={teacher._id}
            sx={{ '&:hover': { backgroundColor: '#f1f8e9' }, transition: 'background-color 0.3s ease' }}
          >
            <TableCell>
              {teacher.photo ? (
                <img
                  src={`http://localhost:5000/${teacher.photo}`}  // URL de la photo
                  alt={teacher.nom}
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    objectFit: 'cover', 
                    borderRadius: '50%', 
                    border: '2px solid #004d40',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                  }}
                />
              ) : (
                <Typography sx={{ color: '#757575' }}>Aucune photo</Typography>
              )}
            </TableCell>

            <TableCell>{teacher.nom || 'N/A'}</TableCell>
            <TableCell>{teacher.telephone || 'N/A'}</TableCell>
            <TableCell>{teacher.email || 'N/A'}</TableCell>
            <TableCell>{teacher.educationLevel || 'N/A'}</TableCell>

            <TableCell>
              {teacher.matières && teacher.matières.length > 0 ? (
                teacher.matières.map((matiere) => (
                  <span key={matiere._id}>
                    {matiere.name} ({matiere.level})
                  </span>
                )).reduce((prev, curr) => [prev, ', ', curr])
              ) : (
                <Typography sx={{ color: '#757575' }}>Aucune matière assignée</Typography>
              )}
            </TableCell>

            <TableCell align="right">
              <IconButton 
                color="primary" 
                onClick={() => handleEdit(teacher)} 
                disabled={!user?.permissions?.update}
                sx={{ marginRight: 1, color: '#004d40', '&:hover': { color: '#00332d' } }}
              >
                <EditIcon />
              </IconButton>

              <IconButton 
                color="error" 
                onClick={() => handleDeleteClick(teacher._id)} 
                disabled={!user?.permissions?.delete}
                sx={{ marginRight: 1 }}
              >
                <DeleteIcon />
              </IconButton>

              <IconButton 
                color="default" 
                onClick={() => handleOpenSubjectsDialog(teacher)} 
                disabled={!user?.permissions?.update}
                sx={{ marginRight: 1, color: '#1976d2', '&:hover': { color: '#004ba0' } }}
              >
                <AddIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ padding: '20px', color: '#757575' }}>
            Aucun enseignant trouvé
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>

  <TablePagination
    component="div"
    count={totalCount}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    labelRowsPerPage="Lignes par page"
    rowsPerPageOptions={[5, 10, 25]}
    sx={{ backgroundColor: '#f5f5f5', color: '#004d40' }}
  />
</TableContainer>





        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Modifier Enseignant' : 'Ajouter Enseignant'}</DialogTitle>
        <DialogContent>
          <Card sx={{ backgroundColor: '#f0f0f0', padding: 2 }}>
            <CardContent>
              <TextField
                autoFocus
                margin="dense"
                label="Nom de l'Enseignant"
                type="text"
                fullWidth
                value={currentTeacher.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                required
                sx={{
                  backgroundColor: '#ffffff',
                  '& .MuiInputBase-input': {
                    color: '#333333',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#888888',
                  },
                }}
              />
              

<TextField
    margin="dense"
    label="Téléphone"
    type="text"
    fullWidth
    value={currentTeacher.telephone} // Vérifie ici que c'est bien "téléphone"
    onChange={(e) => handleChange('telephone', e.target.value)} // Doit correspondre à la clé
    required
    sx={{
        backgroundColor: '#ffffff',
        '& .MuiInputBase-input': {
            color: '#333333',
        },
        '& .MuiInputLabel-root': {
            color: '#888888',
        },
    }}
/>







              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={currentTeacher.email}
                onChange={(e) => handleChange('email', e.target.value)}
                sx={{
                  backgroundColor: '#ffffff',
                  '& .MuiInputBase-input': {
                    color: '#333333',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#888888',
                  },
                }}
              />




{/* Champ pour télécharger la photo avec label et bouton */}
<Box sx={{ mt: 2 }}>
  <Typography variant="body1">Photo de l'enseignant</Typography>

  {/* Afficher l'aperçu de l'ancienne photo */}
  {currentTeacher.photo && typeof currentTeacher.photo === 'string' && (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Photo actuelle :
      </Typography>
      <img
        src={`http://localhost:5000/${currentTeacher.photo}`}
        alt={currentTeacher.nom}
        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5%' }}
      />
    </Box>
  )}

  {/* Champ pour uploader une nouvelle photo */}
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setCurrentTeacher({ ...currentTeacher, photo: e.target.files[0] })}
  />
  {currentTeacher.photo && typeof currentTeacher.photo !== 'string' && (
    <Typography variant="body2" sx={{ mt: 1 }}>
      Fichier sélectionné : {currentTeacher.photo.name}
    </Typography>
  )}
</Box>




              <FormControl fullWidth margin="normal" sx={{ backgroundColor: '#ffffff' }}>
                <InputLabel id="education-level-label" sx={{ color: '#888888' }}>
                  Niveau d'Enseignement
                </InputLabel>
                <Select
                  labelId="education-level-label"
                  value={currentTeacher.educationLevel || ''}
                  onChange={(e) => handleChange('educationLevel', e.target.value)}
                  required
                >
                  <MenuItem value="Primaire">Primaire</MenuItem>
                  <MenuItem value="Collège">Collège</MenuItem>
                  <MenuItem value="Lycée">Lycée</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: '#ff5722',
              color: 'white',
              '&:hover': {
                backgroundColor: '#e64a19',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              backgroundColor: '#30b570',
              color: 'white',
              '&:hover': {
                backgroundColor: '#45a049',
              },
            }}
          >
            {editing ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSubjectsDialog} onClose={handleCloseSubjectsDialog}>
        <DialogTitle>Assigner des Matières à {currentTeacher.nom}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Matières</InputLabel>
            <Select
              multiple
              value={selectedSubjects}
              onChange={(e) => setSelectedSubjects(e.target.value)}
              renderValue={(selected) => selected.map((subjectId) => {
                const subject = subjects.find((sub) => sub._id === subjectId);
                return subject ? subject.name : '';
              }).join(', ')}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.name} ({subject.level})
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveSubject(currentTeacher._id, subject._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSubjectsDialog}
            sx={{
              backgroundColor: '#ff5722',
              color: 'white',
              '&:hover': {
                backgroundColor: '#e64a19',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSaveSubjects}
            disabled={!user?.permissions?.update}
            sx={{
              backgroundColor: user?.permissions?.update ? '#4caf50' : '#ccc',
              color: 'white',
              '&:hover': {
                backgroundColor: user?.permissions?.update ? '#388e3c' : '#ccc',
              },
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>


      {/* <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmation de suppression</DialogTitle>
          <DialogContent>Voulez-vous vraiment supprimer cet enseignant ?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button
              onClick={confirmDelete}
              sx={{
                backgroundColor: '#d9534f',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#c9302c',
                },
              }}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog> */}


<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle>Confirmation de suppression</DialogTitle>
  <DialogContent>Voulez-vous vraiment supprimer cet enseignant ?</DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
    <Button
      onClick={confirmDelete}
      sx={{
        backgroundColor: '#d9534f',
        color: 'white',
        '&:hover': {
          backgroundColor: '#c9302c',
        },
      }}
    >
      Supprimer
    </Button>
  </DialogActions>
</Dialog>




<Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: '12px', padding: '20px', width: '600px' } }}>
  <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#004d40', textAlign: 'center' }}>
    {editing ? 'Modifier Enseignant' : 'Ajouter Enseignant'}
  </DialogTitle>
  <DialogContent>
    <Card sx={{ backgroundColor: '#f9f9f9', padding: '20px', boxShadow: 'none', borderRadius: '8px' }}>
      <CardContent>
        {/* Teacher Name */}
        <TextField
          autoFocus
          label="Nom de l'Enseignant"
          type="text"
          fullWidth
          value={currentTeacher.nom}
          onChange={(e) => handleChange('nom', e.target.value)}
          required
          sx={{
            marginBottom: '20px',
            '& .MuiInputBase-input': { color: '#004d40' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#30b570' },
              '&:hover fieldset': { borderColor: '#45a049' },
              '&.Mui-focused fieldset': { borderColor: '#30b570' },
            },
            '& .MuiInputLabel-root': { color: '#004d40' },
          }}
        />

        {/* Phone Number */}
        {!editing && (
          <TextField
            label="Téléphone"
            type="text"
            fullWidth
            value={currentTeacher.telephone}
            onChange={(e) => handleChange('telephone', e.target.value)}
            required
            sx={{
              marginBottom: '20px',
              '& .MuiInputBase-input': { color: '#004d40' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#30b570' },
                '&:hover fieldset': { borderColor: '#45a049' },
                '&.Mui-focused fieldset': { borderColor: '#30b570' },
              },
              '& .MuiInputLabel-root': { color: '#004d40' },
            }}
          />
        )}

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={currentTeacher.email}
          onChange={(e) => handleChange('email', e.target.value)}
          sx={{
            marginBottom: '20px',
            '& .MuiInputBase-input': { color: '#004d40' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#30b570' },
              '&:hover fieldset': { borderColor: '#45a049' },
              '&.Mui-focused fieldset': { borderColor: '#30b570' },
            },
            '& .MuiInputLabel-root': { color: '#004d40' },
          }}
        />

        {/* Upload Photo */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ color: '#004d40', fontWeight: 'bold' }}>Photo de l'enseignant</Typography>
          {currentTeacher.photo && typeof currentTeacher.photo === 'string' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Photo actuelle :</Typography>
              <img
                src={`http://localhost:5000/${currentTeacher.photo}`}
                alt={currentTeacher.nom}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5%' }}
              />
            </Box>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCurrentTeacher({ ...currentTeacher, photo: e.target.files[0] })}
            style={{ marginTop: '10px' }}
          />
          {currentTeacher.photo && typeof currentTeacher.photo !== 'string' && (
            <Typography variant="body2" sx={{ mt: 1, color: '#757575' }}>Fichier sélectionné : {currentTeacher.photo.name}</Typography>
          )}
        </Box>

        {/* Education Level */}
        <FormControl fullWidth margin="normal" sx={{ marginTop: '20px' }}>
          <InputLabel id="education-level-label" sx={{ color: '#004d40' }}>Niveau d'Enseignement</InputLabel>
          <Select
            labelId="education-level-label"
            value={currentTeacher.educationLevel || ''}
            onChange={(e) => handleChange('educationLevel', e.target.value)}
            required
            sx={{
              backgroundColor: '#ffffff',
              '& .MuiSelect-outlined': { color: '#004d40' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#30b570' },
                '&:hover fieldset': { borderColor: '#45a049' },
                '&.Mui-focused fieldset': { borderColor: '#30b570' },
              },
            }}
          >
            <MenuItem value="Primaire">Primaire</MenuItem>
            <MenuItem value="Collège">Collège</MenuItem>
            <MenuItem value="Lycée">Lycée</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  </DialogContent>

  <DialogActions sx={{ padding: '16px' }}>
    <Button
      onClick={handleClose}
      sx={{
        backgroundColor: '#ff5722',
        color: 'white',
        fontWeight: 'bold',
        padding: '8px 16px',
        '&:hover': { backgroundColor: '#e64a19' },
      }}
    >
      Annuler
    </Button>
    <Button
      onClick={handleSave}
      sx={{
        backgroundColor: '#30b570',
        color: 'white',
        fontWeight: 'bold',
        padding: '8px 16px',
        '&:hover': { backgroundColor: '#45a049' },
      }}
    >
      {editing ? 'Mettre à jour' : 'Ajouter'}
    </Button>
  </DialogActions>
</Dialog>







      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TeacherPage;
