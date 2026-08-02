import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeColor, FontOption, ThemeConfig } from '../types';
import { LUXURY_THEMES } from '../constants';

interface ThemeContextType {
  theme: ThemeConfig;
  isDarkMode: boolean;
  font: FontOption;
  setTheme: (name: ThemeColor) => void;
  toggleDarkMode: () => void;
  setFont: (font: FontOption) => void;
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeColor>('Royal Blue');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = LUXURY_THEMES.find(t => t.name === themeName) || LUXURY_THEMES[0];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F5F5F5';
    }
  }, [isDarkMode]);

  const resetToDefault = () => {
    setThemeName('Royal Blue');
    setIsDarkMode(false);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode, 
      font: 'Sans', 
      setTheme: setThemeName, 
      toggleDarkMode: () => setIsDarkMode(!isDarkMode),
      setFont: () => {},
      resetToDefault
    }}>
      <div className={isDarkMode ? 'dark' : ''} style={{ 
        fontFamily: 'var(--font-sans)',
        color: isDarkMode ? '#EAEAEA' : '#1A1A1A'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
