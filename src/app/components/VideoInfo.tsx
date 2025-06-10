import { YouTubeVideo } from '../types/youtube';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { User, Calendar, Eye } from 'lucide-react';

interface VideoInfoProps {
  video: YouTubeVideo;
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const { snippet, statistics } = video;
  
  const publishedDate = formatDistanceToNow(new Date(snippet.publishedAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000]">
      {/* Video Title */}
      <div className="p-6 border-b-4 border-black bg-yellow-300">
        <h1 className="text-2xl font-black uppercase tracking-wide text-black leading-tight mb-4">
          {snippet.title}
        </h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_#000] overflow-hidden">
                {(video as any).channelAvatar ? (
                  <Image
                    src={(video as any).channelAvatar}
                    alt={snippet.channelTitle}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-400 flex items-center justify-center">
                    <User className="w-6 h-6 text-black" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-black text-black text-lg uppercase tracking-wide">
                  {snippet.channelTitle}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-black" />
                    <span className="font-bold uppercase text-black">
                      {publishedDate.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-black" />
                    <span className="font-bold uppercase text-black">
                      {(video as any).formattedViewCount || '0'} VIEWS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button className="bg-red-500 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 px-6 py-3 text-white font-black uppercase tracking-wide">
            SUBSCRIBE
          </button>
        </div>
      </div>
      
      {/* Video Description */}
      <div className="p-6">
        <h2 className="text-lg font-black uppercase tracking-wide text-black mb-4 border-b-2 border-black pb-2">
          DESCRIPTION
        </h2>
        <div className="bg-gray-100 border-2 border-black p-4">
          <p className="text-black font-bold whitespace-pre-wrap">
            {snippet.description.length > 500 
              ? `${snippet.description.substring(0, 500)}...`
              : snippet.description || 'No description available.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
