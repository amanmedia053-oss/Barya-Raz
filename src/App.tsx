/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Reading } from './components/Reading';
import { LikedLessons } from './components/LikedLessons';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { ExitDialog } from './components/ExitDialog';
import { useTheme } from './components/ThemeProvider';
import { StructuredBook } from './types';

const StatusBarManager = () => {
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    const updateStatusBar = async () => {
      try {
        // Disable overlay to allow setting a solid background color
        await StatusBar.setOverlaysWebView({ overlay: false });
        // Set background color to match theme primary
        await StatusBar.setBackgroundColor({ color: theme.primary });
        // Set style (icons color)
        await StatusBar.setStyle({ style: 'DARK' as any }); 
      } catch (e) {
        console.warn('StatusBar plugin not available');
      }
    };
    updateStatusBar();
  }, [theme, isDarkMode]);

  return null;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'reading' | 'favorites' | 'settings' | 'about'>('home');
  const [selectedSectionId, setSelectedSectionId] = useState<number | undefined>(undefined);
  const [selectedChapterNum, setSelectedChapterNum] = useState<number | undefined>(undefined);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [customBook, setCustomBook] = useState<StructuredBook | null>(() => {
    try {
      const saved = localStorage.getItem('custom_book');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSaveBook = (book: StructuredBook) => {
    setCustomBook(book);
    try {
      localStorage.setItem('custom_book', JSON.stringify(book));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  useEffect(() => {
    // Check if onboarding was already shown
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    // Handle Back Button
    const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (currentScreen !== 'home') {
        setCurrentScreen('home');
        setSelectedSectionId(undefined);
      } else if (selectedSectionId !== undefined) {
        setSelectedSectionId(undefined);
      } else {
        setShowExitDialog(true);
      }
    });

    return () => {
      backListener.then(l => l.remove());
    };
  }, [currentScreen, selectedSectionId]);

  const handleOnboardingFinish = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleRead = (lessonId?: number, chapterNum?: number) => {
    setSelectedSectionId(lessonId);
    setSelectedChapterNum(chapterNum);
    setCurrentScreen('reading');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home 
            onSelectChapter={(chapNum) => handleRead(undefined, chapNum)}
            onSelectLesson={(lesId) => handleRead(lesId)} 
            activeBook={customBook} 
          />
        );
      case 'reading':
        return (
          <Reading 
            selectedId={selectedSectionId} 
            selectedChapterNum={selectedChapterNum}
            onBack={() => {
              setCurrentScreen('home');
              setSelectedChapterNum(undefined);
              setSelectedSectionId(undefined);
            }} 
            activeBook={customBook}
          />
        );
      case 'favorites':
        return (
          <LikedLessons 
            onSelectLesson={(lesId, chapNum) => handleRead(lesId, chapNum)}
            onBackToHome={() => setCurrentScreen('home')}
            activeBook={customBook}
          />
        );
      case 'settings':
        return <Settings />;
      case 'about':
        return <About />;
      default:
        return (
          <Home 
            onSelectChapter={(chapNum) => handleRead(undefined, chapNum)}
            onSelectLesson={(lesId) => handleRead(lesId)} 
            activeBook={customBook} 
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <StatusBarManager />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {showOnboarding && !showSplash && <Onboarding onFinish={handleOnboardingFinish} />}
      
      <Layout 
        currentScreen={currentScreen} 
        onScreenChange={(screen) => {
          setCurrentScreen(screen);
          setSelectedSectionId(undefined);
        }}
      >
        {renderScreen()}
      </Layout>

      <ExitDialog isOpen={showExitDialog} onClose={() => setShowExitDialog(false)} />
    </ThemeProvider>
  );
}
