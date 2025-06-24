'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import Header from '@/components/Header';
import CategoryBar from '@/components/CategoryBar';
import { YouTubeService, APIError, EnrichedYouTubeVideo } from '@/lib/youtube';
import VideoCard from '@/components/VideoCard';
import { RefreshCw, Wifi, Clock, AlertTriangle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { theme, classes } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videos, setVideos] = useState<EnrichedYouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  // Fetch videos when category or search changes
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result;
        
        if (searchQuery.trim()) {
          result = await YouTubeService.searchVideos(searchQuery, 24, user);
        } else {
          result = await YouTubeService.getVideosByCategory(selectedCategory, 24, user);
        }
        
        if (result.error) {
          setError(result.error);
          setVideos([]);
        } else {
          setVideos(result.items);
          setError(null);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setError({
          type: 'unknown',
          message: 'Failed to fetch videos',
          userMessage: 'Something went wrong! Please try again.',
          canRetry: true
        });
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory, searchQuery, user]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSelectedCategory('all');
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  };

  const handleMenuClick = () => {
    console.log('Menu clicked - implement sidebar toggle');
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    if (searchQuery.trim()) {
      setSearchQuery(searchQuery + ' '); // Add space to trigger useEffect
      setTimeout(() => setSearchQuery(searchQuery.trim()), 100);
    } else {
      setSelectedCategory(selectedCategory === 'all' ? 'all_retry' : 'all');
      setTimeout(() => setSelectedCategory(selectedCategory), 100);
    }
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `SEARCH RESULTS: "${searchQuery.toUpperCase()}"`;
    }
    
    const categoryNames: Record<string, string> = {
      'all': 'TRENDING ON VIXEL',
      '10': 'EPIC MUSIC VIDEOS',
      '20': 'EPIC GAMING CONTENT',
      '22': 'PERSONAL VLOGS',
      '23': 'COMEDY GOLD',
      '24': 'ENTERTAINMENT ZONE',
      '25': 'NEWS & CURRENT EVENTS',
      '26': 'HOW-TO GUIDES',
      '27': 'EDUCATIONAL CONTENT',
      '28': 'TECH REVIEWS',
    };
    
    return categoryNames[selectedCategory] || 'TRENDING ON VIXEL';
  };

  const getPageDescription = () => {
    if (searchQuery) {
      return 'Videos matching your epic search query!';
    }
    
    const descriptions: Record<string, string> = {
      'all': 'The most insane videos right now!',
      '10': 'Epic beats and epic music videos!',
      '20': 'Gaming content that will blow your mind!',
      '22': 'Personal stories and daily adventures!',
      '23': 'Comedy that will make you laugh brutally!',
      '24': 'Entertainment that never gets boring!',
      '25': 'Stay updated with the latest news!',
      '26': 'Learn new skills with step-by-step guides!',
      '27': 'Expand your knowledge with educational content!',
      '28': 'Latest tech reviews and gadget showcases!',
    };
    
    return descriptions[selectedCategory] || 'The most insane videos right now!';
  };

  // Theme-aware helper functions
  const getPageTitleBg = () => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'light') return 'bg-white';
    return 'bg-white';
  };

  const getLoadingBg = () => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'light') return 'bg-white';
    return 'bg-yellow-300';
  };

  const getErrorBg = () => {
    if (theme === 'dark') return 'bg-red-900';
    if (theme === 'light') return 'bg-red-50';
    return 'bg-red-400';
  };

  const getErrorIcon = () => {
    switch (error?.type) {
      case 'quota':
        return Clock;
      case 'network':
        return Wifi;
      default:
        return AlertTriangle;
    }
  };

  const getErrorColor = () => {
    if (theme === 'dark') return 'text-red-200';
    if (theme === 'light') return 'text-red-700';
    return 'text-black';
  };

  const renderError = () => {
    if (!error) return null;
    
    const ErrorIcon = getErrorIcon();
    
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className={`${getErrorBg()} ${classes.borderThick} ${classes.shadowLarge} p-8 text-center max-w-md`}>
          <ErrorIcon className={`w-16 h-16 mx-auto mb-4 ${getErrorColor()}`} />
          
          <div className={`text-2xl font-black uppercase ${getErrorColor()} mb-4`}>
            {error.type === 'quota' && '⏰ DAILY LIMIT REACHED!'}
            {error.type === 'network' && '📡 CONNECTION PROBLEM!'}
            {error.type === 'not_found' && '🔍 NOTHING FOUND!'}
            {error.type === 'unknown' && '😵 SOMETHING WENT WRONG!'}
          </div>
          
          <p className={`text-lg font-bold ${getErrorColor()} mb-6 leading-relaxed`}>
            {error.userMessage}
          </p>
          
          {error.canRetry && (
            <button
              onClick={handleRetry}
              className={`${theme === 'brutal' ? 'bg-green-400' : theme === 'dark' ? 'bg-green-700' : 'bg-green-500'} text-white px-6 py-3 ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 font-black uppercase flex items-center gap-2 mx-auto`}
            >
              <RefreshCw className="w-5 h-5" />
              TRY AGAIN
            </button>
          )}
          
          {error.type === 'quota' && (
            <div className={`mt-4 text-sm ${classes.secondaryText} font-bold`}>
              💡 Try again tomorrow or check back later!
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={classes.pageGradient}>
      <Header 
        onMenuClick={handleMenuClick}
        onSearch={handleSearch}
      />
      
      <CategoryBar 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Main Content */}
      <main className="pt-4">
        <div className="container mx-auto">
          <div className="py-6">
            {/* Page Title */}
            <div className="mb-8 px-6">
              <div className={`${getPageTitleBg()} ${classes.borderThick} ${classes.shadowLarge} p-5 ${theme === 'brutal' ? 'transform -rotate-1' : ''}`}>
                <h1 className={`text-3xl font-black uppercase tracking-wider ${classes.primaryText} ${theme === 'brutal' ? 'transform skew-x-12' : ''} mb-2`}>
                  {getPageTitle()}
                </h1>
                <p className={`text-lg font-bold uppercase ${classes.primaryText} tracking-wide`}>
                  {getPageDescription()}
                </p>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="px-6">
              {loading ? (
                <div className="flex justify-center items-center min-h-96">
                  <div className={`${getLoadingBg()} ${classes.borderThick} ${classes.shadowLarge} p-8`}>
                    <div className={`text-xl font-black uppercase ${classes.primaryText}`}>
                      LOADING EPIC VIDEOS...
                    </div>
                  </div>
                </div>
              ) : error ? (
                renderError()
              ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center min-h-96">
                  <div className={`${getLoadingBg()} ${classes.borderThick} ${classes.shadowLarge} p-8 text-center`}>
                    <div className={`text-2xl font-black uppercase ${classes.primaryText} mb-4`}>
                      NO EPIC VIDEOS FOUND! 😢
                    </div>
                    <p className={`text-lg font-bold ${classes.secondaryText} uppercase`}>
                      {searchQuery 
                        ? `Try searching for something else!`
                        : `No videos available in this category right now!`
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
