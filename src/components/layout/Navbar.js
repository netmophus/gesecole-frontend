
import React, { useContext, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material'; // Importation de CloseIcon
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/images/armoiries-niger.png';  // Assurez-vous que le chemin est correct

//import axios from 'axios';
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  //const [establishment, setEstablishment] = useState(null);  // Pour stocker les infos de l'établissement
  const handleDashboardNavigation = () => {
    if (user) {
      switch (user.role) {
        case 'Admin':
          navigate('/ministere/dashboard');
          break;
        case 'Etablissement':
          if (user.isConfigured) {
            navigate('/etablissement/dashboardPage');
          } else {
            navigate('/etablissement/configuration');
          }
          break;
        default:
          console.error('Rôle utilisateur non reconnu:', user.role);
          navigate('/login');
          break;
      }
    } else {
      console.error("L'utilisateur n'est pas défini.");
      navigate('/login');
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
    

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#004d40', padding: '10px 0' }}>
       
       
       
       
       
        <Toolbar>
          {/* Logo cliquable pour retourner à HomePage */}
         
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1, padding: '10px 20px', backgroundColor: '#004d40', borderBottom: '4px solid #00acc1', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}> 
            <img 
              src={logo} 
              alt="Armoiries du Niger" 
              style={{ 
                height: 80, 
                width: 'auto', 
                cursor: 'pointer', 
                marginRight: 15, 
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))', 
                transition: 'transform 0.3s ease', 
                '&:hover': { transform: 'scale(1.05)' } 
              }} 
            />


            
            <Box sx={{ marginLeft: 2 }}>              


<Typography 
  variant="h4" 
  component="div" 
  sx={{ 
    color: '#ffffff', 
    fontWeight: 'bold', 
    textShadow: '1px 2px 6px rgba(0, 0, 0, 0.4)', 
    transition: 'color 0.3s', 
    '&:hover': { color: '#00acc1' },
    fontSize: {
      xs: '1.5rem',  // Taille pour les écrans extra petits
      sm: '2rem',    // Taille pour les petits écrans
      md: '2.5rem',  // Taille pour les écrans moyens
      lg: '3rem',    // Taille par défaut pour les grands écrans
    },
    '@media (max-width:400px)': {
      display: 'none', // Masqué à partir de 400px de largeur d'écran
    },
  }}
>
  Portail des Établissements Scolaires
</Typography>

              <Typography 
  variant="subtitle1" 
  component="div" 
  sx={{ 
    color: '#e0f7fa', 
    fontStyle: 'italic', 
    marginTop: '5px', 
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' 
  }}
>
 MEN/A/EP/PLN
