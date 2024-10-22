import axios from 'axios';

// Créer une instance d'axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Intercepter toutes les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert('Votre session a expiré, veuillez vous reconnecter.');
      localStorage.removeItem('token'); // Supprimer le token du local storage
      window.location.href = '/login'; // Rediriger l'utilisateur vers la page de connexion
    }
    return Promise.reject(error);
  }
);

export default api;

