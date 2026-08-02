import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-black">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="w-32 h-32 rounded-[40px] flex items-center justify-center text-white shadow-2xl mb-8"
        style={{ background: theme.gradient }}
      >
        <Shield size={64} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>د بریا راز</h1>
        <p className="text-gray-500 dark:text-gray-400 tracking-widest uppercase text-sm">Pashto Premium Edition</p>
      </motion.div>

      <div className="absolute bottom-12 w-48 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-full w-1/2 rounded-full"
          style={{ background: theme.gradient }}
        />
      </div>
    </div>
  );
};
