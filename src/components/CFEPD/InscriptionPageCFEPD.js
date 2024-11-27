import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  Modal,
  Snackbar,
  Alert,
  Grid,
  Container,
  Accordion,
 
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  
} from '@mui/material';


import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import logoMinistere from '../../assets/images/logo-ministere.png';
import QRCode from 'qrcode';

const InscriptionPageCFEPD = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    dateNaissance: '',
    lieuNaissance: '',
    genre: '',
    nationalite: '',
    autreNationalite: '',
    typeEnseignement: '',
    regionEtablissement: '',
    centreExamen: '',
    nomEtablissement: '',   
    matricule: '', // Facultatif
    jury: '', // Facultatif
    numeroDeTable: '', // Facultatif
    documents: {
      certificatNaissance: null,
      photoIdentite: null,
      certificatNationalite: null,
      certificatScolarite: null,
    },
  });
  
  const [openModal, setOpenModal] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  const [recuData, setRecuData] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const [centres, setCentres] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');


  const [inscriptions, setInscriptions] = useState([]);

 


  const [searchTerm, setSearchTerm] = useState(''); // Pour la recherche
  const [currentPage, setCurrentPage] = useState(0); // Page actuelle
  const rowsPerPage = 5; // Nombre d'inscriptions par page


  const [editFormData, setEditFormData] = useState(null); // Données pour la modification
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // État pour afficher/masquer le modal

  const initialFormData = {
    prenom: '',
    nom: '',
    dateNaissance: '',
    lieuNaissance: '',
    genre: '',
    nationalite: '',
    autreNationalite: '',
    typeEnseignement: '',
    regionEtablissement: '',
    centreExamen: '',
    nomEtablissement: '',
    matricule: '', // Facultatif
    jury: '', // Facultatif
    numeroDeTable: '', // Facultatif
    documents: {
      certificatNaissance: null,
      photoIdentite: null,
      certificatNationalite: null,
      certificatScolarite: null,
    },
  };


  const [isRecuModalOpen, setIsRecuModalOpen] = useState(false);

  
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/centres`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCentres(response.data); // Stockez les centres dans l'état
      } catch (error) {
        console.error("Erreur lors du chargement des centres d'examen :", error);
      }
    };
  
    fetchCentres();
  }, []);
  

  
  
  const fetchInscriptions = async () => {
    try {
      console.log("Début de la récupération des inscriptions...");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cfepd/inscription`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      console.log("Inscriptions récupérées :", response.data);
  
      // Si `documents` n'existe pas ou est `null`, on le remplace par un objet vide
      const fixedInscriptions = response.data.map((inscription) => ({
        ...inscription,
        documents: inscription.documents || {}, // Ajoute un objet vide si `documents` est manquant
      }));
  
      // Mise à jour des inscriptions dans l'état
      setInscriptions(fixedInscriptions);
    } catch (error) {
      console.error("Erreur lors de la récupération des inscriptions :", error);
    }
  };
  




  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté pour soumettre une modification.');
      return;
    }
  
    try {
      if (!editFormData._id) {
        alert("Erreur : impossible de modifier sans un ID valide.");
        return;
      }

      const formDataToSend = new FormData();

// Ajoutez les champs non liés aux fichiers
Object.entries(editFormData).forEach(([key, value]) => {
  if (key !== "documents") {
    formDataToSend.append(key, value);
  }
});

// Ajoutez les fichiers ou leurs URLs existantes
Object.entries(editFormData.documents || {}).forEach(([field, file]) => {
  if (file instanceof File) {
    formDataToSend.append(field, file); // Nouveau fichier sélectionné
  } else if (typeof file === "string") {
    formDataToSend.append(field, file); // URL Cloudinary existante
  }
});

  
  


      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/cfepd/inscription/${editFormData._id}`,
        formDataToSend, // Utilisez le FormData préparé
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Indique que des fichiers sont envoyés
          },
        }
      );
      

    // Rechargez la liste après modification
  // fetchInscriptions();
  fetchUserInscriptions();
  
      // Met à jour localement les données
      setInscriptions((prev) =>
        prev.map((inscription) =>
          inscription._id === editFormData._id ? response.data : inscription
        )
      );



  
      setIsEditModalOpen(false); // Ferme le modal
      alert('Inscription mise à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la modification de l’inscription:', error);
      alert("Une erreur est survenue lors de la modification.");
    }
  };
  


  useEffect(() => {
    fetchInscriptions();
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour soumettre une inscription.");
      return navigate('/login-cfepd');
    }
  
    const sanitizedFormData = { ...formData };
    if (sanitizedFormData.nationalite === 'Nigérienne') {
      delete sanitizedFormData.autreNationalite;
    }
  
    const formDataToSend = new FormData();
    Object.entries(sanitizedFormData).forEach(([key, value]) => {
      if (key === 'documents') {
        Object.entries(value).forEach(([docKey, file]) => {
          if (file) {
            formDataToSend.append(docKey, file);
            console.log(`Fichier ajouté : ${docKey} ->`, file.name || file);
          }
        });
      } else {
        formDataToSend.append(key, value);
      }
    });
  
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/cfepd/inscription`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Mise à jour avec les données complètes via fetchInscriptionById
      if (response?.data?._id) {
        const inscriptionId = response.data._id;
  
        try {
          const fetchResponse = await axios.get(`${apiBaseUrl}/api/cfepd/inscription/${inscriptionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (fetchResponse?.data) {
            setRecuData(fetchResponse.data); // Utilise les données complètes pour recuData
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données complètes de l'inscription :", error);
          alert("Une erreur est survenue lors de la récupération des données complètes.");
        }
      }
  
      // Ouvre le modal pour afficher les informations
      setOpenModal(true);
  
      // Rafraîchissez les inscriptions
      //fetchInscriptions();
      fetchUserInscriptions();
      setFormData(initialFormData);
  
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
  
      if (err.response?.status === 409) {
        setSnackbarMessage(err.response.data.msg);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Une erreur est survenue lors de la soumission du formulaire.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };
  
  
  
  
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login-cfepd');
  };



  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file || prev.documents[field],
        },
      };
      console.log(`Nouveau fichier ajouté pour ${field}:`, file); // Log du fichier ajouté
      return updatedFormData;
    });
  };
  

  const handleDownloadPDF = async (data) => {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const img = new Image();
    img.src = logoMinistere;
  
    img.onload = async () => {
      pdf.addImage(img, 'PNG', 20, 10, 30, 30);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const titleText = pdf.splitTextToSize(
        "Ministère de l'Éducation Nationale, de l'Alphabétisation, de l'Enseignement Professionnel et de la Promotion des Langues Nationales",
        130
      );
      pdf.text(titleText, 55, 20);
  
      pdf.setFontSize(18);
      pdf.text('Reçu de Paiement - CFEPD', 105, 50, { align: 'center' });
  
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nom et Prénom: ${data.prenom} ${data.nom}`, 20, 70);
      // pdf.text(`Matricule: ${data.matricule || 'Non attribué'}`, 20, 80);
      pdf.text(`Date de Naissance: ${new Date(data.dateNaissance).toLocaleDateString()}`, 20, 90);
      pdf.text(`Lieu de Naissance: ${data.lieuNaissance}`, 20, 100);
      pdf.text(`Genre: ${data.genre}`, 20, 110);
      pdf.text(`Nationalité: ${data.nationalite}`, 20, 120);
      pdf.text(`Type d'Enseignement: ${data.typeEnseignement}`, 20, 130);
      pdf.text(`Région Établissement: ${data.regionEtablissement}`, 20, 140);
      pdf.text(`Nom de l'Établissement: ${data.nomEtablissement}`, 20, 150);
  
      // Vérifiez si le centre d'examen est disponible et incluez son nom
      if (data.centreExamen?.nom) {
        pdf.text(`Centre d'Examen: ${data.centreExamen.nom}`, 20, 160);
      } else {
        pdf.text("Centre d'Examen: Non spécifié", 20, 160);
      }
  
      pdf.setFont('helvetica', 'bold');
      pdf.text('Détails de Paiement:', 20, 170);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Montant: ${data.montantPaiement} FCFA`, 20, 180);
      pdf.text(`Référence de Paiement: ${data.referencePaiement}`, 20, 190);
  
      pdf.setFont('helvetica', 'italic');
      pdf.text(
        'Ce reçu atteste le paiement effectué pour l\'inscription. Conservez-le précieusement comme preuve de règlement.',
        20,
        210,
        { maxWidth: 180 },
        
      );
      pdf.text(`Agent de Saisie : ${data.agentId?.name || 'Non spécifié'}`, 20, 230);
      try {
        const qrData = `Nom: ${data.nom} ${data.prenom}\nDate de Naissance: ${new Date(data.dateNaissance).toLocaleDateString()}\nRéférence Paiement: ${data.referencePaiement}\nCentre: ${data.centreExamen?.nom || 'Non spécifié'}`;
        const qrCodeDataURL = await QRCode.toDataURL(qrData);
        pdf.addImage(qrCodeDataURL, 'PNG', 150, 80, 40, 40);
        pdf.save(`Recu_Paiement_${data.nom}_${data.prenom}.pdf`);
      } catch (error) {
        console.error("Erreur lors de la génération du QR code:", error);
        alert("Échec de la génération du QR code.");
      }
    };
  };
  
  


  const filteredInscriptions = inscriptions.filter((inscription) => {
    const fullName = `${inscription.prenom} ${inscription.nom}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  
  const paginatedInscriptions = filteredInscriptions.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );



  const handleEditClick = (inscription) => {
    setEditFormData({
      _id: inscription._id,
      prenom: inscription.prenom || '',
      nom: inscription.nom || '',
      dateNaissance: inscription.dateNaissance
        ? new Date(inscription.dateNaissance).toISOString().split('T')[0]
        : '',
      lieuNaissance: inscription.lieuNaissance || '',
      genre: inscription.genre || '',
      nationalite: inscription.nationalite || '',
      autreNationalite: inscription.autreNationalite || '',
      typeEnseignement: inscription.typeEnseignement || '',
      regionEtablissement: inscription.regionEtablissement || '',
      centreExamen: inscription.centreExamen?._id || '',
      nomEtablissement: inscription.nomEtablissement || '',
      matricule: inscription.matricule || '',
      
      // Copiez les documents existants depuis `inscription.documents`
    documents: {
      certificatNaissance: inscription.documents?.certificatNaissance || '', // Peut être une URL ou vide
      certificatScolarite: inscription.documents?.certificatScolarite || '',
      certificatNationalite: inscription.documents?.certificatNationalite || '',
      photoIdentite: inscription.documents?.photoIdentite || '',
    },
      
    });
    setIsEditModalOpen(true);
  };
  


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette inscription ?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cfepd/inscription/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        alert("Inscription supprimée avec succès !");
        // Mettre à jour la liste locale des inscriptions
        setInscriptions((prevInscriptions) =>
          prevInscriptions.filter((inscription) => inscription._id !== id)
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'inscription :", error);
      alert("Une erreur est survenue lors de la suppression. Veuillez réessayer.");
    }
  };
  


  const handleDownloadRecu = (recuData) => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `Reçu de Paiement\n\nNom: ${recuData.nom}\nPrénom: ${recuData.prenom}\nMontant: ${recuData.montantPaiement} FCFA\nCentre d'examen: ${recuData.centreExamen?.nom || 'Non spécifié'}\nRéférence: ${recuData.referencePaiement}`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Recu-${recuData.referencePaiement}.txt`;
    document.body.appendChild(element);
    element.click();
  };
  

  const handleDownloadPDFByReference = async (referencePaiement) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cfepd/inscription/recu/${referencePaiement}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      // Appeler la fonction existante pour générer le PDF avec les données récupérées
      handleDownloadPDF(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du reçu :", error);
      alert("Impossible de récupérer les données pour le reçu.");
    }
  };



  const fetchUserInscriptions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cfepd/inscription/inscriptions/mine`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
  
      const fixedInscriptions = response.data.map((inscription) => ({
        ...inscription,
        documents: inscription.documents || {}, // Ajoute un objet vide si `documents` est manquant
      }));
  
      // Met à jour les inscriptions dans l'état
      setInscriptions(fixedInscriptions);
    } catch (error) {
      console.error("Erreur lors de la récupération des inscriptions utilisateur :", error);
      alert("Impossible de charger vos inscriptions. Veuillez réessayer.");
    }
  };
  useEffect(() => {
    fetchUserInscriptions();
  }, []);
    
  

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      {/* Section des boutons en haut */}
     {/* Section des boutons et des champs */}
