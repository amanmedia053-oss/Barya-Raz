import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeColor = {
  name: string;
  value: string;
  light: string;
};

export const THEME_COLORS: ThemeColor[] = [
  { name: 'شین', value: '#3b82f6', light: 'bg-blue-500' },
  { name: 'شین (روښانه)', value: '#10b981', light: 'bg-emerald-500' },
  { name: 'طلایي', value: '#f59e0b', light: 'bg-amber-500' },
  { name: 'چایي', value: '#14b8a6', light: 'bg-teal-500' },
  { name: 'نیلي', value: '#6366f1', light: 'bg-indigo-500' },
  { name: 'ګلابي', value: '#f43f5e', light: 'bg-rose-500' },
  { name: 'زمرد', value: '#059669', light: 'bg-emerald-600' },
  { name: 'بنفش', value: '#8b5cf6', light: 'bg-violet-500' },
  { name: 'اسمانی', value: '#06b6d4', light: 'bg-cyan-500' },
  { name: 'نارنجي', value: '#f97316', light: 'bg-orange-500' },
];

export type FontOption = {
  name: string;
  family: string;
  value: string;
};

export const FONT_OPTIONS: FontOption[] = [
  { name: 'نوټو نسخ (پښتو)', family: 'font-naskh', value: '"Noto Naskh Arabic", serif' },
  { name: 'وزیرمتن (عصري)', family: 'font-vazir', value: '"Vazirmatn", sans-serif' },
  { name: 'امیري (کلاسیک)', family: 'font-amiri', value: '"Amiri", serif' },
  { name: 'نوټو سانس (روښانه)', family: 'font-noto', value: '"Noto Sans Arabic", sans-serif' },
  { name: 'لطیف (نرم)', family: 'font-lateef', value: '"Lateef", cursive' },
  { name: 'ګلزار (نستعلیق)', family: 'font-gulzar', value: '"Gulzar", serif' },
  { name: 'هرمن (پاک)', family: 'font-harmattan', value: '"Harmattan", sans-serif' },
  { name: 'شهرزاد (دودیز)', family: 'font-scheherazade', value: '"Scheherazade New", serif' },
  { name: 'ریم کوفي (هنري)', family: 'font-reem', value: '"Reem Kufi", sans-serif' },
];

interface SettingsContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  font: FontOption;
  setFont: (font: FontOption) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isRTL: boolean;
  onboardingComplete: boolean;
  completeOnboarding: () => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem('themeColor');
    return saved ? JSON.parse(saved) : THEME_COLORS[0];
  });

  const [font, setFont] = useState<FontOption>(() => {
    const saved = localStorage.getItem('font');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it's an old version without 'value', find the matching one in FONT_OPTIONS
        if (!parsed.value) {
          return FONT_OPTIONS.find(f => f.family === parsed.family) || FONT_OPTIONS[0];
        }
        return parsed;
      } catch (e) {
        return FONT_OPTIONS[0];
      }
    }
    return FONT_OPTIONS[0];
  });

  const [language, setLanguage] = useState('ps');

  const [onboardingComplete, setOnboardingComplete] = useState(() => {
    return localStorage.getItem('onboardingComplete') === 'true';
  });

  const isRTL = true; // Pashto is RTL

  useEffect(() => {
    localStorage.setItem('themeColor', JSON.stringify(themeColor));
    document.documentElement.style.setProperty('--app-primary', themeColor.value);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('font', JSON.stringify(font));
    document.documentElement.style.setProperty('--app-font', font.value);
  }, [font]);

  useEffect(() => {
    localStorage.setItem('language', 'ps');
  }, []);

  useEffect(() => {
    localStorage.setItem('onboardingComplete', String(onboardingComplete));
  }, [onboardingComplete]);

  const completeOnboarding = () => setOnboardingComplete(true);

  const resetSettings = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <SettingsContext.Provider
      value={{
        themeColor,
        setThemeColor,
        font,
        setFont,
        language,
        setLanguage,
        isRTL,
        onboardingComplete,
        completeOnboarding,
        resetSettings,
      }}
    >
      <div className={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
