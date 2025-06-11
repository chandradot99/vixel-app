import { YouTubeVideo } from '../types/youtube';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { User, Clock } from 'lucide-react';

interface RelatedVideosProps {
  videos: YouTubeVideo[];
}

export default function RelatedVideos({ videos }: RelatedVideosProps) {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000]">
      {/* Header */}
      <div className="p-4 bg-cyan-300 border-b-4 border-black">
        <h2 className="text-xl font-black uppercase tracking-wide text-black">
          🔥 MORE EPIC VIDEOS
        </h2>
      </div>
      
      {/* Videos List */}
      <div className="p-4 space-y-4">
        {videos.slice(0, 10).map((video) => {
          const videoId = typeof video.id === 'string' ? video.id : video.id.videoId;
          const publishedDate = formatDistanceToNow(new Date(video.snippet.publishedAt), {
            addSuffix: true,
          });
          
          return (
            <Link 
              key={videoId} 
              href={`/watch?v=${videoId}`}
              className="block group"
            >
              <div className="flex gap-3 p-3 border-2 border-black hover:bg-yellow-100 transition-colors duration-150">
                {/* Thumbnail */}
                <div className="relative w-32 h-20 flex-shrink-0 border-2 border-black overflow-hidden">
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className="absolute bottom-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 font-black border border-black">
                    <Clock className="w-2 h-2 inline mr-1" />
                    {(video as any).formattedDuration || '0:00'}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-black text-sm leading-tight mb-2 uppercase tracking-wide line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.snippet.title.length > 60 
                      ? `${video.snippet.title.substring(0, 60)}...`
                      : video.snippet.title
                    }
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 border border-black overflow-hidden flex-shrink-0">
                      {(video as any).channelAvatar ? (
                        <Image
                          src={(video as any).channelAvatar}
                          alt={video.snippet.channelTitle}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-400 flex items-center justify-center">
                          <User className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                    <p className="text-black text-xs font-bold uppercase truncate">
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 text-xs font-bold uppercase">
                    {(video as any).formattedViewCount || '0'} VIEWS • {publishedDate.toUpperCase()}
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
