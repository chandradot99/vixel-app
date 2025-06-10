'use client';

import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export default function MobileSearch({ isOpen, onClose, onSearch }: MobileSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center px-4 py-2 h-14">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <form onSubmit={handleSubmit} className="flex-1 flex">
          <input
            type="text"
            placeholder="Search Vixel"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full outline-none focus:border-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 bg-gray-50 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-100"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </form>
      </div>
    </div>
  );
}
