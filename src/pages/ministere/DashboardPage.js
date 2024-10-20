

// src/pages/ministere/DashBoardPage.js
import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Button } from '@mui/material';
import Sidebar from '../../components/Admin/Sidebar'; // Assurez-vous que le chemin est correct

const DashBoardPage = () => {
  // État pour gérer l'ouverture de la sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Fonction pour ouvrir/fermer la sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Données statiques
  const statistics = {
    totalSchools: 1500,
    totalTeachers: 12000,
    totalStudents: 250000,
    totalRegions: 8,
    passRate: '78%',
    dropOutRate: '5%',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar open={isSidebarOpen} onClose={toggleSidebar} />

      {/* Contenu principal */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Button variant="contained" onClick={toggleSidebar} sx={{ mb: 2 }}>
          {isSidebarOpen ? 'Fermer le Menu' : 'Ouvrir le Menu'}
        </Button>

        <Typography variant="h4" gutterBottom>
          Tableau de Bord du Ministère
        </Typography>

        <Grid container spacing={3}>
          {/* Statistique : Total des Établissements */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Total des Établissements
              </Typography>
              <Typography variant="h4">{statistics.totalSchools}</Typography>
            </Paper>
          </Grid>

          {/* Statistique : Total des Enseignants */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Total des Enseignants
              </Typography>
              <Typography variant="h4">{statistics.totalTeachers}</Typography>
            </Paper>
          </Grid>

          {/* Statistique : Total des Élèves */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Total des Élèves
              </Typography>
              <Typography variant="h4">{statistics.totalStudents}</Typography>
            </Paper>
          </Grid>

          {/* Statistique : Total des Régions */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Total des Régions
              </Typography>
              <Typography variant="h4">{statistics.totalRegions}</Typography>
            </Paper>
          </Grid>

          {/* Statistique : Taux de Réussite */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Taux de Réussite
              </Typography>
              <Typography variant="h4">{statistics.passRate}</Typography>
            </Paper>
          </Grid>

          {/* Statistique : Taux d'Abandon */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 150,
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Taux d'Abandon
              </Typography>
              <Typography variant="h4">{statistics.dropOutRate}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Autres Informations
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body1">
              Cette section peut être utilisée pour afficher d'autres informations pertinentes à l'échelle nationale, telles que des graphiques, des rapports ou des actualités importantes pour le ministère.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default DashBoardPage;



