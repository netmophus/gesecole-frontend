import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import AdminSidebar from '../../components/Administrator/AdminSidebar';
import AdminHeader from '../../components/Administrator/AdminHeader';

const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <AdminHeader />

        {/* Dashboard Content */}
        <Grid container spacing={2} sx={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h6">Total News</Typography>
              <Typography variant="h4">150</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h6">Total Resources</Typography>
              <Typography variant="h4">200</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h6">Ongoing Activities</Typography>
              <Typography variant="h4">10</Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AdminDashboard;
