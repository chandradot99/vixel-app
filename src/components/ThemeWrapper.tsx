'use client';

import { useSettings } from '@/contexts/SettingsContext';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { settings } = useSettings();

  // Get theme-specific body background
  const getBodyBackground = () => {
    const { theme } = settings;
    
    if (theme === 'dark') {
      return 'bg-gray-900 min-h-screen';
    }
    if (theme === 'light') {
      return 'bg-gray-50 min-h-screen';
    }
    // Brutal theme - gradient background
    return 'min-h-screen bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200';
  };

  // Apply accessibility settings
  const getAccessibilityClasses = () => {
    const { reducedMotion, highContrast, fontSize } = settings;
    
    let accessibilityClasses = '';
    
    if (reducedMotion) {
      accessibilityClasses += ' reduced-motion';
    }
    
    if (highContrast) {
      accessibilityClasses += ' high-contrast';
    }
    
    if (fontSize === 'small') {
      accessibilityClasses += ' font-size-small';
    } else if (fontSize === 'large') {
      accessibilityClasses += ' font-size-large';
    } else {
      accessibilityClasses += ' font-size-medium';
    }
    
    return accessibilityClasses;
  };

  // Apply theme class to body for CSS variables
  const getThemeClass = () => {
    const { theme } = settings;
    return `theme-${theme}`;
  };

  return (
    <div 
      className={`
        ${getBodyBackground()}
        ${getThemeClass()}
        ${getAccessibilityClasses()}
      `.trim()}
    >
      {children}
    </div>
  );
}