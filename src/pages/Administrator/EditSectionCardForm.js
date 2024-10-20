// // src/pages/Administrator/EditSectionCardForm.js
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { TextField, Button, Box } from '@mui/material';
// import axios from 'axios';

// const EditSectionCardForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [titleCard, setTitleCard] = useState('');
//   const [bodyCard, setBodyCard] = useState('');
//   const [btnCard, setBtnCard] = useState('');
//   const [titlePage, setTitlePage] = useState('');

//   useEffect(() => {
//     const fetchCard = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/section-cards/${id}`);
//         setTitleCard(response.data.titleCard || '');
//         setBodyCard(response.data.bodyCard || '');
//         setBtnCard(response.data.btnCard || '');
//         setTitlePage(response.data.titlePage || '');

//       } catch (error) {
//         console.error('Erreur lors de la récupération de la carte', error);
//       }
//     };

//     fetchCard();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:5000/api/section-cards/${id}`, {
//         titleCard,
//         bodyCard,
//         btnCard,
//         titlePage, // Ajout de titlePage
//       });
//       navigate('/admin/section-cards');
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de la carte', error);
//     }
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', mt: 4,  height: '500px', overflowY: 'auto' }}>
//       <h2>Modifier la carte</h2>
//       <TextField
//         label="Titre"
//         fullWidth
//         value={titleCard}
//         onChange={(e) => setTitleCard(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         label="Contenu"
//         fullWidth
//         value={bodyCard}
//         onChange={(e) => setBodyCard(e.target.value)}
//         multiline
//         rows={4}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         label="Texte du bouton"
//         fullWidth
//         value={btnCard}
//         onChange={(e) => setBtnCard(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//   label="Titre de la page"
//   fullWidth
//   value={titlePage}
//   onChange={(e) => setTitlePage(e.target.value)}
//   sx={{ mb: 2 }}
// />

//       <Button type="submit" variant="contained" color="primary" fullWidth>
//         Enregistrer
//       </Button>
//     </Box>
//   );
// };

// export default EditSectionCardForm;
