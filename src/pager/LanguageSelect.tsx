import React from 'react';
import { motion } from 'motion/react';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { AppIcon } from '../components/AppIcon';
import { cn } from '../lib/utils';

const LANGUAGES = [
  { code: 'ps', name: 'پښتو', label: 'Pashto' },
  { code: 'fa', name: 'دری', label: 'Dari' },
  { code: 'ar', name: 'العربية', label: 'Arabic' },
  { code: 'ur', name: 'اردو', label: 'Urdu' },
  { code: 'en', name: 'English', label: 'English' },
];

export function LanguageSelect() {
  const { setLanguage, themeColor } = useSettings();
  const { i18n } = useTranslation();

  const handleSelect = (code: string) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <div className="fixed inset-0 z-[95] bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 geometric-bg opacity-10" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <div className={cn("w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-xl relative overflow-hidden", themeColor.light)}>
            <div className="absolute inset-0 geometric-bg opacity-20" />
            <span className="text-4xl font-bold text-white relative z-10">ن</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Select Language</h1>
          <p className="text-slate-500">Choose your preferred language to continue</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {LANGUAGES.map((lang, idx) => (
            <motion.button
              key={lang.code}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(lang.code)}
              className="group flex items-center justify-between p-6 rounded-3xl bg-white hover:bg-slate-100 transition-all shadow-sm hover:shadow-md border border-slate-100"
            >
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold text-slate-900">{lang.name}</span>
                <span className="text-sm text-slate-500">{lang.label}</span>
              </div>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white", themeColor.light)}>
                <AppIcon name="check" size={24} />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
