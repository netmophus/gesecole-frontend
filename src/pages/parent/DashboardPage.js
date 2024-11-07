import { useState, useContext, useEffect } from 'react';
import { 
  Tabs, Tab, Box, Typography, Paper, TextField, 
  Button, FormControl, InputLabel, Select, MenuItem, 
  CircularProgress, Alert, Modal, Backdrop, Fade, Dialog, 
  DialogActions, DialogContent, DialogContentText, DialogTitle 
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Bulletin from '../../components/Bulletins/Bulletin';
import axios from 'axios';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [bulletin, setBulletin] = useState(null);
  const [classStatistics, setClassStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState('');
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/academic-years`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAcademicYears(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des années académiques:', err);
      }
    };
    if (user) fetchAcademicYears();
  }, [user, apiBaseUrl]);


  
  const fetchClassStatistics = async (classId, year, period) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/bulletins/class-statistics`, {
        params: { classId, year, period },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setClassStatistics(response.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      setClassStatistics(null);
    }
  };


  const fetchBulletinByPhone = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/bulletins/parent-phone/${phone}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { academicYear: selectedAcademicYear, period: selectedSemester },
        }
      );
      setBulletin(response.data);
      fetchClassStatistics(response.data.classId._id, response.data.year, selectedSemester);
      setStudentInfo(response.data.student);
      setOpenDialog(true); // Ouvre le dialog avant d'afficher le bulletin
    } catch (err) {
      console.error('Erreur lors de la récupération du bulletin:', err);
      setError('Aucun bulletin trouvé pour les critères fournis.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (phone && selectedAcademicYear && selectedSemester) {
      fetchBulletinByPhone();
    } else {
      setError('Veuillez remplir tous les champs avant de rechercher.');
    }
  };

  const handleViewBulletin = () => {
    setOpenDialog(false);
    setOpenModal(true); // Ouvre le modal après confirmation
  };




  return (
    <Box sx={{ width: '100%', p: 3 }}>
   {/* Titre de bienvenue */}
   {/* <Typography 
    variant="h3" 
    sx={{ 
      fontWeight: 'bold', 
      mb: 2, 
      color: '#2e7d32', 
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' 
    }}
  >
    Bienvenue, {user?.name} {user?.lastName} !
  </Typography> */}

  {/* Carte d'accueil */}
  {/* <Paper 
    elevation={5} 
    sx={{ 
      p: 4, 
      borderRadius: '15px', 
      background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', 
      mb: 5, 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
      '&:hover': { transform: 'scale(1.02)' } 
    }}
  >
    <Typography variant="h5" sx={{ mb: 2, color: '#388e3c', fontWeight: 'medium' }}>
      Cher parent,
    </Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      Nous sommes ravis de vous accueillir ! Voici ce que vous pouvez faire ici :
    </Typography>

    <Box sx={{ textAlign: 'left', ml: 4, mt: 2 }}>
      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <i className="fas fa-book" style={{ marginRight: '10px', color: '#2e7d32' }}></i>
        <strong>Consulter le bulletin</strong> de votre enfant dans l'onglet <em>Bulletin</em>.
      </Typography>
      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <i className="fas fa-chart-bar" style={{ marginRight: '10px', color: '#1e88e5' }}></i>
        <strong>Rechercher les notes</strong> par téléphone, semestre et évaluation dans <em>Note</em>.
      </Typography>
      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <i className="fas fa-envelope" style={{ marginRight: '10px', color: '#d32f2f' }}></i>
        <strong>Lire des messages importants</strong> dans <em>Message au Parent</em>.
      </Typography>
    </Box>

    <Typography variant="body2" sx={{ mt: 3, color: '#4caf50' }}>
      Sélectionnez l’onglet approprié pour commencer.
    </Typography>
  </Paper> */}

<Paper
  elevation={6}
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row-reverse' },
    p: 6,
    borderRadius: '25px',
    backgroundColor: '#F4F6F8',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    mb: 6,
    '&:hover': {
      transform: 'scale(1.03)',
      transition: 'all 0.5s ease',
    },
  }}
