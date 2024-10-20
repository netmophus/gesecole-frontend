// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
// import axios from 'axios';
// import PedagogicalResourceForm from '../../components/Resources/PedagogicalResourceForm';  // Le formulaire pour la mise à jour

// const PedagogicalResourceList = () => {
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editResource, setEditResource] = useState(null); // Ressource à éditer
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   // Récupérer les ressources pédagogiques depuis l'API
//   useEffect(() => {
//     fetchResources();
//   }, []);

//   const fetchResources = async () => {
//     try {
//       if (!user || !user.token) {
//         alert('Vous devez être connecté pour effectuer cette action');
//         return;
//       }
  
//       setLoading(true);
//       const response = await axios.get(`${apiBaseUrl}/api/pedagogical-resources', {
//         headers: {
//           'Authorization': `Bearer ${user.token}`, // Inclure le token JWT dans les en-têtes
//         }
//       });
//       setResources(response.data);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       setSnackbar({ open: true, message: 'Erreur lors de la récupération des ressources', severity: 'error' });
//     }
//   };
  

//   // Supprimer une ressource
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/pedagogical-resources/${id}`);
//       setSnackbar({ open: true, message: 'Ressource supprimée avec succès', severity: 'success' });
//       fetchResources(); // Recharger les ressources après suppression
//     } catch (err) {
//       setSnackbar({ open: true, message: 'Erreur lors de la suppression de la ressource', severity: 'error' });
//     }
//   };

//   // Fermer le Snackbar
//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   if (loading) {
//     return <CircularProgress />;
//   }

//   return (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Titre</TableCell>
//             <TableCell>Description</TableCell>
//             <TableCell>Classe</TableCell>
//             <TableCell>Matière</TableCell>
//             <TableCell>Type</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {resources.map((resource) => (
//             <TableRow key={resource._id}>
//               <TableCell>{resource.title}</TableCell>
//               <TableCell>{resource.description}</TableCell>
//               <TableCell>{resource.class.name}</TableCell>
//               <TableCell>{resource.subject.name}</TableCell>
//               <TableCell>{resource.resourceType}</TableCell>
//               <TableCell>
//                 {/* Bouton d'édition */}
//                 <IconButton onClick={() => setEditResource(resource)}>
//                   <EditIcon />
//                 </IconButton>
//                 {/* Bouton de suppression */}
//                 <IconButton onClick={() => handleDelete(resource._id)} color="secondary">
//                   <DeleteIcon />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Afficher le formulaire pour la mise à jour si une ressource est sélectionnée */}
//       {editResource && (
//         <PedagogicalResourceForm resource={editResource} onClose={() => setEditResource(null)} onSave={fetchResources} />
//       )}

//       {/* Snackbar pour les notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </TableContainer>
//   );
// };

// export default PedagogicalResourceList;



// import React, { useState, useEffect, useContext } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
// import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
// import axios from 'axios';
// import { AuthContext } from '../../context/AuthContext'; // Assurez-vous d'importer le contexte

// import PedagogicalResourceForm from '../../components/Resources/PedagogicalResourceForm';  // Le formulaire pour la mise à jour

// const PedagogicalResourceList = () => {
//   const { user } = useContext(AuthContext); // Récupérer l'utilisateur connecté depuis le contexte

//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editResource, setEditResource] = useState(null); // Ressource à éditer
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   // Récupérer les ressources pédagogiques depuis l'API
//   useEffect(() => {
//     fetchResources();
//   }, []);

//   const fetchResources = async () => {
//     try {
//       if (!user || !user.token) {
//         alert('Vous devez être connecté pour effectuer cette action');
//         return;
//       }

//       setLoading(true);
//       const response = await axios.get(`${apiBaseUrl}/api/pedagogical-resources', {
//         headers: {
//           'Authorization': `Bearer ${user.token}`, // Utilisez le token JWT
//         }
//       });
//       setResources(response.data);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       setSnackbar({ open: true, message: 'Erreur lors de la récupération des ressources', severity: 'error' });
//     }
//   };

//   // Supprimer une ressource
//   const handleDelete = async (id) => {
//     try {
//       if (!user || !user.token) {
//         alert('Vous devez être connecté pour effectuer cette action');
//         return;
//       }

//       await axios.delete(`http://localhost:5000/api/pedagogical-resources/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${user.token}`, // Utilisez le token JWT
//         }
//       });
//       setSnackbar({ open: true, message: 'Ressource supprimée avec succès', severity: 'success' });
//       fetchResources(); // Recharger les ressources après suppression
//     } catch (err) {
//       setSnackbar({ open: true, message: 'Erreur lors de la suppression de la ressource', severity: 'error' });
//     }
//   };

//   // Fermer le Snackbar
//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   if (loading) {
//     return <CircularProgress />;
//   }

//   return (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Titre</TableCell>
//             <TableCell>Description</TableCell>
//             <TableCell>Classe</TableCell>
//             <TableCell>Matière</TableCell>
//             <TableCell>Type</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {resources.map((resource) => (
//             <TableRow key={resource._id}>
//               <TableCell>{resource.title}</TableCell>
//               <TableCell>{resource.description}</TableCell>
//               <TableCell>{resource.class.name}</TableCell>
//               <TableCell>{resource.subject.name}</TableCell>
//               <TableCell>{resource.resourceType}</TableCell>
//               <TableCell>
//                 {/* Bouton d'édition */}
//                 <IconButton onClick={() => setEditResource(resource)}>
//                   <EditIcon />
//                 </IconButton>
//                 {/* Bouton de suppression */}
//                 <IconButton onClick={() => handleDelete(resource._id)} color="secondary">
//                   <DeleteIcon />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Afficher le formulaire pour la mise à jour si une ressource est sélectionnée */}
//       {editResource && (
//         <PedagogicalResourceForm resource={editResource} onClose={() => setEditResource(null)} onSave={fetchResources} />
//       )}

//       {/* Snackbar pour les notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </TableContainer>
//   );
// };

// export default PedagogicalResourceList;


