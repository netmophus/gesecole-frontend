import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Avatar, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom';

// Pour afficher un message
import { Snackbar, Alert } from '@mui/material';

const LoginPageCFEPD = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const navigate = useNavigate();

  // État pour le Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  
    try {
      const res = await fetch(`${apiBaseUrl}/api/cfepd/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Stocker le token
        localStorage.setItem('token', data.token);
        console.log('Token enregistré:', data.token);
  
        // Afficher un message de succès
        setSnackbarSeverity('success');
        setSnackbarMessage('Connexion réussie !');
        setSnackbarOpen(true);
  
        // Ajouter un délai avant la redirection pour afficher le Snackbar
        setTimeout(() => {
          if (data.user.role === 'cfepdadmin') {
            navigate('/cfepdadmin-dashboard');
          } else if (data.user.role === 'cfepd') {
            navigate('/dashboard-cfepd');
          }
        }, 2000); // Redirection après 2 secondes
      } else {
        // Gérer les erreurs renvoyées par le serveur
        setSnackbarSeverity('error');
        setSnackbarMessage(data.msg || 'Erreur lors de la connexion.');
        setSnackbarOpen(true);
      }
    } catch (err) {
      // Gérer les erreurs côté client ou serveur
      console.error('Erreur lors de la connexion:', err);
      setSnackbarSeverity('error');
      setSnackbarMessage('Erreur serveur lors de la connexion.');
      setSnackbarOpen(true);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, mt: 10, mb:10 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#FF8C00', mb: 2 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Connexion CFEPD
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <Grid container spacing={2}>
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
              Se Connecter
            </Button>
            {/* <Link to="/register-cfepd" style={{ textDecoration: 'none', color: '#FF8C00' }}>
              <Typography variant="body2" align="center">
                Pas encore inscrit ? Créez un compte.
              </Typography>
            </Link> */}
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPageCFEPD;
