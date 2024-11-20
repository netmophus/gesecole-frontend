import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Alert, Snackbar, Container, Grid, TextField, Button, Modal } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { jsPDF } from 'jspdf';

import axios from 'axios';
import logoMinistere from '../../assets/images/logo-ministere.png'; // Import du logo

import QRCode from 'qrcode'; // Import du générateur de QR code

const InscriptionPageBEPC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    dateNaissance: '',
    lieuNaissance: '',
    genre: '',
    telephoneParent: '',
    emailParent: '',
    adresseParent: '',
    nomEtablissement: '',
    regionEtablissement: '',
    classe: '',
    directionRegionale: '',
    inspectionRegionale: '',
    montantPaiement: '', // Ajouter le champ de paiement
    documents: {
      certificatNaissance: null,
      certificatResidence: null,
      certificatScolarite: null,
      photoIdentite: null,
      pieceIdentiteParent: null,
      autresDocuments: null,
    }
  });
  const [openModal, setOpenModal] = useState(false);
 
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  const [recuData, setRecuData] = useState(null);
  const [matricule, setMatricule] = useState('');
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info'
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Données à envoyer :", formData); // Vérifiez ici si `typeCandidat` a la bonne valeur


    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour soumettre une inscription.");
      return navigate('/login-bepc');
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'documents') {
        Object.entries(value).forEach(([docKey, file]) => {
          if (file) {
            formDataToSend.append(docKey, file);
          }
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Réponse du backend après inscription :", response.data);


       // Afficher un message de succès
       setSnackbar({
        open: true,
        message: 'Inscription réussie avec succès !',
        severity: 'success',
      });

      setRecuData(response.data);
      setOpenModal(true);

    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);

       // Gérer les erreurs (exemple : duplication du matricule)
       if (err.response?.status === 409) {
        setSnackbar({
          open: true,
          message: 'Le matricule existe déjà. Veuillez vérifier vos informations.',
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Une erreur est survenue. Veuillez réessayer.',
          severity: 'error',
        });
      }


    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login-bepc');
  };


  const handleFileChange = (e, fieldName) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [fieldName]: e.target.files[0],
      }
    });
  };
 
  const handleGenerateReceipt = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!matricule) {
        alert("Veuillez entrer un matricule valide.");
        return;
      }
  
      const response = await axios.get(`${apiBaseUrl}/api/bepc/inscription/inscription/${matricule}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Données reçues pour le matricule :", response.data);

  
      const studentData = response.data;
      if (studentData) {
        handleDownloadPDF(studentData);
      } else {
        alert("Aucun élève trouvé avec le numéro de matricule fourni.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Aucun élève n'est associé à ce numéro de matricule.");
      } else {
        console.error("Erreur lors de la récupération des informations de l'élève :", error);
        alert("Une erreur est survenue lors de la récupération des informations de l'élève.");
      }
    }
  };
  
 


  const handleDownloadPDF = () => {
    if (!recuData) {
      alert("Aucune donnée disponible pour générer le PDF.");
      return;
    }
  
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
      pdf.text('Reçu de Paiement - BEPC', 105, 50, { align: 'center' });
  
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nom et Prénom: ${recuData.prenom} ${recuData.nom}`, 20, 70);
      pdf.text(`Matricule: ${recuData.matricule}`, 20, 80);
      pdf.text(`Date de Naissance: ${new Date(recuData.dateNaissance).toLocaleDateString()}`, 20, 90);
      pdf.text(`Établissement: ${recuData.nomEtablissement}`, 20, 100);
      pdf.text(`Région Établissement: ${recuData.regionEtablissement}`, 20, 110);
      pdf.text(`Classe: ${recuData.classe}`, 20, 120);
  
      pdf.setFont('helvetica', 'bold');
      pdf.text('Détails de Paiement:', 20, 130);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Type de Candidat: ${recuData.typeCandidat}`, 20, 140);
      pdf.text(`Montant: ${recuData.montantPaiement} FCFA`, 20, 150);
      pdf.text(`Référence Paiement: ${recuData.referencePaiement}`, 20, 170);
  
      
      pdf.setFont('helvetica', 'italic');
      pdf.text(
        'Ce reçu atteste le paiement effectué pour l\'inscription. Conservez-le précieusement comme preuve de règlement.',
        20,
        180,
        { maxWidth: 180 }
      );

      // Ajouter le nom de l'agent ici
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nom de l'Agent de Saisie: ${recuData.agentId?.name || 'Non spécifié'}`, 20, 160);
      
  
      const qrData = `Nom: ${recuData.nom} ${recuData.prenom}\nMatricule: ${recuData.matricule}\nRéférence Paiement: ${recuData.referencePaiement}`;
      try {
        const qrCodeDataURL = await QRCode.toDataURL(qrData);
        pdf.addImage(qrCodeDataURL, 'PNG', 150, 80, 40, 40);
        pdf.save(`Recu_Paiement_${recuData.nom}_${recuData.prenom}.pdf`);
      } catch (error) {
        console.error("Erreur lors de la génération du QR code:", error);
        alert("Échec de la génération du QR code.");
      }
    };
  
    img.onerror = (error) => {
      console.error("Erreur lors du chargement de l'image ou de la génération du PDF:", error);
      alert("Échec du chargement du logo. Vérifiez le chemin d'accès ou réessayez.");
    };
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>

     {/* Section des boutons en haut */}
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

  {/* Ligne inférieure contenant le reste des éléments */}
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        label="Matricule"
        value={matricule}
        onChange={(e) => setMatricule(e.target.value)}
        sx={{ mr: 2, width: '200px' }}
      />
      <Button
        variant="contained"
        onClick={handleGenerateReceipt}
        sx={{ padding: '8px 16px' }}
      >
        Générer le Reçu
      </Button>
    </Box>

    {/* Optionnel : Bouton Liste des inscriptions (décommenter si nécessaire) */}
    {/* <Button
      variant="contained"
      sx={{
        fontSize: '0.8rem',
        padding: '6px 12px',
        bgcolor: '#1976d2',
        '&:hover': { bgcolor: '#115293' },
      }}
      onClick={handleDownloadReport}
    >
      Liste des inscriptions
    </Button> */}
  </Box>
