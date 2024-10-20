import React, { useState, useEffect,useContext,useCallback } from 'react';
import {
  Container, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem, IconButton, TablePagination,
  InputAdornment, Snackbar, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { AuthContext } from '../../context/AuthContext'; 


const ChapterPage = () => {
  const { user } = useContext(AuthContext);
  const [chapters, setChapters] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState({
    title: '', class: '', series: '', order: 1
  });
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [classes, setClasses] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  // Récupération des classes (et éventuellement des séries si c'est pour le lycée)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (!user || !user.token) {
          console.error("Utilisateur non authentifié.");
          return;
        }
        const res = await axios.get(`${apiBaseUrl}/api/chapters/classes`, {
          headers: {
            'Authorization': `Bearer ${user.token}`, // Utilise le token pour authentification
          }
        });
        setClasses(res.data); // Stocke les classes dans l'état
      } catch (err) {
        console.error('Erreur lors de la récupération des classes:', err); // Log en cas d'erreur
      }
    };
  
    fetchClasses();
  }, [user, apiBaseUrl]); // Dépend de user pour recharger quand il change
  

  // Récupération des chapitres avec pagination et recherche
 
  const fetchChapters = useCallback(async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/chapters`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,  // Utilise le token pour l'authentification
        },
        params: {
          search: searchTerm,
          page: page + 1,  // Pagination
          limit: rowsPerPage,
        },
      });
  
      console.log('Chapitres récupérés:', res.data); // Log des chapitres récupérés
      setChapters(res.data || []);  // Mettre à jour le state avec les chapitres récupérés
  
    } catch (err) {
      console.error('Erreur lors de la récupération des chapitres:', err);
    }
  }, [user, searchTerm, page, rowsPerPage]);
  



  
  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // Gestion du formulaire de création/mise à jour
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentChapter({ title: '', class: '', series: '', order: 1 });
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      if (!user || !user.token) {
        console.error("Utilisateur non authentifié.");
        return;
      }
      
      if (editing) {
        await axios.put(`${apiBaseUrl}/api/chapters/${currentChapter._id}`, currentChapter, {
          headers: {
            'Authorization': `Bearer ${user.token}`,  // Assure-toi d'envoyer le token
            'Content-Type': 'application/json',
          }
        });
      } else {
        await axios.post(`${apiBaseUrl}/api/chapters`, currentChapter, {
          headers: {
            'Authorization': `Bearer ${user.token}`,  // Assure-toi d'envoyer le token
            'Content-Type': 'application/json',
          }
        });
      }
  
      fetchChapters();
      handleClose();
      setSnackbar({ open: true, message: editing ? 'Chapitre mis à jour' : 'Chapitre ajouté', severity: 'success' });
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du chapitre:', err);
      setSnackbar({ open: true, message: 'Erreur lors de la sauvegarde', severity: 'error' });
    }
  };
  

  // Supprimer un chapitre

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
  
      await axios.delete(`${apiBaseUrl}/api/chapters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      
      fetchChapters();
      setSnackbar({ open: true, message: 'Chapitre supprimé', severity: 'success' });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Erreur lors de la suppression';
      console.error('Erreur lors de la suppression du chapitre:', errorMsg);
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };
  

  const handleEdit = (chapter) => {
    setCurrentChapter({
      ...chapter,
      class: chapter.class ? chapter.class._id : '',  // Vérifie que la classe est bien définie et que son ID est passé
    });
    setEditing(true);
    handleOpen();
  };
  
  // Gestion de la recherche
  const handleSearchChange = debounce((event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  }, 300);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Gestion des Chapitres</Typography>
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
          sx={{ width: 250 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Ajouter
        </Button>
      </Box>

      {/* Table des chapitres */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Classe</TableCell>
             
              <TableCell>Ordre</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>



  <TableBody>
  {Array.isArray(chapters) && chapters.length > 0 ? (
    chapters.map((chapter) => (
      <TableRow key={chapter._id}>
        <TableCell>{chapter.title}</TableCell>
        <TableCell>{chapter.class?.name || 'N/A'}</TableCell>
       
        <TableCell>{chapter.order}</TableCell>
        <TableCell>
          <IconButton color="primary" onClick={() => handleEdit(chapter)}>
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleDelete(chapter._id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5} align="center">Aucun chapitre trouvé</TableCell>
    </TableRow>
  )}
</TableBody>



        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={chapters.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog pour ajouter ou éditer un chapitre */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Modifier le Chapitre' : 'Ajouter un Chapitre'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre du Chapitre"
            fullWidth
            margin="dense"
            value={currentChapter.title}
            onChange={(e) => setCurrentChapter({ ...currentChapter, title: e.target.value })}
          />
        


<TextField
  select
  label="Classe"
  fullWidth
  margin="dense"
  value={currentChapter.class || ''}
  onChange={(e) => setCurrentChapter({ ...currentChapter, class: e.target.value })}
>
  {classes.map((classe) => (
    <MenuItem key={classe._id} value={classe._id}>
      {classe.name}
    </MenuItem>
  ))}
</TextField>




          
          <TextField
            label="Ordre du Chapitre"
            type="number"
            fullWidth
            margin="dense"
            value={currentChapter.order}
            onChange={(e) => setCurrentChapter({ ...currentChapter, order: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Annuler</Button>
          <Button onClick={handleSave} color="primary">{editing ? 'Mettre à jour' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChapterPage;
