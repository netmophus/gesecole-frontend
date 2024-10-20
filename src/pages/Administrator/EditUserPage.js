
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select, FormGroup, FormControlLabel, Checkbox, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditUserPage = () => {
  const { id } = useParams(); // Obtenir l'ID de l'utilisateur à partir des paramètres de l'URL
  const [user, setUser] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    isActive: true,
    permissions: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  });
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Peut être 'success', 'error', etc.
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiBaseUrl}/api/auth/users/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data); // Mettre à jour l'état avec les données récupérées de l'utilisateur
        } else {
          console.error('Erreur lors de la récupération de l\'utilisateur:', res.statusText);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', err);
      }
    };

    fetchUser();
  }, [id]); // Dépendance à l'ID de l'utilisateur pour recharger si l'ID change

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (e) => {
    setUser({
      ...user,
      permissions: {
        ...user.permissions,
        [e.target.name]: e.target.checked,
      },
    });
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/auth/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (res.ok) {
        setSnackbarMessage('Utilisateur mis à jour avec succès');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        
        // Attendre 3 secondes avant de rediriger
        setTimeout(() => {
          navigate('/ministere/manage-users'); // Redirection après mise à jour
        }, 3000); // 3000ms = 3s
        
      } else {
        setSnackbarMessage('Erreur lors de la mise à jour de l\'utilisateur');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (err) {
      setSnackbarMessage('Erreur serveur. Veuillez réessayer.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  




  
  const handleCancel = () => {
    navigate('/ministere/manage-users'); // Redirection vers la page de gestion des utilisateurs
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Modifier l'Utilisateur
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom"
              name="name"
              value={user.name} // Valeur initiale provenant de l'état utilisateur
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Téléphone"
              name="phone"
              value={user.phone} // Valeur initiale provenant de l'état utilisateur
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={user.email} // Valeur initiale provenant de l'état utilisateur
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Rôle</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={user.role} // Valeur initiale provenant de l'état utilisateur
                onChange={handleChange}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Enseignant">Enseignant</MenuItem>
                <MenuItem value="Eleve">Eleve</MenuItem>
                <MenuItem value="Inspection">Inspection</MenuItem>
                <MenuItem value="Regional">Regional</MenuItem>
                <MenuItem value="Parent">Parent</MenuItem>
                <MenuItem value="Etablissement">Etablissement</MenuItem>
                <MenuItem value="Etablissement">bepc</MenuItem>
                <MenuItem value="Etablissement">adminbepc</MenuItem>
                <MenuItem value="Etablissement">admincentralbepc</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {/* <FormControl fullWidth>
              <InputLabel id="status-label">Statut</InputLabel>
              <Select
                labelId="status-label"
                name="isActive"
                value={user.isActive}
                onChange={(e) => setUser({ ...user, isActive: e.target.value === 'true' })}
              >
                <MenuItem value={true}>Actif</MenuItem>
                <MenuItem value={false}>Inactif</MenuItem>
              </Select>
            </FormControl> */}

          <FormControl fullWidth>
            <InputLabel id="status-label">Statut</InputLabel>
            <Select
              labelId="status-label"
              name="isActive"
              value={user.isActive} // Utiliser directement la valeur booléenne dans le state
              onChange={(e) => setUser({ ...user, isActive: e.target.value })} // Affecte directement la valeur booléenne
            >
              <MenuItem value={true}>Actif</MenuItem>
              <MenuItem value={false}>Inactif</MenuItem>
            </Select>
          </FormControl>

          </Grid>

          {/* Permissions Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Permissions
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.permissions.create}
                    onChange={handlePermissionChange}
                    name="create"
                  />
                }
                label="Créer"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.permissions.read}
                    onChange={handlePermissionChange}
                    name="read"
                  />
                }
                label="Lire"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.permissions.update}
                    onChange={handlePermissionChange}
                    name="update"
                  />
                }
                label="Mettre à jour"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={user.permissions.delete}
                    onChange={handlePermissionChange}
                    name="delete"
                  />
                }
                label="Supprimer"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Mettre à jour
            </Button>
            <Button onClick={handleCancel} variant="outlined" color="secondary" sx={{ ml: 2 }}>
              Annuler
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar 
      open={openSnackbar} 
      autoHideDuration={4000} 
      onClose={() => setOpenSnackbar(false)}
    >
      <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </Container>
  );
};

export default EditUserPage;