</Box>


    {/* Titre du formulaire */}
    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40', mb: 4 }}>
    Inscription au BEPC
  </Typography>

      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#f5f5f5' }}>


        <Typography variant="h6" sx={{ color: '#FF8C00', mb: 4 }}>
          Remplissez le formulaire pour vous inscrire à l'examen du BEPC. Un bordereau de paiement sera généré après validation.
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <Box mb={4}>
            <Typography variant="h5" sx={{ color: '#004d40', mb: 2 }}>
              <PersonIcon sx={{ mr: 1 }} /> Informations Personnelles
            </Typography>
            <Grid container spacing={2}>
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
                  label="Genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Parent/Guardian Information Section */}
          <Box mb={4}>
            <Typography variant="h5" sx={{ color: '#004d40', mb: 2 }}>
              <PersonIcon sx={{ mr: 1 }} /> Coordonnées du Parent/Tuteur
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Téléphone du Parent/Tuteur"
                  name="telephoneParent"
                  value={formData.telephoneParent}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Adresse"
                  name="adresseParent"
                  value={formData.adresseParent}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* School Information Section */}
          <Box mb={4}>
         
            <Grid container spacing={2}>
          


          {/* School Information Section */}
          <Box mb={4}>
            <Typography variant="h5" sx={{ color: '#004d40', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1 }} /> Informations Scolaires
            </Typography>
            <Grid container spacing={2}>
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

              
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  label="Région de l'Établissement"
                  name="regionEtablissement"
                  value={formData.regionEtablissement}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid> */}

<Grid item xs={12} sm={12}>
  <TextField
    select
    label="Région de l'Établissement"
    name="regionEtablissement"
    value={formData.regionEtablissement}
    onChange={handleChange}
    fullWidth
    required
    SelectProps={{
      native: true, // Pour un rendu natif du menu déroulant
    }}
  >
    <option value="">-- Sélectionnez une région --</option>
    <option value="Agadez">Agadez</option>
    <option value="Dosso">Dosso</option>
    <option value="Maradi">Maradi</option>
    <option value="Diffa">Diffa</option>
    <option value="Zinder">Zinder</option>
    <option value="Niamey">Niamey</option>
    <option value="Tillabery">Tillabery</option>
    <option value="Tahoua">Tahoua</option>
  </TextField>
