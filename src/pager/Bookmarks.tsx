import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { PASHTO_ARTICLE } from '../data/article';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../components/AppIcon';
import { cn } from '../lib/utils';

export function Bookmarks() {
  const { t } = useTranslation();
  const { isRTL, themeColor } = useSettings();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const removeBookmark = (id: number) => {
    const newBookmarks = bookmarks.filter(b => b !== id);
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  const bookmarkedSections = PASHTO_ARTICLE.sections.filter(s => bookmarks.includes(s.id));

  return (
    <Layout title={t('bookmarks')}>
      <div className="p-6 max-w-2xl mx-auto w-full flex flex-col gap-6 pb-32">
        <AnimatePresence mode="popLayout">
          {bookmarkedSections.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-32 h-32 mb-6 flex items-center justify-center">
                <AppIcon name="bookmarks" size={128} className="text-slate-200" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('no_bookmarks')}</h2>
              <p className="text-slate-500">هغه برخې چې تاسو یې خوندي کوئ دلته به ښکاره شي</p>
            </motion.div>
          ) : (
            bookmarkedSections.map((section, idx) => (
              <motion.div
                key={section.id}
                layout
                initial={{ x: isRTL ? 20 : -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isRTL ? -20 : 20, opacity: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate(`/section/${section.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg", themeColor.light)}>
                    {section.id}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-bold text-slate-900 truncate max-w-[200px]">
                      {section.heading}
                    </h4>
                    <p className="text-xs text-slate-500">برخه {section.id}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBookmark(section.id);
                  }}
                  className="p-3 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                >
                  <AppIcon name="bookmarks" size={24} className="fill-current" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
