
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  MenuItem,
  Grid,
  Modal,
  Snackbar,
  Alert,
 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
//import Pagination from "@mui/material/Pagination";
//import Stack from "@mui/material/Stack";
import TablePagination from '@mui/material/TablePagination';
import jsPDF from "jspdf";
import QRCode from 'qrcode';
import logoMinistere from '../../assets/images/logo-ministere.png'; // Remplacez par le chemin de votre logo

const InscriptionPageBEPC = () => {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "",
    autreNationalite: "",
    typeEnseignement: "",
    regionEtablissement: "",
    nomEtablissement:"",
    centreExamen: "",
    matricule: "",
    jury: "",
    numeroTable: "",
    typeCandidat: "",
    montantPaiement: 0,
    documents: {
      photoIdentite: null,
      acteNaissance: null,
      certificatNationalite: null,
    },
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalDocuments: 0,
  });
  

  const [centres, setCentres] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const navigate = useNavigate(); // Initialisation de la navigation
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  const [inscriptions, setInscriptions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
 
  const [rowsPerPage, setRowsPerPage] = useState(10); // Défaut à 10
 
  const [recuData, setRecuData] = useState(null); // Données du reçu
  const [isRecuModalOpen, setIsRecuModalOpen] = useState(false); // Contrôle du modal

  useEffect(() => {
    const fetchUserInscriptions = async () => {
      await fetchMyInscriptions(); // Récupère uniquement les saisies utilisateur
    };
    fetchUserInscriptions();
  }, []); // Exécute uniquement au montage
  

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/bepc/centre-examen`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Centres récupérés :", response.data); 
        setCentres(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des centres :", error);
      }
    };
    fetchCentres();
  }, []);


  useEffect(() => {
    const fetchInscriptions = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/bepc/inscription`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Données reçues:', response.data); // Vérifiez la structure ici
        setInscriptions(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions :", error);
      }
    };
  
    fetchInscriptions();
  }, []);

 
  useEffect(() => {
    if (editingId) {
      const fetchInscriptionDetails = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/api/bepc/inscription/${editingId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const data = response.data;
  
          setFormData({
            ...data,
            dateNaissance: data.dateNaissance?.split('T')[0],
            centreExamen: data.centreExamen?._id || "",
            typeCandidat: data.typeCandidat || "", // Ajouter type de candidat
            documents: data.documents || {}, // Inclure les documents joints
          });
          console.log("Données d'édition chargées :", data); // Debug
        } catch (error) {
          console.error("Erreur lors de la récupération des détails :", error);
        }
      };
      fetchInscriptionDetails();
    }
  }, [editingId]);
  
  

  const fetchPaginatedInscriptions = async (page = 1, limit = 10, search = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbarMessage("Vous devez être connecté pour charger les inscriptions.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      const response = await axios.get(`${apiBaseUrl}/api/bepc/inscription/paginated`, {
        params: { page, limit, search },
       
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { inscriptions, currentPage, totalPages, totalDocuments } = response.data;
  
      setInscriptions(inscriptions); // Met à jour les inscriptions
      setPagination({ currentPage, totalPages, totalDocuments }); // Met à jour la pagination
    } catch (error) {
      console.error("Erreur lors de la récupération des inscriptions paginées :", error);
      setSnackbarMessage("Erreur lors de la récupération des inscriptions paginées.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  

  useEffect(() => {
    // Utilisez fetchPaginatedInscriptions pour charger les données avec pagination
    fetchPaginatedInscriptions(currentPage, rowsPerPage, searchTerm);
  }, [currentPage, searchTerm]); // Recharge si la page ou le terme de recherche change
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };




  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      documents: { ...prevData.documents, [field]: file },
    }));
  };
  
  // const fetchInscriptions = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setSnackbarMessage("Vous devez être connecté pour charger les inscriptions.");
  //       setSnackbarSeverity("error");
  //       setSnackbarOpen(true);
  //       return;
  //     }
  
  //     const response = await axios.get(`${apiBaseUrl}/api/bepc/inscription/my-inscriptions`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  
  //     console.log("Données utilisateur connectées :", response.data);
  //     setInscriptions(response.data); // Utilisez uniquement les données de l'utilisateur connecté
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération des inscriptions :", error);
  //     setSnackbarMessage("Erreur lors de la récupération des inscriptions.");
  //     setSnackbarSeverity("error");
  //     setSnackbarOpen(true);
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    if (!token) {
      setSnackbarMessage("Veuillez vous connecter pour continuer.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "documents") {
        Object.entries(value).forEach(([docKey, file]) => {
          if (file) formDataToSend.append(docKey, file);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });
  
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/bepc/inscription`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSnackbarMessage("Inscription réussie !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      // Réinitialiser le formulaire
      setFormData({
        prenom: "",
        nom: "",
        dateNaissance: "",
        lieuNaissance: "",
        nationalite: "",
        autreNationalite: "",
        typeEnseignement: "",
        regionEtablissement: "",
        nomEtablissement: "",
        centreExamen: "",
        matricule: "",
        jury: "",
        numeroTable: "",
        typeCandidat: "",
        montantPaiement: 0,
        documents: {
          photoIdentite: null,
          acteNaissance: null,
          certificatNationalite: null,
        },
      });
  
      // Recharge uniquement les inscriptions utilisateur après l'ajout
    await fetchMyInscriptions();
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setSnackbarMessage("Une erreur est survenue lors de l'inscription.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  

 
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login-bepc');
  };


  const handleEdit = (id) => {
    const inscriptionToEdit = inscriptions.find((inscription) => inscription._id === id);
  
    setFormData({
      ...inscriptionToEdit,
      dateNaissance: inscriptionToEdit.dateNaissance?.split('T')[0], // Format ISO pour les champs date
      nationalite: inscriptionToEdit.nationalite || "",
      autreNationalite: inscriptionToEdit.autreNationalite || "",
      typeEnseignement: inscriptionToEdit.typeEnseignement || "",
      regionEtablissement: inscriptionToEdit.regionEtablissement || "",
      nomEtablissement: inscriptionToEdit.nomEtablissement || "",
      centreExamen: inscriptionToEdit.centreExamen || "",
      typeCandidat: inscriptionToEdit.typeCandidat || "",
      jury: inscriptionToEdit.jury || "",
      numeroTable: inscriptionToEdit.numeroTable || "",
      documents: inscriptionToEdit.documents || {}, // Assurez-vous que les documents existent
    });
  
    setEditingId(id);
  };
  
  
  

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/bepc/inscription/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setInscriptions((prevInscriptions) =>
          prevInscriptions.filter((inscription) => inscription._id !== id)
        );
        alert("Inscription supprimée avec succès.");
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression de l'inscription.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbarMessage("Vous devez être connecté pour mettre à jour les informations.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "documents") {
          Object.entries(value).forEach(([docKey, file]) => {
            if (file) formDataToSend.append(docKey, file);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });
  
      const response = await axios.put(
        `${apiBaseUrl}/api/bepc/inscription/${editingId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setSnackbarMessage("Inscription mise à jour avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      // Réinitialiser le formulaire
      setEditingId(null);
      setFormData({
        prenom: "",
        nom: "",
        dateNaissance: "",
        lieuNaissance: "",
        nationalite: "",
        autreNationalite: "",
        typeEnseignement: "",
        regionEtablissement: "",
        nomEtablissement: "",
        centreExamen: "",
        matricule: "",
        jury: "",
        numeroTable: "",
        typeCandidat: "",
        montantPaiement: 0,
        documents: {
          photoIdentite: null,
          acteNaissance: null,
          certificatNationalite: null,
        },
      });
  
      // Actualiser les inscriptions
      fetchMyInscriptions();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'inscription :", error);
      setSnackbarMessage("Une erreur est survenue lors de la mise à jour.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  



  const handleDownloadPDFByReference = async (referencePaiement) => {
    try {
      const { data } = await axios.get(
        `${apiBaseUrl}/api/bepc/inscription/recu/${referencePaiement}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      // Stocker les données du reçu et ouvrir le modal
      setRecuData(data);
      setIsRecuModalOpen(true);
    } catch (error) {
      console.error("Erreur lors de la récupération du reçu :", error);
      alert("Impossible de récupérer les données pour le reçu.");
    }
  };



 
  const handleDownloadPDF = async (data) => {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
  
    // Ajouter le logo
    const img = new Image();
    img.src = logoMinistere;
  
    img.onload = async () => {
      pdf.addImage(img, 'PNG', 20, 10, 30, 30); // Position et dimensions du logo
  
      // Titre principal
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const titleText = pdf.splitTextToSize(
        "Ministère de l'Éducation Nationale, de l'Alphabétisation, de l'Enseignement Professionnel et de la Promotion des Langues Nationales",
        130
      );
      pdf.text(titleText, 55, 20);
  
      pdf.setFontSize(18);
      pdf.text('Reçu de Paiement - BEPC', 105, 50, { align: 'center' });
  
      // Informations principales
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nom : ${data.nom}`, 20, 70);
      pdf.text(`Prénom : ${data.prenom}`, 20, 80);
      pdf.text(`Date de Naissance : ${new Date(data.dateNaissance).toLocaleDateString()}`, 20, 90);
      pdf.text(`Lieu de Naissance : ${data.lieuNaissance}`, 20, 100);
      pdf.text(`Nationalité : ${data.nationalite}`, 20, 110);
      pdf.text(`Type d'Enseignement : ${data.typeEnseignement}`, 20, 120);
      pdf.text(`Région de l'Établissement : ${data.regionEtablissement}`, 20, 130);
      pdf.text(`Nom de l'Établissement : ${data.nomEtablissement}`, 20, 140);
      pdf.text(`Centre d'Examen : ${data.centreExamen?.nom || 'Non spécifié'}`, 20, 150);
      pdf.text(`Montant Payé : ${data.montantPaiement} FCFA`, 20, 160);
      pdf.text(`Référence de Paiement : ${data.referencePaiement}`, 20, 170);
  
      // Message explicatif
      pdf.setFont('helvetica', 'italic');
      pdf.text(
        'Ce reçu atteste que le paiement a été effectué avec succès pour l\'examen BEPC. Conservez-le comme preuve officielle.',
        20,
        190,
        { maxWidth: 170 }
      );
      pdf.text(`Agent de Saisie: ${data.agentId?.name || 'Non spécifié'}`, 20, 210);

  
      // Générer le QR Code
      try {
        const qrData = `
  Nom : ${data.nom}
  Prénom : ${data.prenom}
  Référence de Paiement : ${data.referencePaiement}
  Centre : ${data.centreExamen?.nom || 'Non spécifié'}
  Montant : ${data.montantPaiement} FCFA
  Date de Naissance : ${new Date(data.dateNaissance).toLocaleDateString()}
  Lieu de Naissance : ${data.lieuNaissance}
  Nationalité : ${data.nationalite}
  Type d'Enseignement : ${data.typeEnseignement}
  Région de l'Établissement : ${data.regionEtablissement}
  Nom de l'Établissement : ${data.nomEtablissement}
        `.trim();
  
        const qrCodeDataURL = await QRCode.toDataURL(qrData);
  
        // Ajouter le QR code au PDF
        pdf.addImage(qrCodeDataURL, 'PNG', 150, 80, 40, 40); // Position et dimensions du QR code
      } catch (error) {
        console.error("Erreur lors de la génération du QR code :", error);
      }
  
      // Enregistrer le PDF
      pdf.save(`Recu_BEPC_${data.nom}_${data.prenom}.pdf`);
    };
  };
  

 
    const fetchMyInscriptions = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/bepc/inscription/my-inscriptions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Données utilisateur connectées :', response.data);
        setInscriptions(response.data); // Utilisez uniquement ces données
      } catch (error) {
        console.error('Erreur lors de la récupération des inscriptions :', error);
      }
    }; 
  
  useEffect(() => {
    const fetchUserInscriptions = async () => {
      await fetchMyInscriptions(); // Récupère uniquement les saisies utilisateur
    };
    fetchUserInscriptions();
  }, []); // Exécute uniquement au montage

    

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "#004d40", mb: 4 }}>
        Pré-inscription au BEPC
      </Typography>

       {/* Section des boutons en haut */}

  {/* Ligne supérieure contenant le bouton de déconnexion */}
  <Box
    sx={{
       display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
       mb: 3,
     }}
   >
    <Button
       variant="contained"
      sx={{
        bgcolor: '#FF0000',
         '&:hover': { bgcolor: '#CC0000' },
      }}
      onClick={handleLogout}
     >
      Déconnexion
     </Button>
   </Box>



      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, backgroundColor: "#f9fafb", marginBottom: 4 }}>
 
      <form onSubmit={handleSubmit}>

      <Typography variant="h5">{editingId ? "Modifier l'Inscription" : "Nouvelle Inscription"}</Typography>
  {/* Section : Informations Personnelles */}

  <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
      Informations Personnelles
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Grid container spacing={3}>
      {/* Prénom */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          fullWidth
          required
        />
      </Grid>

      {/* Nom */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          fullWidth
          required
        />
      </Grid>

      {/* Date de Naissance */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Date de Naissance"
          name="dateNaissance"
          type="date"
          value={formData.dateNaissance}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      {/* Lieu de Naissance */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Lieu de Naissance"
          name="lieuNaissance"
          value={formData.lieuNaissance}
          onChange={handleChange}
          fullWidth
          required
        />
      </Grid>

      {/* Nationalité */}

  
<Grid item xs={12} sm={6}>
  <TextField
    select
    label="Nationalité"
    name="nationalite"
    value={formData.nationalite}
    onChange={(e) => {
      const selectedValue = e.target.value;
      setFormData((prevData) => ({
        ...prevData,
        nationalite: selectedValue,
        autreNationalite: selectedValue === "Autre" ? "" : null,
      }));
    }}
    fullWidth
    required
  >
    <MenuItem value="">-- Sélectionnez une nationalité --</MenuItem>
    <MenuItem value="Nigérienne">Nigérienne</MenuItem>
    <MenuItem value="Autre">Autre</MenuItem>
  </TextField>
  {formData.nationalite === "Autre" && (
    <TextField
      label="Précisez la nationalité"
      name="autreNationalite"
      value={formData.autreNationalite}
      onChange={(e) =>
        setFormData((prevData) => ({
          ...prevData,
          autreNationalite: e.target.value,
        }))
      }
      fullWidth
      required
      sx={{ mt: 2 }}
    />
  )}
</Grid>





    
    </Grid>
  </AccordionDetails>
</Accordion>




  {/* Section : Informations Scolaires */}
  <Accordion sx={{ mt: 2 }}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
      Informations Scolaires
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Grid container spacing={3}>
      {/* Type d'Enseignement */}
      <Grid item xs={12} sm={6}>
  <TextField
    select
    label="Type d'Enseignement"
    name="typeEnseignement"
    value={formData.typeEnseignement}
    onChange={(e) => setFormData({ ...formData, typeEnseignement: e.target.value })}
    fullWidth
    required
  >
    <MenuItem value="">-- Sélectionnez le type d'enseignement --</MenuItem>
    <MenuItem value="Français">Français</MenuItem>
    <MenuItem value="Franco-arabe">Franco-arabe</MenuItem>
  </TextField>
</Grid>


      {/* Région */}
      <Grid item xs={12} sm={6}>
      <TextField
  select
  label="Région de l'Établissement"
  name="regionEtablissement"
  value={formData.regionEtablissement}
  onChange={(e) => {
    handleChange(e);
    setSelectedRegion(e.target.value);
    console.log("Région sélectionnée :", e.target.value); // Vérifiez ici
  }}
  fullWidth
  required
>
  <MenuItem value="">-- Sélectionnez une région --</MenuItem>
  {['Agadez', 'Dosso', 'Maradi', 'Diffa', 'Zinder', 'Niamey', 'Tillabery', 'Tahoua'].map((region) => (
    <MenuItem key={region} value={region}>
      {region}
    </MenuItem>
  ))}
</TextField>

      </Grid>





      
      {/* Centre d'Examen */}
      <Grid item xs={12} sm={6}>
     
  <TextField
    select
    label="Centre d'Examen"
    name="centreExamen"
    value={formData.centreExamen}
    onChange={(e) => {
      handleChange(e);
      console.log("Centre sélectionné :", e.target.value); // Vérifiez la valeur sélectionnée
    }}
    fullWidth
    required
  >
    <MenuItem value="">-- Sélectionnez un centre --</MenuItem>
    {centres
      .filter((centre) => !selectedRegion || centre.region === selectedRegion) // Filtrage
      .map((centre) => (
        <MenuItem key={centre._id} value={centre._id}>
          {centre.nom}
        </MenuItem>
      ))}
  </TextField>
</Grid>





   


      <Grid item xs={12} sm={6}>

      <TextField
  label="Nom de l'Établissement"
  name="nomEtablissement"
  value={formData.nomEtablissement}
  onChange={handleChange}
  fullWidth
  required
/>

</Grid>

      {/* Matricule */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Matricule"
          name="matricule"
          value={formData.matricule || ''}
          onChange={handleChange}
          fullWidth
          placeholder="Matricule (facultatif)"
        />
      </Grid>

      {/* Jury */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Jury"
          name="jury"
          value={formData.jury || ''}
          onChange={handleChange}
          fullWidth
          placeholder="Nom du jury (facultatif)"
        />
      </Grid>

      {/* Numéro de Table */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Numéro de Table"
          name="numeroTable"
          value={formData.numeroTable || ''}
          onChange={handleChange}
          fullWidth
          placeholder="Numéro de table (facultatif)"
        />
      </Grid>
    </Grid>
  </AccordionDetails>
</Accordion>


  {/* Section : Paiement */}
 
<Accordion sx={{ mt: 2 }}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
      Paiement
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
  <Grid container spacing={3}>
  {/* Type de Candidat */}
  <Grid item xs={12} sm={12}>
    <TextField
      select
      label="Type de Candidat"
      name="typeCandidat"
      value={formData.typeCandidat}
      onChange={(e) => {
        handleChange(e); // Mettre à jour le formData
        const selectedType = e.target.value;

        // Déterminer le montant en fonction du type de candidat
        const montant = selectedType === "Ecole publique"
          ? 5000
          : selectedType === "Ecole privée"
          ? 5500
          : selectedType === "Candidat libre national"
          ? 7500
          : selectedType === "Candidat libre étranger"
          ? 25000
          : 0;

        // Mettre à jour le formData avec le montant
        setFormData((prevData) => ({
          ...prevData,
          montantPaiement: montant,
        }));
      }}
      fullWidth
      required
      SelectProps={{
        native: true,
      }}
    >
      <option value="">-- Sélectionnez --</option>
      <option value="Ecole publique">Ecole publique</option>
      <option value="Ecole privée">Ecole privée</option>
      <option value="Candidat libre national">Candidat libre national</option>
      <option value="Candidat libre étranger">Candidat libre étranger</option>
    </TextField>
  </Grid>

  {/* Montant du Paiement */}
  <Grid item xs={12} sm={12}>
    <TextField
      label="Montant du Paiement"
      name="montantPaiement"
      type="number"
      value={formData.montantPaiement}
      fullWidth
      disabled // Désactivé pour empêcher la modification manuelle
    />
  </Grid>

  {/* Référence de Paiement */}
  <Grid item xs={12} sm={12}>
    <TextField
      label="Référence de Paiement"
      name="referencePaiement"
      value={formData.referencePaiement || ''}
      fullWidth
      disabled // Généré automatiquement par le backend
    />
  </Grid>
</Grid>

  </AccordionDetails>
</Accordion>


  {/* Section : Documents à Fournir */}
  <Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
      Documents à Fournir
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {['photoIdentite', 'acteNaissance', 'certificatNationalite'].map((field) => (
      <Box key={field} mb={2}>
        {formData.documents?.[field] ? (
          <a href={formData.documents[field]} target="_blank" rel="noopener noreferrer">
            Voir {field.replace(/([A-Z])/g, ' $1')}
          </a>
        ) : (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Aucun fichier joint pour {field.replace(/([A-Z])/g, ' $1')}
          </Typography>
        )}
        <input
          type="file"
          accept=".pdf, image/*"
          onChange={(e) => handleFileChange(e, field)}
        />
      </Box>
    ))}
  </AccordionDetails>
</Accordion>


  {/* Bouton de Soumission */}
  <Box textAlign="center" sx={{ mt: 4 }}>
  {/* Bouton pour la mise à jour */}
  {editingId && (
    <>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleUpdate}
        sx={{ px: 5, mr: 2 }}
      >
        Mettre à Jour
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        onClick={() => {
          setEditingId(null); // Réinitialise editingId
          setFormData({
            // Réinitialise les données du formulaire
            prenom: "",
            nom: "",
            dateNaissance: "",
            lieuNaissance: "",
            nationalite: "",
            autreNationalite: "",
            typeEnseignement: "",
            regionEtablissement: "",
            centreExamen: "",
            matricule: "",
            jury: "",
            numeroTable: "",
            typeCandidat: "",
            montantPaiement: 0,
            documents: {
              photoIdentite: null,
              acteNaissance: null,
              certificatNationalite: null,
            },
          });
        }}
        sx={{ px: 5 }}
      >
        Annuler
      </Button>
    </>
  )}

  {/* Bouton pour la création */}
  {!editingId && (
    <Button
      variant="contained"
      color="primary"
      size="large"
      type="submit"
      onClick={handleSubmit} // Appelle la fonction handleSubmit
      sx={{ px: 5 }}
    >
      Soumettre et Générer le Reçu
    </Button>
  )}
</Box>

</form>






      </Paper>



      <Paper elevation={3} sx={{ padding: 3 }}>
      <Grid item xs={12} sm={6}>
    <Typography variant="h4" gutterBottom>
      Liste des Inscriptions
    </Typography>
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      label="Rechercher"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)} // Met à jour le terme de recherche
      fullWidth
    />
  </Grid>



  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
         
          <TableCell>Nom</TableCell>
          <TableCell>Prénom</TableCell>
         
          <TableCell>Région</TableCell>
          <TableCell>Centre d'Examen</TableCell>
         
          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      {/* <TableBody>
        {inscriptions.map((inscription) => (
          <TableRow key={inscription._id}>
           
            <TableCell>{inscription.nom}</TableCell>
            <TableCell>{inscription.prenom}</TableCell>
           
            <TableCell>{inscription.regionEtablissement}</TableCell>
            <TableCell>{inscription.centreExamen?.nom || 'Non spécifié'}</TableCell>

            <TableCell align="center">
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: 1 }}
              onClick={() => handleEdit(inscription._id)}
            >
              Modifier
            </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{mr:2}}
                onClick={() => handleDelete(inscription._id)}
              >
                Supprimer
              </Button>
               
  <Button
    variant="outlined"
    color="primary"
    onClick={() => handleDownloadPDFByReference(inscription.referencePaiement)}
  >
    Reçu
  </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody> */}

<TableBody>
{console.log('Données affichéesssss :', inscriptions)} {/* Log pour vérifier */}
  {inscriptions.map((inscription) => (
    <TableRow key={inscription._id}>
      <TableCell>{inscription.nom}</TableCell>
      <TableCell>{inscription.prenom}</TableCell>
      <TableCell>{inscription.regionEtablissement}</TableCell>
      <TableCell>{inscription.centreExamen?.nom || "Non spécifié"}</TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 1 }}
          onClick={() => handleEdit(inscription._id)}
        >
          Modifier
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{ mr: 2 }}
          onClick={() => handleDelete(inscription._id)}
        >
          Supprimer
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDownloadPDFByReference(inscription.referencePaiement)}
        >
          Reçu
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>



    </Table>
  </TableContainer>

  {/* Pagination */}

  <TablePagination
  component="div"
  count={pagination.totalDocuments || 0} // Nombre total de documents
  page={currentPage - 1} // MUI commence à 0
  onPageChange={(event, newPage) => setCurrentPage(newPage + 1)} // Ajustement pour pagination backend
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={(event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Change la limite par page
    setCurrentPage(1); // Reviens à la première page après le changement
  }}
  rowsPerPageOptions={[10, 50, 100]} // Options pour la pagination
/>

  

 
</Paper>


<Modal open={isRecuModalOpen} onClose={() => setIsRecuModalOpen(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      bgcolor: 'white',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
      border: '2px solid #004d40',
    }}
  >
    {recuData ? (
      <>
        <Typography variant="h5" gutterBottom sx={{ color: '#004d40', fontWeight: 'bold' }}>
          Reçu de Paiement
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Prénom : {recuData.prenom}
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Nom : {recuData.nom}
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Référence de Paiement : {recuData.referencePaiement}
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Centre d'Examen : {recuData.centreExamen?.nom || 'Non spécifié'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Montant : {recuData.montantPaiement} FCFA
        </Typography>

        {/* Bouton pour télécharger le reçu */}
        <Button
          variant="contained"
          sx={{ mt: 2, bgcolor: '#004d40' }}
          onClick={() => handleDownloadPDF(recuData)}
        >
          Télécharger le Reçu
        </Button>
      </>
    ) : (
      <Typography variant="body1" sx={{ color: '#555', mt: 4 }}>
        Aucune donnée disponible.
      </Typography>
    )}
  </Box>
</Modal>



      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InscriptionPageBEPC;
