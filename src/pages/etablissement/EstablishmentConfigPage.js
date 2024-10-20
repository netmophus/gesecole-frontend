import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Card, CardContent, Grid, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const EstablishmentConfigPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    promoterName: '',
    yearOfCreation: '',
    authorization: '',
    address: '',
    codeRegion: '',
    codeEtablissement: '',
    region: '',
    maxStudents: '',
    contactEmail: '',
    phoneNumber: '',
    academicYear: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openYearModal, setOpenYearModal] = useState(false); // Modal pour la création d'année académique
  const [availableYears, setAvailableYears] = useState([]); // Liste des années disponibles
  const [newAcademicYear, setNewAcademicYear] = useState(''); // Nouvelle année académique
  const [noAcademicYearAlert, setNoAcademicYearAlert] = useState(false); // Alerte si aucune année n'est disponible

  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        console.log("Requête envoyée pour récupérer l'année académique active...");
  
        const res = await fetch(`${apiBaseUrl}/api/academic-years/active`);
        const data = await res.json();
  
        console.log("Réponse du backend :", data); // Log la réponse reçue du backend
  
        if (!data._id) {
          console.log("Aucune année académique active trouvée");
          setNoAcademicYearAlert(true); // Active l'alerte s'il n'y a pas d'année académique active
        } else {
          const academicYearFull = `${data.startYear} - ${data.endYear}`; // Concaténer startYear et endYear
          console.log("Année académique active trouvée:", academicYearFull);
          setNoAcademicYearAlert(false);
          setAvailableYears([data]); // Met à jour les années disponibles
          setFormData((prevData) => ({ ...prevData, academicYear: data._id })); // Met à jour l'année académique dans le formulaire
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des années académiques:', err);
      }
    };
  
    fetchAcademicYears();
  }, [apiBaseUrl]);
  

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gérer le changement d'année académique
  
  const handleYearChange = (e) => {
    const selectedYearId = e.target.value; // On récupère l'ID de l'année sélectionnée
    setFormData({ ...formData, academicYear: selectedYearId });
  };
  

  // Gérer la création d'une nouvelle année académique
  const handleCreateAcademicYear = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/academicYears`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year: newAcademicYear, isActive: true })  // Créer et activer la nouvelle année
      });
  
      const data = await res.json();
      if (res.ok) {
        setAvailableYears([...availableYears, data]);  // Ajouter la nouvelle année
        setFormData({ ...formData, academicYear: data._id });  // Sélectionner automatiquement l'année créée
        setOpenYearModal(false);  // Fermer le modal
        setSnackbarMessage('Nouvelle année académique créée avec succès!');
        setOpenSnackbar(true);
        setNoAcademicYearAlert(false);  // Masquer l'alerte après création
      } else {
        setSnackbarMessage(data.msg || 'Erreur lors de la création de l\'année académique');
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error('Erreur serveur lors de la création de l\'année académique:', err);
      setSnackbarMessage('Erreur serveur');
      setOpenSnackbar(true);
    }
  };
  

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Données soumises (frontend) :', formData);
  
    if (!formData.academicYear) {
      setSnackbarMessage('Veuillez sélectionner une année académique.');
      setOpenSnackbar(true);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/establishment/configure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),  // Assurez-vous que academicYear contient un ID valide
      });
  
      const data = await res.json();
      console.log('Réponse du serveur (frontend) :', data);
  
      if (res.ok) {
        setSnackbarMessage('Établissement configuré avec succès!');
        setOpenSnackbar(true);
        navigate('/etablissement/DashboardPage', { replace: true });
      } else {
        setSnackbarMessage(data.msg || 'Erreur lors de la configuration de l\'établissement');
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error('Erreur serveur lors de la configuration (frontend) :', err);
      setSnackbarMessage('Erreur serveur');
      setOpenSnackbar(true);
    }
  };
  

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ backgroundColor: '#e3f2fd', boxShadow: 3, padding: '20px', borderRadius: '10px' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#004d40' }}>
            Configurer l'Établissement
          </Typography>

          {noAcademicYearAlert && (
            <Card sx={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '8px', boxShadow: 3, mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#ff9800' }}>
                Aucune année académique active trouvée.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Vous devez créer une nouvelle année académique avant de pouvoir configurer l'établissement.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ backgroundColor: '#ff9800' }}
                onClick={() => setOpenYearModal(true)}
              >
                Créer une Année Académique
              </Button>
            </Card>
          )}

    



          <form onSubmit={handleSubmit}>
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <TextField
        label="Nom de l'Établissement"
        name="name"
        variant="outlined"
        fullWidth
        required
        value={formData.name}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px', marginBottom:'25px' }}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Nom du Promoteur"
        name="promoterName"
        variant="outlined"
        fullWidth
        required
        value={formData.promoterName}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        label="Code de la Région"
        name="codeRegion"
        variant="outlined"
        fullWidth
        required
        value={formData.codeRegion}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        label="Code de l'Établissement"
        name="codeEtablissement"
        variant="outlined"
        fullWidth
        required
        value={formData.codeEtablissement}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Région"
        name="region"
        variant="outlined"
        fullWidth
        required
        value={formData.region}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Adresse"
        name="address"
        variant="outlined"
        fullWidth
        required
        value={formData.address}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        label="Année de Création"
        name="yearOfCreation"
        type="number"
        variant="outlined"
        fullWidth
        required
        value={formData.yearOfCreation}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        label="Autorisation d'Exercice"
        name="authorization"
        variant="outlined"
        fullWidth
        required
        value={formData.authorization}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        label="Nombre maximum d'étudiants"
        name="maxStudents"
        type="number"
        variant="outlined"
        fullWidth
        value={formData.maxStudents}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        label="Email de contact"
        name="contactEmail"
        type="email"
        variant="outlined"
        fullWidth
        value={formData.contactEmail}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        label="Numéro de téléphone"
        name="phoneNumber"
        type="tel"
        variant="outlined"
        fullWidth
        value={formData.phoneNumber}
        onChange={handleChange}
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        select
        label="Année Scolaire"
        name="academicYear"
        value={formData.academicYear || ''}
        onChange={handleYearChange}
        fullWidth
        required
        sx={{ mb: 3, backgroundColor: '#ffffff', borderRadius: '8px' }}
        SelectProps={{ native: true }}
      >
        {availableYears.length > 0 ? (
          availableYears.map((year) => (
            <option key={year._id} value={year._id}>
              {year.startYear} - {year.endYear}
            </option>
          ))
        ) : (
          <option value="">Aucune année académique disponible</option>
        )}
      </TextField>
    </Grid>

    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: '#1ABC9C',
          color: '#fff',
          padding: '10px 20px',
          fontSize: '1.2rem',
          borderRadius: '8px',
          '&:hover': { backgroundColor: '#16A085' }
        }}
      >
        Configurer
      </Button>
    </Grid>
  </Grid>
</form>






        </CardContent>
      </Card>

      {/* Dialog for creating a new academic year */}
      <Dialog open={openYearModal} onClose={() => setOpenYearModal(false)}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#ff9800' }}>Créer une Année Académique</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Année Académique (Ex: 2023-2024)"
            fullWidth
            value={newAcademicYear}
            onChange={(e) => setNewAcademicYear(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" sx={{ color: '#616161' }}>
            Veuillez respecter le format de l'année académique, par exemple : 2023-2024.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenYearModal(false)} color="secondary">Annuler</Button>
          <Button onClick={handleCreateAcademicYear} color="primary" sx={{ backgroundColor: '#ff9800' }}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarMessage.includes('Erreur') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EstablishmentConfigPage;













