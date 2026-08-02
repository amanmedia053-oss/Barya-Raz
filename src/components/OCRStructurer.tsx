import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SoftCard, SoftButton } from './SoftUI';
import { useTheme } from './ThemeProvider';
import { StructuredBook } from '../types';
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  Copy, 
  Download, 
  Check, 
  AlertCircle, 
  Layers, 
  Save, 
  Code
} from 'lucide-react';

interface OCRStructurerProps {
  onSaveBook: (book: StructuredBook) => void;
  onOpenReader: () => void;
}

const SAMPLE_RAW_OCR = `
د علم او عمل لارښود

### ۱ مخ:
لومړی فصل: د علم ارزښت او فضیلت

۱ درس
علم د انسان د بصیرت نښه ده. بې علمه انسان او ټولنه تل په تیارو کې پاتې کیږي. هر انسان باید د سالم بصیرت له مخې علم ترلاسه کړي.

۲ درس
د علم زده کړه عمل ته لاره هواروي. څوک چې علم لري خو عمل ورباندې نه کوي، د هغې بیلګه د هغې ونې په څیر ده چې ثمره نه ورکوي.

### ۵ مخ:
دوهم فصل: اخلاق او ټولنیز اداب

۳ درس
حسن خلق د ایمان کمال دی. نیک اخلاق او له خلکو سره ښه چلند د موفقیت پیل دی.

۴ درس
صداقت او امانتداري په کار او ژوند کې د انسان اعتماد زیاتوي.
`;

