'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RegionHelper } from '@/lib/regionHelper';

export type Theme = 'brutal' | 'dark' | 'light';
export type VideoQuality = 'auto' | 'high' | 'medium' | 'low';
export type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

interface SettingsData {
  // Appearance
  theme: Theme;
  region: string;
  language: string;
  
  // Video Preferences
  autoplay: boolean;
  defaultQuality: VideoQuality;
  defaultSpeed: PlaybackSpeed;
  subtitles: boolean;
  
  // Privacy & Data
  saveWatchHistory: boolean;
  personalizedAds: boolean;
  dataUsage: 'unlimited' | 'wifi-only' | 'limited';
  
  // Notifications
  newVideosFromSubscriptions: boolean;
  trendingInYourArea: boolean;
  systemNotifications: boolean;
  
  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface SettingsContextType {
  settings: SettingsData;
  updateSetting: <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

const defaultSettings: SettingsData = {
  theme: 'brutal',
  region: 'US',
  language: 'en',
  autoplay: true,
  defaultQuality: 'auto',
  defaultSpeed: 1,
  subtitles: false,
  saveWatchHistory: true,
  personalizedAds: true,
  dataUsage: 'unlimited',
  newVideosFromSubscriptions: true,
  trendingInYourArea: true,
  systemNotifications: true,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Apply theme to document
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  const loadSettings = async () => {
    try {
      const saved = localStorage.getItem('vixel_settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        
        // Auto-detect region if not set
        if (!parsedSettings.region || parsedSettings.region === 'US') {
          parsedSettings.region = await RegionHelper.getRegionCode();
        }
        
        setSettings({ ...defaultSettings, ...parsedSettings });
      } else {
        // First time - detect region
        const region = await RegionHelper.getRegionCode();
        const initialSettings = { ...defaultSettings, region };
        setSettings(initialSettings);
        saveSettingsToStorage(initialSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettingsToStorage = (settingsToSave: SettingsData) => {
    try {
      localStorage.setItem('vixel_settings', JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
    
    // Special handling for region changes
    if (key === 'region') {
      RegionHelper.setManualRegion(value as string);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    saveSettingsToStorage(defaultSettings);
    RegionHelper.clearCache();
  };

  const exportSettings = (): string => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (settingsJson: string): boolean => {
    try {
      const imported = JSON.parse(settingsJson);
      const newSettings = { ...defaultSettings, ...imported };
      setSettings(newSettings);
      saveSettingsToStorage(newSettings);
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-brutal', 'theme-dark', 'theme-light');
    
    // Add new theme class
    root.classList.add(`theme-${theme}`);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const themeColors = {
      brutal: '#FFFF00',
      dark: '#1a1a1a',
      light: '#ffffff',
    };
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColors[theme]);
    }
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      resetSettings,
      exportSettings,
      importSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
