
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook for navigation
import { Box, Typography, Paper, Container, Grid, TextField, Button, Modal } from '@mui/material';
//import PaymentIcon from '@mui/icons-material/Payment';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const InscriptionPageBEPC = () => {
  const navigate = useNavigate();  // Initialize navigation hook
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
  });

  const [openModal, setOpenModal] = useState(false);
  const [bordereauData, setBordereauData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bordereauDetails = {
      ...formData,
      matricule: `MAT-${Math.floor(Math.random() * 100000)}`, // Automatically generate a matricule
      montant: 10000, // Fixed amount for the example
      reference: `REF-${Date.now()}`,
      instructions: "Payez dans n'importe quelle banque agréée avec le numéro de référence fourni."
    };
    setBordereauData(bordereauDetails);
    setOpenModal(true); // Open the modal with bordereau details
  };


     // Function to handle logout
     const handleLogout = () => {
      localStorage.removeItem('token'); // Remove token from localStorage
      navigate('/login-bepc'); // Redirect to login page
    };


  //  const handleDownloadPDF = () => {
  //   const bordereauElement = document.getElementById('bordereauContent');
    
  //   // Hide the download button before rendering the PDF
  //   const downloadButton = bordereauElement.querySelector('.download-button');
  //   if (downloadButton) downloadButton.style.display = 'none';
  
  //   html2canvas(bordereauElement, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  
  //     const pdf = new jsPDF('portrait', 'mm', 'a4');
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const pageHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = pageWidth - 20; // Keep some padding
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  //     // Title
  //     pdf.setFontSize(22);
  //     pdf.setFont('helvetica', 'bold');
  //     pdf.text('Bordereau de Paiement', pageWidth / 2, 20, { align: 'center' });
  
  //     // Add Image (Bordereau Canvas)
  //     pdf.addImage(imgData, 'PNG', 10, 40, imgWidth, imgHeight);
  
  //     // Footer: Payment Instructions
  //     pdf.setFontSize(14);
  //     pdf.setFont('helvetica', 'normal');
  //     pdf.text('Veuillez régler les frais aux guichets agréés.', 10, pageHeight - 30);
  //     pdf.text('Merci de conserver ce bordereau pour le paiement.', 10, pageHeight - 20);
  
  //     // Download the PDF
  //     pdf.save(`Bordereau_Paiement_${bordereauData.nom}_${bordereauData.prenom}.pdf`);
  
  //     // Show the download button again after generating the PDF
  //     if (downloadButton) downloadButton.style.display = 'block';
  //   });
  // };
  

  
  const handleDownloadPDF = () => {
    const bordereauElement = document.getElementById('bordereauContent');
  
    // Hide the download button by setting display to 'none' temporarily
    const downloadButton = bordereauElement.querySelector('.download-button');
    if (downloadButton) downloadButton.style.display = 'none';
  
    html2canvas(bordereauElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
  
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = canvas.width * 0.264583; // Convert pixels to mm (1 px = 0.264583 mm)
      const imgHeight = canvas.height * 0.264583;
  
      const xOffset = (pageWidth - imgWidth) / 2; // Center horizontally
  
      // Add the captured canvas as an image
      pdf.addImage(imgData, 'PNG', xOffset, 10, imgWidth, imgHeight);
  
      // Download the PDF
      pdf.save(`Bordereau_Paiement_${bordereauData.nom}_${bordereauData.prenom}.pdf`);
  
      // Show the button again after PDF generation
      if (downloadButton) downloadButton.style.display = 'block';
    });
  };
  
  
  


  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={6} sx={{ padding: 5, borderRadius: 3, backgroundColor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
            Inscription au BEPC
          </Typography>
          {/* Logout button */}
          <Button variant="contained" sx={{ bgcolor: '#FF0000' }} onClick={handleLogout}>
            Déconnexion
          </Button>
        </Box>
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
                  label="Région"
                  name="regionEtablissement"
                  value={formData.regionEtablissement}
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
            </Grid>
          </Box>

          {/* Payment Section */}
          <Box textAlign="center">
            <Button variant="contained" sx={{ bgcolor: '#004d40' }} type="submit">
              Soumettre et Générer Bordereau
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Modal for Bordereau */}
 
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'white',
    p: 4,
    borderRadius: 2,
    boxShadow: 24,
    border: '2px solid #004d40',
    textAlign: 'center',
  }}>
    {bordereauData && (
      <div id="bordereauContent" style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
        {/* Modal Header */}
        <Typography variant="h5" gutterBottom sx={{ color: '#004d40', fontWeight: 'bold' }}>
          Bordereau de Paiement
        </Typography>
        <Typography variant="body2" sx={{ color: '#004d40', mb: 3 }}>
          Année Scolaire 2023-2024 - Examen BEPC
        </Typography>

        {/* Modal Content */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 1, textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Nom et Prénom: 
              <Typography component="span" sx={{ fontWeight: 'normal' }}>
                {` ${bordereauData.prenom} ${bordereauData.nom}`}
              </Typography>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Matricule:
              <Typography component="span" sx={{ fontWeight: 'normal' }}>
                {` ${bordereauData.matricule}`}
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ mb: 1, textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Montant des frais:
              <Typography component="span" sx={{ fontWeight: 'normal' }}>
                {` ${bordereauData.montant} FCFA`}
              </Typography>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Référence Paiement:
              <Typography component="span" sx={{ fontWeight: 'normal' }}>
                {` ${bordereauData.reference}`}
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Instructions:
              <Typography component="span" sx={{ fontWeight: 'normal' }}>
                {` ${bordereauData.instructions}`}
              </Typography>
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
              Payer dans les banques agréées suivantes :
            </Typography>
            <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
              <li>• Banque 1 : 1234567890</li>
              <li>• Banque 2 : 9876543210</li>
              <li>• Banque 3 : 1122334455</li>
            </ul>
          </Box>

          <Box sx={{ textAlign: 'left', padding: '10px', backgroundColor: '#e0f2f1', borderRadius: '5px', mt: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#004d40' }}>
              Veuillez présenter ce bordereau aux banques agréées pour le paiement.
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#004d40', mt: 1 }}>
              Merci de conserver ce bordereau pour vos archives.
            </Typography>
          </Box>
        </Box>

        {/* Modal Actions */}
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
