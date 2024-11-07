

// import React, { useState } from 'react';
// import {
//   Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails,
//   Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Paper
// } from '@mui/material';
// import { ExpandMore as ExpandMoreIcon, PictureAsPdf as PdfIcon, PlayCircleOutline as PlayIcon } from '@mui/icons-material';

// // Données statiques (exemple)
// const studentData = {
//   studentId: "12345",
//   class: "6eme",
//   grades: {
//     semestre1: [
//       { subject: "Maths", devoir1: 12, devoir2: 14, moyenne: 13 },
//       { subject: "Francais", devoir1: 10, devoir2: 11, moyenne: 10.5 }
//     ],
//     semestre2: [
//       { subject: "Maths", devoir1: 13, devoir2: 15, moyenne: 14 },
//       { subject: "Francais", devoir1: 12, devoir2: 13, moyenne: 12.5 }
//     ]
//   },
//   reportCards: [
//     { semester: "Semestre 1", pdfUrl: "/bulletins/semestre1.pdf" },
//     { semester: "Semestre 2", pdfUrl: "/bulletins/semestre2.pdf" }
//   ],
//   pedagogicalResources: [
//     { subject: "Maths", title: "Chapitre 1 : Les fractions", type: "PDF", url: "/resources/fractions.pdf" },
//     { subject: "Maths", title: "Vidéo : Les fractions (Exercice)", type: "VIDEO", url: "https://youtu.be/e3Wsbg3hK_s" },
//     { subject: "Francais", title: "Chapitre 2 : Grammaire", type: "PDF", url: "/resources/grammaire.pdf" },
//     { subject: "Francais", title: "Vidéo : Grammaire en contexte", type: "VIDEO", url: "https://youtu.be/example_grammar_video" }
//   ]
// };

// const StudentDashboard = () => {
//   const [expanded, setExpanded] = useState(false); // Gérer l'état du panneau d'affichage des notes
//   const [videoUrl, setVideoUrl] = useState('');

//   // Fonction pour gérer l'expansion des panneaux
//   const handleExpand = (panel) => (event, isExpanded) => {
//     setExpanded(isExpanded ? panel : false);
//   };

//   // Fonction pour jouer la vidéo
//   const handlePlayVideo = (url) => {
//     setVideoUrl(url);
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom>Tableau de bord de l'élève</Typography>
//       <Typography variant="h6" color="textSecondary" gutterBottom>Classe: {studentData.class}</Typography>

