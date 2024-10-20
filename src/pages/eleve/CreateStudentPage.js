// import React, { useState, useContext, useEffect } from 'react';
// import { AuthContext } from '../../context/AuthContext';
// import { Container, TextField, Button, MenuItem, Box, Typography } from '@mui/material';

// const CreateStudentPage = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: '',
//     classId: '',
//   });
//   const [classes, setClasses] = useState([]);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     // Charger les classes disponibles pour cet établissement
//     const fetchClasses = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/classes?establishment=${user.schoolId}`, {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//           },
//         });
//         const data = await res.json();
//         setClasses(data.classes || []);
//       } catch (err) {
//         console.error('Erreur lors de la récupération des classes:', err);
//       }
//     };

//     fetchClasses();
//   }, [user]);

//   const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${apiBaseUrl}/api/students', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`,
//         },
//         body: JSON.stringify({ ...formData, establishmentId: user.schoolId }),
//       });

//       if (res.ok) {
//         alert('Élève créé avec succès!');
//       } else {
//         const data = await res.json();
//         alert(data.msg || 'Erreur lors de la création de l\'élève');
//       }
//     } catch (err) {
//       console.error('Erreur du serveur:', err);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           Créer un Nouvel Élève
//         </Typography>
//         <form onSubmit={onSubmit}>
//           <TextField
//             label="Prénom de l'Élève"
//             name="firstName"
//             value={formData.firstName}
//             onChange={onChange}
//             required
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Nom de l'Élève"
//             name="lastName"
//             value={formData.lastName}
//             onChange={onChange}
//             required
//             fullWidth
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             label="Date de Naissance"
//             name="dateOfBirth"
//             type="date"
//             value={formData.dateOfBirth}
//             onChange={onChange}
//             required
//             fullWidth
//             InputLabelProps={{
//               shrink: true,
//             }}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             select
//             label="Genre"
//             name="gender"
//             value={formData.gender}
//             onChange={onChange}
//             required
//             fullWidth
//             sx={{ mb: 2 }}
//           >
//             <MenuItem value="Male">Masculin</MenuItem>
//             <MenuItem value="Female">Féminin</MenuItem>
//           </TextField>
//           <TextField
//             select
//             label="Classe"
//             name="classId"
//             value={formData.classId}
//             onChange={onChange}
//             required
//             fullWidth
//             sx={{ mb: 2 }}
//           >
//             {classes.map((classe) => (
//               <MenuItem key={classe._id} value={classe._id}>
//                 {classe.name} ({classe.level})
//               </MenuItem>
//             ))}
//           </TextField>
//           <Button type="submit" variant="contained" color="primary">
//             Créer l'Élève
//           </Button>
//         </form>
//       </Box>
//     </Container>
//   );
// };

// export default CreateStudentPage;
