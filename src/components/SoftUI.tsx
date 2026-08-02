import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useTheme } from './ThemeProvider';

interface SoftCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const SoftCard: React.FC<SoftCardProps> = ({ children, className, onClick, hover = true }) => {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl transition-all duration-300",
        isDarkMode 
          ? "bg-[#121212] soft-shadow-dark border border-white/5" 
          : "bg-[#F5F5F5] soft-shadow border border-white/50",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

interface SoftButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'inset';
}

export const SoftButton: React.FC<SoftButtonProps> = ({ children, onClick, className, variant = 'primary' }) => {
  const { theme, isDarkMode } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.gradient,
          color: 'white',
          boxShadow: isDarkMode 
            ? '0 4px 12px rgba(0,0,0,0.5)' 
            : '0 4px 12px rgba(0,0,0,0.1)'
        };
      case 'secondary':
        return isDarkMode 
          ? { backgroundColor: '#1E1E1E', color: '#EAEAEA' }
          : { backgroundColor: '#FFFFFF', color: '#1A1A1A' };
      case 'inset':
        return isDarkMode
          ? { backgroundColor: '#121212', boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.4), inset -2px -2px 6px rgba(255,255,255,0.05)' }
          : { backgroundColor: '#F5F5F5', boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.05), inset -4px -4px 8px rgba(255,255,255,0.8)' };
      default:
        return {};
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={getVariantStyles()}
      className={cn(
        "px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
        variant !== 'primary' && (isDarkMode ? "soft-shadow-dark" : "soft-shadow"),
        className
      )}
    >
      {children}
    </motion.button>
  );
};
