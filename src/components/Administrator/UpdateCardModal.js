

// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
// import axios from 'axios';

// const UpdateArticleModal = ({ open, onClose, article, onUpdateSuccess }) => {
//   const [articleData, setArticleData] = useState({
//     titleArticle: '',
//     bodyArticle: '',
//     imgArticle: null,  // Gérer l'image (fichier ou string si elle existe déjà)
//     videoArticle: ''  // URL de la vidéo
//   });

//   useEffect(() => {
//     if (article) {
//       console.log('Article reçu:', article); // Log des données de l'article reçu
//       setArticleData({
//         titleArticle: article.titleContent,
//         bodyArticle: article.bodyContent,
//         imgArticle: article.imgContent || null,  // Charger l'image si elle existe
//         videoArticle: article.videoContent || '',  // Charger la vidéo si elle existe
//       });
//     }
//   }, [article]);

//   // Gérer le changement de l'image (fichier)
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     console.log('Image sélectionnée:', file); // Log de l'image sélectionnée
//     setArticleData({ ...articleData, imgArticle: file, videoArticle: '' });  // Ne pas réinitialiser la vidéo
//   };

//   // Gérer le changement de la vidéo (lien)
//   const handleVideoChange = (e) => {
//     console.log('URL de la vidéo:', e.target.value); // Log de l'URL de la vidéo
//     setArticleData({ ...articleData, videoArticle: e.target.value, imgArticle: null });  // Réinitialiser l'image si un lien vidéo est ajouté
//   };

//   // Fonction de mise à jour
//   const handleUpdate = async () => {
//     console.log("Article data before update:", articleData);  // Log des données avant envoi

//     const token = localStorage.getItem('token');

//     if (!token) {
//       console.error("Token JWT manquant");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('titleContent', articleData.titleArticle);
//     formData.append('bodyContent', articleData.bodyArticle);

//     // Ajouter l'image si elle est sélectionnée
//     if (articleData.imgArticle && typeof articleData.imgArticle !== 'string') {
//       formData.append('imgContent', articleData.imgArticle);  // Si c'est un fichier
//       console.log("Image File:", articleData.imgArticle);
//     }

//     // Ajouter la vidéo si elle est saisie
//     if (articleData.videoArticle) {
//       formData.append('videoContent', articleData.videoArticle);  // Si c'est un lien vidéo
//       console.log("Video URL:", articleData.videoArticle);
//     }

//     try {
//       await axios.put(`http://localhost:5000/api/onglet-contents/${article._id}`, formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       onClose();
//       onUpdateSuccess();
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de l'article", error);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Modifier l'article</DialogTitle>
//       <DialogContent>
//         {/* Log des données dans le rendu pour vérification */}
//         {console.log('Article Data rendu:', articleData)}

//         {/* Champ de saisie du titre */}
//         <TextField
//           label="Titre de l'article"
//           fullWidth
//           value={articleData.titleArticle}
//           onChange={(e) => setArticleData({ ...articleData, titleArticle: e.target.value })}
//           sx={{ mb: 2 }}
//         />

//         {/* Champ de saisie du contenu */}
//         <TextField
//           label="Contenu de l'article"
//           fullWidth
//           multiline
//           rows={4}
//           value={articleData.bodyArticle}
//           onChange={(e) => setArticleData({ ...articleData, bodyArticle: e.target.value })}
//           sx={{ mb: 2 }}
//         />

//         {/* Aperçu de l'image actuelle ou champ de téléchargement */}
//         {typeof articleData.imgArticle === 'string' ? (
//           <div>
//             <img
//               src={`http://localhost:5000/uploads/articles/${articleData.imgArticle}`}
//               alt="Aperçu de l'image actuelle"
//               style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
//             />
//           </div>
//         ) : null}

//         {/* Champ de téléchargement pour une nouvelle image */}
//         <TextField
//           fullWidth
//           type="file"
//           inputProps={{ accept: 'image/*' }}
//           onChange={handleFileChange}  // Capture le changement de fichier image
//           sx={{ mb: 2 }}
//         />

//         {/* Champ pour saisir ou modifier l'URL de la vidéo */}
//         <TextField
//           label="URL de la vidéo (optionnel)"
//           fullWidth
//           value={articleData.videoArticle}
//           onChange={handleVideoChange}
//           sx={{ mb: 2 }}
//         />

//         {/* Affichage de la vidéo actuelle (si elle existe) */}
//         {articleData.videoArticle && (
//           <div style={{ marginTop: '10px' }}>
//             <iframe
//               width="100%"
//               height="315"
//               src={articleData.videoArticle}
//               title="Vidéo actuelle"
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             ></iframe>
//           </div>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">Annuler</Button>
//         <Button onClick={handleUpdate} color="primary">Mettre à jour</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateArticleModal;




