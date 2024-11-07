import React, { useState } from 'react';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Paper,
  Box,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const classesData = ['5ème', '4ème', '3ème'];
const subjectsData = ['Mathématiques', 'Physique', 'Français'];
const semestersData = ['Semestre 1', 'Semestre 2'];
const studentsData = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Ali Ndiaye' },
];

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: '#f0f4f8',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(4),
}));

const ReportAnalysisPage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleSelectChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const averageData = studentsData.map((student) => ({
    name: student.name,
    Moyenne: ((student.note1 || 0) + (student.note2 || 0) + (student.composition || 0)) / 3,
  }));

  const radarData = [
    { subject: 'Mathématiques', A: 120, B: 110, fullMark: 150 },
    { subject: 'Physique', A: 98, B: 130, fullMark: 150 },
    { subject: 'Français', A: 86, B: 130, fullMark: 150 },
  ];

  return (
    <StyledContainer>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          color: '#333',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        Analyse des Rapports et Performances
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: 'column', sm: 'row' }}
        mb={2}
      >
        <Select
          value={selectedClass}
          onChange={handleSelectChange(setSelectedClass)}
          displayEmpty
          fullWidth
          style={{ margin: '10px', backgroundColor: '#fff' }}
        >
          <MenuItem value="" disabled>
            Sélectionner une classe
          </MenuItem>
          {classesData.map((classe) => (
            <MenuItem key={classe} value={classe}>
              {classe}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={selectedSubject}
          onChange={handleSelectChange(setSelectedSubject)}
          displayEmpty
          fullWidth
          style={{ margin: '10px', backgroundColor: '#fff' }}
        >
          <MenuItem value="" disabled>
            Sélectionner une matière
          </MenuItem>
          {subjectsData.map((subject) => (
            <MenuItem key={subject} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={selectedSemester}
          onChange={handleSelectChange(setSelectedSemester)}
          displayEmpty
          fullWidth
          style={{ margin: '10px', backgroundColor: '#fff' }}
        >
          <MenuItem value="" disabled>
            Sélectionner un semestre
          </MenuItem>
          {semestersData.map((semester) => (
            <MenuItem key={semester} value={semester}>
              {semester}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px' }}
      >
        Générer le rapport
      </Button>

      <Divider style={{ margin: '20px 0' }} />

      <Typography variant="h6" gutterBottom>
        Moyennes des Élèves
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={averageData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Moyenne" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Comparaison des Performances par Matière
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar name="Classe A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Radar name="Classe B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </StyledContainer>
  );
};

export default ReportAnalysisPage;
