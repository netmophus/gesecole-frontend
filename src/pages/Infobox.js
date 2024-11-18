import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const InfoBox = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#004d40', // Couleur principale
        color: '#fff', // Texte blanc
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        marginBottom: '40px',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          marginBottom: '20px',
          fontSize: {
            xs: '1.5rem', // Petit écran
            sm: '1.8rem', // Écran moyen
            lg: '2rem',  // Grand écran
          },
        }}
      >
        Inscriptions en ligne ouvertes pour le BEPC et le CFEPD !
      </Typography>
      <Typography
        variant="body1"
        sx={{
          marginBottom: '20px',
          fontSize: '1rem',
          lineHeight: 1.6,
          color: '#e0f7fa',
        }}
      >
        Les inscriptions en ligne pour les examens nationaux BEPC et CFEPD sont maintenant ouvertes. Ne
        manquez pas cette opportunité !
      </Typography>

      {/* Section des boutons et des icônes */}
      <Grid container spacing={4} justifyContent="center">
        {/* BEPC */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              backgroundColor: '#00695c', // Couleur de fond pour BEPC
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: '#00796b',
              },
            }}
          >
            <AssignmentIcon sx={{ fontSize: '40px', color: '#FFD700', marginBottom: '10px' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FFD700', marginBottom: '10px' }}>
              BEPC
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FFD700', // Bouton doré
                color: '#004d40',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#FFC107' },
              }}
              href="/bepc-inscription"
            >
              S'inscrire maintenant
            </Button>
          </Box>
        </Grid>

        {/* CFEPD */}
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              backgroundColor: '#1A535C', // Couleur de fond pour CFEPD
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: '#2A7E84',
              },
            }}
          >
            <FileCopyIcon sx={{ fontSize: '40px', color: '#FF8C00', marginBottom: '10px' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF8C00', marginBottom: '10px' }}>
              CFEPD
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FF8C00', // Bouton orange
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#FF751A' },
              }}
              href="/cfepd-inscription"
            >
              S'inscrire maintenant
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InfoBox;