>
  {/* Right side with the image */}
  <Box
    component="img"
    src="/images/images.jpg"
    alt="Family Together"
    sx={{
      width: { xs: '100%', md: '50%' },
      borderRadius: '20px',
      boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.15)',
    }}
  />

  {/* Left side content */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: { md: 4 },
      paddingTop: { xs: 4, md: 0 },
      textAlign: { xs: 'center', md: 'left' },
    }}
  >
    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#37474F', mb: 3 }}>
       Bienvenue, {user?.name}
    </Typography>

    <Typography
      variant="body1"
      sx={{ fontSize: '1.2rem', color: '#607D8B', mb: 3, letterSpacing: '0.5px' }}
    >
      Nous sommes ravis de vous voir ici. Voici ce que vous pouvez faire dès maintenant :
    </Typography>

    <Box sx={{ textAlign: 'left', ml: { xs: 0, md: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            backgroundColor: '#FF7043',
            borderRadius: '50%',
            p: 1.5,
            mr: 2,
            color: '#FFF',
            fontSize: '1.5rem',
          }}
        >
          <i className="fas fa-book"></i>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Consulter le bulletin de votre enfant
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            backgroundColor: '#42A5F5',
            borderRadius: '50%',
            p: 1.5,
            mr: 2,
            color: '#FFF',
            fontSize: '1.5rem',
          }}
        >
          <i className="fas fa-chart-bar"></i>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Rechercher les notes et évaluations
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            backgroundColor: '#EF5350',
            borderRadius: '50%',
            p: 1.5,
            mr: 2,
            color: '#FFF',
            fontSize: '1.5rem',
          }}
        >
          <i className="fas fa-envelope"></i>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
          Lire les messages importants
        </Typography>
      </Box>
    </Box>

   
  </Box>
</Paper>




      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        centered 
        textColor="primary" 
        indicatorColor="primary"
      >
      <Tab
  label="Bulletin"
  sx={{
    background: '#004d40',
    color: '#fff', // Initial color set to white
    borderRadius: '12px',
    mx: 1,
    px: 15,
    py: 1.5,
    mb: 2,
    fontSize: '20px',
    fontWeight: 'bold',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
    fontFamily: 'Montserrat, sans-serif', 
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: '#333',
      color: '#fff', // Keep white on hover
    },
    '&:focus': {
      color: '#fff', // Ensure text stays white on focus
    },
    '&:active': {
      color: '#fff', // Ensure text stays white on active state
      backgroundColor: '#004d40',
    },
    '&:visited': {
      color: '#fff', // Ensure text stays white if visited (for links)
    },
  }}
  
