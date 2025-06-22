'use client';

import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export default function MobileSearch({ isOpen, onClose, onSearch }: MobileSearchProps) {
  const { theme, classes } = useTheme();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  // Theme-aware helper functions
  const getBackButtonStyle = () => {
    if (theme === 'dark') {
      return 'hover:bg-gray-700 text-white';
    }
    if (theme === 'light') {
      return 'hover:bg-gray-100 text-gray-900';
    }
    return `${classes.secondaryBg} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] ${classes.primaryText}`;
  };

  const getSearchButtonStyle = () => {
    if (theme === 'dark') {
      return 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white';
    }
    if (theme === 'light') {
      return 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-600';
    }
    return `bg-blue-500 hover:bg-blue-600 ${classes.border} border-l-0 text-white font-black ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px]`;
  };

  const getInputStyle = () => {
    if (theme === 'dark') {
      return `${classes.cardBg} ${classes.border} ${classes.primaryText} focus:border-blue-500 placeholder-gray-400`;
    }
    if (theme === 'light') {
      return `${classes.cardBg} border-gray-300 ${classes.primaryText} focus:border-blue-500 placeholder-gray-500`;
    }
    return `${classes.cardBg} ${classes.borderThick} border-r-0 ${classes.primaryText} focus:border-blue-500 placeholder-gray-500 font-bold uppercase`;
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${classes.primaryBg} ${theme === 'brutal' ? 'border-b-4' : 'border-b'} ${classes.border} md:hidden`}>
      <div className="flex items-center px-4 py-2 h-14">
        <button
          onClick={onClose}
          className={`p-2 mr-2 transition-all duration-150 ${
            theme === 'brutal' 
              ? getBackButtonStyle()
              : `${getBackButtonStyle()} rounded-full`
          }`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <form onSubmit={handleSubmit} className="flex-1 flex">
          <input
            type="text"
            placeholder={theme === 'brutal' ? "SEARCH VIXEL..." : "Search Vixel"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 px-4 py-2 outline-none transition-all duration-150 ${
              theme === 'brutal' 
                ? getInputStyle()
                : `${getInputStyle()} rounded-l-full`
            }`}
            autoFocus
          />
          <button
            type="submit"
            className={`px-4 transition-all duration-150 ${
              theme === 'brutal'
                ? getSearchButtonStyle()
                : `${getSearchButtonStyle()} rounded-r-full`
            }`}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}