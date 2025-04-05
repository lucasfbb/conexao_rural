import React, { createContext, useContext, useState } from 'react';

interface SettingsContextProps {
  isNightMode: boolean;
  setNightMode: (value: boolean) => void;
  allowNotifications: boolean;
  setAllowNotifications: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNightMode, setNightMode] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);

  return (
    <SettingsContext.Provider value={{ isNightMode, setNightMode, allowNotifications, setAllowNotifications }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings precisa estar dentro de SettingsProvider');
  return context;
};
