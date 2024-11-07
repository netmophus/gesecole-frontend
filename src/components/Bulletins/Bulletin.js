

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
    <Paper ref={bulletinRef} elevation={3} sx={{ p: 3, mb:4, mt:3 }}>
      {/* En-tête */}

 {/* Bouton de retour au dashboard */}
 
{/* <Box
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
</Box> */}


<Box
  sx={{
    textAlign: 'center',
    mb: 3,
    p: 2,
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  }}
>
  {/* Nom de l'établissement avec une taille de police élevée */}
  <Typography
    variant="h4"
    component="div"
    sx={{
      color: '#2c3e50',
      fontWeight: 'bold',
      fontSize: '1.8rem',
      mb: 2,
      letterSpacing: '0.05rem',
    }}
  >
    {bulletin.establishmentId?.name || student.establishmentId?.name || "Nom de l'établissement indisponible"}
  </Typography>

  

  {/* Organisation des informations supplémentaires */}
  <Box
    sx={{
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
          fontWeight: 'bold',
        }}
      >
        Adresse :
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
        }}
      >
        {bulletin.establishmentId?.address || student.establishmentId?.address || "Adresse indisponible"}
      </Typography>
    </Box>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
          fontWeight: 'bold',
        }}
      >
        Téléphone :
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
        }}
      >
        {bulletin.establishmentId?.phoneNumber || student.establishmentId?.phoneNumber || "Téléphone indisponible"}
      </Typography>
    </Box>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
          fontWeight: 'bold',
        }}
      >
        Email :
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
        }}
      >
        {bulletin.establishmentId?.contactEmail || student.establishmentId?.contactEmail || "Email indisponible"}
      </Typography>
    </Box>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
          fontWeight: 'bold',
        }}
      >
        Année de création :
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
        }}
      >
        {bulletin.establishmentId?.yearOfCreation || student.establishmentId?.yearOfCreation || "Année de création indisponible"}
      </Typography>
    </Box>

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        paddingBottom: '8px',
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
          fontWeight: 'bold',
        }}
      >
        Type :
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#7f8c8d',
          fontSize: '0.95rem',
        }}
      >
        {bulletin.establishmentId?.type || student.establishmentId?.type || "Type d'établissement indisponible"}
      </Typography>
    </Box>
  </Box>
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
          src={student.photo} // Utilisation directe de l'URL Cloudinary
          alt="Portrait de l'élève"
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
    {/* Résumé des Notes */}
    <Grid item xs={12} md={6}>
      <Card
        sx={{
          p: 2,
          bgcolor: '#e3f2fd',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
      <Typography
        variant="h6"
        sx={{
          fontWeight: '600',
          color: '#0d47a1',
          mb: 2,
          textAlign: 'center',
        }}
      >
        Résumé des Notes
      </Typography>
      <Box sx={{ textAlign: 'center', color: '#0d47a1', mb: 2 }}>
        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
          <strong>Total Notes :</strong> {totalNotes}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
          <strong>Total Coefficients :</strong> {totalCoefficients}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
          <strong>Total Définitif :</strong> {totalDefinitive}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', mt: 2 }}>
          <strong>Moyenne Semestrielle :</strong> {moyenneSemestrielle}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
          <strong>Classement :</strong> {periodRank}<sup>ème</sup>
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', mt: 2 }}>
          <strong>Note de Conduite :</strong> {conductGrade}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
          <strong>Note de Discipline :</strong> {disciplineGrade}
        </Typography>
      </Box>
    </Card>
  </Grid>

  {/* Statistiques de Classe */}
  <Grid item xs={12} md={6}>
    <Card
      sx={{
        p: 2,
        bgcolor: '#f1f8e9',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: '600',
          color: '#33691e',
          mb: 2,
          textAlign: 'center',
        }}
      >
        Statistiques de Classe
      </Typography>
      <Box sx={{ textAlign: 'center', color: '#33691e' }}>
        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
          <strong>Moyenne de la Classe :</strong> {classStatistics.classAverage}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', mt: 1 }}>
          <strong>Plus Forte Moyenne :</strong> {classStatistics.highestAverage}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '1rem', mt: 1 }}>
          <strong>Plus Faible Moyenne :</strong> {classStatistics.lowestAverage}
        </Typography>
      </Box>
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
