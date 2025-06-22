'use client';

import { useState } from 'react';
import { DataUsage, FontType, PlaybackSpeed, Theme, useSettings, VideoQuality } from '@/contexts/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import Header from '@/components/Header';
import { 
  Palette, 
  Globe, 
  Play, 
  Shield, 
  Bell, 
  Eye, 
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
  Settings as SettingsIcon,
  Moon,
  Sun
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings, exportSettings, importSettings } = useSettings();
  const { theme, classes } = useTheme();
  const [activeSection, setActiveSection] = useState('appearance');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importText, setImportText] = useState('');

  const sections = [
    { id: 'appearance', name: 'APPEARANCE', icon: Palette },
    { id: 'video', name: 'VIDEO', icon: Play },
    { id: 'privacy', name: 'PRIVACY', icon: Shield },
    { id: 'notifications', name: 'NOTIFICATIONS', icon: Bell },
    { id: 'accessibility', name: 'ACCESSIBILITY', icon: Eye },
    { id: 'data', name: 'DATA & BACKUP', icon: Download },
  ];

  const regions = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  ];

  const handleImportSettings = () => {
    const success = importSettings(importText);
    if (success) {
      setShowImportDialog(false);
      setImportText('');
    }
  };

  const handleExportSettings = () => {
    const exported = exportSettings();
    navigator.clipboard.writeText(exported);
    // You could show a toast notification here
  };

  // Theme-aware helper functions
  const getPageHeaderBg = () => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'light') return 'bg-white';
    return 'bg-white';
  };

  const getSettingsCardBg = () => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'light') return 'bg-white';
    return 'bg-white';
  };

  const getToggleButtonStyles = (isOn: boolean, variant: 'normal' | 'danger' = 'normal') => {
    if (isOn) {
      if (variant === 'danger') {
        return theme === 'dark' ? 'bg-red-700' : theme === 'light' ? 'bg-red-500' : 'bg-red-400';
      }
      return theme === 'dark' ? 'bg-green-700' : theme === 'light' ? 'bg-green-500' : 'bg-green-400';
    }
    return theme === 'dark' ? 'bg-gray-600' : theme === 'light' ? 'bg-gray-300' : 'bg-gray-300';
  };

  const getSelectStyles = () => {
    if (theme === 'dark') return `${classes.cardBg} ${classes.border} ${classes.primaryText}`;
    if (theme === 'light') return `bg-white border-gray-300 ${classes.primaryText}`;
    return `bg-white border-3 border-black ${classes.primaryText}`;
  };

  const getActionButtonStyles = (color: 'blue' | 'green' | 'red') => {
    const baseColors = {
      blue: theme === 'dark' ? 'bg-blue-700' : theme === 'light' ? 'bg-blue-500' : 'bg-blue-500',
      green: theme === 'dark' ? 'bg-green-700' : theme === 'light' ? 'bg-green-500' : 'bg-green-500',
      red: theme === 'dark' ? 'bg-red-700' : theme === 'light' ? 'bg-red-500' : 'bg-red-500'
    };

    return `${baseColors[color]} text-white px-6 py-3 ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 font-black uppercase flex items-center gap-2`;
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-black uppercase tracking-wider ${classes.primaryText} mb-6`}>
              🎨 BRUTAL APPEARANCE
            </h2>
            
            {/* Theme Selection */}
            <div className={`${getSettingsCardBg()} ${classes.borderThick} ${classes.shadow} p-6`}>
              <h3 className={`text-lg font-black uppercase mb-4 ${classes.primaryText}`}>THEME</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'brutal', name: 'BRUTAL', icon: SettingsIcon, bg: 'bg-yellow-300', desc: 'Maximum aggression' },
                  { id: 'dark', name: 'DARK', icon: Moon, bg: 'bg-gray-800', desc: 'Sleek and minimal' },
                  { id: 'light', name: 'LIGHT', icon: Sun, bg: 'bg-white', desc: 'Clean and bright' },
                ].map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isSelected = settings.theme === themeOption.id;
                  
                  return (
                    <button
                      key={themeOption.id}
                      onClick={() => updateSetting('theme', themeOption.id as Theme)}
                      className={`p-4 border-3 ${classes.border} transition-all duration-150 ${
                        isSelected 
                          ? `${themeOption.bg} ${classes.shadow} transform translate-x-[2px] translate-y-[2px]`
                          : `${classes.secondaryBg} ${classes.hoverShadow} hover:translate-x-[-2px] hover:translate-y-[-2px]`
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${themeOption.id === 'dark' ? 'text-white' : classes.primaryText}`} />
                      <div className={`font-black text-sm uppercase ${themeOption.id === 'dark' ? 'text-white' : classes.primaryText}`}>
                        {themeOption.name}
                      </div>
                      <div className={`text-xs ${themeOption.id === 'dark' ? 'text-gray-300' : classes.secondaryText}`}>
                        {themeOption.desc}
                      </div>
                      {isSelected && (
                        <Check className={`w-6 h-6 mx-auto mt-2 ${themeOption.id === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Region Selection */}
            <div className={`${getSettingsCardBg()} ${classes.borderThick} ${classes.shadow} p-6`}>
              <h3 className={`text-lg font-black uppercase mb-4 ${classes.primaryText}`}>
                <Globe className="w-6 h-6 inline mr-2" />
                REGION
              </h3>
              <select
                value={settings.region}
                onChange={(e) => updateSetting('region', e.target.value)}
                className={`w-full p-3 font-bold text-lg focus:outline-none focus:border-blue-500 ${getSelectStyles()}`}
              >
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.flag} {region.name}
                  </option>
                ))}
              </select>
              <p className={`text-sm ${classes.secondaryText} mt-2 font-bold`}>
                This affects trending videos and search results in your area.
              </p>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-black uppercase tracking-wider ${classes.primaryText} mb-6`}>
              🎬 VIDEO PREFERENCES
            </h2>
            
            <div className={`${getSettingsCardBg()} ${classes.borderThick} ${classes.shadow} p-6 space-y-6`}>
              {/* Autoplay */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-black uppercase ${classes.primaryText}`}>AUTOPLAY NEXT VIDEO</h3>
                  <p className={`text-sm ${classes.secondaryText} font-bold`}>Automatically play related videos</p>
                </div>
                <button
                  onClick={() => updateSetting('autoplay', !settings.autoplay)}
                  className={`px-4 py-2 ${classes.borderThick} font-black uppercase transition-all duration-150 ${getToggleButtonStyles(settings.autoplay)} ${classes.shadow}`}
                >
                  {settings.autoplay ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Default Quality */}
              <div>
                <h3 className={`font-black uppercase mb-2 ${classes.primaryText}`}>DEFAULT VIDEO QUALITY</h3>
                <select
                  value={settings.defaultQuality}
                  onChange={(e) => updateSetting('defaultQuality', e.target.value as VideoQuality)}
                  className={`w-full p-3 font-bold ${getSelectStyles()}`}
                >
                  <option value="auto">AUTO (Recommended)</option>
                  <option value="high">HIGH (1080p+)</option>
                  <option value="medium">MEDIUM (720p)</option>
                  <option value="low">LOW (480p)</option>
                </select>
              </div>

              {/* Default Speed */}
              <div>
                <h3 className={`font-black uppercase mb-2 ${classes.primaryText}`}>DEFAULT PLAYBACK SPEED</h3>
                <select
                  value={settings.defaultSpeed}
                  onChange={(e) => updateSetting('defaultSpeed', parseFloat(e.target.value) as PlaybackSpeed)}
                  className={`w-full p-3 font-bold ${getSelectStyles()}`}
                >
                  <option value={0.25}>0.25x (Very Slow)</option>
                  <option value={0.5}>0.5x (Slow)</option>
                  <option value={0.75}>0.75x (Slower)</option>
                  <option value={1}>1x (Normal)</option>
                  <option value={1.25}>1.25x (Faster)</option>
                  <option value={1.5}>1.5x (Fast)</option>
                  <option value={1.75}>1.75x (Very Fast)</option>
                  <option value={2}>2x (Maximum)</option>
                </select>
              </div>

              {/* Subtitles */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-black uppercase ${classes.primaryText}`}>SUBTITLES</h3>
                  <p className={`text-sm ${classes.secondaryText} font-bold`}>Show subtitles when available</p>
                </div>
                <button
                  onClick={() => updateSetting('subtitles', !settings.subtitles)}
                  className={`px-4 py-2 ${classes.borderThick} font-black uppercase transition-all duration-150 ${getToggleButtonStyles(settings.subtitles)} ${classes.shadow}`}
                >
                  {settings.subtitles ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-black uppercase tracking-wider ${classes.primaryText} mb-6`}>
              🛡️ PRIVACY & DATA
            </h2>
            
            <div className={`${getSettingsCardBg()} ${classes.borderThick} ${classes.shadow} p-6 space-y-6`}>
              {/* Watch History */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-black uppercase ${classes.primaryText}`}>SAVE WATCH HISTORY</h3>
                  <p className={`text-sm ${classes.secondaryText} font-bold`}>Keep track of videos you&apos;ve watched</p>
                </div>
                <button
                  onClick={() => updateSetting('saveWatchHistory', !settings.saveWatchHistory)}
                  className={`px-4 py-2 ${classes.borderThick} font-black uppercase transition-all duration-150 ${getToggleButtonStyles(settings.saveWatchHistory, settings.saveWatchHistory ? 'normal' : 'danger')} ${classes.shadow}`}
                >
                  {settings.saveWatchHistory ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Personalized Ads */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-black uppercase ${classes.primaryText}`}>PERSONALIZED RECOMMENDATIONS</h3>
                  <p className={`text-sm ${classes.secondaryText} font-bold`}>Use your data to improve recommendations</p>
                </div>
                <button
                  onClick={() => updateSetting('personalizedAds', !settings.personalizedAds)}
                  className={`px-4 py-2 ${classes.borderThick} font-black uppercase transition-all duration-150 ${getToggleButtonStyles(settings.personalizedAds, settings.personalizedAds ? 'normal' : 'danger')} ${classes.shadow}`}
                >
                  {settings.personalizedAds ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Data Usage */}
              <div>
                <h3 className={`font-black uppercase mb-2 ${classes.primaryText}`}>DATA USAGE</h3>
                <select
                  value={settings.dataUsage}
                  onChange={(e) => updateSetting('dataUsage', e.target.value as DataUsage)}
                  className={`w-full p-3 font-bold ${getSelectStyles()}`}
                >
                  <option value="unlimited">UNLIMITED (Best Quality)</option>
                  <option value="wifi-only">WIFI ONLY (Save Mobile Data)</option>
                  <option value="limited">LIMITED (Reduced Quality)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-black uppercase tracking-wider ${classes.primaryText} mb-6`}>
              🔔 NOTIFICATION SETTINGS
            </h2>
            
            <div className={`${getSettingsCardBg()} ${classes.borderThick} ${classes.shadow} p-6 space-y-6`}>
              {[
                { key: 'newVideosFromSubscriptions', name: 'NEW VIDEOS FROM SUBSCRIPTIONS', desc: 'Get notified when subscribed channels upload' },
                { key: 'trendingInYourArea', name: 'TRENDING IN YOUR AREA', desc: 'Popular videos in your region' },
                { key: 'systemNotifications', name: 'SYSTEM NOTIFICATIONS', desc: 'Updates and important announcements' },
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-black uppercase ${classes.primaryText}`}>{notification.name}</h3>
                    <p className={`text-sm ${classes.secondaryText} font-bold`}>{notification.desc}</p>
                  </div>
                  <button
                    className={`px-4 py-2 ${classes.borderThick} font-black uppercase transition-all duration-150 ${getToggleButtonStyles(settings[notification.key as keyof typeof settings] as boolean)} ${classes.shadow}`}
                  >
                    {settings[notification.key as keyof typeof settings] ? 'ON' : 'OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-black uppercase tracking-wider ${classes.primaryText} mb-6`}>
              👁️ ACCESSIBILITY OPTIONS
            </h2>
            
            <div className={`${getSettingsCardBg()} ${classes.borderThick} ${classes.shadow} p-6 space-y-6`}>
              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-black uppercase ${classes.primaryText}`}>REDUCED MOTION</h3>
                  <p className={`text-sm ${classes.secondaryText} font-bold`}>Minimize animations and transitions</p>
                </div>
                <button
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  className={`px-4 py-2 ${classes.borderThick} font-black uppercase transition-all duration-150 ${getToggleButtonStyles(settings.reducedMotion)} ${classes.shadow}`}
                >
                  {settings.reducedMotion ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-black uppercase ${classes.primaryText}`}>HIGH CONTRAST</h3>
                  <p className={`text-sm ${classes.secondaryText} font-bold`}>Increase contrast for better visibility</p>
                </div>
                <button
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`px-4 py-2 ${classes.borderThick} font-black uppercase transition-all duration-150 ${getToggleButtonStyles(settings.highContrast)} ${classes.shadow}`}
                >
                  {settings.highContrast ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Font Size */}
              <div>
                <h3 className={`font-black uppercase mb-2 ${classes.primaryText}`}>FONT SIZE</h3>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value as FontType)}
                  className={`w-full p-3 font-bold ${getSelectStyles()}`}
                >
                  <option value="small">SMALL</option>
                  <option value="medium">MEDIUM (Default)</option>
                  <option value="large">LARGE</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <h2 className={`text-2xl font-black uppercase tracking-wider ${classes.primaryText} mb-6`}>
              💾 DATA & BACKUP
            </h2>
            
            <div className={`${getSettingsCardBg()} ${classes.borderThick} ${classes.shadow} p-6 space-y-6`}>
              {/* Export Settings */}
              <div>
                <h3 className={`font-black uppercase mb-2 ${classes.primaryText}`}>EXPORT SETTINGS</h3>
                <p className={`text-sm ${classes.secondaryText} font-bold mb-4`}>Save your settings to clipboard</p>
                <button
                  onClick={handleExportSettings}
                  className={getActionButtonStyles('blue')}
                >
                  <Download className="w-5 h-5" />
                  EXPORT SETTINGS
                </button>
              </div>

              {/* Import Settings */}
              <div>
                <h3 className={`font-black uppercase mb-2 ${classes.primaryText}`}>IMPORT SETTINGS</h3>
                <p className={`text-sm ${classes.secondaryText} font-bold mb-4`}>Restore settings from backup</p>
                <button
                  onClick={() => setShowImportDialog(true)}
                  className={getActionButtonStyles('green')}
                >
                  <Upload className="w-5 h-5" />
                  IMPORT SETTINGS
                </button>
              </div>

              {/* Reset Settings */}
              <div>
                <h3 className={`font-black uppercase mb-2 ${classes.primaryText}`}>RESET TO DEFAULTS</h3>
                <p className={`text-sm ${classes.secondaryText} font-bold mb-4`}>Reset all settings to default values</p>
                <button
                  onClick={resetSettings}
                  className={getActionButtonStyles('red')}
                >
                  <RotateCcw className="w-5 h-5" />
                  RESET ALL SETTINGS
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={classes.pageGradient}>
      <Header onSearch={() => {}} />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className={`${getPageHeaderBg()} ${classes.borderThick} ${classes.shadowLarge} p-6 ${theme === 'brutal' ? 'transform -rotate-1' : ''}`}>
              <h1 className={`text-4xl font-black uppercase tracking-wider ${classes.primaryText} ${theme === 'brutal' ? 'transform skew-x-12' : ''}`}>
                ⚙️ BRUTAL SETTINGS
              </h1>
              <p className={`text-lg font-bold ${classes.primaryText} mt-2`}>
                Customize your Vixel experience to maximum brutality!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className={`${getSettingsCardBg()} ${classes.borderThick} ${classes.shadow} p-4`}>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left p-3 ${classes.borderThick} font-black uppercase text-sm transition-all duration-150 flex items-center gap-3 ${
                          isActive 
                            ? `${theme === 'brutal' ? 'bg-yellow-400' : theme === 'dark' ? 'bg-blue-700' : 'bg-blue-100'} ${classes.shadow} transform translate-x-[2px] translate-y-[2px] ${classes.primaryText}`
                            : `${classes.cardBg} ${classes.hoverShadow} hover:translate-x-[-1px] hover:translate-y-[-1px] ${classes.primaryText}`
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {section.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {renderSection()}
            </div>
          </div>
        </div>
      </main>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${getSettingsCardBg()} border-6 ${classes.border} ${classes.shadowLarge} p-8 max-w-lg w-full mx-4`}>
            <h3 className={`text-2xl font-black uppercase mb-4 ${classes.primaryText}`}>IMPORT SETTINGS</h3>
            <p className={`text-sm font-bold ${classes.secondaryText} mb-4`}>
              Paste your exported settings JSON below:
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste settings JSON here..."
              className={`w-full h-32 p-3 ${classes.borderThick} font-mono text-sm resize-none ${classes.cardBg} ${classes.primaryText}`}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleImportSettings}
                className={`flex-1 ${getActionButtonStyles('green')} justify-center`}
              >
                <Check className="w-5 h-5" />
                IMPORT
              </button>
              <button
                onClick={() => setShowImportDialog(false)}
                className={`flex-1 ${getActionButtonStyles('red')} justify-center`}
              >
                <X className="w-5 h-5" />
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}