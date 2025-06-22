'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { YouTubeVideo } from '@/types/youtube';
import { useTheme } from '@/hooks/useTheme';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipForward, 
  SkipBack,
  Loader2
} from 'lucide-react';

// YouTube Player API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface CustomVideoPlayerProps {
  videoId: string;
  video: YouTubeVideo;
  relatedVideos?: YouTubeVideo[];
}

export default function CustomVideoPlayer({ 
  videoId, 
  video, 
  relatedVideos = [] 
}: CustomVideoPlayerProps) {
  const router = useRouter();
  const { theme, classes } = useTheme();
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [showAutoplayOverlay, setShowAutoplayOverlay] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get next video for autoplay
  const getNextVideo = () => {
    return relatedVideos.length > 0 ? relatedVideos[0] : null;
  };

  const nextVideo = getNextVideo();

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 1000);
  };

  // Load YouTube API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT) {
        initializePlayer();
        return;
      }

      window.onYouTubeIframeAPIReady = initializePlayer;

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadYouTubeAPI();

    return () => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!playerRef.current || !window.YT) return;

    ytPlayerRef.current = new window.YT.Player(playerRef.current, {
      videoId: videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        controls: 0, // Hide default controls
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 0, // Disable YouTube's fullscreen (we'll handle our own)
        disablekb: 1, // Disable keyboard controls
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = () => {
    setIsReady(true);
    setIsLoading(false);
    setDuration(ytPlayerRef.current.getDuration());
    setVolume(ytPlayerRef.current.getVolume());
    
    // Start progress tracking
    const interval = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        setCurrentTime(ytPlayerRef.current.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const onPlayerStateChange = (event: any) => {
    const playerState = event.data;
    
    switch (playerState) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        resetControlsTimeout();
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        setShowControls(true); // Show controls when paused
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        setShowControls(true);
        if (autoplayEnabled && nextVideo) {
          startAutoplayCountdown();
        }
        break;
    }
  };

  // Control functions
  const togglePlay = () => {
    if (!ytPlayerRef.current) return;
    
    if (isPlaying) {
      ytPlayerRef.current.pauseVideo();
    } else {
      ytPlayerRef.current.playVideo();
    }
    resetControlsTimeout();
  };

  const seekTo = (seconds: number) => {
    if (!ytPlayerRef.current) return;
    ytPlayerRef.current.seekTo(seconds);
    resetControlsTimeout();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  const setPlayerVolume = (newVolume: number) => {
    if (!ytPlayerRef.current) return;
    ytPlayerRef.current.setVolume(newVolume);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    resetControlsTimeout();
  };

  const toggleMute = () => {
    if (!ytPlayerRef.current) return;
    
    if (isMuted) {
      ytPlayerRef.current.unMute();
      setIsMuted(false);
    } else {
      ytPlayerRef.current.mute();
      setIsMuted(true);
    }
    resetControlsTimeout();
  };

  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seekTo(newTime);
  };

  // Fixed fullscreen implementation
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(console.error);
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
    resetControlsTimeout();
  };

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Mouse move handler
  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  // Autoplay functions
  const startAutoplayCountdown = () => {
    if (!nextVideo) return;
    
    setShowAutoplayOverlay(true);
    setCountdown(5);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playNextVideo();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playNextVideo = () => {
    if (nextVideo) {
      const nextVideoId = typeof nextVideo.id === 'string' ? nextVideo.id : nextVideo.id.videoId;
      router.push(`/watch?v=${nextVideoId}`);
    }
  };

  const cancelAutoplay = () => {
    setShowAutoplayOverlay(false);
    setCountdown(0);
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Theme-aware helper functions
  const getProgressBarColors = () => {
    if (theme === 'dark') return { bg: 'bg-gray-700', progress: 'bg-blue-500', border: 'border-gray-500' };
    if (theme === 'light') return { bg: 'bg-gray-300', progress: 'bg-blue-500', border: 'border-gray-400' };
    return { bg: 'bg-gray-800', progress: 'bg-yellow-400', border: 'border-white' };
  };

  const getVolumeBarColors = () => {
    if (theme === 'dark') return { bg: 'bg-gray-700', volume: 'bg-green-500', border: 'border-gray-500' };
    if (theme === 'light') return { bg: 'bg-gray-300', volume: 'bg-green-500', border: 'border-gray-400' };
    return { bg: 'bg-gray-800', volume: 'bg-green-400', border: 'border-white' };
  };

  const getControlButtonColors = () => {
    if (theme === 'dark') {
      return {
        primary: 'bg-red-600 hover:bg-red-700',
        secondary: 'bg-blue-600 hover:bg-blue-700',
        success: 'bg-green-600 hover:bg-green-700',
        warning: 'bg-orange-600 hover:bg-orange-700'
      };
    }
    if (theme === 'light') {
      return {
        primary: 'bg-red-500 hover:bg-red-600',
        secondary: 'bg-blue-500 hover:bg-blue-600',
        success: 'bg-green-500 hover:bg-green-600',
        warning: 'bg-orange-500 hover:bg-orange-600'
      };
    }
    return {
      primary: 'bg-red-500 hover:bg-red-600',
      secondary: 'bg-blue-400 hover:bg-blue-500',
      success: 'bg-green-400 hover:bg-green-500',
      warning: 'bg-orange-400 hover:bg-orange-500'
    };
  };

  const progressColors = getProgressBarColors();
  const volumeColors = getVolumeBarColors();
  const buttonColors = getControlButtonColors();

  return (
    <div className={`${classes.cardBg} ${classes.borderThick} ${classes.shadowLarge} mb-6 relative`}>
      {/* Video Player Container */}
      <div 
        ref={containerRef}
        className={`relative bg-black border-b-4 ${classes.border} overflow-hidden ${
          isFullscreen 
            ? 'fixed inset-0 z-50 w-screen h-screen' 
            : 'aspect-video'
        }`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
            <div className={`${theme === 'brutal' ? 'bg-yellow-300' : theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ${classes.borderThick} ${theme === 'brutal' ? 'shadow-[8px_8px_0px_0px_#fff]' : classes.shadowLarge} p-6`}>
              <div className="flex items-center gap-4">
                <Loader2 className={`w-8 h-8 animate-spin ${classes.primaryText}`} strokeWidth={4} />
                <span className={`text-xl font-black uppercase ${classes.primaryText}`}>
                  LOADING EPIC VIDEO...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Player */}
        <div ref={playerRef} className="w-full h-full" />

        {/* Autoplay Overlay */}
        {showAutoplayOverlay && nextVideo && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30">
            <div className={`${theme === 'brutal' ? 'bg-yellow-300' : theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-6 ${theme === 'brutal' ? 'border-white shadow-[12px_12px_0px_0px_#fff]' : `${classes.border} ${classes.shadowLarge}`} p-8 max-w-md text-center ${theme === 'brutal' ? 'transform rotate-2' : ''}`}>
              <h3 className={`text-3xl font-black uppercase ${classes.primaryText} mb-6`}>
                NEXT EPIC VIDEO IN {countdown}!
              </h3>
              
              <div className={`${classes.cardBg} ${classes.borderThick} p-4 mb-6 ${theme === 'brutal' ? 'transform -rotate-2' : ''}`}>
                <div className={`relative w-full h-32 ${classes.border} border-2 mb-3 overflow-hidden`}>
                  <Image 
                    src={nextVideo.snippet.thumbnails.medium.url}
                    alt={nextVideo.snippet.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <p className={`font-black text-lg uppercase ${classes.primaryText} leading-tight`}>
                  {nextVideo.snippet.title.length > 40 
                    ? `${nextVideo.snippet.title.substring(0, 40)}...`
                    : nextVideo.snippet.title
                  }
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={playNextVideo}
                  className={`flex-1 ${theme === 'brutal' ? 'bg-green-400' : 'bg-green-500'} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 py-3 px-6 font-black text-lg uppercase ${theme === 'brutal' ? 'text-black' : 'text-white'}`}
                >
                  WATCH NOW!
                </button>
                <button
                  onClick={cancelAutoplay}
                  className={`flex-1 ${theme === 'brutal' ? 'bg-red-400' : 'bg-red-500'} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 py-3 px-6 font-black text-lg uppercase ${theme === 'brutal' ? 'text-black' : 'text-white'}`}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EPIC Custom Controls */}
        {showControls && isReady && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 transition-opacity duration-300">
            {/* Progress Bar */}
            <div className="mb-4">
              <div 
                className={`w-full h-4 ${progressColors.bg} border-2 ${progressColors.border} cursor-pointer relative`}
                onClick={handleProgressClick}
              >
                <div 
                  className={`h-full ${progressColors.progress} border-r-2 ${progressColors.border} transition-all duration-300`}
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div 
                  className={`absolute top-0 w-6 h-6 ${classes.cardBg} ${classes.border} border-2 ${classes.shadow} transform -translate-y-1 cursor-grab active:cursor-grabbing`}
                  style={{ left: `calc(${(currentTime / duration) * 100}% - 12px)` }}
                />
              </div>
              <div className="flex justify-between text-white font-black text-sm mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => skipTime(-10)}
                  className={`p-3 ${buttonColors.secondary} ${classes.border} border-2 ${classes.shadow} hover:shadow-[1px_1px_0px_0px_${theme === 'brutal' ? '#000' : theme === 'dark' ? '#374151' : '#e5e7eb'}] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
                >
                  <SkipBack className={`w-6 h-6 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className={`p-4 ${buttonColors.primary} ${classes.border} border-2 ${classes.shadow} hover:shadow-[2px_2px_0px_0px_${theme === 'brutal' ? '#000' : theme === 'dark' ? '#374151' : '#e5e7eb'}] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
                >
                  {isPlaying ? 
                    <Pause className="w-8 h-8 text-white fill-white" /> : 
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  }
                </button>
                
                <button 
                  onClick={() => skipTime(10)}
                  className={`p-3 ${buttonColors.secondary} ${classes.border} border-2 ${classes.shadow} hover:shadow-[1px_1px_0px_0px_${theme === 'brutal' ? '#000' : theme === 'dark' ? '#374151' : '#e5e7eb'}] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
                >
                  <SkipForward className={`w-6 h-6 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
                </button>

                {/* Volume Control */}
                <div className="flex items-center gap-3 ml-6">
                  <button 
                    onClick={toggleMute}
                    className={`p-2 ${buttonColors.success} ${classes.border} border-2 ${classes.shadow}`}
                  >
                    {isMuted ? 
                      <VolumeX className={`w-5 h-5 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} /> : 
                      <Volume2 className={`w-5 h-5 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
                    }
                  </button>
                  <div className={`w-24 h-3 ${volumeColors.bg} border-2 ${volumeColors.border} relative`}>
                    <div 
                      className={`h-full ${volumeColors.volume}`}
                      style={{ width: `${volume}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setPlayerVolume(parseInt(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Controls */}
              <div className="flex items-center gap-3">
                {/* Autoplay Toggle */}
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-sm uppercase">AUTOPLAY:</span>
                  <button
                    onClick={() => setAutoplayEnabled(!autoplayEnabled)}
                    className={`px-3 py-2 ${classes.border} border-2 font-black text-sm uppercase transition-all duration-150 ${
                      autoplayEnabled 
                        ? `${buttonColors.success} ${theme === 'brutal' ? 'text-black' : 'text-white'} ${classes.shadow}` 
                        : `bg-gray-600 text-white ${classes.shadow}`
                    }`}
                  >
                    {autoplayEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <button 
                  onClick={toggleFullscreen}
                  className={`p-2 ${buttonColors.warning} ${classes.border} border-2 ${classes.shadow} hover:shadow-[1px_1px_0px_0px_${theme === 'brutal' ? '#000' : theme === 'dark' ? '#374151' : '#e5e7eb'}] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150`}
                >
                  <Maximize className={`w-5 h-5 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Video Info Bar - Only show when not in fullscreen */}
      {!isFullscreen && (
        <div className={`p-4 ${theme === 'brutal' ? 'bg-gray-100' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} border-b-4 ${classes.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${theme === 'brutal' ? 'bg-red-500' : 'bg-red-600'} ${classes.border} border-2 px-3 py-1 text-white font-black text-sm uppercase`}>
                {(video as any).formattedDuration || formatTime(duration)}
              </div>
              <div className={`${theme === 'brutal' ? 'bg-blue-500' : 'bg-blue-600'} ${classes.border} border-2 px-3 py-1 text-white font-black text-sm uppercase`}>
                {(video as any).formattedViewCount || '0'} VIEWS
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className={`${buttonColors.success} ${classes.border} border-2 ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 px-4 py-2 font-black text-sm uppercase ${theme === 'brutal' ? 'text-black' : 'text-white'}`}>
                👍 EPIC LIKE
              </button>
              <button className={`${buttonColors.warning} ${classes.border} border-2 ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 px-4 py-2 font-black text-sm uppercase ${theme === 'brutal' ? 'text-black' : 'text-white'}`}>
                📤 SHARE NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}