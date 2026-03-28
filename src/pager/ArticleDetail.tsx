import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Layout } from '../components/Layout';
import { SAMPLE_ARTICLES } from '../data/articles';
import { useBookmarks } from '../context/BookmarkContext';
import { useSettings } from '../context/SettingsContext';
import { Bookmark, Share2, Type, ArrowUp } from 'lucide-react';
import { cn } from '../lib/utils';

export function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { themeColor, font } = useSettings();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const article = SAMPLE_ARTICLES.find(a => a.id === id);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) return <div>Article not found</div>;

  return (
    <Layout 
      showBack 
      title={article.title}
      actions={
        <div className="flex gap-1">
          <button 
            onClick={() => toggleBookmark(article)}
            className={cn(
              "p-2 rounded-full transition-colors",
              isBookmarked(article.id) ? "text-red-500" : "text-zinc-400"
            )}
          >
            <Bookmark size={20} fill={isBookmarked(article.id) ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: article.title, url: window.location.href });
              }
            }}
            className="p-2 rounded-full text-zinc-400"
          >
            <Share2 size={20} />
          </button>
        </div>
      }
    >
      {/* Progress Bar */}
      <motion.div 
        className={cn("fixed top-16 left-0 right-0 h-1 z-50 origin-left", themeColor.light)}
        style={{ scaleX }}
      />

      <article className={cn("flex-1 p-6 sm:p-12 max-w-3xl mx-auto w-full pb-32", font.family)}>
        {/* Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("inline-block px-4 py-1 rounded-full text-sm font-bold text-white mb-6 shadow-lg", themeColor.light)}
          >
            {article.category}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-6 leading-tight"
          >
            {article.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 text-zinc-500 border-b border-zinc-100 pb-8"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold">
              {article.author[0]}
            </div>
            <div>
              <p className="font-bold text-zinc-900">{article.author}</p>
              <p className="text-xs">Published in {article.category}</p>
            </div>
          </motion.div>
        </header>

        {/* Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl mb-12"
        >
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl text-zinc-700 italic mb-12 leading-relaxed border-l-4 border-primary pl-6 py-2"
        >
          {article.introduction}
        </motion.div>

        {/* Sections */}
        <div className="space-y-12">
          {article.sections.map((section, idx) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group"
            >
              <h2 className={cn("text-2xl sm:text-3xl font-bold text-zinc-900 mb-6 flex items-center gap-3")}>
                <span className={cn("w-2 h-8 rounded-full", themeColor.light)} />
                {section.heading}
              </h2>
              <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed text-justify">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Conclusion */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 sm:p-12 rounded-[3rem] bg-zinc-50 border border-zinc-100 text-center"
        >
          <h2 className="text-2xl font-bold mb-6 text-zinc-900">Conclusion</h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            {article.conclusion}
          </p>
        </motion.div>
      </article>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn(
              "fixed bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl z-50 transition-transform active:scale-95",
              themeColor.light
            )}
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
}
