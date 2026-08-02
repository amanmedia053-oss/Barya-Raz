import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeProvider';
import { Shield, BookOpen, Settings, ArrowLeft } from 'lucide-react';
import { SoftButton } from './SoftUI';

const SLIDES = [
  {
    title: "ښه راغلاست",
    description: "د بریا راز اپلیکیشن ته ښه راغلاست. دلته به تاسو د افغانستان د تاریخي بریاوو په اړه ولولئ.",
    icon: <Shield size={80} />,
    color: "#3B82F6"
  },
  {
    title: "مطالعه او زده کړه",
    description: "زموږ هدف د معنوي او مادي ارزښتونو په اړه د ولس پوهاوی او د تاریخي حقایقو بیانول دي.",
    icon: <BookOpen size={80} />,
    color: "#10B981"
  },
  {
    title: "خپلې خوښې تنظیمات",
    description: "تاسو کولی شئ د اپلیکیشن رنګونه، ډارک موډ او نور تنظیمات په خپله خوښه بدل کړئ.",
    icon: <Settings size={80} />,
    color: "#8B5CF6"
  }
];

export const Onboarding: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-white dark:bg-black flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            <div 
              className="w-48 h-48 rounded-[60px] flex items-center justify-center text-white mb-12 shadow-2xl rotate-3"
              style={{ background: `linear-gradient(135deg, ${SLIDES[currentSlide].color}, ${theme.primary})` }}
            >
              {SLIDES[currentSlide].icon}
            </div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>
              {SLIDES[currentSlide].title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <div 
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8' : 'w-2 bg-gray-200 dark:bg-gray-800'}`}
              style={{ backgroundColor: i === currentSlide ? theme.primary : undefined }}
            />
          ))}
        </div>

        <SoftButton 
          onClick={handleNext}
          className="w-full py-5 text-xl font-bold rounded-[24px]"
          style={{ background: theme.gradient, color: 'white' }}
        >
          <span>{currentSlide === SLIDES.length - 1 ? 'پیل کړئ' : 'بل'}</span>
          <ArrowLeft size={24} className="mr-2" />
        </SoftButton>
      </div>
    </div>
  );
};
