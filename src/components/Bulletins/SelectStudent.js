
import React, { useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';

const SelectStudent = ({ formData, setFormData, students }) => {
  
  const handleStudentChange = (e) => {
    const selectedStudent = students.find(student => student._id === e.target.value);
    setFormData(prevData => ({
      ...prevData,
      studentId: selectedStudent?._id || '',
      studentPhoto: selectedStudent?.photo || '',
    }));
  };

  // Log pour vérifier le formData et les élèves
  useEffect(() => {
    console.log('formData:', formData);
    console.log('Tous les élèves:', students);
    
    if (formData.classId) {
      console.log('Classe sélectionnée:', formData.classId);
      const filteredStudents = students.filter(student => {
        console.log('Comparaison:', student.classId?._id, formData.classId);
        return student.classId?._id === formData.classId;
      });
      console.log('Élèves filtrés:', filteredStudents);
    }
  }, [formData.classId, students]);


 
  

  // Filtrer les élèves par classe
  //const filteredStudents = students.filter(student => student.classId?._id === formData.classId);
  const filteredStudents = students.filter(student => student.classId?._id === formData.classId);
  
  return (
    <TextField
      select
      label="Élève"
      name="studentId"
      value={formData.studentId || ''}
      onChange={handleStudentChange}
      required
      fullWidth
      sx={{ mb: 2 }}
      disabled={!formData.classId} // Désactiver si aucune classe n'est sélectionnée
    >
      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => (
          <MenuItem key={student._id} value={student._id}>
            {student.firstName} {student.lastName}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>Aucun élève trouvé pour cette classe</MenuItem>
      )}
    </TextField>
  );
};

export default SelectStudent;
