import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
export const isTokenExpiringSoon = (token) => {
  if (!token) return false;

  const decoded = jwtDecode(token);
  const expirationTime = decoded.exp * 1000; // Convertir en millisecondes
  const currentTime = Date.now();

  return expirationTime - currentTime < 5 * 60 * 1000; // Moins de 5 minutes
};




export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error("Aucun token de rafraîchissement disponible.");

  const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/refresh-token`, {
    token: refreshToken,
  });

  const { accessToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  return accessToken;
};
