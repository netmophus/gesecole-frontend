import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Container, Grid, Alert, Snackbar, TextField, Button, Modal } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
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
    telephoneParent: '',
    adresseParent: '',
    nomEtablissement: '',
    regionEtablissement: '',
    classe: '',
    directionRegionale: '',
    inspectionRegionale: '',
    montantPaiement: '',
    matricule: '', // Champ matricule ajouté ici
    documents: {
      certificatNaissance: null,
      photoIdentite: null,
      pieceIdentiteParent: null,
    },
  });
  const [openModal, setOpenModal] = useState(false);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  const [recuData, setRecuData] = useState(null);
  const [matricule, setMatricule] = useState('');
  


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  // Handler pour générer le rapport de liste des inscriptions CFEPD
//   const handleDownloadReport = async () => {
//     try {
//       console.log("Tentative de téléchargement du rapport CFEPD...");

//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cfepd/inscription/report/inscriptions`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       console.log("Réponse reçue du serveur pour le rapport:", response);

//       if (response.data && response.data.length > 0) {
//         console.log("Données du rapport :", response.data);

//         // Initialiser un nouveau document PDF
//         const pdf = new jsPDF('landscape', 'mm', 'a4');
        
//         // En-tête du PDF
//         pdf.setFontSize(12);
//         pdf.setFont('helvetica', 'bold');
//         pdf.text("Ministère de l'Éducation Nationale", 10, 10);
//         pdf.text("Rapport des Inscriptions CFEPD avec Paiement Confirmé", 105, 20, { align: 'center' });
//         pdf.setFont('helvetica', 'normal');
//         pdf.setFontSize(10);
//         pdf.text(`Date de génération : ${new Date().toLocaleDateString()}`, 270, 10, { align: 'right' });

//         // En-têtes de tableau
//         const headers = ["Matricule", "Nom", "Prénom", "Date Naiss.", "Lieu Naiss.", "Genre", "Téléphone Parent", "Montant"];
//         const startX = 10;
//         let startY = 40;
        
//         pdf.setFont('helvetica', 'bold');
//         headers.forEach((header, index) => {
//           pdf.text(header, startX + index * 35, startY);
//         });

//         pdf.setFont('helvetica', 'normal');
//         startY += 10;

//         // Ajout des données des inscriptions
//         response.data.forEach((inscription) => {
//           pdf.text(inscription.matricule, startX, startY);
//           pdf.text(inscription.nom, startX + 35, startY);
//           pdf.text(inscription.prenom, startX + 70, startY);
//           pdf.text(new Date(inscription.dateNaissance).toLocaleDateString(), startX + 105, startY);
//           pdf.text(inscription.lieuNaissance, startX + 140, startY);
//           pdf.text(inscription.genre, startX + 175, startY);
//           pdf.text(inscription.telephoneParent, startX + 210, startY);
//           pdf.text(`${inscription.montantPaiement} FCFA`, startX + 245, startY);

//           startY += 10;
//           if (startY > 190) { // Si la page est remplie, créer une nouvelle page
//             pdf.addPage();
//             startY = 20;
//           }
//         });

//         // Sauvegarder le PDF
//         pdf.save('Rapport_Inscriptions_CFEPD.pdf');
//       } else {
//         console.warn("Aucune donnée trouvée pour le rapport.");
//         alert("Aucune inscription à afficher dans le rapport.");
//       }
//     } catch (error) {
//       console.error("Erreur lors du téléchargement du rapport:", error);
//       alert("Erreur lors du téléchargement du rapport.");
//     }
// };



