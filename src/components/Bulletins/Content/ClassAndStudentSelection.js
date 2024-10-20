

//+++++++++++++++++++++++++++++++++++

import React, { useState, useEffect, useContext } from 'react';
import { TextField, MenuItem, Box } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';

const ClassAndStudentSelection = ({ onChange }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const { user } = useContext(AuthContext);

  const apiBaseUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    if (!user || !user.schoolId) {
      console.error('User or schoolId is not defined');
      return;
    }

    // Fetch classes when component mounts
    const fetchClasses = async () => {
      try {
        const classRes = await axios.get(`${apiBaseUrl}/api/classes`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setClasses(classRes.data.classes);
      } catch (err) {
        console.error('Erreur lors de la récupération des classes:', err);
      }
    };

    fetchClasses();
  }, [user,apiBaseUrl]);

  const handleClassChange = async (e) => {
    const selectedClassId = e.target.value;
    setSelectedClass(selectedClassId);
    onChange('classId', selectedClassId);

    if (!user || !user.schoolId) {
      console.error('User or schoolId is not defined');
      return;
    }

    // Fetch students based on the selected class
    try {
      const studentRes = await axios.get(`${apiBaseUrl}/api/students?classId=${selectedClassId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStudents(studentRes.data.students);
    } catch (err) {
      console.error('Erreur lors de la récupération des élèves:', err);
    }
  };

  const handleStudentChange = (e) => {
    onChange('studentId', e.target.value);
  };

  return (
    <Box>
      <TextField
        select
        label="Classe"
        value={selectedClass}
        onChange={handleClassChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      >
        {classes.map(cls => (
          <MenuItem key={cls._id} value={cls._id}>
            {cls.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Élève"
        onChange={handleStudentChange}
        fullWidth
        required
        sx={{ mb: 2 }}
        disabled={!selectedClass} // Disable if no class is selected
      >
        {students.map(student => (
          <MenuItem key={student._id} value={student._id}>
            {student.firstName} {student.lastName}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default ClassAndStudentSelection;
