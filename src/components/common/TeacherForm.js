// import React, { useState } from 'react';
// import axios from 'axios';
// import { TextField, Button, Grid, Paper, MenuItem, Typography } from '@mui/material';

// const TeacherForm = () => {
//   const [teacherData, setTeacherData] = useState({
//     nom: '',
//     téléphone: '',
//     email: '',
//     educationLevel: '',
//     photo: null, // On initialise la photo à null
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setTeacherData({ ...teacherData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setTeacherData({ ...teacherData, photo: e.target.files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Utilisation de FormData pour gérer le fichier et les autres données
//     const formData = new FormData();
//     formData.append('nom', teacherData.nom);
//     formData.append('téléphone', teacherData.téléphone);
//     formData.append('email', teacherData.email);
//     formData.append('educationLevel', teacherData.educationLevel);
//     if (teacherData.photo) {
//       formData.append('photo', teacherData.photo); // Ajout de la photo dans le formData
//     }

//     try {
//       const response = await axios.post(`${apiBaseUrl}/api/teachers', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Indiquer que nous envoyons un fichier
//         },
//       });

//       console.log('Enseignant créé avec succès :', response.data);
//     } catch (error) {
//       console.error('Erreur lors de la création de l\'enseignant :', error);
//     }
//   };

//   // return (
//   //   <form onSubmit={handleSubmit}>
//   //     <input
//   //       type="text"
//   //       name="nom"
//   //       placeholder="Nom"
//   //       value={teacherData.nom}
//   //       onChange={handleInputChange}
//   //     />
//   //     <input
//   //       type="text"
//   //       name="téléphone"
//   //       placeholder="Téléphone"
//   //       value={teacherData.téléphone}
//   //       onChange={handleInputChange}
//   //     />
//   //     <input
//   //       type="email"
//   //       name="email"
//   //       placeholder="Email"
//   //       value={teacherData.email}
//   //       onChange={handleInputChange}
//   //     />
//   //     <select
//   //       name="educationLevel"
//   //       value={teacherData.educationLevel}
//   //       onChange={handleInputChange}
//   //     >
//   //       <option value="">Choisir le niveau d'enseignement</option>
//   //       <option value="Primaire">Primaire</option>
//   //       <option value="Collège">Collège</option>
//   //       <option value="Lycée">Lycée</option>
//   //     </select>
//   //     <input type="file" name="photo" onChange={handleFileChange} />
//   //     <button type="submit">Créer Enseignant</button>
//   //   </form>
//   // );


//   return (
//     <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
//       <Typography variant="h5" gutterBottom sx={{ color: '#004d40', fontWeight: 'bold' }}>
//         Créer un Enseignant
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Nom"
//               variant="outlined"
//               name="nom"
//               value={teacherData.nom}
//               onChange={handleInputChange}
//               required
//               sx={{ 
//                 backgroundColor: '#FFF',
//                 borderRadius: 1,
//                 '& .MuiOutlinedInput-notchedOutline': { borderColor: '#004d40' },
//                 '& .MuiInputLabel-root': { color: '#004d40' }
//               }}
//             />
//           </Grid>
          
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Téléphone"
//               variant="outlined"
//               name="téléphone"
//               value={teacherData.téléphone}
//               onChange={handleInputChange}
//               required
//               sx={{ 
//                 backgroundColor: '#FFF',
//                 borderRadius: 1,
//                 '& .MuiOutlinedInput-notchedOutline': { borderColor: '#004d40' },
//                 '& .MuiInputLabel-root': { color: '#004d40' }
//               }}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Email"
//               variant="outlined"
//               name="email"
//               type="email"
//               value={teacherData.email}
//               onChange={handleInputChange}
//               required
//               sx={{ 
//                 backgroundColor: '#FFF',
//                 borderRadius: 1,
//                 '& .MuiOutlinedInput-notchedOutline': { borderColor: '#004d40' },
//                 '& .MuiInputLabel-root': { color: '#004d40' }
//               }}
//             />
//           </Grid>

//           <Grid item xs={12}>
//             <TextField
//               select
//               fullWidth
//               label="Niveau d'Enseignement"
//               name="educationLevel"
//               value={teacherData.educationLevel}
//               onChange={handleInputChange}
//               required
//               sx={{ 
//                 backgroundColor: '#FFF',
//                 borderRadius: 1,
//                 '& .MuiOutlinedInput-notchedOutline': { borderColor: '#004d40' },
//                 '& .MuiInputLabel-root': { color: '#004d40' }
//               }}
//             >
//               <MenuItem value="Primaire">Primaire</MenuItem>
//               <MenuItem value="Collège">Collège</MenuItem>
//               <MenuItem value="Lycée">Lycée</MenuItem>
//             </TextField>
//           </Grid>

//           <Grid item xs={12}>
//             <Button
//               variant="contained"
//               component="label"
//               sx={{
//                 backgroundColor: '#004d40',
//                 color: '#fff',
//                 '&:hover': { backgroundColor: '#00332d' }
//               }}
//             >
//               Télécharger Photo
//               <input
//                 type="file"
//                 hidden
//                 name="photo"
//                 onChange={handleFileChange}
//               />
//             </Button>
//           </Grid>

//           <Grid item xs={12}>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{
//                 backgroundColor: '#1976d2',
//                 color: '#fff',
//                 '&:hover': { backgroundColor: '#004ba0' }
//               }}
//             >
//               Créer Enseignant
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Paper>
//   );
// };

// export default TeacherForm;
