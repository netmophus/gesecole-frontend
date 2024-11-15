
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { TextField, Button, Container, Typography, Select, MenuItem, InputLabel, FormControl, Box, Grid, Card, CardContent } from '@mui/material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: '',
    email: '',
    establishmentName: '',
    establishmentType: '',
    establishmentAddress: '', // Ajout du champ adresse
  });

  const { register } = useContext(AuthContext);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    register(formData);
  };


  return (
    <Box sx={{ display: 'flex', minHeight:'150vh' }}>
      {/* Section principale pour centrer le formulaire */}
      <Box        
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00897B',
            //height: '100vh',
            width: '100%', // Ajout de 100% pour couvrir toute la largeur
          }}        
      >
        <Container maxWidth="md">
          <Card sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#004d40', padding: 3, width:'100%' }}>
            <CardContent>
              <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: '#fff', marginBottom: '20px' }}>
                Créez votre compte
              </Typography>
              <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                  {/* Nom et téléphone */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nom complet"
                      name="name"
                      value={formData.name}
                      onChange={onChange}
                      margin="normal"
                      required
                      sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#FF8C00', marginTop: '-8px' } }}
                      InputProps={{ style: { color: '#000' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Numéro de téléphone"
                      name="phone"
                      value={formData.phone}
                      onChange={onChange}
                      margin="normal"
                      required
                      sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#FF8C00', marginTop: '-8px' } }}
                      InputProps={{ style: { color: '#000' } }}
                    />
                  </Grid>

                  {/* Email et mot de passe */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email (optionnel)"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      margin="normal"
                      sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#FF8C00', marginTop: '-7px' } }}
                      InputProps={{ style: { color: '#000' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mot de passe"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={onChange}
                      margin="normal"
                      required
                      sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                      InputLabelProps={{ style: { color: '#FF8C00', marginTop: '-7px' } }}
                      InputProps={{ style: { color: '#000' } }}
                    />
                  </Grid>

                  {/* Rôle */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal" sx={{ borderRadius: 1 }}>
                      <InputLabel id="role-label" sx={{ color: '#FF8C00', marginTop: '-8px' }}>Rôle</InputLabel>
                      <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={onChange}
                        required
                        sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                      >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Regional">Regional</MenuItem>
                        <MenuItem value="Inspection">Inspection</MenuItem>
                        <MenuItem value="Etablissement">Etablissement</MenuItem>
                        <MenuItem value="Enseignant">Enseignant</MenuItem>
                        <MenuItem value="Parent">Parent</MenuItem>
                        <MenuItem value="Eleve">Eleve</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Champs supplémentaires pour le rôle "Etablissement" */}
                  {formData.role === 'Etablissement' && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" sx={{ borderRadius: 1 }}>
                          <InputLabel id="establishmentType-label" sx={{ color: '#FF8C00', marginTop: '-8px' }}>Type d'établissement</InputLabel>
                          <Select
                            labelId="establishmentType-label"
                            id="establishmentType"
                            name="establishmentType"
                            value={formData.establishmentType}
                            onChange={onChange}
                            required
                            sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                          >
                            <MenuItem value="Public">Public</MenuItem>
                            <MenuItem value="Prive">Privé</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Nom de l'établissement"
                          name="establishmentName"
                          value={formData.establishmentName}
                          onChange={onChange}
                          margin="normal"
                          required
                          sx={{ backgroundColor: '#e0e0e0', borderRadius: 1 }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          label="Adresse de l'établissement"
                          name="establishmentAddress"
                          value={formData.establishmentAddress}
                          onChange={onChange}
                          margin="normal"
                          required
                          multiline
                          rows={4}
                          sx={{ backgroundColor: '#e0e0e0', borderRadius: 1}}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: '#FF8C00',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#FFD700',
                      color: '#004d40',
                    },
                  }}
                >
                  S'inscrire
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box> 
      
    </Box>
  );





};

export default RegisterPage;
