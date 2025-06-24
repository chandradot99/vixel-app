'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import Header from '@/components/Header';
import { YouTubeService, APIError, EnrichedYouTubeVideo } from '@/lib/youtube';
import { Loader2, RefreshCw, Wifi, Clock, AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import RelatedVideos from '@/components/RelatedVideos';
import VideoInfo from '@/components/VideoInfo';
import CustomVideoPlayer from '@/components/CustomVideoPlayer';

function WatchPageContent() {
  const { theme, classes } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  
  const [video, setVideo] = useState<EnrichedYouTubeVideo | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<EnrichedYouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<APIError | null>(null);

  useEffect(() => {
    if (!videoId) {
      setError({
        type: 'not_found',
        message: 'No video ID provided',
        userMessage: 'No video specified! The URL might be incomplete.',
        canRetry: false
      });
      setLoading(false);
      return;
    }

    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);
    
        // 🔥 Get video details using service
        const videoResult = await YouTubeService.getVideoById(videoId);
        
        if (!videoResult) {
          setError({
            type: 'not_found',
            message: 'Video not found',
            userMessage: 'This video was not found! It might have been removed, made private, or the link is broken.',
            canRetry: false
          });
          return;
        }
    
        setVideo(videoResult);
    
        // 🔥 Get related videos using service  
        const relatedVideosResult = await YouTubeService.getRelatedVideos(videoResult, 24);
        
        if (relatedVideosResult.error) {
          // If related videos fail, still show the main video
          console.warn('Failed to load related videos:', relatedVideosResult.error);
          setRelatedVideos([]);
        } else {
          setRelatedVideos(relatedVideosResult.items);
        }
    
      } catch (err) {
        console.error('Error fetching video:', err);
        
        if (err && typeof err === 'object' && 'type' in err) {
          setError(err as APIError);
        } else {
          setError({
            type: 'unknown',
            message: err instanceof Error ? err.message : 'Failed to load video',
            userMessage: 'Failed to load this video! There might be a connection problem.',
            canRetry: true
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleSearch = (query: string) => {
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Force re-fetch by updating the effect dependency
    window.location.reload();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Theme-aware helper functions
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

  const getErrorText = () => {
    if (theme === 'dark') return 'text-red-200';
    if (theme === 'light') return 'text-red-700';
    return 'text-black';
  };

  const getErrorIcon = () => {
    switch (error?.type) {
      case 'quota':
        return Clock;
      case 'network':
        return Wifi;
      case 'not_found':
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const getButtonStyles = (variant: 'primary' | 'secondary' = 'primary') => {
    const baseStyles = `px-6 py-3 ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 font-black uppercase flex items-center gap-2`;
    
    if (variant === 'primary') {
      return `${baseStyles} ${theme === 'brutal' ? 'bg-green-400 text-black' : theme === 'dark' ? 'bg-green-700 text-white' : 'bg-green-500 text-white'}`;
    } else {
      return `${baseStyles} ${theme === 'brutal' ? 'bg-blue-400 text-black' : theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`;
    }
  };

  const renderError = () => {
    if (!error) return null;
    
    const ErrorIcon = getErrorIcon();
    
    return (
      <div className={classes.pageGradient}>
        <Header onSearch={handleSearch} />
        <main className="pt-20">
          <div className="flex justify-center items-center min-h-96">
            <div className={`${getErrorBg()} ${classes.borderThick} ${classes.shadowLarge} p-8 text-center max-w-lg`}>
              <ErrorIcon className={`w-20 h-20 mx-auto mb-6 ${getErrorText()}`} />
              
              <div className={`text-3xl font-black uppercase ${getErrorText()} mb-4`}>
                {error.type === 'quota' && '⏰ DAILY LIMIT REACHED!'}
                {error.type === 'network' && '📡 CONNECTION PROBLEM!'}
                {error.type === 'not_found' && '🎬 VIDEO NOT FOUND!'}
                {error.type === 'unknown' && '😵 SOMETHING WENT WRONG!'}
              </div>
              
              <p className={`text-lg font-bold ${getErrorText()} mb-8 leading-relaxed`}>
                {error.userMessage}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {error.canRetry && (
                  <button
                    onClick={handleRetry}
                    className={getButtonStyles('primary')}
                  >
                    <RefreshCw className="w-5 h-5" />
                    TRY AGAIN
                  </button>
                )}
                
                <button
                  onClick={handleGoBack}
                  className={getButtonStyles('secondary')}
                >
                  <ArrowLeft className="w-5 h-5" />
                  GO BACK
                </button>
                
                <button
                  onClick={handleGoHome}
                  className={getButtonStyles('secondary')}
                >
                  <Home className="w-5 h-5" />
                  HOME
                </button>
              </div>
              
              {error.type === 'quota' && (
                <div className={`mt-6 text-sm ${getErrorText()} font-bold opacity-75`}>
                  💡 YouTube API quota refreshes daily. Try again tomorrow!
                </div>
              )}
              
              {error.type === 'not_found' && videoId && (
                <div className={`mt-6 text-xs ${getErrorText()} font-mono opacity-50 break-all`}>
                  Video ID: {videoId}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={classes.pageGradient}>
        <Header onSearch={handleSearch} />
        <main className="pt-20">
          <div className="flex justify-center items-center min-h-96">
            <div className={`${getLoadingBg()} ${classes.borderThick} ${classes.shadowLarge} p-8`}>
              <div className="flex items-center gap-4">
                <Loader2 className={`w-8 h-8 animate-spin ${classes.primaryText}`} strokeWidth={4} />
                <span className={`text-xl font-black uppercase ${classes.primaryText}`}>LOADING EPIC VIDEO...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return renderError();
  }

  if (!video) {
    return (
      <div className={classes.pageGradient}>
        <Header onSearch={handleSearch} />
        <main className="pt-20">
          <div className="flex justify-center items-center min-h-96">
            <div className={`${getErrorBg()} ${classes.borderThick} ${classes.shadowLarge} p-8 text-center`}>
              <AlertTriangle className={`w-16 h-16 mx-auto mb-4 ${getErrorText()}`} />
              <div className={`text-2xl font-black uppercase ${getErrorText()} mb-4`}>
                🎬 NO VIDEO DATA!
              </div>
              <p className={`text-lg font-bold ${getErrorText()} mb-6`}>
                Video loaded but no data received!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className={getButtonStyles('primary')}
                >
                  <RefreshCw className="w-5 h-5" />
                  RETRY
                </button>
                <button
                  onClick={handleGoHome}
                  className={getButtonStyles('secondary')}
                >
                  <Home className="w-5 h-5" />
                  HOME
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={classes.pageGradient}>
      <Header onSearch={handleSearch} />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Section */}
            <div className="lg:col-span-2">
              <CustomVideoPlayer videoId={videoId!} video={video} relatedVideos={relatedVideos} />
              <VideoInfo video={video} />
            </div>
            
            {/* Related Videos Sidebar */}
            <div className="lg:col-span-1">
              <RelatedVideos videos={relatedVideos} />
              
              {/* Show message if related videos failed to load */}
              {relatedVideos.length === 0 && (
                <div className={`${classes.cardBg} ${classes.borderThick} ${classes.shadow} p-6 mt-4 text-center`}>
                  <p className={`font-bold ${classes.secondaryText} uppercase text-sm`}>
                    😅 RELATED VIDEOS UNAVAILABLE
                  </p>
                  <p className={`text-xs ${classes.secondaryText} mt-2`}>
                    Try refreshing or check back later!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingFallback() {
  const { theme, classes } = useTheme();
  
  const getLoadingBg = () => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'light') return 'bg-white';
    return 'bg-yellow-300';
  };

  return (
    <div className={`${classes.pageGradient} flex items-center justify-center min-h-screen`}>
      <div className={`${getLoadingBg()} ${classes.borderThick} ${classes.shadowLarge} p-8`}>
        <div className="flex items-center gap-4">
          <Loader2 className={`w-8 h-8 animate-spin ${classes.primaryText}`} strokeWidth={4} />
          <span className={`text-xl font-black uppercase ${classes.primaryText}`}>
            LOADING VIXEL...
          </span>
        </div>
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <WatchPageContent />
    </Suspense>
  );
}
