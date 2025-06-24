# VIXEL AI Development Context

## Quick Start Prompt for AI Assistance

When starting a new AI chat session, copy and paste the following prompt:

---

I'm building a YouTube clone called "VIXEL" using Next.js 14 with TypeScript and Tailwind CSS. The design style is NEUBRUTALISM with bold, chunky borders, bright colors, thick black shadows, uppercase typography, and aggressive styling. The app features a **MULTI-THEME SYSTEM** with Brutal (default), Dark, and Light themes.

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
✅ **MULTI-THEME SYSTEM** - Brutal, Dark, Light themes with full theming
✅ **SETTINGS PAGE** - Comprehensive user preferences and theme management
✅ **THEME TOGGLE** - Header theme switcher for non-logged-in users
✅ **COMPREHENSIVE ERROR HANDLING** - YouTube API quota, network, and user-friendly messages
✅ **FULL TYPESCRIPT TYPES** - Proper types throughout, no `any` usage
✅ **RESPONSIVE DESIGN** - Mobile-first approach with brutal mobile components

**THEME SYSTEM:**
- **Brutal Theme** (Default): Maximum aggression with yellow headers, chunky shadows, bright colors
- **Dark Theme**: Sleek dark grays with blue accents, modern minimal feel
- **Light Theme**: Clean whites with subtle grays, professional appearance
- **Theme Toggle**: Available in header for non-logged-in users
- **Settings Integration**: Full theme management for authenticated users
- **CSS Variables**: Dynamic theming with custom properties
- **Component Adaptation**: All components theme-aware using useTheme hook

**KEY DESIGN ELEMENTS:**

