

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook for navigation
import { Box, Typography, Button, Paper, Container, Grid, Avatar } from '@mui/material';
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
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
            Tableau de Bord inscriptions BEPC et CFEPD 
          </Typography>
          {/* Logout button */}
          <Button variant="contained" sx={{ bgcolor: '#FF0000' }} onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
        {/* <Typography variant="h6" sx={{ color: '#FF8C00', mb: 4 }}>
          Bienvenue sur votre tableau de bord. Retrouvez ici toutes les informations relatives à votre inscription au BEPC.
        </Typography> */}
        
        {/* Sections principales du dashboard */}
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
              Inscrivez vos élèves  à l'examen du CFPED pour l'année scolaire en cours.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }}>
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
                Resultats
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
              Consultez vos résultats aux examens du CFEPD de l'année scolaire 2024-2025
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }}>
              Voir les résultats
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
                Inscrivez vos élèves à l'examen du BEPC pour l'année scolaire en cours.
              </Typography>
              {/* Button to go to inscription */}
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={goToInscription}>
                Inscrivez vos élèves au BEPC
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
                Consultez vos résultats aux examens du BEPC de l'année scolaire 2024-2025
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

