import React, { useState } from 'react';
import { TextField, Button, Box,Snackbar, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const NewsForm = ({ onSuccess }) => {
  const [titlePage, setTitlePage] = useState('');
  //const [sectionCards, setSectionCards] = useState([]);

  const [titleCard, setTitleCard] = useState('');
  const [bodyCard, setBodyCard] = useState('');
  const [btnCard, setBtnCard] = useState('');
  const [error, setError] = useState('');
 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'
  
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  
  const validateForm = () => {
    if (!titlePage) {
      return 'Le titre de la page est obligatoire.';
    }
    if (titlePage.length < 5 || titlePage.length > 100) {
      return 'Le titre de la page doit comporter entre 5 et 100 caractères.';
    }
    if (!titleCard || !bodyCard || !btnCard) {
      return 'Tous les champs sont obligatoires.';
    }
    if (titleCard.length < 5 || titleCard.length > 100) {
      return 'Le titre de la carte doit comporter entre 5 et 100 caractères.';
    }
    if (bodyCard.length < 20) {
      return 'Le contenu de la carte doit comporter au moins 20 caractères.';
    }
    return null; // Pas d'erreur
};

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation du formulaire
    const validationError = validateForm();


    if (validationError) {
      setError(validationError);
      return; // Arrête la soumission si la validation échoue
    }
  
    try {
      // Vérifier si le titlePage existe déjà
      const response = await axios.get(`${apiBaseUrl}/api/section-cards`);
      const existingCard = response.data.find((card) => card.titlePage === titlePage);
  
      if (existingCard) {
        setError('Le titre de la page existe déjà. Veuillez en choisir un autre.');
        handleSnackbarOpen('Le titre de la page existe déjà.', 'error');
        return; // Stoppe le processus si le titre existe déjà
      }
  
      const newCard = {
        titlePage, // Ajoute titlePage ici
        titleCard,
        bodyCard,
        btnCard,
      };
  
      const token = localStorage.getItem('token');
      await axios.post(
        `${apiBaseUrl}/api/section-cards`, 
        newCard, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      handleSnackbarOpen('Carte créée avec succès !', 'success');
      setTitlePage('');
      setTitleCard('');
      setBodyCard('');
      setBtnCard('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la création.');
      handleSnackbarOpen('Erreur lors de la création de la carte.', 'error');
    }
  };
  
  const handleSnackbarOpen = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  
  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Créer une nouvelle carte d'actualité
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>

        <TextField
          label="Titre de la carte"
          variant="outlined"
          fullWidth
          value={titleCard}
          onChange={(e) => setTitleCard(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contenu de la carte"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={bodyCard}
          onChange={(e) => setBodyCard(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Texte du bouton"
          variant="outlined"
          fullWidth
          value={btnCard}
          onChange={(e) => setBtnCard(e.target.value)}
          sx={{ mb: 2 }}
        />
 <TextField
  label="Titre de la page"
  variant="outlined"
  fullWidth
  value={titlePage}
  onChange={(e) => setTitlePage(e.target.value)}
  sx={{ mb: 2 }}
/>


        <Button type="submit" variant="contained" color="primary" fullWidth>
          Créer la carte
        </Button>
      </form>


      <Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>

</Box>
  );
};

export default NewsForm;
