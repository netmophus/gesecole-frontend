
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import SlidingPageDrawer from '../components/SlidingPageDrawer';
import { Box, Typography, Button,  Grid,Paper, Card, Tab,Tabs, CardContent, IconButton, Divider, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
//import { Player } from '@lottiefiles/react-lottie-player'; // Bibliothèque Lottie
import LottieLego from '../assets/animations/LottieLego.json'; // Animation Lottie (exemple)
import { Player } from '@lottiefiles/react-lottie-player';
import animeavis from '../assets/animations/lottieAvis.json';
import administrateurbepc from '../assets/animations/administrateurbepc.json';
import educations1 from '../assets/images/educationss.png';

import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import CampaignIcon from '@mui/icons-material/Campaign';

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
  

 

  const [tabIndex, setTabIndex] = useState(0); // État pour gérer les onglets
  //const [showObjectives, setShowObjectives] = useState(false);




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



  
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex); // Changer d'onglet
  };


 

  return (
    <Box sx={{ padding: '20px 0', backgroundColor: '#B2DFDB' }}>
     
     <Box sx={{ textAlign: 'center', marginBottom: '40px', padding: '0px', margin: '0px', borderRadius: '8px', width: '100%', marginTop: '-20px'}}>
  
  
     <Box
      sx={{
        width: '100%',
        backgroundColor: '#ffffff', // Fond blanc
      
       
        borderRadius: '12px', // Coins arrondis
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Organisation colonne pour petits écrans, ligne pour grands écrans
        alignItems: 'center',
        justifyContent: 'space-between',
        
        gap: 3,
      }}
    >
  {/* Section du logo au centre */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Centrer horizontalement
      textAlign: 'center', // Centrer le texte
      padding: '50px',
    }}
  >
    <img
      src={logo1} // Remplacez par l'URL ou le chemin de votre logo
      alt="Logo du Ministère"
      style={{
        height: '250px', // Taille du logo
        marginBottom: '20px',
      }}
    />
    <Typography
      variant="h4"
      sx={{
        fontWeight: 'bold',
        fontSize: { xs: '2.5rem', sm: '2.5rem' }, // Taille responsive
        color: '#004d40',
        marginBottom: '10px',
      }}
    >
      Bienvenue sur notre plateforme
    </Typography>
    <Typography
      variant="subtitle1"
      sx={{
        fontSize: { xs: '1rem', sm: '1.2rem' },
        color: '#555555',
      }}
    >
      Une solution innovante pour une éducation moderne et inclusive.
    </Typography>
  </Box>

  {/* Image à côté */}
  <Box
  sx={{
    position: 'relative',
    maxWidth: '500px', // Taille maximale de l'image
    width: { xs: '90%', md: '80%', sm: '100%' },
    marginRight:{ xs: '0px', md: '50px', sm: '40px' }, // Espacement  
    marginTop: { xs: '10px',  md: '80px', sm: '20px' },
    borderRadius: '12px', // Coins arrondis pour un effet moderne
    overflow: 'hidden', // Empêche tout débordement
   marginBottom: '50px',
    transform: 'scale(1)', // Transformation initiale
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Effet fluide au survol
    '&:hover': {
      transform: 'scale(1.05)', // Zoom léger au survol
      boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.3)', // Ombre plus prononcée au survol
    },
  }}
