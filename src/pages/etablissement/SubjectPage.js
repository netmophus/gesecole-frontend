

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { 
  Container, Typography, Box, Button,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, TablePagination, InputAdornment,
  CircularProgress, Snackbar, Alert, Grid, Card,  
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { AuthContext } from '../../context/AuthContext';
import SubjectForm from '../../components/common/SubjectForm';
import { useNavigate } from 'react-router-dom';

const SubjectPage = () => {
  const navigate = useNavigate(); // Assurez-vous de l'appeler ici
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({ name: '', level: '' });
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useContext(AuthContext);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // État pour gérer l'ouverture/fermeture du dialogue
  const [subjectToDelete, setSubjectToDelete] = useState(null);    // Stocker l'ID de la matière à supprimer
  
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false); // Gérer l'ouverture du dialogue
  const [subjectToToggle, setSubjectToToggle] = useState(null);    // Stocker l'ID et le statut de la matière à activer/désactiver
  
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const fetchSubjects = useCallback(async () => {
   

    try {

      const token = localStorage.getItem('token');
      const establishmentId = localStorage.getItem('schoolId');
  
      if (!establishmentId) {
        console.error("Aucun identifiant d'établissement trouvé");
        return;
      }
      setLoading(true);





      
      const res = await axios.get(`${apiBaseUrl}/api/subjects`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { search: searchTerm, page: page + 1, limit: rowsPerPage }
      });

      setSubjects(res.data.subjects || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error('Erreur lors de la récupération des matières:', err);
      setSnackbar({ open: true, message: 'Erreur lors de la récupération des matières', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user, searchTerm, page, rowsPerPage]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);


  

  const handleSearchChange = debounce((event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  }, 300);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentSubject({ name: '', level: '' });
    setEditing(false);
  };

 
  
  const handleSave = async () => {
    if (!user || !user.token) {
      setSnackbar({ open: true, message: 'Vous devez être connecté pour effectuer cette action', severity: 'error' });
      return;
    }
  
    try {
      const subjectData = { ...currentSubject };
      if (editing) {
        // Modifier une matière
        await axios.put(`${apiBaseUrl}/api/subjects/${subjectData._id}`, subjectData, {
          headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }
        });
        setSnackbar({ open: true, message: 'Matière mise à jour avec succès', severity: 'success' });
      } else {
        // Créer une nouvelle matière
        await axios.post(`${apiBaseUrl}/api/subjects`, subjectData, {
          headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' }
        });
        setSnackbar({ open: true, message: 'Matière créée avec succès', severity: 'success' });
      }
  
      fetchSubjects();
      handleClose();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setSnackbar({ open: true, message: 'Impossible de modifier cette matière car elle est assignée à un ou plusieurs enseignants.', severity: 'error' });
      } else if (err.response && err.response.status === 403) {
        setSnackbar({ open: true, message: 'Vous n\'avez pas la permission de réaliser cette action', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: 'Erreur lors de la sauvegarde de la matière', severity: 'error' });
      }
      console.error('Erreur lors de la sauvegarde de la matière:', err);
    }
  };
  
  const handleEdit = (subject) => {
    setCurrentSubject(subject);
    setEditing(true);
    handleOpen();
  };
 
  const handleDeleteConfirmation = (subjectId) => {
    setSubjectToDelete(subjectId);  // Stocker l'ID de la matière à supprimer
    setDeleteDialogOpen(true);      // Ouvrir le dialogue de confirmation
  };
  

  const confirmDelete = async () => {
    if (subjectToDelete) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.delete(`${apiBaseUrl}/api/subjects/${subjectToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        showSnackbar(response.data.msg, 'success');  // Utilise showSnackbar pour le succès
        fetchSubjects(); // Recharger la liste des matières
      } catch (error) {
        if (error.response && error.response.data && error.response.data.msg) {
          showSnackbar(error.response.data.msg, 'error');  // Utilise showSnackbar pour l'erreur
        } else {
          showSnackbar('Erreur lors de la suppression de la matière.', 'error');
        }
      } finally {
        setDeleteDialogOpen(false);  // Fermer le dialogue après suppression
        setSubjectToDelete(null);    // Réinitialiser l'ID de la matière à supprimer
      }
    }
  };
  
  

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };


  const handleToggleConfirmation = (subjectId, currentStatus) => {
    setSubjectToToggle({ id: subjectId, status: currentStatus });  // Stocker l'ID et le statut
    setToggleDialogOpen(true);  // Ouvrir le dialogue
  };
  
  const confirmToggle = async () => {
    try {
      const token = localStorage.getItem('token');  // Récupérer le token depuis le stockage local
  
      // Assure-toi que tu envoies bien le token dans les en-têtes
      await axios.patch(`${apiBaseUrl}/api/subjects/${subjectToToggle.id}/toggle-active`, 
        {
          isActive: !subjectToToggle.status,  // Changer le statut
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`  // Ajoute le token dans les en-têtes
          }
        }
      );
  
      showSnackbar(`Matière ${!subjectToToggle.status ? 'activée' : 'désactivée'} avec succès`, 'success');
      fetchSubjects();  // Recharger la liste des matières
    } catch (error) {
      // Vérifier si l'erreur est liée à une matière assignée
    if (error.response && error.response.data.msg === 'Impossible de désactiver cette matière car elle est assignée à un ou plusieurs enseignants.') {
      showSnackbar('Cette matière est assignée à un ou plusieurs enseignants et ne peut pas être désactivée.', 'warning');
    } else {
      showSnackbar('Erreur lors du changement de statut de la matière', 'error');
    }
      } finally {
      setToggleDialogOpen(false);  // Fermer le dialogue
      setSubjectToToggle(null);    // Réinitialiser l'ID de la matière à activer/désactiver
    }
  };

  return (
    <Container>
      <Grid container spacing={4}>
        {/* Section gauche: Gestion des matières */}

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



      <Grid item xs={12} md={12}>
        <Card sx={{ backgroundColor: 'rgba(0, 128, 0, 0.1)', padding: 2, margin:'15px', boxShadow: 3 }}> {/* Card avec un fond vert transparent */}
          <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
            <Typography variant="h4">Gestion des Matières</Typography>
            <TextField
              variant="outlined"
              placeholder="Rechercher..."
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

          <Button 
            variant="contained" 
            onClick={handleOpen}
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#004d40',  // Couleur de fond personnalisée
              '&:hover': {
                backgroundColor: '#00332d',  // Couleur de fond lors du survol (hover)
              }
            }}
          >
            Ajouter
          </Button>

           
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (

<TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2, overflow: 'hidden' }}>
  <Table>
    <TableHead sx={{ backgroundColor: '#004d40' }}>
      <TableRow>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Nom</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Niveau</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Année Académique</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Statut</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }} align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {subjects.length > 0 ? (
        subjects.map((subject) => (
          <TableRow key={subject._id} sx={{ '&:hover': { backgroundColor: '#e0f7fa' } }}>
            <TableCell sx={{ padding: '10px', fontSize: '1rem' }}>{subject.name}</TableCell>
            <TableCell sx={{ padding: '10px', fontSize: '1rem' }}>{subject.level}</TableCell>
            <TableCell sx={{ padding: '10px', fontSize: '1rem' }}>
              {subject.academicYear 
                ? `${subject.academicYear.startYear}-${subject.academicYear.endYear}` 
                : 'Non définie'}
            </TableCell>
            <TableCell sx={{ padding: '10px', fontSize: '1rem' }}>
              {subject.isActive ? 'Activée' : 'Désactivée'}
            </TableCell>
            <TableCell align="right" sx={{ padding: '10px' }}>
              {subject.isActive ? (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#c62828' }, borderRadius: 2 }}
                  onClick={() => handleToggleConfirmation(subject._id, true)}
                >
                  Désactiver
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#43a047', '&:hover': { backgroundColor: '#388e3c' }, borderRadius: 2 }}
                  onClick={() => handleToggleConfirmation(subject._id, false)}
                >
                  Activer
                </Button>
              )}
              <IconButton 
                color="primary" 
                onClick={() => handleEdit(subject)} 
                disabled={subject.isAssigned}
                sx={{ marginLeft: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                color="error" 
                onClick={() => handleDeleteConfirmation(subject._id)} 
                disabled={subject.isAssigned}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ padding: '20px', fontSize: '1rem', fontWeight: 'bold', color: '#757575' }}>
            Aucune matière trouvée
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
    sx={{ backgroundColor: '#e0f7fa', color: '#004d40', fontWeight: 'bold' }}
  />
</TableContainer>

          
          
          )}
        </Card>
      </Grid>




      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Modifier la Matière' : 'Ajouter une Matière'}</DialogTitle>
        <DialogContent>
          <SubjectForm onSubmit={handleSave} subjectData={currentSubject} setSubjectData={setCurrentSubject} />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="secondary">Annuler</Button>
        </DialogActions> */}
        <DialogActions>
  <Button 
    onClick={handleClose} 
    variant="outlined"  // Style du bouton en outlined
    sx={{
      color: '#004d40',  // Couleur du texte
      borderColor: '#004d40',  // Couleur de la bordure
      '&:hover': {
        backgroundColor: '#e0f7fa',  // Couleur de fond au survol
        borderColor: '#004d40',  // Maintien de la couleur de la bordure
      },
      borderRadius: 2,  // Coins arrondis pour un effet esthétique
      padding: '6px 16px',  // Espacement interne du bouton
    }}
  >
    Annuler
  </Button>
</DialogActions>

      </Dialog>


      <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}  // Fermer le dialogue si on annule
