
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Box, Card, CardContent, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'; // Importer les icônes de modification et de suppression
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { TablePagination } from '@mui/material';
import { Snackbar } from '@mui/material';
import AverageDisplay from './AverageDisplay'; // Assurez-vous que le chemin est correct

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

  if (!token || !schoolId) {
    console.error("Token ou identifiant d'établissement manquant. Redirection vers la page de connexion.");
    navigate('/login');
    return;
  }

  const fetchClasses = async () => {
    try {
      const classRes = await axios.get(`${apiBaseUrl}/api/classes?establishmentId=${schoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Classes récupérées:', classRes.data);
      setClasses(classRes.data.classes);
    } catch (err) {
      console.error('Erreur lors de la récupération des classes:', err);
    }
  };

  fetchClasses();
}, [navigate, apiBaseUrl]);

// useEffect pour charger les devoirs/compositions une fois la classe sélectionnée
useEffect(() => {
  if (selectedClass) {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const devoirRes = await axios.get(`${apiBaseUrl}/api/devoircompo`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { classId: selectedClass }, // Filtrer par classe
        });
        console.log('Devoirs/Compositions récupérés:', devoirRes.data);
        setDevoirCompos(devoirRes.data);
        setFilteredDevoirCompos(devoirRes.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des devoirs/compositions:', err);
      }
    };

    fetchData();
  }
}, [selectedClass, apiBaseUrl]);

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

  

  // const handleSearchChange = (event) => {
  //   const newSearchTerm = event.target.value.toLowerCase();
  //   setSearchTerm(newSearchTerm);
  
  //   // Appel immédiat de filterDevoirCompos pour mettre à jour filteredDevoirCompos
  //   filterDevoirCompos();
  // };
  

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = devoirCompos.filter(devoir => 
        devoir.student.firstName.toLowerCase().includes(term) ||
        devoir.student.lastName.toLowerCase().includes(term)
    );

    console.log("Données après filtrage : ", filtered); // Vérifiez ici
    setFilteredDevoirCompos(filtered);
};

 
  // const filterDevoirCompos = () => {
  //   const establishmentId = user.schoolId;
  //   const selectedClassId = selectedClass;
  
  //   // Filtrer les devoirs/compositions
  //   const filtered = devoirCompos.filter(devoir =>
  //     devoir.student && // Vérifie si student n'est pas null
  //     devoir.establishmentId === establishmentId && // Vérifie si l'ID de l'établissement correspond
  //     (!selectedClassId || devoir.classId?._id === selectedClassId) && // Vérifie l'ID de la classe
  //     (
  //       devoir.student.firstName.toLowerCase().includes(searchTerm) ||
  //       devoir.student.lastName.toLowerCase().includes(searchTerm)
  //     )
  //   );
  
  //   console.log('Résultats du filtrage avant affectation à filteredDevoirCompos:', filtered);
  
  //   // Mettre à jour l'état avec les résultats filtrés
  //   setFilteredDevoirCompos(filtered);
  //   console.log('État filteredDevoirCompos après mise à jour :', filtered);
  // };
  
  
  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    const filtered = devoirCompos.filter(devoir => devoir.classId && devoir.classId._id === classId);
    setFilteredDevoirCompos(filtered);
  };

  return (
    <Container maxWidth="lg">
      <Card
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          padding: 4,
          mt: 5,
          mb: 5,
          boxShadow: 4,
          borderRadius: '12px',
        }}
      >
        {/* Bouton de retour vers le dashboard */}
        <Box display="flex" justifyContent="flex-start" mb={3}>
          <Button
            variant="contained"
            onClick={() => navigate('/etablissement/dashboardPage')}
            sx={{
              backgroundColor: '#004d40',
              color: '#fff',
              '&:hover': { backgroundColor: '#00332d' },
              borderRadius: 2,
              padding: '10px 20px',
              fontWeight: 'bold',
            }}
          >
            Retour au Dashboard
          </Button>
        </Box>
  
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: '#333', fontWeight: 'bold', mb: 4 }}
          >
            Visualisation des Notes
          </Typography>
  
          {/* Sélecteur de classe */}
          <Box mb={3}>
            <TextField
              select
              label="Sélectionner une Classe"
              value={selectedClass}
              onChange={handleClassChange}
              fullWidth
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            >
              {classes.map((classe) => (
                <MenuItem key={classe._id} value={classe._id}>
                  {classe.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
  
          {/* Conditionnel pour affichage des données */}
          {selectedClass ? (
            <>
              {/* Zone de recherche */}
              <Box mb={3}>
                <TextField
                  label="Rechercher un élève"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ backgroundColor: '#fff', borderRadius: 1 }}
                />
              </Box>
  
              {/* Tableau des notes */}
              <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#004d40' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Année Scolaire</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Élève</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Matière</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Note</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Coefficient</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Semestre</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDevoirCompos
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((devoir) => (
                        <TableRow key={devoir._id} hover>
                          <TableCell>{devoir.academicYear}</TableCell>
                          <TableCell>
                            {`${devoir.student.firstName} ${devoir.student.lastName}`}
                          </TableCell>
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
            </>
          ) : (
            <Typography variant="h6" color="textSecondary" sx={{ mt: 4, textAlign: 'center' }}>
              Veuillez sélectionner une classe pour afficher les devoirs/compositions.
            </Typography>
          )}
        </CardContent>
  
        {/* Snackbar pour affichage des messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
  
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
      </Card>
    </Container>
  );
  

};

export default ViewDevoirComposPage;




