import React from 'react';
import { useTheme } from './ThemeProvider';

export const GeometricPattern: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <svg 
      className={className} 
      width="100%" 
      height="100%" 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path 
            d="M10 0 L20 10 L10 20 L0 10 Z" 
            fill="none" 
            stroke={theme.primary} 
            strokeWidth="0.5" 
            opacity={isDarkMode ? "0.1" : "0.05"} 
          />
          <circle 
            cx="10" 
            cy="10" 
            r="2" 
            fill="none" 
            stroke={theme.accent} 
            strokeWidth="0.2" 
            opacity={isDarkMode ? "0.1" : "0.05"} 
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#islamic-pattern)" />
    </svg>
  );
};
