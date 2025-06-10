import { YouTubeVideo } from '@/app/types/youtube';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface VideoCardProps {
  video: YouTubeVideo;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { snippet } = video;
  const videoId = video.id;
  
  const publishedDate = formatDistanceToNow(new Date(snippet.publishedAt), {
    addSuffix: true,
  });

  const truncateTitle = (title: string, maxLength: number = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <div className="group cursor-pointer">
      <Link href={`/watch?v=${videoId}`}>
        <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={snippet.thumbnails.medium.url}
            alt={snippet.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Duration badge - we'll add this later when we get video details */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            0:00
          </div>
        </div>
        
        <div className="flex gap-3">
          {/* Channel Avatar Placeholder */}
          <div className="flex-shrink-0 w-9 h-9 bg-gray-300 rounded-full"></div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
              {truncateTitle(snippet.title)}
            </h3>
            <p className="text-gray-600 text-xs mb-1 hover:text-gray-800 transition-colors">
              {snippet.channelTitle}
            </p>
            <p className="text-gray-600 text-xs">
              {publishedDate}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