>
  <img
    src={educations1} // Remplacez par l'URL ou le chemin de votre image
    alt="Illustration éducative"
    style={{
      width: { xs: '60%', sm: '100%' },
      height: 'auto', // Ajustement automatique de la hauteur
      borderRadius: '12px', // Coins arrondis
    }}
  />

  {/* Badge sans texte */}
  <Box
    sx={{
      position: 'absolute',
      top: 10, // Positionné à 10px du haut
      left: 10, // Positionné à 10px de la gauche
      width: '80px', // Taille du badge
      height: '80px',
      backgroundColor: '#00ACC1', // Couleur du badge
      borderRadius: '50%', // Forme circulaire
      display: 'flex',
      alignItems: 'center',
    
      justifyContent: 'center',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Ombre flottante
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      width="60px"
      height="60px"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5l-5-5 1.41-1.41L11 13.17l7.59-7.59L20 7l-9 9.5z" />
    </svg>
  </Box>
</Box>



    </Box>


    <Box
  sx={{
    width: '100%', // Prend toute la largeur disponible
    backgroundColor: '#f3f4f6', // Fond doux et élégant
    borderRadius: '16px', // Coins arrondis pour un effet moderne
    paddingTop: { xs: '20px', sm: '40px' }, // Espacement interne ajusté
    paddingBottom: { xs: '2px', sm: '40px' }, // Espacement interne ajusté
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' }, // Colonne pour petits écrans, ligne pour grands écrans
    alignItems: 'center',
    gap: 5,
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)', // Ombre subtile pour relief
    overflow: 'hidden', // Empêche les débordements
  }}
>
  {/* Animation Lottie */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Player
      autoplay
      loop
      src={LottieLego} // Chemin de votre animation Lottie
      style={{
        height: '250px', // Taille ajustée pour un meilleur équilibre
        maxWidth: '100%',
      }}
    />
  </Box>

  {/* Section Texte */}
  <Box
    sx={{
      flex: 2,
      padding: '40px',
      backgroundColor: '#ffffff', // Fond blanc pour contraster avec le reste
      marginRight: { xs: '20px', sm: '60px' }, // Espacement interne ajusté
      borderRadius: '12px',     
      textAlign: { xs: 'center', md: 'left' }, // Centré sur mobile, aligné à gauche sur desktop
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Ombre subtile
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontWeight: 'bold',
        fontSize: { xs: '1.8rem', sm: '2.4rem' },
        color: '#004d40', // Couleur verte professionnelle
        marginBottom: '20px',
        textAlign: { xs: 'center', md: 'center' },
      }}
    >
      🚨 Pré-inscriptions ouvertes pour le BEPC et le CFEPD !
    </Typography>
    <Typography
      sx={{
        fontSize: { xs: '1rem', sm: '1.2rem' },
        lineHeight: '1.8',
        fontWeight: '500',
        padding: '20px',
        color: '#333', // Texte sombre pour lisibilité
        marginBottom: '10px',
      }}
    >
      Les préinscriptions pour les examens du BEPC et le CFEPD commencent le <strong>1er décembre 2024</strong> et se clôturent le <strong>31 mars 2025</strong>.
    </Typography>
    {/* <Typography
      sx={{
        fontSize: { xs: '0.9rem', sm: '1rem' },
        color: '#666', // Couleur de texte secondaire
      }}
    >
      Contactez-nous pour toute assistance : <strong>+227 96 98 61 74</strong>.
    </Typography> */}
  </Box>
</Box>


<Box
  sx={{
    width: '100%', // Largeur totale
    backgroundColor: '#004d40', // Fond doux
    borderRadius: '16px', // Coins arrondis
    paddingBottom: { xs: '20px', sm: '50px' },
    paddingTop: { xs: '20px', sm: '50px' },
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // Ombre subtile
    display: 'flex',
    flexDirection: 'column', // Organisation en colonne
    alignItems: 'center',
    gap: 3, // Espacement entre les éléments
    textAlign: 'center',
    marginTop: { xs: '20px', sm: '40px' },
    marginBottom: { xs: '20px', sm: '40px' },
  }}
>
  {/* Titre */}
  <Typography
    variant="h4"
    sx={{
      fontWeight: 'bold',
      fontSize: { xs: '1.5rem', sm: '2rem' }, // Taille responsive
      color: '#fff', // Vert professionnel
    
      padding: '20px',
    }}
  >
    Espace réservé aux administrateurs BEPC et CFEPD
  </Typography>

  {/* Informations de contact */}
  <Typography
    sx={{
      fontSize: { xs: '0.5rem', sm: '1rem' },
      color: '#fff', // Texte sombre pour lisibilité
      marginBottom: '10px',
      lineHeight: '1.2',
    }}
  >
    En cas de problème, veuillez appeler :
    <br />
    <strong>+227 96 98 61 74/+227 80 64 83 83</strong>
    
  </Typography>

  {/* Boutons */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' }, // Colonne sur mobile, ligne sur desktop
      gap: 2, // Espacement entre les boutons
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#FF8C00',
        color: '#fff',
        fontSize: { xs: '0.9rem', sm: '1rem' },
        padding: '10px 20px',
        borderRadius: '8px', // Coins arrondis
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Ombre légère
        '&:hover': { backgroundColor: '#e67e22' }, // Couleur au survol
      }}
      href="/bepc-access"
    >
      Administrateur BEPC
    </Button>

    <Button
      variant="contained"
      sx={{
        backgroundColor: '#00ACC1',
        color: '#fff',
        fontSize: { xs: '0.9rem', sm: '1rem' },
        padding: '10px 20px',
        borderRadius: '8px', // Coins arrondis
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Ombre légère
        '&:hover': { backgroundColor: '#00838F' }, // Couleur au survol
      }}
      href="/cfepd-access"
    >
      Administrateur CFEPD
    </Button>
  </Box>
</Box>



  

  
  
  {/* Partie avec le logo sur fond blanc */}
 
{/* Annonce en haut */}
<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    color: '#004d40',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
    gap: '20px', // Espace entre les éléments
    flexWrap: 'wrap', // Permet l'adaptation pour les petits écrans
  }}
