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
  MenuItem,
 
 
} from '@mui/material';
import axios from 'axios';
import { jsPDF } from 'jspdf';




const AdminDashboardCFEPD = () => {
 
 
 // Gestion des filtres et modal
 const [filterModalOpen, setFilterModalOpen] = useState(false);
 const [selectedUser, setSelectedUser] = useState(null);
 const [filterValues, setFilterValues] = useState({
   region: '',
   directionRegionale: '',
   inspectionRegionale: '',
   etablissement: '',
 });

 

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;


  //const [centres, setCentres] = useState([]); // Liste complète des centres
  const [paginatedCentres, setPaginatedCentres] = useState([]); // Centres affichés
  const [currentPageCentres, setCurrentPageCentres] = useState(0); // Page actuelle
  const rowsPerPageCentres = 5; // Nombre de lignes par page
  const [searchTerm, setSearchTerm] = useState(''); // Texte de recherche
  



  const [centreModalOpen, setCentreModalOpen] = useState(false);
  const [centreFormData, setCentreFormData] = useState({
  nom: '',
  region: '',
});


const [centres, setCentres] = useState([]);


const [editModalOpen, setEditModalOpen] = useState(false); // Gérer l'ouverture du modal
const [editFormData, setEditFormData] = useState({ _id: "", nom: "", region: "" }); // Données du formulaire




  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // Peut être 'success', 'error', 'warning', ou 'info'
  });




  const fetchCentres = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/centres`);
      setCentres(res.data); // Met à jour les centres dans le state
    } catch (err) {
      console.error("Erreur lors de la récupération des centres :", err);
    }
  };
  
  
  
  useEffect(() => {
    fetchCentres();
  }, []);


// Ajoutez ces lignes en haut de votre composant
 // Charger les données initiales
 const fetchUsers = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cfepdadmin/agents`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setUsers(res.data);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err);
  }
};

// Charger les données lors du premier rendu
useEffect(() => {
  fetchUsers();
}, []);



   // Fonction pour activer/désactiver un utilisateur
   const toggleUserStatus = async (userId) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/cfepdadmin/agents/${userId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      console.log('Réponse de l’API :', res.data);

      // Mettre à jour l'état local après le changement
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut :', err);
    }
  };
  
  


  

  
  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
  };
  

  // Gestion de la pagination
  // Gestion de la pagination
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };






 


 
  const handleGenerateCompleteReport = async (userId) => {
    if (!userId) {
      console.error('ID utilisateur manquant. Impossible de générer le rapport.');
      return;
    }
  
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cfepdadmin/agents/${userId}/report`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
  
      const { agent, inscriptions } = res.data;
  
      console.log('Données du rapport :', res.data);
  
      // Générer le PDF
      const pdf = new jsPDF();
      let yPosition = 10;
  
      // En-tête du rapport
      pdf.setFontSize(16);
      pdf.text('Rapport complet de l\'agent', 10, yPosition);
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text(`Nom de l'agent : ${agent.name}`, 10, yPosition);
      yPosition += 7;
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
          `Montant: ${inscription.montantPaiement} FCFA, Région: ${inscription.regionEtablissement}`,
          10,
          yPosition
        );
        yPosition += 7;
  
        // Vérifier si la page a suffisamment d'espace
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 10;
        }
      });
  
      // Télécharger le PDF
      pdf.save(`Rapport_Agent_${agent.name}.pdf`);
    } catch (err) {
      console.error('Erreur lors de la génération du rapport :', err);
    }
  };
  


  


 











// Mise à jour des filtres
const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilterValues((prev) => ({ ...prev, [name]: value }));
};

// Génération du rapport filtré
// const handleGenerateFilteredReport = async () => {
//   if (!selectedUser) {
//     console.error("ID utilisateur manquant.");
//     return;
//   }

//   console.log("ID utilisateur :", selectedUser);
//   console.log("Filtres envoyés :", filterValues);

//   try {
//     const res = await axios.post(
//       `${process.env.REACT_APP_API_URL}/api/cfepdadmin/agents/${selectedUser}/report/filtered`,
//       filterValues,
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       }
//     );

//     console.log("Données du rapport :", res.data);
//     const { agent, inscriptions } = res.data;
//     console.log('Données du rapport filtré :', res.data);

//     // Génération du PDF
//     const pdf = new jsPDF();
//     let yPosition = 10;

//     // En-tête
//     pdf.setFontSize(16);
//     pdf.text(`Rapport Filtré de l'Agent ${agent.name}`, 10, yPosition);
//     yPosition += 10;

//     pdf.setFontSize(12);
//     pdf.text(`Téléphone : ${agent.phone}`, 10, yPosition);
//     yPosition += 7;

