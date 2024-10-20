
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Box, Card, CardContent, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'; // Importer les icônes de modification et de suppression
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { TablePagination } from '@mui/material';
import { Snackbar } from '@mui/material';
const ViewDevoirComposPage = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const [devoirCompos, setDevoirCompos] = useState([]);
  const [filteredDevoirCompos, setFilteredDevoirCompos] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedDevoir, setSelectedDevoir] = useState(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Recherche states
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const apiBaseUrl = process.env.REACT_APP_API_URL;
 
 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Rediriger vers la page de login ou afficher un message
        navigate('/login');
    }
}, [navigate]);

useEffect(() => {
  const token = localStorage.getItem('token');
  const schoolId = localStorage.getItem('schoolId');

  // Vérifiez si le token et l'identifiant de l'école sont présents
  if (!token || !schoolId) {
    console.error("Token ou identifiant d'établissement manquant. Redirection vers la page de connexion.");
    navigate('/login');
    return;
  }

  const fetchData = async () => {
    try {
      const devoirRes = await axios.get(`${apiBaseUrl}/api/devoircompo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Devoirs/Compositions récupérés:', devoirRes.data);
      setDevoirCompos(devoirRes.data);
      setFilteredDevoirCompos(devoirRes.data);

      const classRes = await axios.get(`${apiBaseUrl}/api/classes?establishmentId=${schoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Classes récupérées:', classRes.data);
      setClasses(classRes.data.classes);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
    }
  };

  fetchData();
}, [navigate, apiBaseUrl]);


const handleSaveEdit = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("Token non trouvé. Redirection vers la page de connexion.");
    navigate('/login');
    return;
  }

  try {
    await axios.put(`${apiBaseUrl}/api/devoircompo/${selectedDevoir._id}`, selectedDevoir, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSnackbarMessage('Devoir/Composition modifié avec succès');
    setSnackbarOpen(true);
    setOpenEditModal(false);
    setFilteredDevoirCompos(
      filteredDevoirCompos.map(devoir => (devoir._id === selectedDevoir._id ? selectedDevoir : devoir))
    );
  } catch (err) {
    setSnackbarMessage('Erreur lors de la modification');
    setSnackbarOpen(true);
    console.error('Erreur lors de la modification du devoir/composition:', err);
  }
};


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  


    const handleEdit = (devoir) => {
    setSelectedDevoir(devoir); // Passer l'objet complet pour l'édition
    setOpenEditModal(true); // Ouvrir le modal
  };


  const handleDelete = async (devoirId) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error("Token non trouvé. Redirection vers la page de connexion.");
      navigate('/login');
      return;
    }
  
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devoir/composition ?')) {
      try {
        const response = await axios.delete(`${apiBaseUrl}/api/devoircompo/${devoirId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Réponse de la suppression:', response.data);
        setFilteredDevoirCompos(filteredDevoirCompos.filter(devoir => devoir._id !== devoirId));
        setSnackbarMessage('Devoir/Composition supprimé avec succès');
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Erreur lors de la suppression du devoir/composition:', err.response?.data || err.message);
        setSnackbarMessage('Erreur lors de la suppression');
        setSnackbarOpen(true);
      }
    }
  };
  


  // Gestion de la pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gestion de la recherche
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    filterDevoirCompos();
  };


  const filterDevoirCompos = () => {
    const establishmentId = user.schoolId;
    const selectedClassId = selectedClass;
  
    const filtered = devoirCompos.filter(devoir =>
      devoir.student && // Vérifie si student n'est pas null
      devoir.establishmentId === establishmentId && // Vérifie si l'ID de l'établissement correspond
      (!selectedClassId || devoir.classId?._id === selectedClassId) && // Vérifie l'ID de la classe
      (
        devoir.student.firstName.toLowerCase().includes(searchTerm) ||
        devoir.student.lastName.toLowerCase().includes(searchTerm)
      )
    );
  
    console.log('Devoirs filtrés:', filtered); // Ajout d'un log pour vérifier les résultats du filtrage
    setFilteredDevoirCompos(filtered);
  };
  

  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    const filtered = devoirCompos.filter(devoir => devoir.classId && devoir.classId._id === classId);
    setFilteredDevoirCompos(filtered);
  };

  return (
    <Container maxWidth="lg">
      <Card sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', padding: 3, mt:4, mb:4, boxShadow: 3 }}>

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

        <CardContent>
          <Typography variant="h4" gutterBottom>Visualiser les Notes</Typography>

          {/* Zone de recherche */}
          <TextField
            label="Rechercher par élève"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 3 }}
          />

          {/* Filtre par classe */}
          <TextField
            select
            label="Classe"
            value={selectedClass}
            onChange={handleClassChange}
            fullWidth
            sx={{ mb: 3 }}
          >
            {classes.map((classe) => (
              <MenuItem key={classe._id} value={classe._id}>
                {classe.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Tableau des notes */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>Année Scolaire</TableCell> {/* Nouvelle colonne */}
                  <TableCell>Élève</TableCell>
                  <TableCell>Matière</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Coefficient</TableCell>
                  <TableCell>Semestre</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {filteredDevoirCompos
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((devoir) => (
    <TableRow key={devoir._id}>
      <TableCell>{devoir.academicYear}</TableCell>
      <TableCell>{devoir.student.firstName} {devoir.student.lastName}</TableCell>
      <TableCell>{devoir.subject?.name || 'Non spécifiée'}</TableCell>
      <TableCell>{devoir.type}</TableCell>
      <TableCell>{devoir.note}</TableCell>
      <TableCell>{devoir.coefficient || 'Non défini'}</TableCell>
      <TableCell>{devoir.semester}</TableCell>
      <TableCell>
        <IconButton color="primary" onClick={() => handleEdit(devoir)}>
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => handleDelete(devoir._id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}

              </TableBody>
            </Table>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredDevoirCompos.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </CardContent>
        <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={handleCloseSnackbar}
  message={snackbarMessage}
/>

      </Card>

      {/* Modal d'édition */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Modifier le Devoir/Composition</DialogTitle>
        <DialogContent>
          {selectedDevoir && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                select
                label="Type"
                value={selectedDevoir.type}
                onChange={(e) => setSelectedDevoir({ ...selectedDevoir, type: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              >
                <MenuItem value="Devoir 1">Devoir 1</MenuItem>
                <MenuItem value="Devoir 2">Devoir 2</MenuItem>
                <MenuItem value="Composition">Composition</MenuItem>
              </TextField>

              <TextField
                label="Note"
                type="number"
                value={selectedDevoir.note}
                onChange={(e) => setSelectedDevoir({ ...selectedDevoir, note: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="Coefficient"
                type="number"
                value={selectedDevoir.coefficient || ''}
                onChange={(e) => setSelectedDevoir({ ...selectedDevoir, coefficient: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="secondary">Annuler</Button>
          <Button onClick={handleSaveEdit} color="primary">Sauvegarder</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewDevoirComposPage;