>


  {/* Onglets avec contenu dynamique */}

  <Box
  sx={{
    width: '100%', // Prend toute la largeur
    backgroundColor: '#f3f4f6', // Fond doux
    padding: '20px',
    borderRadius: '16px', // Coins arrondis
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // Ombre subtile
    overflow: 'hidden', // Empêche les débordements
  }}
>
  <Tabs
    value={tabIndex}
    onChange={handleTabChange}
    variant="fullWidth" // Les onglets prennent toute la largeur
    sx={{
      '& .MuiTabs-indicator': {
        height: '4px',
        backgroundColor: '#ff8c00', // Indicateur coloré
        borderRadius: '4px',
      },
      '& .MuiTab-root': {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: { xs: '1rem', sm: '1.2rem' },
        color: '#333',
        padding: '12px 16px',
       
        transition: 'all 0.3s ease',
        borderRadius: '8px', // Coins arrondis des onglets
        '&:hover': {
          backgroundColor: '#ffefd5', // Fond clair au survol
          color: '#ff8c00', // Texte vibrant au survol
          transform: 'scale(1.05)', // Zoom léger au survol
        },
        '&.Mui-selected': {
          color: '#ffffff',
          backgroundColor: '#ff8c00', // Couleur vive pour l'onglet sélectionné
          boxShadow: '0px 4px 12px rgba(255, 140, 0, 0.5)', // Ombre autour de l'onglet actif
        },
      },
    }}
  >
    <Tab icon={<SchoolIcon />} label="Cartes & Bulletins Scolaire" />
    <Tab icon={<InfoIcon />} label="Diplôme - Ecoles Professionnelles" />
    <Tab icon={<CampaignIcon />} label="Informations Clés" />
    {/* <Tab icon={<EventIcon />} label="Événements" />
    <Tab icon={<ContactMailIcon />} label="Contact" />
    <Tab icon={<HelpOutlineIcon />} label="FAQ" /> */}
  </Tabs>
</Box>




  <Box
    sx={{
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#fff',
    }}
  >

