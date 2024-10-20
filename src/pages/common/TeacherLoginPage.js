import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherLogin = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_URL;


  const handleTeacherLogin = async () => {
    try {
      console.log('Tentative de connexion de l\'enseignant avec le téléphone:', phone); // Log de la tentative de connexion
      
      const response = await axios.post(`${apiBaseUrl}/api/teacher-login`, { phone, password });
      
      console.log('Réponse du serveur:', response.data); // Log de la réponse du serveur
      
      if (response.data.establishments && response.data.establishments.length > 1) {
        // Si l'enseignant est associé à plusieurs établissements, afficher une sélection
        console.log('L\'enseignant est associé à plusieurs établissements:', response.data.establishments);
        // Gérer la sélection des établissements ici
      } else {
        // Si un seul établissement, connecter directement
        localStorage.setItem('token', response.data.token); // Stocker le token dans le localStorage
        console.log('Connexion réussie, redirection vers le tableau de bord');
        navigate('/teacher/dashboard'); // Rediriger l'enseignant
      }
    } catch (error) {
      if (error.response) {
        // Log détaillé de l'erreur avec le message du serveur
        console.error('Erreur lors de la connexion de l\'enseignant:', error.response.data.msg);
      } else {
        // Log en cas de problème réseau ou autre
        console.error('Erreur lors de la connexion de l\'enseignant:', error.message);
      }
    }
  };

  return (
    <div>
      <h2>Connexion Enseignant</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleTeacherLogin(); }}>
        <input 
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Numéro de téléphone"
        />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default TeacherLogin;