//     pdf.text(`Total des saisies : ${agent.totalSaisies}`, 10, yPosition);
//     yPosition += 7;

//     pdf.text(`Montant total : ${agent.montantTotal} FCFA`, 10, yPosition);
//     yPosition += 10;

//     // Détails des inscriptions
//     pdf.setFontSize(14);
//     pdf.text('Inscriptions Filtrées :', 10, yPosition);
//     yPosition += 10;

//     pdf.setFontSize(10);
//     inscriptions.forEach((inscription, index) => {
//       pdf.text(
//         `${index + 1}. ${inscription.prenom} ${inscription.nom}, Classe: ${inscription.classe}, ` +
//         `Montant: ${inscription.montantPaiement} FCFA, Région: ${inscription.regionEtablissement}`,
//         10,
//         yPosition
//       );
//       yPosition += 7;

//       if (yPosition > 280) {
//         pdf.addPage();
//         yPosition = 10;
//       }
//     });

//     pdf.save(`Rapport_Filtré_Agent_${agent.name}.pdf`);
//   } catch (err) {
//     console.error('Erreur lors de la génération du rapport filtré :', err);
//   }
// };







const handleLogout = () => {
  // Supprime le token du stockage local
  localStorage.removeItem('token');
  
  // Redirige vers la page de connexion
  window.location.href = '/login-cfepd'; // Remplacez '/login' par le chemin exact de votre page de connexion
};





const handleAddCentre = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/centres`,
      centreFormData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await fetchCentres(); // Synchronisation complète après création

    setSnackbar({
      open: true,
      message: "Centre d'examen ajouté avec succès.",
      severity: "success",
    });
    setCentreModalOpen(false);
    setCentreFormData({ nom: "", region: "" }); // Réinitialiser le formulaire
  } catch (err) {
    console.error("Erreur lors de l'ajout du centre :", err);
    setSnackbar({
      open: true,
      message: "Erreur lors de l'ajout du centre.",
      severity: "error",
    });
  }
};






const handleCentreChange = (e) => {
  setCentreFormData({ ...centreFormData, [e.target.name]: e.target.value });
};






const handleEditCentre = (centre) => {
  console.log("Centre sélectionné pour modification :", centre); // Debugging
  setEditFormData(centre); // Remplir le formulaire avec les données du centre
  setEditModalOpen(true); // Ouvrir le modal
};





const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditFormData((prev) => ({ ...prev, [name]: value }));
};

// Fonction pour sauvegarder les modifications

const handleSaveCentre = async () => {
  try {
    const token = localStorage.getItem("token");

    // Appel API pour mettre à jour le centre
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/centres/${editFormData._id}`,
      editFormData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Centre mis à jour :", res.data);

    // Mettre à jour localement ou refetch les centres
    await fetchCentres();

    setSnackbar({
      open: true,
      message: "Centre d'examen mis à jour avec succès.",
      severity: "success",
    });

    setEditModalOpen(false); // Fermer le modal
  } catch (err) {
    console.error("Erreur lors de la mise à jour du centre :", err);
    setSnackbar({
      open: true,
      message: "Erreur lors de la mise à jour du centre.",
      severity: "error",
    });
  }
};



const handleDeleteCentre = async (centreId) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce centre ?')) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/centres/${centreId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbar({
        open: true,
        message: 'Centre d\'examen supprimé avec succès.',
        severity: 'success',
      });

      fetchCentres(); // Recharger les centres
    } catch (err) {
      console.error('Erreur lors de la suppression du centre :', err);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du centre.',
        severity: 'error',
      });
    }
  }
};



const updatePaginatedCentres = () => {
  const filtered = centres.filter((centre) =>
    centre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centre.region.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const startIndex = currentPageCentres * rowsPerPageCentres;
  setPaginatedCentres(filtered.slice(startIndex, startIndex + rowsPerPageCentres));
};



const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
  setCurrentPageCentres(0); // Réinitialiser à la première page après la recherche
};
useEffect(() => {
  updatePaginatedCentres();
}, [centres, searchTerm, currentPageCentres]);
  

