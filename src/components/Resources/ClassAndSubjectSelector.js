import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';

const ClassAndSubjectSelector = ({ selectedClass, selectedSubject, onSelectClass, onSelectSubject }) => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  // Récupérer les classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/pedagogical-resources/classes`);
        setClasses(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des classes:', err);
        setLoading(false);
      }
    };

    fetchClasses();
  }, [apiBaseUrl]);

  // Récupérer les matières
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/pedagogical-resources/subjects`);
        setSubjects(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des matières:', err);
      }
    };

    fetchSubjects();
  }, [apiBaseUrl]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel>Classe</InputLabel>
        <Select
          value={selectedClass}
          onChange={(e) => onSelectClass(e.target.value)}
          required
        >
          {classes.map((classe) => (
            <MenuItem key={classe._id} value={classe._id}>
              {classe.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Matière</InputLabel>
        <Select
          value={selectedSubject}
          onChange={(e) => onSelectSubject(e.target.value)}
          required
        >
          {subjects.map((subject) => (
            <MenuItem key={subject._id} value={subject._id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default ClassAndSubjectSelector;
