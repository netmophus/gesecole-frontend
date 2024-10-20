import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Container, TextField, Button, Typography, Box, Card, CardContent, Snackbar, Alert } from '@mui/material';

//import imagelogin from '../../assets/images/imagelogin.jpg';
const LoginPage = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Variables d'état pour le Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Par défaut, le message est de type 'success'

  useEffect(() => {
    if (user && user.role === 'Etablissement') {
      // Assurez-vous que 'isConfigured' est défini avant la redirection
      if (typeof user.isConfigured !== 'undefined') {
        if (!user.isConfigured) {
          console.log('Redirection vers la page de configuration');
          navigate('/etablissement/configuration', { replace: true });
        } else {
          console.log('Redirection vers la page du tableau de bord');
          navigate('/etablissement/DashboardPage', { replace: true });
        }
      }
    } else if (user) {
      // Redirection pour les autres rôles
      switch (user.role) {
        case 'Admin':
          navigate('/ministere/DashboardPage', { replace: true });
          break;
        case 'Enseignant':
          navigate('/enseignant/DashboardPage', { replace: true });
          break;
       

        case 'Eleve':
        // Si l'utilisateur est un élève, redirection vers son dashboard
        console.log('Redirection vers le dashboard de l\'élève'); // Ajoute un log pour vérifier
        setSnackbarMessage('Connexion réussie. Redirection vers le tableau de bord...'); // Nouveau message
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        navigate('/eleve/DashboardPage', { replace: true });
        break;



        case 'Inspection':
          navigate('/inspection/DashboardPage', { replace: true });
          break;
        case 'Regional':
          navigate('/regional/DashboardPage', { replace: true });
          break;
        case 'Parent':
          navigate('/parent/DashboardPage', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
          break;
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = {
      identifier: e.target.identifier.value,  // Utilise `identifier` à la place de `phone`
      password: e.target.password.value,
    };
  
    try {
      const result = await login(formData); // Appel à la fonction login dans AuthContext
  
      if (result.success) {
        setSnackbarMessage(result.message);
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(result.message);
        setSnackbarSeverity('error');
      }
  
      setOpenSnackbar(true); // Ouvre le Snackbar pour afficher le message
    } catch (err) {
      // En cas d'erreur (comme un problème serveur), on affiche un message dans le Snackbar
      setSnackbarMessage(err.message || 'Une erreur inattendue est survenue.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  

  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      //height: '100vh',
      width: '100%', // Ajout de 100% pour couvrir toute la largeur
    }}
    >
      {/* Section gauche pour la Card de connexion */}
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#00897B',
          padding: 2,
          width: '100%', // Assure que la card prend toute la largeur du container
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#004d40', padding: 2 }}>
            <CardContent>
              {/* Texte en haut du formulaire */}
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>
                Bienvenue sur le Portail de Connexion
              </Typography>
              <Typography variant="h4" align="center" gutterBottom sx={{ color: '#fff' }}>
                Connexion
              </Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Téléphone ou Matricule"  // Adaptation du label pour indiquer que l'identifiant peut être l'un ou l'autre
                  id="identifier"
                  name="identifier"
                  margin="normal"
                  variant="outlined"
                  required
                  sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                  InputProps={{
                    style: { color: '#000' },
                  }}
                  InputLabelProps={{
                    style: { color: '#FF8C00', marginTop: '-7px' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Mot de passe"
                  type="password"
                  id="password"
                  name="password"
                  margin="normal"
                  variant="outlined"
                  required
                  sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                  InputProps={{
                    style: { color: '#000' },
                  }}
                  InputLabelProps={{
                    style: { color: '#FF8C00', marginTop: '-7px' },
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      backgroundColor: '#FF8C00', 
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#FFD700', // Jaune clair pour le hover
                        color: '#004d40', // Texte en vert lors du hover
                      },
                    }}
                  >
                    Se connecter
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Section droite pour l'image de placeholder */}
      {/* <Box
        sx={{
          flex: 1,
         
         backgroundImage: `url(${imagelogin})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      /> */}

      {/* Snackbar pour afficher les messages d'erreur ou succès */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
