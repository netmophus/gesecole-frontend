import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container, Grid, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DashboardPageCFEPD = () => {
  const navigate = useNavigate();

  // Redirection vers la page d'inscription CFEPD
  const goToInscriptionCFEPD = () => {
    navigate('/inscription-cfepd');
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login-cfepd');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
            Tableau de Bord Inscription CFEPD
          </Typography>
          {/* Bouton de déconnexion */}
          <Button variant="contained" sx={{ bgcolor: '#FF0000' }} onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
        
        {/* Sections principales du tableau de bord CFEPD */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Inscription CFEPD
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Inscrivez vos élèves à l'examen du CFEPD pour l'année scolaire en cours.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={goToInscriptionCFEPD}>
                Inscrivez vos élèves
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Résultats CFEPD
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Consultez vos résultats aux examens du CFEPD de l'année scolaire 2024-2025
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }}>
                Voir les résultats
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DashboardPageCFEPD;