/>
        <Tab label="Notes"  sx={{
  background: '#004d40',
  color: '#fff', // Initial color set to white
  borderRadius: '12px',
  mx: 1,
  px: 15,
  py: 1.5,
  mb: 2,
  fontSize: '20px',
  fontWeight: 'bold',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  fontFamily: 'Montserrat, sans-serif', 
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: '#333',
    color: '#fff', // Keep white on hover
  },
  '&:focus': {
    color: '#fff', // Ensure text stays white on focus
  },
  '&:active': {
    color: '#fff', // Ensure text stays white on active state
    backgroundColor: '#004d40',
  },
  '&:visited': {
    color: '#fff', // Ensure text stays white if visited (for links)
  },
}}
  />
        <Tab label="Conduite" sx={{
  background: '#004d40',
  color: '#fff', // Initial color set to white
  borderRadius: '12px',
  mx: 1,
  px: 15,
  py: 1.5,
  mb: 2,
  fontSize: '20px',
  fontWeight: 'bold',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  fontFamily: 'Montserrat, sans-serif', 
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: '#333',
    color: '#fff', // Keep white on hover
  },
  '&:focus': {
    color: '#fff', // Ensure text stays white on focus
  },
  '&:active': {
    color: '#fff', // Ensure text stays white on active state
    backgroundColor: '#004d40',
  },
  '&:visited': {
    color: '#fff', // Ensure text stays white if visited (for links)
  },
}}
 />



      

      
      </Tabs>

      <TabPanel value={activeTab} index={0} bgcolor="#333333">
        <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Numéro de téléphone"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Année Académique</InputLabel>
              <Select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
              >
                {academicYears.map((year) => (
                  <MenuItem key={year._id} value={year._id}>
                    {year.startYear} - {year.endYear}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Semestre</InputLabel>
              <Select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <MenuItem value="Semestre 1">Semestre 1</MenuItem>
                <MenuItem value="Semestre 2">Semestre 2</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#004d40', color: '#ffffff', '&:hover': { backgroundColor: '#00332d' } }}>
              Rechercher le Bulletin
            </Button>
          </form>
        </Paper>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="20vh">
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </TabPanel>


      <TabPanel value={activeTab} index={1} bgcolor="#333333">
  <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField
        label="Numéro de téléphone"
        variant="outlined"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Année Académique</InputLabel>
        <Select value="2023-2024" disabled>
          <MenuItem value="2023-2024">2023 - 2024</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Semestre</InputLabel>
        <Select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <MenuItem value="Semestre 1">Semestre 1</MenuItem>
          <MenuItem value="Semestre 2">Semestre 2</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type d'Évaluation</InputLabel>
        <Select
          value={selectedEvaluation}
          onChange={(e) => setSelectedEvaluation(e.target.value)}
        >
          <MenuItem value="Devoir 1">Devoir 1</MenuItem>
          <MenuItem value="Devoir 2">Devoir 2</MenuItem>
          <MenuItem value="Composition">Composition</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#004d40', color: '#ffffff', '&:hover': { backgroundColor: '#00332d' } }}>
        Rechercher les Notes
      </Button>
    </form>
  </Paper>

  <Box sx={{ mt: 2 , color: '#ffffff' }}>
    <Typography variant="h6" gutterBottom>
      Statistiques de la Classe (Données Simulées)
    </Typography>
    <Typography><strong>Nombre d'élèves :</strong> 30</Typography>
    <Typography><strong>Moyenne générale :</strong> 12.5 / 20</Typography>
    <Typography><strong>Taux de réussite :</strong> 85%</Typography>
    <Typography><strong>Nombre de mentions :</strong> 10 (Bien), 5 (Très Bien)</Typography>
  </Box>
      </TabPanel>


      <TabPanel value={activeTab} index={2} bgcolor="#ffebee">
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="30vh"
        >
          <Typography variant="h5" color="textSecondary">
            À venir
          </Typography>
        </Box>
      </TabPanel>





  


      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmation du Bulletin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Nom:</strong> {studentInfo?.firstName} {studentInfo?.lastName} <br />
            <strong>Matricule:</strong> {studentInfo?.matricule} <br />
            <strong>Classe:</strong> {bulletin?.classId?.name} <br />
            <strong>Date de Naissance:</strong> {new Date(studentInfo?.dateOfBirth).toLocaleDateString('fr-FR')} <br />
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            Si cet enfant est bien le vôtre, vous pouvez cliquer sur le bouton ci-dessous pour afficher son bulletin.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleViewBulletin} variant="contained" color="primary">
            Voir le Bulletin
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                maxHeight: '90vh',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
              }}
            >
              {bulletin ? (
                <Bulletin
                  student={bulletin.student}
                  bulletin={bulletin}
                  classStatistics={classStatistics}
                />
              ) : (
                <Typography variant="h6" color="error">
                  Bulletin introuvable.
                </Typography>
              )}
            </Box>
          </Fade>
        </Modal>

       

    </Box>
  );
};

const TabPanel = ({ children, value, index, bgcolor }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Paper sx={{ bgcolor, p: 3 }}>{children}</Paper>}
  </div>
);

export default ParentDashboard;
