// FamilyIdContext.js
import React, { createContext, useContext, useState } from 'react';

const FamilyIdContext = createContext();

export const useFamilyId = () => {
  return useContext(FamilyIdContext);
};

export const FamilyIdProvider = ({ children }) => {
  const [familyId, setFamilyId] = useState('');

  return (
    <FamilyIdContext.Provider value={{ familyId, setFamilyId }}>
      {children}
    </FamilyIdContext.Provider>
  );
};
