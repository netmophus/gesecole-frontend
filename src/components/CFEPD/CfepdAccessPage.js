// src/pages/CFEPD/CfepdAccessPage.js

import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';

const CfepdAccessPage = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: { xs: 4, md: 8 }, mb: { xs: 5, md: 10 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: { xs: 2, sm: 4, md: 5 }, 
          borderRadius: 3, 
          backgroundColor: '#f0f4c3' // Fond plus clair pour différencier
        }}
      >
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#33691e', // Vert foncé pour le CFEPD
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } 
          }}
        >
          Bienvenue au processus de pré-inscription au CFEPD
        </Typography>

        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            color: '#333', 
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
          }}
        >
          Processus de pré-inscription simplifié pour le CFEPD
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
          {/* <Button 
            component={Link} 
            to="/register-cfepd" // Lien vers la page d'inscription CFEPD
            variant="contained" 
            sx={{ 
              backgroundColor: '#33691e', // Vert foncé
              color: '#fff', 
              padding: { xs: 1, md: 2 }, 
              fontSize: { xs: '1rem', md: '1.2rem' },
              width: { xs: '100%', sm: 'auto' } // Largeur complète en xs, auto en plus grand
            }}
          >
            S'inscrire
          </Button> */}

          <Button 
            component={Link} 
            to="/login-cfepd" // Lien vers la page de connexion CFEPD
            variant="outlined" 
            sx={{ 
              color: '#33691e', 
              borderColor: '#33691e', 
              padding: { xs: 1, md: 2 }, 
              fontSize: { xs: '1rem', md: '1.2rem' },
              width: { xs: '100%', sm: 'auto' } // Largeur complète en xs, auto en plus grand
            }}
          >
            Se Connecter
          </Button>
        </Box>

        <Box sx={{ mt: { xs: 3, md: 4 }, textAlign: 'center' }}>
         
          <Box
  sx={{
    backgroundColor: '#fff8e1', // Couleur de fond douce pour attirer l'attention
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Ombre pour mettre en relief
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  }}
>
  <InfoIcon
    sx={{
      fontSize: '2rem',
      color: '#FF8C00', // Couleur vive pour l'icône
    }}
  />
  <Typography
    variant="body1"
    sx={{
      color: '#333', // Texte sombre pour contraste
      fontWeight: 'bold', // Mettre en valeur
      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' }, // Ajustement pour différents écrans
    }}
  >
    Les pré-inscriptions sont ouvertes du <strong>1er novembre 2024</strong> au <strong>30 mars 2025</strong> pour le <strong>CFEPD</strong>.
  </Typography>
</Box>

        </Box>
      </Paper>
    </Container>
  );
};

export default CfepdAccessPage;
