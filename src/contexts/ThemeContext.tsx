import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Check localStorage first
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          setThemeState(storedTheme);
        } else {
          // Default to light mode
          setThemeState('light');
          localStorage.setItem('theme', 'light');
        }
      } catch (error) {
        console.warn('Failed to initialize theme:', error);
        setThemeState('light');
      }
      
      setIsInitialized(true);
    };

    initializeTheme();

    // Note: Removed system theme change listener to keep light mode as default
  }, []);

  // Apply theme to document with optimized smooth transition
  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;
    
    // Start transition animation
    setIsTransitioning(true);
    
    // Add transition class for CSS-based animation (more performant)
    root.classList.add('theme-transitioning');
    
    // Apply theme change immediately with CSS handling the animation
    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Remove transition class after animation completes
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
        setIsTransitioning(false);
      }, 400);
    };

    // Use requestAnimationFrame for optimal timing
    requestAnimationFrame(() => {
      requestAnimationFrame(applyTheme);
    });

    // Store theme preference
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to store theme preference:', error);
    }
  }, [theme, isInitialized]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    // Prevent rapid toggling during transition
    if (isTransitioning) return;
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {/* Optimized blur fade overlay during theme transition */}
      {isTransitioning && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none transition-overlay"
          style={{
            background: 'rgba(128, 128, 128, 0.03)',
            backdropFilter: 'blur(0.5px)',
            animation: 'smoothFadeInOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      )}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};