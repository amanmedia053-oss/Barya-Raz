import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../context/SettingsContext';
import { AppIcon } from '../components/AppIcon';
import { cn } from '../lib/utils';

export function Splash({ onFinish }: { onFinish: () => void }) {
  const { themeColor } = useSettings();

  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 geometric-bg opacity-10" />
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className={cn("w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative overflow-hidden", themeColor.light)}>
          <div className="absolute inset-0 geometric-bg opacity-20" />
          <span className="text-6xl font-bold text-white relative z-10">ن</span>
        </div>
        
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
           <AppIcon name="splash" size={80} className="text-white" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-24 text-center z-10"
      >
        <h1 className="text-3xl font-bold tracking-[0.2em] text-slate-900">NOOR AL-IMARAT</h1>
        <p className="text-slate-500 mt-2 tracking-[0.1em] uppercase text-xs font-medium">Islamic Study Companion</p>
      </motion.div>

      <div className="absolute bottom-16 w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={cn("w-full h-full", themeColor.light)}
        />
      </div>
    </div>
  );
}
