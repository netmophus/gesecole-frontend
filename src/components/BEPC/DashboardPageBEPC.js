

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook for navigation
import { Box, Typography, Button, Paper, Container, Grid, Avatar } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DashboardPageBEPC = () => {
  const navigate = useNavigate();  // Initialize navigation hook

  // Function to handle navigation
  const goToInscription = () => {
    navigate('/inscription');  // Define the route for the inscription page
  };

     // Function to handle logout
     const handleLogout = () => {
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/login-bepc'); // Redirect to login page
    };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 , mb:8}}>
      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
            Tableau de Bord BEPC
          </Typography>
          {/* Logout button */}
          <Button variant="contained" sx={{ bgcolor: '#FF0000' }} onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
        <Typography variant="h6" sx={{ color: '#FF8C00', mb: 4 }}>
          Bienvenue sur votre tableau de bord. Retrouvez ici toutes les informations relatives à votre inscription au BEPC.
        </Typography>
        
        {/* Sections principales du dashboard */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Statut de l'Inscription
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Consultez le statut de votre inscription pour suivre les étapes du processus.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }}>
                Voir le statut
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <PaymentIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Paiements
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Gérez vos paiements et vérifiez leur état pour finaliser votre inscription.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }}>
                Gérer les paiements
              </Button>
            </Paper>
          </Grid>

          {/* New Section for Registration */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Inscription BEPC
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Inscrivez-vous à l'examen du BEPC pour l'année scolaire en cours.
              </Typography>
              {/* Button to go to inscription */}
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={goToInscription}>
                S'inscrire au BEPC
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Résultats
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Consultez vos résultats dès leur publication et suivez votre progression.
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

export default DashboardPageBEPC;

