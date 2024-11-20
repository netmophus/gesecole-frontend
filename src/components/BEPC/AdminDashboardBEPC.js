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
  Alert,
} from '@mui/material';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const AdminDashboardBEPC = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterValues, setFilterValues] = useState({
    region: '',
    directionRegionale: '',
    inspectionRegionale: '',
    etablissement: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Charger les utilisateurs BEPC
// Charger les données des utilisateurs BEPC
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
  // const handleGenerateCompleteReport = async (userId) => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/api/bepcadmin/agents/${userId}/report`,
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //       }
  //     );
  //     const { agent, inscriptions } = res.data;
  //     const pdf = new jsPDF();
  //     pdf.text(`Rapport de l'Agent : ${agent.name}`, 10, 10);
  //     // Ajoutez des détails supplémentaires au PDF ici.
  //     pdf.save(`Rapport_Agent_${agent.name}.pdf`);
  //   } catch (err) {
  //     console.error('Erreur lors de la génération du rapport complet :', err);
  //     setSnackbar({
  //       open: true,
  //       message: 'Erreur lors de la génération du rapport.',
  //       severity: 'error',
  //     });
  //   }
  // };


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
          `${index + 1}. ${inscription.prenom} ${inscription.nom}, Classe : ${inscription.classe}, ` +
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
  

  const handleOpenFilterModal = (userId) => {
    setSelectedUser(userId);
    setFilterModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleGenerateFilteredReport = async () => {
  //   try {
  //     const res = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/api/bepcadmin/agents/${selectedUser}/report/filtered`,
  //       filterValues,
  //       {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //       }
  //     );
  //     const { agent, inscriptions } = res.data;
  //     const pdf = new jsPDF();
  //     pdf.text(`Rapport Filtré de l'Agent : ${agent.name}`, 10, 10);
  //     // Ajoutez des détails supplémentaires au PDF ici.
  //     pdf.save(`Rapport_Filtré_Agent_${agent.name}.pdf`);
  //     setFilterModalOpen(false);
  //   } catch (err) {
  //     console.error('Erreur lors de la génération du rapport filtré :', err);
  //     setSnackbar({
  //       open: true,
  //       message: 'Erreur lors de la génération du rapport filtré.',
  //       severity: 'error',
  //     });
  //   }
  // };
  const handleGenerateFilteredReport = async () => {
    if (!selectedUser) {
      setSnackbar({
        open: true,
        message: 'Veuillez sélectionner un utilisateur avant de générer un rapport.',
        severity: 'warning',
      });
      return;
    }
  
    try {
      console.log("Filtres envoyés :", filterValues); // Debug pour vérifier les filtres envoyés
  
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bepcadmin/agents/${selectedUser}/report/filtered`,
        filterValues,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
  
      const { agent, inscriptions } = res.data;
  
      // Initialisation du PDF
      const pdf = new jsPDF();
      let yPosition = 10;
  
      // En-tête du rapport
      pdf.setFontSize(16);
      pdf.text(`Rapport Filtré de l'Agent : ${agent.name}`, 10, yPosition);
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
      pdf.text('Détails des inscriptions filtrées :', 10, yPosition);
      yPosition += 10;
  
      pdf.setFontSize(10);
      inscriptions.forEach((inscription, index) => {
        pdf.text(
          `${index + 1}. ${inscription.prenom} ${inscription.nom}, Classe : ${inscription.classe}, ` +
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
      pdf.save(`Rapport_Filtré_Agent_${agent.name}.pdf`);
  
      setSnackbar({
        open: true,
        message: 'Rapport filtré généré avec succès.',
        severity: 'success',
      });
  
      setFilterModalOpen(false); // Fermez le modal après la génération du rapport
    } catch (err) {
      console.error('Erreur lors de la génération du rapport filtré :', err);
  
      setSnackbar({
        open: true,
        message: 'Erreur lors de la génération du rapport filtré.',
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



  
  // const handleDownloadReport = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/api/bepc/inscription/report/inscriptions`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  
  //     const inscriptions = response.data;
  
  //     // Regrouper les inscriptions par région, direction régionale et inspection régionale
  //     const groupedData = inscriptions.reduce((acc, inscription) => {
  //       const { regionEtablissement, directionRegionale, inspectionRegionale } = inscription;
  
  //       if (!acc[regionEtablissement]) {
  //         acc[regionEtablissement] = {};
  //       }
  
  //       if (!acc[regionEtablissement][directionRegionale]) {
  //         acc[regionEtablissement][directionRegionale] = {};
  //       }
  
  //       if (!acc[regionEtablissement][directionRegionale][inspectionRegionale]) {
  //         acc[regionEtablissement][directionRegionale][inspectionRegionale] = [];
  //       }
  
  //       acc[regionEtablissement][directionRegionale][inspectionRegionale].push(inscription);
  
  //       return acc;
  //     }, {});
  
  //     const pdf = new jsPDF('landscape', 'mm', 'a4');
  
  //     // En-tête professionnel
  //     pdf.setFontSize(12);
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text("Ministère de l'Éducation Nationale", 10, 10);
  //     pdf.text("Rapport des Inscriptions BEPC par Région", 105, 20, { align: 'center' });
  //     pdf.setFont('helvetica', 'normal');
  //     pdf.setFontSize(10);
  //     pdf.text(`Date de génération : ${new Date().toLocaleDateString()}`, 270, 10, { align: 'right' });
  
  //     let startY = 30;
  
  //     // Générer le rapport hiérarchisé
  //     for (const [region, directions] of Object.entries(groupedData)) {
  //       pdf.setFont('helvetica', 'bold');
  //       pdf.text(`Région : ${region}`, 10, startY);
  //       startY += 10;
  
  //       for (const [direction, inspections] of Object.entries(directions)) {
  //         pdf.setFont('helvetica', 'italic');
  //         pdf.text(`Direction Régionale : ${direction}`, 20, startY);
  //         startY += 10;
  
  //         for (const [inspection, etablissementData] of Object.entries(inspections)) {
  //           pdf.setFont('helvetica', 'normal');
  //           pdf.text(`Inspection Régionale : ${inspection}`, 30, startY);
  //           startY += 10;
  
  //           // Ajouter les en-têtes du tableau
  //           pdf.setFont('helvetica', 'bold');
  //           const headers = [
  //             "Matricule",
  //             "Nom",
  //             "Prénom",
  //             "Classe",
  //             "Téléphone Parent",
  //             "Montant",
  //           ];
  //           const startX = 40;
  //           headers.forEach((header, index) => {
  //             pdf.text(header, startX + index * 35, startY);
  //           });
  
  //           pdf.setFont('helvetica', 'normal');
  //           startY += 10;
  
  //           // Ajouter les données des inscriptions
  //           etablissementData.forEach((inscription) => {
  //             pdf.text(inscription.matricule, startX, startY);
  //             pdf.text(inscription.nom, startX + 35, startY);
  //             pdf.text(inscription.prenom, startX + 70, startY);
  //             pdf.text(inscription.classe, startX + 105, startY);
  //             pdf.text(inscription.telephoneParent, startX + 140, startY);
  //             pdf.text(`${inscription.montantPaiement} FCFA`, startX + 175, startY);
  
  //             startY += 10;
  //             if (startY > 190) {
  //               pdf.addPage();
  //               startY = 20;
  //             }
  //           });
  
  //           startY += 10;
  //         }
  //       }
  //     }
  
  //     pdf.save('Rapport_Inscriptions_Par_Region.pdf');
  
  //     setSnackbar({
  //       open: true,
  //       message: 'Rapport téléchargé avec succès.',
  //       severity: 'success',
  //     });
  //   } catch (error) {
  //     console.error('Erreur lors du téléchargement du rapport:', error);
  //     setSnackbar({
  //       open: true,
  //       message: 'Erreur lors du téléchargement du rapport.',
  //       severity: 'error',
  //     });
  //   }
  // };
  

  // const handleDownloadReport = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_URL}/api/bepc/inscription/report/inscriptions`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  
  //     const inscriptions = response.data;
  
  //     // Regrouper les inscriptions par région, direction régionale, inspection régionale, établissement et classe
  //     const groupedData = inscriptions.reduce((acc, inscription) => {
  //       const { regionEtablissement, directionRegionale, inspectionRegionale, nomEtablissement, classe } = inscription;
  
  //       if (!acc[regionEtablissement]) {
  //         acc[regionEtablissement] = {};
  //       }
  
  //       if (!acc[regionEtablissement][directionRegionale]) {
  //         acc[regionEtablissement][directionRegionale] = {};
  //       }
  
  //       if (!acc[regionEtablissement][directionRegionale][inspectionRegionale]) {
  //         acc[regionEtablissement][directionRegionale][inspectionRegionale] = {};
  //       }
  
  //       if (!acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement]) {
  //         acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement] = {};
  //       }
  
  //       if (!acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement][classe]) {
  //         acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement][classe] = [];
  //       }
  
  //       acc[regionEtablissement][directionRegionale][inspectionRegionale][nomEtablissement][classe].push(inscription);
  
  //       return acc;
  //     }, {});
  
  //     const pdf = new jsPDF('landscape', 'mm', 'a4');
  
  //     // En-tête professionnel
  //     pdf.setFontSize(12);
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text("Ministère de l'Éducation Nationale", 10, 10);
  //     pdf.text("Rapport des Inscriptions BEPC par Région", 105, 20, { align: 'center' });
  //     pdf.setFont('helvetica', 'normal');
  //     pdf.setFontSize(10);
  //     pdf.text(`Date de génération : ${new Date().toLocaleDateString()}`, 270, 10, { align: 'right' });
  
  //     let startY = 30;
  
  //     // Générer le rapport hiérarchisé
  //     for (const [region, directions] of Object.entries(groupedData)) {
  //       pdf.setFont('helvetica', 'bold');
  //       pdf.text(`Région : ${region}`, 10, startY);
  //       startY += 10;
  
  //       for (const [direction, inspections] of Object.entries(directions)) {
  //         pdf.setFont('helvetica', 'italic');
  //         pdf.text(`Direction Régionale : ${direction}`, 20, startY);
  //         startY += 10;
  
  //         for (const [inspection, etablissements] of Object.entries(inspections)) {
  //           pdf.setFont('helvetica', 'normal');
  //           pdf.text(`Inspection Régionale : ${inspection}`, 30, startY);
  //           startY += 10;
  
  //           for (const [etablissement, classes] of Object.entries(etablissements)) {
  //             pdf.setFont('helvetica', 'bold');
  //             pdf.text(`Établissement : ${etablissement}`, 40, startY);
  //             startY += 10;
  
  //             for (const [classe, students] of Object.entries(classes)) {
  //               pdf.setFont('helvetica', 'italic');
  //               pdf.text(`Classe : ${classe}`, 50, startY);
  //               startY += 10;
  
  //               // Ajouter les en-têtes du tableau
  //               pdf.setFont('helvetica', 'bold');
  //               const headers = [
  //                 "Matricule",
  //                 "Nom",
  //                 "Prénom",
  //                 "Date Naiss.",
  //                 "Lieu Naiss.",
  //                 "Genre",
  //                 "Téléphone Parent",
  //                 "Montant",
  //               ];
  //               const startX = 60;
  //               headers.forEach((header, index) => {
  //                 pdf.text(header, startX + index * 30, startY);
  //               });
  
  //               pdf.setFont('helvetica', 'normal');
  //               startY += 10;
  
  //               // Ajouter les données des inscriptions
  //               students.forEach((inscription) => {
  //                 pdf.text(inscription.matricule, startX, startY);
  //                 pdf.text(inscription.nom, startX + 30, startY);
  //                 pdf.text(inscription.prenom, startX + 60, startY);
  //                 pdf.text(new Date(inscription.dateNaissance).toLocaleDateString(), startX + 90, startY);
  //                 pdf.text(inscription.lieuNaissance, startX + 120, startY);
  //                 pdf.text(inscription.genre, startX + 150, startY);
  //                 pdf.text(inscription.telephoneParent, startX + 180, startY);
  //                 pdf.text(`${inscription.montantPaiement} FCFA`, startX + 210, startY);
  
  //                 startY += 10;
  //                 if (startY > 190) {
  //                   pdf.addPage();
  //                   startY = 20;
  //                 }
  //               });
  
  //               startY += 10;
  //             }
  //           }
  //         }
  //       }
  //     }
  
  //     pdf.save('Rapport_Inscriptions_Par_Region.pdf');
  
  //     setSnackbar({
  //       open: true,
  //       message: 'Rapport téléchargé avec succès.',
  //       severity: 'success',
  //     });
  //   } catch (error) {
  //     console.error('Erreur lors du téléchargement du rapport:', error);
  //     setSnackbar({
  //       open: true,
  //       message: 'Erreur lors du téléchargement du rapport.',
  //       severity: 'error',
  //     });
  //   }
  // };
  






  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/bepc/inscription/report/inscriptions`,
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
          "Rapport des Inscriptions BEPC avec Paiement Confirmé",
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
  
      pdf.save('Rapport_Inscriptions_Par_Region.pdf');
  
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
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadReport}
        >
          Télécharger le Rapport BEPC
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
                .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
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
                        variant="contained"
                        color={user.isActive ? 'success' : 'error'}
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
                        onClick={() => handleOpenFilterModal(user._id)}
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
          onPageChange={(event, newPage) => setCurrentPage(newPage)}
        />
      </Paper>

      {/* Modal de filtrage */}
      <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, boxShadow: 24 }}>
          <Typography variant="h6" gutterBottom>
            Filtrer les données avant le rapport
          </Typography>
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
          <Box mt={2} textAlign="right">
            <Button variant="contained" color="primary" onClick={handleGenerateFilteredReport}>
              Générer le Rapport
            </Button>
          </Box>
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
