
// import React from 'react';
// import { List, ListItem, ListItemText, Divider } from '@mui/material';
// import { Link } from 'react-router-dom';

// const AdminSidebar = () => {
//   return (
//     <div style={{ width: '250px', backgroundColor: '#f5f5f5', height: '100vh' }}>
//       <List component="nav">
//         <ListItem component={Link} to="/admin/dashboard">
//           <ListItemText primary="Dashboard" />
//         </ListItem>
//         <ListItem component={Link} to="/admin/news-management">
//           <ListItemText primary="News Management" />
//         </ListItem>
//         <ListItem component={Link} to="/admin/resources-management">
//           <ListItemText primary="Resources Management" />
//         </ListItem>
//         <ListItem component={Link} to="/admin/admin-tools">
//           <ListItemText primary="Admin Tools" />
//         </ListItem>
//         <ListItem component={Link} to="/admin/activity-management">
//           <ListItemText primary="Activity Management" />
//         </ListItem>
//         {/* Nouveau lien pour gérer les utilisateurs */}
//         <ListItem component={Link} to="/admin/manage-users">
//           <ListItemText primary="Gérer les Utilisateurs" />
//         </ListItem>
//       </List>
//       <Divider />
//     </div>
//   );
// };

// export default AdminSidebar;




import React from 'react';
import { List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div style={{ width: '250px', backgroundColor: '#f5f5f5', height: '100vh' }}>
      <List component="nav">
        <ListItem component={Link} to="/admin/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem component={Link} to="/admin/news-management">
          <ListItemText primary="News Management" />
        </ListItem>
        
        <ListItem component={Link} to="/admin/activity-management">
          <ListItemText primary="Activity Management" />
        </ListItem>
        {/* Nouveau lien pour gérer les utilisateurs */}
        <ListItem component={Link} to="/admin/manage-users">
          <ListItemText primary="Gérer les Utilisateurs" />
        </ListItem>
      </List>
      <Divider />
    </div>
  );
};

export default AdminSidebar;