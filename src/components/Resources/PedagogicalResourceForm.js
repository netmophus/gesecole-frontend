
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; 

const PedagogicalResourceForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // Pour gérer les messages Snackbar

  const { user } = useContext(AuthContext); 

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchClassesAndSubjects = async () => {
      try {
        if (!user || !user.token) {
          alert('Vous devez être connecté pour effectuer cette action');
          return;
        }

        const headers = { 'Authorization': `Bearer ${user.token}` };

        const classesResponse = await axios.get(`${apiBaseUrl}/api/pedagogical-resources/classes`, { headers });
        const subjectsResponse = await axios.get(`${apiBaseUrl}/api/pedagogical-resources/subjects`, { headers });

        setClasses(classesResponse.data);
        setSubjects(subjectsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setLoading(false);
      }
    };

    fetchClassesAndSubjects();
  }, [user,apiBaseUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resourceData = {
      title,
      description,
      class: classId,
      subject: subjectId,
      resourceType,
      fileUrl,
    };

    try {
      const response = await axios.post(`${apiBaseUrl}/api/pedagogical-resources`, resourceData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log(response);
      
      // Afficher un message de succès avec Snackbar
      setSnackbar({ open: true, message: 'Ressource pédagogique créée avec succès', severity: 'success' });
      
      // Réinitialiser le formulaire après la création
      setTitle('');
      setDescription('');
      setClassId('');
      setSubjectId('');
      setResourceType('');
      setFileUrl('');
      
      // Optionnel : fermer le formulaire après création
      if (onClose) onClose();

    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Afficher le message d'erreur en cas de doublon
        setSnackbar({ open: true, message: err.response.data.msg, severity: 'error' });
      } else {
        console.error('Erreur lors de la soumission du formulaire:', err);
        setSnackbar({ open: true, message: 'Erreur lors de la création de la ressource', severity: 'error' });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: 600,
        margin: 'auto',
        marginTop: 4,
      }}
    >
      <TextField
        fullWidth
        margin="normal"
        label="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Classe</InputLabel>
        <Select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required
        >
          {classes.map((classe) => (
            <MenuItem key={classe._id} value={classe._id}>
              {classe.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Matière</InputLabel>
        <Select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
        >
          {subjects.map((subject) => (
            <MenuItem key={subject._id} value={subject._id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
  <InputLabel>Type de Ressource</InputLabel>
  <Select
    value={resourceType}
    onChange={(e) => setResourceType(e.target.value)}
    required
  >
    <MenuItem value="PDF">PDF</MenuItem>
    <MenuItem value="Video">Vidéo</MenuItem>
    <MenuItem value="Document">Document</MenuItem>
    <MenuItem value="Image">Image</MenuItem>
    <MenuItem value="Other">Autre</MenuItem>
  </Select>
</FormControl>


      <TextField
        fullWidth
        margin="normal"
        label="URL du fichier (si vidéo ou PDF)"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" type="submit">
          Ajouter Ressource
        </Button>
        {onClose && (
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Annuler
          </Button>
        )}
      </Box>

      {/* Snackbar pour afficher les messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PedagogicalResourceForm;