//       {/* Bouton pour afficher les notes */}
//       <Box mb={4}>
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{
//             mb: 2,
//             backgroundColor: '#1E88E5',
//             '&:hover': {
//               backgroundColor: '#1565C0',
//             },
//           }}
//           onClick={() => setExpanded(expanded ? false : true)}
//         >
//           {expanded ? 'Masquer les Notes' : 'Voir les Notes'}
//         </Button>

//         {/* Panneau pour afficher les notes */}
//         {expanded && (
//           <>
//             <Accordion expanded={expanded === 'panel1'} onChange={handleExpand('panel1')}>
//               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Typography variant="h6">Semestre 1</Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <TableContainer component={Paper}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Matière</TableCell>
//                         <TableCell>Devoir 1</TableCell>
//                         <TableCell>Devoir 2</TableCell>
//                         <TableCell>Moyenne</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {studentData.grades.semestre1.map((grade, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{grade.subject}</TableCell>
//                           <TableCell>{grade.devoir1}</TableCell>
//                           <TableCell>{grade.devoir2}</TableCell>
//                           <TableCell>{grade.moyenne}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </AccordionDetails>
//             </Accordion>

//             <Accordion expanded={expanded === 'panel2'} onChange={handleExpand('panel2')}>
//               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Typography variant="h6">Semestre 2</Typography>
//               </AccordionSummary>
//               <AccordionDetails>
//                 <TableContainer component={Paper}>
//                   <Table>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell>Matière</TableCell>
//                         <TableCell>Devoir 1</TableCell>
//                         <TableCell>Devoir 2</TableCell>
//                         <TableCell>Moyenne</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {studentData.grades.semestre2.map((grade, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{grade.subject}</TableCell>
//                           <TableCell>{grade.devoir1}</TableCell>
//                           <TableCell>{grade.devoir2}</TableCell>
//                           <TableCell>{grade.moyenne}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </AccordionDetails>
//             </Accordion>
//           </>
//         )}
//       </Box>

//       {/* Section des bulletins */}
//       <Box mb={4}>
//         <Typography variant="h5" gutterBottom>Bulletins</Typography>
//         <Grid container spacing={2}>
//           {studentData.reportCards.map((report, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">{report.semester}</Typography>
//                   <Button variant="contained" color="primary" startIcon={<PdfIcon />} href={report.pdfUrl} target="_blank">
//                     Télécharger le bulletin
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* Section des ressources pédagogiques */}
//       <Box mb={4}>
//         <Typography variant="h5" gutterBottom>Ressources pédagogiques</Typography>
//         <Grid container spacing={2}>
//           {studentData.pedagogicalResources.map((resource, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">{resource.subject}</Typography>
//                   <Typography>{resource.title}</Typography>
//                   <Typography>Type : {resource.type}</Typography>
//                   {resource.type === 'PDF' ? (
//                     <Button variant="contained" color="primary" startIcon={<PdfIcon />} href={resource.url} target="_blank">
//                       Télécharger PDF
//                     </Button>
//                   ) : (
//                     <Button variant="contained" color="secondary" startIcon={<PlayIcon />} onClick={() => handlePlayVideo(resource.url)}>
//                       Regarder la vidéo
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* Lecteur vidéo */}
//       {videoUrl && (
//         <Box mt={4}>
//           <Typography variant="h6" gutterBottom>Lecteur Vidéo</Typography>
//           <iframe
//             width="100%"
//             height="400"
//             src={videoUrl}
//             title="Vidéo pédagogique"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default StudentDashboard;



