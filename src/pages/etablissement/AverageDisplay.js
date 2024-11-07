import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    Alert,
    Divider,
} from '@mui/material';

const AverageDisplay = ({ studentId, subjectId, semester }) => {
    const [average, setAverage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAverage = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/devoircompo/average/${studentId}/${subjectId}/${semester}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                setAverage(response.data.average);
            } catch (err) {
                setError('Erreur lors du calcul de la moyenne.');
                console.error('Erreur lors de la récupération de la moyenne:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAverage();
    }, [studentId, subjectId, semester]);

    return (
        <Card sx={{ maxWidth: 400, margin: '20px auto', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Moyenne de la matière
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '100px' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <Box textAlign="center">
                        {average !== null ? (
                            <>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#004d40' }}>
                                    La moyenne de l'élève est :
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#00796b', marginTop: '10px' }}>
                                    {average.toFixed(2)}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body1" sx={{ color: '#757575' }}>
                                Aucune note disponible pour calculer la moyenne.
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default AverageDisplay;