</Grid>

              {/* Nouveau champ : Direction Régionale */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Direction Régionale"
                  name="directionRegionale"
                  value={formData.directionRegionale}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Nouveau champ : Inspection Régionale */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Inspection Régionale"
                  name="inspectionRegionale"
                  value={formData.inspectionRegionale}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  label="Région"
                  name="regionEtablissement"
                  value={formData.regionEtablissement}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Classe"
                  name="classe"
                  value={formData.classe}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          
          
          </Box>


{/* Payment Information Section */}
<Box mb={4}>
  <Typography variant="h5" sx={{ color: '#004d40', mb: 2 }}>
    Informations de Paiement
  </Typography>


  <Grid item xs={12} sm={12}>
  <TextField
    select
    label="Type de Candidat"
    name="typeCandidat"
    value={formData.typeCandidat}
    onChange={(e) => {
      handleChange(e); // Mettre à jour le formData
      const selectedType = e.target.value;
      console.log("Type de candidat sélectionné :", selectedType);

      // Mettre à jour le montant en fonction du type de candidat
      const montant = selectedType === "Ecole publique"
        ? 5000
        : selectedType === "Ecole privée"
        ? 5500
        : selectedType === "Candidat libre national"
        ? 7500
        : selectedType === "Candidat libre étranger"
        ? 25000
        : 0; // Valeur par défaut pour aucun type sélectionné
      
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


{/* <Grid item xs={12} sm={12}>
  <TextField
    label="Montant du Paiement"
    name="montantPaiement"
    type="number"
    value={formData.montantPaiement}
    fullWidth
    disabled // Désactiver pour éviter la modification manuelle
  />
</Grid> */}








  <Grid container spacing={2}>
    {/* <Grid item xs={12} sm={12}>
      <TextField
        label="Montant du Paiement"
        name="montantPaiement"
        type="number"
        value={formData.montantPaiement}
        onChange={handleChange}
        fullWidth
        required
      />
    </Grid> */}
  
<Grid item xs={12} sm={6}>
  <TextField
    label="Matricule"
    name="matricule"
    value={formData.matricule}
    onChange={handleChange}
    fullWidth
    required
  />
</Grid>
  </Grid>
</Box>




              <Grid item xs={12}>
  <Typography variant="h5" sx={{ color: '#004d40', mb: 2 }}>
    Documents à Fournir
  </Typography>
  {["certificatNaissance", "certificatResidence", "certificatScolarite", "photoIdentite", "pieceIdentiteParent", "autresDocuments"].map((field, index) => (
    <Box key={index} mb={2}>
      <input
        type="file"
        accept=".pdf, image/*"
        onChange={(e) => handleFileChange(e, field)}
      />
      <Typography variant="body2">{field.replace(/([A-Z])/g, ' $1')}</Typography>
    </Box>
  ))}
</Grid>

            </Grid>
          </Box>

          {/* Payment Section */}
          <Box textAlign="center">
            <Button variant="contained" sx={{ bgcolor: '#004d40' }} type="submit">
              Soumettre et Générer le reçu de paiement
            </Button>


            {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
          </Box>
        </form>
      </Paper>

      {/* Modal for Bordereau */}
 
 {/* Modal pour Reçu de Paiement */}
 <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',  // Moitié de la largeur de la page
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          border: '2px solid #004d40',
          textAlign: 'center',
        }}>
          {recuData && (
            <div id="recuContent" style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#004d40', fontWeight: 'bold' }}>
                Reçu de Paiement
              </Typography>
              <Typography variant="body2" sx={{ color: '#004d40', mb: 3 }}>
                Année Scolaire 2023-2024 - Examen BEPC
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ mb: 1, textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Nom et Prénom: 
                    <Typography component="span" sx={{ fontWeight: 'normal' }}>
                      {` ${recuData.prenom} ${recuData.nom}`}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Matricule:
                    <Typography component="span" sx={{ fontWeight: 'normal' }}>
                      {` ${recuData.matricule}`}
                    </Typography>
                  </Typography>
                </Box>









                <Box sx={{ mb: 1, textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Montant des frais:
                    <Typography component="span" sx={{ fontWeight: 'normal' }}>
                      {` ${recuData.montantPaiement} FCFA`}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Référence Paiement:
                    <Typography component="span" sx={{ fontWeight: 'normal' }}>
                      {` ${recuData.referencePaiement}`}
                    </Typography>
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px' }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#004d40' }}>
                    Ce reçu est valide pour le paiement à toute institution bancaire agréée.
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#004d40', mt: 1 }}>
                    Conservez ce reçu pour vos archives.
                  </Typography>
                </Box>




                {/* <Box sx={{ textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px' }}>
  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
    Nom de l'agent de Saisie: 
    <Typography component="span" sx={{ fontWeight: 'normal' }}>
      {recuData.agentName ? recuData.agentName : 'Non spécifié'}
    </Typography>
  </Typography>
</Box> */}


<Box sx={{ textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px' }}>
  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
    Nom de l'Agent de Saisie: 
    <Typography component="span" sx={{ fontWeight: 'normal' }}>
      {recuData.agentId?.name || 'Non spécifié'}
    </Typography>
  </Typography>
</Box>





              </Box>

              <Button 
                variant="contained" 
                sx={{ bgcolor: '#004d40', mt: 2, color: '#fff', '&:hover': { bgcolor: '#003d33' }, display: openModal ? 'block' : 'none' }} 
                onClick={handleDownloadPDF}
                className="download-button"
              >
                Télécharger en PDF
              </Button>
            </div>
          )}
        </Box>
      </Modal>


      

    </Container>
  );
};

export default InscriptionPageBEPC;
