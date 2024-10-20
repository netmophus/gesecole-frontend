

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

const CreateDernierActuArticlePage = () => {
  // État local pour gérer les champs du formulaire
  const [formData, setFormData] = useState({
    titleCard: '',
    bodyCard: '',
    boutonCard: '',
    titreArticles: '',
    bodyArticle: '',
    imageArticle: '',
    videoArticle: '',
  });
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page par défaut du formulaire

    // Vérifier la présence du token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant');
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/admin/dernierActu`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Article créé avec succès:', response.data);
      // Réinitialiser le formulaire après soumission
      setFormData({
        titleCard: '',
        bodyCard: '',
        boutonCard: '',
        titreArticles: '',
        bodyArticle: '',
        imageArticle: '',
        videoArticle: '',
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
    }
  };

  // Fonction pour gérer le changement de valeur des champs de formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Créer un Nouvel Article
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Titre de la Carte"
          name="titleCard"
          value={formData.titleCard}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Contenu de la Carte"
          name="bodyCard"
          value={formData.bodyCard}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Bouton de la Carte"
          name="boutonCard"
          value={formData.boutonCard}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Titre de l'Article"
          name="titreArticles"
          value={formData.titreArticles}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Contenu de l'Article"
          name="bodyArticle"
          value={formData.bodyArticle}
          onChange={handleChange}
          fullWidth
          multiline
          rows={6}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="URL de l'Image"
          name="imageArticle"
          value={formData.imageArticle}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="URL de la Vidéo"
          name="videoArticle"
          value={formData.videoArticle}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Créer l'Article
        </Button>
      </form>
    </Container>
  );
};

export default CreateDernierActuArticlePage;
