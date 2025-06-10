'use client';

import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/app/types/youtube';
import { YouTubeService } from '@/app/lib/youtube';
import VideoCard from './VideoCard';
import { Loader2 } from 'lucide-react';

export default function VideoGrid() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get popular videos first, fallback to search
        let response;
        try {
          response = await YouTubeService.getPopularVideos(24);
        } catch {
          response = await YouTubeService.searchVideos('popular music videos', 24);
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        <span className="ml-2 text-gray-600">Loading videos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-red-500 text-lg font-medium mb-2">
          Unable to load videos
        </div>
        <div className="text-gray-600 text-sm mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
