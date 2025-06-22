'use client';

import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/types/youtube';
import { YouTubeService } from '@/lib/youtube';
import VideoCard from './VideoCard';
import { Loader2, AlertTriangle, Zap } from 'lucide-react';

interface VideoGridProps {
  searchQuery?: string;
}

export default function VideoGrid({ searchQuery }: VideoGridProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (searchQuery) {
          response = await YouTubeService.searchVideos(searchQuery, 24);
        } else {
          try {
            response = await YouTubeService.getPopularVideos(24);
          } catch {
            response = await YouTubeService.searchVideos('trending videos', 24);
          }
        }
        
        setVideos(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch videos');
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="bg-yellow-300 border-6 border-black shadow-[12px_12px_0px_0px_#000] p-12 transform -rotate-3">
          <div className="flex items-center gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-black" strokeWidth={4} />
            <div>
              <div className="text-2xl font-black uppercase tracking-wider text-black mb-2">
                LOADING EPIC VIDEOS...
              </div>
              <div className="flex gap-2">
                <Zap className="w-6 h-6 text-black" />
                <Zap className="w-6 h-6 text-black" />
                <Zap className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="bg-red-400 border-6 border-black shadow-[12px_12px_0px_0px_#000] p-12 max-w-lg transform rotate-2">
          <AlertTriangle className="w-16 h-16 text-black mx-auto mb-6" strokeWidth={4} />
          <div className="text-black text-2xl font-black uppercase tracking-wider mb-4">
            VIDEOS FAILED TO LOAD!
          </div>
          <div className="text-black text-lg font-bold mb-8 uppercase">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 text-black font-black uppercase tracking-wider text-lg"
          >
            TRY AGAIN NOW!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
