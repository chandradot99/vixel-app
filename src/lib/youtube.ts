import { YouTubeSearchResponse, YouTubeVideo } from "@/types/youtube";
import { RegionHelper } from "./regionHelper";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

// User interface
export interface User {
  accessToken?: string;
}

// API Error interface
export interface APIError {
  type: "quota" | "network" | "not_found" | "unauthorized" | "unknown";
  message: string;
  userMessage: string;
  canRetry: boolean;
}

// YouTube API Response Types
interface YouTubeAPIError {
  error?: {
    message?: string;
    code?: number;
    errors?: Array<{
      domain: string;
      reason: string;
      message: string;
    }>;
  };
}

interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

interface YouTubeChannelDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

interface YouTubeVideoDetails {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    categoryId?: string;
    liveBroadcastContent: string;
  };
  contentDetails?: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
}

interface EnrichedYouTubeVideo extends YouTubeVideoDetails {
  formattedDuration: string;
  formattedViewCount: string;
  channelAvatar: string | null;
  channelSubscribers: string | null;
}

interface SearchResult {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
  };
}

// Service Response Types
interface ServiceResponse<T> {
  items: T[];
  pageInfo: PageInfo;
  error?: APIError;
}

// Extended Error with additional properties
interface ExtendedError extends Error {
  status?: number;
  data?: YouTubeAPIError;
  code?: string;
}

export class YouTubeService {
  private static buildApiUrl(
    endpoint: string,
    params: URLSearchParams,
    user?: User | null
  ): string {
    if (YOUTUBE_API_KEY) {
      params.set("key", YOUTUBE_API_KEY);
    } else {
      throw new Error("YouTube API key is required");
    }

    if (user?.accessToken && this.isUserSpecificEndpoint(endpoint)) {
      params.set("access_token", user.accessToken);
      params.delete("key"); // Remove API key when using user token
    }

    return `${YOUTUBE_API_BASE_URL}/${endpoint}?${params}`;
  }

  private static handleAPIError(error: unknown): APIError {
    const err = error as ExtendedError;

    // Handle quota exceeded
    if (
      err.message?.includes("quota") ||
      err.message?.includes("quotaExceeded") ||
      (err.status === 403 && err.message?.includes("exceeded"))
    ) {
      return {
        type: "quota",
        message: "YouTube API quota exceeded",
        userMessage:
          "We've hit our daily limit for YouTube videos! 😅 Try again tomorrow or check back later.",
        canRetry: false,
      };
    }

    // Handle network errors
    if (err.name === "NetworkError" || err.code === "NETWORK_ERROR") {
      return {
        type: "network",
        message: "Network connection failed",
        userMessage: "Connection problems! Check your internet and try again.",
        canRetry: true,
      };
    }

    // Handle 404 - Not Found
    if (err.status === 404) {
      return {
        type: "not_found",
        message: "Resource not found",
        userMessage:
          "Video not found! It might have been removed or made private.",
        canRetry: false,
      };
    }

    // Handle 401 - Unauthorized
    if (err.status === 401) {
      return {
        type: "unauthorized",
        message: "Unauthorized access",
        userMessage: "Authentication failed! Please sign in again.",
        canRetry: false,
      };
    }

    // Default unknown error
    return {
      type: "unknown",
      message: err.message || "Unknown error occurred",
      userMessage: "Something went wrong! Please try again in a few minutes.",
      canRetry: true,
    };
  }

  private static isUserSpecificEndpoint(endpoint: string): boolean {
    const userEndpoints = ["activities", "subscriptions", "playlists"];
    return userEndpoints.some((userEndpoint) =>
      endpoint.includes(userEndpoint)
    );
  }

  private static async fetchYouTubeApi(url: string): Promise<unknown> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData: YouTubeAPIError = await response
          .json()
          .catch(() => ({}));

        // Create error object with API response data
        const error: ExtendedError = new Error(
          errorData.error?.message ||
            `YouTube API error: ${response.status} - ${response.statusText}`
        );
        error.status = response.status;
        error.data = errorData;

