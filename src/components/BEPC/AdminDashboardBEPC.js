import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Modal,
  TextField,
  Snackbar,
  MenuItem,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const AdminDashboardBEPC = () => {
  const [users, setUsers] = useState([]);
 // const [currentPage, setCurrentPage] = useState(0);
  
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterValues, setFilterValues] = useState({
    region: '',
    centreExamen: '',
    etablissement: '',
  });

 
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });


 
  const [openAddModal, setOpenAddModal] = useState(false);
// État pour stocker les données du nouveau centre
const [newCentre, setNewCentre] = useState({
  nom: '',
  region: '',
});


const [centresBepc, setCentresBepc] = useState([]);




const [userPage, setUserPage] = useState(0); // Page actuelle des utilisateurs
const [userRowsPerPage, setUserRowsPerPage] = useState(5); // Nombre de lignes par page

const [centrePage, setCentrePage] = useState(0); // Page actuelle des centres
const [centreRowsPerPage, setCentreRowsPerPage] = useState(5); // Nombre de lignes par page

const [isEditing, setIsEditing] = useState(false); // Indique si on modifie un centre


  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  const fetchCentresBepc = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token du stockage local
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bepc/centre-examen`, {
        headers: { Authorization: `Bearer ${token}` }, // Ajouter le jeton d'autorisation
      });
      setCentresBepc(res.data); // Met à jour les centres BEPC dans le state
    } catch (err) {
      console.error("Erreur lors de la récupération des centres BEPC :", err);
    }
  };
  
  
  useEffect(() => {
    fetchCentresBepc(); // Récupère les centres BEPC au chargement du composant
  }, []);


  // const handleAddCentre = async (event) => {
  //   event.preventDefault(); // Empêche le rafraîchissement de la page
  
  //   try {
  //     const token = localStorage.getItem('token'); // Récupérer le token pour l'authentification
  //     await axios.post(
  //       `${process.env.REACT_APP_API_URL}/api/bepc/centre-examen`, // Remplacez par le bon endpoint pour les centres BEPC
  //       newCentre, // Données du formulaire (nom et région)
  //       {
  //         headers: { Authorization: `Bearer ${token}` }, // Inclure le token dans l'en-tête
  //       }
  //     );
  
  //     await fetchCentresBepc(); // Rechargez la liste des centres après l'ajout
  
  //     // Afficher une notification de succès
  //     setSnackbar({
  //       open: true,
  //       message: "Centre BEPC ajouté avec succès.",
  //       severity: "success",
  //     });
  
  //     // Fermer le modal et réinitialiser le formulaire
  //     setOpenAddModal(false);
  //     setNewCentre({ nom: "", region: "" });
  //   } catch (err) {
  //     console.error("Erreur lors de l'ajout du centre BEPC :", err);
  
  //     // Afficher une notification d'erreur
  //     setSnackbar({
  //       open: true,
  //       message: "Erreur lors de l'ajout du centre BEPC.",
  //       severity: "error",
  //     });
  //   }
  // };
  
  

  // Charger les utilisateurs BEPC
// Charger les données des utilisateurs BEPC

const handleAddCentre = async (event) => {
  event.preventDefault(); // Empêche le rafraîchissement de la page

  try {
    const token = localStorage.getItem('token');
    if (isEditing) {
      // Modifier le centre existant
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/bepc/centre-examen/${newCentre._id}`,
        newCentre, // Données modifiées
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: 'Centre BEPC modifié avec succès.',
        severity: 'success',
      });
    } else {
      // Ajouter un nouveau centre
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bepc/centre-examen`,
        newCentre, // Données du formulaire
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbar({
        open: true,
        message: 'Centre BEPC ajouté avec succès.',
        severity: 'success',
      });
    }

    await fetchCentresBepc(); // Rechargez la liste des centres après l'ajout/modification
    setOpenAddModal(false); // Fermer le modal
    setNewCentre({ nom: '', region: '' }); // Réinitialiser le formulaire
    setIsEditing(false); // Réinitialiser le mode édition
  } catch (err) {
    console.error('Erreur lors de l\'opération sur le centre BEPC :', err);
    setSnackbar({
      open: true,
      message: 'Erreur lors de l\'opération sur le centre BEPC.',
      severity: 'error',
    });
  }
};





const fetchUsers = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bepcadmin/agents`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setUsers(res.data);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs BEPC :', error);
  }
};

