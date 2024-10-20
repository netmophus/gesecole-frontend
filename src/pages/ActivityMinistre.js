

import React, { useState, useEffect } from 'react';
import {
  Box, Tabs, Tab, Typography, Grid, CardMedia, Container, IconButton, Drawer, Button, Paper
} from '@mui/material';
import ReactPlayer from 'react-player';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ministrePhoto from '../assets/images/ministre-photo.jpg'; // Assurez-vous que le chemin de l'image est correct
import axios from 'axios';
import OngletDrawerContentPage from './OngletDrawerContentPage';

const ActivityMinistre = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [onglets, setOnglets] = useState([]);
  const apiBaseUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchOnglets = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/onglets`);
        setOnglets(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des onglets", error);
      }
    };

    fetchOnglets();
  }, [apiBaseUrl]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDrawerOpen = (ongletId) => {
    setDrawerContent(<OngletDrawerContentPage ongletId={ongletId} onClose={handleDrawerClose} />);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        width: '100%', 
        marginBottom: '60px', 
        padding: '40px', 
        backgroundColor: '#2C3E50', // Dark background for a more modern look
        borderRadius: '16px', 
        marginTop: '40px', 
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        transition: 'transform 0.3s ease', 
        '&:hover': { transform: 'scale(1.02)' }, // Subtle hover effect
      }}
    >
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
        <Paper
          elevation={6}
          sx={{ 
            padding: '10px', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)' 
          }}
        >
          <Box
            component="img"
            src={ministrePhoto}
            alt="Ministre de l'Éducation"
            sx={{ 
              width: 250,
              height: 'auto',
              borderRadius: '12px',
              transition: 'transform 0.4s ease',
              '&:hover': { transform: 'scale(1.05)' }, // Hover animation on image
            }}
          />
        </Paper>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '20px' }}> 
          <Typography variant="h4" sx={{ fontWeight: '900', color: '#ECF0F1' }}>
            Activités Hebdomadaires du Ministre
          </Typography>
          <Typography variant="body1" sx={{ color: '#BDC3C7', marginTop: '10px' }}>
            Dr Elisabeth Sherif - Ministre en charge de l’Éducation Nationale
          </Typography>
        </Box>
      </Box>

      {/* Tab Section */}
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        centered
        sx={{
          marginBottom: '30px',
          '& .MuiTabs-indicator': { backgroundColor: '#1ABC9C' }, 
          '& .MuiTab-root': { 
            color: '#ECF0F1', 
            fontWeight: '800',
            transition: 'color 0.3s ease',
            '&:hover': { color: '#1ABC9C' }, 
          },
        }}
      >
        {onglets.map((onglet) => (
          <Tab key={onglet._id} label={onglet.titleOnglet} />
        ))}
      </Tabs>

      {/* Tab Panels */}
      {onglets.map((onglet, index) => (
        selectedTab === index && (
          <Box key={onglet._id} sx={{ marginTop: '20px', padding: '20px', backgroundColor: '#34495E', borderRadius: '12px', boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#1ABC9C' }}>
              {onglet.titleOnglet}
            </Typography>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ marginBottom: '20px', color: '#BDC3C7' }}>
                  {onglet.bodyOnglet}
                </Typography>
                <IconButton 
                  sx={{ marginTop: '10px', color: '#1ABC9C' }}
                  onClick={() => handleDrawerOpen(onglet._id)} 
                >
                  En savoir plus <ArrowForwardIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12} md={6}>
                {onglet.imgOnglet ? (
                  <CardMedia
                    component="img"
                    height="300"
                    image={`http://localhost:5000/${onglet.imgOnglet}`}
                    alt={onglet.titleOnglet}
                    sx={{ width: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)' }}
                  />
                ) : onglet.videoOnglet ? (
                  <ReactPlayer
                    url={onglet.videoOnglet}
                    width="100%"
                    height="280px"
                    controls
                    style={{ borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ marginTop: '10px', color: '#BDC3C7' }}>
                    Aucun média disponible
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        )
      ))}

      {/* Drawer for "En savoir plus" */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { width: 650, backgroundColor: '#2C3E50', color: '#fff', padding: 2 },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Button onClick={handleDrawerClose} sx={{ alignSelf: 'flex-end', color: '#fff' }}>
            Fermer
          </Button>
          <TabPanel>
            {drawerContent}
          </TabPanel>
        </Box>
      </Drawer>
    </Container>
  );
};

const TabPanel = ({ children }) => (
  <Box sx={{ padding: '20px', backgroundColor: '#2C3E50', borderRadius: '8px', boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)' }}>
    {children}
  </Box>
);

export default ActivityMinistre;
