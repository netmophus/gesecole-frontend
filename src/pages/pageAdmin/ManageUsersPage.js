
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiBaseUrl}/api/auth/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          console.error('Erreur lors de la récupération des utilisateurs:', res.statusText);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
      }
    };

    fetchUsers();
  }, [apiBaseUrl]);

  const handleEditUser = (userId) => {
    navigate(`/admin/edit-user/${userId}`);  // Redirection vers la page d'édition d'utilisateur
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteUser(userId);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setUsers(users.filter(user => user._id !== userId));
        alert('Utilisateur supprimé avec succès.');
      } else {
        console.error('Erreur lors de la suppression de l\'utilisateur:', res.statusText);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gérer les Utilisateurs
      </Typography>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2">{user.email}</Typography>
                <Typography variant="body2">{user.role}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => handleEditUser(user._id)}>
                  Modifier
                </Button>
                <Button variant="outlined" color="secondary" sx={{ mt: 1, ml: 1 }} onClick={() => handleDeleteUser(user._id)}>
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageUsersPage;
