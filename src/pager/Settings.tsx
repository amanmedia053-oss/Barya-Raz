import React from 'react';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { THEME_COLORS, FONT_OPTIONS } from '../context/SettingsContext';
import { motion } from 'motion/react';
import { AppIcon } from '../components/AppIcon';
import { cn } from '../lib/utils';

export function Settings() {
  const { t } = useTranslation();
  const { 
    themeColor, setThemeColor, 
    font, setFont, 
    resetSettings,
  } = useSettings();

  return (
    <Layout title={t('settings')}>
      <div className="p-6 max-w-2xl mx-auto w-full flex flex-col gap-8 pb-32">
        
        {/* Theme Color Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <AppIcon name="splash" size={24} />
            <h2 className="text-lg font-bold text-slate-900">{t('theme_color')}</h2>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {THEME_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setThemeColor(color)}
                className={cn(
                  "aspect-square rounded-2xl flex items-center justify-center transition-all",
                  color.light,
                  themeColor.name === color.name ? "ring-4 ring-offset-2 ring-primary scale-110" : "hover:scale-105"
                )}
              >
                {themeColor.name === color.name && <AppIcon name="check" size={24} />}
              </button>
            ))}
          </div>
        </section>

        {/* Font Selection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <AppIcon name="home" size={24} />
            <h2 className="text-lg font-bold text-slate-900">{t('font_style')}</h2>
          </div>
          <div className="flex flex-col gap-2">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.name}
                onClick={() => setFont(f)}
                className={cn(
                  "p-5 rounded-2xl border-2 transition-all flex items-center justify-between",
                  font.name === f.name 
                    ? cn("border-primary bg-primary/5", `border-[${themeColor.value}]`)
                    : "border-slate-100 bg-white"
                )}
                style={{ fontFamily: f.value }}
              >
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold">{f.name}</span>
                  <span className="text-xs opacity-50">د افغانستان اسلامي امارت د بریا راز (پښتو متن)</span>
                </div>
                {font.name === f.name && <AppIcon name="check" size={24} />}
              </button>
            ))}
          </div>
        </section>

        {/* Reset Section */}
        <section className="mt-8">
          <button 
            onClick={resetSettings}
            className="w-full p-5 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-3 border border-red-100 hover:bg-red-100 transition-colors"
          >
            <AppIcon name="splash" size={24} />
            {t('reset_default')}
          </button>
        </section>

      </div>
    </Layout>
  );
}
