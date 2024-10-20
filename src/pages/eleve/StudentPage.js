// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   TablePagination,
//   InputAdornment,
//   TextField,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Card,
//   CardContent,
//   Snackbar,  // Importer Snackbar pour afficher des notifications
//   Alert,     // Importer Alert pour styliser les messages dans le Snackbar
// } from '@mui/material';
// import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
// import axios from 'axios';
// import debounce from 'lodash.debounce';
// import { AuthContext } from '../../context/AuthContext';

// const StudentPage = () => {
//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [currentStudent, setCurrentStudent] = useState({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '' });
//   const [editing, setEditing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [totalCount, setTotalCount] = useState(0);
//   const { user } = useContext(AuthContext);
//   const [openGenerate, setOpenGenerate] = useState(false); 
//   const [selectedClassId, setSelectedClassId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [classStudents, setClassStudents] = useState([]);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);  // État pour ouvrir ou fermer le Snackbar
//   const [snackbarMessage, setSnackbarMessage] = useState(''); // Message pour le Snackbar
//   const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Sévérité pour le Snackbar

//   // Fonction pour récupérer les élèves
//   const fetchStudents = useCallback(async () => {
//     if (!user || !user.token) {
//       console.error('Utilisateur non connecté.');
//       return;
//     }

//     try {
//       const res = await axios.get(`${apiBaseUrl}/api/students', {
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//         },
//         params: {
//           search: searchTerm,
//           page: page + 1,
//           limit: rowsPerPage,
//         }
//       });

//       setStudents(res.data.students || []);
//       setTotalCount(res.data.total || 0); 
//     } catch (err) {
//       console.error('Erreur lors de la récupération des élèves:', err);
//       setStudents([]);
//     }
//   }, [user, searchTerm, page, rowsPerPage]);

//   useEffect(() => {
//     fetchStudents();
//   }, [fetchStudents]);

//   const fetchClasses = useCallback(async () => {
//     try {
//       if (!user || !user.token) {
//         console.error('Aucun token trouvé dans le contexte utilisateur');
//         alert('Vous devez être connecté pour effectuer cette action');
//         return;
//       }

//       const res = await axios.get(`${apiBaseUrl}/api/classes', {
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//         }
//       });

//       setClasses(res.data.classes || []);
//     } catch (err) {
//       console.error('Erreur lors de la récupération des classes:', err);
//       setClasses([]);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchClasses();
//   }, [fetchClasses]);

//   const handleSearchChange = debounce((event) => {
//     setSearchTerm(event.target.value.toLowerCase());
//     setPage(0);
//   }, 300);

//   const handleOpen = () => setOpen(true);

//   const handleClose = () => {
//     setOpen(false);
//     setCurrentStudent({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '' });
//     setEditing(false);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   const handleChange = (key, value) => {
//     setCurrentStudent((prevStudent) => ({ ...prevStudent, [key]: value }));
//   };

//   // const handleSave = async (e) => {
//   //   e.preventDefault();

//   //   const studentData = {
//   //     ...currentStudent,
//   //     establishmentId: user.schoolId,
//   //   };

//   //   try {
//   //     const token = user.token;
//   //     if (!token) {
//   //       console.error('Aucun token trouvé dans le contexte utilisateur');
//   //       setSnackbarMessage('Vous devez être connecté pour effectuer cette action');
//   //       setSnackbarSeverity('error');
//   //       setSnackbarOpen(true);
//   //       return;
//   //     }

//   //     if (editing) {
//   //       await axios.put(`http://localhost:5000/api/students/${currentStudent._id}`, studentData, {
//   //         headers: {
//   //           'Authorization': `Bearer ${token}`,
//   //           'Content-Type': 'application/json',
//   //         }
//   //       });
//   //     } else {
//   //       await axios.post(`${apiBaseUrl}/api/students', studentData, {
//   //         headers: {
//   //           'Authorization': `Bearer ${token}`,
//   //           'Content-Type': 'application/json',
//   //         }
//   //       });
//   //     }

//   //     fetchStudents();
//   //     handleClose();
//   //     setSnackbarMessage(editing ? 'Élève mis à jour avec succès.' : 'Élève ajouté avec succès.');
//   //     setSnackbarSeverity('success');
//   //     setSnackbarOpen(true);
//   //   } catch (err) {
//   //     console.error('Erreur lors de la création ou de la mise à jour de l\'élève:', err.response ? err.response.data : err.message);
//   //     setSnackbarMessage('Erreur du serveur lors de la création ou de la mise à jour de l\'élève.');
//   //     setSnackbarSeverity('error');
//   //     setSnackbarOpen(true);
//   //   }
//   // };




//   const downloadTextFile = (matricule, password) => {
//     const element = document.createElement('a');
//     const file = new Blob([`Matricule: ${matricule}\nMot de passe: ${password}`], { type: 'text/plain' });
//     element.href = URL.createObjectURL(file);
//     element.download = 'login_info.txt';
//     document.body.appendChild(element);
//     element.click();
//   };
  


