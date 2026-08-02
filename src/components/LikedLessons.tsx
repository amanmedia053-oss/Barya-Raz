import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoftCard, SoftButton } from './SoftUI';
import { useTheme } from './ThemeProvider';
import { Heart, Pin, Bookmark, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import defaultStructuredBook from '../assets/structured_book';
import { StructuredBook } from '../types';
import { useLessonInteractions } from '../hooks/useLessonInteractions';

interface LikedLessonsProps {
  onSelectLesson: (lessonId: number, chapterNum: number) => void;
  onBackToHome: () => void;
  activeBook?: StructuredBook | null;
}

export const LikedLessons: React.FC<LikedLessonsProps> = ({
  onSelectLesson,
  onBackToHome,
  activeBook,
}) => {
  const { theme } = useTheme();
  const { likedLessons, toggleLike, togglePin, isPinned } = useLessonInteractions();
  const book: StructuredBook = activeBook || (defaultStructuredBook as unknown as StructuredBook);

  // Extract all lessons from the book that are liked
  const likedLessonsList = React.useMemo(() => {
    if (!book?.chapters) return [];
    const list: { chapterNumber: number; chapterTitle: string; lessonNumber: number; text: string }[] = [];

    book.chapters.forEach((chap) => {
      chap.lessons?.forEach((les) => {
        if (likedLessons.includes(les.lesson_number)) {
          list.push({
            chapterNumber: chap.chapter_number,
            chapterTitle: chap.title,
            lessonNumber: les.lesson_number,
            text: les.text,
          });
        }
      });
    });

    return list;
  }, [book, likedLessons]);

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col gap-5 pb-24">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SoftCard className="p-5 text-right border-r-4 rounded-3xl relative overflow-hidden" style={{ borderRightColor: theme.primary }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl text-white shadow-md" style={{ background: theme.gradient }}>
                <Heart size={24} className="fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-black">خوښ شوي درسونه</h1>
                <p className="text-xs opacity-70 mt-0.5">
                  ټول هغه درسونه چې تاسو خوښ کړي دي ({likedLessonsList.length}):
                </p>
              </div>
            </div>

            <SoftButton
              variant="secondary"
              onClick={onBackToHome}
              className="p-2.5 rounded-full text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowRight size={16} />
              <span>کور پاڼه</span>
            </SoftButton>
          </div>
        </SoftCard>
      </motion.div>

      {/* List of Liked Lessons */}
      {likedLessonsList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 text-center text-gray-500 dark:text-gray-400 rounded-3xl border border-dashed border-black/10 dark:border-white/10 flex flex-col items-center gap-3 my-4"
        >
          <div className="p-4 rounded-full bg-red-500/10 text-red-500">
            <Heart size={36} />
          </div>
          <h3 className="text-base font-bold">هیڅ خوښ شوی درس نشته</h3>
          <p className="text-xs max-w-xs leading-relaxed opacity-80">
            تاسو کولی شئ د کتاب لوستلو په مهال د خپل زړه خوښې درسونو بټنه (خوښول) ووهئ ترڅو دلته درته خوندي شي.
          </p>
          <SoftButton
            onClick={onBackToHome}
            className="mt-2 text-white font-bold text-xs px-5 py-2.5 rounded-2xl"
            style={{ background: theme.gradient }}
          >
            کتاب ته ورشئ
          </SoftButton>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="flex flex-col gap-4"
          >
            {likedLessonsList.map((item) => {
              const pinned = isPinned(item.lessonNumber);

              return (
                <motion.div
                  key={item.lessonNumber}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <SoftCard
                    className={`p-5 rounded-3xl transition-all border group ${
                      pinned
                        ? 'border-amber-500/50 bg-amber-500/5 dark:bg-amber-500/10 shadow-md'
                        : 'border-black/5 dark:border-white/5 hover:shadow-lg'
                    }`}
                  >
                    {/* Lesson Header */}
                    <div className="flex items-center justify-between mb-3 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectLesson(item.lessonNumber, item.chapterNumber)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-white shadow-sm hover:opacity-90 transition-opacity"
                          style={{ background: theme.gradient }}
                        >
                          <Bookmark size={14} />
                          <span>درس {item.lessonNumber}</span>
                        </button>

                        <span className="text-xs opacity-60 font-semibold">
                          فصل {item.chapterNumber}: {item.chapterTitle}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleLike(item.lessonNumber)}
                          className="p-2 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-1 text-xs font-bold"
                          title="له خوښیو لېرې کول"
                        >
                          <Heart size={16} className="fill-red-500" />
                          <span className="hidden sm:inline">لېرې کړه</span>
                        </button>

                        <button
                          onClick={() => togglePin(item.lessonNumber)}
                          className={`p-2 rounded-2xl transition-all flex items-center gap-1 text-xs font-bold ${
                            pinned
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                              : 'bg-black/5 dark:bg-white/10 opacity-60 hover:opacity-100'
                          }`}
                          title={pinned ? 'له پین لېرې کول' : 'پین کول 📌'}
                        >
                          <Pin size={16} className={`rotate-45 ${pinned ? 'fill-current' : ''}`} />
                          <span className="hidden sm:inline">{pinned ? 'پین شو' : 'پین کول'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Lesson Content Text */}
                    <p
                      onClick={() => onSelectLesson(item.lessonNumber, item.chapterNumber)}
                      className="text-base leading-loose text-justify opacity-90 font-medium cursor-pointer hover:opacity-100 transition-opacity"
                    >
                      {item.text}
                    </p>
                  </SoftCard>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
