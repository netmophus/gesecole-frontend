

import React from 'react';
import { Box, Typography } from '@mui/material';

const Summary = ({ totalNotes, totalCoefficients, totalDefinitive, moyenneTrimestrielle }) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Résumé</Typography>
            <Typography>Total des Notes : {totalNotes}</Typography>
            <Typography>Total des Coefficients : {totalCoefficients}</Typography>
            <Typography>Total Définitif : {totalDefinitive}</Typography>
            <Typography>Moyenne Trimestrielle : {moyenneTrimestrielle}</Typography>
        </Box>
    );
};

export default Summary;

