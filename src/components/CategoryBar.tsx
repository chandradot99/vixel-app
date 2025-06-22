// src/components/CategoryBar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft, ChevronRight, Flame, Gamepad2, Music, Tv, Laugh, Newspaper, Wrench, GraduationCap, Monitor, Heart } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: React.ComponentType;
  apiId?: string;
}

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const BRUTAL_CATEGORIES: Category[] = [
  { id: "all", name: "ALL", color: "bg-red-500", icon: Flame },
  { id: "10", name: "MUSIC", color: "bg-purple-500", icon: Music, apiId: "10" },
  { id: "20", name: "GAMING", color: "bg-blue-500", icon: Gamepad2, apiId: "20" },
  { id: "22", name: "VLOGS", color: "bg-green-500", icon: Heart, apiId: "22" },
  { id: "23", name: "COMEDY", color: "bg-orange-500", icon: Laugh, apiId: "23" },
  { id: "24", name: "ENTERTAINMENT", color: "bg-pink-500", icon: Tv, apiId: "24" },
  { id: "25", name: "NEWS", color: "bg-cyan-500", icon: Newspaper, apiId: "25" },
  { id: "26", name: "HOWTO", color: "bg-yellow-500", icon: Wrench, apiId: "26" },
  { id: "27", name: "EDUCATION", color: "bg-indigo-500", icon: GraduationCap, apiId: "27" },
  { id: "28", name: "TECH", color: "bg-teal-500", icon: Monitor, apiId: "28" },
];

export default function CategoryBar({ selectedCategory, onCategoryChange }: CategoryBarProps) {
  const { theme, classes } = useTheme();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollPosition, 300);
    }
  };

  const getCategoryBarBg = () => {
    if (theme === 'dark') return 'bg-gray-800';
    if (theme === 'light') return 'bg-gray-100';
    return 'bg-purple-400';
  };

  return (
    <div className={`sticky top-16 z-40 ${getCategoryBarBg()} border-b-4 ${classes.border} ${classes.shadow}`}>
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 ${classes.cardBg} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
          >
            <ChevronLeft className={`w-5 h-5 ${classes.primaryText}`} />
          </button>
        )}

        {/* Categories Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 px-6 py-4 overflow-x-auto scroll-smooth scrollbar-hide"
          onScroll={checkScrollPosition}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {BRUTAL_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-wider
                  ${classes.borderThick} transition-all duration-150 whitespace-nowrap
                  ${isSelected 
                    ? `${category.color} text-white ${classes.shadowLarge} transform translate-x-[2px] translate-y-[2px]`
                    : `${classes.cardBg} ${classes.primaryText} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px]`
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : classes.primaryText}`} />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 ${classes.cardBg} ${classes.borderThick} ${classes.shadow} ${classes.hoverShadow} hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150`}
          >
            <ChevronRight className={`w-5 h-5 ${classes.primaryText}`} />
          </button>
        )}
      </div>
    </div>
  );
}