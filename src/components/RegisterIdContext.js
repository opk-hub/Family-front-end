// RegisterIdContext.js

import { createContext, useContext, useState } from 'react';

const RegisterIdContext = createContext();

export const RegisterIdProvider = ({ children }) => {
  const [registerId, setRegisterId] = useState('');

  return (
    <RegisterIdContext.Provider value={{ registerId, setRegisterId }}>
      {children}
    </RegisterIdContext.Provider>
  );
};

export const useRegisterId = () => {
  return useContext(RegisterIdContext);
};
