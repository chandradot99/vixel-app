'use client';

import { useState } from 'react';
import Header from './components/Header';
import VideoGrid from './components/VideoGrid';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const handleMenuClick = () => {
    console.log('Menu clicked - implement sidebar toggle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200">
      <Header 
        onMenuClick={handleMenuClick}
        onSearch={handleSearch}
      />
      
      {/* Main Content with top padding to account for fixed header */}
      <main className="pt-16">
        <div className="container mx-auto">
          <div className="py-8">
            <VideoGrid searchQuery={searchQuery} />
          </div>
        </div>
      </main>
    </div>
  );
}