const handleGenerateReportCFEPD = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/cfepdadmin/report/inscriptions`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );

    const { regions } = response.data;
    const pdf = new jsPDF();
    let yPosition = 10;

    // Titre principal
    pdf.setFontSize(16);
    pdf.text("Rapport des Inscriptions CFEPD", 10, yPosition);
    yPosition += 10;

    // Date de génération
    pdf.setFontSize(12);
    pdf.text(`Date : ${new Date().toLocaleDateString()}`, 10, yPosition);
    yPosition += 10;

    // Parcourir les régions
    Object.keys(regions).forEach((region) => {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Région : ${region}`, 10, yPosition);
      yPosition += 10;

      // Centres dans la région
      Object.keys(regions[region]).forEach((center) => {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "italic");
        pdf.text(`Centre : ${center}`, 20, yPosition);
        yPosition += 10;

        // Détails des inscriptions
        regions[region][center].forEach((inscription, index) => {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(
            `${index + 1}. Nom : ${inscription.nom}, Prénom : ${inscription.prenom}, Établissement : ${inscription.nomEtablissement}`,
            30,
            yPosition
          );

          yPosition += 7;

          // Gestion des sauts de page
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = 10;
          }
        });

        yPosition += 5; // Espace entre les centres
      });

      yPosition += 10; // Espace entre les régions
    });

    // Sauvegarde du fichier
    pdf.save("Rapport_CFEPD.pdf");
  } catch (error) {
    console.error("Erreur lors de la génération du rapport CFEPD :", error);
    alert("Impossible de générer le rapport. Veuillez réessayer.");
  }
};


  return (
    <Box>
     <Typography
  variant="h4"
  gutterBottom
  sx={{
    fontWeight: 'bold',
    color: '#004d40',
    textAlign: 'center',
    mb: 4,
    mt:5,
  }}
>
  Tableau de bord Administrateur CFEPD
</Typography>

<Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{
            fontWeight: 'bold',
            mr:2,
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
        >
          Déconnexion
        </Button>

 

<Button
  variant="contained"
  color="primary"
  onClick={handleGenerateReportCFEPD}
>
Télécharger le Rapport CFEPD
</Button>

<Button
  variant="contained"
  color="primary"
  sx={{ mt: 2, mb: 2, ml:2 }}
  onClick={() => setCentreModalOpen(true)}
>
  Ajouter un Centre d'Examen
</Button>

{/* Résumé Statistiques */}
<Paper
  elevation={6}
  sx={{
    p: 4,
    mb: 4,
    background: 'linear-gradient(135deg, #e3f2fd, #e0f7fa)',
    borderRadius: '15px',
  }}
>
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
        <Typography variant="h6" gutterBottom>
          Liste des utilisateurs CFEPD
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Saisies</TableCell>
                <TableCell>Montant Total (FCFA)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(
                  currentPage * rowsPerPage,
                  currentPage * rowsPerPage + rowsPerPage
                )
                .map((user) => (
                  <TableRow key={user.id}>
  <TableCell>{user.name}</TableCell>
  <TableCell>{user.phone}</TableCell>
  <TableCell>
    {user.isActive ? (
      <Typography color="green">Actif</Typography>
    ) : (
      <Typography color="red">Inactif</Typography>
    )}
  </TableCell>
  <TableCell>{user.saisies}</TableCell>
  <TableCell>{user.montantTotal}</TableCell>
  <TableCell>
        <Button
        sx={{mr:2}}
          variant="contained"
          color={user.isActive ? 'success' : 'error'}
        // onClick={() => toggleUserStatus(user.id)} // Vérifiez que `user.id` est défini
          onClick={() => toggleUserStatus(user._id)}
        >

          {user.isActive ? 'Désactiver' : 'Activer'}
        </Button>
        <Button
        variant="contained"
        color="primary"
        onClick={() => handleGenerateCompleteReport(user._id)}
      >
        Rapport Complet
      </Button>

      {/* <Button
  variant="contained"
  color="secondary"
  onClick={() => handleOpenFilterModal(user._id)} 
>
  Rapport Filtré
</Button> */}


  

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
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handlePageChange}
        />
      </Paper> 



      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
  <Typography variant="h6" gutterBottom>
    Centres d'Examen
  </Typography>
  <Box>
  <TextField
    label="Rechercher un centre"
    variant="outlined"
    fullWidth
    margin="normal"
    value={searchTerm}
    onChange={handleSearchChange}
  />
</Box>

<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Nom</TableCell>
        <TableCell>Région</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {paginatedCentres.map((centre) => (
        <TableRow key={centre._id}>
          <TableCell>{centre.nom}</TableCell>
          <TableCell>{centre.region}</TableCell>
          <TableCell>
            {/* Actions comme modifier/supprimer */}
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
  rowsPerPageOptions={[5, 10, 25]}
  component="div"
  count={centres.filter((centre) =>
    centre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centre.region.toLowerCase().includes(searchTerm.toLowerCase())
  ).length}
  rowsPerPage={rowsPerPageCentres}
  page={currentPageCentres}
  onPageChange={handlePageChange}
/>

</Paper>


      <Modal open={filterModalOpen} onClose={handleCloseFilterModal}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'white',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Filtrer les données avant le rapport
    </Typography>
    <Box>
      <TextField
        label="Région"
        name="region"
        fullWidth
        margin="normal"
        value={filterValues.region}
        onChange={handleFilterChange}
      />
      <TextField
        label="Direction Régionale"
        name="directionRegionale"
        fullWidth
        margin="normal"
        value={filterValues.directionRegionale}
        onChange={handleFilterChange}
      />
      <TextField
        label="Inspection Régionale"
        name="inspectionRegionale"
        fullWidth
        margin="normal"
        value={filterValues.inspectionRegionale}
        onChange={handleFilterChange}
      />
      <TextField
        label="Établissement"
        name="etablissement"
        fullWidth
        margin="normal"
        value={filterValues.etablissement}
        onChange={handleFilterChange}
      />
    </Box>
  
  </Box>
      </Modal>


    {/* Modal pour les filtres */}
    {/* <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "white",
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Filtrer les données avant le rapport
    </Typography>
    <Box>
      <TextField
        label="Région"
        name="region"
        fullWidth
        margin="normal"
        value={filterValues.region}
        onChange={handleFilterChange}
      />
      <TextField
        label="Direction Régionale"
        name="directionRegionale"
        fullWidth
        margin="normal"
        value={filterValues.directionRegionale}
        onChange={handleFilterChange}
      />
      <TextField
        label="Inspection Régionale"
        name="inspectionRegionale"
        fullWidth
        margin="normal"
        value={filterValues.inspectionRegionale}
        onChange={handleFilterChange}
      />
      <TextField
        label="Établissement"
        name="etablissement"
        fullWidth
        margin="normal"
        value={filterValues.etablissement}
        onChange={handleFilterChange}
      />
    </Box>
    <Box mt={2} textAlign="right">
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleGenerateFilteredReport(filterValues);
          setFilterModalOpen(false);
        }}
      >
        Générer le Rapport
      </Button>
    </Box>
  </Box>
</Modal> */}




<Modal open={centreModalOpen} onClose={() => setCentreModalOpen(false)}>

  
  
  
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'white',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Ajouter un Centre d'Examen
    </Typography>
    <Box>
      <TextField
        label="Nom du Centre"
        name="nom"
        fullWidth
        margin="normal"
        value={centreFormData.nom}
        onChange={handleCentreChange}
      />
      <TextField
        select
        label="Région"
        name="region"
        fullWidth
        margin="normal"
        value={centreFormData.region}
        onChange={handleCentreChange}
      >
        {['Agadez', 'Dosso', 'Maradi', 'Diffa', 'Zinder', 'Niamey', 'Tillabery', 'Tahoua'].map((region) => (
          <MenuItem key={region} value={region}>
            {region}
          </MenuItem>
        ))}
      </TextField>
    </Box>
    <Box mt={2} textAlign="right">
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCentre}
      >
        Ajouter
      </Button>
    </Box>
  </Box>
</Modal>;


{/* <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'white',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Modifier un Centre d'Examen
    </Typography>
    <Box>
      <TextField
        label="Nom du Centre"
        name="nom"
        fullWidth
        margin="normal"
        value={editFormData.nom}
        onChange={handleEditChange}
      />
      <TextField
        select
        label="Région"
        name="region"
        fullWidth
        margin="normal"
        value={editFormData.region}
        onChange={handleEditChange}
      >
        {['Agadez', 'Dosso', 'Maradi', 'Diffa', 'Zinder', 'Niamey', 'Tillabery', 'Tahoua'].map((region) => (
          <MenuItem key={region} value={region}>
            {region}
          </MenuItem>
        ))}
      </TextField>
    </Box>
    <Box mt={2} textAlign="right">
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveCentre}
      >
        Sauvegarder
      </Button>
    </Box>
  </Box>
</Modal> */}

<Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "white",
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Modifier le Centre d'Examen
    </Typography>
    <Box>
      <TextField
        label="Nom du Centre"
        name="nom"
        fullWidth
        margin="normal"
        value={editFormData.nom}
        onChange={handleEditChange}
      />
      <TextField
        select
        label="Région"
        name="region"
        fullWidth
        margin="normal"
        value={editFormData.region}
        onChange={handleEditChange}
      >
        {["Agadez", "Dosso", "Maradi", "Diffa", "Zinder", "Niamey", "Tillabery", "Tahoua"].map(
          (region) => (
            <MenuItem key={region} value={region}>
              {region}
            </MenuItem>
          )
        )}
      </TextField>
    </Box>
    <Box mt={2} textAlign="right">
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveCentre}
        sx={{ mr: 1 }}
      >
        Enregistrer
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setEditModalOpen(false)}
      >
        Annuler
      </Button>
    </Box>
  </Box>
</Modal>



    </Box>
  );
};
export default AdminDashboardCFEPD;
