import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { SoftButton } from './SoftUI';
import { App as CapApp } from '@capacitor/app';

interface ExitDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExitDialog: React.FC<ExitDialogProps> = ({ isOpen, onClose }) => {
  const { theme, isDarkMode } = useTheme();

  const handleExit = () => {
    CapApp.exitApp();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full max-w-sm p-8 rounded-[32px] shadow-2xl overflow-hidden ${
              isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-white text-black'
            }`}
          >
            {/* Decorative background circle */}
            <div 
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-10"
              style={{ background: theme.gradient }}
            />

            <div className="flex flex-col items-center text-center space-y-6">
              <div 
                className="w-20 h-20 rounded-[24px] flex items-center justify-center text-white shadow-lg"
                style={{ background: theme.gradient }}
              >
                <LogOut size={40} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">ایا غواړئ بهر شئ؟</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  تاسو ډاډه یاست چې غواړئ له اپلیکیشن څخه بهر شئ؟
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <SoftButton 
                  onClick={onClose}
                  variant="secondary"
                  className="py-4 rounded-2xl font-bold"
                >
                  <X size={20} />
                  <span>نه</span>
                </SoftButton>
                
                <SoftButton 
                  onClick={handleExit}
                  className="py-4 rounded-2xl font-bold text-white"
                  style={{ background: theme.gradient }}
                >
                  <LogOut size={20} />
                  <span>هو، وځم</span>
                </SoftButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
