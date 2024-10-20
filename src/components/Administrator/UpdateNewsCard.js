import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';

const UpdateNewsCard = ({ open, onClose, card, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    titlePage: '', // Nouveau champ ajouté ici
    titleCard: '',
    bodyCard: '',
    btnCard: '',
  });

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (card) {
      setFormData({
        titlePage: card.titlePage || '', // Ajoutez titlePage ici
        titleCard: card.titleCard || '',
        bodyCard: card.bodyCard || '',
        btnCard: card.btnCard || '',
      });
    }
  }, [card]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiBaseUrl}/api/section-cards/${card._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la carte', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier la Carte d'Actualité</DialogTitle>
      <DialogContent>
        <TextField
          label="Titre de la Carte"
          name="titleCard"
          fullWidth
          value={formData.titleCard}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Contenu de la Carte"
          name="bodyCard"
          fullWidth
          multiline
          rows={4}
          value={formData.bodyCard}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
  label="Titre de la Page"
  name="titlePage"
  fullWidth
  value={formData.titlePage}
  onChange={handleInputChange}
  sx={{ mb: 2 }}
/>

        <TextField
          label="Texte du bouton"
          name="btnCard"
          fullWidth
          value={formData.btnCard}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Annuler</Button>
        <Button onClick={handleUpdate} color="primary">Mettre à jour</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateNewsCard;
