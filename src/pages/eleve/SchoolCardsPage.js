
import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box, Button } from '@mui/material'; 
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
//import Barcode from 'react-barcode';
import { QRCodeCanvas } from 'qrcode.react';
import { InfoOutlined } from '@mui/icons-material'; 
import { useNavigate } from 'react-router-dom';

const SchoolCardsPage = () => {
  const navigate = useNavigate();

  const [schoolCards, setSchoolCards] = useState([]);
  const { user } = useContext(AuthContext);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    const fetchSchoolCards = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/students/school-cards`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          }
        });
        setSchoolCards(response.data.cards);
      } catch (err) {
        console.error('Erreur lors de la récupération des cartes scolaires:', err);
      }
    };

    fetchSchoolCards();
  }, [user, apiBaseUrl]);

  const handleDeleteAllCards = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les cartes scolaires ?')) {
      try {
        await axios.delete(`${apiBaseUrl}/api/students/school-cards`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          }
        });
        setSchoolCards([]);
        alert('Toutes les cartes scolaires ont été supprimées avec succès.');
      } catch (err) {
        console.error('Erreur lors de la suppression des cartes scolaires:', err);
        alert('Erreur lors de la suppression des cartes scolaires.');
      }
    }
  };

  return (
    <Container sx={{ marginTop: '20px', marginBottom: '20px' }}>

 {/* Bouton de retour au dashboard */}
 <Grid item xs={12}>
    <Button
      variant="outlined"
      onClick={() => navigate('/etablissement/dashboardPage')}
      sx={{
        marginTop: 2,        
        marginLeft: 2,
        marginBottom: 2,
        backgroundColor: '#004d40',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#00332d',
          color: '#fff',
        },
        borderRadius: 2,
        padding: '10px 20px',
      }}
    >
      Retour au Dashboard
    </Button>
  </Grid>


      {schoolCards.length > 0 && (
        <Box mb={3}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteAllCards}
          >
            Supprimer Toutes les Cartes Scolaires
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {schoolCards.length > 0 ? (
          schoolCards.map((card) => {
            const student = card.student?._doc || card.student;
            const establishment = card.establishment?._doc || card.establishment;

            const qrCodeContent = JSON.stringify({
              matricule: student?.matricule || 'N/A',
              firstName: student?.firstName || 'N/A',
              lastName: student?.lastName || 'N/A',
              class: student?.classId?.name || 'N/A',
              establishment: establishment?.name || 'N/A',
              loginUrl: `${apiBaseUrl}/login?matricule=${student?.matricule || ''}`
            });

            console.log('QR Code Content:', qrCodeContent);

            return (
              <Grid item xs={12} sm={6} md={4} key={card._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box flex={1}>
                        <img
                          src={student?.photo ? `${apiBaseUrl}/${student.photo}` : 'https://via.placeholder.com/150'}
                          alt={`${student?.firstName || 'N/A'} ${student?.lastName || 'N/A'}`}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box flex={2} textAlign="center">
                        <Typography variant="subtitle1">République du Niger</Typography>
                        <Typography variant="body2">Ministère de l'Éducation Nationale</Typography>
                        <Typography variant="body2" gutterBottom>Carte d'Identité Scolaire</Typography>
                        <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                          <strong>Année Académique :</strong>
                          {establishment?.academicYears && establishment.academicYears.length > 0
                            ? `${establishment.academicYears[0].yearId?.startYear} - ${establishment.academicYears[0].yearId?.endYear}`
                            : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Card sx={{ flex: 1, marginRight: '2px' }}>
                        <CardContent>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Identifiant :</strong> {card.cardNumber}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Nom :</strong> {student?.lastName || 'N/A'}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Prénom :</strong> {student?.firstName || 'N/A'}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Né le :</strong> {student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A'}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Téléphone de la mère :</strong> {student?.motherPhone || 'N/A'}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Adresse des parents :</strong> {student?.parentsAddress || 'N/A'}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ flex: 1, marginLeft: '2px' }}>
                        <CardContent>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Classe :</strong> {student?.classId?.name || 'N/A'}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Matricule :</strong> {student?.matricule || 'N/A'}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Établissement :</strong> {establishment?.name || 'N/A'}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '0.7rem' }}>
                            <strong>Téléphone de l'établissement :</strong> {establishment?.phoneNumber || 'N/A'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                      {/* <Box>
                        <Barcode value={card.barcode || '123456789'} width={1} height={30} />
                      </Box> */}
                      <Box>
                        <QRCodeCanvas value={qrCodeContent} size={80} />
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="body2" style={{ fontSize: '0.8rem' }}>Signature</Typography>
                        <Typography variant="body2" style={{ fontSize: '0.8rem' }}>Cachet</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: '#f3f3f3', padding: 3, textAlign: 'center', boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <InfoOutlined sx={{ fontSize: 50, color: '#1976d2' }} />
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Aucune carte scolaire disponible pour le moment
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Il semble qu'aucune carte scolaire n'ait encore été générée.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => window.location.reload()}
                  >
                    Actualiser
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default SchoolCardsPage;
