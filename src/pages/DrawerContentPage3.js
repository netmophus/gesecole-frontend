// import React from 'react';
// import { Box, Typography, Button, Card, CardContent, Grid, CardMedia } from '@mui/material';
// import ReactPlayer from 'react-player';

// const DrawerContentPage3 = ({ onClose }) => {
//   return (
//     <Box sx={{ padding: 3 }}>
//       {/* Titre principal de l'article */}
//       <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
//         Activité du Ministre - Détails de l'Activité 3
//       </Typography>

//       {/* Première section de l'article avec une image */}
//       <Card sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
//         <CardContent>
//           {/* Sous-titre de la section */}
//           <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
//             Visite d'une École Innovante
//           </Typography>

//           {/* Texte de la section */}
//           <Typography variant="body1" sx={{ marginBottom: 2, color: '#555' }}>
//             Le ministre a visité une école connue pour son approche innovante de l'enseignement. Lors de cette visite, il a rencontré des enseignants et des élèves, observé des classes en action, et discuté des méthodes d'enseignement créatives utilisées.
//           </Typography>

//           {/* Image associée à la section */}
//           <CardMedia
//             component="img"
//             height="250"
//             image="https://via.placeholder.com/600x400"  // Remplacer par le lien de l'image réelle
//             alt="Visite d'une école innovante"
//             sx={{ borderRadius: 2, marginBottom: 2 }}
//           />

//           {/* Texte complémentaire de la section */}
//           <Typography variant="body2" sx={{ color: '#777' }}>
//             L'école est un modèle pour d'autres établissements, mettant l'accent sur la participation active des élèves et l'utilisation des technologies numériques pour améliorer l'apprentissage.
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* Deuxième section de l'article avec une vidéo */}
//       <Card sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
//         <CardContent>
//           <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
//             Forum sur l'Éducation Inclusive
//           </Typography>
//           <Typography variant="body1" sx={{ marginBottom: 2, color: '#555' }}>
//             Le ministre a participé à un forum sur l'éducation inclusive, où il a souligné l'importance de créer des environnements d'apprentissage qui répondent aux besoins de tous les élèves, y compris ceux ayant des besoins spéciaux.
//           </Typography>
//           <Box sx={{ marginBottom: 2 }}>
//             <ReactPlayer
//               url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"  // Remplacer par l'URL de la vidéo réelle
//               width="100%"
//               height="250px"
//               style={{ borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}
//             />
//           </Box>
//           <Typography variant="body2" sx={{ color: '#777' }}>
//             Le forum a réuni des éducateurs, des parents, et des responsables gouvernementaux pour discuter des meilleures pratiques et des stratégies pour améliorer l'accessibilité et la qualité de l'éducation.
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* Troisième section de l'article avec une image */}
//       <Card sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
//         <CardContent>
//           <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
//             Atelier de Formation des Enseignants
//           </Typography>
//           <Typography variant="body1" sx={{ marginBottom: 2, color: '#555' }}>
//             Un atelier de formation intensif a été organisé pour les enseignants afin de les familiariser avec les nouvelles approches pédagogiques. Cet atelier a mis l'accent sur l'apprentissage actif, la collaboration entre pairs, et l'intégration des technologies.
//           </Typography>
//           <CardMedia
//             component="img"
//             height="250"
//             image="https://via.placeholder.com/600x400"  // Remplacer par le lien de l'image réelle
//             alt="Atelier de formation des enseignants"
//             sx={{ borderRadius: 2, marginBottom: 2 }}
//           />
//           <Typography variant="body2" sx={{ color: '#777' }}>
//             Les enseignants ont quitté l'atelier avec de nouvelles idées et stratégies qu'ils pourront mettre en œuvre dans leurs propres classes pour améliorer l'engagement des élèves et les résultats scolaires.
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* Bouton de fermeture */}
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={onClose}
//         sx={{ marginTop: 2 }}
//       >
//         Fermer
//       </Button>
//     </Box>
//   );
// };

// export default DrawerContentPage3;

