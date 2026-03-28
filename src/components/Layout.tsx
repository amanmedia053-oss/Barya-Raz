import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppIcon, IconType } from './AppIcon';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  actions?: ReactNode;
}

export function Layout({ children, title, showBack, actions }: LayoutProps) {
  const { isRTL, themeColor, font } = useSettings();
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: { icon: IconType; label: string; path: string }[] = [
    { icon: 'home', label: t('home'), path: '/' },
    { icon: 'bookmarks', label: t('bookmarks'), path: '/bookmarks' },
    { icon: 'settings', label: t('settings'), path: '/settings' },
    { icon: 'about', label: t('about'), path: '/about' },
  ];

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div 
      className={cn("min-h-screen flex flex-col relative overflow-hidden bg-slate-50 text-slate-900")}
      style={{ fontFamily: font.value }}
    >
      {/* Geometric Background Layer */}
      <div className="fixed inset-0 geometric-bg pointer-events-none z-0" />

      {/* AppBar */}
      <header 
        className={cn(
          "sticky top-0 z-40 w-full flex items-center justify-between px-4 transition-colors duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200 safe-area-top h-[calc(4rem+var(--safe-area-top))]"
        )}
      >
        <div className="flex items-center gap-3">
          {showBack ? (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <div className={cn("w-6 h-6 flex items-center justify-center")}>
                 <AppIcon name="arrow-left" size={24} />
              </div>
            </button>
          ) : (
            <button 
              onClick={toggleDrawer}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <div className={cn("h-0.5 w-full rounded-full", themeColor.light)} />
                <div className={cn("h-0.5 w-2/3 rounded-full", themeColor.light)} />
                <div className={cn("h-0.5 w-full rounded-full", themeColor.light)} />
              </div>
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight truncate max-w-[200px]">
            {title || "نور الامارات"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {actions}
        </div>
      </header>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer Content */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.aside
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 bottom-0 z-50 w-72 shadow-2xl flex flex-col bg-white text-zinc-900",
              isRTL ? "right-0" : "left-0"
            )}
          >
            <div className={cn("p-8 flex flex-col gap-4", themeColor.light, "text-white relative overflow-hidden")}>
              <div className="absolute inset-0 geometric-bg opacity-20" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4">
                  <span className="text-3xl font-bold">ن</span>
                </div>
                <h2 className="text-2xl font-bold">نور الامارات</h2>
                <p className="text-sm opacity-80">د اسلامي مطالعې ملګری</p>
              </div>
            </div>

            <nav className="flex-1 py-6 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      toggleDrawer();
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-6 py-4 transition-all duration-200",
                      isActive 
                        ? cn("border-r-4", isRTL ? "border-white" : "border-white", themeColor.light, "text-white")
                        : "hover:bg-black/5"
                    )}
                  >
                    <AppIcon name={item.icon} size={24} />
                    <span className="text-lg font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-8 border-t border-slate-100">
              <p className="text-xs text-center opacity-50">نسخه ۱.۰.۰ • په ایمان سره جوړ شوی</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
