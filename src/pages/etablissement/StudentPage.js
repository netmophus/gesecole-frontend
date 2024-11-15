
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
//   Grid,
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
// import { useNavigate } from 'react-router-dom';
// import jsPDF from 'jspdf'; 
// const StudentPage = () => {
//   const navigate = useNavigate();

//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [open, setOpen] = useState(false);
//   //const [currentStudent, setCurrentStudent] = useState({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '' });
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


//   const apiBaseUrl = process.env.REACT_APP_API_URL;


//   const [currentStudent, setCurrentStudent] = useState({
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: '',
//     classId: '',
//     motherName: '',     // Nouveau champ : Nom de la mère
//     fatherPhone: '',    // Nouveau champ : Téléphone du père
//     motherPhone: '',    // Nouveau champ : Téléphone de la mère
//     parentsAddress: '',  // Nouveau champ : Adresse des parents
//     photo: null         // Champ pour la photo
//   });
  
  

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [studentToDelete, setStudentToDelete] = useState(null);
//   const [deletionError, setDeletionError] = useState('');  // Pour gérer les erreurs de suppression
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success',
//   });
//   // Fonction pour récupérer les élèves
//   const fetchStudents = useCallback(async () => {
//     // if (!user || !user.token) {
//     //   console.error('Utilisateur non connecté.');
//     //   return;
//     // }

//     try {

//       const token = localStorage.getItem('token');
//       const establishmentId = localStorage.getItem('schoolId');
  
//       if (!establishmentId) {
//         console.error("Aucun identifiant d'établissement trouvé");
//         return;
//       }

      

//       const res = await axios.get(`${apiBaseUrl}/api/students`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
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
//       const token = localStorage.getItem('token');
//       const establishmentId = localStorage.getItem('schoolId');
  
//       if (!establishmentId) {
//         console.error("Aucun identifiant d'établissement trouvé");
//         return;
//       }

//       const res = await axios.get(`${apiBaseUrl}/api/classes`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
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


// // Fonction pour générer le PDF
// const generatePDF = (matricule, password) => {
//   const doc = new jsPDF();
  
//   // Titre
//   doc.setFontSize(20);
//   doc.text('Informations de Connexion', 14, 22);

//   // Contenu du PDF
//   const message = `Bonjour ${currentStudent.firstName} ${currentStudent.lastName},\n\nVoici vos informations de connexion :\n\n- Matricule : ${matricule}\n- Mot de Passe : ${password}\n\nNous vous recommandons de changer votre mot de passe lors de votre première connexion pour garantir la sécurité de votre compte.\n\nSi vous avez des questions, n'hésitez pas à nous contacter.`;
//   doc.setFontSize(12);
//   const splitMessage = doc.splitTextToSize(message, 190); // Diviser le message pour s'adapter à la largeur du PDF
//   doc.text(splitMessage, 14, 40); // Ajustez les coordonnées si nécessaire

//   // Nom du fichier basé sur le matricule
//   // Nom du fichier basé sur le prénom et le nom
// const fileName = `${currentStudent.firstName}_${currentStudent.lastName}_login_info.pdf`;
  
//   // Sauvegarder le PDF avec le nom dynamique
//   doc.save(fileName);
// };



// // Modifiez la fonction handleCreate
// const handleCreate = async (e) => {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append('firstName', currentStudent.firstName);
//   formData.append('lastName', currentStudent.lastName);
//   formData.append('dateOfBirth', currentStudent.dateOfBirth);
//   formData.append('gender', currentStudent.gender);
//   formData.append('classId', currentStudent.classId);
//   formData.append('motherName', currentStudent.motherName);
//   formData.append('fatherPhone', currentStudent.fatherPhone);
//   formData.append('motherPhone', currentStudent.motherPhone);
//   formData.append('parentsAddress', currentStudent.parentsAddress);

//   if (currentStudent.photo) {
//     formData.append('photo', currentStudent.photo);
//   }

//   try {
//     const token = user.token;
//     const res = await axios.post(`${apiBaseUrl}/api/students`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     // Gérer la réponse et afficher le message de succès
//     if (res && res.data) {
//       const { matricule, password } = res.data; // Assurez-vous que ces propriétés existent dans la réponse
//       setSnackbarMessage(`Matricule: ${matricule}, Mot de passe: ${password}`);
//       setSnackbarSeverity('success');
//       setSnackbarOpen(true);
      
//       // Remplacez l'appel à downloadTextFile par generatePDF
//       generatePDF(matricule, password);
//     }

//     fetchStudents();
//     handleClose();
//   } catch (err) {
//     console.error('Erreur lors de la création de l\'élève:', err.response ? err.response.data : err.message);
//     setSnackbarMessage('Erreur lors de la création de l\'élève.');
//     setSnackbarSeverity('error');
//     setSnackbarOpen(true);
//   }
// };





// const handleUpdate = async (e) => {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append('firstName', currentStudent.firstName);
//   formData.append('lastName', currentStudent.lastName);
//   formData.append('dateOfBirth', currentStudent.dateOfBirth);
//   formData.append('gender', currentStudent.gender);
//   formData.append('classId', currentStudent.classId);
//   formData.append('motherName', currentStudent.motherName);  // Champ ajouté
//   formData.append('fatherPhone', currentStudent.fatherPhone);  // Champ ajouté
//   formData.append('motherPhone', currentStudent.motherPhone);  // Champ ajouté
//   formData.append('parentsAddress', currentStudent.parentsAddress);  // Champ ajouté

//   if (currentStudent.photo) {
//     formData.append('photo', currentStudent.photo);  // Ajouter la photo
//   }

//   try {
//     const token = user.token;
//     const res = await axios.put(`${apiBaseUrl}/api/students/${currentStudent._id}`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     console.log(res);

