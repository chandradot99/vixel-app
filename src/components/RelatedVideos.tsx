import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { User, Clock } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { EnrichedYouTubeVideo } from '@/lib/youtube';

interface RelatedVideosProps {
  videos: EnrichedYouTubeVideo[];
}

export default function RelatedVideos({ videos }: RelatedVideosProps) {
  const { theme, classes } = useTheme();

  // Theme-aware helper functions
  const getHeaderBg = () => {
    if (theme === 'dark') return 'bg-blue-700';
    if (theme === 'light') return 'bg-blue-100';
    return 'bg-cyan-300';
  };

  const getVideoCardHover = () => {
    if (theme === 'dark') return 'hover:bg-gray-700';
    if (theme === 'light') return 'hover:bg-gray-50';
    return 'hover:bg-yellow-100';
  };

  const getTitleHover = () => {
    if (theme === 'dark') return 'group-hover:text-blue-400';
    if (theme === 'light') return 'group-hover:text-blue-600';
    return 'group-hover:text-red-600';
  };

  const getChannelAvatarBg = () => {
    if (theme === 'dark') return 'bg-purple-600';
    if (theme === 'light') return 'bg-purple-500';
    return 'bg-blue-400';
  };

  const getDurationBadgeBg = () => {
    if (theme === 'dark') return 'bg-red-700 border-gray-600';
    if (theme === 'light') return 'bg-red-600 border-gray-400';
    return 'bg-red-500 border-black';
  };

  return (
    <div className={`${classes.cardBg} ${classes.borderThick} ${classes.shadowLarge}`}>
      {/* Header */}
      <div className={`p-4 ${getHeaderBg()} border-b-4 ${classes.border}`}>
        <h2 className={`text-xl font-black uppercase tracking-wide ${classes.primaryText}`}>
          🔥 MORE EPIC VIDEOS
        </h2>
      </div>
      
      {/* Videos List */}
      <div className="p-4 space-y-4">
        {videos.slice(0, 10).map((video) => {
          const videoId = video.id;
          const publishedDate = formatDistanceToNow(new Date(video.snippet.publishedAt), {
            addSuffix: true,
          });
          
          return (
            <Link 
              key={videoId} 
              href={`/watch?v=${videoId}`}
              className="block group"
            >
              <div className={`flex gap-3 p-3 border-2 ${classes.border} ${getVideoCardHover()} transition-colors duration-150`}>
                {/* Thumbnail */}
                <div className={`relative w-32 h-20 flex-shrink-0 border-2 ${classes.border} overflow-hidden`}>
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className={`absolute bottom-1 right-1 ${getDurationBadgeBg()} text-white text-xs px-1 py-0.5 font-black border`}>
                    <Clock className="w-2 h-2 inline mr-1" />
                    {(video as EnrichedYouTubeVideo).formattedDuration || '0:00'}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black ${classes.primaryText} text-sm leading-tight mb-2 uppercase tracking-wide line-clamp-2 ${getTitleHover()} transition-colors`}>
                    {video.snippet.title.length > 60 
                      ? `${video.snippet.title.substring(0, 60)}...`
                      : video.snippet.title
                    }
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 border ${classes.border} overflow-hidden flex-shrink-0`}>
                      {(video as EnrichedYouTubeVideo).channelAvatar ? (
                        <Image
                          src={(video as EnrichedYouTubeVideo).channelAvatar || ""}
                          alt={video.snippet.channelTitle}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full ${getChannelAvatarBg()} flex items-center justify-center`}>
                          <User className={`w-3 h-3 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
                        </div>
                      )}
                    </div>
                    <p className={`${classes.primaryText} text-xs font-bold uppercase truncate`}>
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                  
                  <p className={`${classes.secondaryText} text-xs font-bold uppercase`}>
                    {(video as EnrichedYouTubeVideo).formattedViewCount || '0'} VIEWS • {publishedDate.toUpperCase()}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}