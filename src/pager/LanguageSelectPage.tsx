import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ps', name: 'Pashto', native: 'پښتو' },
  { code: 'fa', name: 'Dari', native: 'دری' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
];

export function LanguageSelectPage() {
  const { setLanguage, themeColor } = useSettings();
  const { i18n } = useTranslation();

  const handleSelect = (code: string) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <div className="fixed inset-0 z-[95] bg-zinc-50 flex flex-col items-center justify-center p-6 islamic-pattern">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border border-zinc-100"
      >
        <div className="text-center mb-8">
          <div className={cn("w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-lg", themeColor.light)}>
            <span className="text-4xl font-bold text-white">ن</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Select Language</h1>
          <p className="text-zinc-500">Choose your preferred language to continue</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {LANGUAGES.map((lang, idx) => (
            <motion.button
              key={lang.code}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(lang.code)}
              className="group flex items-center justify-between p-5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200"
            >
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold text-zinc-900">{lang.native}</span>
                <span className="text-sm text-zinc-500">{lang.name}</span>
              </div>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white", themeColor.light)}>
                <Check size={20} />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { Check } from 'lucide-react';