{tabIndex === 0 && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: '20px',
      backgroundColor: '#f3f4f6', // Fond principal doux
      borderRadius: '16px',
    }}
  >
    {/* Titre principal */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#004d40',
        marginBottom: '20px',
      }}
    >
      Projet de Bulletin Numérique : Informations Clés
    </Typography>

    {/* Cadres avec fonds différents */}
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // Colonne pour petits écrans, ligne pour grands écrans
        gap: 3,
      }}
    >
      {/* Cadre 1 */}
      <Box
        sx={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#FFEBEE', // Fond rouge clair
          borderRadius: '12px',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // Ombre subtile
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#D32F2F', // Texte rouge foncé
            marginBottom: '10px',
          }}
        >
          Intégration obligatoire pour tous les établissements
        </Typography>
        <Typography
          sx={{
            color: '#555', // Texte gris
          }}
        >
          Le projet de bulletin numérique est à terme. Tous les établissements
          publics et privés doivent prendre les dispositions nécessaires pour
          s'inscrire dans cette nouvelle logique administrative.
        </Typography>
      </Box>

      {/* Cadre 2 */}
      <Box
        sx={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#E3F2FD', // Fond bleu clair
          borderRadius: '12px',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#1976D2', // Texte bleu foncé
            marginBottom: '10px',
          }}
        >
          Sensibilisation et formations prévues
        </Typography>
        <Typography
          sx={{
            color: '#555',
          }}
        >
          Des sessions de sensibilisation et de formation seront organisées
          pour accompagner les établissements dans cette transition
          numérique. Un calendrier sera communiqué.
        </Typography>
      </Box>

      {/* Cadre 3 */}
      <Box
        sx={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#E8F5E9', // Fond vert clair
          borderRadius: '12px',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#388E3C', // Texte vert foncé
            marginBottom: '10px',
          }}
        >
          Prochain communiqué officiel
        </Typography>
        <Typography
          sx={{
            color: '#555',
          }}
        >
          Un communiqué officiel sera diffusé prochainement pour préciser les
          démarches administratives et logistiques à suivre pour une intégration
          réussie du projet dans tous les établissements.
        </Typography>
      </Box>
    </Box>
  </Box>
)}



{tabIndex === 1 && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' }, // Colonne pour petits écrans, ligne pour grands écrans
      alignItems: 'center',
      gap: 4,
      justifyContent: 'space-between',
    }}
  >
    {/* Texte au centre */}
    <Box
      sx={{
        flex: 1,
        textAlign: { xs: 'center', md: 'justify' }, // Texte justifié sur desktop
      }}
    >
      <Typography
        sx={{
          marginBottom: '10px',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          marginLeft: '50px',
          color: '#333',
        }}
      >
        Désormais, les diplômes délivrés par les écoles professionnelles du Niger
        respecteront des normes nationales et internationales reconnues. 
        Cette réforme vise à renforcer la valeur des qualifications 
        obtenues et à garantir leur reconnaissance sur le marché du travail, 
        aussi bien au niveau national qu'international.
      </Typography>
      <Typography
        sx={{
          marginBottom: '10px',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          marginLeft: '50px',
          color: '#333',
        }}
      >
        Les établissements sont invités à prendre les mesures nécessaires pour
        s’adapter à cette nouvelle réglementation. Des détails supplémentaires
        seront communiqués ultérieurement via des canaux officiels.
      </Typography>
    </Box>

    {/* Animation Lottie à droite */}
    <Box
      sx={{
        flex: 1,
        textAlign: 'center',
      }}
    >
      <Player
        autoplay
        loop
        src={animeavis} // Animation Lottie
        style={{
          height: '350px',
          maxWidth: '100%',
        }}
      />
    </Box>
  </Box>
)}




