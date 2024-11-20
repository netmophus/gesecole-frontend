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

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // Peut être 'success', 'error', 'warning', ou 'info'
  });


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
          `${index + 1}. ${inscription.prenom} ${inscription.nom}, Classe: ${inscription.classe}, ` +
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
const handleGenerateFilteredReport = async () => {
  if (!selectedUser) {
    console.error("ID utilisateur manquant.");
    return;
  }

  console.log("ID utilisateur :", selectedUser);
  console.log("Filtres envoyés :", filterValues);

  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/cfepdadmin/agents/${selectedUser}/report/filtered`,
      filterValues,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    console.log("Données du rapport :", res.data);
    const { agent, inscriptions } = res.data;
    console.log('Données du rapport filtré :', res.data);

    // Génération du PDF
    const pdf = new jsPDF();
    let yPosition = 10;

    // En-tête
    pdf.setFontSize(16);
    pdf.text(`Rapport Filtré de l'Agent ${agent.name}`, 10, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.text(`Téléphone : ${agent.phone}`, 10, yPosition);
    yPosition += 7;

    pdf.text(`Total des saisies : ${agent.totalSaisies}`, 10, yPosition);
    yPosition += 7;

    pdf.text(`Montant total : ${agent.montantTotal} FCFA`, 10, yPosition);
    yPosition += 10;

    // Détails des inscriptions
    pdf.setFontSize(14);
    pdf.text('Inscriptions Filtrées :', 10, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    inscriptions.forEach((inscription, index) => {
      pdf.text(
        `${index + 1}. ${inscription.prenom} ${inscription.nom}, Classe: ${inscription.classe}, ` +
        `Montant: ${inscription.montantPaiement} FCFA, Région: ${inscription.regionEtablissement}`,
        10,
        yPosition
      );
      yPosition += 7;

      if (yPosition > 280) {
        pdf.addPage();
        yPosition = 10;
      }
    });

    pdf.save(`Rapport_Filtré_Agent_${agent.name}.pdf`);
  } catch (err) {
    console.error('Erreur lors de la génération du rapport filtré :', err);
  }
};




const handleOpenFilterModal = (userId) => {
  console.log("ID utilisateur pour le modal :", userId);
  setSelectedUser(userId);
  setFilterModalOpen(true);
};


const handleLogout = () => {
  // Supprime le token du stockage local
  localStorage.removeItem('token');
  
  // Redirige vers la page de connexion
  window.location.href = '/login-cfepd'; // Remplacez '/login' par le chemin exact de votre page de connexion
};



// const groupData = (data) => {
//   const grouped = {};

//   data.forEach((item) => {
//     const region = item.regionEtablissement || "Non spécifié";
//     const direction = item.directionRegionale || "Non spécifié";
//     const inspection = item.inspectionRegionale || "Non spécifié";
//     const etablissement = item.nomEtablissement || "Non spécifié";
//     const classe = item.classe || "Non spécifié";

//     if (!grouped[region]) grouped[region] = {};
//     if (!grouped[region][direction]) grouped[region][direction] = {};
//     if (!grouped[region][direction][inspection]) grouped[region][direction][inspection] = {};
//     if (!grouped[region][direction][inspection][etablissement]) {
//       grouped[region][direction][inspection][etablissement] = {};
//     }
//     if (!grouped[region][direction][inspection][etablissement][classe]) {
//       grouped[region][direction][inspection][etablissement][classe] = [];
//     }

//     grouped[region][direction][inspection][etablissement][classe].push(item);
//   });

//   return grouped;
// };






// const handleDownloadReport = async () => {
//   try {
//     console.log("Tentative de téléchargement du rapport CFEPD...");

//     const response = await axios.get(
//       `${process.env.REACT_APP_API_URL}/api/cfepd/inscription/report/inscriptions`,
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       }
//     );

//     const data = response.data;

//     if (!data || data.length === 0) {
//       alert("Aucune inscription à afficher dans le rapport.");
//       return;
//     }

//     console.log("Données reçues pour le rapport CFEPD :", data);

//     // Regrouper les données
//     const groupedData = groupData(data);
//     console.log("Données regroupées :", groupedData);

//     const pdf = new jsPDF('landscape', 'mm', 'a4');
//     const marginTop = 20;
//     const marginBottom = 20;
//     const marginLeft = 10;
//     const pageHeight = pdf.internal.pageSize.height;
//     const contentHeight = pageHeight - marginTop - marginBottom;
//     let startY = marginTop;

