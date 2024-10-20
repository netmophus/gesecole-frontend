// src/pages/AdminHomePage.js
import React, { useState, useEffect } from 'react';
import {  Container, TextField, Button, Typography, Grid } from '@mui/material';
import axios from 'axios';

const AdminHomePage = () => {
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceContent, setResourceContent] = useState('');
  const [adminToolsTitle, setAdminToolsTitle] = useState('');
  const [adminToolsContent, setAdminToolsContent] = useState('');

  useEffect(() => {
    // Fetch existing content from server (this assumes you have API endpoints set up)
    axios.get('/api/homepage-content')
      .then(response => {
        const content = response.data;
        setNewsTitle(content.news.title);
        setNewsContent(content.news.content);
        setResourceTitle(content.resources.title);
        setResourceContent(content.resources.content);
        setAdminToolsTitle(content.adminTools.title);
        setAdminToolsContent(content.adminTools.content);
      })
      .catch(error => console.error('Error fetching homepage content:', error));
  }, []);

  const handleSave = () => {
    const updatedContent = {
      news: { title: newsTitle, content: newsContent },
      resources: { title: resourceTitle, content: resourceContent },
      adminTools: { title: adminToolsTitle, content: adminToolsContent },
    };

    axios.post('/api/homepage-content', updatedContent)
      .then(() => alert('Contenu mis à jour avec succès !'))
      .catch(error => console.error('Error updating homepage content:', error));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Administration de la Page d'Accueil</Typography>
      <Grid container spacing={3}>
        {/* Section pour modifier les Actualités */}
        <Grid item xs={12}>
          <Typography variant="h6">Modifier les Actualités</Typography>
          <TextField
            label="Titre des Actualités"
            fullWidth
            variant="outlined"
            value={newsTitle}
            onChange={(e) => setNewsTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contenu des Actualités"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newsContent}
            onChange={(e) => setNewsContent(e.target.value)}
          />
        </Grid>

        {/* Section pour modifier les Ressources Pédagogiques */}
        <Grid item xs={12}>
          <Typography variant="h6">Modifier les Ressources Pédagogiques</Typography>
          <TextField
            label="Titre des Ressources"
            fullWidth
            variant="outlined"
            value={resourceTitle}
            onChange={(e) => setResourceTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contenu des Ressources"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={resourceContent}
            onChange={(e) => setResourceContent(e.target.value)}
          />
        </Grid>

        {/* Section pour modifier la Gestion Administrative */}
        <Grid item xs={12}>
          <Typography variant="h6">Modifier la Gestion Administrative</Typography>
          <TextField
            label="Titre de la Gestion Administrative"
            fullWidth
            variant="outlined"
            value={adminToolsTitle}
            onChange={(e) => setAdminToolsTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contenu de la Gestion Administrative"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={adminToolsContent}
            onChange={(e) => setAdminToolsContent(e.target.value)}
          />
        </Grid>
      </Grid>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSave} 
        sx={{ mt: 3 }}
      >
        Enregistrer les Modifications
      </Button>
    </Container>
  );
};

export default AdminHomePage;
