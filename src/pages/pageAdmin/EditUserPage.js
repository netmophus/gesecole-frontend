// // src/pages/ministere/EditUserPage.js

// import React, { useState, useEffect } from 'react';
// import { Container, Typography, TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
// import { useParams, useNavigate } from 'react-router-dom';

// const EditUserPage = () => {
//   const { id } = useParams(); // Obtenir l'ID de l'utilisateur à partir des paramètres de l'URL
//   const [user, setUser] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     role: '',
//     isActive: true,
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data); // Mettre à jour l'état avec les données récupérées de l'utilisateur
//         } else {
//           console.error('Erreur lors de la récupération de l\'utilisateur:', res.statusText);
//         }
//       } catch (err) {
//         console.error('Erreur lors de la récupération de l\'utilisateur:', err);
//       }
//     };

//     fetchUser();
//   }, [id]); // Dépendance à l'ID de l'utilisateur pour recharger si l'ID change

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//       });

//       if (res.ok) {
//         alert('Utilisateur mis à jour avec succès');
//         navigate('/ministere/manage-users'); // Redirection après mise à jour
//       } else {
//         console.error('Erreur lors de la mise à jour de l\'utilisateur:', res.statusText);
//       }
//     } catch (err) {
//       console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Modifier l'Utilisateur
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Nom"
//               name="name"
//               value={user.name} // Valeur initiale provenant de l'état utilisateur
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Téléphone"
//               name="phone"
//               value={user.phone} // Valeur initiale provenant de l'état utilisateur
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Email"
//               name="email"
//               value={user.email} // Valeur initiale provenant de l'état utilisateur
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControl fullWidth>
//               <InputLabel id="role-label">Rôle</InputLabel>
//               <Select
//                 labelId="role-label"
//                 name="role"
//                 value={user.role} // Valeur initiale provenant de l'état utilisateur
//                 onChange={handleChange}
//               >
//                 <MenuItem value="Admin">Admin</MenuItem>
//                 <MenuItem value="Enseignant">Enseignant</MenuItem>
//                 <MenuItem value="Eleve">Eleve</MenuItem>
//                 <MenuItem value="Inspection">Inspection</MenuItem>
//                 <MenuItem value="Regional">Regional</MenuItem>
//                 <MenuItem value="Parent">Parent</MenuItem>
//                 <MenuItem value="Etablissement">Etablissement</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <FormControl fullWidth>
//               <InputLabel id="status-label">Statut</InputLabel>
//               <Select
//                 labelId="status-label"
//                 name="isActive"
//                 value={user.isActive}
//                 onChange={(e) => setUser({ ...user, isActive: e.target.value === 'true' })}
//               >
//                 <MenuItem value={true}>Actif</MenuItem>
//                 <MenuItem value={false}>Inactif</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <Button type="submit" variant="contained" color="primary">
//               Mettre à jour
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Container>
//   );
// };

// export default EditUserPage;