//     const addNewPage = () => {
//       pdf.addPage();
//       startY = marginTop;
//     };

//     const addPageHeader = () => {
//       pdf.setFontSize(12);
//       pdf.setFont('helvetica', 'bold');
//       pdf.text("Ministère de l'Éducation Nationale", marginLeft, startY);
//       pdf.text("Rapport des Inscriptions CFEPD avec Paiement Confirmé", pdf.internal.pageSize.width / 2, startY + 10, {
//         align: 'center',
//       });
//       pdf.setFontSize(10);
//       pdf.setFont('helvetica', 'normal');
//       pdf.text(`Date : ${new Date().toLocaleDateString()}`, pdf.internal.pageSize.width - marginLeft, startY, {
//         align: 'right',
//       });
//       startY += 30;
//     };

//     addPageHeader();

//     // Générer le PDF à partir des données regroupées
//     for (const [region, directions] of Object.entries(groupedData)) {
//       pdf.setFont('helvetica', 'bold');
//       pdf.text(`Région : ${region}`, marginLeft, startY);
//       startY += 10;

//       for (const [direction, inspections] of Object.entries(directions)) {
//         if (startY + 20 > contentHeight) {
//           addNewPage();
//           addPageHeader();
//         }
//         pdf.setFont('helvetica', 'italic');
//         pdf.text(`Direction Régionale : ${direction}`, marginLeft + 10, startY);
//         startY += 10;

//         for (const [inspection, etablissements] of Object.entries(inspections)) {
//           if (startY + 20 > contentHeight) {
//             addNewPage();
//             addPageHeader();
//           }
//           pdf.setFont('helvetica', 'normal');
//           pdf.text(`Inspection Régionale : ${inspection}`, marginLeft + 20, startY);
//           startY += 10;

//           for (const [etablissement, classes] of Object.entries(etablissements)) {
//             if (startY + 20 > contentHeight) {
//               addNewPage();
//               addPageHeader();
//             }
//             pdf.setFont('helvetica', 'bold');
//             pdf.text(`Établissement : ${etablissement}`, marginLeft + 30, startY);
//             startY += 10;

//             for (const [classe, inscriptions] of Object.entries(classes)) {
//               if (startY + 20 > contentHeight) {
//                 addNewPage();
//                 addPageHeader();
//               }
//               pdf.setFont('helvetica', 'italic');
//               pdf.text(`Classe : ${classe}`, marginLeft + 40, startY);
//               startY += 10;

//               if (Array.isArray(inscriptions)) {
//                 inscriptions.forEach((inscription) => {
//                   if (startY + 10 > contentHeight) {
//                     addNewPage();
//                     addPageHeader();
//                   }
//                   pdf.setFont('helvetica', 'normal');
//                   pdf.text(`${inscription.matricule}`, marginLeft + 50, startY);
//                   pdf.text(`${inscription.nom} ${inscription.prenom}`, marginLeft + 80, startY);
//                   pdf.text(new Date(inscription.dateNaissance).toLocaleDateString(), marginLeft + 140, startY);
//                   pdf.text(`${inscription.montantPaiement} FCFA`, marginLeft + 180, startY);
//                   startY += 10;
//                 });
//               }
//             }
//           }
//         }
//       }
//     }

//     pdf.save('Rapport_Inscriptions_CFEPD.pdf');
//   } catch (error) {
//     console.error("Erreur lors du téléchargement du rapport :", error);
//     alert("Erreur lors du téléchargement du rapport.");
//   }
// };