### Brutal Theme (Default)
- Colors: Yellow header (#FFFF00), Red buttons (#FF0000), Blue accents (#0000FF)
- Shadows: shadow-[8px_8px_0px_0px_#000] for main elements, shadow-[3px_3px_0px_0px_#000] for smaller
- Borders: border-4 border-black on main elements, border-3 border-black on smaller
- Typography: font-black uppercase tracking-wide for headings
- Animations: hover:translate-x-[2px] hover:translate-y-[2px] with shadow reduction
- Transforms: Random rotate-1, -rotate-2 for dynamic feel

### Dark Theme
- Colors: Dark grays (gray-800, gray-900), Blue accents (#3b82f6), White text
- Shadows: shadow-[4px_4px_0px_0px_#374151] using gray colors
- Clean modern aesthetic with subtle hover effects
- No transforms or rotations for professional feel

### Light Theme  
- Colors: Clean whites, Light grays (gray-50, gray-100), Blue accents (#3b82f6)
- Shadows: shadow-[4px_4px_0px_0px_#e5e7eb] using light gray colors
- Traditional clean design with standard interactions

### Universal Patterns
- Button style: shadow-[Npx_Npx_0px_0px_#000] hover:shadow-[smaller] hover:translate-x-[Npx] hover:translate-y-[Npx]
- Error handling: Theme-aware error messages with appropriate icons and colors
- Typography: Maintains brutal uppercase in brutal theme, normal case in others

**TECH STACK:**
- Next.js 14 with App Router (/app directory)
- TypeScript + Tailwind CSS (with proper types throughout)
- YouTube Data API v3 with typed custom service (src/lib/youtube.ts)
- Google OAuth for authentication with YouTube API access
- Custom YouTube Player API integration (typed, not iframe)
- React Context for auth state management and settings
- Multi-theme system with useTheme hook
- next/image for optimized images
- Comprehensive error handling with user-friendly messages

**CURRENT FILE STRUCTURE:**
src/
├── app/
│   ├── page.tsx                 # Home page with video grid + error handling
│   ├── layout.tsx              # Root layout with AuthProvider + SettingsProvider
│   ├── settings/
│   │   └── page.tsx            # Comprehensive settings page
│   └── watch/
│       └── page.tsx            # Video detail page + error handling
├── components/
│   ├── Header.tsx              # Main navigation with auth + theme toggle
│   ├── CategoryBar.tsx         # Video category navigation (themed)
│   ├── VideoCard.tsx           # Individual video cards (themed)
│   ├── VideoGrid.tsx           # Grid layout for videos
│   ├── CustomVideoPlayer.tsx   # YouTube Player API integration (typed + themed)
│   ├── VideoInfo.tsx           # Video details and description (themed)
│   ├── RelatedVideos.tsx       # Sidebar related videos (themed)
│   ├── LoginModal.tsx          # Google OAuth modal (themed)
│   ├── MobileSearch.tsx        # Mobile search interface (themed)
│   └── ThemeWrapper.tsx        # Theme provider wrapper component
├── lib/
│   ├── youtube.ts              # YouTube API service layer (fully typed)
│   └── regionHelper.ts         # Geographic region detection
├── types/
│   └── youtube.ts              # TypeScript interfaces
├── contexts/
│   ├── AuthContext.tsx         # Authentication management (typed)
│   └── SettingsContext.tsx     # User preferences and theme management
├── hooks/
│   └── useTheme.ts             # Theme management hook with CSS classes
└── globals.css                 # Global styles + theme variables + accessibility

**API INTEGRATION:**
- YouTube Data API v3 for video data, search, channel info (fully typed)
- Google OAuth 2.0 for user authentication (typed)
- Scopes: openid email profile youtube.readonly
- Custom service layer handles all API calls with proper error handling
- Quota management and user-friendly error messages
- Network error recovery and fallback content

**KEY FEATURES:**
- **Multi-Theme System**: Brutal, Dark, Light with seamless switching
- **Real YouTube Data**: Thumbnails, duration, view counts, channel info
- **Smart Related Videos**: Category + keywords + channel algorithm
- **Custom Video Player**: Brutal controls, autoplay, fullscreen support
- **User Authentication**: Google accounts with profile management
- **Comprehensive Settings**: Theme, region, video preferences, accessibility
- **Error Handling**: Graceful API failures with helpful messages
- **Responsive Design**: Mobile-first with themed mobile components
- **Type Safety**: Full TypeScript implementation throughout
- **Accessibility**: High contrast, reduced motion, font size options

**DESIGN PATTERNS:**
- **useTheme Hook**: Provides theme-aware CSS classes for all components
- **Theme Classes**: `classes.primaryBg`, `classes.borderThick`, `classes.shadow`, etc.
- **Conditional Styling**: Theme-specific colors and behaviors
- **CSS Variables**: Dynamic theming with custom properties
- **Error UI**: Consistent error states across all themes
- **Mobile Responsiveness**: Theme-aware mobile interfaces
- **Accessibility**: WCAG compliant across all themes

**ENVIRONMENT VARIABLES NEEDED:**
```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

**ERROR HANDLING:**
- **Quota Exceeded**: "We've hit our daily limit! Try again tomorrow 📅"
- **Network Issues**: "Connection problems! Check your internet 📡"
- **Video Not Found**: "Video not found! It might be removed 🔍"
- **Theme-Aware**: Error messages adapt colors and styling to current theme
- **Retry Logic**: Smart retry buttons for recoverable errors

The app fetches real YouTube videos, displays them with multi-theme support, has working video player with custom controls, autoplay system, user authentication, comprehensive settings, and robust error handling.

---

## Multi-Theme Design System

### Brutal Theme (Default)
```css
/* Primary Colors */
--brutalist-yellow: #FFFF00;  /* Header background */
--brutalist-red: #FF0000;     /* Primary actions */
--brutalist-blue: #0000FF;    /* Secondary actions */
--brutalist-green: #00FF00;   /* Success states */
--brutalist-black: #000000;   /* Borders & text */

/* Shadows */
shadow-[8px_8px_0px_0px_#000]   /* Large elements */
shadow-[4px_4px_0px_0px_#000]   /* Medium elements */
shadow-[2px_2px_0px_0px_#000]   /* Small elements */

/* Typography */
font-black text-3xl uppercase tracking-wider  /* Main headings */
font-black text-xl uppercase tracking-wide    /* Subheadings */
font-black text-sm uppercase tracking-wide    /* Buttons */
```

### Dark Theme
```css
/* Primary Colors */
--dark-bg: #1a1a1a;          /* Primary background */
--dark-secondary: #2a2a2a;    /* Secondary background */
--dark-accent: #3b82f6;       /* Accent color */
--dark-text: #ffffff;         /* Primary text */

/* Shadows */
shadow-[4px_4px_0px_0px_#374151]   /* Gray shadows */
shadow-[2px_2px_0px_0px_#374151]   /* Small shadows */

/* Typography */
font-black text-3xl   /* Clean headings, no uppercase */
font-bold             /* Standard weight for body */
```

### Light Theme
```css
/* Primary Colors */
--light-bg: #ffffff;          /* Primary background */
--light-secondary: #f8f9fa;   /* Secondary background */
--light-accent: #3b82f6;      /* Accent color */
--light-text: #1a1a1a;        /* Primary text */

/* Shadows */
shadow-[4px_4px_0px_0px_#e5e7eb]   /* Light gray shadows */
shadow-[2px_2px_0px_0px_#e5e7eb]   /* Small shadows */

/* Typography */
font-black text-3xl   /* Standard clean headings */
font-medium           /* Lighter weight for readability */
```

## useTheme Hook Classes

The `useTheme` hook provides these theme-aware classes:

```typescript
const { classes } = useTheme();

// Background classes
classes.primaryBg      // Header/main backgrounds
classes.secondaryBg    // Secondary backgrounds  
classes.cardBg         // Card/container backgrounds
classes.pageGradient   // Full page gradient background

// Text classes
classes.primaryText    // Main text color
classes.secondaryText  // Secondary/muted text

// Border classes
classes.border         // Standard border
classes.borderThick    // Thick borders (4px)

// Shadow classes  
classes.shadow         // Standard shadow
classes.shadowLarge    // Large shadows (8px)
classes.hoverShadow    // Hover state shadows

// Button classes
classes.primaryButton    // Primary action buttons
classes.secondaryButton  // Secondary action buttons
```

## Animation Patterns

### Brutal Theme Animations
```css
/* Hover transforms with shadow reduction */
hover:translate-x-[2px] hover:translate-y-[2px]
hover:shadow-[2px_2px_0px_0px_#000]
transform rotate-1 /* Random rotations */
transition-all duration-150
```

### Dark/Light Theme Animations
```css
/* Subtle hover effects */
hover:bg-gray-700
hover:scale-105
transition-all duration-200
/* No transforms or rotations */
```

## Error Handling Patterns

```typescript
// Theme-aware error styling
const getErrorBg = () => {
  if (theme === 'dark') return 'bg-red-900';
  if (theme === 'light') return 'bg-red-50'; 
  return 'bg-red-400';
};

// Error message component
<div className={`${getErrorBg()} ${classes.borderThick} ${classes.shadowLarge}`}>
  <ErrorIcon className={`w-16 h-16 ${classes.primaryText}`} />
  <h2 className={`font-black uppercase ${classes.primaryText}`}>
    ERROR TITLE
  </h2>
  <p className={classes.secondaryText}>User-friendly error message</p>
</div>
```

## Component Implementation Pattern

```typescript
import { useTheme } from '@/hooks/useTheme';

export default function Component() {
  const { theme, classes } = useTheme();
  
  return (
    <div className={`${classes.cardBg} ${classes.borderThick} ${classes.shadowLarge}`}>
      <h1 className={`${classes.primaryText} ${theme === 'brutal' ? 'uppercase transform -rotate-1' : ''}`}>
        {theme === 'brutal' ? 'BRUTAL TITLE' : 'Clean Title'}
      </h1>
    </div>
  );
}
```