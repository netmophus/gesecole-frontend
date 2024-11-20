// src/pages/BEPC/BepcAccessPage.js

import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Link } from 'react-router-dom';

import InfoIcon from '@mui/icons-material/Info';

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
      Bienvenue au processus de pré-inscription au BEPC
    </Typography>

    <Typography 
      variant="h5" 
      gutterBottom 
      sx={{ 
        color: '#333', 
        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
      }}
    >
      Processus de pré-inscription simplifié
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
      </Button> */}

    
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
      
    <Box
  sx={{
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  }}
>
<Box
  sx={{
    backgroundColor: '#f9f9f9',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: 'bold',
      color: '#004d40',
      marginBottom: '8px',
    }}
  >
    <InfoIcon
      sx={{
        fontSize: '1.5rem',
        color: '#FF8C00',
        verticalAlign: 'middle',
        marginRight: '8px',
      }}
    />
    Informations Importantes :
  </Typography>
  <Typography
    variant="body1"
    sx={{
      color: '#555',
      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
      marginBottom: '16px',
    }}
  >
    Les pré-inscriptions pour le <strong>BEPC</strong> sont ouvertes aux dates suivantes :
  </Typography>
  <Typography
    variant="body1"
    sx={{
      color: '#d32f2f',
      fontWeight: 'bold',
      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
    }}
  >
    Du <strong>1er decembre 2024</strong> au <strong>30 mars 2025</strong>.
  </Typography>
</Box>

</Box>

    </Box>
  </Paper>
</Container>

  );
};

export default BepcAccessPage;
