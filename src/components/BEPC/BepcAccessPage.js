// src/pages/BEPC/BepcAccessPage.js

import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const BepcAccessPage = () => {

  
  return (

    <Container maxWidth="md" sx={{ textAlign: 'center', mt: { xs: 4, md: 8 }, mb: { xs: 5, md: 10 } }}>
  <Paper 
    elevation={3} 
    sx={{ 
      padding: { xs: 2, sm: 4, md: 5 }, 
      borderRadius: 3, 
      backgroundColor: '#f5f5f5' 
    }}
  >
    <Typography 
      variant="h3" 
      gutterBottom 
      sx={{ 
        fontWeight: 'bold', 
        color: '#FF8C00', 
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } 
      }}
    >
      Bienvenue au processus d’inscription CFEPD/BEPC
    </Typography>

    <Typography 
      variant="h5" 
      gutterBottom 
      sx={{ 
        color: '#333', 
        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
      }}
    >
      Processus d’inscription simplifié
    </Typography>


    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, // Colonne en petit écran, ligne en plus grand
        justifyContent: 'center', 
        alignItems: 'center',
        gap: { xs: 2, md: 4 }, 
        mb: { xs: 3, md: 5 } 
      }}
    >



      <Button 
        component={Link} 
        to="/register-bepc" 
        variant="contained" 
        sx={{ 
          backgroundColor: '#FF8C00', 
          color: '#fff', 
          padding: { xs: 1, md: 2 }, 
          fontSize: { xs: '1rem', md: '1.2rem' },
          width: { xs: '100%', sm: 'auto' } // Largeur complète en xs, auto en plus grand
        }}
      >
        S'inscrire
      </Button>

    
      <Button 
        component={Link} 
        to="/login-bepc" 
        variant="outlined" 
        sx={{ 
          color: '#FF8C00', 
          borderColor: '#FF8C00', 
          padding: { xs: 1, md: 2 }, 
          fontSize: { xs: '1rem', md: '1.2rem' },
          width: { xs: '100%', sm: 'auto' } // Largeur complète en xs, auto en plus grand
        }}
      >
        Se Connecter
      </Button>
    </Box>

 

    <Box sx={{ mt: { xs: 3, md: 4 }, textAlign: 'center' }}>
      <CalendarTodayIcon sx={{ fontSize: { xs: 30, md: 50 }, color: '#004d40' }} />
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#757575', 
          mt: 1, 
          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } 
        }}
      >
        Les inscriptions sont ouvertes du 1er au 30 novembre pour le CFEPD et du 1er novembre au 2 Fevrier pour le BEPC.
      </Typography>
    </Box>
  </Paper>
</Container>

  );
};

export default BepcAccessPage;