>
  <DialogTitle>Confirmer la suppression</DialogTitle>
  <DialogContent>
    <Typography>Êtes-vous sûr de vouloir supprimer cette matière ?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
      Annuler
    </Button>
    <Button onClick={confirmDelete} color="secondary">
      Supprimer
    </Button>
  </DialogActions>
      </Dialog>





<Dialog 
  open={toggleDialogOpen} 
  onClose={() => setToggleDialogOpen(false)}
  PaperProps={{
    sx: {
      background: 'linear-gradient(145deg, #ffffff, #e0f7fa)',  // Soft gradient background
      padding: '20px',
      borderRadius: '15px',  // Rounded corners for the modal
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',  // Soft shadow for a 3D effect
    }
  }}
>
  <DialogTitle sx={{ 
    fontWeight: 'bold', 
    color: '#004d40',  // Dark green title for emphasis
    textAlign: 'center'  // Centered title
  }}>
    Confirmer le changement de statut
  </DialogTitle>
  
  <DialogContent>
    <Typography 
      sx={{ 
        color: '#004d40', 
        fontWeight: '500', 
        textAlign: 'center', 
        padding: '10px 0' 
      }}
    >
      Êtes-vous sûr de vouloir {subjectToToggle?.status ? 'désactiver' : 'activer'} cette matière ?
    </Typography>
  </DialogContent>
  
  <DialogActions sx={{ justifyContent: 'center' }}>
    <Button 
      onClick={() => setToggleDialogOpen(false)} 
      sx={{ 
        backgroundColor: '#e0e0e0', 
        color: '#004d40', 
        fontWeight: '600', 
        '&:hover': { backgroundColor: '#bdbdbd' } 
      }}
    >
      Annuler
    </Button>
    <Button 
      onClick={confirmToggle} 
      sx={{ 
        backgroundColor: '#d32f2f', 
        color: '#fff', 
        fontWeight: '600', 
        '&:hover': { backgroundColor: '#b71c1c' } 
      }}
    >
      Confirmer
    </Button>
  </DialogActions>
</Dialog>



      <Snackbar 
      open={snackbar.open} 
      autoHideDuration={6000} 
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>

    </Container>
  );
};

export default SubjectPage;