useEffect(() => {
  fetchUsers();
}, []);

  // Activer/Désactiver un utilisateur
  const toggleUserStatus = async (userId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/bepcadmin/agents/${userId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSnackbar({
        open: true,
        message: 'Statut mis à jour avec succès.',
        severity: 'success',
      });
      // Mettre à jour localement
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut :', err);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour du statut.',
        severity: 'error',
      });
    }
  };

  // // Générer un rapport complet
  

  


  const handleGenerateCompleteReport = async (userId) => {
    if (!userId) {
      setSnackbar({
        open: true,
        message: 'ID de l’utilisateur manquant. Impossible de générer le rapport.',
        severity: 'warning',
      });
      return;
    }
  
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/bepcadmin/agents/${userId}/report`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
  
      const { agent, inscriptions } = res.data;
  
      const pdf = new jsPDF();
      let yPosition = 10;
  
      // En-tête du rapport
      pdf.setFontSize(16);
      pdf.text(`Rapport de l'Agent : ${agent.name}`, 10, yPosition);
      yPosition += 10;
  
      pdf.setFontSize(12);
      pdf.text(`Téléphone : ${agent.phone}`, 10, yPosition);
      yPosition += 7;
  
      pdf.text(`Total des saisies : ${agent.totalSaisies}`, 10, yPosition);
      yPosition += 7;
  
      pdf.text(`Montant total collecté : ${agent.montantTotal} FCFA`, 10, yPosition);
      yPosition += 10;
  
      // Tableau des inscriptions
      pdf.setFontSize(14);
      pdf.text('Détails des inscriptions :', 10, yPosition);
      yPosition += 10;
  
      pdf.setFontSize(10);
      inscriptions.forEach((inscription, index) => {
        pdf.text(
          `${index + 1}. ${inscription.prenom} ${inscription.nom} ` +
          `Montant : ${inscription.montantPaiement} FCFA, Région : ${inscription.regionEtablissement}`,
          10,
          yPosition
        );
        yPosition += 7;
  
        // Vérifiez si la page a suffisamment d’espace
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 10;
        }
      });
  
      // Enregistrer le PDF
      pdf.save(`Rapport_Agent_${agent.name}.pdf`);
  
      // Message de succès
      setSnackbar({
        open: true,
        message: 'Rapport généré avec succès.',
        severity: 'success',
      });
    } catch (err) {
      console.error('Erreur lors de la génération du rapport complet :', err);
  
      setSnackbar({
        open: true,
        message: 'Erreur lors de la génération du rapport.',
        severity: 'error',
      });
    }
  };
  





  const handleLogout = () => {
    // Supprime le token du stockage local
    localStorage.removeItem('token');
    
    // Redirige vers la page de connexion
    window.location.href = '/login-bepc'; // Remplacez '/login' par le chemin exact de votre page de connexion
  };



const handleDownloadReport = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/bepcadmin/report`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    const inscriptions = response.data;
    const pdf = new jsPDF();

    let yPosition = 10;

    // Titre du rapport
    pdf.setFontSize(16);
    pdf.text("Rapport des Inscriptions BEPC", 10, yPosition);
    yPosition += 10;

    // Date de génération
    pdf.setFontSize(12);
    pdf.text(`Date : ${new Date().toLocaleDateString()}`, 10, yPosition);
    yPosition += 10;

    // Parcourir les données par région et centre d'examen
    const regions = [...new Set(inscriptions.map((ins) => ins.regionEtablissement))];
    regions.forEach((region) => {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Région : ${region}`, 10, yPosition);
      yPosition += 10;

      const centres = inscriptions
        .filter((ins) => ins.regionEtablissement === region)
        .reduce((acc, ins) => {
          const centreNom = ins.centreExamen?.nom || "Non spécifié";
          if (!acc[centreNom]) acc[centreNom] = [];
          acc[centreNom].push(ins);
          return acc;
        }, {});

      Object.keys(centres).forEach((centre) => {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "italic");
        pdf.text(`Centre : ${centre}`, 20, yPosition);
        yPosition += 10;

        centres[centre].forEach((ins, index) => {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(
            `${index + 1}. Nom : ${ins.nom}, Prénom : ${ins.prenom}, Établissement : ${ins.nomEtablissement}, Centre d'Examen : ${ins.centreExamen?.nom || 'Non spécifié'}`,
            30,
            yPosition
          );
          
          yPosition += 7;

          // Vérifiez si on dépasse la page
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = 10;
          }
        });

        yPosition += 5; // Espace entre les centres
      });

      yPosition += 10; // Espace entre les régions
    });

    // Enregistrement du PDF
    pdf.save("Rapport_BEPC.pdf");
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    alert("Impossible de générer le PDF. Veuillez réessayer.");
  }
};





  const handleEditCentre = (centre) => {
    setNewCentre(centre); // Charger les données du centre à modifier
    setIsEditing(true); // Passer en mode modification
    setOpenAddModal(true); // Ouvrir le modal
  };



  
  
  const handleDeleteCentre = async (centreId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/bepc/centre-examen/${centreId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      await fetchCentresBepc(); // Recharger la liste après suppression
      setSnackbar({
        open: true,
        message: 'Centre BEPC supprimé avec succès.',
        severity: 'success',
      });
    } catch (err) {
      console.error('Erreur lors de la suppression du centre BEPC :', err);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du centre BEPC.',
        severity: 'error',
      });
    }
  };
  

  return (
    <Box>
     {/* En-tête */}
     <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          p: 2,
          backgroundColor: 'primary.main',
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            textAlign: 'left',
          }}
        >
          Tableau de bord Administrateur BEPC
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{
            fontWeight: 'bold',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
        >
          Déconnexion
        </Button>
      </Box>

      {/* Bouton de téléchargement du rapport */}
      <Box sx={{ mb: 3}}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadReport}
        >
          Télécharger le Rapport BEPC
        </Button>

        <Button
        sx={{ ml: 2}}
  variant="contained"
  color="primary"
  onClick={() => setOpenAddModal(true)}
