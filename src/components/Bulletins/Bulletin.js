

// src/components/Bulletins/Bulletin.js
import React, { useRef } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider, Card, CardContent, Grid, TextField } from '@mui/material';
import {  School } from '@mui/icons-material';
//import { useNavigate } from 'react-router-dom';

const Bulletin = ({ student, bulletin, classStatistics }) => {
  const bulletinRef = useRef();
  //const navigate = useNavigate();

  // Récupérer les informations pour le semestre actuel (ou le trimestre)
  const currentPeriodData = bulletin.semestres?.[bulletin.period] || bulletin.trimestres?.[bulletin.period] || {};

  // Extraire les données nécessaires
  const totalNotes = currentPeriodData.totalNotes ?? 0;
  const totalCoefficients = currentPeriodData.totalCoefficients ?? 0;
  const totalDefinitive = currentPeriodData.totalDefinitif ?? 0;
  const moyenneSemestrielle = currentPeriodData.moyenneSemestrielle ?? currentPeriodData.moyenneTrimestrielle ?? 0;
  const periodRank = currentPeriodData.semesterRank ?? currentPeriodData.trimesterRank ?? 0;

  // Extraire les notes de conduite et discipline
  const conductGrade = currentPeriodData.noteConduite ?? bulletin.conductGrade ?? 0;
  const disciplineGrade = currentPeriodData.noteDiscipline ?? bulletin.disciplineGrade ?? 0;

 
  console.log('Données de l\'étudiant:', student);

  console.log('Date de naissance brute:', student.dateOfBirth);
  // Fonction pour formater la date de naissance
const formatDateOfBirth = (date) => {
  if (!date) return 'Date non disponible'; // Vérifie si la date est fournie
  const parsedDate = new Date(date);
  return isNaN(parsedDate) 
    ? 'Date invalide' // Gère le cas où la date n'est pas valide
    : parsedDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
};

// Utilisation
const formattedDateOfBirth = formatDateOfBirth(student.dateOfBirth);


  // Style pour le texte des sections
  const sectionTitleStyle = {
    fontWeight: 'bold',
    marginBottom: '7px',
  };

  return (
    <Paper ref={bulletinRef} elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* En-tête */}

 {/* Bouton de retour au dashboard */}
 
<Box
  sx={{
    textAlign: 'center',
    mb: 3,
    p: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }}
>
  <Typography
    variant="h4"
    component="div"
    sx={{
      color: '#2c3e50',
      fontWeight: 'bold',
      fontSize: '1.8rem',
      mb: 1,
      letterSpacing: '0.05rem',
    }}
  >
    {bulletin.establishmentId?.name || student.establishmentId?.name || "Nom de l'établissement indisponible"}
  </Typography>
  <Typography
    variant="subtitle1"
    sx={{
      color: '#7f8c8d',
      fontSize: '1rem',
      letterSpacing: '0.03rem',
    }}
  >
    {bulletin.establishmentId?.address || student.establishmentId?.address || "Adresse indisponible"}
  </Typography>
</Box>




      <Divider sx={{ my: 1 }} />

      {/* Informations Générales */}
     

 {/* Informations Générales et Élève avec Image */}
 <Grid container spacing={2} sx={{ mb: 2 }}>
       

<Grid item xs={12} md={6}>
  <Card
    variant="outlined"
    sx={{
      bgcolor: '#fafafa',
      p: 1,
      borderRadius: '12px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      minHeight: '60px', // Taille du cadre ajustée
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <CardContent sx={{ p: 0 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: '#2c3e50',
          mb: 2,
          fontSize: '1.2rem',
          textAlign: 'center',
        }}
      >
        Bulletin de Notes
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: '1.2rem',
          color: '#7f8c8d',
          mb: 0,
          textAlign: 'center',
        }}
      >
        Année Scolaire: {bulletin.year}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: '1.2rem',
          color: '#7f8c8d',
          mb: 0,
          textAlign: 'center',
        }}
      >
        Niveau: {bulletin.classId.level} | Classe: {bulletin.classId.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: '1.2rem',
          color: '#7f8c8d',
          textAlign: 'center',
        }}
      >
        Période: {bulletin.period}
      </Typography>
    </CardContent>
  </Card>
</Grid>


        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ bgcolor: '#f5f5f5', p: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Image de l'élève */}
              {student.photo && (
                <img
                  src={`http://localhost:5000/${student.photo.replace(/\\/g, '/')}`}
                  alt="Photo de l'élève"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    marginRight: '15px',
                    objectFit: 'cover',
                  }}
                />
              )}
              <Box>
                <Typography variant="h6" sx={sectionTitleStyle}>
                  Informations sur l'Élève
                </Typography>
                <Typography variant="body2">
                   {student.firstName} {student.lastName}
                </Typography>
                <Typography variant="body2">
                  Matricule: {student.matricule || 'N/A'}
                </Typography>
                {/* <Typography variant="body2">
                  Date de Naissance: {formattedDateOfBirth || 'N/A'}
                </Typography> */}

