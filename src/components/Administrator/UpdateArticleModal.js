


// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
// import axios from 'axios';

// const UpdateArticleModal = ({ open, onClose, article, onUpdateSuccess }) => {
//   const [articleData, setArticleData] = useState({
//     titleContent: '',
//     subtitleContent: '',
//     bodyContent: '',
//     imgContent: null,  // Fichier d'image pour upload
//     videoContent: '',   // URL vidéo
//     removeImage: false, // Case à cocher pour retirer l'image
//     removeVideo: false, // Case à cocher pour retirer la vidéo
//   });
//   const apiBaseUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     if (article) {
//       setArticleData({
//         titleContent: article.titleContent,
//         subtitleContent: article.subtitleContent,
//         bodyContent: article.bodyContent,
//         imgContent: article.imgContent || null,  // Image existante (si présente)
//         videoContent: article.videoContent || '', // URL vidéo (si présente)
//         removeImage: false, // Initialiser à faux
//         removeVideo: false, // Initialiser à faux
//       });
//     }
//   }, [article]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setArticleData({ ...articleData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setArticleData({ ...articleData, imgContent: e.target.files[0], videoContent: '', removeVideo: true }); // Remplacer la vidéo si une image est uploadée
//   };

//   const handleUpdate = async () => {
//     const token = localStorage.getItem('token');
  
//     if (!token) {
//       console.error("Token JWT manquant");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('titleContent', articleData.titleContent);
//     formData.append('subtitleContent', articleData.subtitleContent);
//     formData.append('bodyContent', articleData.bodyContent);
    
//     // Gestion des fichiers d'image ou de vidéo
//     if (articleData.removeImage || articleData.imgContent instanceof File) {
//       formData.append('imgContent', articleData.imgContent instanceof File ? articleData.imgContent : ''); // Vide si l'image est supprimée
//     }
    
//     if (articleData.videoContent) {
//       formData.append('videoContent', articleData.videoContent);
//     }

//     formData.append('removeImage', articleData.removeImage); // Indiquer au backend si l'image doit être supprimée
//     formData.append('removeVideo', articleData.removeVideo); // Indiquer au backend si la vidéo doit être supprimée

//     try {
//       await axios.put(`${apiBaseUrl}/api/onglet-contents/${article._id}`, formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       onUpdateSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de l'article", error);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Modifier l'article</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Titre de l'Article"
//           fullWidth
//           name="titleContent"
//           value={articleData.titleContent}
//           onChange={handleInputChange}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Sous-titre de l'Article"
//           fullWidth
//           name="subtitleContent"
//           value={articleData.subtitleContent}
//           onChange={handleInputChange}
//           sx={{ mb: 2 }}
//         />
//         <TextField
//           label="Contenu de l'Article"
//           fullWidth
//           name="bodyContent"
//           multiline
//           rows={4}
//           value={articleData.bodyContent}
//           onChange={handleInputChange}
//           sx={{ mb: 2 }}
//         />
        
//         {/* Prévisualisation de l'image actuelle */}
//         {article.imgContent && !articleData.removeImage && (
//           <div style={{ marginBottom: '10px' }}>
//             <img
//               src={`http://localhost:5000/uploads/articles/${article.imgContent}`} // URL de l'image actuelle
//               alt="Prévisualisation de l'image"
//               style={{ maxHeight: '200px' }}
//             />
//           </div>
//         )}
        
//         {/* Case à cocher pour supprimer l'image */}
//         {article.imgContent && (
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={articleData.removeImage}
//                 onChange={(e) => setArticleData({ ...articleData, removeImage: e.target.checked, imgContent: null })}
//                 color="primary"
//               />
//             }
//             label="Supprimer l'image actuelle"
//             sx={{ mb: 2 }}
//           />
//         )}

//         {/* Champ d'upload de fichier */}
//         <TextField
//           fullWidth
//           type="file"
//           inputProps={{ accept: 'image/*' }}
//           name="imgContent"
//           onChange={handleFileChange}
//           sx={{ mb: 2 }}
//           helperText="Modifier l'image (facultatif)"
//         />
        
//         {/* Prévisualisation de la vidéo */}
//         {article.videoContent && !articleData.removeVideo && (
//           <div style={{ marginBottom: '10px' }}>
//             <video
//               src={article.videoContent}
//               controls
//               style={{ maxHeight: '200px', width: '100%' }}
//             />
//           </div>
//         )}

//         {/* Case à cocher pour supprimer la vidéo */}
//         {article.videoContent && (
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={articleData.removeVideo}
//                 onChange={(e) => setArticleData({ ...articleData, removeVideo: e.target.checked, videoContent: '' })}
//                 color="primary"
//               />
//             }
//             label="Supprimer la vidéo actuelle"
//             sx={{ mb: 2 }}
//           />
//         )}

//         <TextField
//           label="URL de la Vidéo"
//           fullWidth
//           name="videoContent"
//           value={articleData.videoContent}
//           onChange={(e) => setArticleData({ ...articleData, videoContent: e.target.value, imgContent: null, removeImage: true })}
//           sx={{ mb: 2 }}
//           helperText="Ajouter/modifier l'URL de la vidéo (facultatif)"
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">Annuler</Button>
//         <Button onClick={handleUpdate} color="primary">Mettre à jour</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateArticleModal;
