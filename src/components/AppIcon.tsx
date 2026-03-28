import React from 'react';
import { 
  Home, 
  Bookmark, 
  Settings, 
  Info, 
  Search, 
  Share2, 
  Check, 
  ArrowRight,
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  BookOpen,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export type IconType = 
  | 'home' 
  | 'bookmarks' 
  | 'settings' 
  | 'about' 
  | 'search' 
  | 'share' 
  | 'check' 
  | 'arrow' 
  | 'arrow-left'
  | 'splash'
  | 'onboarding1'
  | 'onboarding2'
  | 'onboarding3'
  | 'dark-mode'
  | 'font'
  | 'language'
  | 'reset';

interface AppIconProps {
  name: IconType;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function AppIcon({ name, size = 24, className = '', strokeWidth = 2 }: AppIconProps) {
  const { isRTL } = useSettings();

  const props = {
    size,
    className,
    strokeWidth
  };

  switch (name) {
    case 'home':
      return <Home {...props} />;
    case 'bookmarks':
      return <Bookmark {...props} />;
    case 'settings':
      return <Settings {...props} />;
    case 'about':
      return <Info {...props} />;
    case 'search':
      return <Search {...props} />;
    case 'share':
      return <Share2 {...props} />;
    case 'check':
      return <Check {...props} />;
    case 'arrow':
      return isRTL ? <ArrowLeft {...props} /> : <ArrowRight {...props} />;
    case 'arrow-left':
      return isRTL ? <ArrowRight {...props} /> : <ArrowLeft {...props} />;
    case 'splash':
      return <Sparkles {...props} />;
    case 'onboarding1':
      return <BookOpen {...props} />;
    case 'onboarding2':
      return <Globe {...props} />;
    case 'onboarding3':
      return <Settings {...props} />;
    case 'dark-mode':
      return <Moon {...props} />;
    case 'font':
      return <BookOpen {...props} />;
    case 'language':
      return <Globe {...props} />;
    case 'reset':
      return <RefreshCw {...props} />;
    default:
      return <Home {...props} />;
  }
}
