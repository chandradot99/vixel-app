'use client';

import { useState } from 'react';
import Header from '@/app/components/Header';
import VideoGrid from '@/app/components/VideoGrid';
import { Flame, TrendingUp, Star } from 'lucide-react';

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
      <main className="pt-24">
        <div className="container mx-auto">
          <div className="py-8">
            {/* Page Title with Neubrutalism */}
            <div className="mb-12 px-8">
              <div className="bg-white border-6 border-black shadow-[12px_12px_0px_0px_#000] p-8 transform -rotate-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-orange-400 border-3 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
                    {searchQuery ? <TrendingUp className="w-8 h-8 text-black" strokeWidth={3} /> : <Flame className="w-8 h-8 text-black" strokeWidth={3} />}
                  </div>
                  <h1 className="text-5xl font-black uppercase tracking-wider text-black transform skew-x-12">
                    {searchQuery ? `SEARCH: "${searchQuery.toUpperCase()}"` : 'TRENDING ON VIXEL'}
                  </h1>
                </div>
                <p className="text-xl font-bold uppercase text-black tracking-wide">
                  {searchQuery ? 'VIDEOS MATCHING YOUR BRUTAL SEARCH!' : 'THE MOST INSANE VIDEOS RIGHT NOW!'}
                </p>
                <div className="flex gap-2 mt-4">
                  <Star className="w-6 h-6 text-black fill-black" />
                  <Star className="w-6 h-6 text-black fill-black" />
                  <Star className="w-6 h-6 text-black fill-black" />
                </div>
              </div>
            </div>
            
            <VideoGrid searchQuery={searchQuery} />
          </div>
        </div>
      </main>
    </div>
  );
}
