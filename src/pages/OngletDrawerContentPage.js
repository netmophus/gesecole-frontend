

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, CardMedia } from '@mui/material';
import axios from 'axios';
import ReactPlayer from 'react-player';

const OngletDrawerContentPage = ({ ongletId, onClose }) => {
  const [articles, setArticles] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    // Récupérer les articles associés à l'onglet
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/onglet-contents?ongletId=${ongletId}`);
        setArticles(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles", error);
      }
    };

    if (ongletId) {
      fetchArticles();
    }
  }, [ongletId, apiBaseUrl]);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Titre principal */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Détails des Activités pour l'Onglet {ongletId}
      </Typography>

      {/* Afficher dynamiquement les articles récupérés */}
      {articles.map((article) => (
        <Card key={article._id} sx={{ marginBottom: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            {/* Titre de l'article */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
              {article.titleContent}
            </Typography>

            {/* Sous-titre de l'article */}
            {article.subtitleContent && (
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#004d40' }}>
                {article.subtitleContent}
              </Typography>
            )}

            {/* Texte de l'article */}
            <Typography variant="body1" sx={{ marginBottom: 2, color: '#555' }}>
              {article.bodyContent}
            </Typography>

            {/* Afficher l'image ou la vidéo associée à l'article */}
            {article.imgContent && (
              <>
                {/* Ajout d'un log pour vérifier l'URL de l'image */}
                {console.log('URL de l\'image:', `${apiBaseUrl}/uploads/${article.imgContent}`)}
                
               
                <CardMedia
  component="img"
  height="250"
  image={`${apiBaseUrl}/uploads/articles/${article.imgContent}`}  // Mise à jour de l'URL pour inclure 'articles/'
  alt={article.titleContent}
  sx={{ borderRadius: 2, marginBottom: 2 }}
/>

              </>
            )}

            {article.videoContent && (
              <ReactPlayer
                url={article.videoContent}  // Utiliser ReactPlayer pour les vidéos YouTube
                width="100%"
                height="250px"
                controls
                style={{ borderRadius: '10px', marginBottom: '20px' }}
              />
            )}

            {/* Texte complémentaire si nécessaire */}
            <Typography variant="body2" sx={{ color: '#777' }}>
              Article publié le {new Date(article.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Bouton de fermeture */}
      <Button
        variant="contained"
        color="primary"
        onClick={onClose}
        sx={{ marginTop: 2 }}
      >
        Fermer
      </Button>
    </Box>
  );
};

export default OngletDrawerContentPage;
