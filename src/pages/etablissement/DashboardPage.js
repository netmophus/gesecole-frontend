

import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
//import { Facebook, LinkedIn, Twitter } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
//import EstablishmentSlider from './EstablishmentSlider'; // Assurez-vous que le chemin est correct
import {   MenuItem, ListItemIcon } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import GroupIcon from '@mui/icons-material/Group';

const EstablishmentDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [establishment, setEstablishment] = useState(null);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_URL;


  const [statistics, setStatistics] = useState({
    totalEleves: 0,
    totalEnseignants: 0,
    totalClasses: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = localStorage.getItem('token');
      const establishmentId = user?.schoolId || localStorage.getItem('schoolId'); // Utilise localStorage en fallback
  
      if (!token || !establishmentId) {
        console.error("Token ou identifiant d'établissement manquant.");
        return;
      }

      try {
        console.log(`Envoi de la requête avec token: ${token}`);

        const res = await fetch(`${apiBaseUrl}/api/stats/${establishmentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Réponse reçue:', res);

        if (!res.ok) {
          const responseText = await res.text();
          console.error('Erreur:', responseText);
          throw new Error('Erreur réseau ou authentification échouée');
        }

        const data = await res.json();
        console.log('Données des statistiques:', data);
        setStatistics(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
      }
    };

    if (user) {
      fetchStatistics();
    }
  }, [user,apiBaseUrl]);

  useEffect(() => {
    const fetchEstablishment = async () => {
      const token = localStorage.getItem('token');
      const establishmentId = user?.schoolId || localStorage.getItem('schoolId'); // Utilise localStorage en fallback

      if (!token || !establishmentId) {
        console.error("Token ou identifiant d'établissement manquant.");
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/api/establishment/${establishmentId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (res.ok) {
          setEstablishment(data);
        } else {
          console.error('Erreur lors de la récupération de l\'établissement:', data.msg || 'Erreur inconnue');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'établissement:', err.message);
      }
    };

    if (user) {
      fetchEstablishment();
    }
  }, [user, apiBaseUrl]);

  const handleNavigate = (path) => {
    navigate(path);
  };



  return (


    
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
        {/* Boutons d'accès rapides */}



<Card sx={{ mt: 4, p: 2, boxShadow: 3, borderRadius: 2, bgcolor: '#f0f4f8', marginBottom: '50px', maxWidth: '100%' }}>
  <CardContent>
    <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
      Accès Rapide
    </Typography>
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 2 
      }}
    >
      <MenuItem sx={{ boxShadow: 1, flex: '1 1 auto', maxWidth: '150px', justifyContent: 'center' }} onClick={() => handleNavigate('/etablissement/subjects')}>
        <ListItemIcon>
          <SchoolIcon sx={{ color: '#388e3c' }} />
        </ListItemIcon>
        <Typography variant="button" sx={{ color: '#388e3c', fontWeight: 'bold' }}>Matières</Typography>
      </MenuItem>
      <MenuItem sx={{ boxShadow: 1, flex: '1 1 auto', maxWidth: '150px', justifyContent: 'center' }} onClick={() => handleNavigate('/etablissement/teachers')}>
        <ListItemIcon>
          <PersonIcon sx={{ color: '#f57c00' }} />
        </ListItemIcon>
        <Typography variant="button" sx={{ color: '#f57c00', fontWeight: 'bold' }}>Enseignants</Typography>
      </MenuItem>
      <MenuItem sx={{ boxShadow: 1, flex: '1 1 auto', maxWidth: '150px', justifyContent: 'center' }} onClick={() => handleNavigate('/classes')}>
        <ListItemIcon>
          <ClassIcon sx={{ color: '#d32f2f' }} />
        </ListItemIcon>
        <Typography variant="button" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Classes</Typography>
      </MenuItem>
      <MenuItem sx={{ boxShadow: 1, flex: '1 1 auto', maxWidth: '150px', justifyContent: 'center' }} onClick={() => handleNavigate('/students')}>
        <ListItemIcon>
          <PeopleIcon sx={{ color: '#0288d1' }} />
        </ListItemIcon>
        <Typography variant="button" sx={{ color: '#0288d1', fontWeight: 'bold' }}>Élèves</Typography>
      </MenuItem>
      <MenuItem sx={{ boxShadow: 1, flex: '1 1 auto', maxWidth: '150px', justifyContent: 'center' }} onClick={() => handleNavigate('/bulletins')}>
        <ListItemIcon>
          <DescriptionIcon sx={{ color: '#7b1fa2' }} />
        </ListItemIcon>
        <Typography variant="button" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>Bulletins</Typography>
      </MenuItem>
      <MenuItem sx={{ boxShadow: 1, flex: '1 1 auto', maxWidth: '150px', justifyContent: 'center' }} onClick={() => handleNavigate('/devoircompos/create')}>
        <ListItemIcon>
          <AssignmentIcon sx={{ color: '#ff7043' }} />
        </ListItemIcon>
        <Typography variant="button" sx={{ color: '#ff7043', fontWeight: 'bold' }}>Notes</Typography>
      </MenuItem>
      <MenuItem sx={{ boxShadow: 1, flex: '1 1 auto', maxWidth: '150px', justifyContent: 'center' }} onClick={() => handleNavigate('/school-cards')}>
        <ListItemIcon>
          <CreditCardIcon sx={{ color: '#43a047' }} />
        </ListItemIcon>
        <Typography variant="button" sx={{ color: '#43a047', fontWeight: 'bold' }}>Cartes</Typography>
      </MenuItem>
    </Box>
  </CardContent>
</Card>



      
      
      
      {/* Section de l'image et des informations de l'établissement */}
      <Grid container spacing={4}>
      


      <Grid item xs={12}>
  <Paper
    sx={{
      p: 6,
      background: 'linear-gradient(135deg, #f4f6f9 0%, #e8eaed 100%)',
      borderRadius: '20px',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.4s ease-in-out',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 24px 45px rgba(0, 0, 0, 0.25)',
      },
      mb: 8,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3 }}>
      
      {/* Carte pour les détails de l'établissement (1/3) */}
    

<Card
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    
    p: 3,
    background: 'linear-gradient(135deg, #f3f4f6, #e3e6f1)', // Fond en dégradé
    borderRadius: '20px', // Coins arrondis
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)', // Ombre douce
    transition: 'transform 0.3s ease-in-out',
    position: 'relative', // Nécessaire pour positionner le badge
    '&:hover': {
      transform: 'scale(1.02)', // Zoom léger au survol
      boxShadow: '0 18px 35px rgba(0, 0, 0, 0.2)', // Accentuation de l'ombre
    },
    width: '100%', // Prend toute la largeur de l'écran
    maxWidth: '1200px', // Limite la taille maximale de la carte
    margin: '0 auto', // Centrer la carte sur la page
    gap: 4, // Espace entre les sections
  }}
>
  {/* Badge d'état (fixé en haut à droite, ne bougera plus) */}
  

  {/* Nom de l'établissement */}
  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'left' }}>
    {establishment ? `${establishment.name}` : 'Nom de l\'Établissement'}
  </Typography>

    {/* Informations */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {/* Année de création */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CalendarTodayIcon sx={{ color: '#00796b' }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: '600', color: '#616161' }}>
          Année de Création:
        </Typography>
        <Typography variant="body1" sx={{ color: '#00796b', fontWeight: '500' }}>
          {establishment?.yearOfCreation || 'Non disponible'}
        </Typography>
      </Box>
    </Box>

    {/* Code de l'établissement */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FingerprintIcon sx={{ color: '#d32f2f' }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: '600', color: '#616161' }}>
          Code Établissement:
        </Typography>
        <Typography variant="body1" sx={{ color: '#d32f2f', fontWeight: '500' }}>
          {establishment?.code || 'Non disponible'}
        </Typography>
      </Box>
    </Box>

    {/* Téléphone */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <PhoneIcon sx={{ color: '#0288d1' }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: '600', color: '#616161' }}>
          Téléphone:
        </Typography>
        <Typography variant="body1" sx={{ color: '#0288d1', fontWeight: '500' }}>
          {establishment?.phoneNumber || 'Non disponible'}
        </Typography>
      </Box>
    </Box>

    {/* Région */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <PlaceIcon sx={{ color: '#ff7043' }} />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: '600', color: '#616161' }}>
          Région:
        </Typography>
        <Typography variant="body1" sx={{ color: '#ff7043', fontWeight: '500' }}>
          {establishment?.region || 'Non disponible'}
        </Typography>
      </Box>
    </Box>
  </Box>
</Card>


 
     
    </Box>

    {/* Année académique active (2/3) */}
    <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5', // Fond neutre pour équilibrer les couleurs
    padding: '20px 30px', // Espacement équilibré
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)', // Ombre subtile
    width: '100%',
  
    maxWidth: '500px', // Limite la largeur
    margin: '0 auto', // Centre la carte
  }}
>
  {/* Icone Année Académique */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e8f5e9', // Fond doux pour l'icône
      padding: '15px',
      borderRadius: '50%',
      width: '80px',
      height: '80px',
    }}
  >
    <CalendarTodayIcon sx={{ fontSize: '40px', color: '#4caf50' }} />
  </Box>

  {/* Détails académiques */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginLeft: '20px', // Espace entre l'icône et le texte
      flex: 1,
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: '600',
        color: '#212121',
        letterSpacing: '0.05rem',
        marginBottom: '8px',
      }}
    >
      Année Académique Active
    </Typography>

    <Typography
      variant="h3"
      sx={{
        fontWeight: 'bold',
        color: '#303f9f', // Couleur plus marquée pour l'année
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
      }}
    >
      {establishment?.academicYears?.length > 0 && establishment.academicYears[0]?.isActive
        ? `${establishment.academicYears[0]?.yearId?.startYear} - ${establishment.academicYears[0]?.yearId?.endYear}`
        : 'Non disponible'}
    </Typography>
  </Box>

  {/* Statut */}
  <Box
    sx={{
      backgroundColor: establishment?.academicYears?.length > 0 && establishment.academicYears[0]?.isActive
        ? '#4caf50'
        : '#f44336', // Couleur conditionnelle selon le statut
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '25px',
      fontWeight: 'bold',
      fontSize: '16px',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {establishment?.academicYears?.length > 0 && establishment.academicYears[0]?.isActive
      ? 'Active'
      : 'Inactif'}
  </Box>
</Box>



  </Paper>
</Grid>







      {/* <Grid item xs={12} md={12}>
      <EstablishmentSlider />
      </Grid> */}
</Grid>






















     



      {/* Statistiques Clés */}
    




<Box sx={{ mt: 4 }}>
  <Card variant="outlined" sx={{ p: 3, bgcolor: '#ffffff', boxShadow: 3 }}>
    <CardContent>
      {/* Titre Centré */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
        Statistiques de l'Établissement
      </Typography>

      {/* Grille des Statistiques */}
     


      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total des Classes</Typography>
              <Typography variant="h3">{statistics.totalClasses}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total des Enseignants</Typography>
              <Typography variant="h3">{statistics.totalEnseignants}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total des Élèves</Typography>
              <Typography variant="h3">{statistics.totalEleves}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}


<Grid container spacing={3}>
  <Grid item xs={12} md={4}>
    <Card
      sx={{
        backgroundColor: '#f0f4f8', // Couleur adaptée à votre charte graphique
        borderRadius: '15px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)', // Zoom léger au survol
          boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <SchoolIcon sx={{ fontSize: 40, color: '#1e88e5', mb: 1 }} /> {/* Icône adaptée */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e88e5' }}>
          Total des Classes
        </Typography>
        <Typography variant="h3" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
          {statistics.totalClasses}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} md={4}>
    <Card
      sx={{
        backgroundColor: '#fff3e0', // Couleur adaptée
        borderRadius: '15px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <PersonIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
          Total des Enseignants
        </Typography>
        <Typography variant="h3" sx={{ color: '#fb8c00', fontWeight: 'bold' }}>
          {statistics.totalEnseignants}
        </Typography>
      </CardContent>
    </Card>
  </Grid>

  <Grid item xs={12} md={4}>
    <Card
      sx={{
        backgroundColor: '#f3e5f5', // Couleur adaptée
        borderRadius: '15px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 15px 25px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <GroupIcon sx={{ fontSize: 40, color: '#8e24aa', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8e24aa' }}>
          Total des Élèves
        </Typography>
        <Typography variant="h3" sx={{ color: '#6a1b9a', fontWeight: 'bold' }}>
          {statistics.totalEleves}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>





    </CardContent>
  </Card>
</Box>







      {/* Section pour les Élèves Méritants */}
     
      

{/* <Box mt={4}>
  <Card variant="outlined" sx={{ p: 3, bgcolor: '#f9f9f9' }}>
    <CardContent>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
    Élèves Méritants
      </Typography>
      
      <Grid container spacing={3}>
      
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Collège</Typography>
              <Avatar 
                alt="Méritant Collège"
                src="/images/eleve2.jpg"
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="body1" fontWeight="bold">Nom: Hadiza Oumarou</Typography>
              <Typography variant="body2" fontStyle="italic">Classe: 4ème B</Typography>
            </CardContent>
          </Card>
        </Grid>

      
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Lycée</Typography>
              <Avatar 
                alt="Méritant Lycée"
                src="/images/eleve4.jpg"
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="body1" fontWeight="bold">Nom: Ali Ibrahim</Typography>
              <Typography variant="body2" fontStyle="italic">Classe: Terminale S</Typography>
            </CardContent>
          </Card>
        </Grid>

       
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">Primaire</Typography>
              <Avatar 
                alt="Méritant Primaire"
                src="/images/eleve1.jpg"
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="body1" fontWeight="bold">Nom: Ahmed Diallo</Typography>
              <Typography variant="body2" fontStyle="italic">Classe: CM2</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
</Box> */}


      

      {/* Section pour le Fondateur de l'École */}
      {/* <Box mt={4}>
        <Typography variant="h5" gutterBottom>Fondateur de l'École</Typography>
        <Card variant="outlined" sx={{ textAlign: 'center', p: 2, mb: 4 }}>
          <CardContent>
            <Avatar 
              alt="Fondateur"
              src="/images/fondateur.jpg"
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            />
            <Typography variant="body1">Nom: M. Ibrahim Aboubacar</Typography>
            <Typography variant="body2">Fondateur et Directeur Général</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              "Bienvenue à notre école où l'excellence est notre priorité. Ensemble, nous bâtissons un avenir meilleur pour chaque élève."
            </Typography>
          </CardContent>
        </Card>
      </Box> */}




      {/* <Box mt={4}>
  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5', textAlign: 'center' }}>
    Fondateur de l'École
  </Typography>
  <Card 
    variant="outlined" 
    sx={{ p: 4, mb: 4, borderRadius: '16px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)' }}
  >
    <CardContent>
      <Grid container spacing={4} alignItems="center">
        


        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
          <Avatar 
            alt="Fondateur"
            src="/images/fondateur.jpg"
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #3f51b5' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>M. Ibrahim Aboubacar</Typography>
          <Typography variant="body2" sx={{ color: '#757575', mb: 1 }}>Fondateur et Directeur Général</Typography>
          <Box>
            
            <Facebook sx={{ mx: 1, cursor: 'pointer', color: '#3b5998' }} />
            <LinkedIn sx={{ mx: 1, cursor: 'pointer', color: '#0e76a8' }} />
            <Twitter sx={{ mx: 1, cursor: 'pointer', color: '#1da1f2' }} />
          </Box>
        </Grid>

       
        <Grid item xs={12} md={8}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333', textAlign: 'justify' }}>
            "Bienvenue à notre école où l'excellence est notre priorité. Ensemble, nous bâtissons un avenir meilleur pour chaque élève. Notre engagement est de fournir un environnement d'apprentissage enrichissant et stimulant, où chaque élève peut exceller et développer son plein potentiel."
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
      </Box> */}


     
      {/* <Box mt={4}>
  <Card variant="outlined" sx={{ p: 3, bgcolor: '#f9f9f9' }}>
    <CardContent>
    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
   Directeurs
      </Typography>
      <Grid container spacing={3}>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: '#ffffff', boxShadow: 2 }}>
            <CardContent>
              <Avatar 
                alt="Directeur Lycée"
                src="/images/director-lycee.jpg"
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="body1" fontWeight="bold">M. Ali Mahamane</Typography>
              <Typography variant="body2">Téléphone: +227 123-456-789</Typography>
              <Typography variant="body2" fontStyle="italic">Lycée</Typography>
              <Box mt={2}>
                <Link href="https://www.facebook.com/director-lycee" target="_blank" rel="noopener" sx={{ mx: 1 }}>Facebook</Link>
                <Link href="https://www.tiktok.com/@director-lycee" target="_blank" rel="noopener" sx={{ mx: 1 }}>TikTok</Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: '#ffffff', boxShadow: 2 }}>
            <CardContent>
              <Avatar 
                alt="Directeur Collège"
                src="/images/director-college.jpg"
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="body1" fontWeight="bold">Mme. Fatima Zohra</Typography>
              <Typography variant="body2">Téléphone: +227 987-654-321</Typography>
              <Typography variant="body2" fontStyle="italic">Collège</Typography>
              <Box mt={2}>
                <Link href="https://www.facebook.com/director-college" target="_blank" rel="noopener" sx={{ mx: 1 }}>Facebook</Link>
                <Link href="https://www.tiktok.com/@director-college" target="_blank" rel="noopener" sx={{ mx: 1 }}>TikTok</Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

     
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: '#ffffff', boxShadow: 2 }}>
            <CardContent>
              <Avatar 
                alt="Directeur Primaire"
                src="/images/director-primaire.jpg"
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="body1" fontWeight="bold">M. Moussa Koné</Typography>
              <Typography variant="body2">Téléphone: +227 654-321-987</Typography>
              <Typography variant="body2" fontStyle="italic">Primaire</Typography>
              <Box mt={2}>
                <Link href="https://www.facebook.com/director-primaire" target="_blank" rel="noopener" sx={{ mx: 1 }}>Facebook</Link>
                <Link href="https://www.tiktok.com/@director-primaire" target="_blank" rel="noopener" sx={{ mx: 1 }}>TikTok</Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
</Box> */}

     


    </Container>
  );
};

export default EstablishmentDashboardPage;
