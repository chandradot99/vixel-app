# VIXEL AI Development Context

## Quick Start Prompt for AI Assistance

When starting a new AI chat session, copy and paste the following prompt:

---

I'm building a YouTube clone called "VIXEL" using Next.js 14 with TypeScript and Tailwind CSS. The design style is NEUBRUTALISM with bold, chunky borders, bright colors (yellow, red, blue, green), thick black shadows (like shadow-[8px_8px_0px_0px_#000]), uppercase typography, and aggressive styling.

**CURRENT IMPLEMENTATION STATUS:**
✅ Home page with video grid using YouTube API  
✅ Real video cards with thumbnails, titles, duration, view counts  
✅ Channel avatars fetched from YouTube API  
✅ Neubrutalism header with search functionality  
✅ Video detail page (/watch?v=ID) with custom YouTube Player API  
✅ Brutal custom video controls (play/pause, progress bar, volume, fullscreen)  
✅ Autoplay countdown overlay for next videos  
✅ Related videos based on current video (category + keywords + channel)  
✅ Linkified descriptions with clickable URLs  
✅ Google OAuth authentication system with useAuth hook  
✅ Login modal with brutal design  
✅ Real user profiles in header dropdown  

**KEY DESIGN ELEMENTS:**
- Colors: Yellow header (#FFFF00), Red buttons (#FF0000), Blue accents (#0000FF)
- Shadows: shadow-[8px_8px_0px_0px_#000] for main elements, shadow-[3px_3px_0px_0px_#000] for smaller
- Borders: border-4 border-black on main elements, border-3 border-black on smaller
- Typography: font-black uppercase tracking-wide for headings
- Animations: hover:translate-x-[2px] hover:translate-y-[2px] with shadow reduction
- Transforms: Random rotate-1, -rotate-2 for dynamic feel
- Button style: shadow-[Npx_Npx_0px_0px_#000] hover:shadow-[smaller] hover:translate-x-[Npx] hover:translate-y-[Npx]

**TECH STACK:**
- Next.js 14 with App Router (/app directory)
- TypeScript + Tailwind CSS
- YouTube Data API v3 with custom service (src/lib/youtube.ts)
- Google OAuth for authentication with YouTube API access
- Custom YouTube Player API integration (not iframe)
- React Context for auth state management
- next/image for optimized images

**CURRENT FILE STRUCTURE:**
src/
├── app/
│   ├── page.tsx                 # Home page with video grid
│   ├── layout.tsx              # Root layout with AuthProvider
│   └── watch/
│       └── page.tsx            # Video detail page
├── components/
│   ├── Header.tsx              # Main navigation with auth
│   ├── VideoCard.tsx           # Individual video cards
│   ├── VideoGrid.tsx           # Grid layout for videos
│   ├── CustomVideoPlayer.tsx   # YouTube Player API integration
│   ├── VideoInfo.tsx           # Video details and description
│   ├── RelatedVideos.tsx       # Sidebar related videos
│   └── LoginModal.tsx          # Google OAuth modal
├── lib/
│   └── youtube.ts              # YouTube API service layer
├── types/
│   └── youtube.ts              # TypeScript interfaces
├── contexts/
│   └── AuthContext.tsx         # Authentication management
└── globals.css                 # Global styles


**API INTEGRATION:**
- YouTube Data API v3 for video data, search, channel info
- Google OAuth 2.0 for user authentication
- Scopes: openid email profile youtube.readonly
- Custom service layer handles all API calls
- Error handling and fallbacks implemented

**KEY FEATURES:**
- Real YouTube video data with thumbnails, duration, view counts
- Smart related videos using category, keywords, and channel
- Custom video player with brutal controls and autoplay system
- User authentication with Google accounts
- Responsive design that works on mobile and desktop
- Linkified video descriptions with clickable URLs
- Auto-hiding video controls with timeout
- Fullscreen video support

**DESIGN PATTERNS:**
- All buttons follow brutal shadow animation pattern
- Consistent border thickness (3px for small, 4px for medium, 6px for large)
- Color coding: Red for primary actions, Blue for secondary, Green for success, Yellow for warnings
- Uppercase typography for all headings and buttons
- Transform rotations for visual interest
- High contrast for accessibility

**ENVIRONMENT VARIABLES NEEDED:**
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id

The app fetches real YouTube videos, displays them in brutal neubrutalism style, has working video player with custom controls, autoplay system, user authentication, and personalized recommendations.

---

## Design System Quick Reference

### Colors
- **Primary Yellow**: `#FFFF00` (bg-yellow-300)
- **Action Red**: `#FF0000` (bg-red-500)  
- **Accent Blue**: `#0000FF` (bg-blue-500)
- **Success Green**: `#00FF00` (bg-green-400)
- **Warning Orange**: `#FFA500` (bg-orange-400)
- **Secondary Purple**: `#800080` (bg-purple-500)
- **Neutral Black**: `#000000` (border-black)

### Shadow Patterns
- **Large elements**: `shadow-[8px_8px_0px_0px_#000]`
- **Medium elements**: `shadow-[4px_4px_0px_0px_#000]`  
- **Small elements**: `shadow-[2px_2px_0px_0px_#000]`
- **Hover states**: Reduce shadow and add translate

### Border Patterns
- **Main containers**: `border-4 border-black`
- **Secondary elements**: `border-3 border-black`
- **Small elements**: `border-2 border-black`

### Typography
- **Main headings**: `font-black text-3xl uppercase tracking-wider`
- **Subheadings**: `font-black text-xl uppercase tracking-wide`
- **Button text**: `font-black text-sm uppercase tracking-wide`
- **Body text**: `font-bold`

### Animation Pattern
```css
hover:shadow-[Npx_Npx_0px_0px_#000] 
hover:translate-x-[Npx] 
hover:translate-y-[Npx] 
transition-all duration-150