const handleDownloadReport = async () => {
  try {
    console.log("Tentative de téléchargement du rapport CFEPD...");

    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/cfepd/inscription/report/inscriptions`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const inscriptions = response.data;

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const marginTop = 20; // Marge supérieure
    const marginBottom = 20; // Marge inférieure
    const marginLeft = 10; // Marge gauche
    const marginRight = 10; // Marge droite
    const pageHeight = pdf.internal.pageSize.height; // Hauteur de la page
    const pageWidth = pdf.internal.pageSize.width; // Largeur de la page
    const contentHeight = pageHeight - marginTop - marginBottom; // Hauteur utilisable
    let startY = marginTop;

    // Fonction pour passer à une nouvelle page
    const addNewPage = () => {
      pdf.addPage();
      startY = marginTop;
    };

    // En-tête de la page
    const addPageHeader = () => {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text("Ministère de l'Éducation Nationale", marginLeft, startY);
      pdf.text(
        "Rapport des Inscriptions CFEPD avec Paiement Confirmé",
        pageWidth / 2,
        startY + 10,
        { align: 'center' }
      );
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Date de génération : ${new Date().toLocaleDateString()}`, pageWidth - marginRight, startY, {
        align: 'right',
      });
      startY += 30; // Ajuster la position après l'en-tête
    };

    // Appeler l'en-tête sur la première page
    addPageHeader();

    // Générer le rapport hiérarchisé
    for (const [region, directions] of Object.entries(
      inscriptions.reduce((acc, inscription) => {
        const { regionEtablissement, directionRegionale, inspectionRegionale, nomEtablissement, classe } =
          inscription;

        if (!acc[regionEtablissement]) acc[regionEtablissement] = {};
        if (!acc[regionEtablissement][directionRegionale]) acc[regionEtablissement][directionRegionale] = {};
        if (!acc[regionEtablissement][directionRegionale][inspectionRegionale])
          acc[regionEtablissement][directionRegionale][inspectionRegionale] = {};
        if (!acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement])
          acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement] = {};
        if (!acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement][classe])
          acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement][classe] = [];
        acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement][classe].push(inscription);
        return acc;
      }, {})
    )) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Région : ${region}`, marginLeft, startY);
      startY += 10;

      for (const [direction, inspections] of Object.entries(directions)) {
        if (startY + 20 > contentHeight) {
          addNewPage();
          addPageHeader();
        }
        pdf.setFont('helvetica', 'italic');
        pdf.text(`Direction Régionale : ${direction}`, marginLeft + 10, startY);
        startY += 10;

        for (const [inspection, etablissements] of Object.entries(inspections)) {
          if (startY + 20 > contentHeight) {
            addNewPage();
            addPageHeader();
          }
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Inspection Régionale : ${inspection}`, marginLeft + 20, startY);
          startY += 10;

          for (const [etablissement, classes] of Object.entries(etablissements)) {
            if (startY + 20 > contentHeight) {
              addNewPage();
              addPageHeader();
            }
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Établissement : ${etablissement}`, marginLeft + 30, startY);
            startY += 10;

            for (const [classe, students] of Object.entries(classes)) {
              if (startY + 20 > contentHeight) {
                addNewPage();
                addPageHeader();
              }
              pdf.setFont('helvetica', 'italic');
              pdf.text(`Classe : ${classe}`, marginLeft + 40, startY);
              startY += 10;

              // Ajouter les en-têtes du tableau
              const headers = [
                "Matricule",
                "Nom",
                "Prénom",
                "Date Naiss.",
                "Lieu Naiss.",
                "Genre",
                "Téléphone Parent",
                "Montant",
              ];
              const startX = marginLeft + 50;

              headers.forEach((header, index) => {
                pdf.text(header, startX + index * 30, startY);
              });

              startY += 10;

              // Ajouter les données des inscriptions
              students.forEach((inscription) => {
                if (startY + 10 > contentHeight) {
                  addNewPage();
                  addPageHeader();
                }
                pdf.text(inscription.matricule, startX, startY);
                pdf.text(inscription.nom, startX + 30, startY);
                pdf.text(inscription.prenom, startX + 60, startY);
                pdf.text(new Date(inscription.dateNaissance).toLocaleDateString(), startX + 90, startY);
                pdf.text(inscription.lieuNaissance, startX + 120, startY);
                pdf.text(inscription.genre, startX + 150, startY);
                pdf.text(inscription.telephoneParent, startX + 180, startY);
                pdf.text(`${inscription.montantPaiement} FCFA`, startX + 210, startY);

                startY += 10;
              });

              startY += 10;
            }
          }
        }
      }
    }

    pdf.save('Rapport_Inscriptions_CFEPD.pdf');

    setSnackbar({
      open: true,
      message: 'Rapport téléchargé avec succès.',
      severity: 'success',
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du rapport:', error);
    setSnackbar({
      open: true,
      message: 'Erreur lors du téléchargement du rapport.',
      severity: 'error',
    });
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
  onClick={handleDownloadReport}
  sx={{ mr: 2 , ml:2}}
>
  Télécharger le Rapport CFEPD
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

      <Button
  variant="contained"
  color="secondary"
  onClick={() => handleOpenFilterModal(user._id)} // Utilisez `user._id` ou la clé correcte
>
  Rapport Filtré
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
          rowsPerPage={rowsPerPage}
          page={currentPage}
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
    <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
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
</Modal>

    


    </Box>
  );
};
export default AdminDashboardCFEPD;
