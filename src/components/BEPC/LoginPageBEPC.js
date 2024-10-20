
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Avatar, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom';

//pour mettre un message
import { Snackbar, Alert } from '@mui/material';

const LoginPageBEPC = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const navigate = useNavigate();

///pour mettre un message
const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls whether the Snackbar is open
const [snackbarMessage, setSnackbarMessage] = useState(''); // Controls the message in the Snackbar
const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Can be 'success', 'error', etc.
const apiBaseUrl = process.env.REACT_APP_API_URL;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  
    try {
      const res = await fetch(`${apiBaseUrl}/api/bepc/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); // Enregistrer le token
  
        // Vérifier le rôle de l'utilisateur pour rediriger vers le bon tableau de bord
        if (data.user.role === 'bepcadmin') {
          navigate('/bepcadmin-dashboard'); // Redirection vers le tableau de bord admin
        } else if (data.user.role === 'bepc') {
          navigate('/dashboard-bepc')
        } else if (data.user.role === 'admincentralbepc') {
          navigate('/admincentralbepc-dashboard'); // Redirection vers le tableau de bord pour les élèves BEPC
          
          
          
          
        } else {
          setSnackbarSeverity('error');
          setSnackbarMessage('Accès non autorisé pour ce rôle.');
          setSnackbarOpen(true);
          return;
        }
  
        // Afficher un message de succès
        setSnackbarSeverity('success');
        setSnackbarMessage('Connexion réussie !');
        setSnackbarOpen(true);
      } else {
        // Afficher un message d'erreur si la connexion échoue
        setSnackbarSeverity('error');
        setSnackbarMessage(data.msg || 'Erreur lors de la connexion.');
        setSnackbarOpen(true);
      }
    } catch (err) {
      // Afficher un message d'erreur si le serveur ne répond pas
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
            Connexion BEPC
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
            <Link to="/register-bepc" style={{ textDecoration: 'none', color: '#FF8C00' }}>
              <Typography variant="body2" align="center">
                Pas encore inscrit ? Créez un compte.
              </Typography>
            </Link>
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

export default LoginPageBEPC;
