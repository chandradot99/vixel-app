// Clean Video Card Component - Neubrutalism Style
// src/components/VideoCard.tsx
import { YouTubeVideo } from '@/app/types/youtube';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Play, User, Clock } from 'lucide-react';

interface VideoCardProps {
  video: YouTubeVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { snippet } = video;
  // Handle both search results (video.id.videoId) and popular videos (video.id)
  const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
  
  const publishedDate = formatDistanceToNow(new Date(snippet.publishedAt), {
    addSuffix: true,
  });

  const truncateTitle = (title: string, maxLength: number = 50) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Random bright colors for variety
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Get formatted duration and view count
  const duration = video.formattedDuration || '0:00';
  const viewCount = video.formattedViewCount || '---';

  return (
    <div className="group cursor-pointer transform hover:translate-x-[3px] hover:translate-y-[3px] transition-transform duration-150">
      <Link href={`/watch?v=${videoId}`}>
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] group-hover:shadow-[3px_3px_0px_0px_#000] transition-shadow duration-150">
          
          {/* Thumbnail */}
          <div className="relative aspect-video border-b-3 border-black bg-gray-200 overflow-hidden">
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
              <div className="w-15 h-15 bg-white border-3 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center">
                <Play className="w-7 h-7 text-black fill-black ml-0.5" />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3">
            <div className="flex gap-2.5">
              {/* Channel Avatar */}
              <div className="flex-shrink-0 w-9 h-9 border-2 border-black shadow-[2px_2px_0px_0px_#000] overflow-hidden">
                {video.channelAvatar ? (
                  <Image
                    src={video.channelAvatar}
                    alt={snippet.channelTitle}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${randomColor} flex items-center justify-center`}>
                    <User className="w-4.5 h-4.5 text-black" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-black text-base line-clamp-2 mb-1.5 uppercase tracking-wide leading-tight">
                  {truncateTitle(snippet.title, 40)}
                </h3>
                <p className="text-black text-xs font-bold uppercase mb-0.5 tracking-wide">
                  {snippet.channelTitle}
                </p>
                <p className="text-gray-700 text-xs font-bold uppercase">
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