<Box sx={{ mb: 4 }}>
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
  </Box>


      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40', mb: 4 }}>
        pré-inscription au CFEPD
      </Typography>

      

      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, backgroundColor: '#f9fafb' }}>
  <Typography variant="h6" sx={{ color: '#004d40', mb: 3, fontWeight: 'bold' }}>
    Remplissez le formulaire pour vous inscrire à l'examen du CFEPD
  </Typography>
  <form onSubmit={handleSubmit}>
    {/* Section Informations Personnelles */}
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
          Informations Personnelles
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Nationalité"
              name="nationalite"
              value={formData.nationalite}
              onChange={handleChange}
              fullWidth
              required
              SelectProps={{ native: true }}
            >
              <option value="">-- Sélectionnez une nationalité --</option>
              <option value="Nigérienne">Nigérienne</option>
              <option value="Autre">Autre</option>
            </TextField>
          </Grid>
          {formData.nationalite === 'Autre' && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Précisez la nationalité"
                name="autreNationalite"
                value={formData.autreNationalite}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              fullWidth
              required
              SelectProps={{ native: true }}
            >
              <option value="">Sélectionner</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </TextField>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>

    {/* Section Informations Scolaires */}
    {/* <Accordion defaultExpanded sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
          Informations Scolaires
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Région"
              name="regionEtablissement"
              value={formData.regionEtablissement}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setFormData({ ...formData, regionEtablissement: e.target.value });
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Centre d'Examen"
              name="centreExamen"
              value={formData.centreExamen}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">-- Sélectionnez un centre --</MenuItem>
              {centres
                .filter((centre) => !selectedRegion || centre.region === selectedRegion)
                .map((centre) => (
                  <MenuItem key={centre._id} value={centre._id}>
                    {centre.nom}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion> */}

<Accordion  sx={{ mt: 2 }}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
      Informations Scolaires
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Grid container spacing={3}>
      {/* Nom de l'Établissement */}
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

      {/* Région */}
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Région"
          name="regionEtablissement"
          value={formData.regionEtablissement}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setFormData({ ...formData, regionEtablissement: e.target.value });
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
          onChange={handleChange}
          fullWidth
          required
        >
          <MenuItem value="">-- Sélectionnez un centre --</MenuItem>
          {centres
            .filter((centre) => !selectedRegion || centre.region === selectedRegion)
            .map((centre) => (
              <MenuItem key={centre._id} value={centre._id}>
                {centre.nom}
              </MenuItem>
            ))}
        </TextField>
      </Grid>

      {/* Type d'Enseignement */}
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Type d'Enseignement"
          name="typeEnseignement"
          value={formData.typeEnseignement}
          onChange={handleChange}
          fullWidth
          required
          SelectProps={{ native: true }}
        >
          <option value="">-- Sélectionnez le type d'enseignement --</option>
          <option value="Français">Français</option>
          <option value="Franco-arabe">Franco-arabe</option>
        </TextField>
      </Grid>

      {/* Matricule */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Matricule"
          name="matricule"
          value={formData.matricule || ''}
          onChange={handleChange}
          fullWidth
          placeholder="Entrez le matricule (facultatif)"
        />
      </Grid>
    </Grid>
  </AccordionDetails>
</Accordion>


    <Accordion  sx={{ mt: 2 }}>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
      Informations Complémentaires
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Grid container spacing={3}>
      {/* Montant */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Montant du Paiement"
          name="montantPaiement"
          type="number"
          value={formData.montantPaiement || 1000} // Par défaut 1000
          fullWidth
          disabled // Empêche l'édition manuelle
        />
      </Grid>

      {/* Jury */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Jury"
          name="jury"
          value={formData.jury || ''}
          onChange={(e) => setFormData({ ...formData, jury: e.target.value })}
          fullWidth
          placeholder="Exemple : Jury 1"
        />
      </Grid>

      {/* Numéro de Table */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Numéro de Table"
          name="numeroDeTable"
          value={formData.numeroDeTable || ''}
          onChange={(e) => setFormData({ ...formData, numeroDeTable: e.target.value })}
          fullWidth
          placeholder="Exemple : 12345"
        />
      </Grid>
    </Grid>
  </AccordionDetails>
</Accordion>


    {/* Section Documents */}
    <Accordion  sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ color: '#004d40', fontWeight: 'bold' }}>
          Documents à Fournir
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {['certificatNaissance', 'certificatScolarite', 'certificatNationalite', 'photoIdentite'].map((field) => (
          <Box key={field} mb={2}>
            <input
              type="file"
              accept=".pdf, image/*"
              onChange={(e) => handleFileChange(e, field)}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {field.replace(/([A-Z])/g, ' $1')}
            </Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    <Box textAlign="center" sx={{ mt: 4 }}>
      <Button variant="contained" color="primary" size="large" type="submit" sx={{ px: 5 }}>
        Soumettre et Générer le Reçu
      </Button>
    </Box>
  </form>
      </Paper>


<Paper
  elevation={6}
  sx={{
    padding: 3,
    marginTop: 5,
    borderRadius: 3,
    width: '100%',
    maxWidth: '100%', // Pour garantir l'extension maximale
    display: 'flex',
    flexDirection: 'column',
  }}
>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
    <TextField
      label="Rechercher une inscription"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ width: '300px' }}
    />
  </Box>

  <Typography variant="h5" gutterBottom sx={{ color: '#004d40', mb: 2 }}>
    Liste des Inscriptions
  </Typography>
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Prénom</TableCell>
          <TableCell>Nom</TableCell>
          <TableCell>Region</TableCell>
          <TableCell>Centre d'Examen</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {paginatedInscriptions.map((inscription) => (
          <TableRow key={inscription._id}>
            <TableCell>{inscription.prenom}</TableCell>
            <TableCell>{inscription.nom}</TableCell>
            <TableCell>{inscription.centreExamen?.region || 'Non spécifié'}</TableCell>
            <TableCell>{inscription.centreExamen?.nom || 'Non spécifié'}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditClick(inscription)}
              >
                Modifier
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(inscription._id)}
                sx={{ marginLeft: 1 }}
              >
                Supprimer
              </Button>

              {/* Bouton pour consulter/réimprimer le reçu */}
              <Button
              variant="outlined"
              color="primary"  
              sx={{ marginLeft: 1 }}         
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

  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mt: 2,
    }}
  >
    <Typography variant="body2">
      Page {currentPage + 1} sur {Math.ceil(filteredInscriptions.length / rowsPerPage)}
    </Typography>
    <Box>
      <Button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
        disabled={currentPage === 0}
      >
        Précédent
      </Button>
      <Button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredInscriptions.length / rowsPerPage) - 1)
          )
        }
        disabled={currentPage >= Math.ceil(filteredInscriptions.length / rowsPerPage) - 1}
      >
        Suivant
      </Button>
    </Box>
  </Box>
