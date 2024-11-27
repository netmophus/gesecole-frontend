import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Votre fonction pour rafraîchir le token
const refreshAccessToken = async () => {
  const response = await axios.post('/api/auth/refresh-token', {
    refreshToken: localStorage.getItem('refreshToken'),
  });
  localStorage.setItem('accessToken', response.data.accessToken);
  return response.data.accessToken;
};

// Votre fonction pour vérifier si le token expire bientôt
const isTokenExpiringSoon = (token) => {
  if (!token) return false;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Temps actuel en secondes
  return decodedToken.exp - currentTime < 300; // Moins de 5 minutes avant expiration
};

// Créez une instance Axios avec un intercepteur
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (isTokenExpiringSoon(token)) {
      try {
        const newToken = await refreshAccessToken();
        config.headers['Authorization'] = `Bearer ${newToken}`;
      } catch (err) {
        console.error('Erreur lors du rafraîchissement du token:', err);
        window.location.href = '/login'; // Redirection si rafraîchissement échoue
      }
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
