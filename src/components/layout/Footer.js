// src/components/layout/Footer.js
import React from 'react';
import { Box, Typography, IconButton, Grid, Link as MuiLink } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import logo from '../../assets/images/armoiries-niger.png'; // Assurez-vous que le chemin est correct

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#004d40', color: '#ffffff', padding: '40px 20px', marginTop: 'auto' }}>
      {/* Section principale du footer */}
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Logo et description */}
        <Grid item xs={12} sm={4} textAlign="center">
          <img src={logo} alt="Armoiries du Niger" style={{ height: 100, width: 'auto', marginBottom: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: '900' }}>
            MEN/A/EP/PLN
          </Typography>
          <Typography variant="body2">
            Portail des Établissements Scolaires au Niger
          </Typography>
        </Grid>

        {/* Liens de navigation */}
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Liens Utiles
          </Typography>
          <MuiLink href="#" underline="hover" color="inherit" sx={{ display: 'block', marginBottom: 1 }}>
            Présidence du Niger
          </MuiLink>
          <MuiLink href="#" underline="hover" color="inherit" sx={{ display: 'block', marginBottom: 1 }}>
            Ministère de l'Économie et des Finances
          </MuiLink>
          <MuiLink href="#" underline="hover" color="inherit" sx={{ display: 'block', marginBottom: 1 }}>
            Gouvernement du Niger
          </MuiLink>
          <MuiLink href="#" underline="hover" color="inherit" sx={{ display: 'block', marginBottom: 1 }}>
            Ministère de la Santé
          </MuiLink>
        </Grid>

        {/* Liens vers les réseaux sociaux */}
        <Grid item xs={12} sm={4} textAlign="center">
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Suivez-nous
          </Typography>
          <IconButton href="#" color="inherit">
            <Facebook />
          </IconButton>
          <IconButton href="#" color="inherit">
            <Twitter />
          </IconButton>
          <IconButton href="#" color="inherit">
            <Instagram />
          </IconButton>
          <IconButton href="#" color="inherit">
            <LinkedIn />
          </IconButton>
        </Grid>
      </Grid>

      {/* Footer secondaire avec copyrights */}
      <Box sx={{ borderTop: '1px solid #ffffff', marginTop: 3, paddingTop: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          © 2024 Ministère de l'Education Nationale, de l'Alphabétisation, de l'Enseignement Professionnel et de la Promotion des Langues Nationales. Tous droits réservés.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