{tabIndex === 2 && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' }, // Colonne pour petits écrans, ligne pour grands écrans
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: '20px',
      backgroundColor: '#f9f9f9', // Fond doux pour toute la section
      borderRadius: '16px',
    }}
  >
    {/* Animation Lottie avec cadre */}
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#ffffff', // Fond blanc pour l'image
        borderRadius: '12px',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // Ombre subtile
      }}
    >
      <Player
        autoplay
        loop
        src={administrateurbepc} // Animation locale
        style={{
          height: '300px', // Taille ajustée pour mieux cadrer
          maxWidth: '100%',
        }}
      />
    </Box>

    {/* Texte informatif avec cadre */}
    <Box
      sx={{
        flex: 1,
        padding: '20px',
        backgroundColor: '#ffffff', // Fond blanc pour le texte
        borderRadius: '12px',
        boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // Ombre subtile
        textAlign: 'justify', // Texte justifié
      }}
    >
 <Typography
      sx={{
        fontSize: { xs: '1rem', md: '1.2rem' },
        color: '#333', // Texte sombre pour une meilleure lisibilité
        lineHeight: '1.8',
      }}
    >
      Chers <strong>enseignants</strong>, <strong> administrateurs</strong>, et 
      <strong> personnels éducatifs</strong>, pour toute information ou pour consulter
      les derniers communiqués importants, veuillez vous référer à la rubrique 
      <strong>
        <a
          href="#actualites-annonces" // Lien vers l'ID de la section cible
          style={{
            color: '#00ACC1', // Couleur pour le lien
            textDecoration: 'none',
          }}
        >
          Actualités et Annonces Importantes
        </a>
      </strong> disponible sur la plateforme. Cela vous permettra de rester informés
      des nouveautés et des mises à jour concernant le système éducatif.
    </Typography>

    </Box>
  </Box>
)}





  </Box>


</Box>










  {/* Partie restante sans le logo */}
 

  <Box
  sx={{
    backgroundColor: '#004d40',
    color: '#fff',
    marginTop: '20px',
    padding: '40px 20px',
    borderRadius: '12px',
    position: 'relative',
    textAlign: 'center', // Centrer le contenu
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', // Ombre douce pour un effet moderne
    overflow: 'hidden', // Empêche le débordement des éléments internes
  }}
>
  {/* Arrière-plan décoratif */}
  <Box
    sx={{
      position: 'absolute',
      top: '10%',
      left: '5%',
      width: '150px',
      height: '150px',
      background: 'radial-gradient(circle, rgba(0, 172, 193, 0.3), transparent)',
      borderRadius: '50%',
      zIndex: 1,
    }}
  />
  <Box
    sx={{
      position: 'absolute',
      bottom: '10%',
      right: '5%',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)',
      borderRadius: '50%',
      zIndex: 1,
    }}
  />

  {/* Texte principal */}
  <Typography
    variant="h5"
    component="h1"
    sx={{
      marginTop: '20px',
      fontWeight: 'bold',
      fontSize: {
        xs: '1.5rem',
        sm: '2rem',
        md: '2.5rem',
        lg: '2.7rem',
      },
      zIndex: 2, // Mettre le texte devant les décorations
      position: 'relative',
      lineHeight: 1.4, // Meilleure lisibilité
    }}
  >
    L'éducation universelle et participative <br /> pour un Niger inclusif
  </Typography>

  {/* Modal du Ministre */}
  <Box
    sx={{
      marginTop: '30px',
      zIndex: 2,
      position: 'relative',
    }}
  >
    <MessageMinistreModal />
  </Box>

  {/* Bouton Se Connecter */}
  <Box
    sx={{
      marginTop: '30px',
      zIndex: 2,
      position: 'relative',
    }}
  >
    <Button
      component={Link}
      to="/login"
      variant="contained"
      sx={{
        backgroundColor: '#00acc1',
        color: '#fff',
        fontWeight: 'bold',
        padding: '10px 20px',
        fontSize: '1.1rem',
        borderRadius: '8px',
        textTransform: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: '#00838f',
        },
        display: user ? 'none' : 'inline-block',
      }}
    >
      Se Connecter
    </Button>
  </Box>
  </Box>

</Box>







<Box sx={{ padding: '40px', backgroundColor: '#B2DFDB' }}>
    