</Paper>

      

      {/* Modal for Bordereau */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
      maxHeight: '80vh',
      overflowY: 'auto',
      bgcolor: 'white',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
      border: '2px solid #004d40',
    }}
  >
    {recuData ? (
      <>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#004d40', fontWeight: 'bold', mb: 2 }}
        >
          Bordereau de Confirmation
        </Typography>

        <Box
          sx={{
            p: 3,
            border: '1px solid #ddd',
            borderRadius: '10px',
            mb: 4,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Informations du Candidat
          </Typography>
          <Typography variant="body1">
            Nom : <strong>{recuData.nom || 'Non spécifié'}</strong>
          </Typography>
          <Typography variant="body1">
            Prénom : <strong>{recuData.prenom || 'Non spécifié'}</strong>
          </Typography>
          {/* <Typography variant="body1">
            Matricule : <strong>{recuData.matricule || 'Non spécifié'}</strong>
          </Typography> */}
        </Box>

        <Box
          sx={{
            p: 3,
            border: '1px solid #ddd',
            borderRadius: '10px',
            mb: 4,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Informations du Centre d'Examen
          </Typography>
          <Typography variant="body1">
            Nom du Centre :{' '}
            <strong>{recuData.centreExamen?.nom || 'Non spécifié'}</strong>
          </Typography>
          <Typography variant="body1">
            Région :{' '}
            <strong>{recuData.centreExamen?.region || 'Non spécifié'}</strong>
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            border: '1px solid #ddd',
            borderRadius: '10px',
            mb: 4,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Informations de Paiement
          </Typography>
          <Typography variant="body1">
            Référence Paiement :{' '}
            <strong>{recuData.referencePaiement || 'Non spécifié'}</strong>
          </Typography>
          <Typography variant="body1">
            Montant Payé :{' '}
            <strong>{recuData.montantPaiement || 'Non spécifié'} FCFA</strong>
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 2, color: '#999', fontStyle: 'italic' }}
        >
          Merci de vérifier les informations et de conserver ce bordereau.
        </Typography>
      </>
    ) : (
      <Typography variant="body1" sx={{ color: '#555', mt: 4 }}>
        Aucune donnée disponible.
      </Typography>
    )}

    {/* Bouton de téléchargement */}
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        mt: 3,
        pt: 2,
        borderTop: '1px solid #ddd',
        backgroundColor: 'white',
        textAlign: 'center',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDownloadPDF(recuData)}
      >
        Télécharger le Bordereau
      </Button>
    </Box>
  </Box>
</Modal>








<Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
<Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%', // Ajustez la largeur en fonction de votre besoin
      maxHeight: '90vh', // Limite la hauteur maximale du modal
      overflowY: 'auto', // Permet le défilement vertical
      bgcolor: 'white',
      p: 4,
      borderRadius: 2,
      boxShadow: 24,
      border: '2px solid #004d40',
    }}
  >
    <form onSubmit={handleEditSubmit}>
      <Typography variant="h5" gutterBottom>
        Modifier l'Inscription
      </Typography>
      <Grid container spacing={2}>
        {/* Prénom */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Prénom"
            name="prenom"
            value={editFormData?.prenom || ""}
            onChange={(e) => setEditFormData({ ...editFormData, prenom: e.target.value })}
            fullWidth
            required
          />
        </Grid>

        {/* Nom */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nom"
            name="nom"
            value={editFormData?.nom || ""}
            onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })}
            fullWidth
            required
          />
        </Grid>

        {/* Date de naissance */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date de Naissance"
            name="dateNaissance"
            type="date"
            value={editFormData?.dateNaissance || ""}
            onChange={(e) => setEditFormData({ ...editFormData, dateNaissance: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>

        {/* Lieu de naissance */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Lieu de Naissance"
            name="lieuNaissance"
            value={editFormData?.lieuNaissance || ""}
            onChange={(e) => setEditFormData({ ...editFormData, lieuNaissance: e.target.value })}
            fullWidth
            required
          />
        </Grid>

        {/* Genre */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Genre"
            name="genre"
            value={editFormData?.genre || ""}
            onChange={(e) => setEditFormData({ ...editFormData, genre: e.target.value })}
            fullWidth
            required
          >
            <MenuItem value="Masculin">Masculin</MenuItem>
            <MenuItem value="Féminin">Féminin</MenuItem>
          </TextField>
        </Grid>

        {/* Nationalité */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Nationalité"
            name="nationalite"
            value={editFormData?.nationalite || ""}
            onChange={(e) => setEditFormData({ ...editFormData, nationalite: e.target.value })}
            fullWidth
            required
          >
            <MenuItem value="Nigérienne">Nigérienne</MenuItem>
            <MenuItem value="Autre">Autre</MenuItem>
          </TextField>
        </Grid>

        {/* Type d'enseignement */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Type d'Enseignement"
            name="typeEnseignement"
            value={editFormData?.typeEnseignement || ""}
            onChange={(e) => setEditFormData({ ...editFormData, typeEnseignement: e.target.value })}
            fullWidth
            required
          >
            <MenuItem value="Français">Français</MenuItem>
            <MenuItem value="Franco-arabe">Franco-arabe</MenuItem>
          </TextField>
        </Grid>

        {/* Région de l'établissement */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Région de l'Établissement"
            name="regionEtablissement"
            value={editFormData?.regionEtablissement || ""}
            onChange={(e) => setEditFormData({ ...editFormData, regionEtablissement: e.target.value })}
            fullWidth
            required
          >
            {['Agadez', 'Dosso', 'Maradi', 'Diffa', 'Zinder', 'Niamey', 'Tillabery', 'Tahoua'].map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Centre d'examen */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Centre d'Examen"
            name="centreExamen"
            value={editFormData?.centreExamen || ""}
            onChange={(e) => setEditFormData({ ...editFormData, centreExamen: e.target.value })}
            fullWidth
            required
          >
            {centres
              .filter((centre) => !editFormData?.regionEtablissement || centre.region === editFormData.regionEtablissement)
              .map((centre) => (
                <MenuItem key={centre._id} value={centre._id}>
                  {centre.nom}
                </MenuItem>
              ))}
          </TextField>
        </Grid>

        {/* Nom de l'établissement */}
        <Grid item xs={12}>
          <TextField
            label="Nom de l'Établissement"
            name="nomEtablissement"
            value={editFormData?.nomEtablissement || ""}
            onChange={(e) => setEditFormData({ ...editFormData, nomEtablissement: e.target.value })}
            fullWidth
            required
          />
        </Grid>



<Box mb={4}>
  <Typography variant="h6" gutterBottom>
    Documents à Fournir
  </Typography>
  {["certificatNaissance", "certificatScolarite", "certificatNationalite", "photoIdentite"].map((field, index) => (
    <Box key={index} mb={2}>
      {/* Vérifiez si un lien existe pour le document */}
      {editFormData?.documents?.[field] && typeof editFormData.documents[field] === "string" && (
        <Typography variant="body2">
          <a
            href={editFormData.documents[field]} // URL existante
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir {field.replace(/([A-Z])/g, " $1")} {/* Affichage lisible */}
          </a>
        </Typography>
      )}

      {/* Champ pour télécharger un nouveau fichier */}
      <input
        type="file"
        accept=".pdf, image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setEditFormData((prev) => ({
            ...prev,
            documents: {
              ...prev.documents,
              [field]: file || prev.documents?.[field], // Conserve l'existant si aucun fichier n'est sélectionné
            },
          }));
        }}
      />
    </Box>
  ))}
</Box>




      </Grid>


      <Box textAlign="center" mt={3}>
        <Button variant="contained" sx={{ bgcolor: '#004d40' }} type="submit">
          Enregistrer les modifications
        </Button>
      </Box>
    </form>
  </Box>
</Modal>

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
          onClick={() => handleDownloadRecu(recuData)}
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
  <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
    {snackbarMessage}
  </Alert>
</Snackbar>


    </Container>
  );
};

export default InscriptionPageCFEPD;