//   const handleSave = async (e) => {
//     e.preventDefault();
  
//     const studentData = {
//       ...currentStudent,
//       establishmentId: user.schoolId,
//     };
  
//     try {
//       const token = user.token;
//       if (!token) {
//         console.error('Aucun token trouvé dans le contexte utilisateur');
//         setSnackbarMessage('Vous devez être connecté pour effectuer cette action');
//         setSnackbarSeverity('error');
//         setSnackbarOpen(true);
//         return;
//       }
  
//       let res;
//       if (editing) {
//         res = await axios.put(`http://localhost:5000/api/students/${currentStudent._id}`, studentData, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           }
//         });
//       } else {
//         res = await axios.post(`${apiBaseUrl}/api/students', studentData, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           }
//         });
//       }
  
//       // Si la création est réussie, afficher le matricule et le mot de passe
//       if (res && res.data) {
//         const { matricule, password } = res.data;
//         setSnackbarMessage(`Matricule: ${matricule}, Mot de passe: ${password}`);
//         setSnackbarSeverity('success');
//         setSnackbarOpen(true);
//         downloadTextFile(matricule, password);  // Télécharger le fichier texte
//       }
  
//       fetchStudents();
//       handleClose();
//     } catch (err) {
//       console.error('Erreur lors de la création ou de la mise à jour de l\'élève:', err.response ? err.response.data : err.message);
//       setSnackbarMessage('Erreur du serveur lors de la création ou de la mise à jour de l\'élève.');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

  







//   const handleEdit = (student) => {
//     setCurrentStudent({
//       ...student,
//       dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '', 
//       classId: student.classId ? student.classId._id : '', 
//     });
//     setEditing(true);
//     handleOpen(); 
//   };

//   const handleDelete = async (id) => {
//     if (!user || !user.token) {
//       console.error('Utilisateur non connecté.');
//       setSnackbarMessage('Utilisateur non connecté.');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//       return;
//     }

//     try {
//       await axios.delete(`http://localhost:5000/api/students/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//         }
//       });

//       fetchStudents();
//       setSnackbarMessage('Élève supprimé avec succès.');
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
//     } catch (err) {
//       console.error('Erreur lors de la suppression de l\'élève:', err.response ? err.response.data : err.message);
//       setSnackbarMessage('Erreur lors de la suppression de l\'élève.');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleGenerateCards = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${apiBaseUrl}/api/students/generate-school-cards', { classId: selectedClassId }, {
//         headers: {
//           'Authorization': `Bearer ${user.token}`,
//         }
//       });

//       console.log('Cartes scolaires générées:', res.data);

//       if (res.data.cards.length === 0) {
//         setSnackbarMessage('Toutes les cartes scolaires ont déjà été générées pour cette classe.');
//         setSnackbarSeverity('info');
//       } else {
//         setSnackbarMessage('Cartes scolaires générées avec succès.');
//         setSnackbarSeverity('success');
//       }

//       setSnackbarOpen(true);
//     } catch (err) {
//       console.error('Erreur lors de la génération des cartes scolaires:', err.response ? err.response.data : err.message);
//       setSnackbarMessage('Erreur lors de la génération des cartes scolaires.');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClassChange = async (e) => {
//     const selectedClassId = e.target.value;
//     setSelectedClassId(selectedClassId);

//     if (selectedClassId) {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/students?classId=${selectedClassId}`, {
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//           }
//         });

//         setClassStudents(res.data.students || []);
//       } catch (err) {
//         console.error('Erreur lors de la récupération des élèves pour la classe:', err);
//         setClassStudents([]);
//       }
//     } else {
//       setClassStudents([]);
//     }
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
  
// <Container>
//  {/* Snackbar for messages */}
//  <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>


// {/* Card with background for students table */}
// <Card sx={{ backgroundColor: 'rgba(240, 240, 240, 0.8)', padding: 2, mb: 4, boxShadow: 3, marginTop:'25px' }}>
//   <CardContent>
//     <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
//       <Typography variant="h4">Gestion des Élèves</Typography>
//       <TextField
//         variant="outlined"
//         placeholder="Rechercher..."
//         onChange={handleSearchChange}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon />
//             </InputAdornment>
//           )
//         }}
//       />
//       <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
//         Ajouter
//       </Button>
//       <Button 
//         variant="contained" 
//         color="secondary" 
//         onClick={() => setOpenGenerate(true)} // Ouvrir le dialogue de génération des cartes scolaires
//       >
//         Générer Cartes Scolaires
//       </Button>

