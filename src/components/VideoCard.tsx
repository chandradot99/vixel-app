import { YouTubeVideo } from '@/types/youtube';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Play, User, Clock } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface VideoCardProps {
  video: YouTubeVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { classes } = useTheme();
  const { snippet } = video;
  const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
  
  const publishedDate = formatDistanceToNow(new Date(snippet.publishedAt), {
    addSuffix: true,
  });

  const truncateTitle = (title: string, maxLength: number = 40) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Random bright colors for variety (theme-aware)
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const duration = (video as YouTubeVideo).formattedDuration || '0:00';
  const viewCount = (video as YouTubeVideo).formattedViewCount || '---';

  return (
    <div className="group cursor-pointer transform hover:translate-x-[3px] hover:translate-y-[3px] transition-transform duration-150">
      <Link href={`/watch?v=${videoId}`}>
        <div className={`${classes.cardBg} ${classes.borderThick} ${classes.shadowLarge} group-hover:shadow-[3px_3px_0px_0px_${classes.border.includes('gray-600') ? '#4b5563' : classes.border.includes('gray-200') ? '#e5e7eb' : '#000'}] transition-shadow duration-150`}>
          
          {/* Thumbnail */}
          <div className={`relative aspect-video border-b-3 ${classes.border} bg-gray-200 overflow-hidden`}>
            <Image
              src={snippet.thumbnails.medium.url}
              alt={snippet.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 font-black border-2 border-black uppercase flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {duration}
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
              <div className={`w-15 h-15 ${classes.cardBg} ${classes.borderThick} ${classes.shadow} flex items-center justify-center`}>
                <Play className={`w-7 h-7 ${classes.primaryText} fill-current ml-0.5`} />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3">
            <div className="flex gap-2.5">
              {/* Channel Avatar */}
              <div className={`flex-shrink-0 w-9 h-9 ${randomColor} border-2 ${classes.border} flex items-center justify-center shadow-[2px_2px_0px_0px_${classes.border.includes('gray-600') ? '#4b5563' : classes.border.includes('gray-200') ? '#e5e7eb' : '#000'}]`}>
                {(video as YouTubeVideo).channelAvatar ? (
                  <Image
                    src={(video as YouTubeVideo).channelAvatar || ""}
                    alt={snippet.channelTitle}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4.5 h-4.5 text-black" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-black ${classes.primaryText} text-base line-clamp-2 mb-1.5 uppercase tracking-wide leading-tight`}>
                  {truncateTitle(snippet.title)}
                </h3>
                <p className={`${classes.primaryText} text-xs font-bold uppercase mb-0.5 tracking-wide`}>
                  {snippet.channelTitle}
                </p>
                <p className={`${classes.secondaryText} text-xs font-bold uppercase`}>
                  {viewCount} VIEWS • {publishedDate.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}