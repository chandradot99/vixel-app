'use client';

import { useState } from 'react';
import { YouTubeVideo } from '../types/youtube';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { User, Calendar, Eye } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface VideoInfoProps {
  video: YouTubeVideo;
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const { theme, classes } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const { snippet } = video;
  
  const publishedDate = formatDistanceToNow(new Date(snippet.publishedAt), {
    addSuffix: true,
  });

  // Theme-aware helper functions
  const getTitleBg = () => {
    if (theme === 'dark') return 'bg-gray-700';
    if (theme === 'light') return 'bg-blue-50';
    return 'bg-yellow-300';
  };

  const getChannelAvatarBg = () => {
    if (theme === 'dark') return 'bg-purple-600';
    if (theme === 'light') return 'bg-purple-500';
    return 'bg-purple-400';
  };

  const getSubscribeButton = () => {
    if (theme === 'dark') return 'bg-red-600 hover:bg-red-700';
    if (theme === 'light') return 'bg-red-500 hover:bg-red-600';
    return 'bg-red-500';
  };

  const getDescriptionBg = () => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'light') return 'bg-gray-50';
    return 'bg-gray-100';
  };

  const getShowMoreButton = () => {
    if (theme === 'dark') return 'bg-blue-600 hover:bg-blue-700';
    if (theme === 'light') return 'bg-blue-500 hover:bg-blue-600';
    return 'bg-yellow-400';
  };

  const getLinkStyles = () => {
    if (theme === 'dark') {
      return 'text-blue-400 hover:text-white hover:bg-blue-600 border-blue-400 hover:border-gray-600';
    }
    if (theme === 'light') {
      return 'text-blue-600 hover:text-white hover:bg-blue-600 border-blue-600 hover:border-gray-400';
    }
    return 'text-blue-600 hover:text-white hover:bg-blue-600 border-blue-600 hover:border-black';
  };

  const getMentionStyles = () => {
    if (theme === 'dark') {
      return 'text-purple-400 bg-purple-900 border-purple-400';
    }
    if (theme === 'light') {
      return 'text-purple-700 bg-purple-50 border-purple-500';
    }
    return 'text-purple-600 bg-purple-100 border-purple-600';
  };

  const getHashtagStyles = () => {
    if (theme === 'dark') {
      return 'text-green-400 bg-green-900 border-green-400';
    }
    if (theme === 'light') {
      return 'text-green-700 bg-green-50 border-green-500';
    }
    return 'text-green-600 bg-green-100 border-green-600';
  };

  const linkifyText = (text: string) => {
    if (!text) return text;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    
    return text.split(/(\s+)/).map((part, index) => {
      // Handle URLs
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`${getLinkStyles()} font-black uppercase underline transition-all duration-200 px-1 border-2 inline-block ${theme === 'brutal' ? 'transform hover:rotate-1' : ''}`}
          >
            🔗 LINK
          </a>
        );
      }
      
      // Handle mentions
      if (part.match(mentionRegex)) {
        return (
          <span
            key={index}
            className={`${getMentionStyles()} font-black border-2 px-1 inline-block ${theme === 'brutal' ? 'transform -rotate-1' : ''}`}
          >
            {part}
          </span>
        );
      }
      
      // Handle hashtags
      if (part.match(hashtagRegex)) {
        return (
          <span
            key={index}
            className={`${getHashtagStyles()} font-black border-2 px-1 inline-block ${theme === 'brutal' ? 'transform rotate-1' : ''}`}
          >
            {part}
          </span>
        );
      }
      
      return part;
    });
  };

  const description = snippet.description || 'No description available.';
  const shouldTruncate = description.length > 500;
  const displayText = shouldTruncate && !isExpanded 
    ? description.substring(0, 500) 
    : description;

  return (
    <div className={`${classes.cardBg} ${classes.borderThick} ${classes.shadowLarge}`}>
      {/* Video Title */}
      <div className={`p-6 border-b-4 ${classes.border} ${getTitleBg()}`}>
        <h1 className={`text-2xl font-black uppercase tracking-wide ${classes.primaryText} leading-tight mb-4`}>
          {snippet.title}
        </h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 border-2 ${classes.border} ${classes.shadow} overflow-hidden`}>
                {(video as YouTubeVideo).channelAvatar ? (
                  <Image
                    src={(video).channelAvatar || ""}
                    alt={snippet.channelTitle}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${getChannelAvatarBg()} flex items-center justify-center`}>
                    <User className={`w-6 h-6 ${theme === 'brutal' ? 'text-black' : 'text-white'}`} />
                  </div>
                )}
              </div>
              <div>
                <p className={`font-black ${classes.primaryText} text-lg uppercase tracking-wide`}>
                  {snippet.channelTitle}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className={`w-4 h-4 ${classes.primaryText}`} />
                    <span className={`font-bold uppercase ${classes.primaryText}`}>
                      {publishedDate.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className={`w-4 h-4 ${classes.primaryText}`} />
                    <span className={`font-bold uppercase ${classes.primaryText}`}>
                      {(video as YouTubeVideo).formattedViewCount || '0'} VIEWS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button className={`${getSubscribeButton()} border-3 ${classes.border} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 px-6 py-3 text-white font-black uppercase tracking-wide`}>
            SUBSCRIBE
          </button>
        </div>
      </div>
      
      {/* Video Description */}
      <div className="p-6">
        <h2 className={`text-lg font-black uppercase tracking-wide ${classes.primaryText} mb-4 border-b-2 ${classes.border} pb-2`}>
          📝 DESCRIPTION
        </h2>
        <div className={`${getDescriptionBg()} ${classes.borderThick} p-6 ${classes.shadow}`}>
          <div className={`${classes.primaryText} font-bold whitespace-pre-wrap leading-relaxed`}>
            {linkifyText(displayText)}
            {shouldTruncate && (
              <>
                {!isExpanded && <span className={`${theme === 'dark' ? 'text-red-400' : theme === 'light' ? 'text-red-600' : 'text-red-600'} font-black`}>...</span>}
                <div className="mt-4">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`${getShowMoreButton()} border-3 ${classes.border} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 px-4 py-2 font-black uppercase text-sm ${theme === 'brutal' ? 'text-black' : 'text-white'}`}
                  >
                    {isExpanded ? '📦 SHOW LESS' : '📖 SHOW MORE'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}