
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, IconButton, Tooltip, Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Box, Typography } from '@mui/material';
import { Delete, Article as ArticleIcon, Edit } from '@mui/icons-material'; // Ajout de l'icône Edit pour Modifier
import axios from 'axios';
import NewsForm from '../../components/Administrator/NewsForm';
import UpdateNewsCard from '../../components/Administrator/UpdateNewsCard'; // Importer le modal UpdateNewsCard

const NewsManagement = () => {
  const [sectionCards, setSectionCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openUpdateModal, setOpenUpdateModal] = useState(false); // Gérer l'ouverture du modal de mise à jour
  const [cardToEdit, setCardToEdit] = useState(null); // Stocker la carte à modifier
  const itemsPerPage = 5;
  const titlePageExists = sectionCards.some((card) => card.titlePage);

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchSectionCards();
  }, []);


  const fetchSectionCards = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/section-cards`);
      setSectionCards(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes', error);
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${apiBaseUrl}/api/section-cards/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        alert('Carte supprimée avec succès');
        fetchSectionCards();
      } catch (err) {
        console.error('Erreur lors de la suppression de la carte', err);
      }
    }
  };

  // Ouvrir le modal pour la modification
  const handleOpenUpdateModal = (card) => {
    setCardToEdit(card); // Stocker la carte sélectionnée
    setOpenUpdateModal(true); // Ouvrir le modal
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false); // Fermer le modal
  };

  // Filtrer les cartes en fonction du terme de recherche
  const filteredCards = sectionCards.filter((card) =>
    card.titleCard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCards.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (direction) => {
    if (direction === 'next' && currentPage < Math.ceil(filteredCards.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestion des Actualités</h2>

      {/* Formulaire de création de nouvelle carte */}
      {/* <NewsForm onSuccess={fetchSectionCards} /> */}
      <NewsForm onSuccess={fetchSectionCards} titlePageExists={titlePageExists} />

      <h3>Cartes d'actualités existantes</h3>

      {/* Barre de recherche */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Rechercher une carte"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Tableau avec les cartes existantes */}
      {/* <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="h6">Titre</Typography></TableCell>
              <TableCell><Typography variant="h6">Contenu</Typography></TableCell>
              <TableCell><Typography variant="h6">Texte du bouton</Typography></TableCell>
              <TableCell><Typography variant="h6">Date de création</Typography></TableCell>
              <TableCell><Typography variant="h6">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((card) => (
              <TableRow key={card._id}>
                <TableCell>{card.titleCard}</TableCell>
                <TableCell>{card.bodyCard}</TableCell>
                <TableCell>{card.btnCard}</TableCell>
                <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                 
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => handleOpenUpdateModal(card)}>
                      <Edit color="primary" />
                    </IconButton>
                  </Tooltip>

                 
                  <Tooltip title="Supprimer">
                    <IconButton onClick={() => handleDelete(card._id)}>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>

               
                  <Tooltip title="Gérer Articles">
                    <IconButton component={Link} to={`/admin/articles/${card._id}`}>
                      <ArticleIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}



      <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
  <Table stickyHeader>
    <TableHead>
      <TableRow>
        <TableCell><Typography variant="h6">Titre de la Page</Typography></TableCell> {/* Ajouté */}
        <TableCell><Typography variant="h6">Titre</Typography></TableCell>
        <TableCell><Typography variant="h6">Contenu</Typography></TableCell>
        <TableCell><Typography variant="h6">Texte du bouton</Typography></TableCell>
        <TableCell><Typography variant="h6">Date de création</Typography></TableCell>
        <TableCell><Typography variant="h6">Actions</Typography></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {currentItems.map((card) => (
        <TableRow key={card._id}>
          <TableCell>{card.titlePage}</TableCell> {/* Affichage du titre de la page */}
          <TableCell>{card.titleCard}</TableCell>
          <TableCell>{card.bodyCard}</TableCell>
          <TableCell>{card.btnCard}</TableCell>
          <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
          <TableCell>
            {/* Actions */}
            <Tooltip title="Modifier">
              <IconButton onClick={() => handleOpenUpdateModal(card)}>
                <Edit color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <IconButton onClick={() => handleDelete(card._id)}>
                <Delete color="error" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gérer Articles">
              <IconButton component={Link} to={`/admin/articles/${card._id}`}>
                <ArticleIcon color="primary" />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => paginate('prev')}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => paginate('next')}
          sx={{ ml: 2 }}
          disabled={currentPage === Math.ceil(filteredCards.length / itemsPerPage)}
        >
          Suivant
        </Button>
      </Box>

      {/* Modal de mise à jour */}
      {openUpdateModal && (
        <UpdateNewsCard
          open={openUpdateModal}
          onClose={handleCloseUpdateModal}
          card={cardToEdit} // Passe la carte à modifier au modal
          onUpdateSuccess={fetchSectionCards} // Recharger les cartes après mise à jour
        />
      )}
    </div>
  );
};

export default NewsManagement;
