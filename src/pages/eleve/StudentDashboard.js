

import React, { useState } from 'react';
import {
  Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails,
  Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, PictureAsPdf as PdfIcon, PlayCircleOutline as PlayIcon } from '@mui/icons-material';

// Données statiques (exemple)
const studentData = {
  studentId: "12345",
  class: "6eme",
  grades: {
    semestre1: [
      { subject: "Maths", devoir1: 12, devoir2: 14, moyenne: 13 },
      { subject: "Francais", devoir1: 10, devoir2: 11, moyenne: 10.5 }
    ],
    semestre2: [
      { subject: "Maths", devoir1: 13, devoir2: 15, moyenne: 14 },
      { subject: "Francais", devoir1: 12, devoir2: 13, moyenne: 12.5 }
    ]
  },
  reportCards: [
    { semester: "Semestre 1", pdfUrl: "/bulletins/semestre1.pdf" },
    { semester: "Semestre 2", pdfUrl: "/bulletins/semestre2.pdf" }
  ],
  pedagogicalResources: [
    { subject: "Maths", title: "Chapitre 1 : Les fractions", type: "PDF", url: "/resources/fractions.pdf" },
    { subject: "Maths", title: "Vidéo : Les fractions (Exercice)", type: "VIDEO", url: "https://youtu.be/e3Wsbg3hK_s" },
    { subject: "Francais", title: "Chapitre 2 : Grammaire", type: "PDF", url: "/resources/grammaire.pdf" },
    { subject: "Francais", title: "Vidéo : Grammaire en contexte", type: "VIDEO", url: "https://youtu.be/example_grammar_video" }
  ]
};

const StudentDashboard = () => {
  const [expanded, setExpanded] = useState(false); // Gérer l'état du panneau d'affichage des notes
  const [videoUrl, setVideoUrl] = useState('');

  // Fonction pour gérer l'expansion des panneaux
  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Fonction pour jouer la vidéo
  const handlePlayVideo = (url) => {
    setVideoUrl(url);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Tableau de bord de l'élève</Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>Classe: {studentData.class}</Typography>

      {/* Bouton pour afficher les notes */}
      <Box mb={4}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mb: 2,
            backgroundColor: '#1E88E5',
            '&:hover': {
              backgroundColor: '#1565C0',
            },
          }}
          onClick={() => setExpanded(expanded ? false : true)}
        >
          {expanded ? 'Masquer les Notes' : 'Voir les Notes'}
        </Button>

        {/* Panneau pour afficher les notes */}
        {expanded && (
          <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleExpand('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Semestre 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Matière</TableCell>
                        <TableCell>Devoir 1</TableCell>
                        <TableCell>Devoir 2</TableCell>
                        <TableCell>Moyenne</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentData.grades.semestre1.map((grade, index) => (
                        <TableRow key={index}>
                          <TableCell>{grade.subject}</TableCell>
                          <TableCell>{grade.devoir1}</TableCell>
                          <TableCell>{grade.devoir2}</TableCell>
                          <TableCell>{grade.moyenne}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleExpand('panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Semestre 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Matière</TableCell>
                        <TableCell>Devoir 1</TableCell>
                        <TableCell>Devoir 2</TableCell>
                        <TableCell>Moyenne</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentData.grades.semestre2.map((grade, index) => (
                        <TableRow key={index}>
                          <TableCell>{grade.subject}</TableCell>
                          <TableCell>{grade.devoir1}</TableCell>
                          <TableCell>{grade.devoir2}</TableCell>
                          <TableCell>{grade.moyenne}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </Box>

      {/* Section des bulletins */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>Bulletins</Typography>
        <Grid container spacing={2}>
          {studentData.reportCards.map((report, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{report.semester}</Typography>
                  <Button variant="contained" color="primary" startIcon={<PdfIcon />} href={report.pdfUrl} target="_blank">
                    Télécharger le bulletin
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Section des ressources pédagogiques */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>Ressources pédagogiques</Typography>
        <Grid container spacing={2}>
          {studentData.pedagogicalResources.map((resource, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{resource.subject}</Typography>
                  <Typography>{resource.title}</Typography>
                  <Typography>Type : {resource.type}</Typography>
                  {resource.type === 'PDF' ? (
                    <Button variant="contained" color="primary" startIcon={<PdfIcon />} href={resource.url} target="_blank">
                      Télécharger PDF
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" startIcon={<PlayIcon />} onClick={() => handlePlayVideo(resource.url)}>
                      Regarder la vidéo
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Lecteur vidéo */}
      {videoUrl && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Lecteur Vidéo</Typography>
          <iframe
            width="100%"
            height="400"
            src={videoUrl}
            title="Vidéo pédagogique"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      )}
    </Container>
  );
};

export default StudentDashboard;
