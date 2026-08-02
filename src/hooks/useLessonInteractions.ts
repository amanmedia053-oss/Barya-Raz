import { useState, useEffect } from 'react';

export function useLessonInteractions() {
  const [likedLessons, setLikedLessons] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('app_liked_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pinnedLessons, setPinnedLessons] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('app_pinned_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_liked_lessons', JSON.stringify(likedLessons));
    } catch (e) {
      console.error(e);
    }
  }, [likedLessons]);

  useEffect(() => {
    try {
      localStorage.setItem('app_pinned_lessons', JSON.stringify(pinnedLessons));
    } catch (e) {
      console.error(e);
    }
  }, [pinnedLessons]);

  const toggleLike = (lessonNumber: number) => {
    setLikedLessons((prev) =>
      prev.includes(lessonNumber) ? prev.filter((id) => id !== lessonNumber) : [...prev, lessonNumber]
    );
  };

  const togglePin = (lessonNumber: number) => {
    setPinnedLessons((prev) =>
      prev.includes(lessonNumber) ? prev.filter((id) => id !== lessonNumber) : [...prev, lessonNumber]
    );
  };

  return {
    likedLessons,
    pinnedLessons,
    toggleLike,
    togglePin,
    isLiked: (lessonNumber: number) => likedLessons.includes(lessonNumber),
    isPinned: (lessonNumber: number) => pinnedLessons.includes(lessonNumber),
  };
    }
