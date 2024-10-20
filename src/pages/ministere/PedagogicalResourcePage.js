
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Select, MenuItem,
  TextField, Button, IconButton, Snackbar, Dialog, DialogTitle,
  DialogContent, DialogActions, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

import { Edit } from '@mui/icons-material';

import { AddCircle, Delete, Save, CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';
const PedagogicalResourcePage = () => {
  const [level, setLevel] = useState('college'); // Niveau : Collège ou Lycée
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
 // const [selectedChapter, setSelectedChapter] = useState('');
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  //const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [chapterNumber, setChapterNumber] = useState('');


  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  
  
  const [resources, setResources] = useState([]); // Assure-toi que c'est bien défini


  const [openEditDialog, setOpenEditDialog] = useState(false); // État du dialog de modification
  const [editableResource, setEditableResource] = useState(null); // Ressource sélectionnée à modifier
  



  const handleClassChange = (event) => setSelectedClass(event.target.value);
  const handleSubjectChange = (event) => setSelectedSubject(event.target.value);
  //const handleChapterTitleChange = (event) => setChapterTitle(event.target.value);
  const handleSeriesChange = (event) => setSelectedSeries(event.target.value);

  const addVideo = () => setVideos([...videos, { link: '', description: '' }]);
  const addPdf = () => setPdfs([...pdfs, { file: '', description: '' }]);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  

  const handleCreateResource = async () => {
    if (!selectedClass || !selectedSubject || !chapterTitle) {
      setSnackbar({
        open: true,
        message: 'Veuillez remplir tous les champs obligatoires.',
        severity: 'error',
      });
      return;
    }
  
    // Vérification des ressources avant envoi
    if (!videos.every(v => v.link && v.description) || 
        !pdfs.every(p => p.file && p.description)) {
      console.error('Ressources invalides.');
      setSnackbar({
        open: true,
        message: 'Vérifiez les ressources avant de continuer.',
        severity: 'error',
      });
      return;
    }
  
    const newResource = {
      level,
      series: level === 'Lycee' ? selectedSeries : undefined,  // Série uniquement pour le lycée
      class: selectedClass,  // Correction : 'class' attendu par le backend
      subject: selectedSubject,
      chapter: {
        number: chapterNumber,
        title: chapterTitle,
      },
      resources: [
        ...videos.map(video => ({
          type: 'video',
          link: video.link,
          description: video.description,
        })),
        ...pdfs.map(pdf => ({
          type: 'pdf',
          file: pdf.file,
          description: pdf.description,
        })),
      ],
    };
  
    try {
      const token = localStorage.getItem('token');  // Récupération du token
      const response = await axios.post(
        `${apiBaseUrl}/api/pedagogical-resources`,
        newResource,
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // Authentification
            'Content-Type': 'application/json',
          },
        }
      );
  
      setSnackbar({
        open: true,
        message: 'Ressource créée avec succès.',
        severity: 'success',
      });
      console.log('Ressource ajoutée :', response.data);
    } catch (error) {
      console.error('Erreur lors de la création de la ressource :', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la création de la ressource.',
        severity: 'error',
      });
    }
  };
  



  //const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleDialogClose = () => setDialogOpen(false);


 

  const handlePdfUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newPdfs = [...pdfs];
      newPdfs[index].file = file.name; // Stocke le nom du fichier ou utilise un chemin valide
      setPdfs(newPdfs);
    }
  };
  
  const handleDeleteVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index); // Supprime la vidéo sélectionnée
    setVideos(newVideos);
  };
  
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        console.log('Niveau sélectionné:', level);
        console.log('Classe sélectionnée:', selectedClass);
  
        const response = await axios.get(
          `${apiBaseUrl}/api/pedagogical-subjects/by-level?level=${level}&className=${selectedClass}`,
          {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          }
        );
  
        console.log('Réponse du backend:', response.data);
        setSubjects(response.data); // Met à jour l'état
  
        console.log('Matières après setSubjects:', response.data); // Log après mise à jour
      } catch (error) {
        console.error('Erreur lors de la récupération des matières:', error);
  
        setSnackbar({
          open: true,
          message: 'Erreur lors de la récupération des matières.',
          severity: 'error',
        });
      }
    };
  
    if (level) {
      fetchSubjects();
    }
  }, [level, selectedClass,apiBaseUrl]);
 
  const handleOpenResourceDialog = (resource) => {
    setSelectedResource(resource);
    setOpenResourceDialog(true);
  };
  
  const handleCloseResourceDialog = () => {
    setSelectedResource(null);
    setOpenResourceDialog(false);
  };
  


  
  const handleDeleteResource = async (resourceId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token
  
      // Appel API pour supprimer la ressource
      await axios.delete(`${apiBaseUrl}/api/pedagogical-resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Mettre à jour la liste des ressources après suppression
      setResources((prevResources) =>
        prevResources.filter((resource) => resource._id !== resourceId)
      );
  
      setSnackbar({
        open: true,
        message: 'Ressource supprimée avec succès !',
        severity: 'success',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la ressource:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression de la ressource.',
        severity: 'error',
      });
    }
  };
  

useEffect(() => {
  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');  // Récupère le token
      const response = await axios.get(
        `${apiBaseUrl}/api/pedagogical-resources`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      console.log('Ressources récupérées :', response.data);  // Vérifie la réponse ici
      setResources(response.data);  // Mets à jour l'état avec les ressources
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des ressources.',
        severity: 'error',
      });
    }
  };

  fetchResources();
}, [apiBaseUrl]);


// Fonction pour ouvrir le dialog avec la ressource sélectionnée
const handleOpenEditDialog = (resource) => {
  setEditableResource(resource); // Stocke la ressource à modifier
  setOpenEditDialog(true); // Ouvre le dialog de modification
  console.log('Modification de la ressource:', resource); // Log pour vérification
};

// Fonction pour fermer le dialog de modification
const handleCloseEditDialog = () => {
  setEditableResource(null); // Réinitialise la ressource sélectionnée
  setOpenEditDialog(false); // Ferme le dialog
};

  return (
    <Box p={3}>

<Typography variant="h4" gutterBottom>
      Gestion des Ressources Pédagogiques
  </Typography>


<Tabs
  value={level}
  onChange={(e, newLevel) => setLevel(newLevel)} // Niveau à jour via state
  centered
>
  <Tab label="Collège" value="College" />
  <Tab label="Lycée" value="Lycee" />
</Tabs>



      {level === 'College' && (
        <Box mt={3} p={2} sx={{ backgroundColor: '#e3f2fd', borderRadius: 2 }}>
          <Grid container spacing={2}>
            {/* Sélection de la classe */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Sélectionner une classe</Typography>
                  <Select
                    value={selectedClass}
                    onChange={handleClassChange}
                    fullWidth
                  >
                    <MenuItem value="6eme">6ème</MenuItem>
                    <MenuItem value="5eme">5ème</MenuItem>
                    <MenuItem value="4eme">4ème</MenuItem>
                    <MenuItem value="3eme">3ème</MenuItem>
                  </Select>
                </CardContent>
              </Card>
            </Grid>

            {/* Sélection de la matière */}
            <Grid item xs={12} sm={6}>
  <Card>
    <CardContent>
      <Typography variant="h6">Sélectionner une matière</Typography>
      <Select
        value={selectedSubject}
        onChange={handleSubjectChange}
        fullWidth
      >
        {subjects.map((subject) => (
          <MenuItem key={subject._id} value={subject.name}>
            {subject.name}
          </MenuItem>
        ))}
      </Select>
    </CardContent>
  </Card>
            </Grid>


           {/* Sélection du chapitre */}
         

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Saisir le Numéro du Chapitre</Typography>
                <Grid container spacing={2}>
                  {/* "Chapitre" en dur et Numéro */}
                  <Grid item xs={12}>
                    <TextField
                      label="Numéro du Chapitre"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(e.target.value)}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <Typography variant="body1" sx={{ mr: 1 }}>
                            Chapitre
                          </Typography>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>




          {/* Titre du chapitre */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Titre du chapitre sélectionné</Typography>
                <TextField
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </CardContent>
            </Card>
          </Grid>


            {/* Ajout de ressources : Vidéos et PDFs */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Ajouter des ressources</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle />}
                    onClick={addVideo}
                    sx={{ mr: 2 }}
                  >
                    Ajouter Vidéo
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle />}
                    onClick={addPdf}
                  >
                    Ajouter PDF
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Liste des vidéos ajoutées */}
            <Grid item xs={12}>
  <Card>
    <CardContent>
      <Typography variant="h6">Vidéos ajoutées</Typography>
      {videos.map((video, index) => (
        <Grid container key={index} spacing={2} alignItems="center">
          {/* Lien Vidéo */}
          <Grid item xs={5}>
            <TextField
              label="Lien Vidéo"
              variant="outlined"
              value={video.link}
              onChange={(e) => {
                const newVideos = [...videos];
                newVideos[index].link = e.target.value;
                setVideos(newVideos);
              }}
              fullWidth
            />
          </Grid>

          {/* Description de la Vidéo */}
          <Grid item xs={5}>
            <TextField
              label="Description"
              variant="outlined"
              value={video.description}
              onChange={(e) => {
                const newVideos = [...videos];
                newVideos[index].description = e.target.value;
                setVideos(newVideos);
              }}
              fullWidth
            />
          </Grid>

          {/* Bouton de suppression */}
          <Grid item xs={2}>
            <IconButton
              color="error"
              onClick={() => handleDeleteVideo(index)} // Appel de la fonction de suppression
            >
              <Delete />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </CardContent>
  </Card>
</Grid>


            {/* Liste des PDFs ajoutés */}
            <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">PDFs ajoutés</Typography>
                {pdfs.map((pdf, index) => (
                  <Grid container key={index} spacing={2} alignItems="center">
                    {/* Upload de fichier PDF */}
                    <Grid item xs={5}>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handlePdfUpload(e, index)}
                      />
                    </Grid>

                    {/* Description du PDF */}
                    <Grid item xs={5}>
                      <TextField
                        label="Description"
                        variant="outlined"
                        value={pdf.description}
                        onChange={(e) => {
                          const newPdfs = [...pdfs];
                          newPdfs[index].description = e.target.value;
                          setPdfs(newPdfs);
                        }}
                        fullWidth
                      />
                    </Grid>

                    {/* Bouton de suppression */}
                    <Grid item xs={2}>
                      <IconButton
                        color="error"
                        onClick={() => {
                          const newPdfs = pdfs.filter((_, i) => i !== index);
                          setPdfs(newPdfs);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          </Grid>


            {/* Bouton de validation */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleCreateResource}
                fullWidth
              >
                Créer Ressource
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}









{level === 'Lycee' && (
        <Box mt={3} p={2} sx={{ backgroundColor: '#fce4ec', borderRadius: 2 }}>
          <Grid container spacing={2}>
            {/* Sélection de la série */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Sélectionner une série</Typography>
                  <Select value={selectedSeries} onChange={handleSeriesChange} fullWidth>
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                    <MenuItem value="E">E</MenuItem>
                    <MenuItem value="F">F</MenuItem>
                    <MenuItem value="G">G</MenuItem>
                  </Select>
                </CardContent>
              </Card>
            </Grid>

            {/* Sélection de la classe */}
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Sélectionner une classe</Typography>
                  <Select value={selectedClass} onChange={handleClassChange} fullWidth>
                    <MenuItem value="Seconde">Seconde</MenuItem>
                    <MenuItem value="Premiere">Première</MenuItem>
                    <MenuItem value="Terminale">Terminale</MenuItem>
                  </Select>
                </CardContent>
              </Card>
            </Grid>

            {/* Sélection de la matière */}    


            {/* Sélection de la matière */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sélectionner une matière</Typography>
            <Select value={selectedSubject} onChange={handleSubjectChange} fullWidth>
              {subjects.map((subject) => (
                <MenuItem key={subject._id} value={subject.name}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </CardContent>
        </Card>
      </Grid>

            {/* Sélection du chapitre */}
            <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Saisir le Numéro du Chapitre</Typography>
                <Grid container spacing={2}>
                  {/* "Chapitre" en dur et Numéro */}
                  <Grid item xs={12}>
                    <TextField
                      label="Numéro du Chapitre"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(e.target.value)}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <Typography variant="body1" sx={{ mr: 1 }}>
                            Chapitre
                          </Typography>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Titre du chapitre */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Titre du chapitre sélectionné</Typography>
                <TextField
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  variant="outlined"
                  fullWidth
                />
              </CardContent>
            </Card>
          </Grid>


            {/* Ajout de ressources */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Ajouter des ressources</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle />}
                    onClick={addVideo}
                    sx={{ mr: 2 }}
                  >
                    Ajouter Vidéo (Lien)
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircle />}
                    onClick={addPdf}
                  >
                    Ajouter PDF (Fichier)
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Liste des vidéos ajoutées */}
            <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Vidéos ajoutées</Typography>
                {videos.map((video, index) => (
                  <Grid container key={index} spacing={2} alignItems="center">
                    {/* Lien Vidéo */}
                    <Grid item xs={5}>
                      <TextField
                        label="Lien Vidéo"
                        variant="outlined"
                        value={video.link}
                        onChange={(e) => {
                          const newVideos = [...videos];
                          newVideos[index].link = e.target.value;
                          setVideos(newVideos);
                        }}
                        fullWidth
                      />
                    </Grid>

                    {/* Description de la Vidéo */}
                    <Grid item xs={5}>
                      <TextField
                        label="Description"
                        variant="outlined"
                        value={video.description}
                        onChange={(e) => {
                          const newVideos = [...videos];
                          newVideos[index].description = e.target.value;
                          setVideos(newVideos);
                        }}
                        fullWidth
                      />
                    </Grid>

                    {/* Bouton de suppression */}
                    <Grid item xs={2}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteVideo(index)} // Appel de la fonction de suppression
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          </Grid>


            {/* Liste des PDFs ajoutés */}
            <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">PDFs ajoutés</Typography>
                {pdfs.map((pdf, index) => (
                  <Grid container key={index} spacing={2} alignItems="center">
                    {/* Upload de fichier PDF */}
                    <Grid item xs={5}>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handlePdfUpload(e, index)}
                      />
                    </Grid>

                    {/* Description du PDF */}
                    <Grid item xs={5}>
                      <TextField
                        label="Description"
                        variant="outlined"
                        value={pdf.description}
                        onChange={(e) => {
                          const newPdfs = [...pdfs];
                          newPdfs[index].description = e.target.value;
                          setPdfs(newPdfs);
                        }}
                        fullWidth
                      />
                    </Grid>

                    {/* Bouton de suppression */}
                    <Grid item xs={2}>
                      <IconButton
                        color="error"
                        onClick={() => {
                          const newPdfs = pdfs.filter((_, i) => i !== index);
                          setPdfs(newPdfs);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
            </Card>
          </Grid>

            {/* Bouton de validation */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleCreateResource}
                fullWidth
              >
                Créer Ressource
              </Button>
            </Grid>
          </Grid>
          
        </Box>
      )}


{/* ===> Liste des ressources disponibles <=== */}
  {/* ===> Table des ressources disponibles <=== */}
  {resources.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Matière</strong></TableCell>
                <TableCell align="center"><strong>Niveau</strong></TableCell>
                <TableCell align="center"><strong>Classe</strong></TableCell>
                <TableCell align="center"><strong>Série</strong></TableCell>
                <TableCell align="center"><strong>Chapitre</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource._id}>
                  <TableCell align="center">{resource.subject}</TableCell>
                  <TableCell align="center">{resource.level}</TableCell>
                  <TableCell align="center">{resource.class}</TableCell>
                  <TableCell align="center">
                    {resource.series ? resource.series : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    {resource.chapter.number} - {resource.chapter.title}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(resource)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteResource(resource._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" mt={3}>
          Aucune ressource disponible pour le moment.
        </Typography>
      )}




    

<Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  message={snackbar.message} // Message dynamique
  action={
    <IconButton size="small" color="inherit" onClick={() => setSnackbar({ ...snackbar, open: false })}>
      <CheckCircleOutline />
    </IconButton>
  }
/>


      {/* Dialog de confirmation */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>La ressource a été créée avec succès.</DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Fermer</Button>
        </DialogActions>
      </Dialog>



{/* Dialog de modification */}
<Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
  <DialogTitle>Modifier la Ressource</DialogTitle>
  <DialogContent>
    {editableResource && (
      <>
        <Typography>Matière : {editableResource.subject}</Typography>
        <Typography>Niveau : {editableResource.level}</Typography>
        <Typography>Classe : {editableResource.class}</Typography>
        {editableResource.series && <Typography>Série : {editableResource.series}</Typography>}
        <Typography>Chapitre : {editableResource.chapter.number} - {editableResource.chapter.title}</Typography>

        {/* Tu peux ajouter ici un formulaire pour modifier la ressource */}
      </>
    )}
  </DialogContent>
  <DialogActions>
  <Button
  variant="outlined"
  startIcon={<Edit />}
  onClick={() => handleOpenEditDialog(editableResource)}
  sx={{ mr: 2 }}
>
  Modifier
</Button>

    <Button onClick={handleCloseEditDialog}>Fermer</Button>
  </DialogActions>
</Dialog>


{/* Dialog de confirmation
<Dialog open={dialogOpen} onClose={handleDialogClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>La ressource a été créée avec succès.</DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Fermer</Button>
      </DialogActions>
    </Dialog> */}



    </Box>
  );
};



export default PedagogicalResourcePage;
