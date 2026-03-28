import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Carousel } from '../components/Carousel';
import { PASHTO_ARTICLE } from '../data/article';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../components/AppIcon';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function Home() {
  const { t } = useTranslation();
  const { isRTL, themeColor } = useSettings();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const toggleBookmark = (id: number) => {
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id) 
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  return (
    <Layout title={t('home')}>
      <div className="p-6 flex flex-col gap-10 max-w-4xl mx-auto w-full pb-32">
        
        {/* Featured Carousel */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{t('featured')}</h2>
          </div>
          <Carousel />
        </section>

        {/* Introduction Card */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <AppIcon name="splash" size={100} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900">{PASHTO_ARTICLE.title}</h3>
            <p className="text-slate-600 leading-relaxed text-lg italic">
              {PASHTO_ARTICLE.introduction}
            </p>
          </motion.div>
        </section>

        {/* Section List */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-slate-900">{t('read_more')}</h2>
          <div className="grid grid-cols-1 gap-4">
            {PASHTO_ARTICLE.sections.map((section, idx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/section/${section.id}`)}
                className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg", themeColor.light)}>
                    {section.id}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {section.heading}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-1">{section.content}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(section.id);
                  }}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <AppIcon 
                    name="bookmarks" 
                    size={24} 
                    className={bookmarks.includes(section.id) ? "text-primary fill-primary" : "text-slate-400"}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Conclusion Card */}
        <section>
          <div className="bg-slate-100 p-8 rounded-[2.5rem] border border-slate-200 text-center">
            <h3 className="text-xl font-bold mb-4 text-slate-900">پایله</h3>
            <p className="text-slate-600 leading-relaxed">
              {PASHTO_ARTICLE.conclusion}
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
