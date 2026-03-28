import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PASHTO_ARTICLE } from '../data/article';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { AppIcon } from '../components/AppIcon';
import { cn } from '../lib/utils';
import { motion, useScroll, useSpring } from 'motion/react';

export function SectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { themeColor, font, isRTL } = useSettings();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const section = PASHTO_ARTICLE.sections.find(s => s.id === Number(id));

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved && section) {
      const bookmarks = JSON.parse(saved);
      setIsBookmarked(bookmarks.includes(section.id));
    }
  }, [section]);

  const toggleBookmark = () => {
    if (!section) return;
    const saved = localStorage.getItem('bookmarks');
    let bookmarks = saved ? JSON.parse(saved) : [];
    if (isBookmarked) {
      bookmarks = bookmarks.filter((b: number) => b !== section.id);
    } else {
      bookmarks.push(section.id);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  if (!section) return null;

  const highlightedContent = searchQuery 
    ? section.content.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
        part.toLowerCase() === searchQuery.toLowerCase() 
          ? <span key={i} className={cn("bg-yellow-200 rounded px-1", `text-[${themeColor.value}]`)}>{part}</span> 
          : part
      )
    : section.content;

  return (
    <Layout 
      showBack 
      title={`برخه ${section.id}`}
      actions={
        <div className="flex gap-1">
          <button 
            onClick={toggleBookmark}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <AppIcon 
              name="bookmarks" 
              size={24} 
              className={isBookmarked ? "text-primary fill-primary" : "text-slate-400"}
            />
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: section.heading, text: section.content, url: window.location.href });
              }
            }}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <AppIcon name="share" size={24} />
          </button>
        </div>
      }
    >
      {/* Scroll Progress Indicator */}
      <motion.div 
        className={cn("fixed top-16 left-0 right-0 h-1 z-50 origin-left", themeColor.light)}
        style={{ scaleX }}
      />

      <div className="p-6 sm:p-12 max-w-3xl mx-auto w-full flex flex-col gap-8 pb-32">
        
        {/* Search inside text */}
        <div className="relative group">
          <div className={cn("absolute top-1/2 -translate-y-1/2 text-slate-400", isRTL ? "right-4" : "left-4")}>
             <AppIcon name="search" size={20} />
          </div>
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-primary transition-all text-sm",
              isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
            )}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-4">
            <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center text-2xl font-bold text-white shadow-xl relative overflow-hidden", themeColor.light)}>
              <div className="absolute inset-0 geometric-bg opacity-20" />
              {section.id}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              {section.heading}
            </h2>
          </div>

          <div 
            className="text-xl sm:text-2xl leading-relaxed text-slate-700 text-justify"
            style={{ fontFamily: font.value }}
          >
            {highlightedContent}
          </div>
        </motion.div>

        {/* Navigation between sections */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
          <button 
            disabled={section.id === 1}
            onClick={() => navigate(`/section/${section.id - 1}`)}
            className="flex items-center gap-2 text-slate-500 disabled:opacity-30"
          >
            <div className={cn("w-6 h-6")}>
               <AppIcon name="arrow-left" size={24} />
            </div>
            <span>شاته</span>
          </button>
          <button 
            disabled={section.id === 10}
            onClick={() => navigate(`/section/${section.id + 1}`)}
            className="flex items-center gap-2 text-slate-500 disabled:opacity-30"
          >
            <span>مخکې</span>
            <div className={cn("w-6 h-6")}>
               <AppIcon name="arrow" size={24} />
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
}
