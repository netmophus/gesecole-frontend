

import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Button, Box } from '@mui/material';
import axios from 'axios';
import Bulletin from '../../components/Bulletins/Bulletin';
import { AuthContext } from '../../context/AuthContext';
import { Download } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
const apiBaseUrl = process.env.REACT_APP_API_URL;


const BulletinViewPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [bulletin, setBulletin] = useState(null);
  const [student, setStudent] = useState(null);
  const [classStatistics, setClassStatistics] = useState(null);
  const [activeAcademicYear, setActiveAcademicYear] = useState('');
  const [loading, setLoading] = useState(true);
  const bulletinRef = useRef(null);  // Initialize with null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBulletinData = async () => {
      try {
        const bulletinRes = await axios.get(`${apiBaseUrl}/api/bulletins/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setBulletin(bulletinRes.data);

        const studentId = bulletinRes.data.student?._id;
        if (!studentId) {
          throw new Error('ID de l\'étudiant non trouvé.');
        }

        const studentRes = await axios.get(`${apiBaseUrl}/api/students/${studentId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setStudent(studentRes.data);

        const statsRes = await axios.get(`${apiBaseUrl}/api/bulletins/class-statistics`, {
          params: {
            classId: bulletinRes.data.classId._id,
            year: bulletinRes.data.year,
            period: bulletinRes.data.period,
          },
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setClassStatistics(statsRes.data);

        // Fetch active academic year
        const academicYearRes = await axios.get(`${apiBaseUrl}/api/bulletins/academic-year/active`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const { startYear, endYear } = academicYearRes.data;
        setActiveAcademicYear(`${startYear}-${endYear}`);
      } catch (err) {
        console.error('Erreur lors de la récupération des données du bulletin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBulletinData();
  }, [id, user.token]);



const handleDownloadPDF = async () => {
  const input = bulletinRef.current;

  if (!input) {
    console.error('Référence bulletinRef non définie.');
    return;
  }

  // Utiliser l'URL Cloudinary stockée dans la base de données
  const imageUrl = student?.photo;

  // Fonction pour charger l'image de l'élève
  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Assurez-vous que l'image est accessible sans problème CORS
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
    });
  };

  try {
    const imgElement = await loadImage(imageUrl);

    // Capture du bulletin en canvas
    const canvas = await html2canvas(input, { scale: 2 });
    const imgDataBulletin = canvas.toDataURL('image/png');

    // Génération du QR Code avec des informations clés
    const qrData = JSON.stringify({
      bulletinId: bulletin._id,
      nom: `${student.firstName} ${student.lastName}`,
      classe: bulletin.classId.name,
      annee: bulletin.year,
      moyenne: bulletin.semestres[bulletin.period]?.moyenneSemestrielle || 'N/A',
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      width: 150,
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Positionner le QR code en haut à droite
    const qrCodeSize = 20;
    const qrCodeX = pdfWidth - qrCodeSize - 5;
    const qrCodeY = 10;
    pdf.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

    // Positionner l'image de l'élève à gauche en haut
    const studentImgWidth = 20;
    const studentImgHeight = 20;
    const imageX = 10;
    const imageY = 10;
    pdf.addImage(imgElement, 'PNG', imageX, imageY, studentImgWidth, studentImgHeight);

    // Ajouter une ligne de séparation
    pdf.line(10, 50, pdfWidth - 10, 50);

    // Ajouter le bulletin en dessous des éléments en haut
    const bulletinY = 40;
    pdf.addImage(imgDataBulletin, 'PNG', 0, bulletinY, pdfWidth, pdfHeight - bulletinY);

    // Enregistrer le PDF avec un nom descriptif
    const fileName = `${student.firstName}_${student.lastName}_${bulletin.classId.level}_${bulletin.classId.name}_${bulletin.period}_${bulletin.year}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
  }
};


  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Détails du Bulletin {activeAcademicYear} 
      </Typography> 
      {bulletin && student && classStatistics ? (
        <>
       

          <Box ref={bulletinRef}>
           
            <Bulletin student={student} bulletin={bulletin} classStatistics={classStatistics} />
          </Box>
          <Box display="flex" justifyContent="center" mt={2} mb={4}>
            <Button variant="contained" color="primary" onClick={handleDownloadPDF} startIcon={<Download />}>
              Télécharger le PDF
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} sx={{ ml: 2 }}>
              Annuler
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="h6" color="error" align="center">
          Erreur lors du chargement des données du bulletin.
        </Typography>
      )}
    </Container>
  );
};

export default BulletinViewPage;
