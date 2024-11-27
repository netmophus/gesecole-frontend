// src/components/CFEPD/RegisterPageCFEPD.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Avatar, Grid, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPageCFEPD = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Pour rediriger après succès
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiBaseUrl}/api/cfepd/auth/register`, { // URL mise à jour pour CFEPD
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envoyer les données de l'utilisateur au backend
      });

      const data = await res.json();
      if (res.ok) {
        // Rediriger vers la page de connexion après l'inscription
        navigate('/login-cfepd');
      } else {
        setErrorMessage(data.msg || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setErrorMessage('Erreur serveur. Veuillez réessayer plus tard.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, mt: 10, mb:15 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#FF8C00', mb: 2 }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Inscription CFEPD
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Nom complet"
                  name="name"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Numéro de téléphone"
                  name="phone"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#004d40' }}
            >
              S'inscrire
            </Button>
            {/* <Link to="/login-cfepd" style={{ textDecoration: 'none', color: '#FF8C00' }}>
              <Typography variant="body2" align="center">
                Déjà inscrit ? Connectez-vous.
              </Typography>
            </Link> */}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPageCFEPD;
