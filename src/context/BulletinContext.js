

import React, { createContext, useState } from 'react';

export const BulletinContext = createContext();

export const BulletinProvider = ({ children }) => {
  const [bulletins, setBulletins] = useState([]);

  const saveBulletin = async (formData) => {
    try {
      console.log('FormData à sauvegarder:', formData);
      // Simulez l'ajout d'un bulletin pour la démonstration
      setBulletins([...bulletins, formData]);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du bulletin:', error);
    }
  };

  return (
    <BulletinContext.Provider value={{ bulletins, saveBulletin }}>
      {children}
    </BulletinContext.Provider>
  );
};
