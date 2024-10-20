// import React, { useState } from 'react';
// import { TextField, Box } from '@mui/material';

// const AttendanceForm = ({ onChange }) => {
//   const [attendance, setAttendance] = useState({ daysAbsent: '', reasons: '' });

//   const handleChange = (e) => {
//     setAttendance({ ...attendance, [e.target.name]: e.target.value });
//     onChange({ ...attendance, [e.target.name]: e.target.value });
//   };

//   return (
//     <Box component="form" sx={{ mt: 2 }}>
//       <TextField
//         label="Jours d'absence"
//         name="daysAbsent"
//         type="number"
//         value={attendance.daysAbsent}
//         onChange={handleChange}
//         fullWidth
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         label="Raisons"
//         name="reasons"
//         value={attendance.reasons}
//         onChange={handleChange}
//         fullWidth
//         sx={{ mb: 2 }}
//       />
//     </Box>
//   );
// };

// export default AttendanceForm;
