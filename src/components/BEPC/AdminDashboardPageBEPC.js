import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import { Box, Typography, Button, Paper, Container, Grid, Avatar } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PaymentsIcon from '@mui/icons-material/Payments';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';

const AdminDashboardPageBEPC = () => {
  const navigate = useNavigate();  // Initialize navigation hook

  // Function to navigate to different pages
  const goToSection = (path) => {
    navigate(path);  // Dynamic route based on section
  };

   // Function to handle logout
   const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login-bepc'); // Redirect to login page
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 , mb:8 }}>
      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
            Tableau de Bord Administrateur BEPC
          </Typography>
          {/* Logout button */}
          <Button variant="contained" sx={{ bgcolor: '#FF0000' }} onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
        <Typography variant="h6" sx={{ color: '#FF8C00', mb: 4 }}>
          Gérez les inscriptions, les paiements, et les résultats des examens du BEPC.
        </Typography>
        
        {/* Main sections of the admin dashboard */}
        <Grid container spacing={4}>
          {/* Gestion des Inscriptions */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <AssignmentTurnedInIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Gestion des Inscriptions
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Validez les inscriptions des élèves et gérez leur statut.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/inscriptions')}>
                Gérer les Inscriptions
              </Button>
            </Paper>
          </Grid>

          {/* Gestion des Paiements */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <PaymentsIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Suivi des Paiements
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Vérifiez les paiements des frais d'inscription et gérez les statuts de paiement.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/paiements')}>
                Suivi des Paiements
              </Button>
            </Paper>
          </Grid>

          {/* Suivi des Examens */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Suivi des Examens
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Gérez les centres d'examens et assignez les élèves.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/examens')}>
                Suivi des Examens
              </Button>
            </Paper>
          </Grid>

          {/* Rapports et Statistiques */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: '#FF8C00', width: 80, height: 80, mb: 2 }}>
                <BarChartIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
                Rapports et Statistiques
              </Typography>
              <Typography variant="body1" sx={{ color: '#757575', mb: 3 }}>
                Consultez les rapports financiers et les statistiques d'inscription.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/statistiques')}>
                Voir les Rapports
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
                Gérez les établissements scolaires et les contacts administratifs.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#004d40' }} onClick={() => goToSection('/admin/etablissements')}>
                Gérer les Établissements
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboardPageBEPC;
