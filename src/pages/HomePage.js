
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import SlidingPageDrawer from '../components/SlidingPageDrawer';
import { Box, Typography, Button, Collapse, Grid,Paper, Card, CardContent, IconButton, Divider, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
//import logo from '../assets/images/armoiries-niger.png';  // Assurez-vous que le chemin est correct
import logo1 from '../assets/images/logo-ministere.png';  // Assurez-vous que le chemin est correct
//import PlanningMinistre from './ActivityMinistre';
import NewsPage from './NewsPage';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Importez le contexte
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MessageMinistreModal from './MessageMinistreModal'; // Assure-toi que le chemin est correct
import ministerPhoto from '../assets/images/elisa-men.jpg';


const HomePage = () => {
  const { user } = useContext(AuthContext); // Récupérer l'utilisateur depuis le contexte
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentDrawerContent, setCurrentDrawerContent] = useState(null);
  const [sectionCards, setSectionCards] = useState([]);
  const [articles, setArticles] = useState([]); // État pour stocker les articles récupérés
  const [openConfigModal, setOpenConfigModal] = useState(false); // État pour le modal de configuration
  //const [pageTitle, setPageTitle] = useState('');
  const [drawerTitle, setDrawerTitle] = useState('');

  const apiBaseUrl = process.env.REACT_APP_API_URL;
  
  const navigate = useNavigate();

  //const { setUser } = useContext(AuthContext);  // Assuming you manage user context
  

  const [showObjectives, setShowObjectives] = useState(false);

  // Fonction pour basculer l'affichage des objectifs
  const toggleObjectives = () => {
    setShowObjectives(!showObjectives);
  };


  useEffect(() => {
    const fetchSectionCards = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/section-cards`);
        setSectionCards(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };

    fetchSectionCards();
  }, [apiBaseUrl]);

  useEffect(() => {
    // Ouvrir le modal si l'utilisateur est un établissement non configuré
    if (user && user.role === 'Etablissement' && !user.isConfigured) {
      setOpenConfigModal(true);
    }
  }, [user]);

 

  useEffect(() => {
    const fetchSectionCards = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/section-cards`);
        setSectionCards(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
    };
  
    fetchSectionCards();
  }, [apiBaseUrl]);
  
  
  
  const handleOpenDrawer = async (content, sectionId) => {
    console.log("Opening drawer for:", content);
    setCurrentDrawerContent(content);
    setOpenDrawer(true);
  
    // Trouver le titre de la page de la section actuelle
    const section = sectionCards.find((card) => card._id === sectionId);
    const pageTitle = section ? section.titlePage : '';
  
    // Passer le titre de la page au Drawer
    setDrawerTitle(pageTitle);
  
    // Si la section est 'news', récupérer les articles associés
    if (content === 'news' && sectionId) {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/section-articles?section=${sectionId}`);
        setArticles(response.data); // Stocker les articles récupérés
      } catch (error) {
        console.error("Erreur lors de la récupération des articles", error);
      }
    }
  };
  


  
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const handleCloseConfigModal = () => {
    setOpenConfigModal(false);
  };


//==========Ajout
  const handleAccess = (action) => {
    if (user?.role !== 'Parent') {
      // Rediriger vers la page de connexion avec l'intention et le rôle de 'Parent'
      navigate('/login', { state: { intendedAction: action, role: 'Parent' } });
    } else {
      // Si le rôle est 'Parent', autoriser l'accès
      if (action === 'consult') {
        navigate('/bulletin-acces');
      } else if (action === 'download') {
        navigate('/download-bulletin');
      }
    }
  };
  

 

  return (
    <Box sx={{ padding: '20px 0', backgroundColor: '#B2DFDB' }}>
     
<Box sx={{ textAlign: 'center', marginBottom: '40px', padding: '20px', backgroundColor: '#004d40', color: '#fff', borderRadius: '8px' }}>

    <Box
      sx={{
        backgroundColor: '#004d40',
        color: '#fff',
        marginTop:'20px',
        // padding: '40px',
        borderRadius: '10px',
        position: 'relative',
      }}
    >      
<img
  src={logo1}
  alt="Armoiries du Niger"
  style={{
    height: '250px',
    '@media (max-width:960px)': { // Taille pour md et sm
      height: '180px', // Taille réduite pour les écrans moyens et petits
    },
    '@media (max-width:600px)': { // Taille pour xs
      height: '100px', // Taille encore plus réduite pour les écrans très petits
    },
  }}
/>
<Typography
  variant="h7"
  component="h1"
  sx={{
    marginTop: '20px',
    fontWeight: 'bold',
    fontSize: {
      xs: '1.5rem', // Taille réduite pour les petits écrans
      sm: '2rem',   // Taille un peu plus grande pour les écrans small
      md: '2.5rem', // Taille ajustée pour les écrans moyens
      lg: '2.7rem',   // Taille par défaut pour les grands écrans
    },
  }}
>
L'éducation universelle et participative pour un Niger inclusif
</Typography>







{/* Ajoute le bouton "Message du Ministre" ici */}
<MessageMinistreModal />












<Typography
  variant="h6"
  sx={{
    color: '#e0f7fa',
    marginBottom: '20px',
    fontSize: {
      xs: '0.8rem', // Taille réduite pour les petits écrans
      sm: '1rem',   // Taille pour les écrans small
      md: '1.2rem', // Taille pour les écrans moyens
      lg: '1.5rem', // Taille par défaut pour les grands écrans
    },
  }}
>
  Bienvenue sur la plateforme officielle du Ministère de l'Education Nationale, de l'Alphabétisation, de l'Enseignement Professionnel et de la Promotion des Langues Nationales.
</Typography>

      {/* Bouton pour afficher les objectifs dans le coin droit */}
      <Box sx={{ position: 'absolute', top: '20px', right: '20px' }}>
        <Button
          // variant="contained"
          // color="secondary"
          onClick={toggleObjectives}        
          variant="outlined" color="inherit" 
          sx={{ fontSize: '1.1rem', marginRight: '10px',

            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#00acc1',
              transform: 'scale(1.1)',
            },
            display: { xs: 'none', md: 'block' }, // Masquer en petit écran (xs)




           }}
        >
          Objectifs du Portail
        </Button>
      </Box>

      {/* Collapse pour afficher le message juste en dessous du bouton */}
      <Collapse in={showObjectives} sx={{ position: 'absolute', top: '70px', right: '20px', transition: 'all 0.5s ease' }}>
        <Box
          sx={{
            marginTop:'10px',
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '5px',
            color: '#000',
            width: '400px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
            animation: 'slide-down 0.5s ease',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Objectifs du Portail :
          </Typography>
          <Typography variant="body1" sx={{ marginTop: '10px' }}>
            Le portail vise à fournir une plateforme centralisée pour la gestion administrative, les inscriptions,
            et la communication entre les établissements scolaires, les enseignants, les parents et le Ministère de l'Education Nationale, de l'Alphabétisation, de l'Enseignement Professionnel et de la Promotion des Langues Nationales.
          </Typography>
        </Box>
      </Collapse>
    </Box>



  {/* <Button component={Link} to="/login" variant="outlined" color="inherit" sx={{ fontSize: '1.1rem', marginRight: '10px', marginBottom:'25px' }}>
    Se Connecter
  </Button>  */}

  <Button
  component={Link}
  to="/login"
  variant="outlined"
  color="inherit"
  sx={{
    fontSize: '1.1rem',
    marginRight: '10px',
    marginBottom: '25px',
    display: user ? 'none' : 'inline-block' // Si l'utilisateur est connecté, le bouton est masqué
  }}
>
  Se Connecter
</Button>



</Box>






<Box sx={{ padding: '40px', backgroundColor: '#B2DFDB' }}>
    
<Grid container spacing={4}>
{/* Card 1: Inscription Examens */}
<Grid item xs={12} md={6}>
  <Card sx={{
    backgroundColor: '#004d40', // Vert foncé pour BEPC
    color: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxHeight: '300px',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#00695c', // Plus clair au survol
    },
  }}>
    <CardContent>
      <AssignmentIcon sx={{ fontSize: 50, color: '#FFD700' }} /> {/* Icône dorée pour BEPC */}
      <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        Enregistrement aux Examens
      </Typography>
      <Typography variant="body1" sx={{ color: '#e0f7fa', mb: 3 }}>
        Inscription et Participation aux Examens BEPC
      </Typography>
      <Button
        component={Link}
        to="/bepc-access"
        variant="contained"
        sx={{
          backgroundColor: '#FFD700', // Doré pour le bouton BEPC
          color: '#333',
          fontSize: '1.1rem',
          '&:hover': { backgroundColor: '#ffc107' }, // Doré plus vif au survol
        }}
      >
        Inscription BEPC
      </Button>
    </CardContent>
  </Card>
</Grid>


<Grid item xs={12} md={6}>
  <Card sx={{
    backgroundColor: '#1A535C', // Bleu vert pour CFEPD
    color: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxHeight: '300px',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#2A7E84', // Plus clair au survol
    },
  }}>
    <CardContent>
      <FileCopyIcon sx={{ fontSize: 50, color: '#FF8C00' }} /> {/* Icône orange pour CFEPD */}
      <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        Enregistrement aux Examens
      </Typography>
      <Typography variant="body1" sx={{ color: '#fff8e1', mb: 3 }}>
        Inscription et Participation aux Examens CFEPD
      </Typography>
      <Button
        component={Link}
        to="/cfepd-access"
        variant="contained"
        sx={{
          backgroundColor: '#FF8C00', // Orange pour le bouton CFEPD
          color: '#fff',
          fontSize: '1.1rem',
          '&:hover': { backgroundColor: '#ff751a' }, // Orange plus vif
        }}
      >
        Inscription CFEPD
      </Button>
    </CardContent>
  </Card>
</Grid>




  {/* Card 2: Accès au Bulletin Numérique */}
  <Grid container spacing={4}>
  {/* Carte Accès au Bulletin Numérique */}
  <Grid item xs={12} md={6}>
    <Card sx={{
      backgroundColor: '#2c3e50', // Bleu nuit pour le fond
      color: '#fff',
      padding: '20px',
      mt: 5,
      ml: 5,
      borderRadius: '12px',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
      textAlign: 'center',
      maxHeight: '300px',
      transition: 'transform 0.3s ease, background-color 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        backgroundColor: '#34495e', // Plus clair au survol
      },
    }}>
      <CardContent>
        <FileCopyIcon sx={{ fontSize: 50, color: '#FF8C00' }} /> {/* Icône orange */}
        <Typography variant="h5" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
          Accès au Bulletin Numérique
        </Typography>
        <Typography variant="body1" sx={{ color: '#e0f7fa', mb: 3 }}>
          Consultez les bulletins de vos enfants.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#FF8C00', // Orange pour le bouton
            color: '#fff',
            fontSize: '1.2rem',
            '&:hover': { backgroundColor: '#e67e22' }, // Orange vif au survol
            mr: 2,
          }}
          onClick={() => handleAccess('consult')}
        >
          Consulter Bulletin
        </Button>
      </CardContent>
    </Card>
  </Grid>

  {/* Carte avec la photo du Ministre */}
  <Grid item xs={12} md={6}>
  <Card sx={{
    backgroundColor: '#fff', // Fond clair et agréable pour la carte
    color: '#333',
    mt: 5,
    ml: 2,
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
    display: 'flex', // Disposition en ligne
    alignItems: 'center',
    transition: 'transform 0.3s ease',
    maxHeight: '300px',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#f9f9f9', // Fond légèrement plus clair au survol
    },
  }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <img
        src={ministerPhoto} // Utilisation de l'import de l'image
        alt="Portrait du Ministre"
        style={{
          width: '40%',
          height: 'auto',
          borderRadius: '8px',
        }}
      />
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
          Mme Elisabeth Sherif
        </Typography>
        <Typography variant="body2" sx={{ color: '#555', fontWeight: 'medium', mt: 1 }}>
          MEN/A/EP/PLN
        </Typography>
        <Typography variant="body2" sx={{ color: '#FF8C00', mt: 1, fontSize: '1.1rem', textAlign: 'left', fontWeight:'bold'}}>
          Un engagement fort pour une éducation inclusive et participative.
        </Typography>
      </Box>
    </CardContent>
  </Card>
</Grid>



</Grid>


</Grid>
    </Box>

<Dialog 
  open={openConfigModal} 
  onClose={handleCloseConfigModal}
  PaperProps={{
    sx: { 
      padding: '20px', 
      borderRadius: '16px', 
      backgroundColor: '#2C3E50', 
      boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
      color: '#fff'
    }
  }}
>
  <DialogTitle sx={{ textAlign: 'center', backgroundColor: '#1ABC9C', color: '#fff', borderRadius: '12px 12px 0 0', padding: '15px' }}>
    Configuration Requise
  </DialogTitle>
  
  <DialogContent sx={{ padding: '30px', textAlign: 'center' }}>
    <Typography variant="h6" sx={{ marginBottom: 3, fontWeight: 'bold', color: '#ECF0F1' }}>
      Votre établissement n'est pas encore configuré.
    </Typography>
    <Typography variant="body1" sx={{ color: '#BDC3C7' }}>
      Cliquez sur le bouton ci-dessous pour commencer la configuration.
    </Typography>
  </DialogContent>
  
  <DialogActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
    <Button 
      component={Link} 
      to="/etablissement/configuration" 
      variant="contained" 
      sx={{ 
        backgroundColor: '#1ABC9C', 
        color: '#fff', 
        padding: '10px 20px', 
        fontSize: '1.1rem',
        borderRadius: '8px',
        '&:hover': { backgroundColor: '#16A085' }
      }}
    >
      Commencer la Configuration
    </Button>
  </DialogActions>
</Dialog>


      {/* Section d'informations clés */}
      <Container maxWidth="lg">
         {/* Ajout du titre centré */}






{/* Section d'informations clés */}


<Box
  sx={{
    textAlign: 'center',
    mb: 6,
    display: {
      xs: 'none', // Masqué pour les écrans extra petits
      sm: 'none', // Masqué pour les écrans petits
    },
    '@media (min-width:300px)': {
      display: 'block', // Visible à partir de 650px
    },
  }}
>
  <Typography
    variant="h4"
    component="h2"
    sx={{ fontWeight: 'bold', color: '#004d40', marginBottom: '40px' , marginTop:'50px'}}
  >
    Actualités et Annonces Importantes
  </Typography>

  <Grid container spacing={4} sx={{ marginBottom: '40px' }}>
    {sectionCards.map((card) => (
      <Grid item xs={12} md={4} key={card._id}>
        <Paper
          sx={{
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            boxShadow: 4,
            borderRadius: '16px',
            textAlign: 'center',
            padding: '20px',
            transition: 'transform 0.4s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#FF8C00', marginBottom: '20px' }}
          >
            {card.titleCard}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: '1.1rem', marginBottom: '20px', color: '#333' }}
          >
            {card.bodyCard}
          </Typography>
          <Button
            onClick={() => handleOpenDrawer('news', card._id)}
            variant="outlined"
            sx={{
              borderColor: '#FF8C00',
              color: '#FF8C00',
              '&:hover': { backgroundColor: '#FF8C00', color: '#fff' },
            }}
          >
            {card.btnCard}
          </Button>
        </Paper>
      </Grid>
    ))}
  </Grid>
</Box>




       


<SlidingPageDrawer open={openDrawer} onClose={handleCloseDrawer} title={drawerTitle}>
  {currentDrawerContent === 'news' && <NewsPage articles={articles} onClose={handleCloseDrawer} />}
</SlidingPageDrawer>




        

<Box sx={{ marginTop: '40px', textAlign: 'center', padding: '20px', backgroundColor: '#004d40', color: '#fff', borderRadius: '8px' }}>
  <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
    Ressources Scolaires et Outils
  </Typography>
  <Typography variant="body1" sx={{ color: '#e0f7fa', marginBottom: '20px' }}>
    Accédez à une sélection d'outils et de ressources pour améliorer vos performances académiques et la gestion des établissements.
  </Typography>

  <Grid container spacing={4}>
  
  <Grid item xs={12} md={4}>
  <Paper sx={{ padding: '20px', backgroundColor: '#ffffff', boxShadow: 3, borderRadius: '8px' }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF8C00', marginBottom: '10px' }}>
      Ressources Pédagogiques
    </Typography>
    <Typography variant="body1" sx={{ color: '#004d40' }}>
      Explorez des vidéos, des guides PDF et des fiches pour chaque matière et niveau scolaire.
    </Typography>
    <Button 
      component={Link} 
      to="/login"
      variant="contained" 
      sx={{ backgroundColor: '#FF8C00', marginTop: '10px' }} 
    >
      Accéder
    </Button>
  </Paper>
</Grid>



   
    <Grid item xs={12} md={4}>
      <Paper sx={{ padding: '20px', backgroundColor: '#ffffff', boxShadow: 3, borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF8C00', marginBottom: '10px' }}>
          Outils pour Enseignants
        </Typography>
        <Typography variant="body1" sx={{ color: '#004d40' }}>
          Utilisez des outils modernes pour gérer les classes, planifier les cours et suivre la progression des élèves.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: '#FF8C00', marginTop: '10px' }} 
          onClick={() => alert('Cette fonctionnalité est en cours de développement')}
        >
          Accéder
        </Button>
      </Paper>
    </Grid>

    <Grid item xs={12} md={4}>
      <Paper sx={{ padding: '20px', backgroundColor: '#ffffff', boxShadow: 3, borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF8C00', marginBottom: '10px' }}>
          Outils pour Parents
        </Typography>
        <Typography variant="body1" sx={{ color: '#004d40' }}>
          Suivez les progrès de vos enfants, consultez leurs bulletins et communiquez avec les enseignants.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: '#FF8C00', marginTop: '10px' }} 
          onClick={() => alert('Cette fonctionnalité est en cours de développement')}
        >
          Accéder
        </Button>
      </Paper>
    </Grid>
  </Grid>
</Box>



        {/* Section réseaux sociaux */}
<Divider sx={{ marginY: 8, borderColor: '#e0e0e0' }} />
<Box
  sx={{
    backgroundColor: '#f5f5f5',
    borderRadius: '16px',
    padding: '40px 20px',
    textAlign: 'center',
    boxShadow: 4,
    marginTop: '-100px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  }}
>
  <Typography
    variant="h4"
    sx={{
      marginBottom: '20px',
      fontWeight: 'bold',
      color: '#004d40',
      letterSpacing: '2px',
    }}
  >
    Rejoignez notre communauté
  </Typography>
  <Typography
    variant="body1"
    sx={{ marginBottom: '30px', color: '#757575', fontSize: '1.2rem', marginTop:'-15px' }}
  >
    Suivez-nous sur les réseaux sociaux pour rester informé de nos dernières actualités et événements.
  </Typography>
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      flexWrap: 'wrap',
    }}
  >
    <IconButton
      href="#"
      sx={{
        backgroundColor: '#3b5998',
        color: '#fff',
        '&:hover': { backgroundColor: '#2d4373' },
        fontSize: '2rem',
        width: '60px',
        height: '60px',
        boxShadow: 3,
        borderRadius: '50%',
        transition: 'transform 0.3s ease',
        transform: 'scale(1.1)',
     
      }}
    >
      <Facebook />
    </IconButton>
    <IconButton
      href="#"
      sx={{
        backgroundColor: '#00acee',
        color: '#fff',
        '&:hover': { backgroundColor: '#007ab9' },
        fontSize: '2rem',
        width: '60px',
        height: '60px',
        boxShadow: 3,
        borderRadius: '50%',
        transition: 'transform 0.3s ease',
        transform: 'scale(1.1)',
        
      }}
    >
      <Twitter />
    </IconButton>
    <IconButton
      href="#"
      sx={{
        backgroundColor: '#e4405f',
        color: '#fff',
        '&:hover': { backgroundColor: '#c32f40' },
        fontSize: '2rem',
        width: '60px',
        height: '60px',
        boxShadow: 3,
        borderRadius: '50%',
        transition: 'transform 0.3s ease',
        transform: 'scale(1.1)',
     
      }}
    >
      <Instagram />
    </IconButton>
    <IconButton
      href="#"
      sx={{
        backgroundColor: '#0077b5',
        color: '#fff',
        '&:hover': { backgroundColor: '#005582' },
        fontSize: '2rem',
        width: '60px',
        height: '60px',
        boxShadow: 3,
        borderRadius: '50%',
        transition: 'transform 0.3s ease',
        transform: 'scale(1.1)',
      }}
    >
      <LinkedIn />
    </IconButton>
  </Box>
</Box>

      </Container>
    </Box>
  );
};

export default HomePage;

