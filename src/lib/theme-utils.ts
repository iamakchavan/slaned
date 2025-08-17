// Theme-aware utility functions

export const themeColors = {
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      muted: '#9ca3af',
    },
    border: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
    },
  },
  dark: {
    background: {
      primary: '#161618',
      secondary: '#1c1c1e',
      tertiary: '#2c2c2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1a6',
      muted: '#6d6d70',
    },
    border: {
      primary: '#3a3a3c',
      secondary: '#48484a',
    },
  },
} as const;

export type Theme = 'light' | 'dark';
export type ColorCategory = keyof typeof themeColors.light;
export type ColorVariant<T extends ColorCategory> = keyof typeof themeColors.light[T];

// Get theme-aware class names
export const getThemeClasses = (theme: Theme) => ({
  // Background classes
  bgPrimary: theme === 'dark' ? 'bg-[#161618]' : 'bg-white',
  bgSecondary: theme === 'dark' ? 'bg-[#1c1c1e]' : 'bg-gray-50',
  bgTertiary: theme === 'dark' ? 'bg-[#2c2c2e]' : 'bg-gray-100',
  
  // Text classes
  textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
  textSecondary: theme === 'dark' ? 'text-[#a1a1a6]' : 'text-gray-600',
  textMuted: theme === 'dark' ? 'text-[#6d6d70]' : 'text-gray-400',
  
  // Border classes
  borderPrimary: theme === 'dark' ? 'border-[#3a3a3c]' : 'border-gray-200',
  borderSecondary: theme === 'dark' ? 'border-[#48484a]' : 'border-gray-300',
  
  // Hover states
  hoverBg: theme === 'dark' ? 'hover:bg-[#2c2c2e]' : 'hover:bg-gray-50',
  hoverBgSecondary: theme === 'dark' ? 'hover:bg-[#3a3a3c]' : 'hover:bg-gray-100',
});

// Generate responsive theme classes
export const generateThemeClasses = () => {
  const baseClasses = {
    // Background utilities
    'bg-theme-primary': 'bg-white dark:bg-[#161618]',
    'bg-theme-secondary': 'bg-gray-50 dark:bg-[#1c1c1e]',
    'bg-theme-tertiary': 'bg-gray-100 dark:bg-[#2c2c2e]',
    
    // Text utilities
    'text-theme-primary': 'text-gray-900 dark:text-white',
    'text-theme-secondary': 'text-gray-600 dark:text-[#a1a1a6]',
    'text-theme-muted': 'text-gray-400 dark:text-[#6d6d70]',
    
    // Border utilities
    'border-theme-primary': 'border-gray-200 dark:border-[#3a3a3c]',
    'border-theme-secondary': 'border-gray-300 dark:border-[#48484a]',
    
    // Hover utilities
    'hover-theme-bg': 'hover:bg-gray-50 dark:hover:bg-[#2c2c2e]',
    'hover-theme-bg-secondary': 'hover:bg-gray-100 dark:hover:bg-[#3a3a3c]',
  };
  
  return baseClasses;
};

// Priority badge colors that work in both themes
export const getPriorityColors = (priority: 'high' | 'medium' | 'low', theme: Theme) => {
  const colors = {
    high: {
      light: 'bg-red-50 text-red-600 border-red-100',
      dark: 'bg-red-900/20 text-red-400 border-red-800/30',
    },
    medium: {
      light: 'bg-amber-50 text-amber-600 border-amber-100',
      dark: 'bg-amber-900/20 text-amber-400 border-amber-800/30',
    },
    low: {
      light: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      dark: 'bg-emerald-900/20 text-emerald-400 border-emerald-800/30',
    },
  };
  
  return colors[priority][theme];
};

// Smooth transition classes
export const transitionClasses = 'transition-colors duration-300 ease-in-out';