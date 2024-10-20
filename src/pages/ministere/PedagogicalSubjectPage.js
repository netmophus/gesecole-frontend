
import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, TextField, 
  MenuItem, Button, Box, Snackbar, Alert, Dialog, DialogTitle, 
  DialogContent, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination, InputAdornment 
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const PedagogicalSubjectPage = () => {
  const [level, setLevel] = useState('');
  const [className, setClassName] = useState('');
  const [series, setSeries] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjects, setSubjects] = useState([]); // État des matières
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);

  const apiBaseUrl = process.env.REACT_APP_API_URL;




  // const collegeClasses = ['6ème', '5ème', '4ème', '3ème'];
  // const lyceeClasses = ['Seconde', 'Première', 'Terminale'];

  const collegeClasses = ['6eme', '5eme', '4eme', '3eme'];
  const lyceeClasses = ['Seconde', 'Premiere', 'Terminale'];




  const handleLevelChange = (event) => {
    setLevel(event.target.value);
    setClassName('');
    setSeries('');
  };

  const handleAddSubject = async () => {

    console.log('Level:', level);
  console.log('ClassName:', className);
  console.log('Series:', series);
  console.log('SubjectName:', subjectName);
    if (!level || !className || !subjectName || (level === 'Lycee' && !series)) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs obligatoires.', severity: 'warning' });
      return;
    }

    const newSubject = {
      name: subjectName,
      level,
      className,
      series: level === 'Lycee' ? series : undefined,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token manquant');


      console.log('Payload envoyé:', { level, className, series });

      const response = await axios.post(
        `${apiBaseUrl}/api/pedagogical-subjects`,
        newSubject,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      setSubjects([...subjects, response.data]);
      setSnackbar({ open: true, message: 'Matière ajoutée avec succès !', severity: 'success' });
      setSubjectName('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la matière:', error);
      setSnackbar({ open: true, message: 'Erreur lors de l\'ajout de la matière.', severity: 'error' });
    }
  };

 



  
  const fetchSubjects = async () => {
    try {
      console.log('Tentative de récupération du token...');
      const token = localStorage.getItem('token'); // Récupère le token
      console.log('Token récupéré:', token);
  
      if (!token) throw new Error('Token manquant');
  
      console.log('Envoi de la requête GET vers le backend...');
      const response = await axios.get(`${apiBaseUrl}/api/pedagogical-subjects`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      console.log('Réponse du backend:', response);
      console.log('Matières récupérées:', response.data);
  
      setSubjects(response.data); // Met à jour l’état avec les matières récupérées
      console.log('État des matières mis à jour:', response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des matières:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des matières.',
        severity: 'error',
      });
    }
  };
  
  useEffect(() => {
    console.log('État du dialog ouvert:', openDialog);
    if (openDialog) {
      console.log('Dialog ouvert, lancement de la récupération des matières...');
      fetchSubjects();
    }
  }, [openDialog]); // Recharger les matières lorsque le Dialog est ouvert
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    console.log('Subjects State:', subjects);

  };
  
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm)
  );
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  


 

  const handleOpenDialog = () => {
    setOpenDialog(true);
    fetchSubjects(); // Récupère les matières à chaque ouverture du dialog
  };
  

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 5 }}>
      <Card sx={{ backgroundColor: '#e3f2fd' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Ajouter une Matière Pédagogique
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Niveau"
                value={level}
                onChange={handleLevelChange}
              >
                <MenuItem value="College">Collège</MenuItem>
                <MenuItem value="Lycee">Lycée</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Classe"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                disabled={!level}
              >
                {(level === 'College' ? collegeClasses : lyceeClasses).map((classe) => (
                  <MenuItem key={classe} value={classe}>
                    {classe}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {level === 'Lycee' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Série"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                  <MenuItem value="E">E</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                  <MenuItem value="G">G</MenuItem>
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la Matière"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Button variant="contained" onClick={handleAddSubject}>
                  Ajouter la Matière
                </Button>
                <Button variant="outlined" onClick={handleOpenDialog}>
                  Voir les Matières
                </Button>

              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

    





















      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
  <DialogTitle>Matières Pédagogiques</DialogTitle>
  <DialogContent>
    <Box mb={2}>
      <TextField
        fullWidth
        placeholder="Rechercher..."
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Niveau</TableCell>
            <TableCell>Classe</TableCell>
            <TableCell>Série</TableCell>
            <TableCell>Nom de la Matière</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSubjects
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subject, index) => (
              <TableRow key={index}>
                <TableCell>{subject.level}</TableCell>
                <TableCell>{subject.className}</TableCell>
                <TableCell>{subject.series || 'N/A'}</TableCell>
                <TableCell>{subject.name}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      component="div"
      count={filteredSubjects.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </DialogContent>
</Dialog>


      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PedagogicalSubjectPage;
