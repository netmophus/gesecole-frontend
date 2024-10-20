


import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Typography, Grid, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

const ActivityManagement = () => {
  const navigate = useNavigate();
  const [onglets, setOnglets] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    titleOnglet: '',
    bodyOnglet: '',
    imgOnglet: '',
    videoOnglet: '',
    btnOnglet: ''
  });
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentOnglet, setCurrentOnglet] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    fetchOnglets();
  }, []);

  const fetchOnglets = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/onglets`);
      setOnglets(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des onglets', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Générer une prévisualisation de l'image pour le modal
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleOpenModal = (onglet) => {
    setCurrentOnglet(onglet);
    setOpenModal(true);
    setImagePreview(onglet?.imgOnglet ? `${apiBaseUrl}/${onglet.imgOnglet}` : null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentOnglet(null);
    setImagePreview(null);
    setFile(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('titleOnglet', formData.titleOnglet);
    formDataToSend.append('bodyOnglet', formData.bodyOnglet);
    formDataToSend.append('btnOnglet', formData.btnOnglet);

    if (file) {
      formDataToSend.append('imgOnglet', file);
    }

    if (formData.videoOnglet) {
      formDataToSend.append('videoOnglet', formData.videoOnglet);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiBaseUrl}/api/onglets`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      handleCloseCreateModal();
      fetchOnglets();
    } catch (err) {
      console.error('Erreur lors de la création de l\'onglet:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('titleOnglet', currentOnglet?.titleOnglet || '');
    formDataToSend.append('bodyOnglet', currentOnglet?.bodyOnglet || '');
    formDataToSend.append('btnOnglet', currentOnglet?.btnOnglet || '');

    if (file) {
      formDataToSend.append('imgOnglet', file);
    }

    if (currentOnglet?.videoOnglet) {
      formDataToSend.append('videoOnglet', currentOnglet.videoOnglet);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${apiBaseUrl}/api/onglets/${currentOnglet?._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      handleCloseModal();
      fetchOnglets();
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet onglet ?");
      if (confirmDelete) {
        const response = await axios.delete(`${apiBaseUrl}/api/onglets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          fetchOnglets();
          alert("Onglet supprimé avec succès !");
        } else {
          alert("Erreur lors de la suppression");
        }
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de l'onglet:", err);
    }
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
    setFormData({
      titleOnglet: '',
      bodyOnglet: '',
      imgOnglet: '',
      videoOnglet: '',
      btnOnglet: ''
    });
    setFile(null);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setFormData({
      titleOnglet: '',
      bodyOnglet: '',
      imgOnglet: '',
      videoOnglet: '',
      btnOnglet: ''
    });
    setFile(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Gestion des Activités</Typography>

      <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
        Ajouter un nouvel onglet
      </Button>

      <Grid container spacing={2} mt={2}>
        {onglets.map((onglet) => (
          <Grid item xs={12} md={4} key={onglet._id}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{onglet.titleOnglet}</Typography>
              <Typography variant="body2">{onglet.bodyOnglet}</Typography>

              {onglet.imgOnglet ? (
                <img
                  src={`http://localhost:5000/${onglet.imgOnglet}`}
                  alt={onglet.titleOnglet}
                  style={{ width: '100%', height: 'auto', marginTop: '10px' }}
                />
              ) : onglet.videoOnglet ? (
                <ReactPlayer
                  url={onglet.videoOnglet}
                  width="100%"
                  height="auto"
                  style={{ marginTop: '10px' }}
                />
              ) : (
                <Typography variant="body2">Aucun média disponible</Typography>
              )}

              <Box mt={2}>
                <IconButton onClick={() => handleOpenModal(onglet)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(onglet._id)}>
                  <DeleteIcon color="secondary" />
                </IconButton>
                <Button variant="outlined" color="primary" onClick={() => navigate(`/onglet-articles/${onglet._id}`)}>
                  Gérer
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal de création */}
      <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '90%',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Ajouter un nouvel Onglet</Typography>

          <form onSubmit={handleCreate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Titre de l'Onglet"
                  value={formData.titleOnglet}
                  onChange={handleInputChange}
                  name="titleOnglet"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Texte du Bouton"
                  value={formData.btnOnglet}
                  onChange={handleInputChange}
                  name="btnOnglet"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contenu de l'Onglet"
                  value={formData.bodyOnglet}
                  onChange={handleInputChange}
                  name="bodyOnglet"
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="file"
                  inputProps={{ accept: 'image/*' }}
                  name="imgOnglet"
                  onChange={handleFileChange}
                  helperText="Sélectionner une image"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL de la Vidéo"
                  name="videoOnglet"
                  value={formData.videoOnglet}
                  onChange={handleInputChange}
                  helperText="Optionnel : Ajoutez l'URL d'une vidéo"
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" color="primary" type="submit">
                  Créer
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCloseCreateModal}>
                  Annuler
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      {/* Modal de mise à jour */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '90%',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Modifier l'Onglet</Typography>

          <form onSubmit={handleUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Titre de l'Onglet"
                  value={currentOnglet?.titleOnglet || ''}
                  onChange={(e) =>
                    setCurrentOnglet({ ...currentOnglet, titleOnglet: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Texte du Bouton"
                  value={currentOnglet?.btnOnglet || ''}
                  onChange={(e) =>
                    setCurrentOnglet({ ...currentOnglet, btnOnglet: e.target.value })
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contenu de l'Onglet"
                  value={currentOnglet?.bodyOnglet || ''}
                  onChange={(e) =>
                    setCurrentOnglet({ ...currentOnglet, bodyOnglet: e.target.value })
                  }
                  multiline
                  rows={4}
                  required
                />
              </Grid>

              {imagePreview ? (
                <Grid item xs={12}>
                  <img
                    src={imagePreview}
                    alt="Prévisualisation de l'image"
                    style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
                  />
                </Grid>
              ) : currentOnglet?.videoOnglet && (
                <Grid item xs={12}>
                  <ReactPlayer
                    url={currentOnglet.videoOnglet}
                    width="100%"
                    height="auto"
                    style={{ marginBottom: '10px' }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="file"
                  inputProps={{ accept: 'image/*' }}
                  name="imgOnglet"
                  onChange={handleFileChange}
                  helperText="Modifier l'image"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL de la Vidéo"
                  name="videoOnglet"
                  value={currentOnglet?.videoOnglet || ''}
                  onChange={(e) =>
                    setCurrentOnglet({ ...currentOnglet, videoOnglet: e.target.value })
                  }
                  helperText="Modifier la vidéo (facultatif)"
                />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" color="primary" type="submit">
                  Mettre à jour
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                  Annuler
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default ActivityManagement;
