import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Check system preference first
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Then check user preference
    const savedTheme = localStorage.getItem('vigilynx-theme');
    
    // If user has saved preference, use that, otherwise use system preference
    const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }

    // Listen for system preference changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newMode = e.matches;
      // Only change if user hasn't set a preference
      if (localStorage.getItem('vigilynx-theme') === null) {
        setIsDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
      }
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vigilynx-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vigilynx-theme', 'light');
    }
    setIsDarkMode(newMode);
  };

  return { isDarkMode, toggleTheme };
}
