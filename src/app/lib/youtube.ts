import { YouTubeSearchResponse } from "../types/youtube";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export class YouTubeService {
  static async searchVideos(
    query: string = "trending",
    maxResults: number = 24
  ): Promise<YouTubeSearchResponse> {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const params = new URLSearchParams({
      part: "snippet",
      type: "video",
      q: query,
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY,
      order: "relevance",
      publishedAfter: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // Last 30 days
    });

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${params}`);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    return response.json();
  }

  static async getPopularVideos(
    maxResults: number = 24
  ): Promise<YouTubeSearchResponse> {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const params = new URLSearchParams({
      part: "snippet",
      chart: "mostPopular",
      regionCode: "US",
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    return response.json();
  }
}
