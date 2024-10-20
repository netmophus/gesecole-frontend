
import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, Paper, Typography } from '@mui/material';

const EstablishmentForm = ({ onSubmit, initialData = {} }) => {
  const [name, setName] = useState(initialData.name || '');
  const [type, setType] = useState(initialData.type || 'public');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, type });
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        {initialData.name ? 'Modifier l\'Établissement' : 'Configurer l\'Établissement'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nom de l'Établissement"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Type d'Établissement"
              variant="outlined"
              fullWidth
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="privé">Privé</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {initialData.name ? 'Mettre à jour' : 'Configurer'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EstablishmentForm;
