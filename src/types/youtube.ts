import { APIError, EnrichedYouTubeVideo } from "@/lib/youtube";

export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    publishedAt: string;
    channelId: string;
  };
  formattedDuration: string;
  formattedViewCount: string;
  channelAvatar?: string;
}

export interface YouTubeSearchResponse {
  items: EnrichedYouTubeVideo[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  error?: APIError;
}
