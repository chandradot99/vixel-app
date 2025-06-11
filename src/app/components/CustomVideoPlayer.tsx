'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { YouTubeVideo } from '../types/youtube';
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

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] mb-6 relative">
      {/* Video Player Container */}
      <div 
        ref={containerRef}
        className={`relative bg-black border-b-4 border-black overflow-hidden ${
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
            <div className="bg-yellow-300 border-4 border-white shadow-[8px_8px_0px_0px_#fff] p-6">
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-black" strokeWidth={4} />
                <span className="text-xl font-black uppercase text-black">
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
            <div className="bg-yellow-300 border-6 border-white shadow-[12px_12px_0px_0px_#fff] p-8 max-w-md text-center transform rotate-2">
              <h3 className="text-3xl font-black uppercase text-black mb-6">
                NEXT EPIC VIDEO IN {countdown}!
              </h3>
              
              <div className="bg-white border-4 border-black p-4 mb-6 transform -rotate-2">
                <div className="relative w-full h-32 border-2 border-black mb-3 overflow-hidden">
                  <Image 
                    src={nextVideo.snippet.thumbnails.medium.url}
                    alt={nextVideo.snippet.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <p className="font-black text-lg uppercase text-black leading-tight">
                  {nextVideo.snippet.title.length > 40 
                    ? `${nextVideo.snippet.title.substring(0, 40)}...`
                    : nextVideo.snippet.title
                  }
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={playNextVideo}
                  className="flex-1 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 py-3 px-6 font-black text-lg uppercase"
                >
                  WATCH NOW!
                </button>
                <button
                  onClick={cancelAutoplay}
                  className="flex-1 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 py-3 px-6 font-black text-lg uppercase"
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
                className="w-full h-4 bg-gray-800 border-2 border-white cursor-pointer relative"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-yellow-400 border-r-2 border-white transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <div 
                  className="absolute top-0 w-6 h-6 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] transform -translate-y-1 cursor-grab active:cursor-grabbing"
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
                  className="p-3 bg-blue-400 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer"
                >
                  <SkipBack className="w-6 h-6 text-black" />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="p-4 bg-red-500 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer"
                >
                  {isPlaying ? 
                    <Pause className="w-8 h-8 text-white fill-white" /> : 
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  }
                </button>
                
                <button 
                  onClick={() => skipTime(10)}
                  className="p-3 bg-blue-400 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-pointer"
                >
                  <SkipForward className="w-6 h-6 text-black" />
                </button>

                {/* Volume Control */}
                <div className="flex items-center gap-3 ml-6">
                  <button 
                    onClick={toggleMute}
                    className="p-2 bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                  >
                    {isMuted ? 
                      <VolumeX className="w-5 h-5 text-black" /> : 
                      <Volume2 className="w-5 h-5 text-black" />
                    }
                  </button>
                  <div className="w-24 h-3 bg-gray-800 border-2 border-white relative">
                    <div 
                      className="h-full bg-green-400"
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
                    className={`px-3 py-2 border-2 border-black font-black text-sm uppercase transition-all duration-150 cursor-pointer ${
                      autoplayEnabled 
                        ? 'bg-green-400 text-black shadow-[2px_2px_0px_0px_#000]' 
                        : 'bg-gray-600 text-white shadow-[2px_2px_0px_0px_#000]'
                    }`}
                  >
                    {autoplayEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
                
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 bg-orange-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 cursor-pointer"
                >
                  <Maximize className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Video Info Bar - Only show when not in fullscreen */}
      {!isFullscreen && (
        <div className="p-4 bg-gray-100 border-b-4 border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 border-2 border-black px-3 py-1 text-white font-black text-sm uppercase">
                {(video as any).formattedDuration || formatTime(duration)}
              </div>
              <div className="bg-blue-500 border-2 border-black px-3 py-1 text-white font-black text-sm uppercase">
                {(video as any).formattedViewCount || '0'} VIEWS
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 px-4 py-2 font-black text-sm uppercase">
                👍 EPIC LIKE
              </button>
              <button className="bg-orange-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 px-4 py-2 font-black text-sm uppercase">
                📤 SHARE NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}