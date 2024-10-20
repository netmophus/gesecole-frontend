
// GenerateSchoolCards.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const GenerateSchoolCards = ({ handleClose }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (!user || !user.token) {
          console.error('Utilisateur non connecté.');
          return;
        }

        const res = await axios.get(`${apiBaseUrl}/api/classes`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        setClasses(res.data.classes || []);
      } catch (err) {
        console.error('Erreur lors de la récupération des classes:', err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, [user, apiBaseUrl]);

  const handleClassChange = async (event) => {
    const classId = event.target.value;
    setSelectedClassId(classId);
    setLoading(true);

    try {
      const res = await axios.get(`${apiBaseUrl}/api/students?classId=${classId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des élèves:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCards = async () => {
    // Logique pour générer les cartes scolaires ici
    console.log('Générer les cartes scolaires pour la classe:', selectedClassId);
  };

  return (
    <Card sx={{ padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Générer Cartes Scolaires
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="select-class-label">Sélectionnez une classe</InputLabel>
          <Select
            labelId="select-class-label"
            value={selectedClassId}
            onChange={handleClassChange}
          >
            {classes.map((classe) => (
              <MenuItem key={classe._id} value={classe._id}>
                {classe.name} ({classe.level})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {students.length > 0 ? (
              <Box>
                <Typography variant="body1">
                  {students.length} élèves trouvés
                </Typography>
                {/* Afficher les informations des élèves ici */}
              </Box>
            ) : (
              <Typography variant="body1">Aucun élève trouvé pour cette classe.</Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateCards}
              disabled={!selectedClassId || loading}
            >
              Générer Cartes
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerateSchoolCards;
