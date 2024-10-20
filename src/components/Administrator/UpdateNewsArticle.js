



import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Grid, Box } from '@mui/material';
import axios from 'axios';
import ReactPlayer from 'react-player';

const UpdateNewsArticle = ({ open, onClose, article, onUpdateSuccess }) => {
  const [articleData, setArticleData] = useState({
    titleArticle: '',
    bodyArticle: '',
    imgArticle: null,
    imgDescription: '',
    videoArticles: [{ url: '', description: '', file: null }],
    pdfArticles: [{ file: null, description: '' }],
  });

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (article) {
      setArticleData({
        titleArticle: article.titleArticle,
        bodyArticle: article.bodyArticle,
        imgArticle: article.imgArticle?.url || null,
        imgDescription: article.imgArticle?.description || '',
        videoArticles: article.videoArticles.length > 0 ? article.videoArticles : [{ url: '', description: '', file: null }],
        pdfArticles: article.pdfArticles.length > 0 ? article.pdfArticles : [{ file: null, description: '' }],
      });
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData({ ...articleData, [name]: value });
  };

  const handleFileChange = (e) => {
    setArticleData({ ...articleData, imgArticle: e.target.files[0] });
  };

  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...articleData.videoArticles];
    updatedVideos[index][field] = value;
    setArticleData({ ...articleData, videoArticles: updatedVideos });
  };

  const handlePdfChange = (index, field, value) => {
    const updatedPdfs = [...articleData.pdfArticles];
    updatedPdfs[index][field] = value;
    setArticleData({ ...articleData, pdfArticles: updatedPdfs });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('titleArticle', articleData.titleArticle);
    formData.append('bodyArticle', articleData.bodyArticle);

    if (articleData.imgArticle) {
      formData.append('imgArticle', articleData.imgArticle);
      formData.append('imgDescription', articleData.imgDescription);
    }

    articleData.videoArticles.forEach((video, index) => {
      if (video.url) {
        formData.append(`videoArticles[${index}][url]`, video.url);
        formData.append(`videoArticles[${index}][description]`, video.description);
      }
    });

    articleData.pdfArticles.forEach((pdf, index) => {
      if (pdf.file) {
        formData.append(`pdfArticles[${index}][file]`, pdf.file);
        formData.append(`pdfArticles[${index}][description]`, pdf.description);
      }
    });

    try {
      await axios.put(`${apiBaseUrl}/api/section-articles/${article._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdateSuccess(); // Recharger les articles après mise à jour
      onClose(); // Fermer la modale
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Modifier l'article</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Titre de l'article */}
          <Grid item xs={12}>
            <TextField
              label="Titre de l'article"
              fullWidth
              name="titleArticle"
              value={articleData.titleArticle}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
            />
          </Grid>

          {/* Contenu de l'article */}
          <Grid item xs={12}>
            <TextField
              label="Contenu de l'article"
              fullWidth
              name="bodyArticle"
              multiline
              rows={4}
              value={articleData.bodyArticle}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
            />
          </Grid>

          {/* Image actuelle et champ pour une nouvelle image */}
          <Grid item xs={12}>
            <Typography variant="h6">Image associée à l'article</Typography>
            {articleData.imgArticle && (
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="body2">Image actuelle :</Typography>
                <img src={`${apiBaseUrl}/${articleData.imgArticle}`} alt="Image de l'article" style={{ width: '100%', maxHeight: '200px' }} />
                
              </Box>
            )}
            <TextField
              label="Description de l'image"
              fullWidth
              name="imgDescription"
              value={articleData.imgDescription}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
            />
            <input type="file" name="imgArticle" onChange={handleFileChange} accept="image/*" />
          </Grid>

          {/* Vidéos associées */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Vidéos associées</Typography>
            {articleData.videoArticles.map((video, index) => (
              <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
                <Grid item xs={12}>
                  {video.url && (
                    <>
                      <Typography variant="body2">Vidéo actuelle {index + 1} :</Typography>
                      <ReactPlayer url={video.url} width="100%" height="200px" />
                    </>
                  )}
                  <TextField
                    label={`Lien vidéo ${index + 1}`}
                    fullWidth
                    value={video.url}
                    onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                    sx={{ marginBottom: 1 }}
                  />
                  <TextField
                    label={`Description vidéo ${index + 1}`}
                    fullWidth
                    value={video.description}
                    onChange={(e) => handleVideoChange(index, 'description', e.target.value)}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* PDFs associés */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Documents PDF associés</Typography>
            {articleData.pdfArticles.map((pdf, index) => (
              <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2">PDF actuel {index + 1} :</Typography>
                  <a href={`${apiBaseUrl}/${pdf.url}`} target="_blank" rel="noopener noreferrer">Voir le PDF</a>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label={`Description PDF ${index + 1}`}
                    fullWidth
                    value={pdf.description}
                    onChange={(e) => handlePdfChange(index, 'description', e.target.value)}
                  />
                </Grid>
              </Grid>
            ))}
            <input type="file" name="pdfArticles" accept="application/pdf" onChange={handleFileChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        <Button onClick={handleUpdate} color="primary">Mettre à jour</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateNewsArticle;