</Typography>

            </Box>
          </Link>
        </Box>

          


          
               

          {/* Menu hamburger agrandi pour utilisateurs connectés */}
          {user ? (
            <>
              <IconButton 
                edge="end" 
                color="inherit" 
                aria-label="menu" 
                onClick={toggleDrawer(true)} 
                sx={{ fontSize: '3rem' }} // Agrandit l'icône du menu
              >
                <MenuIcon sx={{ fontSize: '3rem' }} /> {/* Agrandit l'icône elle-même */}
              </IconButton>
              <Drawer 
                anchor="right" 
                open={drawerOpen} 
                onClose={toggleDrawer(false)}
                sx={{
                  '& .MuiDrawer-paper': {
                    backgroundColor: '#333', // Fond gris pour le drawer
                    color: '#fff', // Texte blanc
                    width: '250px', // Largeur du drawer
                    transition: 'transform 0.3s ease-in-out', // Effet de transition fluide
                  }
                }}
              >
                {/* Bouton de fermeture dans le drawer */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                  <IconButton onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
                    <CloseIcon sx={{ fontSize: '2rem' }} /> {/* Icône de fermeture agrandie */}
                  </IconButton>
                </Box>
                <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                <List>
  <ListItemButton onClick={handleDashboardNavigation}>
    <ListItemText 
      primary="Dashboard" 
      primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
    />
  </ListItemButton>
  {user.role === 'Etablissement' && user.isConfigured && (


    <>

      {/* Nouveau lien pour les années académiques */}
    <ListItemButton component={Link} to="/academic-years">
      <ListItemText 
        primary="Années Scolaires" 
        primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
      />
    </ListItemButton>





      <ListItemButton component={Link} to="/etablissement/subjects">
        <ListItemText 
          primary="Matières" 
          primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
        />
      </ListItemButton>
      <ListItemButton component={Link} to="/etablissement/teachers">
        <ListItemText 
          primary="Enseignants" 
          primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
        />
      </ListItemButton>


      <ListItemButton component={Link} to="/students">
        <ListItemText 
          primary="Élèves" 
          primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
        />
      </ListItemButton>

      <ListItemButton component={Link} to="/devoircompos/create">
      <ListItemText 
        primary="Notes" 
        primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} 
      />
    </ListItemButton>

      
      <ListItemButton component={Link} to="/classes">
        <ListItemText 
          primary="Classes" 
          primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
        />
      </ListItemButton>

      <ListItemButton component={Link} to="/bulletins">
        <ListItemText 
          primary="Bulletins" 
          primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
        />
      </ListItemButton>

      {/* Ajoutez ici le nouveau lien pour Cartes Scolaires */}
      <ListItemButton component={Link} to="/school-cards">
                          <ListItemText 
                            primary="Cartes Scolaires" 
                            primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
                          />
      </ListItemButton>

      
    </>
    
  )}


  {/* Lien pour l'administrateur du ministère */}
  {user.role === 'Admin' && (
    <>

    {/* Nouveau lien pour les années académiques */}
    <ListItemButton component={Link} to="/academic-years">
      <ListItemText 
        primary="Années Académiques" 
        primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
      />
    </ListItemButton>

    
      <ListItemButton component={Link} to="/admin/dashboard">
        <ListItemText 
          primary="Administrator" 
          primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} 
        />
      </ListItemButton>

         {/* Lien vers Matières Pédagogiques */}
         <ListItemButton component={Link} to="/admin/pedagogical-subjects" sx={{ marginRight: 2 }}>
              <ListItemText 
                primary="Matières Pédagogiques" 
                primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} 
              />
            </ListItemButton>
        {/* Nouveau lien pour les ressources pédagogiques */}
          <ListItemButton component={Link} to="/admin/pedagogical-resources">
                  <ListItemText 
                      primary="Ressources Pédagogiques" 
                    primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} 
                    />
            </ListItemButton>

     {/* Nouveau lien pour les chapitres */}
     <ListItemButton component={Link} to="/admin/chapters">
        <ListItemText
          primary="Chapitres"
          primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }}
        />
      </ListItemButton>
    </>

  )}


{user?.role === 'AdminBEPC' && (
  <>
    <ListItemButton component={Link} to="/register-bepc">
      <ListItemText primary="Inscription BEPC" primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} />
    </ListItemButton>
    <ListItemButton component={Link} to="/login-bepc">
      <ListItemText primary="Connexion BEPC" primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} />
    </ListItemButton>
    <ListItemButton component={Link} to="/dashboard-bepc">
      <ListItemText primary="Dashboard BEPC" primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} />
    </ListItemButton>
    <ListItemButton component={Link} to="/results-bepc">
      <ListItemText primary="Résultats BEPC" primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} />
    </ListItemButton>
  </>
)}




  <ListItemButton onClick={logout}>
    <ListItemText 
      primary="Logout" 
      primaryTypographyProps={{ fontSize: '1.5rem', color: '#fff' }} // Modifier la taille et couleur du texte ici
    />
  </ListItemButton>


  
</List>

                </Box>
              </Drawer>
            </>
          ) : (
            // Boutons de connexion et d'inscription pour utilisateurs non connectés
            <Box sx={{ display: 'none', gap: 2 }}>
              <Button color="inherit" component={Link} to="/login" sx={{ fontSize: '1.2rem' }}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" sx={{ fontSize: '1.2rem' }}>
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      
      
      
      
      
      
      </AppBar>
    </>
  );
};

export default Navbar;
