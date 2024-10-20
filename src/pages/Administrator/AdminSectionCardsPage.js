// // src/pages/Administrator/AdminSectionCardsPage.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import axios from 'axios';

// const AdminSectionCardsPage = () => {
//   const [sectionCards, setSectionCards] = useState([]);

//   useEffect(() => {
//     const fetchSectionCards = async () => {
//       try {
//         const response = await axios.get(`${apiBaseUrl}/api/section-cards');
//         setSectionCards(response.data);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des cartes', error);
//       }
//     };
    
//     fetchSectionCards();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/section-cards/${id}`);
//       setSectionCards(sectionCards.filter(card => card._id !== id));
//     } catch (error) {
//       console.error('Erreur lors de la suppression de la carte', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Gestion des Dernières Actualités</h2>
//       <Button component={Link} to="/admin/create-section-card" variant="contained" color="primary">
//         Créer une nouvelle carte
//       </Button>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Titre</TableCell>
//               <TableCell>Contenu</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {sectionCards.map((card) => (
//               <TableRow key={card._id}>
//                 <TableCell>{card.titleCard}</TableCell>
//                 <TableCell>{card.bodyCard}</TableCell>
//                 <TableCell>
//                   <Button component={Link} to={`/admin/edit-section-card/${card._id}`} variant="outlined">
//                     Modifier
//                   </Button>
//                   <Button onClick={() => handleDelete(card._id)} variant="contained" color="secondary">
//                     Supprimer
//                   </Button>
//                   <Button component={Link} to={`/admin/articles/${card._id}`} variant="contained" color="primary">
//                     Gérer Articles
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default AdminSectionCardsPage;