//     // Gérer la réponse et afficher le message de succès
//     fetchStudents();
//     setSnackbarMessage('Élève mis à jour avec succès.');
//     setSnackbarSeverity('success');
//     setSnackbarOpen(true);
//     handleClose();
//   } catch (err) {
//     console.error('Erreur lors de la mise à jour de l\'élève:', err.response ? err.response.data : err.message);
//     setSnackbarMessage('Erreur lors de la mise à jour de l\'élève.');
//     setSnackbarSeverity('error');
//     setSnackbarOpen(true);
//   }
// };





// const handleEdit = (student) => {
//   setCurrentStudent({
//     ...student,
//     dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '', 
//     classId: student.classId ? student.classId._id : '', 
//     motherName: student.motherName || '', 
//     fatherPhone: student.fatherPhone || '', 
//     motherPhone: student.motherPhone || '', 
//     parentsAddress: student.parentsAddress || '',  // Corrige ici avec "parentsAddress"
//     photo: student.photo || null 
//   });
//   setEditing(true);
//   handleOpen(); 
// };

  
  

//   const handleDeleteClick = (studentId) => {
//     setStudentToDelete(studentId);  // Stocker l'ID de l'élève à supprimer
//     setDeleteDialogOpen(true);  // Ouvrir le dialogue de confirmation
//   };
  

//   const confirmDelete = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${apiBaseUrl}/api/students/${studentToDelete}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSnackbar({
//         open: true,
//         message: 'Élève supprimé avec succès.',
//         severity: 'success',
//       });
//       fetchStudents();  // Rafraîchir la liste des élèves après suppression
//       setDeleteDialogOpen(false);  // Fermer la boîte de dialogue après suppression
//     } catch (err) {
//       console.error('Erreur lors de la suppression de l\'élève :', err.response ? err.response.data : err.message);
  
//       // Gérer les erreurs spécifiques
//       let errorMsg = 'Erreur lors de la suppression de l\'élève.';
//       if (err.response?.data?.msg) {
//         if (err.response.data.msg.includes('bulletin')) {
//           errorMsg = 'Cet élève ne peut pas être supprimé car un bulletin lui est associé.';
//         } else if (err.response.data.msg.includes('carte scolaire')) {
//           errorMsg = 'Cet élève ne peut pas être supprimé car une carte scolaire lui est associée.';
//         } else {
//           errorMsg = err.response.data.msg;
//         }
//       }
  
//       setDeletionError(errorMsg);
//       setSnackbar({
//         open: true,
//         message: errorMsg,
//         severity: 'error',
//       });
//     }
//   };
  
  
//   const handleCloseDeleteDialog = () => {
//     setDeleteDialogOpen(false);
//     setDeletionError('');  // Réinitialiser les erreurs de suppression
//   };
  

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleGenerateCards = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${apiBaseUrl}/api/students/generate-school-cards`, { classId: selectedClassId }, {
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
//         const res = await axios.get(`${apiBaseUrl}/api/students?classId=${selectedClassId}`, {
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
  
//  {/* Bouton de retour au dashboard */}
//  <Grid item xs={12}>
//     <Button
//       variant="outlined"
//       onClick={() => navigate('/etablissement/dashboardPage')}
//       sx={{
//         marginTop: 2,        
//         marginLeft: 2,
//         backgroundColor: '#004d40',
//         color: '#fff',
//         '&:hover': {
//           backgroundColor: '#00332d',
//           color: '#fff',
//         },
//         borderRadius: 2,
//         padding: '10px 20px',
//       }}
//     >
//       Retour au Dashboard
//     </Button>
//   </Grid>

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


//     <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2, overflow: 'hidden' }}>
//   <Table>
//     <TableHead sx={{ backgroundColor: '#004d40' }}>
//       <TableRow>
//         <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Photo</TableCell>
//         <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Prénom</TableCell>
//         <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Nom</TableCell>
//         <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Date de Naissance</TableCell>
//         <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Sexe</TableCell>
//         <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Classe</TableCell>
//         <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }} align="right">Actions</TableCell>
//       </TableRow>
//     </TableHead>

//     <TableBody>
//       {students.length > 0 ? (
//         students.map((student) => (
//           <TableRow key={student._id} sx={{ '&:hover': { backgroundColor: '#f1f8e9' }, transition: 'background-color 0.3s ease' }}>
//             {/* Photo Column */}
//             <TableCell>
//                 {student.photo ? (
//                   <img
//                     src={student.photo} // Utiliser directement l'URL de Cloudinary
//                     alt={`${student.firstName} ${student.lastName}`}
//                     style={{
//                       width: '50px',
//                       height: '50px',
//                       objectFit: 'cover',
//                       borderRadius: '50%',
//                       border: '2px solid #004d40',
//                       boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
//                     }}
//                   />
//                 ) : (
//                   <Typography sx={{ color: '#757575' }}>Pas de photo disponible</Typography>
//                 )}
//               </TableCell>


//             {/* Student Info */}
//             <TableCell>{student.firstName}</TableCell>
//             <TableCell>{student.lastName}</TableCell>
//             <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
//             <TableCell>{student.gender}</TableCell>
//             <TableCell>{student.classId ? `${student.classId.name} (${student.classId.level})` : 'Non assigné'}</TableCell>

//             {/* Actions */}
//             <TableCell align="right">
//               <IconButton
//                 color="primary"
//                 onClick={() => handleEdit(student)}
//                 sx={{ marginRight: 1, color: '#004d40', '&:hover': { color: '#00332d' } }}
//               >
//                 <EditIcon />
//               </IconButton>
//               <IconButton
//                 color="error"
//                 onClick={() => handleDeleteClick(student._id)}
//                 sx={{ marginRight: 1, color: '#d9534f', '&:hover': { color: '#c9302c' } }}
//               >
//                 <DeleteIcon />
//               </IconButton>
//             </TableCell>
//           </TableRow>
//         ))
//       ) : (
//         <TableRow>
//           <TableCell colSpan={7} align="center" sx={{ padding: '20px', color: '#757575' }}>
//             Aucun élève trouvé
//           </TableCell>
//         </TableRow>
//       )}
//     </TableBody>
//   </Table>

//   <TablePagination
//     component="div"
//     count={totalCount}
//     page={page}
//     onPageChange={handleChangePage}
//     rowsPerPage={rowsPerPage}
//     onRowsPerPageChange={handleChangeRowsPerPage}
//     labelRowsPerPage="Lignes par page"
//     rowsPerPageOptions={[5, 10, 25]}
//     sx={{ backgroundColor: '#f5f5f5', color: '#004d40' }}
//   />
// </TableContainer>






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
//   <DialogTitle sx={{ backgroundColor: '#004d40', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
//     {editing ? 'Modifier Élève' : 'Ajouter Élève'}
//   </DialogTitle>

//   <DialogContent sx={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
//     <Card sx={{ backgroundColor: '#f8f9fa', padding: 3, borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
//       <CardContent>
//         <form onSubmit={editing ? handleUpdate : handleCreate}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Prénom"
//                 name="firstName"
//                 value={currentStudent.firstName}
//                 onChange={(e) => handleChange('firstName', e.target.value)}
//                 fullWidth
//                 required
//                 sx={{ backgroundColor: '#ffffff' }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Nom"
//                 name="lastName"
//                 value={currentStudent.lastName}
//                 onChange={(e) => handleChange('lastName', e.target.value)}
//                 fullWidth
//                 required
//                 sx={{ backgroundColor: '#ffffff' }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Date de Naissance"
//                 name="dateOfBirth"
//                 type="date"
//                 value={currentStudent.dateOfBirth}
//                 onChange={(e) => handleChange('dateOfBirth', e.target.value)}
//                 fullWidth
//                 required
//                 InputLabelProps={{ shrink: true }}
//                 sx={{ backgroundColor: '#ffffff' }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Sexe"
//                 name="gender"
//                 value={currentStudent.gender}
//                 onChange={(e) => handleChange('gender', e.target.value)}
//                 fullWidth
//                 required
//                 select
//                 sx={{ backgroundColor: '#ffffff' }}
//               >
//                 <MenuItem value="Masculin">Masculin</MenuItem>
//                 <MenuItem value="Feminin">Féminin</MenuItem>
//               </TextField>
//             </Grid>

//             {/* Class Selection */}
//             <Grid item xs={12}>
//               <FormControl fullWidth margin="dense">
//                 <InputLabel>Classe</InputLabel>
//                 <Select
//                   name="classId"
//                   value={currentStudent.classId}
//                   onChange={(e) => handleChange('classId', e.target.value)}
//                   required
//                   sx={{ backgroundColor: '#ffffff' }}
//                 >
//                   {classes.map((classe) => (
//                     <MenuItem key={classe._id} value={classe._id}>
//                       {classe.name} ({classe.level})
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             {/* Photo Upload */}
//             <Grid item xs={12}>
//               <Box mt={2}>
//                 <Typography variant="body1">Photo de l'élève</Typography>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleChange('photo', e.target.files[0])}
//                 />
//                 {currentStudent.photo && typeof currentStudent.photo === 'string' && (
//                   <Box mt={1}>
//                     <img
//                       src={`http://localhost:5000/${currentStudent.photo}`}
//                       alt={`${currentStudent.firstName} ${currentStudent.lastName}`}
//                       style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10%' }}
//                     />
//                   </Box>
//                 )}
//               </Box>
//             </Grid>

