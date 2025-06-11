'use client';

import { useState } from 'react';
import { YouTubeVideo } from '../types/youtube';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { User, Calendar, Eye } from 'lucide-react';

interface VideoInfoProps {
  video: YouTubeVideo;
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { snippet } = video;
  
  const publishedDate = formatDistanceToNow(new Date(snippet.publishedAt), {
    addSuffix: true,
  });

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
            className="text-blue-600 font-black uppercase underline hover:text-white hover:bg-blue-600 transition-all duration-200 px-1 border-2 border-blue-600 hover:border-black inline-block transform hover:rotate-1"
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
            className="text-purple-600 font-black bg-purple-100 border-2 border-purple-600 px-1 inline-block transform -rotate-1"
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
            className="text-green-600 font-black bg-green-100 border-2 border-green-600 px-1 inline-block transform rotate-1"
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
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000]">
      {/* Video Title */}
      <div className="p-6 border-b-4 border-black bg-yellow-300">
        <h1 className="text-2xl font-black uppercase tracking-wide text-black leading-tight mb-4">
          {snippet.title}
        </h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_#000] overflow-hidden">
                {(video as any).channelAvatar ? (
                  <Image
                    src={(video as any).channelAvatar}
                    alt={snippet.channelTitle}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-400 flex items-center justify-center">
                    <User className="w-6 h-6 text-black" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-black text-black text-lg uppercase tracking-wide">
                  {snippet.channelTitle}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-black" />
                    <span className="font-bold uppercase text-black">
                      {publishedDate.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-black" />
                    <span className="font-bold uppercase text-black">
                      {(video as any).formattedViewCount || '0'} VIEWS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button className="bg-red-500 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 px-6 py-3 text-white font-black uppercase tracking-wide">
            SUBSCRIBE
          </button>
        </div>
      </div>
      
      {/* Video Description */}
      <div className="p-6">
        <h2 className="text-lg font-black uppercase tracking-wide text-black mb-4 border-b-2 border-black pb-2">
          📝 DESCRIPTION
        </h2>
        <div className="bg-gray-100 border-4 border-black p-6 shadow-[4px_4px_0px_0px_#000]">
          <div className="text-black font-bold whitespace-pre-wrap leading-relaxed">
            {linkifyText(displayText)}
            {shouldTruncate && (
              <>
                {!isExpanded && <span className="text-red-600 font-black">...</span>}
                <div className="mt-4">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="bg-yellow-400 border-3 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 px-4 py-2 font-black uppercase text-sm"
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
