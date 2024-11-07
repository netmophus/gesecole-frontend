

import React, { useState, useEffect } from 'react';
import { TextField,Grid, Button, IconButton, Tooltip, Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Typography, Snackbar, CircularProgress } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material'; // Icônes pour supprimer et modifier
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Pour accéder à l'ID de la section
import UpdateNewsArticle from '../../components/Administrator/UpdateNewsArticle'; // Importer la modale de mise à jour
import ReactPlayer from 'react-player';

const ArticlesNewsManagement = () => {
  const { id } = useParams(); // Récupérer l'ID de la carte à partir de l'URL
  const [articles, setArticles] = useState([]); // Initialisé comme tableau vide
  const [newArticle, setNewArticle] = useState({
    titleArticle: '',
    bodyArticle: '',
    imgArticle: null,
    imgDescription: '', // Description pour l'image
    videoArticles: [{ url: '', description: '', file: null }], // Vidéos avec descriptions et fichiers
    pdfArticles: [{ file: null, description: '' }], // PDF avec description
  });
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [articleToUpdate, setArticleToUpdate] = useState(null);
  const [message, setMessage] = useState(''); // Message de succès ou d'erreur
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Ajout d'un état de chargement
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour désactiver le bouton lors de la soumission

  const apiBaseUrl = process.env.REACT_APP_API_URL;
  // Fonction pour récupérer les articles
  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiBaseUrl}/api/section-articles?section=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setArticles(response.data); // Stocker les articles récupérés
      setIsLoading(false); // Fin du chargement
    } catch (error) {
      console.error('Erreur lors de la récupération des articles', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [id]);
  

  // Ajout d'une vidéo
  const handleAddVideo = () => {
    setNewArticle((prevState) => ({
      ...prevState,
      videoArticles: [...prevState.videoArticles, { url: '', description: '', file: null }]
    }));
  };

  // Ajout d'un PDF
  const handleAddPdf = () => {
    setNewArticle((prevState) => ({
      ...prevState,
      pdfArticles: [...prevState.pdfArticles, { file: null, description: '' }]
    }));
  };

  // Gérer les modifications des vidéos
  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...newArticle.videoArticles];
    updatedVideos[index][field] = value;
    setNewArticle({ ...newArticle, videoArticles: updatedVideos });
  };

  // Gérer les modifications des PDFs
  const handlePdfChange = (index, field, value) => {
    const updatedPdfs = [...newArticle.pdfArticles];
    updatedPdfs[index][field] = value;
    setNewArticle({ ...newArticle, pdfArticles: updatedPdfs });
  };

  // Supprimer une vidéo
  const handleRemoveVideo = (index) => {
    const updatedVideos = newArticle.videoArticles.filter((_, i) => i !== index);
    setNewArticle({ ...newArticle, videoArticles: updatedVideos });
  };

  // Supprimer un PDF
  const handleRemovePdf = (index) => {
    const updatedPdfs = newArticle.pdfArticles.filter((_, i) => i !== index);
    setNewArticle({ ...newArticle, pdfArticles: updatedPdfs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Activer l'état de soumission
    const formData = new FormData();
    formData.append('sectionCard', id);
    formData.append('titleArticle', newArticle.titleArticle);
    formData.append('bodyArticle', newArticle.bodyArticle);

    if (newArticle.imgArticle) {
      formData.append('imgArticle', newArticle.imgArticle);
      formData.append('imgDescription', newArticle.imgDescription);
    }

    newArticle.videoArticles.forEach((video, index) => {
      if (video.url) {
        formData.append(`videoArticles[${index}][url]`, video.url);
        formData.append(`videoDescriptions[${index}]`, video.description);
      }
    });

    newArticle.pdfArticles.forEach((pdf, index) => {
      formData.append('pdfArticles', pdf.file);
      formData.append(`pdfDescriptions[${index}]`, pdf.description);
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiBaseUrl}/api/section-articles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Article créé avec succès');
      setOpenSnackbar(true);
      fetchArticles(); // Recharger les articles après création
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la création de l'article");
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false); // Désactiver l'état de soumission après l'envoi
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${apiBaseUrl}/api/section-articles/${articleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage('Article supprimé avec succès');
        setOpenSnackbar(true);
        fetchArticles(); // Recharger les articles après suppression
      } catch (error) {
        setMessage("Erreur lors de la suppression de l'article");
        setOpenSnackbar(true);
      }
    }
  };

  const handleOpenUpdateModal = (article) => {
    setArticleToUpdate(article);  // Assigner l'article sélectionné pour la mise à jour
    setOpenUpdateModal(true);     // Ouvrir la modale
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center' }}><CircularProgress /></div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestion des Articles</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
  <Grid container spacing={3}>
    {/* Titre de l'article */}
    <Grid item xs={12}>
      <TextField
        label="Titre de l'article"
        fullWidth
        value={newArticle.titleArticle}
        onChange={(e) => setNewArticle({ ...newArticle, titleArticle: e.target.value })}
        sx={{ mb: 2 }}
      />
    </Grid>

    {/* Contenu de l'article */}
    <Grid item xs={12}>
      <TextField
        label="Contenu de l'article"
        fullWidth
        multiline
        rows={4}
        value={newArticle.bodyArticle}
        onChange={(e) => setNewArticle({ ...newArticle, bodyArticle: e.target.value })}
        sx={{ mb: 2 }}
      />
    </Grid>

    {/* Image et description de l'image */}
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Ajouter une image</Typography>
      <input
        type="file"
        name="imgArticle"
        onChange={(e) => setNewArticle({ ...newArticle, imgArticle: e.target.files[0] })}
        accept="image/*"
        style={{ display: 'block', marginBottom: '10px' }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="Description de l'image"
        fullWidth
        value={newArticle.imgDescription}
        onChange={(e) => setNewArticle({ ...newArticle, imgDescription: e.target.value })}
        sx={{ mb: 2 }}
      />
    </Grid>

    {/* Gestion des vidéos */}
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ mb: 1 }}>Vidéos</Typography>
      {newArticle.videoArticles.map((video, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label={`Lien vidéo ${index + 1}`}
              fullWidth
              value={video.url}
              onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={`Description vidéo ${index + 1}`}
              fullWidth
              value={video.description}
              onChange={(e) => handleVideoChange(index, 'description', e.target.value)}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" onClick={() => handleRemoveVideo(index)}>
              Supprimer cette vidéo
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button variant="outlined" onClick={handleAddVideo} sx={{ mt: 2 }}>
        Ajouter une vidéo
      </Button>
    </Grid>

    {/* Gestion des PDFs */}
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ mb: 1 }}>Documents PDF</Typography>
      {newArticle.pdfArticles.map((pdf, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <input
              type="file"
              name="pdfArticles"
              accept="application/pdf"
              onChange={(e) => handlePdfChange(index, 'file', e.target.files[0])}
              style={{ display: 'block', marginBottom: '10px' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={`Description PDF ${index + 1}`}
              fullWidth
              value={pdf.description}
              onChange={(e) => handlePdfChange(index, 'description', e.target.value)}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" onClick={() => handleRemovePdf(index)}>
              Supprimer ce PDF
            </Button>
          </Grid>
        </Grid>
      ))}
      <Button variant="outlined" onClick={handleAddPdf} sx={{ mt: 2 }}>
        Ajouter un PDF
      </Button>
    </Grid>

    {/* Bouton de soumission */}
    <Grid item xs={12}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 3 }}
      >
        {isSubmitting ? 'Création en cours...' : 'Créer l\'article'}
      </Button>
    </Grid>
  </Grid>
</form>


      <h3>Articles existants</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Titre</Typography></TableCell>
              <TableCell><Typography variant="h6">Contenu</Typography></TableCell>
              <TableCell><Typography variant="h6">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article._id}>
                <TableCell>{article.titleArticle}</TableCell>
                <TableCell>{article.bodyArticle}</TableCell>
                <TableCell>
                  {article.imgArticle && (
                    <>
                      <Typography variant="body2">Image : {article.imgDescription}</Typography>
                      <img src={`/${article.imgArticle}`} alt="Portrait de l'article" style={{ width: '100%', maxHeight: '200px', marginBottom: '10px' }} />
                    </>
                  )}

                  {Array.isArray(article.videoArticles) && article.videoArticles.map((video, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <Typography variant="body2">Vidéo {index + 1} : {video.description}</Typography>
                      <ReactPlayer url={video.url} width="100%" height="200px" />
                    </div>
                  ))}

                  {Array.isArray(article.pdfArticles) && article.pdfArticles.map((pdf, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                      <Typography variant="body2">PDF {index + 1} : {pdf.description}</Typography>
                      <Button variant="contained" color="primary" href={`/${pdf.url}`} download>
                        Télécharger le PDF
                      </Button>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => handleOpenUpdateModal(article)}>
                      <Edit color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton onClick={() => handleDelete(article._id)}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openUpdateModal && (
        <UpdateNewsArticle
          open={openUpdateModal}
          onClose={handleCloseUpdateModal}
          article={articleToUpdate}
          onUpdateSuccess={fetchArticles}
        />
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={message}
      />
    </div>
  );
};

export default ArticlesNewsManagement;
