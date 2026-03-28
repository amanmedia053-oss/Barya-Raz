import React from 'react';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { motion } from 'motion/react';
import { AppIcon } from '../components/AppIcon';
import { cn } from '../lib/utils';

export function About() {
  const { t } = useTranslation();
  const { themeColor } = useSettings();

  return (
    <Layout title={t('about')}>
      <div className="p-8 max-w-2xl mx-auto w-full flex flex-col items-center text-center gap-10 pb-32">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn("w-40 h-40 rounded-[3rem] flex items-center justify-center shadow-2xl mt-8 relative overflow-hidden", themeColor.light)}
        >
          <div className="absolute inset-0 geometric-bg opacity-20" />
          <span className="text-7xl font-bold text-white relative z-10">ن</span>
        </motion.div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">نور الامارات</h1>
          <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">د اسلامي مطالعې ملګری</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 leading-relaxed text-slate-600 text-lg relative overflow-hidden">
          <div className="absolute inset-0 geometric-bg opacity-5" />
          <p className="mb-6 relative z-10">
            نور الامارات یو غوره اپلیکیشن دی چې د اسلامي پوهې او تاریخي تحلیل لپاره د لوړ کیفیت لوستلو تجربه چمتو کولو ته وقف شوی.
          </p>
          <p className="relative z-10">
            زموږ ماموریت د دودیز حکمت سره د عصري ټیکنالوژۍ ترکیب دی ، د داسې پلیټ فارم وړاندیز کول چې د لاسرسي وړ ، دودیز او ښکلی وي.
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">موږ سره اړیکه ونیسئ</h3>
          <div className="flex justify-center gap-6">
            {(['home', 'about', 'settings'] as const).map((icon, idx) => (
              <button 
                key={idx}
                className="w-16 h-16 rounded-3xl bg-white shadow-sm border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform"
              >
                <AppIcon name={icon} size={32} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 text-slate-400 text-sm">
          <span>جوړ شوی په</span>
          <div className="w-6 h-6">
             <AppIcon name="splash" size={24} />
          </div>
          <span>د امت لپاره</span>
        </div>
      </div>
    </Layout>
  );
}
