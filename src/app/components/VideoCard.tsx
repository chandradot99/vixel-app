import { YouTubeVideo } from '@/app/types/youtube';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Play, User, MoreVertical, Eye, Heart, Clock } from 'lucide-react';

interface VideoCardProps {
  video: YouTubeVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { snippet } = video;
  
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
  const duration = (video as any).formattedDuration || '0:00';
  const viewCount = (video as any).formattedViewCount || '---';

  return (
    <div className="group cursor-pointer transform hover:translate-x-[4px] hover:translate-y-[4px] transition-transform duration-150">
      <Link href={`/watch?v=${video.id}`}>
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#000] transition-shadow duration-150">
          
          {/* Thumbnail */}
          <div className="relative aspect-video border-b-4 border-black bg-gray-200 overflow-hidden">
            <Image
              src={snippet.thumbnails.medium.url}
              alt={snippet.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* 🔥 REAL DURATION BADGE */}
            <div className="absolute bottom-3 right-3 bg-red-500 text-white text-sm px-3 py-1 font-black border-2 border-black uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
              <div className="w-20 h-20 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center">
                <Play className="w-10 h-10 text-black fill-black ml-1" />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="flex gap-3 mb-3">
              {/* Channel Avatar */}
              <div className={`flex-shrink-0 w-12 h-12 ${randomColor} border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]`}>
                <User className="w-6 h-6 text-black" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-black text-lg line-clamp-2 mb-2 uppercase tracking-wide leading-tight">
                  {truncateTitle(snippet.title)}
                </h3>
                <p className="text-black text-sm font-bold uppercase mb-1 tracking-wide">
                  {snippet.channelTitle}
                </p>
                {/* 🔥 REAL VIEW COUNT */}
                <p className="text-gray-700 text-sm font-bold uppercase">
                  {viewCount} VIEWS • {publishedDate.toUpperCase()}
                </p>
              </div>
              
              {/* More options */}
              <button className="p-2 bg-gray-200 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150">
                <MoreVertical className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-3 border-t-2 border-black">
              <button className="flex-1 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 py-2 px-3 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-black" />
                <span className="font-black text-xs uppercase">LIKE</span>
              </button>
              <button className="flex-1 bg-blue-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 py-2 px-3 flex items-center justify-center gap-2">
                <Eye className="w-4 h-4 text-black" />
                <span className="font-black text-xs uppercase">WATCH</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}