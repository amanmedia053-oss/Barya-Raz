import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { AppIcon, IconType } from '../components/AppIcon';
import { cn } from '../lib/utils';

const SLIDES: { id: number; titleKey: string; descKey: string; icon: IconType; color: string }[] = [
  {
    id: 1,
    titleKey: 'onboarding_1_title',
    descKey: 'onboarding_1_desc',
    icon: 'onboarding1',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    titleKey: 'onboarding_2_title',
    descKey: 'onboarding_2_desc',
    icon: 'onboarding2',
    color: 'bg-emerald-500'
  },
  {
    id: 3,
    titleKey: 'onboarding_3_title',
    descKey: 'onboarding_3_desc',
    icon: 'onboarding3',
    color: 'bg-amber-500'
  }
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { completeOnboarding, isRTL, themeColor } = useSettings();
  const { t } = useTranslation();

  const next = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="absolute inset-0 geometric-bg opacity-10" />
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: isRTL ? -100 : 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? 100 : -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="flex flex-col items-center"
          >
            <div className={cn("w-48 h-48 rounded-[3rem] flex items-center justify-center mb-12 shadow-2xl relative overflow-hidden", SLIDES[currentSlide].color)}>
              <div className="absolute inset-0 geometric-bg opacity-20" />
              <AppIcon name={SLIDES[currentSlide].icon} size={100} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 text-slate-900">
              {t(SLIDES[currentSlide].titleKey)}
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              {t(SLIDES[currentSlide].descKey)}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm flex items-center justify-between mt-12 relative z-10">
        <div className="flex gap-2">
          {SLIDES.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === currentSlide ? cn("w-8", themeColor.light) : "w-2 bg-slate-200"
              )}
            />
          ))}
        </div>

        <button
          onClick={next}
          className={cn(
            "px-8 py-4 rounded-2xl text-white font-bold shadow-lg transition-all active:scale-95",
            themeColor.light
          )}
        >
          {currentSlide === SLIDES.length - 1 ? t('get_started') : 'مخکې'}
        </button>
      </div>
    </div>
  );
}
