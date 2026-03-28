import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';
import { PASHTO_ARTICLE } from '../data/article';
import { useNavigate } from 'react-router-dom';

export function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isRTL, themeColor } = useSettings();
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const items = PASHTO_ARTICLE.sections.slice(0, 5);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-64 overflow-hidden rounded-[2.5rem] shadow-xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn("absolute inset-0 flex flex-col justify-end p-8 text-white", themeColor.light)}
            onClick={() => navigate(`/section/${items[currentIndex].id}`)}
          >
            <div className="absolute inset-0 geometric-bg opacity-10" />
            <div className="relative z-10">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 inline-block"
              >
                برخه {items[currentIndex].id}
              </motion.span>
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-2 leading-tight"
              >
                {items[currentIndex].heading}
              </motion.h3>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/70 text-sm line-clamp-2"
              >
                {items[currentIndex].content}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              idx === currentIndex ? cn("w-8", themeColor.light) : "w-1.5 bg-slate-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}
