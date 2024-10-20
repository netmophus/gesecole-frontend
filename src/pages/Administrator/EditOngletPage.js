// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
// import axios from 'axios';

// const EditOngletPage = () => {
//   const { id } = useParams(); // Récupère l'id depuis l'URL
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     titleOnglet: '',
//     bodyOnglet: '',
//     imgOnglet: '',
//     videoOnglet: '',
//     btnOnglet: ''
//   });
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     // Charger les détails de l'onglet à éditer
//     const fetchOnglet = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/onglets/${id}`);
//         setFormData(response.data);
//       } catch (err) {
//         console.error('Erreur lors de la récupération de l\'onglet', err);
//       }
//     };
    
//     fetchOnglet();
//   }, [id]);

//   // Gérer les changements dans le formulaire
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formDataToSend = new FormData();
//     formDataToSend.append('titleOnglet', formData.titleOnglet);
//     formDataToSend.append('bodyOnglet', formData.bodyOnglet);
//     formDataToSend.append('btnOnglet', formData.btnOnglet);

//     if (file) {
//       formDataToSend.append('imgOnglet', file);
//     }

//     if (formData.videoOnglet) {
//       formDataToSend.append('videoOnglet', formData.videoOnglet);
//     }

//     try {
//       // Envoyer la requête PUT pour mettre à jour l'onglet
//       const token = localStorage.getItem('token');
//       await axios.put(`http://localhost:5000/api/onglets/${id}`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       navigate('/activity-management'); // Redirige vers la page de gestion après la mise à jour
//     } catch (err) {
//       console.error('Erreur lors de la mise à jour de l\'onglet', err.response ? err.response.data : err);
//     }
//   };

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>Modifier l'Onglet</Typography>
//       <Paper sx={{ padding: 2 }}>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Titre de l'Onglet"
//                 name="titleOnglet"
//                 value={formData.titleOnglet}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Texte du Bouton"
//                 name="btnOnglet"
//                 value={formData.btnOnglet}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Contenu de l'Onglet"
//                 name="bodyOnglet"
//                 value={formData.bodyOnglet}
//                 onChange={handleInputChange}
//                 multiline
//                 rows={4}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 type="file"
//                 inputProps={{ accept: 'image/*' }}
//                 name="imgOnglet"
//                 onChange={handleFileChange}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="URL de la Vidéo"
//                 name="videoOnglet"
//                 value={formData.videoOnglet}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Button variant="contained" color="primary" type="submit">
//                 Mettre à jour
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default EditOngletPage;
