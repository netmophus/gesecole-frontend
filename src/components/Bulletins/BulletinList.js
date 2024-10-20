


// src/pages/BulletinListPage.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, CircularProgress, Paper } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import BulletinList from '../../components/Bulletins/BulletinList';

const BulletinListPage = () => {
  const { user } = useContext(AuthContext);
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchBulletins = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/bulletins?establishmentId=${user.schoolId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBulletins(res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des bulletins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBulletins();
  }, [user.schoolId, user.token,apiBaseUrl]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Liste des Bulletins
      </Typography>
      {bulletins.length > 0 ? (
        <BulletinList bulletins={bulletins} />
      ) : (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1" align="center">Aucun bulletin trouvé.</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default BulletinListPage;
