'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/contexts/SettingsContext';
import LoginModal from './LoginModal';
import { 
  Search, 
  Menu, 
  Mic, 
  Bell, 
  User, 
  Plus,
  Play,
  Settings as SettingsIcon,
  LogOut,
  Palette,
  Moon,
  Sun
} from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ onMenuClick, onSearch }: HeaderProps) {
  const { user, loading, signOut } = useAuth();
  const { theme, classes } = useTheme();
  const { updateSetting } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
  };

  const handleThemeChange = (newTheme: 'brutal' | 'dark' | 'light') => {
    updateSetting('theme', newTheme);
    setShowThemeMenu(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return Moon;
      case 'light':
        return Sun;
      default:
        return Palette;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${classes.primaryBg} border-b-6 ${classes.border}`}>
        <div className="flex items-center justify-between px-4 py-3 h-16">
          
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className={`p-2 ${classes.secondaryBg} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 lg:block hidden`}
              aria-label="Menu"
            >
              <Menu className={`w-5 h-5 ${classes.primaryText}`} />
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <div className={`${theme === 'brutal' ? 'bg-red-500' : theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} ${classes.borderThick} ${classes.shadow} p-2`}>
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
              <span className={`font-black text-3xl ${classes.primaryText} uppercase tracking-wider hidden sm:block transform -skew-x-12`}>
                VIXEL
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="flex items-center gap-0">
              <input
                type="text"
                placeholder="SEARCH VIXEL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 px-4 py-3 text-base font-bold ${classes.cardBg} ${classes.borderThick} border-r-0 outline-none ${classes.primaryText} placeholder-gray-500 uppercase`}
              />
              <button
                type="submit"
                className={`px-6 py-3 ${theme === 'brutal' ? 'bg-blue-500' : theme === 'dark' ? 'bg-green-600' : 'bg-green-500'} ${classes.borderThick} text-white font-black uppercase tracking-wide ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                className={`ml-2 p-3 ${theme === 'brutal' ? 'bg-green-400' : theme === 'dark' ? 'bg-purple-600' : 'bg-purple-500'} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
                aria-label="Voice search"
              >
                <Mic className={`w-5 h-5 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
              </button>
            </form>
          </div>

          {/* Right Section - User Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Show when NOT logged in */}
            {!user && !loading && (
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className={`p-3 ${theme === 'brutal' ? 'bg-cyan-400' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
                  aria-label="Change theme"
                >
                  <ThemeIcon className={`w-5 h-5 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
                </button>

                {/* Theme Dropdown Menu */}
                {showThemeMenu && (
                  <div className={`absolute right-0 top-16 w-64 ${classes.cardBg} ${classes.borderThick} ${classes.shadowLarge} z-10`}>
                    <div className={`px-4 py-3 ${theme === 'brutal' ? 'bg-cyan-300' : theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} border-b-4 ${classes.border}`}>
                      <h3 className={`font-black text-lg uppercase ${classes.primaryText}`}>CHOOSE THEME</h3>
                    </div>
                    
                    <div className="p-2">
                      {[
                        { id: 'brutal', name: 'BRUTAL', icon: Palette, desc: 'Maximum aggression', bg: 'bg-yellow-300' },
                        { id: 'dark', name: 'DARK', icon: Moon, desc: 'Sleek and minimal', bg: 'bg-gray-800' },
                        { id: 'light', name: 'LIGHT', icon: Sun, desc: 'Clean and bright', bg: 'bg-white' },
                      ].map((themeOption) => {
                        const Icon = themeOption.icon;
                        const isSelected = theme === themeOption.id;
                        
                        return (
                          <button
                            key={themeOption.id}
                            onClick={() => handleThemeChange(themeOption.id as any)}
                            className={`w-full flex items-center gap-3 p-3 mb-2 border-2 ${classes.border} transition-all duration-150 ${
                              isSelected 
                                ? `${themeOption.bg} ${classes.shadow} transform translate-x-[2px] translate-y-[2px]`
                                : `${classes.secondaryBg} hover:${classes.shadow} hover:translate-x-[1px] hover:translate-y-[1px]`
                            }`}
                          >
                            <div className={`p-2 ${themeOption.bg} border-2 ${classes.border}`}>
                              <Icon className={`w-4 h-4 ${themeOption.id === 'dark' ? 'text-white' : 'text-black'}`} />
                            </div>
                            <div className="text-left">
                              <div className={`font-black text-sm uppercase ${themeOption.id === 'dark' && isSelected ? 'text-white' : classes.primaryText}`}>
                                {themeOption.name}
                              </div>
                              <div className={`text-xs ${themeOption.id === 'dark' && isSelected ? 'text-gray-300' : classes.secondaryText}`}>
                                {themeOption.desc}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="ml-auto">
                                <div className={`w-3 h-3 ${theme === 'brutal' ? 'bg-green-500' : 'bg-green-400'} border ${classes.border}`}></div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Create button - only show when logged in */}
            {user && (
              <button className={`p-3 ${theme === 'brutal' ? 'bg-purple-500' : theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-500'} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 hidden sm:block`}>
                <Plus className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Notifications - only show when logged in */}
            {user && (
              <button className={`p-3 ${theme === 'brutal' ? 'bg-orange-400' : theme === 'dark' ? 'bg-orange-600' : 'bg-orange-500'} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 relative`}>
                <Bell className={`w-5 h-5 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
                <span className={`absolute top-1 right-1 w-3 h-3 ${theme === 'brutal' ? 'bg-red-500' : 'bg-red-400'} ${classes.border} border-2`}></span>
              </button>
            )}

            {/* User Profile */}
            <div className="relative">
              {loading ? (
                <div className={`w-12 h-12 bg-gray-400 ${classes.borderThick} animate-pulse`}></div>
              ) : user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`p-1 ${classes.cardBg} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
                >
                  <div className="w-10 h-10 overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`px-4 py-2 ${theme === 'brutal' ? 'bg-red-500' : theme === 'dark' ? 'bg-red-600' : 'bg-red-500'} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 text-white font-black uppercase text-sm`}
                >
                  SIGN IN
                </button>
              )}

              {/* User Dropdown Menu */}
              {showUserMenu && user && (
                <div className={`absolute right-0 top-16 w-80 ${classes.cardBg} ${classes.borderThick} ${classes.shadowLarge} z-10`}>
                  <div className={`px-6 py-4 ${theme === 'brutal' ? 'bg-cyan-300' : theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} border-b-4 ${classes.border}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${classes.border} border-2 overflow-hidden`}>
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className={`font-black text-lg uppercase ${classes.primaryText}`}>{user.name}</div>
                        <div className={`font-bold text-sm ${classes.secondaryText}`}>{user.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Link 
                      href="/channel" 
                      className={`flex items-center gap-4 px-6 py-4 hover:${theme === 'brutal' ? 'bg-yellow-200' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'} transition-colors font-black uppercase tracking-wide border-b-2 ${classes.border} text-sm ${classes.primaryText}`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-5 h-5" />
                      YOUR CHANNEL
                    </Link>
                    <Link 
                      href="/settings" 
                      className={`flex items-center gap-4 px-6 py-4 hover:${theme === 'brutal' ? 'bg-yellow-200' : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'} transition-colors font-black uppercase tracking-wide border-b-2 ${classes.border} text-sm ${classes.primaryText}`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <SettingsIcon className="w-5 h-5" />
                      SETTINGS
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className={`w-full flex items-center gap-4 px-6 py-4 hover:${theme === 'brutal' ? 'bg-red-200' : theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} transition-colors font-black uppercase tracking-wide text-sm text-left ${classes.primaryText}`}
                    >
                      <LogOut className="w-5 h-5" />
                      SIGN OUT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Click outside handlers */}
      {(showUserMenu || showThemeMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowThemeMenu(false);
          }}
        />
      )}
    </>
  );
}