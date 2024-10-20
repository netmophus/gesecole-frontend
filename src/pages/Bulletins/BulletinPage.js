

import React, { useState,  useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Delete, Visibility,  Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
//import { AuthContext } from '../../context/AuthContext';
import debounce from 'lodash.debounce';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  TableHead,
  TableRow,
  TableCell, 
  Table, 
  Paper, 
  Grid,
  TableBody, 
  TableContainer, 
  Tooltip, 
  IconButton, 
  TablePagination, 
  InputAdornment,
  Snackbar, // Import correct depuis @mui/material
  Alert,    // Import correct depuis @mui/material
} from '@mui/material';

const BulletinPage = () => {
  //const { user } = useContext(AuthContext);
  const [bulletins, setBulletins] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  
  const fetchBulletins = useCallback(async () => {
    // Récupérer le token et l'identifiant de l'établissement depuis le localStorage
    const token = localStorage.getItem('token');
    const establishmentId = localStorage.getItem('schoolId');

    // Vérifier si le token et l'identifiant d'établissement sont présents
    if (!token) {
      console.error("Aucun token trouvé. L'utilisateur doit se reconnecter.");
      setSnackbar({
        open: true,
        message: 'Erreur: Vous devez être connecté pour effectuer cette action.',
        severity: 'error',
      });
      navigate('/login'); // Redirection vers la page de connexion
      return;
    }

    if (!establishmentId) {
      console.error("Aucun identifiant d'établissement trouvé");
      setSnackbar({
        open: true,
        message: 'Erreur: Aucun identifiant d\'établissement trouvé.',
        severity: 'error',
      });
      return;
    }

    try {
      const res = await axios.get(`${apiBaseUrl}/api/bulletins`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,
          page: page + 1,  // Les API de pagination sont souvent 1-indexées
          limit: rowsPerPage,
        },
      });

      setBulletins(Array.isArray(res.data) ? res.data : res.data.bulletins || []);
      setTotalCount(res.data.totalCount || res.data.length || 0);
    } catch (err) {
      console.error('Erreur lors de la récupération des bulletins:', err);
      setBulletins([]);
    }
  }, [searchTerm, page, rowsPerPage, navigate, apiBaseUrl]);

  useEffect(() => {
    fetchBulletins();
  }, [fetchBulletins]);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce bulletin?')) {
      return;
    }

    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("Aucun token trouvé. L'utilisateur doit se reconnecter.");
      alert('Erreur: Vous devez être connecté pour effectuer cette action.');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.delete(`${apiBaseUrl}/api/bulletins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        alert('Bulletin supprimé avec succès.');
        setBulletins(bulletins.filter(bulletin => bulletin._id !== id));
        setTotalCount(totalCount - 1);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du bulletin:', err);
      alert('Erreur lors de la suppression du bulletin.');
    }
  };


 
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewBulletin = (id) => {
    navigate(`/bulletin/${id}`);
  };

  const handleSearchChange = debounce((event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0); 
  }, 300);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  

  return (
    <Container>

      {/* Affichage du Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card sx={{ backgroundColor: '#f5f5f5', padding: 3, mt: 4, marginBottom: '25px' }}>
        {/* Bouton de retour au dashboard */}
 <Grid item xs={12}>
    <Button
      variant="outlined"
      onClick={() => navigate('/etablissement/dashboardPage')}
      sx={{
        marginTop: 2,        
        marginLeft: 2,
        backgroundColor: '#004d40',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#00332d',
          color: '#fff',
        },
        borderRadius: 2,
        padding: '10px 20px',
      }}
    >
      Retour au Dashboard
    </Button>
  </Grid>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
            <Typography variant="h4">Liste des Bulletins</Typography>
            <TextField
              variant="outlined"
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
            <Button variant="contained" color="primary" component={Link} to="/bulletins/create">
              Ajouter un Bulletin
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Élève</TableCell>
                  <TableCell>Classe</TableCell>
                  <TableCell>Année</TableCell>
                  <TableCell>Période</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bulletins.length > 0 ? (
                  bulletins.map((bulletin) => (
                    <TableRow key={bulletin._id}>

<TableCell>
  <Box display="flex" alignItems="center">
    {bulletin.student?.photo && 
      console.log('URL de la photo:', `http://localhost:5000/${bulletin.student.photo.replace(/\\/g, '/')}`)
    }
    {bulletin.student?.photo ? (
    



      <img
  src={`${apiBaseUrl}/${bulletin.student.photo.replace(/\\/g, '/')}`}
  alt={`${bulletin.student.firstName}`}
  style={{
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginRight: '10px',
  }}
/>
    ) : (
      <Typography>Aucune photo disponible</Typography>
    )}
    {bulletin.student?.firstName} {bulletin.student?.lastName}
  </Box>
</TableCell>









                      <TableCell>{bulletin.student?.firstName} {bulletin.student?.lastName}</TableCell>
                      <TableCell>{bulletin.classId?.name}</TableCell>
                      <TableCell>{bulletin.year}</TableCell>
                      <TableCell>{bulletin.period}</TableCell>
                      <TableCell>
                        <Tooltip title="Modifier">
                          <IconButton component={Link} to={`/bulletins/edit/${bulletin._id}`} color="primary">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton color="secondary" onClick={() => handleDelete(bulletin._id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Voir le Bulletin">
                          <IconButton color="default" onClick={() => handleViewBulletin(bulletin._id)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucun bulletin trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page"
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>



          
        </CardContent>

        
      </Card>

      
    </Container>
  );

  
};

export default BulletinPage;
