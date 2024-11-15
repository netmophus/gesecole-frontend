

import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Grid, Card, CardContent, Typography, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
//import { AuthContext } from '../../context/AuthContext';

const AcademicYearPage = () => {


const [years, setYears] = useState([]); // Stocke les années académiques
const [newYear, setNewYear] = useState(''); // Stocke la nouvelle année académique
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // État du Snackbar
const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // État du dialogue de confirmation
const [selectedYearId, setSelectedYearId] = useState(null); // ID de l'année à activer/désactiver
const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // État du dialogue de suppression
const [yearToDelete, setYearToDelete] = useState(null); // ID de l'année à supprimer
const apiBaseUrl = process.env.REACT_APP_API_URL; // URL de l'API




const fetchAcademicYears = async (token) => {
  try {
    const res = await axios.get(`${apiBaseUrl}/api/academic-years`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setYears(res.data); // Met à jour les années académiques
  } catch (error) {
    console.error('Erreur lors de la récupération des années académiques:', error);
    setSnackbar({ open: true, message: 'Erreur lors du chargement des années académiques.', severity: 'error' });
  }
};



useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchAcademicYears(token);
  } else {
    console.error('Token non trouvé. Veuillez vous connecter.');
    setSnackbar({ open: true, message: 'Veuillez vous connecter pour continuer.', severity: 'error' });
  }
}, []);


const handleCreateYear = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setSnackbar({ open: true, message: 'Veuillez vous connecter pour continuer.', severity: 'error' });
    return;
  }

  try {
    await axios.post(`${apiBaseUrl}/api/academic-years`, { year: newYear, isActive: true }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSnackbar({ open: true, message: 'Année académique créée avec succès.', severity: 'success' });
    setNewYear('');
    fetchAcademicYears(token); // Rafraîchir la liste des années
  } catch (error) {
    console.error('Erreur lors de la création de l\'année académique:', error);
    const errorMessage = error.response?.data?.msg || 'Erreur lors de la création de l\'année académique.';
    setSnackbar({ open: true, message: errorMessage, severity: 'error' });
  }
};


const handleOpenConfirmDialog = (yearId) => {
  setSelectedYearId(yearId);
  setOpenConfirmDialog(true);
};


const handleToggleActive = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setSnackbar({ open: true, message: 'Veuillez vous connecter pour continuer.', severity: 'error' });
    return;
  }

  try {
    await axios.patch(`${apiBaseUrl}/api/academic-years/${selectedYearId}/toggle-active`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAcademicYears(token); // Rafraîchir la liste des années
    setOpenConfirmDialog(false);
    setSnackbar({ open: true, message: 'Statut de l\'année mis à jour avec succès.', severity: 'success' });
  } catch (error) {
    const errorMessage = error.response?.data?.msg || 'Erreur lors de la mise à jour de l\'année académique.';
    setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    setOpenConfirmDialog(false);
  }
};


const handleOpenDeleteDialog = (yearId) => {
  setYearToDelete(yearId);
  setOpenDeleteDialog(true);
};


const handleDeleteYear = async (yearId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    setSnackbar({ open: true, message: 'Veuillez vous connecter pour continuer.', severity: 'error' });
    return;
  }

  try {
    await axios.delete(`${apiBaseUrl}/api/academic-years/${yearId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSnackbar({ open: true, message: 'Année académique supprimée avec succès.', severity: 'success' });
    fetchAcademicYears(token); // Rafraîchir la liste des années après suppression
    setOpenDeleteDialog(false);
  } catch (error) {
    const errorMessage = error.response?.data?.msg || 'Erreur lors de la suppression de l\'année académique.';
    setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    setOpenDeleteDialog(false);
  }
};




return (
  <Container maxWidth="md" sx={{ mb: 4 }}>
    <Typography variant="h4" align="center" sx={{ mt: 4, mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
      Gestion des Années Académiques
    </Typography>

    <Card sx={{ backgroundColor: '#f3e5f5', boxShadow: 3, mb: 4, marginTop: '25px' }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Créer une Nouvelle Année Académique
        </Typography>
        <TextField
          label="Nouvelle Année Académique (ex: 2023-2024)"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleCreateYear}
          sx={{ backgroundColor: '#4caf50', color: '#fff' }}
        >
          Créer Année Académique
        </Button>

    

      </CardContent>
    </Card>

    {/* Liste des années académiques sous forme de cartes */}
    <Grid container spacing={2} sx={{ mt: 4 }}>
      {Array.isArray(years) && years.length > 0 ? (
        years.map((year) => (
          <Grid item xs={12} sm={6} md={4} key={year._id}>
            <Card sx={{
              backgroundColor: year.isActive ? '#e8f5e9' : '#ffebee',
              boxShadow: 3,
              transition: 'background-color 0.3s ease',
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {year.startYear}-{year.endYear}
                </Typography>
                <Typography variant="body2" color={year.isActive ? 'green' : 'red'}>
                  {year.isActive ? 'Active' : 'Inactive'}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenConfirmDialog(year._id)}
                  sx={{ mt: 2, mr:1 }}
                  color={year.isActive ? 'secondary' : 'primary'}
                >
                  {year.isActive ? 'Désactiver' : 'Activer'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => handleOpenDeleteDialog(year._id)}
                  sx={{ mt: 2  }}
                  color="error"
                >
                  Supprimer
                </Button>

              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          Aucune année académique disponible.
        </Typography>
      )}
    </Grid>

    {/* Snackbar pour les notifications */}
    <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
      <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>

    {/* Fenêtre de confirmation pour l'activation/désactivation */}
    <Dialog
      open={openConfirmDialog}
      onClose={() => setOpenConfirmDialog(false)}
    >
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <Typography>Êtes-vous sûr de vouloir changer l'état de cette année académique ?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">Annuler</Button>
        <Button onClick={handleToggleActive} color="primary">Confirmer</Button>
      </DialogActions>
    </Dialog>


    <Dialog
      open={openDeleteDialog}
      onClose={() => setOpenDeleteDialog(false)}
    >
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <Typography>Êtes-vous sûr de vouloir supprimer cette année académique ?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">Annuler</Button>
        <Button onClick={() => handleDeleteYear(yearToDelete)} color="primary">Confirmer</Button>
      </DialogActions>
    </Dialog>

  </Container>
);
























<Snackbar
  open={snackbar.open}
  autoHideDuration={6000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.severity}
  >
    {snackbar.message}
  </Alert>
</Snackbar>




};

export default AcademicYearPage;