
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UpdateArticleModal from '../../components/Administrator/UpdateArticleModal';  // Assure-toi d'importer ton modal


const OngletArticleManagementPage = () => {
  const { ongletId } = useParams(); // Récupérer ongletId depuis l'URL
  const [formData, setFormData] = useState({
    titleContent: '',
    subtitleContent: '',
    bodyContent: '',
    imgContent: '',
    videoContent: '',
  });
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null); // L'article à éditer
  const [openModal, setOpenModal] = useState(false); // Pour contrôler l'ouverture/fermeture du modal
  const [loading, setLoading] = useState(false); // État de chargement
  const [error, setError] = useState(''); // Gestion des erreurs
  const apiBaseUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    if (ongletId) {
      fetchArticles();
    }
  }, [ongletId]);

  // Récupérer les articles
  const fetchArticles = async () => {
    setLoading(true); // Activer l'état de chargement
    try {
      const response = await axios.get(`${apiBaseUrl}/api/onglet-contents?ongletId=${ongletId}`);
      setArticles(response.data);
      setError(''); // Réinitialiser les erreurs
    } catch (error) {
      setError("Erreur lors de la récupération des articles");
    } finally {
      setLoading(false); // Désactiver l'état de chargement
    }
  };

  // Gérer les changements de formulaire pour la création
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumettre le formulaire pour la création d'un nouvel article
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('titleContent', formData.titleContent);
    formDataToSend.append('subtitleContent', formData.subtitleContent);
    formDataToSend.append('bodyContent', formData.bodyContent);

    // Ajouter l'image si elle existe
    if (formData.imgContent) {
      formDataToSend.append('imgContent', formData.imgContent);  // Image file
    }

    // Ajouter la vidéo si elle existe
    if (formData.videoContent) {
      formDataToSend.append('videoContent', formData.videoContent);  // Video URL
    }

    // Ajouter l'ongletId au formulaire
    formDataToSend.append('ongletId', ongletId);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token non disponible');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post(`${apiBaseUrl}/api/onglet-contents`, formDataToSend, config);
      fetchArticles(); // Recharger les articles après la création
      resetForm(); // Réinitialiser le formulaire
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire", error.response ? error.response.data : error);
    }
  };

  // Réinitialiser le formulaire après l'envoi
  const resetForm = () => {
    setFormData({
      titleContent: '',
      subtitleContent: '',
      bodyContent: '',
      imgContent: '',
      videoContent: '',
    });
  };

  // Gérer l'ouverture du modal et charger l'article sélectionné
  const handleEdit = (article) => {
    setEditingArticle(article); // Stocke l'article sélectionné
    setOpenModal(true); // Ouvre le modal
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingArticle(null); // Réinitialise l'article en cours d'édition
  };

  // Mettre à jour la liste des articles après une modification
  const handleUpdateSuccess = () => {
    fetchArticles(); // Recharge les articles après la mise à jour
    handleCloseModal(); // Ferme le modal après succès
  };

  // Gérer la suppression avec confirmation
  const handleDelete = async (id) => {
    console.log('ID à supprimer:', id); // Vérifier l'ID envoyé au backend
    const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?');
    if (confirm) {
      try {
        const token = localStorage.getItem('token'); // Récupérer le token
        if (!token) {
          console.error('Token non disponible');
          return;
        }
  
        const config = {
          headers: {
            'Authorization': `Bearer ${token}` // Ajouter le token dans l'en-tête
          }
        };
  
        await axios.delete(`${apiBaseUrl}/api/onglet-contents/${id}`, config);
        fetchArticles(); // Recharger les articles après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article", error);
      }
    }
  };
  
  
  
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Gestion des Articles pour l'Onglet {ongletId}</Typography>

      {/* Gestion des états de chargement et d'erreur */}
      {loading ? <CircularProgress /> : error && <Typography color="error">{error}</Typography>}

      {/* Formulaire de création d'article */}
      <Paper sx={{ padding: 2, marginBottom: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Titre de l'Article"
                name="titleContent"
                value={formData.titleContent}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sous-titre de l'Article"
                name="subtitleContent"
                value={formData.subtitleContent}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contenu de l'Article"
                name="bodyContent"
                value={formData.bodyContent}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            {/* Ajout du champ d'upload d'image */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="file"
                inputProps={{ accept: 'image/*' }}
                name="imgContent"
                onChange={(e) => setFormData({ ...formData, imgContent: e.target.files[0] })}
              />
              {/* Prévisualisation de l'image */}
              {formData.imgContent && (
                <img
                  src={URL.createObjectURL(formData.imgContent)}
                  alt="Prévisualisation"
                  style={{ maxHeight: '200px', marginTop: '10px' }}
                />
              )}
            </Grid>

            {/* Champ pour la vidéo (URL) */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL de la Vidéo"
                name="videoContent"
                value={formData.videoContent}
                onChange={handleInputChange}
                helperText="Ajoutez l'URL de la vidéo. Laissez vide si vous avez téléchargé une image."
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Créer
              </Button>
              <Button onClick={resetForm} sx={{ marginLeft: 2 }}>
                Annuler
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Liste des articles créés */}
      <Typography variant="h6" gutterBottom>Articles Créés</Typography>
      <Grid container spacing={2}>
        {articles.map((article) => (
          <Grid item xs={12} md={4} key={article._id}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{article.titleContent}</Typography>
              <Typography variant="body2">{article.subtitleContent}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>{article.bodyContent}</Typography>

              {/* Affichage de l'image ou de la vidéo */}
              {article.imgContent ? (
                <img
                  src={`http://localhost:5000/uploads/articles/${article.imgContent}`}
                  alt={article.titleContent}
                  style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                />
              ) : article.videoContent ? (
                <video
                  src={article.videoContent}
                  controls
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : null}

              <Box mt={2}>
                <IconButton onClick={() => handleEdit(article)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(article._id)}>
                  <DeleteIcon color="secondary" />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal de mise à jour */}
      {editingArticle && (
        <UpdateArticleModal
          open={openModal}
          onClose={handleCloseModal}
          article={editingArticle}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </Box>
  );
};

export default OngletArticleManagementPage;
