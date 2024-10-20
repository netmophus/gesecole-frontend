

import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinistereImage from '../assets/images/Ministremen.jpg'; // Chemin vers l'image

function MessageMinistreModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ position: 'relative', padding: '20px' }}>
      {/* Bouton pour ouvrir le modal */}
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{
          backgroundColor: '#FF8C00',
          color: '#fff',
          fontSize: '1rem',
          padding: '10px 20px',
          borderRadius: '50px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: '#FFD700',
            transform: 'scale(1.05)',
          },
        }}
      >
        Message du Ministre
      </Button>

      {/* Modal chic et moderne */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#004d40',
            borderRadius: '20px',
            padding: '30px',
            width: '80%',
            maxWidth: '600px',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            color: '#fff',
          }}
        >
          {/* Bouton de fermeture */}
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: '10px', right: '10px', color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>

          {/* Photo du Ministre */}
          <Avatar
            src={MinistereImage}
            alt="Ministre"
            sx={{
              width: 120,
              height: 120,
              margin: '20px auto',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
            }}
          />

          {/* Conteneur avec défilement vertical */}
          <Box
            sx={{
              maxHeight: '300px', // Hauteur maximale du conteneur
              overflowY: 'auto', // Active le défilement vertical si le contenu dépasse
              marginTop: '20px',
              paddingRight: '10px', // Espace pour le scroller
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#004d40',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#FF8C00',
                borderRadius: '10px',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '10px',
                color: '#FFD700',
              }}
            >
              Dr Elisabeth Sherif
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                fontStyle: 'italic',
                color: '#e0f7fa',
              }}
            >
              MEN/A/EP/PLN
            </Typography>

            {/* Message du Ministre */}
            <>
      {/* Partie 1 du message */}
      <Typography
        variant="body1"
        sx={{
          marginTop: '20px',
          textAlign: 'justify',
          lineHeight: 1.5,
          fontSize: '1.1rem',
        }}
      >
        C'est avec une immense joie que nous vous présentons le Portail des Établissements Scolaires du Niger, une plateforme moderne, conçue pour faciliter l'accès aux services éducatifs pour tous. Ce portail se veut être un lien précieux entre les élèves, leurs familles, et les institutions scolaires, en apportant des solutions numériques pour simplifier les démarches et enrichir l’expérience éducative.
      </Typography>

      {/* Espacement entre les sections */}
      <Typography
        variant="body1"
        sx={{
          marginTop: '30px', // Espacement entre cette section et la précédente
          textAlign: 'justify',
          lineHeight: 1.5,
          fontSize: '1.1rem',
        }}
      >
        Grâce à ce portail, il est désormais possible de consulter le bulletin numérique, une avancée qui permet aux élèves et aux parents de suivre les résultats scolaires en temps réel et en toute transparence. La carte scolaire numérique offre une vue d’ensemble des établissements, permettant aux familles de s'informer et de faire des choix éclairés pour l'avenir de leurs enfants.
      </Typography>

      {/* Partie 3 du message */}
      <Typography
        variant="body1"
        sx={{
          marginTop: '30px', // Espacement entre cette section et la précédente
          textAlign: 'justify',
          lineHeight: 1.5,
          fontSize: '1.1rem',
        }}
      >
        Les inscriptions au BEPC sont également simplifiées, rendant la procédure plus rapide et plus accessible. Et ce n'est qu'un début : très bientôt, le portail intégrera des ressources pédagogiques en ligne pour offrir un accès à des contenus éducatifs de qualité, adaptés aux besoins des élèves et des enseignants.
      </Typography>

      {/* Partie 4 du message */}
      <Typography
        variant="body1"
        sx={{
          marginTop: '30px', // Espacement entre cette section et la précédente
          textAlign: 'justify',
          lineHeight: 1.5,
          fontSize: '1.1rem',
        }}
      >
        Ce portail est une promesse de progrès, un outil au service de notre communauté éducative, et un engagement ferme pour un avenir meilleur. Ensemble, travaillons main dans la main pour construire un système éducatif plus fort, plus ouvert, et plus accessible à tous.
      </Typography>

      {/* Conclusion */}
      <Typography
        variant="body1"
        sx={{
          marginTop: '30px', // Espacement entre cette section et la précédente
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: '#FF8C00',
        }}
      >
        Bienvenue sur votre portail, l’avenir de nos enfants commence ici !
      </Typography>
    </>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default MessageMinistreModal;