        throw error;
      }

      return response.json();
    } catch (error) {
      // Re-throw with our error handling
      throw this.handleAPIError(error);
    }
  }

  static parseDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "0:00";

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  static formatViewCount(count: string): string {
    const num = parseInt(count, 10);
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return count;
  }

  static async getChannelDetails(
    channelIds: string[],
    user?: User | null
  ): Promise<YouTubeChannelDetails[]> {
    if (channelIds.length === 0) return [];

    const params = new URLSearchParams({
      part: "snippet,statistics",
      id: channelIds.join(","),
    });

    const url = this.buildApiUrl("channels", params, user);
    const data = (await this.fetchYouTubeApi(url)) as {
      items?: YouTubeChannelDetails[];
    };
    return data.items || [];
  }

  private static async enrichVideos(
    videos: YouTubeVideoDetails[],
    user?: User | null
  ): Promise<EnrichedYouTubeVideo[]> {
    if (videos.length === 0) return [];

    // Get unique channel IDs
    const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))];
    const channelDetails = await this.getChannelDetails(channelIds, user);

    return videos.map((video): EnrichedYouTubeVideo => {
      const channel = channelDetails.find(
        (ch) => ch.id === video.snippet.channelId
      );

      return {
        ...video,
        // Add formatted data
        formattedDuration: video.contentDetails
          ? this.parseDuration(video.contentDetails.duration)
          : "0:00",
        formattedViewCount: video.statistics
          ? this.formatViewCount(video.statistics.viewCount)
          : "0",
        // Add channel info
        channelAvatar: channel?.snippet?.thumbnails?.default?.url || null,
        channelSubscribers: channel?.statistics?.subscriberCount
          ? this.formatViewCount(channel.statistics.subscriberCount)
          : null,
      };
    });
  }

  private static filterShorts(
    videos: YouTubeVideoDetails[]
  ): YouTubeVideoDetails[] {
    return videos.filter((video) => {
      if (video.contentDetails?.duration) {
        const duration = video.contentDetails.duration;
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          const hours = parseInt(match[1] || "0", 10);
          const minutes = parseInt(match[2] || "0", 10);
          const seconds = parseInt(match[3] || "0", 10);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          return totalSeconds >= 60; // Exclude videos under 60 seconds
        }
      }
      return true;
    });
  }

  static async getPopularVideos(
    maxResults: number = 24,
    user?: User | null
  ): Promise<ServiceResponse<EnrichedYouTubeVideo>> {
    try {
      const regionCode = await RegionHelper.getRegionCode();

      const params = new URLSearchParams({
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        regionCode: regionCode,
        maxResults: maxResults.toString(),
      });

      const url = this.buildApiUrl("videos", params, user);
      const data = (await this.fetchYouTubeApi(url)) as {
        items: YouTubeVideoDetails[];
        pageInfo: PageInfo;
      };

      const filteredVideos = this.filterShorts(data.items);
      const enrichedVideos = await this.enrichVideos(filteredVideos, user);

      return {
        items: enrichedVideos,
        pageInfo: data.pageInfo,
      };
    } catch (error) {
      console.error("getPopularVideos error:", error);
      return {
        items: [],
        pageInfo: { totalResults: 0, resultsPerPage: 0 },
        error: error as APIError,
      };
    }
  }

  static async searchVideos(
    query: string = "trending",
    maxResults: number = 24,
    user?: User | null
  ): Promise<ServiceResponse<EnrichedYouTubeVideo>> {
    try {
      // Step 1: Search for videos
      const searchParams = new URLSearchParams({
        part: "snippet",
        type: "video",
        q: query,
        maxResults: maxResults.toString(),
        order: user?.accessToken ? "relevance" : "viewCount",
        videoDuration: "medium",
        publishedAfter: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      const searchUrl = this.buildApiUrl("search", searchParams, user);
      const searchData = (await this.fetchYouTubeApi(searchUrl)) as {
        items: SearchResult[];
        pageInfo: PageInfo;
      };

      if (!searchData.items?.length) {
        return {
          items: [],
          pageInfo: { totalResults: 0, resultsPerPage: 0 },
          error: {
            type: "not_found",
            message: "No videos found",
            userMessage: `No videos found for "${query}". Try different keywords!`,
            canRetry: false,
          },
        };
      }

      // Step 2: Get video details
      const videoIds = searchData.items.map((v) => v.id.videoId).join(",");
      const detailsParams = new URLSearchParams({
        part: "snippet,contentDetails,statistics",
        id: videoIds,
      });

      const detailsUrl = this.buildApiUrl("videos", detailsParams, user);
      const detailsData = (await this.fetchYouTubeApi(detailsUrl)) as {
        items: YouTubeVideoDetails[];
      };

      const filteredVideos = this.filterShorts(detailsData.items);
      const enrichedVideos = await this.enrichVideos(filteredVideos, user);

      return {
        items: enrichedVideos,
        pageInfo: searchData.pageInfo,
      };
    } catch (error) {
      console.error("searchVideos error:", error);
      return {
        items: [],
        pageInfo: { totalResults: 0, resultsPerPage: 0 },
        error: error as APIError,
      };
    }
  }

  static async getRelatedVideos(
    currentVideo: YouTubeVideo,
    maxResults: number = 12,
    user?: User | null
  ): Promise<YouTubeSearchResponse> {
    const currentVideoId =
      typeof currentVideo.id === "string"
        ? currentVideo.id
        : currentVideo.id?.videoId;

    try {
      // Strategy 1: Get video category for better matching
      let categoryId: string | null = null;
      if (!currentVideo.snippet.categoryId) {
        const videoParams = new URLSearchParams({
          part: "snippet",
          id: currentVideoId,
        });
        const videoUrl = this.buildApiUrl("videos", videoParams, user);
        const videoData = (await this.fetchYouTubeApi(videoUrl)) as {
          items?: Array<{ snippet: { categoryId: string } }>;
        };
        categoryId = videoData.items?.[0]?.snippet?.categoryId || null;
      } else {
        categoryId = currentVideo.snippet.categoryId;
      }

      const relatedVideos: SearchResult[] = [];

      // Method 1: Category-based videos (40% of results)
      if (categoryId) {
        await this.addCategoryVideos(
          relatedVideos,
          categoryId,
          Math.ceil(maxResults * 0.4),
          currentVideoId,
          user
        );
      }

      // Method 2: Keyword-based videos (35% of results)
      await this.addKeywordVideos(
        relatedVideos,
        currentVideo.snippet.title,
        Math.ceil(maxResults * 0.35),
        currentVideoId,
        user
      );

      // Method 3: Channel videos (25% of results)
      await this.addChannelVideos(
        relatedVideos,
        currentVideo.snippet.channelId,
        Math.ceil(maxResults * 0.25),
        currentVideoId,
        user
      );

      // Remove duplicates and limit results
      const uniqueVideos = this.removeDuplicateVideos(relatedVideos).slice(
        0,
        maxResults
      );

      if (uniqueVideos.length === 0) {
        // Fallback to popular videos
        const fallback = await this.getPopularVideos(maxResults, user);
        return {
          items: fallback.items.filter((v) => v.id !== currentVideoId),
          pageInfo: fallback.pageInfo,
        };
      }

      // Get full video details
      const videoIds = uniqueVideos.map((v) => v.id.videoId).join(",");
      const detailsParams = new URLSearchParams({
        part: "snippet,contentDetails,statistics",
        id: videoIds,
      });

      const detailsUrl = this.buildApiUrl("videos", detailsParams, user);
      const detailsData = (await this.fetchYouTubeApi(detailsUrl)) as {
        items: YouTubeVideoDetails[];
      };

      const enrichedVideos = await this.enrichVideos(detailsData.items, user);

      return {
        items: enrichedVideos,
        pageInfo: {
          totalResults: enrichedVideos.length,
          resultsPerPage: enrichedVideos.length,
        },
      };
    } catch (error) {
      console.error("Error fetching related videos:", error);

      // Emergency fallback
      const fallback = await this.getPopularVideos(maxResults, user);
      return {
        items: fallback.items.filter((v) => v.id !== currentVideoId),
        pageInfo: fallback.pageInfo,
      };
    }
  }

  static async getVideoById(
    videoId: string,
    user?: User | null
  ): Promise<EnrichedYouTubeVideo | null> {
    try {
      const params = new URLSearchParams({
        part: "snippet,contentDetails,statistics",
        id: videoId,
      });

      const url = this.buildApiUrl("videos", params, user);
      const data = (await this.fetchYouTubeApi(url)) as {
        items?: YouTubeVideoDetails[];
      };

      if (!data.items?.length) {
        return null;
      }

      const enrichedVideos = await this.enrichVideos([data.items[0]], user);
      return enrichedVideos[0];
    } catch (error) {
      console.error("getVideoById error:", error);
      return null;
    }
  }

  // Helper methods for related videos
  private static async addCategoryVideos(
    relatedVideos: SearchResult[],
    categoryId: string,
    count: number,
    excludeId: string,
    user?: User | null
  ): Promise<void> {
    try {
      const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        videoCategoryId: categoryId,
        maxResults: count.toString(),
        order: "relevance",
        videoDuration: "medium",
        publishedAfter: new Date(
          Date.now() - 90 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      const url = this.buildApiUrl("search", params, user);
      const data = (await this.fetchYouTubeApi(url)) as {
        items: SearchResult[];
      };

      relatedVideos.push(
        ...data.items.filter((v) => v.id.videoId !== excludeId)
      );
    } catch (error) {
      console.warn("Category videos fetch failed:", error);
    }
  }

  private static async addKeywordVideos(
    relatedVideos: SearchResult[],
    title: string,
    count: number,
    excludeId: string,
    user?: User | null
  ): Promise<void> {
    try {
      const keywords = title
        .replace(/[^\w\s]/gi, "")
        .split(" ")
        .filter((word: string) => word.length > 3)
        .slice(0, 2)
        .join(" ");

      if (!keywords) return;

      const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        q: keywords,
        maxResults: count.toString(),
        order: "relevance",
        videoDuration: "medium",
        publishedAfter: new Date(
          Date.now() - 180 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });

      const url = this.buildApiUrl("search", params, user);
      const data = (await this.fetchYouTubeApi(url)) as {
        items: SearchResult[];
      };

      relatedVideos.push(
        ...data.items.filter((v) => v.id.videoId !== excludeId)
      );
    } catch (error) {
      console.warn("Keyword videos fetch failed:", error);
    }
  }

  private static async addChannelVideos(
    relatedVideos: SearchResult[],
    channelId: string,
    count: number,
    excludeId: string,
    user?: User | null
  ): Promise<void> {
    try {
      const params = new URLSearchParams({
        part: "snippet",
        type: "video",
        channelId: channelId,
        maxResults: count.toString(),
        order: "date",
        videoDuration: "medium",
      });

      const url = this.buildApiUrl("search", params, user);
      const data = (await this.fetchYouTubeApi(url)) as {
        items: SearchResult[];
      };

      relatedVideos.push(
        ...data.items.filter((v) => v.id.videoId !== excludeId)
      );
    } catch (error) {
      console.warn("Channel videos fetch failed:", error);
    }
  }

  private static removeDuplicateVideos(videos: SearchResult[]): SearchResult[] {
    return videos.filter(
      (video, index, self) =>
        index === self.findIndex((v) => v.id.videoId === video.id.videoId)
    );
  }

  // User-specific methods
  static async getUserLikedVideos(
    user: User,
    maxResults: number = 50
  ): Promise<EnrichedYouTubeVideo[]> {
    if (!user.accessToken) {
      throw new Error("User must be authenticated");
    }

    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      myRating: "like",
      maxResults: maxResults.toString(),
    });

    const url = this.buildApiUrl("videos", params, user);
    const data = (await this.fetchYouTubeApi(url)) as {
      items: YouTubeVideoDetails[];
    };

    return this.enrichVideos(data.items || [], user);
  }

  static async getUserSubscriptions(
    user: User,
    maxResults: number = 50
  ): Promise<unknown[]> {
    if (!user.accessToken) {
      throw new Error("User must be authenticated");
    }

    const params = new URLSearchParams({
      part: "snippet",
      mine: "true",
      maxResults: maxResults.toString(),
    });

    const url = this.buildApiUrl("subscriptions", params, user);
    const data = (await this.fetchYouTubeApi(url)) as { items?: unknown[] };

    return data.items || [];
  }

  static async getPersonalizedRecommendations(
    user: User,
    maxResults: number = 24
  ): Promise<YouTubeSearchResponse> {
    if (!user.accessToken) {
      const popularResult = await this.getPopularVideos(maxResults);
      return {
        items: popularResult.items,
        pageInfo: popularResult.pageInfo,
      };
    }

    try {
      const params = new URLSearchParams({
        part: "snippet,contentDetails",
        home: "true",
        maxResults: maxResults.toString(),
      });

      const url = this.buildApiUrl("activities", params, user);
      const data = (await this.fetchYouTubeApi(url)) as {
        items?: YouTubeVideoDetails[];
        pageInfo: PageInfo;
      };

      if (!data.items?.length) {
        const popularResult = await this.getPopularVideos(maxResults, user);
        return {
          items: popularResult.items,
          pageInfo: popularResult.pageInfo,
        };
      }

      const enrichedVideos = await this.enrichVideos(data.items, user);

      return {
        items: enrichedVideos,
        pageInfo: data.pageInfo,
      };
    } catch (error) {
      console.warn(
        "Personalized recommendations failed, falling back to popular:",
        error
      );
      const popularResult = await this.getPopularVideos(maxResults, user);
      return {
        items: popularResult.items,
        pageInfo: popularResult.pageInfo,
      };
    }
  }

  static async getVideosByCategory(
    categoryId: string,
    maxResults: number = 24,
    user?: User | null
  ): Promise<ServiceResponse<EnrichedYouTubeVideo>> {
    try {
      if (categoryId === "all") {
        return this.getPopularVideos(maxResults, user);
      }

      const regionCode = await RegionHelper.getRegionCode();
      const popularParams = new URLSearchParams({
        part: "snippet,contentDetails,statistics",
        chart: "mostPopular",
        videoCategoryId: categoryId,
        regionCode: regionCode,
        maxResults: maxResults.toString(),
      });

      const popularUrl = this.buildApiUrl("videos", popularParams, user);

      try {
        const popularData = (await this.fetchYouTubeApi(popularUrl)) as {
          items: YouTubeVideoDetails[];
          pageInfo: PageInfo;
        };

        if (popularData.items?.length > 0) {
          const filteredVideos = this.filterShorts(popularData.items);
          const enrichedVideos = await this.enrichVideos(filteredVideos, user);

          return {
            items: enrichedVideos,
            pageInfo: popularData.pageInfo,
          };
        }
      } catch (categoryError) {
        console.warn(
          `Category ${categoryId} failed, trying search fallback:`,
          categoryError
        );
      }

      // Fallback to search
      const categoryKeywords = this.getCategoryKeywords(categoryId);
      if (categoryKeywords) {
        return this.searchVideos(categoryKeywords, maxResults, user);
      }

      // Final fallback
      return this.getPopularVideos(maxResults, user);
    } catch (error) {
      console.error(`getVideosByCategory error for ${categoryId}:`, error);
      return {
        items: [],
        pageInfo: { totalResults: 0, resultsPerPage: 0 },
        error: error as APIError,
      };
    }
  }

  private static getCategoryKeywords(categoryId: string): string {
    const categoryMap: Record<string, string> = {
      "10": "music songs artist album",
      "20": "gaming gameplay games video game",
      "22": "vlog daily life lifestyle",
      "23": "comedy funny humor jokes",
      "24": "entertainment shows movies",
      "25": "news current events politics",
      "26": "how to tutorial guide diy",
      "27": "education learning science",
      "28": "technology tech review gadgets",
    };

    return categoryMap[categoryId] || "trending";
  }
}
