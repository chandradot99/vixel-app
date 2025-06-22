// Region Detection Helper
// src/lib/regionHelper.ts

interface RegionData {
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  timezone: string;
  currency: string;
  language: string;
}

export class RegionHelper {
  private static cachedRegion: string | null = null;
  private static cacheExpiry: number = 0;
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // 🔥 MAIN METHOD: Get region code with multiple fallbacks
  static async getRegionCode(): Promise<string> {
    // Check cache first
    if (this.cachedRegion && Date.now() < this.cacheExpiry) {
      return this.cachedRegion;
    }

    try {
      // Method 1: Try IP-based geolocation (most reliable)
      const regionCode = await this.getRegionFromIP();
      if (regionCode) {
        this.cacheRegion(regionCode);
        return regionCode;
      }
    } catch (error) {
      console.warn("IP-based region detection failed:", error);
    }

    try {
      // Method 2: Try browser geolocation API
      const regionCode = await this.getRegionFromGeolocation();
      if (regionCode) {
        this.cacheRegion(regionCode);
        return regionCode;
      }
    } catch (error) {
      console.warn("Browser geolocation failed:", error);
    }

    try {
      // Method 3: Try timezone-based detection
      const regionCode = this.getRegionFromTimezone();
      if (regionCode) {
        this.cacheRegion(regionCode);
        return regionCode;
      }
    } catch (error) {
      console.warn("Timezone-based region detection failed:", error);
    }

    try {
      // Method 4: Try language-based detection
      const regionCode = this.getRegionFromLanguage();
      if (regionCode) {
        this.cacheRegion(regionCode);
        return regionCode;
      }
    } catch (error) {
      console.warn("Language-based region detection failed:", error);
    }

    // Method 5: Final fallback based on user preference or default
    const fallbackRegion = this.getFallbackRegion();
    this.cacheRegion(fallbackRegion);
    return fallbackRegion;
  }

  // 🌍 METHOD 1: IP-based geolocation (most accurate)
  private static async getRegionFromIP(): Promise<string | null> {
    try {
      // Using ipapi.co (free tier: 1000 requests/day)
      const response = await fetch("https://ipapi.co/json/", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.country_code) {
        console.log(
          `🌍 Region detected via IP: ${data.country_code} (${data.country})`
        );
        return data.country_code.toUpperCase();
      }
    } catch (error) {
      console.warn("IP geolocation service failed:", error);

      // Fallback to another IP service
      try {
        const fallbackResponse = await fetch("https://api.country.is/");
        const fallbackData = await fallbackResponse.json();

        if (fallbackData.country) {
          console.log(
            `🌍 Region detected via fallback IP service: ${fallbackData.country}`
          );
          return fallbackData.country.toUpperCase();
        }
      } catch (fallbackError) {
        console.warn("Fallback IP service also failed:", fallbackError);
      }
    }

    return null;
  }