import React, { useState } from 'react';
import { Container, Typography, Tabs, Tab, Card, CardContent, Grid, Box, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { VideoLibrary, Description, School, ArrowForward } from '@mui/icons-material';

function StudentDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [resources, setResources] = useState([]);

  const handleTabChange = (event, newValue) => setSelectedTab(newValue);
  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedChapter('');
    setResources([]);
  };
  const handleClassSelect = (classe) => setSelectedClass(classe);
  const handleSubjectSelect = (subject) => setSelectedSubject(subject);
  const handleChapterSelect = (event) => {
    const chapter = event.target.value;
    setSelectedChapter(chapter);
    fetchResourcesByChapter(chapter); // Fonction pour récupérer les ressources et la description
  };

  // Exemple de niveaux, classes, matières et chapitres
  const levels = [{ name: 'Primaire', color: '#FFD700' }, { name: 'Collège', color: '#FF6347' }, { name: 'Lycée', color: '#4682B4' }];
  const classes = { 'Primaire': ['CM1', 'CM2'], 'Collège': ['6ème', '5ème', '4ème', '3ème'], 'Lycée': ['Seconde', 'Première', 'Terminale'] };
  const subjects = { 'Primaire': ['Mathématiques', 'Français', 'Sciences'], 'Collège': ['Mathématiques', 'Français', 'Histoire-Géographie'], 'Lycée': ['Mathématiques', 'Physique', 'Philosophie'] };
  const chapters = ['Chapitre 1', 'Chapitre 2', 'Chapitre 3', 'Chapitre 4'];

  // Exemples de ressources par chapitre
  const allResources = {
    'Chapitre 1': {
      description: 'Introduction aux concepts de base en mathématiques.',
      resources: [
        { type: 'Vidéo', description: 'Introduction', icon: <VideoLibrary color="primary" /> },
        { type: 'PDF', description: 'Notions de base', icon: <Description color="secondary" /> },
      ],
    },
    'Chapitre 2': {
      description: 'Approfondissement des notions avec des exercices pratiques.',
      resources: [
        { type: 'Vidéo', description: 'Applications avancées', icon: <VideoLibrary color="primary" /> },
        { type: 'PDF', description: 'Exercices pratiques', icon: <Description color="secondary" /> },
      ],
    },
    'Chapitre 3': {
      description: 'Théories et concepts en physique pour le niveau lycée.',
      resources: [
        { type: 'PDF', description: 'Théories et concepts', icon: <Description color="secondary" /> },
        { type: 'Vidéo', description: 'Expériences et observations', icon: <VideoLibrary color="primary" /> },
      ],
    },
  };

  // Fonction pour récupérer la description et les ressources en fonction du chapitre sélectionné
  const fetchResourcesByChapter = (chapter) => {
    const chapterData = allResources[chapter];
    setChapterDescription(chapterData?.description || '');
    setResources(chapterData?.resources || []);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Bonjour, [Nom de l'élève] !
      </Typography>

      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Ressources Pédagogiques" />
        <Tab label="Notes" />
      </Tabs>

      {/* Ressources Pédagogiques */}
      {selectedTab === 0 && (
        <Box mt={4} mb={5}>
          <Typography variant="h5" gutterBottom>Choisissez votre niveau :</Typography>
          
          {/* Niveau Cards */}
          <Grid container spacing={3}>
            {levels.map((level) => (
              <Grid item xs={12} sm={4} key={level.name}>
                <Card
                  onClick={() => handleLevelSelect(level.name)}
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    cursor: 'pointer',
                    backgroundColor: level.color,
                    '&:hover': { boxShadow: 6 }
                  }}
                >
                  <School sx={{ fontSize: 40 }} />
                  <Typography variant="h6">{level.name}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Classe selection */}
          {selectedLevel && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>Choisissez votre classe pour le {selectedLevel} :</Typography>
              <Grid container spacing={2}>
                {classes[selectedLevel].map((classe) => (
                  <Grid item xs={6} sm={3} key={classe}>
                    <Card onClick={() => handleClassSelect(classe)} sx={{ textAlign: 'center', p: 2, '&:hover': { boxShadow: 6 } }}>
                      <Typography variant="h6">{classe}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Matières */}
          {selectedClass && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>Sélectionnez une matière :</Typography>
              <Grid container spacing={2}>
                {subjects[selectedLevel].map((subject) => (
                  <Grid item xs={4} key={subject}>
                    <Card onClick={() => handleSubjectSelect(subject)} sx={{ textAlign: 'center', p: 2, '&:hover': { boxShadow: 6 } }}>
                      <Typography variant="h6">{subject}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Chapitre selection */}
          {selectedSubject && (
            <Box mt={4}>
              <FormControl fullWidth>
                <InputLabel>Choisissez un Chapitre</InputLabel>
                <Select value={selectedChapter} onChange={handleChapterSelect}>
                  {chapters.map((chapter) => (
                    <MenuItem key={chapter} value={chapter}>{chapter}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Description et Ressources */}
          {selectedChapter && (
            <Box mt={4}>
              {/* Description du chapitre */}
              <Typography variant="h6" gutterBottom>Description du {selectedChapter} :</Typography>
              <Typography variant="body1" color="textSecondary" mb={3}>
                {chapterDescription}
              </Typography>

              {/* Ressources pédagogiques */}
              {resources.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>Ressources disponibles :</Typography>
                  <Grid container spacing={2}>
                    {resources.map((resource, index) => (
                      <Grid item xs={6} key={index}>
                        <Card>
                          <CardContent>
                            <Box display="flex" alignItems="center">
                              {resource.icon}
                              <Typography variant="subtitle1" ml={2}>{resource.type} - {resource.description}</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Notes */}
      {selectedTab === 1 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Notes de l'élève :</Typography>
          <Grid container spacing={2}>
            {['Devoir 1', 'Devoir 2', 'Composition'].map((examType) => (
              <Grid item xs={12} key={examType}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{examType}</Typography>
                      <IconButton>
                        <ArrowForward />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default StudentDashboard;
