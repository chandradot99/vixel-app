'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import { YouTubeService } from '../lib/youtube';
import { YouTubeVideo } from '../types/youtube';
import { Loader2 } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import RelatedVideos from '../components/RelatedVideos';
import VideoInfo from '../components/VideoInfo';

function WatchPageContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v');
  
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) {
      setError('No video ID provided');
      setLoading(false);
      return;
    }

    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch video details
        const videoDetailsParams = new URLSearchParams({
          part: 'snippet,contentDetails,statistics',
          id: videoId,
          key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!,
        });

        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?${videoDetailsParams}`
        );

        if (!videoResponse.ok) {
          throw new Error('Failed to fetch video details');
        }

        const videoData = await videoResponse.json();
        
        if (videoData.items.length === 0) {
          throw new Error('Video not found');
        }

        const videoInfo = videoData.items[0];
        
        // Get channel avatar
        const channelDetails = await YouTubeService.getChannelDetails([videoInfo.snippet.channelId]);
        
        const videoWithFormatting = {
          ...videoInfo,
          formattedDuration: YouTubeService.parseDuration(videoInfo.contentDetails.duration),
          formattedViewCount: YouTubeService.formatViewCount(videoInfo.statistics.viewCount),
          channelAvatar: channelDetails[0]?.snippet?.thumbnails?.default?.url || null
        };

        setVideo(videoWithFormatting);

        // Fetch related videos
        const relatedVideosData = await YouTubeService.getPopularVideos(12);
        setRelatedVideos(relatedVideosData.items);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleSearch = (query: string) => {
    // Handle search functionality
    console.log('Search:', query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200">
        <Header onSearch={handleSearch} />
        <main className="pt-20">
          <div className="flex justify-center items-center min-h-96">
            <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
              <div className="flex items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-black" strokeWidth={4} />
                <span className="text-xl font-black uppercase text-black">LOADING EPIC VIDEO...</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200">
        <Header onSearch={handleSearch} />
        <main className="pt-20">
          <div className="flex justify-center items-center min-h-96">
            <div className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
              <div className="text-xl font-black uppercase text-black text-center">
                {error || 'VIDEO NOT FOUND!'}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200">
      <Header onSearch={handleSearch} />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Section */}
            <div className="lg:col-span-2">
              <VideoPlayer videoId={videoId!} video={video} />
              <VideoInfo video={video} />
            </div>
            
            {/* Related Videos Sidebar */}
            <div className="lg:col-span-1">
              <RelatedVideos videos={relatedVideos} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200 flex items-center justify-center">
        <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
          <Loader2 className="w-8 h-8 animate-spin text-black" strokeWidth={4} />
        </div>
      </div>
    }>
      <WatchPageContent />
    </Suspense>
  );
}
