'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Menu, 
  Mic, 
  Bell, 
  User, 
  Plus,
  Play,
  Settings
} from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ onMenuClick, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  const handleVoiceSearch = () => {
    // Voice search functionality - placeholder for now
    console.log('Voice search clicked');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2 h-14">
        
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:block hidden"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link href="/" className="flex items-center gap-1">
            <div className="bg-red-600 rounded p-1.5">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block">Vixel</span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="flex flex-1 border border-gray-300 rounded-l-full overflow-hidden focus-within:border-blue-500">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={handleVoiceSearch}
              className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Voice search"
            >
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
          </form>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center gap-2">
          {/* Create button */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
            <Plus className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-gray-600">@johndoe</div>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <Link 
                    href="/channel" 
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Your channel
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 pt-1">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