<Grid container spacing={4}>
{/* Card 1: Inscription Examens */}
<Grid item xs={12} md={6}>
  <Card
    sx={{
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
      '@media (max-width:450px)': {
        padding: '15px',
        maxHeight: '250px',
      },
      '@media (max-width:320px)': {
        padding: '10px',
        maxHeight: '200px',
      },
    }}
  >
    <CardContent>
      <AssignmentIcon
        sx={{
          fontSize: {
            xs: '40px', // Réduction de la taille de l'icône pour les petits écrans
            sm: '50px',
          },
          color: '#FFD700',
        }}
      /> {/* Icône dorée pour BEPC */}
      <Typography
        variant="h5"
        sx={{
          mt: 2,
          mb: 2,
          fontWeight: 'bold',
          fontSize: {
            xs: '1rem', // Taille pour les petits écrans
            sm: '1.2rem', // Taille par défaut pour les écrans moyens
          },
          '@media (max-width:450px)': {
            fontSize: '0.9rem', // Plus petit pour les écrans ≤ 450px
          },
          '@media (max-width:320px)': {
            fontSize: '0.8rem', // Encore plus petit pour les écrans ≤ 320px
           
          },
        }}
      >
        Enregistrement aux Examens
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#e0f7fa',
          mb: 3,
          fontSize: {
            xs: '0.9rem', // Taille pour les petits écrans
            sm: '1rem',   // Taille par défaut
          },
          '@media (max-width:450px)': {
            fontSize: '0.8rem',
          },
          '@media (max-width:320px)': {
            fontSize: '0.7rem',
            display: 'none',
          },
        }}
      >
        Inscription et Participation aux Examens BEPC
      </Typography>
      <Button
        component={Link}
        to="/bepc-access"
        variant="contained"
        sx={{
          backgroundColor: '#FFD700', // Doré pour le bouton BEPC
          color: '#333',
          fontSize: {
            xs: '0.9rem', // Taille pour les petits écrans
            sm: '1.1rem', // Taille par défaut pour les écrans moyens
          },
          '@media (max-width:450px)': {
            fontSize: '0.8rem', // Plus petit pour les écrans ≤ 450px
          },
          '@media (max-width:320px)': {
            fontSize: '0.7rem', // Encore plus petit pour les écrans ≤ 320px
          },
          '&:hover': { backgroundColor: '#ffc107' }, // Doré plus vif au survol
        }}
      >
        Inscription BEPC
      </Button>
    </CardContent>
  </Card>
</Grid>



<Grid item xs={12} md={6}>
  <Card
    sx={{
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
      '@media (max-width:450px)': {
        padding: '15px', // Réduction des marges
        maxHeight: '250px',
      },
      '@media (max-width:320px)': {
        padding: '10px', // Moins d'espace pour les très petits écrans
        maxHeight: '200px',
      },
    }}
  >
    <CardContent>
      <FileCopyIcon
        sx={{
          fontSize: {
            xs: '40px', // Réduction de l'icône pour les petits écrans
            sm: '50px', // Taille par défaut pour les écrans moyens et plus
          },
          color: '#FF8C00',
        }}
      />
      <Typography
        variant="h5"
        sx={{
          mt: 2,
          mb: 2,
          fontWeight: 'bold',
          fontSize: {
            xs: '1rem', // Taille pour les petits écrans
            sm: '1.2rem', // Taille par défaut pour les écrans moyens
          },
          '@media (max-width:450px)': {
            fontSize: '0.9rem', // Plus petit pour les écrans <= 450px
          },
          '@media (max-width:320px)': {
            fontSize: '0.8rem', // Encore plus petit pour les écrans <= 320px
          },
        }}
      >
        Enregistrement aux Examens
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#fff8e1',
          mb: 3,
          fontSize: {
            xs: '0.9rem', // Taille pour les petits écrans
            sm: '1rem', // Taille par défaut pour les écrans moyens
          },
          '@media (max-width:450px)': {
            fontSize: '0.8rem', // Plus petit pour 450px
          },
          '@media (max-width:320px)': {
            fontSize: '0.7rem', // Encore plus petit pour 320px
            display: 'none',
          },
        }}
      >
        Inscription et Participation aux Examens CFEPD
      </Typography>
      <Button
        component={Link}
        to="/cfepd-access"
        variant="contained"
        sx={{
          backgroundColor: '#FF8C00', // Orange pour le bouton CFEPD
          color: '#fff',
          fontSize: {
            xs: '0.9rem', // Taille pour les petits écrans
            sm: '1.1rem', // Taille par défaut pour les écrans moyens
          },
          '@media (max-width:450px)': {
            fontSize: '0.8rem', // Plus petit pour les écrans <= 450px
          },
          '@media (max-width:320px)': {
            fontSize: '0.7rem', // Encore plus petit pour les écrans <= 320px
          },
          '&:hover': { backgroundColor: '#ff751a' }, // Orange plus vif au survol
        }}
      >
        Inscription CFEPD
      </Button>
    </CardContent>
  </Card>
