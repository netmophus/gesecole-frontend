// import React from 'react';
// import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
// import ReactPlayer from 'react-player';

// const AdminToolsPage = ({ onClose }) => {
//   return (
//     <Box sx={{ padding: '20px', width: '100%', height: '100%', backgroundColor: '#f5f5f5', position: 'relative' }}>
//       {/* Bouton de fermeture */}
//       <Button 
//         onClick={onClose} 
//         sx={{ 
//           position: 'absolute', 
//           top: '20px', 
//           right: '20px', 
//           fontWeight: 'bold', 
//           color: '#fff', 
//           backgroundColor: '#FF8C00', 
//           '&:hover': { backgroundColor: '#e67e22' }
//         }}
//       >
//         Fermer
//       </Button>

//       {/* Titre de la page */}
//       <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
//         Gestion Administrative
//       </Typography>

//       {/* Grille pour les sections d'outils de gestion */}
//       <Grid container spacing={4}>

//         {/* Section 1: Vidéos sur la gestion des enseignants */}
//         <Grid item xs={12}>
//           <Card sx={{ boxShadow: 3, borderRadius: '8px', backgroundColor: '#ffffff' }}>
//             <CardContent>
//               <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
//                 Outils de Gestion des Enseignants
//               </Typography>
//               <Typography variant="body2" sx={{ marginBottom: '20px', color: '#555' }}>
//                 Apprenez comment utiliser les outils de gestion pour les enseignants avec les vidéos ci-dessous.
//               </Typography>
              
//               {/* Vidéos alignées sur une ligne */}
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo1" width="100%" />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo2" width="100%" />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo3" width="100%" />
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Section 2: Vidéos sur la gestion des étudiants */}
//         <Grid item xs={12}>
//           <Card sx={{ boxShadow: 3, borderRadius: '8px', backgroundColor: '#ffffff' }}>
//             <CardContent>
//               <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
//                 Outils de Gestion des Étudiants
//               </Typography>
//               <Typography variant="body2" sx={{ marginBottom: '20px', color: '#555' }}>
//                 Découvrez comment gérer efficacement les étudiants avec les outils présentés dans ces vidéos.
//               </Typography>

//               {/* Vidéos alignées sur une ligne */}
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo4" width="100%" />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo5" width="100%" />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo6" width="100%" />
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Section 3: Vidéos sur la gestion administrative globale */}
//         <Grid item xs={12}>
//           <Card sx={{ boxShadow: 3, borderRadius: '8px', backgroundColor: '#ffffff' }}>
//             <CardContent>
//               <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
//                 Outils de Gestion Administrative Globale
//               </Typography>
//               <Typography variant="body2" sx={{ marginBottom: '20px', color: '#555' }}>
//                 Utilisez ces outils pour une gestion administrative efficace et organisée.
//               </Typography>

//               {/* Vidéos alignées sur une ligne */}
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo7" width="100%" />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo8" width="100%" />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <ReactPlayer url="https://www.youtube.com/watch?v=samplevideo9" width="100%" />
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Grid>

//       </Grid>
//     </Box>
//   );
// };

// export default AdminToolsPage;