export const OCRStructurer: React.FC<OCRStructurerProps> = ({ onSaveBook, onOpenReader }) => {
  const { theme } = useTheme();
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedBook, setParsedBook] = useState<StructuredBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLoadSample = () => {
    setRawText(SAMPLE_RAW_OCR.trim());
    setError(null);
  };

  // Local fallback parser strictly focusing on Chapters & Lessons
  const parseLocally = (text: string): StructuredBook => {
    const normalizeDigits = (str: string) => {
      return str
        .replace(/[٠۰]/g, '0')
        .replace(/[١۱]/g, '1')
        .replace(/[٢۲]/g, '2')
        .replace(/[٣۳]/g, '3')
        .replace(/[٤۴]/g, '4')
        .replace(/[٥۵]/g, '5')
        .replace(/[٦۶]/g, '6')
        .replace(/[٧۷]/g, '7')
        .replace(/[٨۸]/g, '8')
        .replace(/[٩۹]/g, '9');
    };

    const cleanText = normalizeDigits(text);
    const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
    const title = lines[0] || 'د بېلګې کتاب';

    const pageBlocks = cleanText.split(/###\s*(\d+)\s*مخ:/i);
    let currentPage = 1;

    const chaptersMap: { chapter_number: number; title: string; lessons: { lesson_number: number; page: number; text: string }[] }[] = [];
    let currentChapter: any = null;
    let currentLesson: any = null;
    let totalLessons = 0;

    for (let i = 1; i < pageBlocks.length; i += 2) {
      const pageNum = parseInt(pageBlocks[i], 10) || currentPage;
      currentPage = pageNum;
      const content = pageBlocks[i + 1] || '';

      const contentLines = content.split('\n');
      for (let line of contentLines) {
        line = line.trim();
        if (!line) continue;

        // Detect Chapter
        if (line.includes('فصل') || line.includes('باب')) {
          let chapNum = chaptersMap.length + 1;
          if (line.includes('لومړی')) chapNum = 1;
          else if (line.includes('دوهم')) chapNum = 2;
          else if (line.includes('درېیم')) chapNum = 3;

          currentChapter = {
            chapter_number: chapNum,
            title: line,
            lessons: []
          };
          chaptersMap.push(currentChapter);
          currentLesson = null;
          continue;
        }

        // Detect Lesson
        const lessonMatch = line.match(/^(\d+)\s*درس/);
        if (lessonMatch) {
          totalLessons++;
          const lessonNum = parseInt(lessonMatch[1], 10) || totalLessons;

          if (!currentChapter) {
            currentChapter = {
              chapter_number: 1,
              title: 'لومړی فصل',
              lessons: []
            };
            chaptersMap.push(currentChapter);
          }

          currentLesson = {
            lesson_number: lessonNum,
            page: pageNum,
            text: ''
          };
          currentChapter.lessons.push(currentLesson);
          continue;
        }

        // Append lesson text
        if (currentLesson) {
          currentLesson.text += (currentLesson.text ? ' ' : '') + line;
        }
      }
    }

    if (chaptersMap.length === 0) {
      chaptersMap.push({
        chapter_number: 1,
        title: 'لومړی فصل',
        lessons: [
          {
            lesson_number: 1,
            page: 1,
            text: cleanText.slice(0, 300)
          }
        ]
      });
    }

    return {
      book_info: {
        title,
        total_chapters: chaptersMap.length,
        total_lessons: totalLessons || 1
      },
      chapters: chaptersMap.map((c, idx) => ({
        chapter_number: idx + 1,
        title: c.title,
        lesson_count: c.lessons.length,
        lessons: c.lessons
      }))
    };
  };

  const handleParse = async () => {
    if (!rawText.trim()) {
      setError('مهرباني وکړئ لومړی د OCR سکین شوی متن په بکس کې واچوئ.');
      return;
    }

    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/parse-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setParsedBook(data.data);
      } else {
        const localParsed = parseLocally(rawText);
        setParsedBook(localParsed);
      }
    } catch (err) {
      const localParsed = parseLocally(rawText);
      setParsedBook(localParsed);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!parsedBook) return;
    navigator.clipboard.writeText(JSON.stringify(parsedBook, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!parsedBook) return;
    const blob = new Blob([JSON.stringify(parsedBook, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedBook.book_info.title || 'pashto_book'}_structured.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToApp = () => {
    if (!parsedBook) return;
    onSaveBook(parsedBook);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onOpenReader();
    }, 1200);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto flex flex-col gap-6 pb-24">
      {/* Header */}
      <SoftCard className="relative overflow-hidden text-white" style={{ background: theme.gradient }}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black">د فصلونو او درسونو ترتیب</h2>
            <p className="text-xs opacity-90 mt-1">
              د OCR خام متن یوازې په پاکو فصلونو او درسونو مستقیماً تنظیم کړئ
            </p>
          </div>
        </div>
      </SoftCard>

      {/* Input Box */}
      <SoftCard className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="font-bold flex items-center gap-2 text-sm">
            <FileText size={18} style={{ color: theme.primary }} />
            <span>خام OCR متن:</span>
          </label>
          <button
            onClick={handleLoadSample}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-all flex items-center gap-1.5"
            style={{ color: theme.primary }}
          >
            <Sparkles size={14} />
            <span>د بېلګې متن</span>
          </button>
        </div>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`### ۱ مخ:\nلومړی فصل: د علم ارزښت\n\n۱ درس\nعلم د بصیرت نښه ده...\n\n۲ درس\nصبر او استقامت...`}
          rows={7}
          className="w-full p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 transition-all resize-y"
        />

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <SoftButton
          onClick={handleParse}
          disabled={loading}
          className="w-full py-4 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg"
          style={{ background: theme.gradient }}
        >
          {loading ? (
            <span>پروسس کیږي...</span>
          ) : (
            <>
              <Sparkles size={20} />
              <span>فصلونه او درسونه ترتیب کړه</span>
            </>
          )}
        </SoftButton>
      </SoftCard>

      {/* Results Output */}
      {parsedBook && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2 p-2 rounded-2xl bg-black/5 dark:bg-white/5">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('visual')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'visual'
                      ? 'bg-white dark:bg-gray-800 shadow-md text-black dark:text-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <BookOpen size={16} />
                  <span>فصلونه او درسونه</span>
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === 'json'
                      ? 'bg-white dark:bg-gray-800 shadow-md text-black dark:text-white'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Code size={16} />
                  <span>JSON</span>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyJson}
                  className="p-2 rounded-xl bg-white dark:bg-gray-800 hover:scale-105 transition-all text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  <span>{copied ? 'کاپي شو' : 'کاپي'}</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="p-2 rounded-xl bg-white dark:bg-gray-800 hover:scale-105 transition-all text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Download size={16} />
                  <span>کوزول</span>
                </button>

                <button
                  onClick={handleSaveToApp}
                  className="px-3.5 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:opacity-90"
                  style={{ background: theme.gradient }}
                >
                  {savedSuccess ? <Check size={16} /> : <Save size={16} />}
                  <span>{savedSuccess ? 'ذخیره شو!' : 'کتابتون ته داخلول'}</span>
                </button>
              </div>
            </div>

            {/* Visual View */}
            {activeTab === 'visual' ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-lg" style={{ color: theme.primary }}>
                    {parsedBook.book_info?.title || 'کتاب'}
                  </h3>
                  <span className="text-xs font-bold opacity-60">
                    فصلونه: {parsedBook.chapters?.length}
                  </span>
                </div>

                {parsedBook.chapters?.map((chap) => (
                  <SoftCard key={chap.chapter_number} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center"
                          style={{ background: theme.gradient }}
                        >
                          {chap.chapter_number}
                        </div>
                        <h4 className="font-bold text-base">{chap.title}</h4>
                      </div>
                      <span className="text-xs opacity-60">
                        {chap.lessons?.length || 0} درسونه
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 mt-1">
                      {chap.lessons?.map((les) => (
                        <div
                          key={les.lesson_number}
                          className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-col gap-1 text-sm"
                        >
                          <div className="flex justify-between items-center text-xs opacity-60 font-bold">
                            <span style={{ color: theme.primary }}>درس {les.lesson_number}</span>
                          </div>
                          <p className="leading-relaxed opacity-90">{les.text}</p>
                        </div>
                      ))}
                    </div>
                  </SoftCard>
                ))}
              </div>
            ) : (
              <SoftCard className="p-4 overflow-x-auto">
                <pre className="text-xs font-mono text-green-600 dark:text-green-400 whitespace-pre-wrap leading-relaxed dir-ltr">
                  {JSON.stringify(parsedBook, null, 2)}
                </pre>
              </SoftCard>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