<Typography variant="body2">
  Date de Naissance: {formattedDateOfBirth}
</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      <Divider sx={{ my: 1 }} />

      {/* Tableau des Matières */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#e0e0e0' }}>
            <TableRow sx={{ height: '30px' }}>
              <TableCell sx={{ p: 1 }}><School /> Matière</TableCell>
              <TableCell sx={{ p: 1 }}>Enseignant</TableCell>
              <TableCell sx={{ p: 1 }}>Note</TableCell>
              <TableCell sx={{ p: 1 }}>Coefficient</TableCell>
              <TableCell sx={{ p: 1 }}>Note Pondérée</TableCell>
              <TableCell sx={{ p: 1 }}>Commentaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bulletin.subjects.map((subject, index) => (
              <TableRow key={index} sx={{ height: '30px' }}>
                <TableCell sx={{ p: 1 }}>{subject.subject.name}</TableCell>
                <TableCell sx={{ p: 1 }}>{subject.teacher.nom}</TableCell>
                <TableCell sx={{ p: 1 }}>{subject.grade}</TableCell>
                <TableCell sx={{ p: 1 }}>{subject.coefficient}</TableCell>
                <TableCell sx={{ p: 1 }}>{(subject.grade * subject.coefficient).toFixed(2)}</TableCell>
                <TableCell sx={{ p: 1 }}>
                  <TextField 
                    placeholder="Commentaires" 
                    variant="outlined" 
                    fullWidth 
                    size="small" 
                    multiline 
                    rows={1} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 1 }} />

      {/* Résumé des Notes et Statistiques de la Classe */}
     
      <Grid container spacing={3} sx={{ mb: 2 }}>
  {/* Résumé des Notes + Conduite & Discipline */}
  <Grid item xs={12} md={6}>
    <Card
      sx={{
        p: 2,
        bgcolor: '#fafafa',
        borderRadius: '13px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        height: '65%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Première moitié - Résumé des Notes */}
      <CardContent
        sx={{
          flex: 1,
          borderRight: '2px solid #b2ebf2',
          paddingRight: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: '600',
            color: '#00796b',
            fontSize: '1rem',
            textTransform: 'uppercase',
            mb: 2,
            textAlign: 'center',
          }}
        >
          Résumé des Notes
        </Typography>

        <Box sx={{ textAlign: 'center', color: '#004d40', mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
            <strong>Total Notes :</strong> {totalNotes}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
            <strong>Total Coefficients :</strong> {totalCoefficients}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
            <strong>Total Définitif :</strong> {totalDefinitive}
          </Typography>
        </Box>
      </CardContent>

      {/* Deuxième moitié - Moyenne + Conduite & Discipline */}
      <CardContent
        sx={{
          flex: 1,
          paddingLeft: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center', color: '#004d40', mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: '800' }}>
            <strong>Moyenne :</strong> {moyenneSemestrielle}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            <strong>Classement :</strong> {periodRank}<sup>ème</sup>
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 2,
            bgcolor: '#fafafa',
            padding: 1,
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#00695c' }}>
            <strong>Conduite :</strong> {conductGrade} | <strong>Discipline :</strong> {disciplineGrade}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>

  {/* Statistiques de Classe */}
  <Grid item xs={12} md={6}>
    <Card
      sx={{
        p: 2,
        bgcolor: '#fafafa',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        height: '65%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Première moitié - Moyennes */}
      <CardContent
        sx={{
          flex: 1,
          borderRight: '1px solid #bbdefb',
          paddingRight: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: '600',
            color: '#1e88e5',
            fontSize: '1rem',
            textTransform: 'uppercase',
            mb: 2,
            textAlign: 'center',
          }}
        >
          Statistiques de Classe
        </Typography>

        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#1565c0', mb: 1 }}>
          <strong>Moyenne de la Classe :</strong> {classStatistics.classAverage}
        </Typography>
      </CardContent>

      {/* Deuxième moitié - Plus Forte et Plus Faible Moyenne */}
      <CardContent
        sx={{
          flex: 1,
          paddingLeft: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#1565c0', mb: 1 }}>
          <strong>Plus Forte Moyenne :</strong> {classStatistics.highestAverage}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', color: '#1565c0' }}>
          <strong>Plus Faible Moyenne :</strong> {classStatistics.lowestAverage}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>











      
      <Box>
        <Card variant="outlined" sx={{ p: 1, mb: 2 }}>
          <Typography variant="body1">Appréciation Générale: {bulletin.generalRemark || ""}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="body1">Signature Enseignant: __________________</Typography>
            <Typography variant="body1">Signature Directeur: __________________</Typography>
            <Typography variant="body1">Signature Parents: __________________</Typography>
          </Box>
        </Card>
      </Box>    
    </Paper>
  );
};

export default Bulletin;