  // 📍 METHOD 2: Browser geolocation API
  private static async getRegionFromGeolocation(): Promise<string | null> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation not supported");
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Geolocation timeout"));
      }, 10000); // 10 second timeout

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          try {
            const { latitude, longitude } = position.coords;
            const regionCode = await this.reverseGeocode(latitude, longitude);
            resolve(regionCode);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 600000, // 10 minutes
        }
      );
    });
  }

  // 🗺️ HELPER: Reverse geocoding
  private static async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<string | null> {
    try {
      // Using OpenStreetMap Nominatim (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "Vixel/1.0 (https://vixel.app)", // Required by Nominatim
          },
        }
      );

      const data = await response.json();

      if (data.address?.country_code) {
        const countryCode = data.address.country_code.toUpperCase();
        console.log(
          `📍 Region detected via coordinates: ${countryCode} (${data.address.country})`
        );
        return countryCode;
      }
    } catch (error) {
      console.warn("Reverse geocoding failed:", error);
    }

    return null;
  }

  // 🕐 METHOD 3: Timezone-based detection
  private static getRegionFromTimezone(): string | null {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const timezoneMap: Record<string, string> = {
        // North America
        "America/New_York": "US",
        "America/Chicago": "US",
        "America/Denver": "US",
        "America/Los_Angeles": "US",
        "America/Toronto": "CA",
        "America/Vancouver": "CA",
        "America/Mexico_City": "MX",

        // Europe
        "Europe/London": "GB",
        "Europe/Paris": "FR",
        "Europe/Berlin": "DE",
        "Europe/Rome": "IT",
        "Europe/Madrid": "ES",
        "Europe/Amsterdam": "NL",
        "Europe/Stockholm": "SE",
        "Europe/Moscow": "RU",

        // Asia
        "Asia/Tokyo": "JP",
        "Asia/Seoul": "KR",
        "Asia/Shanghai": "CN",
        "Asia/Hong_Kong": "HK",
        "Asia/Singapore": "SG",
        "Asia/Kolkata": "IN",
        "Asia/Mumbai": "IN",
        "Asia/Dubai": "AE",

        // Australia/Oceania
        "Australia/Sydney": "AU",
        "Australia/Melbourne": "AU",
        "Pacific/Auckland": "NZ",

        // South America
        "America/Sao_Paulo": "BR",
        "America/Argentina/Buenos_Aires": "AR",
        "America/Santiago": "CL",

        // Africa
        "Africa/Cairo": "EG",
        "Africa/Johannesburg": "ZA",
        "Africa/Lagos": "NG",
      };

      const regionCode = timezoneMap[timezone];
      if (regionCode) {
        console.log(
          `🕐 Region detected via timezone: ${regionCode} (${timezone})`
        );
        return regionCode;
      }

      // Fallback: Extract region from timezone pattern
      const continentRegionMap: Record<string, string> = {
        America: "US",
        Europe: "DE",
        Asia: "IN",
        Australia: "AU",
        Africa: "ZA",
        Pacific: "AU",
      };

      const continent = timezone.split("/")[0];
      const fallbackRegion = continentRegionMap[continent];
      if (fallbackRegion) {
        console.log(
          `🌐 Region estimated via continent: ${fallbackRegion} (${continent})`
        );
        return fallbackRegion;
      }
    } catch (error) {
      console.warn("Timezone detection failed:", error);
    }

    return null;
  }

  // 🗣️ METHOD 4: Language-based detection
  private static getRegionFromLanguage(): string | null {
    try {
      const languages = navigator.languages || [navigator.language];
      const primaryLanguage = languages[0];

      const languageMap: Record<string, string> = {
        "en-US": "US",
        "en-GB": "GB",
        "en-CA": "CA",
        "en-AU": "AU",
        "en-IN": "IN",
        "es-ES": "ES",
        "es-MX": "MX",
        "es-AR": "AR",
        "fr-FR": "FR",
        "fr-CA": "CA",
        "de-DE": "DE",
        "de-AT": "AT",
        "it-IT": "IT",
        "pt-BR": "BR",
        "pt-PT": "PT",
        "ja-JP": "JP",
        "ko-KR": "KR",
        "zh-CN": "CN",
        "zh-TW": "TW",
        "zh-HK": "HK",
        "hi-IN": "IN",
        "ar-SA": "SA",
        "ru-RU": "RU",
        "nl-NL": "NL",
        "sv-SE": "SE",
        "da-DK": "DK",
        "no-NO": "NO",
        "fi-FI": "FI",
      };

      let regionCode = languageMap[primaryLanguage];

      if (!regionCode && primaryLanguage.includes("-")) {
        // Try just the country part
        const countryPart = primaryLanguage.split("-")[1];
        if (countryPart) {
          regionCode = countryPart.toUpperCase();
        }
      }

      if (regionCode) {
        console.log(
          `🗣️ Region detected via language: ${regionCode} (${primaryLanguage})`
        );
        return regionCode;
      }
    } catch (error) {
      console.warn("Language detection failed:", error);
    }

    return null;
  }

  // 🏠 METHOD 5: Fallback region
  private static getFallbackRegion(): string {
    // Check localStorage for user preference
    const savedRegion = localStorage.getItem("vixel_region");
    if (savedRegion) {
      console.log(`💾 Using saved region preference: ${savedRegion}`);
      return savedRegion;
    }

    // Ultimate fallback
    const defaultRegion = "US";
    console.log(`🏠 Using default region: ${defaultRegion}`);
    return defaultRegion;
  }

  // 💾 HELPER: Cache region
  private static cacheRegion(regionCode: string): void {
    this.cachedRegion = regionCode;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;

    // Also save to localStorage for future sessions
    localStorage.setItem("vixel_region", regionCode);
    localStorage.setItem("vixel_region_timestamp", Date.now().toString());
  }

  // 🧹 HELPER: Clear cached region
  static clearCache(): void {
    this.cachedRegion = null;
    this.cacheExpiry = 0;
    localStorage.removeItem("vixel_region");
    localStorage.removeItem("vixel_region_timestamp");
  }

  // 🎯 HELPER: Set manual region (for user preference)
  static setManualRegion(regionCode: string): void {
    const validRegion = regionCode.toUpperCase();
    this.cacheRegion(validRegion);
    console.log(`🎯 Manual region set: ${validRegion}`);
  }

  // 📊 HELPER: Get detailed region info
  static async getDetailedRegionInfo(): Promise<RegionData | null> {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      return {
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        regionCode: data.region_code,
        city: data.city,
        timezone: data.timezone,
        currency: data.currency,
        language: data.languages,
      };
    } catch (error) {
      console.warn("Detailed region info failed:", error);
      return null;
    }
  }

  // 🔥 HELPER: Popular regions list
  static getPopularRegions(): Array<{
    code: string;
    name: string;
    flag: string;
  }> {
    return [
      { code: "US", name: "United States", flag: "🇺🇸" },
      { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
      { code: "CA", name: "Canada", flag: "🇨🇦" },
      { code: "AU", name: "Australia", flag: "🇦🇺" },
      { code: "DE", name: "Germany", flag: "🇩🇪" },
      { code: "FR", name: "France", flag: "🇫🇷" },
      { code: "JP", name: "Japan", flag: "🇯🇵" },
      { code: "KR", name: "South Korea", flag: "🇰🇷" },
      { code: "IN", name: "India", flag: "🇮🇳" },
      { code: "BR", name: "Brazil", flag: "🇧🇷" },
    ];
  }
}
