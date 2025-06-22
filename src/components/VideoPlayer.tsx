'use client';

import { YouTubeVideo } from '@/types/youtube';

interface VideoPlayerProps {
  videoId: string;
  video: YouTubeVideo;
}

export default function VideoPlayer({ videoId, video }: VideoPlayerProps) {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] mb-6">
      {/* Video Player Container */}
      <div className="relative aspect-video bg-black border-b-4 border-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.snippet.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      {/* Video Controls/Info Bar */}
      <div className="p-4 bg-gray-100 border-b-4 border-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 border-2 border-black px-3 py-1 text-white font-black text-sm uppercase">
              {(video as any).formattedDuration || '0:00'}
            </div>
            <div className="bg-blue-500 border-2 border-black px-3 py-1 text-white font-black text-sm uppercase">
              {(video as any).formattedViewCount || '0'} VIEWS
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 px-4 py-2 font-black text-sm uppercase">
              👍 LIKE
            </button>
            <button className="bg-orange-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 px-4 py-2 font-black text-sm uppercase">
              📤 SHARE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
