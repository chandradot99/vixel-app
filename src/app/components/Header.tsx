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
    console.log('Voice search clicked');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-yellow-300 border-b-6 border-black">
      <div className="flex items-center justify-between px-4 py-3 h-16">
        
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 lg:block hidden"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-black" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-red-500 border-3 border-black shadow-[4px_4px_0px_0px_#000] p-2">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-black text-3xl text-black uppercase tracking-wider hidden sm:block transform -skew-x-12">
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
              className="flex-1 px-4 py-3 text-base font-bold bg-white border-3 border-black border-r-0 outline-none text-black placeholder-gray-500 uppercase"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 border-3 border-black text-white font-black uppercase tracking-wide shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleVoiceSearch}
              className="ml-2 p-3 bg-green-400 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              aria-label="Voice search"
            >
              <Mic className="w-5 h-5 text-black" />
            </button>
          </form>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center gap-2">
          {/* Create button */}
          <button className="p-3 bg-purple-500 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 hidden sm:block">
            <Plus className="w-5 h-5 text-white" />
          </button>

          {/* Notifications */}
          <button className="p-3 bg-orange-400 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 relative">
            <Bell className="w-5 h-5 text-black" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-black"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1.5 bg-pink-400 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
            >
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-16 w-72 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] z-10">
                <div className="px-5 py-3 bg-cyan-300 border-b-3 border-black">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-black text-base uppercase">JOHN DOE</div>
                      <div className="font-bold text-sm uppercase">@JOHNDOE</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Link 
                    href="/channel" 
                    className="flex items-center gap-3 px-5 py-3 hover:bg-yellow-200 transition-colors font-black uppercase tracking-wide border-b-2 border-black text-sm"
                  >
                    <User className="w-5 h-5" />
                    YOUR CHANNEL
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center gap-3 px-5 py-3 hover:bg-yellow-200 transition-colors font-black uppercase tracking-wide border-b-2 border-black text-sm"
                  >
                    <Settings className="w-5 h-5" />
                    SETTINGS
                  </Link>
                  <button className="w-full text-left px-5 py-3 hover:bg-red-200 transition-colors font-black uppercase tracking-wide text-sm">
                    SIGN OUT
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
