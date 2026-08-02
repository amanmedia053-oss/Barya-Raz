export type ThemeColor = 
  | 'Royal Blue' 
  | 'Emerald Green' 
  | 'Deep Purple' 
  | 'Gold Accent' 
  | 'Teal' 
  | 'Indigo' 
  | 'Soft Gray' 
  | 'Dark Navy' 
  | 'Sunset Orange' 
  | 'Rose';

export type FontOption = 'Sans';

export interface ThemeConfig {
  name: ThemeColor;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
}

export interface AppState {
  theme: ThemeColor;
  isDarkMode: boolean;
  font: FontOption;
  currentScreen: 'home' | 'reading' | 'parser' | 'settings' | 'about';
}

export interface BookInfo {
  title: string;
  total_chapters?: number;
  total_lessons?: number;
}

export interface Lesson {
  lesson_number: number;
  page?: number;
  text: string;
}

export interface Chapter {
  chapter_number: number;
  title: string;
  start_page?: number;
  lesson_count?: number;
  lessons: Lesson[];
}

export interface StructuredBook {
  id?: string;
  book_info: BookInfo;
  chapters: Chapter[];
}

