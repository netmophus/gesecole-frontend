import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import { Box, Typography, Button, Paper, Container, Grid, Avatar } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import BarChartIcon from '@mui/icons-material/BarChart';

const AdminCentralDashboardBEPC = () => {
  const navigate = useNavigate(); // Initialize navigation hook

  // Function to navigate to different sections of the dashboard
  const goToSection = (path) => {
    navigate(path); // Dynamic route based on section
  };

   // Function to handle logout
   const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login-bepc'); // Redirect to login page
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
            Tableau de Bord Administrateur Central BEPC
          </Typography>
          {/* Logout button */}
          <Button variant="contained" sx={{ bgcolor: '#FF0000' }} onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
        <Typography variant="h6" sx={{ color: '#FF8C00', mb: 4 }}>
          Gérez les administrateurs d’établissements, les permissions, et les rapports globaux.
        </Typography>

        <Grid container spacing={4}>
          {/* Gestion des Administrateurs d'Établissements */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <AssignmentIndIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Gestion des Administrateurs
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Créez, modifiez ou supprimez les administrateurs d’établissement et gérez leurs rôles.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/gestion-admins')}>
                Gérer les Administrateurs
              </Button>
            </Paper>
          </Grid>

          {/* Gestion des Permissions */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <SecurityIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Gestion des Permissions
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Contrôlez les permissions et droits d'accès des administrateurs et utilisateurs.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/gestion-permissions')}>
                Gérer les Permissions
              </Button>
            </Paper>
          </Grid>

          {/* Gestion des Rapports et Statistiques */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <BarChartIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Rapports et Statistiques
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Consultez les statistiques globales d'inscription, paiements, et examens.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/rapports-statistiques')}>
                Voir les Rapports
              </Button>
            </Paper>
          </Grid>

          {/* Gestion des Adresses MAC et Sécurité */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <SettingsIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Gestion des Adresses MAC
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Assignez des adresses MAC pour renforcer la sécurité et l'accès des utilisateurs.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/gestion-adresses-mac')}>
                Gérer les Adresses MAC
              </Button>
            </Paper>
          </Grid>

          {/* Gestion des Établissements */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <AccountBalanceIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Gestion des Établissements
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Gérer les établissements et suivre les inscriptions des élèves.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/gestion-etablissements')}>
                Gérer les Établissements
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminCentralDashboardBEPC;
