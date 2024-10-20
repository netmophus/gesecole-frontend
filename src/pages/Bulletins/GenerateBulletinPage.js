// src/pages/GenerateBulletinPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Container } from '@mui/material';
import Bulletin from '../components/Bulletins/Bulletin';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GenerateBulletinPage = () => {
  const { user } = useContext(AuthContext);
  const { studentId } = useParams();  // Suppose que vous avez une route avec le paramètre studentId
  const [student, setStudent] = useState({});
  const [bulletin, setBulletin] = useState({});
  const [classStatistics, setClassStatistics] = useState({});
  const apiBaseUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchBulletinData = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}api/bulletins/student/${studentId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        setStudent(res.data.student);
        setBulletin(res.data.bulletin);
        setClassStatistics(res.data.classStatistics);

      } catch (err) {
        console.error('Erreur lors de la récupération du bulletin:', err);
      }
    };

    fetchBulletinData();
  }, [studentId, user.token, apiBaseUrl]);

  return (
    <Container maxWidth="md">
      <Bulletin student={student} bulletin={bulletin} classStatistics={classStatistics} />
    </Container>
  );
};

export default GenerateBulletinPage;
