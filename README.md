# 🔥 VIXEL - Epic YouTube Clone

VIXEL is a modern YouTube clone featuring a unique **neubrutalism design** aesthetic, multiple themes, comprehensive video playback, and user authentication. Built with cutting-edge web technologies for maximum performance and epic user experience.

---

## 🎨 Theme Gallery

### Brutal Theme (Default)
*Maximum aggression with bold colors and chunky shadows*

![Brutal Theme Home](https://ik.imagekit.io/zhcmdyuhw/brutal-home-page.png?updatedAt=1750757076821)
![Brutal Theme Video Player](https://ik.imagekit.io/zhcmdyuhw/brutal-watch-page.png?updatedAt=1750757076322)

### Dark Theme
*Sleek and minimal for late-night viewing*

![Dark Theme Home](https://ik.imagekit.io/zhcmdyuhw/dark-home-page.png?updatedAt=1750757076585)
![Dark Theme Video Player](https://ik.imagekit.io/zhcmdyuhw/dark-watch-page.png?updatedAt=1750757076853)

### Light Theme
*Clean and bright for professional environments*

![Light Theme Home](https://ik.imagekit.io/zhcmdyuhw/light-home-page.png?updatedAt=1750757076744)
![Light Theme Video Player](https://ik.imagekit.io/zhcmdyuhw/light-watch-page.png?updatedAt=1750757076320)

---

## ✨ Features

### 🎬 Video Experience
- **Real YouTube API Integration** - Fetch live video data, thumbnails, and metadata
- **Custom Video Player** - Built with YouTube Player API, custom controls, and autoplay
- **Smart Related Videos** - Algorithm-based recommendations using category, keywords, and channels
- **Video Categories** - Music, Gaming, Education, Tech, News, and more
- **Advanced Search** - Real-time video search with personalized results
- **Responsive Design** - Works flawlessly on desktop, tablet, and mobile

### 🎨 Design System
- **Neubrutalism Aesthetic** - Bold, chunky borders with aggressive shadows
- **Multi-Theme Support** - Brutal, Dark, and Light themes
- **Theme Persistence** - Settings saved across sessions
- **Accessibility Features** - High contrast, reduced motion, font size options
- **Mobile-First** - Optimized for all screen sizes

### 🔐 Authentication & Personalization
- **Google OAuth Integration** - Secure sign-in with YouTube API access
- **User Profiles** - Display user avatars, names, and email
- **Personalized Recommendations** - Tailored content based on user preferences
- **Settings Management** - Comprehensive user preferences and data export/import

### ⚡ Performance & UX
- **Next.js 14** - Latest features with App Router and Server Components
- **TypeScript** - Type-safe development with comprehensive interfaces
- **Error Handling** - Graceful API error handling with user-friendly messages
- **Loading States** - Smooth loading experiences with themed indicators
- **SEO Optimized** - Proper meta tags and semantic HTML

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **YouTube Data API v3 Key**
- **Google OAuth 2.0 Credentials**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vixel.git
cd vixel
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:

```env
# YouTube Data API v3
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here

# Google OAuth 2.0
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see VIXEL in action!

---

## 🛠️ Tech Stack

### Core Technologies
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React 18](https://react.dev/)** - UI library with latest features

### APIs & Services
- **[YouTube Data API v3](https://developers.google.com/youtube/v3)** - Video data and search
- **[YouTube Player API](https://developers.google.com/youtube/iframe_api_reference)** - Custom video player
- **[Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)** - User authentication

### Key Libraries
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[date-fns](https://date-fns.org/)** - Date formatting utilities
- **[Next.js Image](https://nextjs.org/docs/api-reference/next/image)** - Optimized image loading

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home page with video grid
│   ├── layout.tsx           # Root layout with providers
│   ├── settings/            # Settings page
│   └── watch/               # Video watch page
├── components/              # React components
│   ├── Header.tsx           # Navigation with auth & theme toggle
│   ├── CategoryBar.tsx      # Video category navigation
│   ├── VideoCard.tsx        # Individual video cards
│   ├── VideoGrid.tsx        # Video grid layout
│   ├── CustomVideoPlayer.tsx # YouTube Player integration
│   ├── VideoInfo.tsx        # Video details & description
│   ├── RelatedVideos.tsx    # Sidebar recommendations
│   ├── LoginModal.tsx       # Google OAuth modal
│   ├── MobileSearch.tsx     # Mobile search interface
│   └── ThemeWrapper.tsx     # Theme provider wrapper
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   └── SettingsContext.tsx  # User preferences & theme
├── hooks/                   # Custom React hooks
│   └── useTheme.ts          # Theme management hook
├── lib/                     # Utility libraries
│   ├── youtube.ts           # YouTube API service layer
│   └── regionHelper.ts      # Geographic region detection
├── types/                   # TypeScript definitions
│   └── youtube.ts           # YouTube API interfaces
└── globals.css              # Global styles & theme variables
```

---

## 🎨 Design System

### Color Palette
```css
/* Brutal Theme */
--brutalist-yellow: #FFFF00;  /* Primary background */
--brutalist-red: #FF0000;     /* Primary actions */
--brutalist-blue: #0000FF;    /* Secondary actions */
--brutalist-green: #00FF00;   /* Success states */
--brutalist-black: #000000;   /* Borders & text */

/* Dark Theme */
--dark-bg: #1a1a1a;          /* Primary background */
--dark-secondary: #2a2a2a;    /* Secondary background */
--dark-accent: #3b82f6;       /* Accent color */

/* Light Theme */
--light-bg: #ffffff;          /* Primary background */
--light-secondary: #f8f9fa;   /* Secondary background */
--light-accent: #3b82f6;      /* Accent color */
```

### Shadow System
```css
/* Large elements */
shadow-[8px_8px_0px_0px_#000]

/* Medium elements */
shadow-[4px_4px_0px_0px_#000]

/* Small elements */
shadow-[2px_2px_0px_0px_#000]

/* Hover states */
hover:shadow-[2px_2px_0px_0px_#000]
hover:translate-x-[2px] hover:translate-y-[2px]
```

### Typography
```css
/* Main headings */
font-black text-3xl uppercase tracking-wider

/* Subheadings */
font-black text-xl uppercase tracking-wide

/* Button text */
font-black text-sm uppercase tracking-wide

/* Body text */
font-bold
```

---

## 🔧 Configuration

### YouTube API Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable YouTube Data API v3**
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"

3. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key to your `.env.local`

### Google OAuth Setup

1. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Fill in required information

2. **Create OAuth 2.0 Client ID**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Set application type to "Web application"
   - Add your domain to authorized origins
   - Copy the Client ID to your `.env.local`

---

## 🎯 Key Features Explained

### Theme System
VIXEL features a comprehensive theming system that adapts the entire UI:

- **useTheme Hook**: Provides theme-aware CSS classes
- **SettingsContext**: Manages theme state and persistence
- **ThemeWrapper**: Applies theme classes at the root level
- **CSS Variables**: Enable dynamic theming with custom properties

### Video Player
Custom-built video player with advanced features:

- **YouTube Player API Integration**: Direct API control
- **Custom Controls**: Brutal-styled play, pause, seek, volume
- **Autoplay System**: Smart next video recommendations
- **Fullscreen Support**: Native fullscreen with custom controls
- **Keyboard Shortcuts**: Space to play/pause, arrow keys to seek

### Error Handling
Comprehensive error management system:

- **API Quota Handling**: Graceful handling of YouTube API limits
- **Network Error Recovery**: Retry mechanisms for failed requests
- **User-Friendly Messages**: Clear explanations of what went wrong
- **Fallback Content**: Alternative content when primary fails

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Video Grid Layout
- **Mobile**: 1 column
- **Small tablets**: 2 columns  
- **Tablets**: 3 columns
- **Desktop**: 4 columns

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "feat: epic VIXEL implementation"
git push origin main
```

2. **Deploy with Vercel**
   - Connect your GitHub repository to [Vercel](https://vercel.com)
   - Add environment variables in Vercel dashboard
   - Deploy automatically on every push

### Other Platforms
- **Netlify**: Works with static export
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

---

## 🤝 Contributing

We welcome contributions to make VIXEL even more epic!

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/epic-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit with conventional commits (`feat:`, `fix:`, `docs:`)
6. Push to your branch
7. Create a Pull Request

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Semantic commit messages

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **YouTube API**: For providing access to video data
- **Tailwind CSS**: For the amazing utility-first CSS framework  
- **Next.js Team**: For the incredible React framework
- **Lucide**: For the beautiful icon library
- **Neubrutalism Community**: For design inspiration

---

## 📞 Support

Having issues? We're here to help!

- **🐛 Bug Reports**: [Create an issue](https://github.com/yourusername/vixel/issues)
- **💡 Feature Requests**: [Start a discussion](https://github.com/yourusername/vixel/discussions)
- **📧 Email**: support@vixel.app
- **💬 Discord**: [Join our community](https://discord.gg/vixel)

---

## 🗺️ Roadmap

### Coming Soon
- [ ] **User Playlists** - Create and manage video collections
- [ ] **Comments System** - Video discussions and interactions
- [ ] **Subscriptions** - Follow your favorite channels
- [ ] **Watch History** - Track viewed videos
- [ ] **Offline Mode** - Download videos for offline viewing
- [ ] **Live Streaming** - Real-time video broadcasts
- [ ] **Video Upload** - Create and share your own content

### Future Ideas
- [ ] **AI Recommendations** - Machine learning-powered suggestions
- [ ] **Social Features** - Share videos with friends
- [ ] **Analytics Dashboard** - Creator insights and metrics
- [ ] **Monetization** - Creator revenue sharing
- [ ] **Mobile Apps** - Native iOS and Android applications

---

<div align="center">

**Built with 💀 and maximum brutality by the VIXEL team**

[⭐ Star on GitHub](https://github.com/yourusername/vixel) • [🚀 Try Live Demo](https://vixel.vercel.app)

</div>