//     </Box>
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>Prénom</TableCell>
//             <TableCell>Nom</TableCell>
//             <TableCell>Date de Naissance</TableCell>
//             <TableCell>Sexe</TableCell>
//             <TableCell>Classe</TableCell>
//             <TableCell align="right">Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {students.length > 0 ? (
//             students.map((student) => (
//               <TableRow key={student._id}>
//                 <TableCell>{student.firstName}</TableCell>
//                 <TableCell>{student.lastName}</TableCell>
//                 <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
//                 <TableCell>{student.gender}</TableCell>
//                 <TableCell>{student.classId ? `${student.classId.name} (${student.classId.level})` : 'Non assigné'}</TableCell>
//                 <TableCell align="right">
//                   <IconButton color="primary" onClick={() => handleEdit(student)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton color="secondary" onClick={() => handleDelete(student._id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={6} align="center">
//                 Aucun élève trouvé
//               </TableCell>
//             </TableRow>

            
//           )}
//         </TableBody>
//       </Table>
//       <TablePagination
//         component="div"
//         count={totalCount}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </TableContainer>
//   </CardContent>
// </Card>

// {/* Dialog for generating school cards */}



// <Dialog open={openGenerate} onClose={() => setOpenGenerate(false)} maxWidth="md" fullWidth>
// <DialogTitle>Générer Cartes Scolaires</DialogTitle>
// <DialogContent>
// <Box display="flex" flexDirection="column" gap={2}>
// <FormControl fullWidth>
//   <InputLabel id="select-class-label">Sélectionnez une classe</InputLabel>
//   <Select
//     labelId="select-class-label"
//     value={selectedClassId}
//     onChange={handleClassChange}
//   >
//     {classes.map((classe) => (
//       <MenuItem key={classe._id} value={classe._id}>
//         {classe.name} ({classe.level})
//       </MenuItem>
//     ))}
//   </Select>
// </FormControl>

// {/* Afficher les élèves de la classe sélectionnée */}
// {classStudents.length > 0 && (
//   <TableContainer component={Paper} sx={{ mt: 2 }}>
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>Prénom</TableCell>
//           <TableCell>Nom</TableCell>
//           <TableCell>Date de Naissance</TableCell>
//           <TableCell>Sexe</TableCell>
//           {/* Ajouter d'autres colonnes si nécessaire */}
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {classStudents.map((student) => (
//           <TableRow key={student._id}>
//             <TableCell>{student.firstName}</TableCell>
//             <TableCell>{student.lastName}</TableCell>
//             <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
//             <TableCell>{student.gender}</TableCell>
//             {/* Ajouter d'autres informations si nécessaire */}
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// )}

// <Button
//   variant="contained"
//   color="primary"
//   onClick={handleGenerateCards}
//   disabled={!selectedClassId}
//   sx={{ mt: 2 }}
// >
//   Générer Cartes
// </Button>
// </Box>
// </DialogContent>
// <DialogActions>
// <Button 
// onClick={() => setOpenGenerate(false)} 
// sx={{ backgroundColor: '#ff5722', color: 'white', '&:hover': { backgroundColor: '#e64a19' } }}
// >
// Annuler
// </Button>
// </DialogActions>
// </Dialog>



// {/* Dialog with a form in a card */}
// <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//   <DialogTitle>{editing ? 'Modifier Élève' : 'Ajouter Élève'}</DialogTitle>
//   <DialogContent>
//     <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 2 }}>
//       <CardContent>
//         <form onSubmit={handleSave}>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Prénom"
//             name="firstName"
//             value={currentStudent.firstName}
//             onChange={(e) => handleChange('firstName', e.target.value)}
//             fullWidth
//             required
//           />
//           <TextField
//             margin="dense"
//             label="Nom"
//             name="lastName"
//             value={currentStudent.lastName}
//             onChange={(e) => handleChange('lastName', e.target.value)}
//             fullWidth
//             required
//           />
//           <TextField
//             margin="dense"
//             label="Date de Naissance"
//             name="dateOfBirth"
//             type="date"
//             value={currentStudent.dateOfBirth}
//             onChange={(e) => handleChange('dateOfBirth', e.target.value)}
//             fullWidth
//             required
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//           <TextField
//             margin="dense"
//             label="Sexe"
//             name="gender"
//             value={currentStudent.gender}
//             onChange={(e) => handleChange('gender', e.target.value)}
//             fullWidth
//             required
//             select
//           >
//             <MenuItem value="Masculin">Masculin</MenuItem>
//             <MenuItem value="Feminin">Féminin</MenuItem>
//           </TextField>
//           <TextField
//             margin="dense"
//             label="Classe"
//             name="classId"
//             value={currentStudent.classId}
//             onChange={(e) => handleChange('classId', e.target.value)}
//             fullWidth
//             required
//             select
//           >
//             {classes.map((classe) => (
//               <MenuItem key={classe._id} value={classe._id}>
//                 {classe.name} ({classe.level})
//               </MenuItem>
//             ))}
//           </TextField>

//           <Box mt={2}>
//             <Button type="submit" variant="contained" color="primary">
//               {editing ? 'Mettre à jour' : 'Ajouter'}
//             </Button>
//           </Box>
//         </form>
//       </CardContent>
//     </Card>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleClose} sx={{ backgroundColor: '#ff5722', color: 'white', '&:hover': { backgroundColor: '#e64a19' } }}>
//       Annuler
//     </Button>
//   </DialogActions>
// </Dialog>

// </Container>



//   );
// };

// export default StudentPage;
