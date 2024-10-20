import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const AdminHeader = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Administration Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