>
  Ajouter un Centre BEPC
</Button>




      </Box>

      {/* Résumé des statistiques */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, #e3f2fd, #e0f7fa)',
          borderRadius: '15px',
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#004d40',
            mb: 3,
            textAlign: 'center',
          }}
        >
          Résumé des Statistiques
        </Typography>
        <Grid container spacing={4}>
          {/* Total des utilisateurs */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: '#f1f8e9',
                borderRadius: '10px',
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}
              >
                Total des utilisateurs
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', color: '#388e3c' }}
              >
                {users.length}
              </Typography>
            </Paper>
          </Grid>

          {/* Total des saisies */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: '#ede7f6',
                borderRadius: '10px',
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#5e35b1', mb: 1 }}
              >
                Total des saisies
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', color: '#673ab7' }}
              >
                {users.reduce((total, user) => total + user.saisies, 0)}
              </Typography>
            </Paper>
          </Grid>

          {/* Montant total des paiements */}
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                background: '#fbe9e7',
                borderRadius: '10px',
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#d84315', mb: 1 }}
              >
                Montant total des paiements
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', color: '#e64a19' }}
              >
                {users.reduce((total, user) => total + user.montantTotal, 0)} FCFA
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    

      {/* Liste des utilisateurs */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6">Liste des utilisateurs BEPC</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage)

                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                  {user.isActive ? (
                    <Typography color="green">Actif</Typography>
                  ) : (
                    <Typography color="red">Inactif</Typography>
                  )}
                </TableCell>
                    <TableCell>{user.saisies || 0}</TableCell>
                    <TableCell>{user.montantTotal || 0} FCFA</TableCell>
                    <TableCell>
                      <Button
                      sx={{ mr: 2}}
                        variant="contained"
                        color={user.isActive ? 'success' : 'error'}
                        onClick={() => toggleUserStatus(user._id)}
                      >
                        {user.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                      sx={{ mr: 2}}
                        variant="contained"
                        color="primary"
                        onClick={() => handleGenerateCompleteReport(user._id)}
                      >
                        Rapport Complet
                      </Button>                      
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={userRowsPerPage}
          page={userPage}
          onPageChange={(event, newPage) => setUserPage(newPage)}
          onRowsPerPageChange={(event) => setUserRowsPerPage(parseInt(event.target.value, 10))}
        />


      </Paper>
      

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
  <Typography variant="h6">Liste des centres BEPC</Typography>
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nom du Centre</TableCell>
          <TableCell>Région</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {centresBepc
          .slice(centrePage * centreRowsPerPage, centrePage * centreRowsPerPage + centreRowsPerPage)

          .map((centre) => (
            <TableRow key={centre._id}>
              <TableCell>{centre.nom}</TableCell>
              <TableCell>{centre.region}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditCentre(centre)}
                  sx={{ mr: 1 }}
                >
                  Modifier
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteCentre(centre._id)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TableContainer>
  <TablePagination
  rowsPerPageOptions={[5, 10, 15]}
  component="div"
  count={centresBepc.length}
  rowsPerPage={centreRowsPerPage}
  page={centrePage}
  onPageChange={(event, newPage) => setCentrePage(newPage)}
  onRowsPerPageChange={(event) => setCentreRowsPerPage(parseInt(event.target.value, 10))}
/>
</Paper>


    








<Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
  <Box sx={{ padding: 4, bgcolor: 'white', borderRadius: 2 }}>
    <Typography variant="h5" gutterBottom>
      Ajouter un Centre BEPC
    </Typography>
    <form onSubmit={handleAddCentre}>
  <TextField
    label="Nom du Centre"
    name="nom"
    value={newCentre.nom}
    onChange={(e) => setNewCentre({ ...newCentre, nom: e.target.value })}
    fullWidth
    required
  />
  <TextField
    select
    label="Région"
    name="region"
    value={newCentre.region}
    onChange={(e) => setNewCentre({ ...newCentre, region: e.target.value })}
    fullWidth
    required
  >
    {['Agadez', 'Dosso', 'Maradi', 'Diffa', 'Zinder', 'Niamey', 'Tillabery', 'Tahoua'].map((region) => (
      <MenuItem key={region} value={region}>
        {region}
      </MenuItem>
    ))}
  </TextField>
  <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
    {isEditing ? 'Modifier' : 'Enregistrer'}
  </Button>
</form>

  </Box>
</Modal>



      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboardBEPC;
