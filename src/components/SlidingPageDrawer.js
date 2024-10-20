

import React from 'react';
import { Drawer, IconButton, Box, Typography, Divider, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SlidingPageDrawer = ({ open, onClose, title, children }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '90%',  // Largeur fixée à 90% de la page
          maxWidth: '100vw',  // Prendre toute la largeur de l'écran si nécessaire
          background: 'linear-gradient(135deg, #f5f5f5 30%, #eaeaea)', // Dégradé moderne
          boxShadow: '0px 15px 50px rgba(0, 0, 0, 0.3)', // Ombre plus marquée
          borderRadius: '16px 0 0 16px', // Bords arrondis
          overflowX: 'hidden',  // Empêcher le défilement horizontal
        },
      }}
      transitionDuration={600} // Animation plus longue pour un effet premium
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          overflowY: 'auto',
          padding: '30px 40px',
          background: 'linear-gradient(to right, #ffffff, #fafafa)', // Doux dégradé
          overflowX: 'hidden', // Empêcher le défilement horizontal ici aussi
        }}
      >
        {/* Bouton de fermeture flottant */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(255, 89, 94, 0.9)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 89, 94, 1)',
              transform: 'scale(1.1)',  // Légère expansion au survol
              transition: 'transform 0.2s ease-in-out',  // Transition au survol
            },
            boxShadow: '0px 5px 15px rgba(255, 89, 94, 0.5)',  // Ombre flottante
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>


        

        {/* Animation pour le contenu */}
        <Slide direction="right" in={open} mountOnEnter unmountOnExit timeout={500}>
          <Box>
            {/* Titre du Drawer avec typographie moderne */}
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 'bold',
                fontSize: '2rem',
                color: '#2c3e50',
                textAlign: 'center',
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.1rem', // Espacement pour un look plus premium
              }}
            >
              {title}
            </Typography>

            {/* Ligne de séparation stylisée */}
            <Divider
              sx={{
                marginBottom: '20px',
                borderColor: '#ff8c00',
                borderBottomWidth: '3px',
                width: '80px', // Ligne plus courte pour un effet élégant
                marginX: 'auto',
              }}
            />

            {/* Contenu du Drawer */}
            <Box
              sx={{
                maxHeight: '70vh',
                overflowY: 'auto',
                padding: '20px 10px',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#ff8c00',
                  borderRadius: '10px',
                },
                overflowX: 'hidden', // Empêcher le défilement horizontal
              }}
            >
              {children}
            </Box>
          </Box>
        </Slide>
      </Box>
    </Drawer>
  );
};

export default SlidingPageDrawer;