</Grid>





  {/* Card 2: Accès au Bulletin Numérique */}
  <Box
  sx={{
    backgroundColor: '#f9f9f9',
    padding: '40px',
    marginLeft:'20px',
    width: '100%',
    height: 'auto',
    borderRadius: '16px',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // Ombre douce pour le conteneur
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' }, // Empilement sur petits écrans
    alignItems: 'center',
    gap: 4, // Espacement entre les sections
    justifyContent: 'space-between',
    marginTop: 4,
  }}
>
  {/* Section Gauche : Accès au Bulletin Numérique */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      flex: 1,
      padding: '20px',
      backgroundColor: '#2c3e50',
      borderRadius: '12px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    }}
  >
    <FileCopyIcon sx={{ fontSize: 50, color: '#FF8C00', marginBottom: '10px' }} />
    <Typography
      variant="h5"
      sx={{
        fontWeight: 'bold',
        fontSize: { xs: '1rem', sm: '1.2rem' },
        color: '#fff',
        marginBottom: '10px',
      }}
    >
      Accès au Bulletin Numérique
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: '#e0f7fa',
        fontSize: { xs: '0.9rem', sm: '1rem' },
        marginBottom: '20px',
      }}
    >
      Consultez les bulletins de vos enfants en ligne, rapidement et facilement.
    </Typography>
    <Button
      variant="contained"
      sx={{
        backgroundColor: '#FF8C00',
        color: '#fff',
        padding: '10px 20px',
        fontSize: { xs: '0.9rem', sm: '1.1rem' },
        '&:hover': { backgroundColor: '#e67e22' },
      }}
      onClick={() => handleAccess('consult')}
    >
      Consulter Bulletin
    </Button>
  </Box>

  {/* Section Droite : Informations sur le Ministre */}
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: 'center',
      textAlign: { xs: 'center', md: 'left' },
      flex: 1,
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    }}
  >
    {/* Image du Ministre */}
    <img
      src={ministerPhoto}
      alt="Portrait du Ministre"
      style={{
        width: '120px',
        height: '160px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '10px',
        marginRight: '20px',
      }}
    />
    {/* Texte associé */}
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: '#2e7d32',
          marginBottom: '8px',
        }}
      >
        Mme Elisabeth Sherif
      </Typography>
      <Typography variant="body2" sx={{ color: '#555', marginBottom: '10px' }}>
        MEN/A/EP/PLN
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#FF8C00',
          fontWeight: 'bold',
          fontSize: '1.1rem',
        }}
      >
        Un engagement fort pour une éducation inclusive et participative.
      </Typography>
    </Box>
  </Box>
</Box>



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
  id="actualites-annonces" // ID ajouté pour l'ancrage
  variant="h4"
  component="h2"
  sx={{
    fontWeight: 'bold',
    color: '#004d40',
    marginBottom: '40px',
    marginTop: '50px',
  }}
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

    <Box
  sx={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000, // Assurez-vous qu'il reste au-dessus des autres éléments
  }}
>


</Box>




  </Box>
</Box>



      </Container>
    </Box>
  );
};

export default HomePage;

