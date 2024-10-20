
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error, warning, info
  
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const apiBaseUrl = process.env.REACT_APP_API_URL;



  useEffect(() => {    
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${apiBaseUrl}/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
    
          const data = await res.json();
    
          if (res.ok) {
            setUser({
              ...data,
              token,
            });
            console.log('Utilisateur restauré avec le token:', { ...data, token });
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Erreur serveur lors de la récupération du profil utilisateur', err);
          localStorage.removeItem('token');
        }
      }
    }; 
    
    
    loadUser();
  }, [navigate, apiBaseUrl]);



const login = async (formData) => {
  try {
    console.log('Tentative de connexion avec les données:', formData);
  
    const { identifier, password } = formData;
  
    const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });
  
    const data = await res.json();
    console.log('Server Response:', data);
  
    if (res.ok) {
      localStorage.setItem('schoolId', data.schoolId);
      localStorage.setItem('token', data.token);
  
      setUser({
        token: data.token,
        role: data.role,
        schoolId: data.schoolId,
        schoolName: data.schoolName,
        isConfigured: data.isConfigured,
        academicYear: data.academicYear,
      });
  
      console.log('Connexion réussie, token reçu:', data.token);
  
      // Gestion des rôles avec des messages de succès et d'erreur
      switch (data.role) {
        case 'Eleve':
          navigate('/eleve/DashboardPage', { replace: true });
          setSnackbarMessage('Connexion réussie, bienvenue Élève');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          break;
        case 'Etablissement':
          if (data.isConfigured && data.schoolId) {
            navigate('/etablissement/DashboardPage', { replace: true });
          } else {
            navigate('/etablissement/configuration', { replace: true });
          }
          setSnackbarMessage('Connexion réussie, bienvenue Établissement');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          break;
        case 'Admin':
          navigate('/ministere/DashboardPage', { replace: true });
          setSnackbarMessage('Connexion réussie, bienvenue Admin');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          break;
        case 'Parent':
          console.log('Connexion parent réussie');
          navigate('/parent/DashboardPage', { replace: true });
          setSnackbarMessage('Connexion réussie, bienvenue Parent');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          break;
        default:
          console.error('Rôle inconnu ou non autorisé');
          setSnackbarMessage('Rôle inconnu ou non autorisé');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          navigate('/login', { replace: true });
          break;
      }
  
      return { success: true, message: 'Connexion réussie' };
    } else {
      console.error('Erreur lors de la connexion:', data.msg);
      setSnackbarMessage(data.msg || 'Erreur lors de la connexion');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return { success: false, message: data.msg || 'Erreur lors de la connexion' };
    }
  } catch (err) {
    console.error('Erreur serveur lors de la connexion:', err.message);
    setSnackbarMessage('Erreur serveur. Veuillez réessayer plus tard.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return { success: false, message: 'Erreur serveur. Veuillez réessayer plus tard.' };
  }
};


  
  const register = async (formData) => {
    try {
      console.log('Données envoyées pour l\'inscription:', formData);

      const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Réponse du serveur:', data);

      if (res.ok) {
        setUser({
          token: data.token,
          role: data.role,
          schoolId: data.schoolId,
          schoolName: data.schoolName,
        });
        setSnackbarMessage('Utilisateur créé avec succès');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        navigate('/login', { replace: true });
      } else {
        console.error('Erreur lors de l\'inscription', data);
        setSnackbarMessage(data.msg || 'Erreur lors de l\'inscription');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Erreur serveur lors de l\'inscription', err);
      setSnackbarMessage('Erreur serveur. Veuillez réessayer plus tard.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
   

<AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>

  );
};
