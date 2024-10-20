// // src/components/Sidebar.js

// import React from 'react';
// import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
// import { Dashboard, People, Settings, ExitToApp } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

// const Sidebar = ({ open, onClose }) => {
//   const navigate = useNavigate();

//   const handleNavigation = (path) => {
//     navigate(path);
//     onClose();
//   };

//   return (
//     <Drawer open={open} onClose={onClose} variant="persistent" anchor="left">
//       <List>
//         <ListItem button onClick={() => handleNavigation('/ministere/DashboardPage')}>
//           <ListItemIcon>
//             <Dashboard />
//           </ListItemIcon>
//           <ListItemText primary="Tableau de Bord" />
//         </ListItem>
//         <Divider />
//         {/* Lien pour gérer les utilisateurs */}
//         <ListItem button onClick={() => handleNavigation('/ministere/manage-users')}>
//           <ListItemIcon>
//             <People />
//           </ListItemIcon>
//           <ListItemText primary="Gérer les Utilisateurs" />
//         </ListItem>
//         <ListItem button onClick={() => handleNavigation('/ministere/manage-content')}>
//           <ListItemIcon>
//             <Settings />
//           </ListItemIcon>
//           <ListItemText primary="Gérer le Contenu" />
//         </ListItem>
//         <Divider />
//         <ListItem button onClick={() => {
//           localStorage.removeItem('token'); // Suppression du token pour déconnexion
//           handleNavigation('/login'); // Redirection vers la page de connexion
//         }}>
//           <ListItemIcon>
//             <ExitToApp />
//           </ListItemIcon>
//           <ListItemText primary="Déconnexion" />
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;