const handleGenerateReceipt = async () => {
  try {
      const token = localStorage.getItem('token');
      if (!matricule) {
          alert("Veuillez entrer un matricule valide.");
          return;
      }

      console.log("Tentative de génération du reçu avec le matricule :", matricule);
      
      const response = await axios.get(`${apiBaseUrl}/api/cfepd/inscription/inscription/${matricule}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      // Vérifiez si les données sont bien reçues
      if (response && response.status === 200 && response.data) {
          const studentData = response.data;
          console.log("Données de l'élève :", studentData);

          // Appeler la fonction de génération de PDF avec les données reçues
          handleDownloadPDF(studentData);
      } else {
          alert("Erreur: Aucune donnée n'a été trouvée pour ce matricule.");
      }
  } catch (error) {
      if (error.response) {
          if (error.response.status === 404) {
              alert("Aucun élève trouvé avec le matricule fourni. Veuillez vérifier le matricule et réessayer.");
          } else if (error.response.status === 401) {
              alert("Accès non autorisé. Veuillez vous connecter.");
          } else {
              console.error("Erreur serveur :", error);
              alert("Une erreur est survenue lors de la récupération des informations. Veuillez réessayer plus tard.");
          }
      } else {
          console.error("Erreur inconnue :", error);
          alert("Une erreur est survenue. Veuillez vérifier votre connexion et réessayer.");
      }
  }
};

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
        `${apiBaseUrl}/api/cfepd/inscription`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setRecuData(response.data);
      setOpenModal(true);
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

  const handleFileChange = (e, fieldName) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [fieldName]: e.target.files[0],
      },
    });
  };

  // const handleDownloadPDF = async (data) => {
  //   const pdf = new jsPDF('portrait', 'mm', 'a4');
  //   const img = new Image();
  //   img.src = logoMinistere;

  //   img.onload = async () => {
  //     pdf.addImage(img, 'PNG', 20, 10, 30, 30);
  //     pdf.setFontSize(10);
  //     pdf.setFont('helvetica', 'bold');
  //     const titleText = pdf.splitTextToSize(
  //       "Ministère de l'Éducation Nationale, de l'Alphabétisation, de l'Enseignement Professionnel et de la Promotion des Langues Nationales",
  //       130
  //     );
  //     pdf.text(titleText, 55, 20);
  //     pdf.setFontSize(18);
  //     pdf.text('Reçu de Paiement - CFEPD', 105, 50, { align: 'center' });
  //     pdf.setFontSize(12);
  //     pdf.setFont('helvetica', 'normal');
  //     pdf.text(`Nom et Prénom: ${data.prenom} ${data.nom}`, 20, 70);
  //     pdf.text(`Matricule: ${data.matricule}`, 20, 80);
  //     pdf.text(`Date de Naissance: ${new Date(data.dateNaissance).toLocaleDateString()}`, 20, 90);
  //     pdf.text(`Établissement: ${data.nomEtablissement}`, 20, 100);
  //     pdf.text(`Région Établissement: ${data.regionEtablissement}`, 20, 110);
  //     pdf.text(`Classe: ${data.classe}`, 20, 120);
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text('Détails de Paiement:', 20, 130);
  //     pdf.setFont('helvetica', 'normal');
  //     pdf.text(`Montant: ${data.montantPaiement} FCFA`, 20, 140);
  //     pdf.text(`Référence de Paiement: ${data.referencePaiement}`, 20, 150);

  //     const qrData = `Nom: ${data.nom} ${data.prenom}\nMatricule: ${data.matricule}\nRéférence Paiement: ${data.referencePaiement}`;
  //     try {
  //       const qrCodeDataURL = await QRCode.toDataURL(qrData);
  //       pdf.addImage(qrCodeDataURL, 'PNG', 150, 80, 40, 40);
  //       pdf.save(`Recu_Paiement_${data.nom}_${data.prenom}.pdf`);
  //     } catch (error) {
  //       console.error("Erreur lors de la génération du QR code:", error);
  //       alert("Échec de la génération du QR code.");
  //     }
  //   };
  // };

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
      pdf.text(`Matricule: ${data.matricule}`, 20, 80);
      pdf.text(`Date de Naissance: ${new Date(data.dateNaissance).toLocaleDateString()}`, 20, 90);
      pdf.text(`Établissement: ${data.nomEtablissement}`, 20, 100);
      pdf.text(`Région Établissement: ${data.regionEtablissement}`, 20, 110);
      pdf.text(`Classe: ${data.classe}`, 20, 120);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Détails de Paiement:', 20, 130);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Montant: ${data.montantPaiement} FCFA`, 20, 140);
      pdf.text(`Référence de Paiement: ${data.referencePaiement}`, 20, 150);
      
      pdf.setFont('helvetica', 'italic');
      pdf.text(
        'Ce reçu atteste le paiement effectué pour l\'inscription. Conservez-le précieusement comme preuve de règlement.',
        20,
        180,
        { maxWidth: 180 }
      );

      // Ajout du nom de l'agent de saisie
      if (data.agentId?.name) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Agent de saisie:', 20, 160);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${data.agentId.name}`, 90, 160);
      }
  
      const qrData = `Nom: ${data.nom} ${data.prenom}\nMatricule: ${data.matricule}\nRéférence Paiement: ${data.referencePaiement}`;
      try {
        const qrCodeDataURL = await QRCode.toDataURL(qrData);
        pdf.addImage(qrCodeDataURL, 'PNG', 150, 80, 40, 40);
        pdf.save(`Recu_Paiement_${data.nom}_${data.prenom}.pdf`);
      } catch (error) {
        console.error("Erreur lors de la génération du QR code:", error);
        alert("Échec de la génération du QR code.");
      }
    };
  };
  



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

  {/* Ligne inférieure contenant les champs et le bouton */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      flexWrap: 'wrap',
      ml: 2,
    }}
  >
    <TextField
      label="Matricule"
      value={matricule}
      onChange={(e) => setMatricule(e.target.value)}
      sx={{ width: '250px' }}
    />
    <Button
      variant="contained"
      onClick={handleGenerateReceipt}
      sx={{ padding: '10px 20px' }}
    >
      Générer le Reçu
    </Button>
  </Box>