//             {/* Parent Information */}
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Nom de la Mère"
//                 name="motherName"
//                 value={currentStudent.motherName}
//                 onChange={(e) => handleChange('motherName', e.target.value)}
//                 fullWidth
//                 sx={{ backgroundColor: '#ffffff' }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Téléphone du Père"
//                 name="fatherPhone"
//                 value={currentStudent.fatherPhone}
//                 onChange={(e) => handleChange('fatherPhone', e.target.value)}
//                 fullWidth
//                 sx={{ backgroundColor: '#ffffff' }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Téléphone de la Mère"
//                 name="motherPhone"
//                 value={currentStudent.motherPhone}
//                 onChange={(e) => handleChange('motherPhone', e.target.value)}
//                 fullWidth
//                 sx={{ backgroundColor: '#ffffff' }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 label="Adresse des Parents"
//                 name="parentsAddress"
//                 value={currentStudent.parentsAddress}
//                 onChange={(e) => handleChange('parentsAddress', e.target.value)}
//                 fullWidth
//                 sx={{ backgroundColor: '#ffffff' }}
//               />
//             </Grid>
//           </Grid>
//         </form>
//       </CardContent>
//     </Card>
//   </DialogContent>

//   <DialogActions sx={{ padding: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
//     <Button 
//       onClick={editing ? handleUpdate : handleCreate}  
//       variant="contained" 
//       color="primary"
//       sx={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#004d40', '&:hover': { backgroundColor: '#00332d' } }}
//     >
//       {editing ? 'Mettre à jour' : 'Ajouter'}
//     </Button>

//     <Button 
//       onClick={handleClose} 
//       sx={{ marginLeft: 2, padding: '10px 20px', fontSize: '1rem', backgroundColor: '#ff5722', color: 'white', '&:hover': { backgroundColor: '#e64a19' } }}
//     >
//       Annuler
//     </Button>
//   </DialogActions>
// </Dialog>


// <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
//   <DialogTitle>Confirmation de suppression</DialogTitle>
//   <DialogContent>
//     {deletionError ? (
//       <Typography color="error">{deletionError}</Typography>
//     ) : (
//       'Êtes-vous sûr de vouloir supprimer cet élève ?'
//     )}
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleCloseDeleteDialog} color="secondary">
//       Annuler
//     </Button>
//     <Button
//       onClick={confirmDelete}
//       color="primary"
//       disabled={!!deletionError}  // Désactiver si erreur
//     >
//       Confirmer
//     </Button>
//   </DialogActions>
// </Dialog>


// <Snackbar
//   open={snackbar.open}
//   autoHideDuration={6000}
//   onClose={() => setSnackbar({ ...snackbar, open: false })}
// >
//   <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
//     {snackbar.message}
//   </Alert>
// </Snackbar>



// </Container>



//   );
// };

// export default StudentPage;







