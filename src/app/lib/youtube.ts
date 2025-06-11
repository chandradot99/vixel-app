// Updated YouTube types to include channel avatars
// src/types/youtube.ts
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
  contentDetails?: {
    duration: string; // ISO 8601 format (PT4M13S)
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  channelAvatar?: string; // Added for channel avatar
}

export interface YouTubeSearchVideo {
  id: {
    videoId: string;
  };
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
}

export interface YouTubeSearchResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// Updated YouTube Service with channel avatar support
// src/lib/youtube.ts
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export class YouTubeService {
  // Helper function to parse ISO 8601 duration
  static parseDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "0:00";

    const hours = parseInt(match[1] || "0");
    const minutes = parseInt(match[2] || "0");
    const seconds = parseInt(match[3] || "0");

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  // Helper function to format view count
  static formatViewCount(count: string): string {
    const num = parseInt(count);
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return count;
  }

  // NEW: Get channel details for avatars
  static async getChannelDetails(channelIds: string[]): Promise<any[]> {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const params = new URLSearchParams({
      part: "snippet",
      id: channelIds.join(","),
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/channels?${params}`);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  }

  // Updated getPopularVideos with channel avatars
  static async getPopularVideos(
    maxResults: number = 24
  ): Promise<YouTubeSearchResponse> {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode: "IN",
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to match our expected format and add formatted data
    const transformedItems = data.items
      .filter((video: YouTubeVideo) => {
        // Filter out shorts (videos under 60 seconds)
        if (video.contentDetails) {
          const duration = video.contentDetails.duration;
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          if (match) {
            const hours = parseInt(match[1] || "0");
            const minutes = parseInt(match[2] || "0");
            const seconds = parseInt(match[3] || "0");
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            return totalSeconds >= 60; // Exclude videos under 60 seconds
          }
        }
        return true;
      })
      .map((video: YouTubeVideo) => ({
        ...video,
        // Add formatted duration and view count
        formattedDuration: video.contentDetails
          ? this.parseDuration(video.contentDetails.duration)
          : "0:00",
        formattedViewCount: video.statistics
          ? this.formatViewCount(video.statistics.viewCount)
          : "0",
      }));

    // Fetch channel avatars
    try {
      const channelIds = transformedItems.map(
        (video: YouTubeVideo) => video.snippet.channelId
      );
      const uniqueChannelIds = [...new Set(channelIds)]; // Remove duplicates
      const channelDetails = await this.getChannelDetails(
        uniqueChannelIds as string[]
      );

      // Add channel avatars to videos
      const videosWithAvatars = transformedItems.map((video: YouTubeVideo) => {
        const channel = channelDetails.find(
          (ch) => ch.id === video.snippet.channelId
        );
        return {
          ...video,
          channelAvatar: channel?.snippet?.thumbnails?.default?.url || null,
        };
      });

      return {
        items: videosWithAvatars,
        pageInfo: data.pageInfo,
      };
    } catch (error) {
      console.warn("Failed to fetch channel details:", error);
      return {
        items: transformedItems,
        pageInfo: data.pageInfo,
      };
    }
  }

  // Updated search method with channel avatars
  static async searchVideos(
    query: string = "trending",
    maxResults: number = 24
  ): Promise<YouTubeSearchResponse> {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    // First, search for videos
    const searchParams = new URLSearchParams({
      part: "snippet",
      type: "video",
      q: query,
      maxResults: maxResults.toString(),
      key: YOUTUBE_API_KEY,
      order: "relevance",
      publishedAfter: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      videoDuration: "medium", // Exclude shorts
    });

    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?${searchParams}`
    );

    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // Get video details for the search results
    const videoIds = searchData.items
      .map((video: YouTubeSearchVideo) => video.id.videoId)
      .join(",");

    const detailsParams = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      id: videoIds,
      key: YOUTUBE_API_KEY,
    });

    try {
      const detailsResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/videos?${detailsParams}`
      );

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();

        // Merge search results with video details
        const transformedItems = detailsData.items.map(
          (video: YouTubeVideo) => ({
            ...video,
            formattedDuration: video.contentDetails
              ? this.parseDuration(video.contentDetails.duration)
              : "0:00",
            formattedViewCount: video.statistics
              ? this.formatViewCount(video.statistics.viewCount)
              : "0",
          })
        );

        // Fetch channel avatars for search results
        try {
          const channelIds = transformedItems.map(
            (video: YouTubeVideo) => video.snippet.channelId
          );
          const uniqueChannelIds = [...new Set(channelIds)]; // Remove duplicates
          const channelDetails = await this.getChannelDetails(
            uniqueChannelIds as string[]
          );

          // Add channel avatars to videos
          const videosWithAvatars = transformedItems.map(
            (video: YouTubeVideo) => {
              const channel = channelDetails.find(
                (ch) => ch.id === video.snippet.channelId
              );
              return {
                ...video,
                channelAvatar:
                  channel?.snippet?.thumbnails?.default?.url || null,
              };
            }
          );

          return {
            items: videosWithAvatars,
            pageInfo: searchData.pageInfo,
          };
        } catch (error) {
          console.warn("Failed to fetch channel details for search:", error);
          return {
            items: transformedItems,
            pageInfo: searchData.pageInfo,
          };
        }
      }
    } catch (error) {
      console.warn("Failed to fetch video details for search results:", error);
    }

    // Fallback: return search results without details
    return searchData;
  }

  // Replace the getRelatedVideos method in YouTubeService class:

  static async getRelatedVideos(
    currentVideo: YouTubeVideo,
    maxResults: number = 12
  ): Promise<YouTubeSearchResponse> {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    try {
      const currentVideoId =
        typeof currentVideo.id === "string"
          ? currentVideo.id
          : currentVideo.id?.videoId;

      // 🔥 PRIMARY: Use YouTube's relatedToVideoId parameter
      // const relatedParams = new URLSearchParams({
      //   part: "snippet",
      //   type: "video",
      //   relatedToVideoId: currentVideoId,
      //   maxResults: maxResults.toString(),
      //   key: YOUTUBE_API_KEY,
      //   videoDuration: "medium", // Exclude shorts
      // });

      const relatedParams = new URLSearchParams({
        part: "snippet",
        type: "video",
        relatedToVideoId: currentVideoId,
        regionCode: "IN",
        maxResults: maxResults.toString(),
        key: YOUTUBE_API_KEY,
      });

      const relatedResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/search?${relatedParams}`
      );

      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();

        if (relatedData.items && relatedData.items.length > 0) {
          // Get video details for the related videos
          const videoIds = relatedData.items
            .map((v: any) => v.id.videoId)
            .join(",");

          const detailsParams = new URLSearchParams({
            part: "snippet,contentDetails,statistics",
            id: videoIds,
            key: YOUTUBE_API_KEY,
          });

          const detailsResponse = await fetch(
            `${YOUTUBE_API_BASE_URL}/videos?${detailsParams}`
          );

          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();

            // Get channel avatars
            const channelIds = detailsData.items.map(
              (v: any) => v.snippet.channelId
            );
            const uniqueChannelIds = [...new Set(channelIds)];
            const channelDetails = await this.getChannelDetails(
              uniqueChannelIds
            );

            // Format the videos
            const formattedVideos = detailsData.items.map((video: any) => {
              const channel = channelDetails.find(
                (ch) => ch.id === video.snippet.channelId
              );
              return {
                ...video,
                formattedDuration: this.parseDuration(
                  video.contentDetails.duration
                ),
                formattedViewCount: this.formatViewCount(
                  video.statistics.viewCount
                ),
                channelAvatar:
                  channel?.snippet?.thumbnails?.default?.url || null,
              };
            });

            return {
              items: formattedVideos,
              pageInfo: {
                totalResults: formattedVideos.length,
                resultsPerPage: formattedVideos.length,
              },
            };
          }
        }
      }

      // 🔥 FALLBACK 1: If relatedToVideoId doesn't work, search by video tags/category
      console.log("relatedToVideoId failed, trying category-based search...");

      // Extract category and keywords from current video
      const categoryParams = new URLSearchParams({
        part: "snippet",
        type: "video",
        videoCategoryId: currentVideo.snippet.categoryId || "0",
        maxResults: maxResults.toString(),
        key: YOUTUBE_API_KEY,
        order: "relevance",
        videoDuration: "medium",
        publishedAfter: new Date(
          Date.now() - 90 * 24 * 60 * 60 * 1000
        ).toISOString(), // Last 3 months
      });

      const categoryResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/search?${categoryParams}`
      );

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();

        if (categoryData.items && categoryData.items.length > 0) {
          // Filter out current video and get details
          const filteredItems = categoryData.items.filter(
            (v: any) => v.id.videoId !== currentVideoId
          );

          if (filteredItems.length > 0) {
            const videoIds = filteredItems
              .slice(0, maxResults)
              .map((v: any) => v.id.videoId)
              .join(",");

            const detailsParams = new URLSearchParams({
              part: "snippet,contentDetails,statistics",
              id: videoIds,
              key: YOUTUBE_API_KEY,
            });

            const detailsResponse = await fetch(
              `${YOUTUBE_API_BASE_URL}/videos?${detailsParams}`
            );

            if (detailsResponse.ok) {
              const detailsData = await detailsResponse.json();

              // Get channel avatars and format videos
              const channelIds = detailsData.items.map(
                (v: any) => v.snippet.channelId
              );
              const uniqueChannelIds = [...new Set(channelIds)];
              const channelDetails = await this.getChannelDetails(
                uniqueChannelIds
              );

              const formattedVideos = detailsData.items.map((video: any) => {
                const channel = channelDetails.find(
                  (ch) => ch.id === video.snippet.channelId
                );
                return {
                  ...video,
                  formattedDuration: this.parseDuration(
                    video.contentDetails.duration
                  ),
                  formattedViewCount: this.formatViewCount(
                    video.statistics.viewCount
                  ),
                  channelAvatar:
                    channel?.snippet?.thumbnails?.default?.url || null,
                };
              });

              return {
                items: formattedVideos,
                pageInfo: {
                  totalResults: formattedVideos.length,
                  resultsPerPage: formattedVideos.length,
                },
              };
            }
          }
        }
      }

      // 🔥 FALLBACK 2: Search by channel (same creator's videos)
      console.log("Category search failed, trying channel videos...");

      const channelParams = new URLSearchParams({
        part: "snippet",
        type: "video",
        channelId: currentVideo.snippet.channelId,
        maxResults: maxResults.toString(),
        key: YOUTUBE_API_KEY,
        order: "relevance",
        videoDuration: "medium",
      });

      const channelResponse = await fetch(
        `${YOUTUBE_API_BASE_URL}/search?${channelParams}`
      );

      if (channelResponse.ok) {
        const channelData = await channelResponse.json();

        // Filter out current video
        const filteredChannelVideos = channelData.items.filter(
          (v: any) => v.id.videoId !== currentVideoId
        );

        if (filteredChannelVideos.length > 0) {
          const videoIds = filteredChannelVideos
            .slice(0, maxResults)
            .map((v: any) => v.id.videoId)
            .join(",");

          const detailsParams = new URLSearchParams({
            part: "snippet,contentDetails,statistics",
            id: videoIds,
            key: YOUTUBE_API_KEY,
          });

          const detailsResponse = await fetch(
            `${YOUTUBE_API_BASE_URL}/videos?${detailsParams}`
          );

          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();

            const channelDetails = await this.getChannelDetails([
              currentVideo.snippet.channelId,
            ]);

            const formattedVideos = detailsData.items.map((video: any) => ({
              ...video,
              formattedDuration: this.parseDuration(
                video.contentDetails.duration
              ),
              formattedViewCount: this.formatViewCount(
                video.statistics.viewCount
              ),
              channelAvatar:
                channelDetails[0]?.snippet?.thumbnails?.default?.url || null,
            }));

            return {
              items: formattedVideos,
              pageInfo: {
                totalResults: formattedVideos.length,
                resultsPerPage: formattedVideos.length,
              },
            };
          }
        }
      }

      // 🔥 FINAL FALLBACK: Popular videos (excluding current)
      console.log(
        "All related searches failed, falling back to popular videos..."
      );
      const fallbackVideos = await this.getPopularVideos(maxResults);
      return {
        items: fallbackVideos.items.filter((v) => v.id !== currentVideoId),
        pageInfo: fallbackVideos.pageInfo,
      };
    } catch (error) {
      console.error("Error fetching related videos:", error);

      // Emergency fallback
      try {
        const currentVideoId =
          typeof currentVideo.id === "string"
            ? currentVideo.id
            : currentVideo.id?.videoId;
        const fallbackVideos = await this.getPopularVideos(maxResults);
        return {
          items: fallbackVideos.items.filter((v) => v.id !== currentVideoId),
          pageInfo: fallbackVideos.pageInfo,
        };
      } catch {
        return {
          items: [],
          pageInfo: { totalResults: 0, resultsPerPage: 0 },
        };
      }
    }
  }

  static async getVideoById(videoId: string): Promise<YouTubeVideo | null> {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      id: videoId,
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params}`);

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.items.length === 0) {
      return null;
    }

    const video = data.items[0];

    // Get channel avatar
    const channelDetails = await this.getChannelDetails([
      video.snippet.channelId,
    ]);

    return {
      ...video,
      formattedDuration: this.parseDuration(video.contentDetails.duration),
      formattedViewCount: this.formatViewCount(video.statistics.viewCount),
      channelAvatar:
        channelDetails[0]?.snippet?.thumbnails?.default?.url || null,
    };
  }
}
