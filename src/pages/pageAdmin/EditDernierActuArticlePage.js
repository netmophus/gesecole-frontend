// src/pages/PageAdmin/EditDernierActuArticlePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditDernierActuArticlePage = () => {
  const { id } = useParams(); // Récupère l'ID de l'article depuis l'URL
  const navigate = useNavigate();
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

  // Charger l'article existant
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/admin/dernierActu/${id}`);
        setFormData(response.data); // Remplit le formulaire avec les données existantes
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
      }
    };

    fetchArticle();
  }, [id, apiBaseUrl]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      await axios.put(`${apiBaseUrl}/api/admin/dernierActu/${id}`, formData);
      console.log('Article mis à jour avec succès');
      navigate('/ministere/manage-content'); // Redirige après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
    }
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Mettre à jour l'Article
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Mettre à jour l'Article
        </Button>
      </form>
    </Container>
  );
};

export default EditDernierActuArticlePage;

