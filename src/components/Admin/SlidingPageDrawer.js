// // src/components/SlidingPageDrawer.js

// import React from 'react';
// import { Drawer, IconButton, Box, Typography } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const SlidingPageDrawer = ({ open, onClose, title, children }) => {
//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       sx={{
//         '& .MuiDrawer-paper': {
//           width: '80%', // Ajustez la largeur selon vos besoins
//           padding: '20px',
//         },
//       }}
//     >
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Typography variant="h6">{title}</Typography>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </Box>
//       <Box sx={{ mt: 2 }}>
//         {children}
//       </Box>
//     </Drawer>
//   );
// };

// export default SlidingPageDrawer;
