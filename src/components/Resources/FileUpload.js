import React, { useState } from 'react';
import { Button } from '@mui/material';

const FileUpload = ({ onFileSelect, resourceType }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const fileInputLabel = () => {
    switch (resourceType) {
      case 'Vidéo':
        return 'Choisir un fichier vidéo';
      case 'PDF':
        return 'Choisir un fichier PDF';
      case 'Image':
        return 'Choisir une image';
      default:
        return 'Choisir un fichier';
    }
  };

  return (
    <div>
      <input
        accept={resourceType === 'Vidéo' ? 'video/*' : resourceType === 'PDF' ? 'application/pdf' : 'image/*'}
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span" fullWidth>
          {fileInputLabel()}
        </Button>
      </label>
      {fileName && <p>Fichier sélectionné : {fileName}</p>}
    </div>
  );
};

export default FileUpload;
