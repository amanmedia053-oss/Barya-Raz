/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { Splash } from './pages/Splash';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { SectionDetail } from './pages/SectionDetail';
import { Bookmarks } from './pages/Bookmarks';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { AnimatePresence } from 'motion/react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { onboardingComplete, themeColor } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Android Back Button and Status Bar
  useEffect(() => {
    // Set Status Bar
    try {
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: '#ffffff' });
    } catch (e) {
      console.warn('StatusBar plugin not available');
    }

    const backButtonListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (location.pathname === '/') {
        // If we're at home, exit the app
        CapApp.exitApp();
      } else {
        // Otherwise, go back in history
        navigate(-1);
      }
    });

    return () => {
      backButtonListener.then(l => l.remove());
    };
  }, [location.pathname, navigate]);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  if (!onboardingComplete) {
    return <Onboarding />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/section/:id" element={<SectionDetail />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <BookmarkProvider>
        <Router>
          <AppContent />
        </Router>
      </BookmarkProvider>
    </SettingsProvider>
  );
}