</Box>


      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40', mb: 4 }}>
        pré-inscription au CFEPD
      </Typography>

      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" sx={{ color: '#FF8C00', mb: 4 }}>
          Remplissez le formulaire pour vous inscrire à l'examen du CFEPD. Un bordereau de paiement sera généré après validation.
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Section Informations Personnelles */}
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

          {/* Section Coordonnées Parent */}
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

          {/* Section Informations Scolaires */}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Région de l'Établissement"
                  name="regionEtablissement"
                  value={formData.regionEtablissement}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
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

              {/* Nouveau champ pour le Matricule */}
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
           {/* Ajout de la section paiement */}
           <Box mb={4}>
            <Typography variant="h5" sx={{ color: '#004d40', mb: 2 }}>
              Informations de Paiement
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Montant du Paiement"
                  name="montantPaiement"
                  type="number"
                  value={formData.montantPaiement}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Box>


          {/* Section Documents */}
          <Box mb={4}>
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
          </Box>

         

          {/* Payment Section */}
          <Box textAlign="center">
            <Button variant="contained" sx={{ bgcolor: '#004d40' }} type="submit">
              Soumettre et Générer le reçu de paiement
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Modal for Bordereau */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
      textAlign: 'center',
    }}
  >
    {recuData && (
      <div id="recuContent" style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#004d40', fontWeight: 'bold' }}>
          Reçu de Paiement
        </Typography>
        <Typography variant="body2" sx={{ color: '#004d40', mb: 3 }}>
          Année Scolaire 2024-2025 - Examen CFEPD
        </Typography>
        
        {/* Affichage des informations clés */}
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#004d40', mb: 2 }}>
          Nom de l'Agent de Saisie : {recuData.agentId?.name || 'Non spécifié'}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#004d40', mb: 2 }}>
          Nom du Candidat : {recuData.prenom} {recuData.nom}
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Matricule : {recuData.matricule}
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Montant Payé : {recuData.montantPaiement} FCFA
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
          Référence de Paiement : {recuData.referencePaiement}
        </Typography>

        <Button
          variant="contained"
          sx={{ bgcolor: '#004d40', mt: 2, color: '#fff', '&:hover': { bgcolor: '#003d33' } }}
          onClick={() => handleDownloadPDF(recuData)}
        >
          Télécharger en PDF
        </Button>
      </div>
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
