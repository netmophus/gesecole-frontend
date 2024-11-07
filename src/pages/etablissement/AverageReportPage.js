// import React, { useState } from 'react';
// import {
//   Container,
//   Typography,
//   Select,
//   MenuItem,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Box,
//   Divider,
// } from '@mui/material';
// import { styled } from '@mui/system';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// const StyledContainer = styled(Container)(({ theme }) => ({
//   padding: theme.spacing(4),
//   backgroundColor: '#f0f4f8',
//   borderRadius: '12px',
//   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
// }));

// const classesData = ['5ème', '4ème', '3ème'];
// const subjectsData = ['Mathématiques', 'Physique', 'Français'];
// const semestersData = ['Semestre 1', 'Semestre 2'];
// const studentsData = [
//   { id: 1, name: 'John Doe', moyenne: 16 },
//   { id: 2, name: 'Jane Smith', moyenne: 15 },
//   { id: 3, name: 'Ali Ndiaye', moyenne: 14 },
// ];

// const AverageReportPage = () => {
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedSemester, setSelectedSemester] = useState('');

//   const handleSelectChange = (setter) => (event) => {
//     setter(event.target.value);
//   };

//   const pieData = studentsData.map((student) => ({
//     name: student.name,
//     value: student.moyenne,
//   }));

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   return (
//     <StyledContainer>
//       <Typography
//         variant="h4"
//         gutterBottom
//         style={{
//           color: '#333',
//           fontWeight: 'bold',
//           textAlign: 'center',
//           marginBottom: '20px',
//         }}
//       >
//         Rapport sur les Moyennes
//       </Typography>

//       <Box
//         display="flex"
//         justifyContent="space-between"
//         flexDirection={{ xs: 'column', sm: 'row' }}
//         mb={2}
//       >
//         <Select
//           value={selectedClass}
//           onChange={handleSelectChange(setSelectedClass)}
//           displayEmpty
//           fullWidth
//           style={{ margin: '10px', backgroundColor: '#fff' }}
//         >
//           <MenuItem value="" disabled>
//             Sélectionner une classe
//           </MenuItem>
//           {classesData.map((classe) => (
//             <MenuItem key={classe} value={classe}>
//               {classe}
//             </MenuItem>
//           ))}
//         </Select>

//         <Select
//           value={selectedSubject}
//           onChange={handleSelectChange(setSelectedSubject)}
//           displayEmpty
//           fullWidth
//           style={{ margin: '10px', backgroundColor: '#fff' }}
//         >
//           <MenuItem value="" disabled>
//             Sélectionner une matière
//           </MenuItem>
//           {subjectsData.map((subject) => (
//             <MenuItem key={subject} value={subject}>
//               {subject}
//             </MenuItem>
//           ))}
//         </Select>

//         <Select
//           value={selectedSemester}
//           onChange={handleSelectChange(setSelectedSemester)}
//           displayEmpty
//           fullWidth
//           style={{ margin: '10px', backgroundColor: '#fff' }}
//         >
//           <MenuItem value="" disabled>
//             Sélectionner un semestre
//           </MenuItem>
//           {semestersData.map((semester) => (
//             <MenuItem key={semester} value={semester}>
//               {semester}
//             </MenuItem>
//           ))}
//         </Select>
//       </Box>

//       <Divider style={{ margin: '20px 0' }} />

//       <Typography variant="h6" gutterBottom>
//         Moyennes des Élèves
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead style={{ backgroundColor: '#1976d2' }}>
//             <TableRow>
//               <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Élève</TableCell>
//               <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>Moyenne</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {studentsData.map((student) => (
//               <TableRow key={student.id}>
//                 <TableCell>{student.name}</TableCell>
//                 <TableCell>{student.moyenne}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
//         Répartition des Moyennes
//       </Typography>
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={pieData}
//             cx="50%"
//             cy="50%"
//             outerRadius={100}
//             label
//             dataKey="value"
//           >
//             {pieData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </StyledContainer>
//   );
// };

// export default AverageReportPage;
