import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeProvider';
import { SoftButton, SoftCard } from './SoftUI';
import { Maximize2, Minimize2, ArrowRight, Bookmark, Sparkles, ChevronLeft, ChevronRight, Heart, Pin } from 'lucide-react';
import defaultStructuredBook from '../assets/structured_book.json';
import { StructuredBook } from '../types';
import { useLessonInteractions } from '../hooks/useLessonInteractions';

interface ReadingProps {
  selectedId?: number;
  selectedChapterNum?: number;
  onBack: () => void;
  activeBook?: StructuredBook | null;
}

export const Reading: React.FC<ReadingProps> = ({ 
  selectedId, 
  selectedChapterNum, 
  onBack, 
  activeBook 
}) => {
  const { theme } = useTheme();
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { toggleLike, togglePin, isLiked, isPinned } = useLessonInteractions();

  const book: StructuredBook = activeBook || (defaultStructuredBook as unknown as StructuredBook);

  // Default to clicked chapter or first chapter
  const [activeChapIndex, setActiveChapIndex] = useState<number>(() => {
    if (selectedChapterNum && book.chapters) {
      const idx = book.chapters.findIndex(c => c.chapter_number === selectedChapterNum);
      if (idx !== -1) return idx;
    }
    if (selectedId && book.chapters) {
      const idx = book.chapters.findIndex(c => c.lessons?.some(l => l.lesson_number === selectedId));
      if (idx !== -1) return idx;
    }
    return 0;
  });

  useEffect(() => {
    if (selectedChapterNum && book.chapters) {
      const idx = book.chapters.findIndex(c => c.chapter_number === selectedChapterNum);
      if (idx !== -1) setActiveChapIndex(idx);
    } else if (selectedId && book.chapters) {
      const idx = book.chapters.findIndex(c => c.lessons?.some(l => l.lesson_number === selectedId));
      if (idx !== -1) setActiveChapIndex(idx);
    }
  }, [selectedChapterNum, selectedId, book]);

  if (!book || !book.chapters || book.chapters.length === 0) {
    return (
      <div className="p-8 text-center opacity-50 flex flex-col items-center gap-4">
        <p>هیڅ فصل ونه موندل شو.</p>
        <SoftButton onClick={onBack}>بيرته لاړ شه</SoftButton>
      </div>
    );
  }

  const currentChapter = book.chapters[activeChapIndex] || book.chapters[0];

  return (
    <div className="h-full flex flex-col relative">
      {/* Top Navigation */}
      {!isFocusMode && (
        <div className="p-3 px-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 backdrop-blur-md sticky top-0 z-20">
          <SoftButton variant="secondary" onClick={onBack} className="p-2 rounded-full px-4 text-xs font-bold flex items-center gap-2">
            <ArrowRight size={18} />
            <span>فصلونو ته بیرته</span>
          </SoftButton>

          <div className="flex items-center gap-2">
            <SoftButton variant="secondary" onClick={() => setIsFocusMode(true)} className="p-2 rounded-full">
              <Maximize2 size={18} />
            </SoftButton>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scroll-smooth pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Chapter Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {book.chapters.map((chap, idx) => {
              const isActive = idx === activeChapIndex;
              return (
                <motion.button
                  key={chap.chapter_number}
                  onClick={() => setActiveChapIndex(idx)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                  style={{ background: isActive ? theme.gradient : undefined }}
                >
                  <span>فصل {chap.chapter_number}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeDot"
                      className="w-2 h-2 rounded-full bg-white shadow-sm"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Current Chapter Title Banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.chapter_number}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              <SoftCard className="p-5 border-r-4 rounded-3xl relative overflow-hidden" style={{ borderRightColor: theme.primary }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-black/5 dark:bg-white/10 flex items-center gap-1.5" style={{ color: theme.primary }}>
                    <Sparkles size={14} />
                    <span>{currentChapter.lessons?.length || 0} درسونه</span>
                  </span>
                  <span className="text-xs opacity-50 font-extrabold">فصل {currentChapter.chapter_number}</span>
                </div>
                <h1 className="text-xl font-black leading-tight" style={{ color: theme.primary }}>
                  {currentChapter.title}
                </h1>
              </SoftCard>
            </motion.div>
          </AnimatePresence>

          {/* Lessons List with Staggered Motion */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.chapter_number}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }
                },
                exit: { opacity: 0 }
              }}
              className="space-y-4"
            >
              {currentChapter.lessons && currentChapter.lessons.length > 0 ? (
                [...currentChapter.lessons]
                  .sort((a, b) => {
                    const aPinned = isPinned(a.lesson_number);
                    const bPinned = isPinned(b.lesson_number);
                    if (aPinned && !bPinned) return -1;
                    if (!aPinned && bPinned) return 1;
                    return 0;
                  })
                  .map((les) => {
                  const liked = isLiked(les.lesson_number);
                  const pinned = isPinned(les.lesson_number);

                  return (
                    <motion.div
                      key={les.lesson_number}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <SoftCard className={`p-5 relative rounded-3xl transition-all border group ${
                        pinned 
                          ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10 shadow-md' 
                          : 'border-black/5 dark:border-white/5 hover:shadow-xl'
                      }`}>
                        {/* Lesson Header Badge & Action Icons */}
                        <div className="flex items-center justify-between mb-3 text-xs font-bold">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-white shadow-sm" style={{ background: theme.gradient }}>
                              <Bookmark size={14} />
                              <span>درس {les.lesson_number}</span>
                            </span>

                            {pinned && (
                              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-xl text-xs font-bold">
                                <Pin size={12} className="rotate-45 fill-current" />
                                <span>پین شو</span>
                              </span>
                            )}
                          </div>

                          {/* Action Buttons: Like & Pin */}
                          <div className="flex items-center gap-1.5">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => toggleLike(les.lesson_number)}
                              className={`p-2 rounded-2xl transition-all flex items-center gap-1 text-xs font-bold ${
                                liked
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'bg-black/5 dark:bg-white/10 opacity-60 hover:opacity-100'
                              }`}
                              title={liked ? 'له خوښیو لېرې کول' : 'خوښول'}
                            >
                              <Heart
                                size={16}
                                className={liked ? 'text-red-500 fill-red-500' : ''}
                              />
                              <span className="hidden sm:inline">{liked ? 'خوښ شو' : 'خوښول'}</span>
                            </motion.button>

                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => togglePin(les.lesson_number)}
                              className={`p-2 rounded-2xl transition-all flex items-center gap-1 text-xs font-bold ${
                                pinned
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                  : 'bg-black/5 dark:bg-white/10 opacity-60 hover:opacity-100'
                              }`}
                              title={pinned ? 'له پین لېرې کول' : 'پین کول 📌'}
                            >
                              <Pin
                                size={16}
                                className={`rotate-45 ${pinned ? 'fill-current' : ''}`}
                              />
                              <span className="hidden sm:inline">{pinned ? 'پین شو' : 'پین کول'}</span>
                            </motion.button>
                          </div>
                        </div>

                        {/* Lesson Content Text */}
                        <p className="text-base sm:text-lg leading-loose text-justify opacity-90 font-medium">
                          {les.text}
                        </p>
                      </SoftCard>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-8 text-center opacity-50">په دې فصل کې درسونه شتون نه لري.</div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Chapter Quick Switcher Footer */}
          <div className="flex justify-between items-center pt-4">
            <button
              disabled={activeChapIndex === 0}
              onClick={() => setActiveChapIndex(prev => Math.max(0, prev - 1))}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeChapIndex === 0
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
              }`}
            >
              <ChevronRight size={16} />
              <span>مخکینی فصل</span>
            </button>

            <span className="text-xs font-bold opacity-50">
              فصل {activeChapIndex + 1} له {book.chapters.length} څخه
            </span>

            <button
              disabled={activeChapIndex === book.chapters.length - 1}
              onClick={() => setActiveChapIndex(prev => Math.min(book.chapters.length - 1, prev + 1))}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeChapIndex === book.chapters.length - 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'
              }`}
            >
              <span>بل فصل</span>
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Exit Focus Mode Button */}
      {isFocusMode && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsFocusMode(false)}
          className="fixed bottom-8 left-8 p-4 rounded-full bg-black/20 backdrop-blur-xl text-white z-50 hover:scale-110 transition-all shadow-2xl"
        >
          <Minimize2 size={24} />
        </motion.button>
      )}
    </div>
  );
};