import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Snackbar,  // Importer Snackbar pour afficher des notifications
  Alert,     // Importer Alert pour styliser les messages dans le Snackbar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; 
const StudentPage = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  //const [currentStudent, setCurrentStudent] = useState({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '' });
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useContext(AuthContext);
  const [openGenerate, setOpenGenerate] = useState(false); 
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [classStudents, setClassStudents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);  // État pour ouvrir ou fermer le Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message pour le Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Sévérité pour le Snackbar
  const [matricule, setMatricule] = useState(''); // État pour stocker le matricule entré

  const apiBaseUrl = process.env.REACT_APP_API_URL;


  const [currentStudent, setCurrentStudent] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    classId: '',
    motherName: '',     // Nouveau champ : Nom de la mère
    fatherPhone: '',    // Nouveau champ : Téléphone du père
    motherPhone: '',    // Nouveau champ : Téléphone de la mère
    parentsAddress: '',  // Nouveau champ : Adresse des parents
    photo: null         // Champ pour la photo
  });
  
  

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deletionError, setDeletionError] = useState('');  // Pour gérer les erreurs de suppression
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  // Fonction pour récupérer les élèves
  const fetchStudents = useCallback(async () => {
    // if (!user || !user.token) {
    //   console.error('Utilisateur non connecté.');
    //   return;
    // }

    try {

      const token = localStorage.getItem('token');
      const establishmentId = localStorage.getItem('schoolId');
  
      if (!establishmentId) {
        console.error("Aucun identifiant d'établissement trouvé");
        return;
      }

      

      const res = await axios.get(`${apiBaseUrl}/api/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          search: searchTerm,
          page: page + 1,
          limit: rowsPerPage,
        }
      });

      setStudents(res.data.students || []);
      setTotalCount(res.data.total || 0); 
    } catch (err) {
      console.error('Erreur lors de la récupération des élèves:', err);
      setStudents([]);
    }
  }, [user, searchTerm, page, rowsPerPage]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const fetchClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const establishmentId = localStorage.getItem('schoolId');
  
      if (!establishmentId) {
        console.error("Aucun identifiant d'établissement trouvé");
        return;
      }

      const res = await axios.get(`${apiBaseUrl}/api/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setClasses(res.data.classes || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des classes:', err);
      setClasses([]);
    }
  }, [user]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSearchChange = debounce((event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  }, 300);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setCurrentStudent({ firstName: '', lastName: '', dateOfBirth: '', gender: '', classId: '' });
    setEditing(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (key, value) => {
    setCurrentStudent((prevStudent) => ({ ...prevStudent, [key]: value }));
  };


// Fonction pour générer le PDF


// const generatePDF = (matricule, password, paymentAmount) => {
//   const doc = new jsPDF();

//   // Titre du document
//   doc.setFontSize(20);
//   doc.text('Informations d\'Inscription et Reçu de Paiement', 14, 22);

//   // Informations de connexion
//   const connectionInfo = `
//     Bonjour ${currentStudent.firstName} ${currentStudent.lastName},

//     Voici vos informations de connexion :
//     - Matricule : ${matricule}
//     - Mot de Passe : ${password}

    
//   `;
//   doc.setFontSize(12);
//   const connectionText = doc.splitTextToSize(connectionInfo, 190);
//   doc.text(connectionText, 14, 40);

//   // Espace entre les sections
//   const yOffset = 40 + (connectionText.length * 7);

//   // Informations de paiement
//   const paymentInfo = `
//     Reçu de Paiement :
//     - Montant payé : ${paymentAmount} FCFA
//     - Date de paiement : ${new Date().toLocaleDateString()}

//     Merci pour votre paiement.
//   `;
//   const paymentText = doc.splitTextToSize(paymentInfo, 190);
//   doc.text(paymentText, 14, yOffset);

//   // Nom du fichier basé sur le prénom et le nom
//   const fileName = `${currentStudent.firstName}_${currentStudent.lastName}_info_et_recu.pdf`;

//   // Sauvegarder le PDF combiné
//   doc.save(fileName);
// };

const generatePDF = (matricule, password, paymentAmount = null, studentName = null) => {
  const doc = new jsPDF();

  // Titre du document
  doc.setFontSize(20);
  doc.text(paymentAmount ? 'Informations d\'Inscription et Reçu de Paiement' : 'Informations de Connexion', 14, 22);

  // Informations de connexion
  const connectionInfo = `
    Bonjour ${studentName || ''},

    Voici vos informations de connexion :
    - Matricule : ${matricule}
    - Mot de Passe : ${password}
  `;
  doc.setFontSize(12);
  const connectionText = doc.splitTextToSize(connectionInfo, 190);
  doc.text(connectionText, 14, 40);

  // Si un montant de paiement est fourni, ajoutez la section "Reçu de Paiement"
  if (paymentAmount) {
    const yOffset = 40 + (connectionText.length * 7);
    const paymentInfo = `
      Reçu de Paiement :
      - Montant payé : ${paymentAmount} FCFA
      - Date de paiement : ${new Date().toLocaleDateString()}

      Merci pour votre paiement.
    `;
    const paymentText = doc.splitTextToSize(paymentInfo, 190);
    doc.text(paymentText, 14, yOffset);
  }

  // Nom du fichier basé sur le prénom et le nom (ou matricule si nom non fourni)
  const fileName = studentName
    ? `${studentName.replace(' ', '_')}_info_et_recu.pdf`
    : `MotDePasse_${matricule}.pdf`;

  // Sauvegarder le PDF
  doc.save(fileName);
};

// Modifiez la fonction handleCreate
const handleCreate = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('firstName', currentStudent.firstName);
  formData.append('lastName', currentStudent.lastName);
  formData.append('dateOfBirth', currentStudent.dateOfBirth);
  formData.append('gender', currentStudent.gender);
  formData.append('classId', currentStudent.classId);
  formData.append('motherName', currentStudent.motherName);
  formData.append('fatherPhone', currentStudent.fatherPhone);
  formData.append('motherPhone', currentStudent.motherPhone);
  formData.append('parentsAddress', currentStudent.parentsAddress);

  if (currentStudent.photo) {
    formData.append('photo', currentStudent.photo);
  }

   // Ajouter les informations de paiement
   const payment = {
    amount: currentStudent.paymentAmount,   // Montant du paiement
    method: currentStudent.paymentMethod,   // Mode de paiement (Espèces, Carte, Virement)
    transactionId: currentStudent.transactionId // ID unique de la transaction
  };
  formData.append('payments', JSON.stringify([payment]));  // Ajoute le paiement sous forme de JSON


  try {
    const token = user.token;
    const res = await axios.post(`${apiBaseUrl}/api/students`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Gérer la réponse et afficher le message de succès
    if (res && res.data) {
      const { matricule, password } = res.data; // Assurez-vous que ces propriétés existent dans la réponse
      setSnackbarMessage(`Matricule: ${matricule}, Mot de passe: ${password}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
       // Appeler generatePDF avec les bonnes valeurs
       generatePDF(matricule, password, payment.amount); // Ajouter amount comme paramètre
     // Générer automatiquement le rapport PDF après la création
        await generateReportPDF();
    
      }

    fetchStudents();
    handleClose();
  } catch (err) {
    console.error('Erreur lors de la création de l\'élève:', err.response ? err.response.data : err.message);
    setSnackbarMessage('Erreur lors de la création de l\'élève.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  }
};


// Fonction pour générer le PDF du rapport
// const generateReportPDF = async () => {
//   try {
//     const res = await axios.get(`${apiBaseUrl}/api/students`, {
//       params: { limit: 1000 },
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//     });

//     const students = res.data.students;
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text('Rapport des Élèves et Paiements par Classe', 14, 15);
//     doc.setFontSize(12);

//     students.forEach((student, index) => {
//       const yPosition = 30 + index * 25;
//       doc.text(`Élève : ${student.firstName} ${student.lastName} (Matricule : ${student.matricule})`, 14, yPosition);

//       student.payments.forEach((payment, paymentIndex) => {
//         const paymentYPosition = yPosition + 10 + paymentIndex * 10;
//         doc.text(`   Paiement : ${payment.amount} FCFA | Date : ${new Date(payment.date).toLocaleDateString()} | Méthode : ${payment.method} | Transaction : ${payment.transactionId}`, 20, paymentYPosition);
//       });
//     });

//     doc.save('rapport_eleves_paiements.pdf');
//   } catch (error) {
//     console.error('Erreur lors de la génération du rapport:', error);
//     alert('Erreur lors de la génération du rapport.');
//   }
// };


// Fonction pour générer le PDF du rapport avec une en-tête
// Fonction pour générer le PDF du rapport par classe sélectionnée
const generateReportPDF = async () => {
  if (!selectedClassId) {
    alert('Veuillez sélectionner une classe.');
    return;
  }

  try {
    // Appel API pour récupérer les élèves de la classe sélectionnée
    const res = await axios.get(`${apiBaseUrl}/api/students`, {
      params: { classId: selectedClassId, limit: 1000 },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const students = res.data.students;
    if (students.length === 0) {
      alert('Aucun élève trouvé pour cette classe.');
      return;
    }

    const doc = new jsPDF();

    // En-tête du document
    const establishmentName = students[0].establishmentId?.name || 'Nom de l\'Établissement';
    const className = students[0].classId?.name || 'Classe';
    const printDate = new Date().toLocaleDateString();

    // Ajouter l'en-tête
    doc.setFontSize(16);
    doc.text(`Rapport des Élèves et Paiements`, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Établissement: ${establishmentName}`, 14, 30);
    doc.text(`Classe: ${className}`, 14, 38);
    doc.text(`Date d'impression: ${printDate}`, 14, 46);

    // Colonnes du tableau
    let yPosition = 60;
    doc.setFontSize(12);
    doc.text('Nom', 14, yPosition);
    doc.text('Prénom', 60, yPosition);
    doc.text('Matricule', 110, yPosition);
    doc.text('Montant', 160, yPosition);

    // Ligne de séparation
    yPosition += 4;
    doc.line(14, yPosition, 190, yPosition);

    // Informations par élève
    students.forEach((student) => {
      yPosition += 10;
      doc.text(student.lastName, 14, yPosition);
      doc.text(student.firstName, 60, yPosition);
      doc.text(student.matricule || 'Non défini', 110, yPosition);

      if (student.payments && student.payments.length > 0) {
        student.payments.forEach((payment) => {
          doc.text(`${payment.amount} FCFA`, 160, yPosition);
          yPosition += 6;
        });
      } else {
        doc.text('0 FCFA', 160, yPosition);  // Indiquer zéro si aucun paiement
      }
    });

    // Sauvegarder le PDF
    doc.save(`rapport_eleves_paiements_${className}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    alert('Erreur lors de la génération du rapport.');
  }
};



// Bouton de génération de rapport - déclenche handleGenerateReport à la demande
const handleGenerateReport = async () => {
  setLoading(true);
  try {
    await generateReportPDF();  // Appel de la fonction de génération de PDF
  } finally {
    setLoading(false);
  }
};

// const handleUpdate = async (e) => {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append('firstName', currentStudent.firstName);
//   formData.append('lastName', currentStudent.lastName);
//   formData.append('dateOfBirth', currentStudent.dateOfBirth);
//   formData.append('gender', currentStudent.gender);
//   formData.append('classId', currentStudent.classId);
//   formData.append('motherName', currentStudent.motherName);  // Champ ajouté
//   formData.append('fatherPhone', currentStudent.fatherPhone);  // Champ ajouté
//   formData.append('motherPhone', currentStudent.motherPhone);  // Champ ajouté
//   formData.append('parentsAddress', currentStudent.parentsAddress);  // Champ ajouté

//   if (currentStudent.photo) {
//     formData.append('photo', currentStudent.photo);  // Ajouter la photo
//   }

//   try {
//     const token = user.token;
//     const res = await axios.put(`${apiBaseUrl}/api/students/${currentStudent._id}`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     console.log(res);

//     // Gérer la réponse et afficher le message de succès
//     fetchStudents();
//     setSnackbarMessage('Élève mis à jour avec succès.');
//     setSnackbarSeverity('success');
//     setSnackbarOpen(true);
//     handleClose();
//   } catch (err) {
//     console.error('Erreur lors de la mise à jour de l\'élève:', err.response ? err.response.data : err.message);
//     setSnackbarMessage('Erreur lors de la mise à jour de l\'élève.');
//     setSnackbarSeverity('error');
//     setSnackbarOpen(true);
//   }
// };


const handleUpdate = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('firstName', currentStudent.firstName);
  formData.append('lastName', currentStudent.lastName);
  formData.append('dateOfBirth', currentStudent.dateOfBirth);
  formData.append('gender', currentStudent.gender);
  formData.append('classId', currentStudent.classId);
  formData.append('motherName', currentStudent.motherName);
  formData.append('fatherPhone', currentStudent.fatherPhone);
  formData.append('motherPhone', currentStudent.motherPhone);
  formData.append('parentsAddress', currentStudent.parentsAddress);

  if (currentStudent.photo) {
    formData.append('photo', currentStudent.photo);
  }

  // Ajouter les informations de paiement
  const payment = {
    amount: currentStudent.paymentAmount,  // Montant du paiement
    method: currentStudent.paymentMethod,  // Mode de paiement (Espèces, Carte, Virement)
    transactionId: currentStudent.transactionId  // ID unique de la transaction
  };
  formData.append('payments', JSON.stringify([payment]));  // Ajoute le paiement sous forme de JSON

  try {
    const token = user.token;
    await axios.put(`${apiBaseUrl}/api/students/${currentStudent._id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    fetchStudents();  // Rafraîchir la liste des élèves après la mise à jour
    setSnackbarMessage('Élève et paiement mis à jour avec succès.');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleClose();
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'élève et du paiement:', err.response ? err.response.data : err.message);
    setSnackbarMessage('Erreur lors de la mise à jour de l\'élève et du paiement.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  }
};



// const handleEdit = (student) => {
//   setCurrentStudent({
//     ...student,
//     dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '', 
//     classId: student.classId ? student.classId._id : '', 
//     motherName: student.motherName || '', 
//     fatherPhone: student.fatherPhone || '', 
//     motherPhone: student.motherPhone || '', 
//     parentsAddress: student.parentsAddress || '',  // Corrige ici avec "parentsAddress"
//     photo: student.photo || null 
//   });
//   setEditing(true);
//   handleOpen(); 
// };

  
const handleEdit = (student) => {
  setCurrentStudent({
    ...student,
    dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '', 
    classId: student.classId ? student.classId._id : '', 
    motherName: student.motherName || '', 
    fatherPhone: student.fatherPhone || '', 
    motherPhone: student.motherPhone || '', 
    parentsAddress: student.parentsAddress || '', 
    photo: student.photo || null,
    // Vérifier les paiements et définir les valeurs de paiement si disponibles
    paymentAmount: student.payments?.[0]?.amount || '', 
    paymentMethod: student.payments?.[0]?.method || '', 
    transactionId: student.payments?.[0]?.transactionId || '', 
  });
  setEditing(true);
  handleOpen(); 
};


  const handleDeleteClick = (studentId) => {
    setStudentToDelete(studentId);  // Stocker l'ID de l'élève à supprimer
    setDeleteDialogOpen(true);  // Ouvrir le dialogue de confirmation
  };
  

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBaseUrl}/api/students/${studentToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbar({
        open: true,
        message: 'Élève supprimé avec succès.',
        severity: 'success',
      });
      fetchStudents();  // Rafraîchir la liste des élèves après suppression
      setDeleteDialogOpen(false);  // Fermer la boîte de dialogue après suppression
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'élève :', err.response ? err.response.data : err.message);
  
      // Gérer les erreurs spécifiques
      let errorMsg = 'Erreur lors de la suppression de l\'élève.';
      if (err.response?.data?.msg) {
        if (err.response.data.msg.includes('bulletin')) {
          errorMsg = 'Cet élève ne peut pas être supprimé car un bulletin lui est associé.';
        } else if (err.response.data.msg.includes('carte scolaire')) {
          errorMsg = 'Cet élève ne peut pas être supprimé car une carte scolaire lui est associée.';
        } else {
          errorMsg = err.response.data.msg;
        }
      }
  
      setDeletionError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error',
      });
    }
  };
  
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletionError('');  // Réinitialiser les erreurs de suppression
  };
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleGenerateCards = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.post(`${apiBaseUrl}/api/students/generate-school-cards`, { classId: selectedClassId }, {
  //       headers: {
  //         'Authorization': `Bearer ${user.token}`,
  //       }
  //     });

  //     console.log('Cartes scolaires générées:', res.data);

  //     if (res.data.cards.length === 0) {
  //       setSnackbarMessage('Toutes les cartes scolaires ont déjà été générées pour cette classe.');
  //       setSnackbarSeverity('info');
  //     } else {
  //       setSnackbarMessage('Cartes scolaires générées avec succès.');
  //       setSnackbarSeverity('success');
  //     }

  //     setSnackbarOpen(true);
  //   } catch (err) {
  //     console.error('Erreur lors de la génération des cartes scolaires:', err.response ? err.response.data : err.message);
  //     setSnackbarMessage('Erreur lors de la génération des cartes scolaires.');
  //     setSnackbarSeverity('error');
  //     setSnackbarOpen(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const handleGenerateCards = async () => {
    if (!selectedClassId) {
      alert('Veuillez sélectionner une classe.');
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.post(`${apiBaseUrl}/api/students/generate-school-cards`, 
        { classId: selectedClassId }, 
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          }
        }
      );
  
      console.log('Cartes scolaires générées:', res.data);
  
      if (res.data.cards.length === 0) {
        setSnackbarMessage('Toutes les cartes scolaires ont déjà été générées pour cette classe.');
        setSnackbarSeverity('info');
      } else {
        setSnackbarMessage('Cartes scolaires générées avec succès.');
        setSnackbarSeverity('success');
      }
  
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erreur lors de la génération des cartes scolaires:', err.response ? err.response.data : err.message);
      setSnackbarMessage('Erreur lors de la génération des cartes scolaires.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  


  const handleClassChange = async (e) => {
    const selectedClassId = e.target.value;
    setSelectedClassId(selectedClassId);

    if (selectedClassId) {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/students?classId=${selectedClassId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          }
        });

        setClassStudents(res.data.students || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des élèves pour la classe:', err);
        setClassStudents([]);
      }
    } else {
      setClassStudents([]);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  // const handleRegeneratePassword = async (matricule) => {
  //   try {
  //     const response = await axios.post(
  //       `${apiBaseUrl}/api/students/regenerate-password`,
  //       { matricule },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       }
  //     );
  
  //     // Affichez le message de succès avec le nouveau mot de passe
  //     setSnackbarMessage(`Mot de passe régénéré: ${response.data.newPassword}`);
  //     setSnackbarSeverity('success');
  //   } catch (error) {
  //     console.error("Erreur lors de la régénération du mot de passe:", error);
  //     setSnackbarMessage("Erreur lors de la régénération du mot de passe. Veuillez vérifier le matricule.");
  //     setSnackbarSeverity('error');
  //   } finally {
  //     setSnackbarOpen(true); // Affichez le snackbar
  //   }
  // };
  

  const handleRegeneratePassword = async (matricule) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/students/regenerate-password`,
        { matricule },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      const newPassword = response.data.newPassword;
  
      // Afficher le message de succès avec le nouveau mot de passe
      setSnackbarMessage(`Mot de passe régénéré: ${newPassword}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
  
      // Générer le PDF sans montant de paiement
      generatePDF(matricule, newPassword);
  
    } catch (error) {
      console.error("Erreur lors de la régénération du mot de passe:", error);
      setSnackbarMessage("Erreur lors de la régénération du mot de passe. Veuillez vérifier le matricule.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  

  return (
  
<Container>
 {/* Snackbar for messages */}
 <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


{/* Card with background for students table */}
<Card sx={{ backgroundColor: 'rgba(240, 240, 240, 0.8)', padding: 2, mb: 4, boxShadow: 3, marginTop:'25px' }}>
  
 {/* Bouton de retour au dashboard */}
 <Grid item xs={12}>
    <Button
      variant="outlined"
      onClick={() => navigate('/etablissement/dashboardPage')}
      sx={{
        marginTop: 2,        
      
        backgroundColor: '#004d40',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#00332d',
          color: '#fff',
        },
        borderRadius: 2,
        padding: '10px 20px',
      }}
    >
      Retour au Dashboard
    </Button>
   

    <Box display="flex" alignItems="center" gap={2} my={2}>
        <TextField
          label="Matricule"
          variant="outlined"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          placeholder="Entrez le matricule"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRegeneratePassword(matricule)}
          disabled={!matricule} // Désactiver si aucun matricule n'est entré
        >
          Régénérer Mot de Passe
        </Button>
      </Box>



<Grid item xs={12} sm={6} sx={{ mb: 2 ,mt: 2 }}>
  <FormControl fullWidth>
    <InputLabel id="select-class-report-label">Sélectionnez une classe pour le rapport</InputLabel>
    <Select
      labelId="select-class-report-label"
      value={selectedClassId}
      onChange={(e) => setSelectedClassId(e.target.value)}
    >
      {classes.map((classe) => (
        <MenuItem key={classe._id} value={classe._id}>
          {classe.name} ({classe.level})
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>
<Button
  variant="contained"
  color="primary"
  onClick={handleGenerateReport}
  disabled={loading || !selectedClassId}  // Désactiver si aucune classe sélectionnée
>
  {loading ? 'Génération en cours...' : 'Générer le Rapport de paiement'}
</Button>



  </Grid>

  <CardContent>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>



      
      <Typography variant="h4">Gestion des Élèves</Typography>
      <TextField
        variant="outlined"
        placeholder="Rechercher..."
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
        Ajouter
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => setOpenGenerate(true)} // Ouvrir le dialogue de génération des cartes scolaires
      >
        Générer Cartes Scolaires
      </Button>

    </Box>


    <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2, overflow: 'hidden' }}>
  <Table>
    <TableHead sx={{ backgroundColor: '#004d40' }}>
      <TableRow>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Photo</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Prénom</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Nom</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Date de Naissance</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Sexe</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>Classe</TableCell>
        <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }} align="right">Actions</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {students.length > 0 ? (
        students.map((student) => (
          <TableRow key={student._id} sx={{ '&:hover': { backgroundColor: '#f1f8e9' }, transition: 'background-color 0.3s ease' }}>
            {/* Photo Column */}
            <TableCell>
                {student.photo ? (
                  <img
                    src={student.photo} // Utiliser directement l'URL de Cloudinary
                    alt={`${student.firstName} ${student.lastName}`}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '2px solid #004d40',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                ) : (
                  <Typography sx={{ color: '#757575' }}>Pas de photo disponible</Typography>
                )}
              </TableCell>


            {/* Student Info */}
            <TableCell>{student.firstName}</TableCell>
            <TableCell>{student.lastName}</TableCell>
            <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
            <TableCell>{student.gender}</TableCell>
            <TableCell>{student.classId ? `${student.classId.name} (${student.classId.level})` : 'Non assigné'}</TableCell>

            {/* Actions */}
            <TableCell align="right">
              <IconButton
                color="primary"
                onClick={() => handleEdit(student)}
                sx={{ marginRight: 1, color: '#004d40', '&:hover': { color: '#00332d' } }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDeleteClick(student._id)}
                sx={{ marginRight: 1, color: '#d9534f', '&:hover': { color: '#c9302c' } }}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ padding: '20px', color: '#757575' }}>
            Aucun élève trouvé
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>

  <TablePagination
    component="div"
    count={totalCount}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    labelRowsPerPage="Lignes par page"
    rowsPerPageOptions={[5, 10, 25]}
    sx={{ backgroundColor: '#f5f5f5', color: '#004d40' }}
  />
</TableContainer>






  </CardContent>
</Card>

{/* Dialog for generating school cards */}

<Dialog open={openGenerate} onClose={() => setOpenGenerate(false)} maxWidth="md" fullWidth>
  <DialogTitle>Générer Cartes Scolaires</DialogTitle>
  <DialogContent>
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControl fullWidth>
        <InputLabel id="select-class-cards-label">Sélectionnez une classe pour les cartes</InputLabel>
        <Select
          labelId="select-class-cards-label"
          value={selectedClassId}
          onChange={handleClassChange}
        >
          {classes.map((classe) => (
            <MenuItem key={classe._id} value={classe._id}>
              {classe.name} ({classe.level})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateCards}
        disabled={!selectedClassId}
        sx={{ mt: 2 }}
      >
        Générer Cartes Scolaires
      </Button>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={() => setOpenGenerate(false)} 
      sx={{ backgroundColor: '#ff5722', color: 'white', '&:hover': { backgroundColor: '#e64a19' } }}
    >
      Annuler
    </Button>
  </DialogActions>
</Dialog>

{/* Dialog with a form in a card */}

<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
  <DialogTitle sx={{ backgroundColor: '#004d40', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
    {editing ? 'Modifier Élève' : 'Ajouter Élève'}
  </DialogTitle>

  <DialogContent sx={{ padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
    <Card sx={{ backgroundColor: '#f8f9fa', padding: 3, borderRadius: 2, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <form onSubmit={editing ? handleUpdate : handleCreate}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Prénom"
                name="firstName"
                value={currentStudent.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                fullWidth
                required
                sx={{ backgroundColor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom"
                name="lastName"
                value={currentStudent.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                fullWidth
                required
                sx={{ backgroundColor: '#ffffff' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de Naissance"
                name="dateOfBirth"
                type="date"
                value={currentStudent.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: '#ffffff' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Sexe"
                name="gender"
                value={currentStudent.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                fullWidth
                required
                select
                sx={{ backgroundColor: '#ffffff' }}
              >
                <MenuItem value="Masculin">Masculin</MenuItem>
                <MenuItem value="Feminin">Féminin</MenuItem>
              </TextField>
            </Grid>

            {/* Class Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Classe</InputLabel>
                <Select
                  name="classId"
                  value={currentStudent.classId}
                  onChange={(e) => handleChange('classId', e.target.value)}
                  required
                  sx={{ backgroundColor: '#ffffff' }}
                >
                  {classes.map((classe) => (
                    <MenuItem key={classe._id} value={classe._id}>
                      {classe.name} ({classe.level})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Photo Upload */}
            <Grid item xs={12}>
              <Box mt={2}>
                <Typography variant="body1">Photo de l'élève</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChange('photo', e.target.files[0])}
                />
                {currentStudent.photo && typeof currentStudent.photo === 'string' && (
                  <Box mt={1}>
                    <img
                      src={`http://localhost:5000/${currentStudent.photo}`}
                      alt={`${currentStudent.firstName} ${currentStudent.lastName}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10%' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Parent Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom de la Mère"
                name="motherName"
                value={currentStudent.motherName}
                onChange={(e) => handleChange('motherName', e.target.value)}
                fullWidth
                sx={{ backgroundColor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone du Père"
                name="fatherPhone"
                value={currentStudent.fatherPhone}
                onChange={(e) => handleChange('fatherPhone', e.target.value)}
                fullWidth
                sx={{ backgroundColor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone de la Mère"
                name="motherPhone"
                value={currentStudent.motherPhone}
                onChange={(e) => handleChange('motherPhone', e.target.value)}
                fullWidth
                sx={{ backgroundColor: '#ffffff' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Adresse des Parents"
                name="parentsAddress"
                value={currentStudent.parentsAddress}
                onChange={(e) => handleChange('parentsAddress', e.target.value)}
                fullWidth
                sx={{ backgroundColor: '#ffffff' }}
              />
            </Grid>
<Grid item xs={12} sm={6}>
  <TextField
    label="Montant de Paiement"
    name="paymentAmount"
    value={currentStudent.paymentAmount || ''}
    onChange={(e) => handleChange('paymentAmount', e.target.value)}
    fullWidth
    required
    type="number"
    sx={{ backgroundColor: '#ffffff' }}
  />
</Grid>


          </Grid>
        </form>
      </CardContent>
    </Card>
  </DialogContent>

  <DialogActions sx={{ padding: 3, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
    <Button 
      onClick={editing ? handleUpdate : handleCreate}  
      variant="contained" 
      color="primary"
      sx={{ padding: '10px 20px', fontSize: '1rem', backgroundColor: '#004d40', '&:hover': { backgroundColor: '#00332d' } }}
    >
      {editing ? 'Mettre à jour' : 'Ajouter'}
    </Button>

    <Button 
      onClick={handleClose} 
      sx={{ marginLeft: 2, padding: '10px 20px', fontSize: '1rem', backgroundColor: '#ff5722', color: 'white', '&:hover': { backgroundColor: '#e64a19' } }}
    >
      Annuler
    </Button>
  </DialogActions>
</Dialog>


<Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
  <DialogTitle>Confirmation de suppression</DialogTitle>
  <DialogContent>
    {deletionError ? (
      <Typography color="error">{deletionError}</Typography>
    ) : (
      'Êtes-vous sûr de vouloir supprimer cet élève ?'
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDeleteDialog} color="secondary">
      Annuler
    </Button>
    <Button
      onClick={confirmDelete}
      color="primary"
      disabled={!!deletionError}  // Désactiver si erreur
    >
      Confirmer
    </Button>
  </DialogActions>
</Dialog>


<Snackbar
  open={snackbar.open}
  autoHideDuration={6000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
>
  <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
    {snackbar.message}
  </Alert>
</Snackbar>



</Container>



  );
};

export default StudentPage;
