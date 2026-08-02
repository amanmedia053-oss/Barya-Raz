import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeProvider';
import { LUXURY_THEMES } from '../constants';
import { SoftCard, SoftButton } from './SoftUI';
import { Check, RotateCcw, Palette, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { theme, isDarkMode, setTheme, toggleDarkMode, resetToDefault } = useTheme();

  return (
    <div className="p-4 space-y-8 pb-24">
      <h2 className="text-2xl font-bold px-2" style={{ color: theme.primary }}>تنظیمات</h2>

      {/* Theme Selection */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-2 opacity-60">
          <Palette size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">د رنګ انتخاب</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {LUXURY_THEMES.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(t.name)}
              className={cn(
                "relative p-4 rounded-[24px] cursor-pointer transition-all duration-300 overflow-hidden",
                theme.name === t.name 
                  ? "ring-4 ring-offset-4 dark:ring-offset-black shadow-xl" 
                  : "bg-white dark:bg-white/5 shadow-md hover:shadow-lg"
              )}
              style={{ 
                ringColor: t.primary,
                border: theme.name === t.name ? `2px solid ${t.primary}` : '2px solid transparent'
              }}
            >
              {/* Theme Preview Circle */}
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div 
                  className="w-12 h-12 rounded-2xl shadow-inner flex items-center justify-center text-white" 
                  style={{ background: t.gradient }}
                >
                  {theme.name === t.name && <Check size={24} />}
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  theme.name === t.name ? "text-black dark:text-white" : "text-gray-500"
                )}>{t.name}</span>
              </div>

              {/* Decorative background element */}
              <div 
                className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-10"
                style={{ background: t.gradient }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dark Mode */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-2 opacity-60">
          <Moon size={18} />
          <h3 className="text-sm font-bold uppercase tracking-wider">بڼه او لیکدود</h3>
        </div>
        
        <SoftCard className="p-6 rounded-[28px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-2xl text-white"
                style={{ background: isDarkMode ? 'linear-gradient(135deg, #4F46E5, #06B6D4)' : 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
              >
                {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div>
                <span className="font-bold text-lg">توره بڼه</span>
                <p className="text-xs opacity-50">د سترګو د هوساینې لپاره</p>
              </div>
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className={cn(
                "w-16 h-9 rounded-full transition-all duration-500 relative p-1",
                isDarkMode ? "bg-indigo-600" : "bg-gray-200"
              )}
            >
              <motion.div 
                animate={{ 
                  x: isDarkMode ? 28 : 0,
                  rotate: isDarkMode ? 360 : 0
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600"
              >
                {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
              </motion.div>
            </button>
          </div>
        </SoftCard>
      </section>

      {/* Reset */}
      <SoftButton 
        variant="secondary" 
        onClick={resetToDefault}
        className="w-full py-4 text-red-500"
      >
        <RotateCcw size={18} />
        <span>بیا تنظیمول (Reset)</span>
      </SoftButton>
    </div>
  );
};
