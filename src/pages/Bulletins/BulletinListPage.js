// src/pages/BulletinListPage.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Typography } from '@mui/material';
import BulletinList from '../components/Bulletins/BulletinList';
import { AuthContext } from '../context/AuthContext';

const BulletinListPage = () => {
  const { user } = useContext(AuthContext);
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/bulletins`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBulletins(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Erreur lors de la récupération des bulletins.');
        setLoading(false);
      }
    };

    fetchBulletins();
  }, [user.token, apiBaseUrl]);

  if (loading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography>Erreur: {error}</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Liste des Bulletins</Typography>
      <BulletinList bulletins={bulletins} />
    </Container>
  );
};

export default BulletinListPage;
