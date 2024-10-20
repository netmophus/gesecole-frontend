
import React from 'react';
import { Box, Typography, Button, CardContent, CardMedia, Grid, Divider, Paper } from '@mui/material';
import ReactPlayer from 'react-player';

const NewsPage = ({ onClose, articles }) => {

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  return (
    <Box sx={{ padding: '20px', width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}>
    

      {/* Grille des articles */}
      <Grid container spacing={4}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <Grid item xs={12} key={article._id}>
              <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                {/* Image principale */}
                {article.imgArticle && article.imgArticle.url && (
                  <>
                    <CardMedia
                      component="img"
                      image={`${apiBaseUrl}/${article.imgArticle.url}`}
                      alt={article.titleArticle}
                      sx={{ width: '100%', height: 'auto', maxHeight: '400px' }}
                    />
                    <Typography variant="body2" sx={{ padding: '10px', fontStyle: 'italic', color: '#666' }}>
                      {article.imgArticle.description}
                    </Typography>
                  </>
                )}
                <CardContent>
                  {/* Titre de l'article */}
                  <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
                    {article.titleArticle}
                  </Typography>

                  {/* Texte de l'article */}
                  <Typography variant="body1" sx={{ marginBottom: '20px', color: '#555', fontSize: '1.2rem', lineHeight: 1.6 }}>
                    {article.bodyArticle}
                  </Typography>

                  {/* Vidéos */}
                  {Array.isArray(article.videoArticles) && article.videoArticles.length > 0 && (
                    <Box sx={{ marginBottom: '20px' }}>
                      <Divider sx={{ marginBottom: '20px' }} />
                      {/* <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                        Vidéos
                      </Typography> */}
                      {article.videoArticles.map((video, index) => (
                        <Box key={index} sx={{ marginBottom: '10px' }}>
                          <Typography variant="body2" sx={{ marginBottom: '10px', fontStyle: 'italic' }}>
                            {video.description}
                          </Typography>
                          <ReactPlayer url={video.url.includes('http') ? video.url : `http://localhost:5000/${video.url}`} width="100%" height="400px" />
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Lien PDF */}
                  {Array.isArray(article.pdfArticles) && article.pdfArticles.length > 0 && (
                    <Box sx={{ marginTop: '20px' }}>
                      <Divider sx={{ marginBottom: '20px' }} />
                      {/* <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                        Documents PDF
                      </Typography> */}
                      {article.pdfArticles.map((pdf, index) => (
                        <Box key={index} sx={{ marginBottom: '20px' }}>
                          <Typography variant="body2" sx={{ marginBottom: '10px', fontStyle: 'italic' }}>
                            {pdf.description}
                          </Typography>
                          <Button variant="contained" color="primary" href={`http://localhost:5000/${pdf.url}`} download>
                            Télécharger le PDF {index + 1}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Paper>
            </Grid>
          ))
        ) : (
          <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '10vh', // Hauteur pour centrer verticalement
    textAlign: 'center',
    padding: '20px',
  }}
>
  <Typography
    variant="h6"
    sx={{
      color: '#999',
      fontWeight: 'bold',         
      fontSize: '1.5rem', // Taille de police ajustée
      textTransform: 'uppercase', // Texte en majuscules
      letterSpacing: '0.1rem', // Espacement des lettres
    }}
  >
    Article non trouvé
  </Typography>
</Box>

        )}
      </Grid>
    </Box>
  );
};

export default NewsPage;
