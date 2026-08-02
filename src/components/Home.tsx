import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoftCard } from './SoftUI';
import { useTheme } from './ThemeProvider';
import { ChevronLeft, Layers, BookOpen, Sparkles, Search, X, Pin, Heart } from 'lucide-react';
import defaultStructuredBook from '../assets/structured_book';
import { StructuredBook } from '../types';
import { useLessonInteractions } from '../hooks/useLessonInteractions';

interface HomeProps {
  onSelectChapter: (chapterNum: number) => void;
  onSelectLesson?: (lessonId: number) => void;
  activeBook?: StructuredBook | null;
}

export const Home: React.FC<HomeProps> = ({ onSelectChapter, onSelectLesson, activeBook }) => {
  const { theme, isDarkMode } = useTheme();
  const book: StructuredBook = activeBook || (defaultStructuredBook as unknown as StructuredBook);
  const [searchQuery, setSearchQuery] = useState('');
  const { likedLessons, pinnedLessons, toggleLike, togglePin, isLiked, isPinned } = useLessonInteractions();

  const query = searchQuery.trim().toLowerCase();

  // Filter logic for chapters
  const filteredChapters = useMemo(() => {
    if (!book?.chapters) return [];
    if (!query) return book.chapters;

    return book.chapters.filter((chapter) => {
      const matchChapterTitle = chapter.title.toLowerCase().includes(query);
      const matchLessons = chapter.lessons?.some((les) =>
        les.text.toLowerCase().includes(query) || `درس ${les.lesson_number}`.includes(query)
      );
      return matchChapterTitle || matchLessons;
    });
  }, [book, query]);

  // Extract all lessons from book
  const allLessons = useMemo(() => {
    if (!book?.chapters) return [];
    const lessonsList: { chapterNumber: number; chapterTitle: string; lessonNumber: number; text: string }[] = [];
    book.chapters.forEach((chapter) => {
      chapter.lessons?.forEach((les) => {
        lessonsList.push({
          chapterNumber: chapter.chapter_number,
          chapterTitle: chapter.title,
          lessonNumber: les.lesson_number,
          text: les.text
        });
      });
    });
    return lessonsList;
  }, [book]);

  // Filter pinned & liked lessons
  const pinnedList = useMemo(() => {
    return allLessons.filter(l => pinnedLessons.includes(l.lessonNumber));
  }, [allLessons, pinnedLessons]);

  const likedList = useMemo(() => {
    return allLessons.filter(l => likedLessons.includes(l.lessonNumber));
  }, [allLessons, likedLessons]);

  // Direct matching lessons when searching
  const matchingLessons = useMemo(() => {
    if (!query) return [];
    return allLessons.filter(item => 
      item.text.toLowerCase().includes(query) ||
      `درس ${item.lessonNumber}`.includes(query) ||
      item.chapterTitle.toLowerCase().includes(query)
    );
  }, [allLessons, query]);

  if (!book || !book.chapters) {
    return <div className="p-8 text-center opacity-50">د معلوماتو بارول...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-5 pb-24">
      {/* Book Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SoftCard className="p-5 text-right border-r-4 rounded-3xl" style={{ borderRightColor: theme.primary }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl text-white shadow-sm" style={{ background: theme.gradient }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black">{book.book_info?.title || 'کتاب'}</h1>
              <p className="text-xs opacity-70 mt-0.5">
                کتاب کې ټول {book.chapters.length} فصلونه دي. د لاندې فصلونو پر کارت کلیک وکړئ:
              </p>
            </div>
          </div>
        </SoftCard>
      </motion.div>

      {/* High-Contrast Search Input Bar for Light and Dark Modes */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative"
      >
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute right-4 pointer-events-none z-10"
            style={{ color: isDarkMode ? '#FFFFFF' : '#6B7280' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="په فصلونو او درسونو کې لټون وکړئ..."
            style={{
              backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
              color: isDarkMode ? '#FFFFFF' : '#111827',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : '#E5E7EB',
            }}
            className="w-full py-3.5 pr-11 pl-10 rounded-2xl border font-medium text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                backgroundColor: isDarkMode ? '#333333' : '#E5E7EB',
                color: isDarkMode ? '#FFFFFF' : '#374151',
              }}
              className="absolute left-3 p-1.5 rounded-full hover:opacity-80 transition-all text-xs"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Pinned Lessons Quick Section (If any pinned) */}
      {!query && pinnedList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold flex items-center gap-1.5 opacity-90 text-amber-600 dark:text-amber-400">
              <Pin size={16} className="rotate-45" fill="currentColor" />
              <span>پین شوي درسونه (📌):</span>
            </h2>
            <span className="text-xs font-bold opacity-60">{pinnedList.length} درسونه</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {pinnedList.map((item) => (
              <SoftCard
                key={`pinned-${item.lessonNumber}`}
                className="p-4 rounded-2xl border-l-4 border-amber-500 bg-amber-500/5 dark:bg-amber-500/10 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    onClick={() => onSelectLesson ? onSelectLesson(item.lessonNumber) : onSelectChapter(item.chapterNumber)}
                    className="text-xs font-bold cursor-pointer hover:underline"
                    style={{ color: theme.primary }}
                  >
                    درس {item.lessonNumber} • {item.chapterTitle}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleLike(item.lessonNumber)}
                      className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                      title="خوښول"
                    >
                      <Heart
                        size={16}
                        className={isLiked(item.lessonNumber) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                      />
                    </button>
                    <button
                      onClick={() => togglePin(item.lessonNumber)}
                      className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all text-amber-500"
                      title="له پین لېرې کول"
                    >
                      <Pin size={16} className="rotate-45 fill-amber-500" />
                    </button>
                  </div>
                </div>

                <p
                  onClick={() => onSelectLesson ? onSelectLesson(item.lessonNumber) : onSelectChapter(item.chapterNumber)}
                  className="text-sm opacity-90 line-clamp-2 leading-relaxed font-medium cursor-pointer"
                >
                  {item.text}
                </p>
              </SoftCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chapters List or Search Results */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold flex items-center gap-2 opacity-80">
            <Layers size={18} style={{ color: theme.primary }} />
            <span>{query ? 'د لټون پایلې:' : 'د کتاب فصلونه:'}</span>
          </h2>
          {query && (
            <span className="text-xs font-bold opacity-60">
              {filteredChapters.length} فصلونه موندل شول
            </span>
          )}
        </div>

        {/* Search Results empty state */}
        {query && filteredChapters.length === 0 && matchingLessons.length === 0 && (
          <SoftCard className="p-8 text-center opacity-60 rounded-2xl flex flex-col items-center gap-2">
            <Search size={28} className="opacity-40" />
            <p className="text-sm font-bold">هیڅ فصل یا درس ونه موندل شو</p>
            <p className="text-xs">مهرباني وکړئ د لټون بل کلمه ازموینه کړئ.</p>
          </SoftCard>
        )}

        {/* Display Chapters */}
        <AnimatePresence mode="wait">
          <motion.div
            key={query || 'all-chapters'}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.06 }
              }
            }}
            className="flex flex-col gap-3"
          >
            {filteredChapters.map((chapter) => (
              <motion.div
                key={chapter.chapter_number}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <SoftCard
                  onClick={() => onSelectChapter(chapter.chapter_number)}
                  className="flex items-center justify-between cursor-pointer py-4 px-5 transition-all border-r-4 rounded-2xl group shadow-sm hover:shadow-md"
                  style={{ borderRightColor: theme.primary }}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                      style={{ background: theme.gradient }}
                    >
                      {chapter.chapter_number}
                    </div>
                    <div>
                      <h3 className="font-bold text-base group-hover:opacity-90">{chapter.title}</h3>
                      <p className="text-xs opacity-60 mt-0.5 flex items-center gap-1">
                        <Sparkles size={12} style={{ color: theme.primary }} />
                        <span>{chapter.lessons?.length || 0} درسونه</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold" style={{ color: theme.primary }}>
                    <span>درسونه</span>
                    <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                  </div>
                </SoftCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Matching Lessons detail cards when searching */}
        {query && matchingLessons.length > 0 && (
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
            <h3 className="text-sm font-extrabold opacity-80 flex items-center gap-2">
              <Sparkles size={16} style={{ color: theme.primary }} />
              <span>موندل شوي بېلابېل درسونه ({matchingLessons.length}):</span>
            </h3>

            <div className="flex flex-col gap-2.5">
              {matchingLessons.map((item) => (
                <SoftCard
                  key={`search-${item.chapterNumber}-${item.lessonNumber}`}
                  className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span
                      onClick={() => onSelectLesson ? onSelectLesson(item.lessonNumber) : onSelectChapter(item.chapterNumber)}
                      className="cursor-pointer hover:underline"
                      style={{ color: theme.primary }}
                    >
                      درس {item.lessonNumber} • {item.chapterTitle}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.lessonNumber);
                        }}
                        className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                      >
                        <Heart
                          size={16}
                          className={isLiked(item.lessonNumber) ? 'text-red-500 fill-red-500' : 'opacity-40'}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(item.lessonNumber);
                        }}
                        className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                      >
                        <Pin
                          size={16}
                          className={`rotate-45 ${isPinned(item.lessonNumber) ? 'text-amber-500 fill-amber-500' : 'opacity-40'}`}
                        />
                      </button>
                    </div>
                  </div>

                  <p
                    onClick={() => onSelectLesson ? onSelectLesson(item.lessonNumber) : onSelectChapter(item.chapterNumber)}
                    className="text-sm opacity-90 line-clamp-2 leading-relaxed font-medium cursor-pointer"
                  >
                    {item.text}
                  </p>
                </SoftCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
