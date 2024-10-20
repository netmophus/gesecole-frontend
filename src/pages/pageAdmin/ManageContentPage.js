// src/pages/PageAdmin/ManageContentPage.js

import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManageContentPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gérer le Contenu
      </Typography>
      <Grid container spacing={3}>
        {/* Lien pour gérer les articles d'actualité */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Dernières Actualités</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleNavigation('/admin/create-dernier-actu')}>
                Créer un nouvel article
              </Button>
              <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 1 }} onClick={() => handleNavigation('/admin/manage-dernier-actu')}>
                Gérer les articles
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Ajoutez d'autres sections de contenu que vous souhaitez gérer */}
      </Grid>
    </Container>
  );
};

export default ManageContentPage;
