import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';

interface TouchHorizontalScrollProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  hintText?: string;
}

export const TouchHorizontalScroll: React.FC<TouchHorizontalScrollProps> = ({
  children,
  className = '',
  itemClassName = 'w-[86vw] sm:w-[360px] md:w-[380px] shrink-0 snap-center sm:snap-start',
  hintText = 'Swipe or drag horizontally'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag state for mouse and touch
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const updateScrollState = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active index
    const childWidth = containerRef.current.firstElementChild?.clientWidth || clientWidth;
    const gap = 16;
    const index = Math.round(scrollLeft / (childWidth + gap));
    setActiveIndex(Math.min(Math.max(0, index), children.length - 1));
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [children.length]);

  const scrollBy = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const childWidth = containerRef.current.firstElementChild?.clientWidth || 300;
    const delta = direction === 'left' ? -(childWidth + 16) : (childWidth + 16);
    containerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const childWidth = containerRef.current.firstElementChild?.clientWidth || 300;
    const gap = 16;
    containerRef.current.scrollTo({ left: index * (childWidth + gap), behavior: 'smooth' });
  };

  // Mouse Drag Handlers for Desktop Touch Emulation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftStart(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Swipe Gesture Handlers
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        scrollBy('right');
      } else {
        scrollBy('left');
      }
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Touch Swipe Cue & Controls Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-gray-200/80 text-[11px] font-semibold text-[#4A5A53]">
          <Hand className="w-3.5 h-3.5 text-[#D96C4E] animate-pulse" />
          <span>{hintText}</span>
        </div>

        {/* Arrow Navigation Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollBy('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="p-2 rounded-xl bg-white border border-gray-200 shadow-xs text-[#1C2723] hover:bg-[#2A5A43] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1C2723] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="p-2 rounded-xl bg-white border border-gray-200 shadow-xs text-[#1C2723] hover:bg-[#2A5A43] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1C2723] transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-1 scroll-smooth touch-pan-x cursor-grab active:cursor-grabbing select-none ${className}`}
      >
        {children.map((child, idx) => (
          <div key={idx} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>

      {/* Active Dot Indicators */}
      {children.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {children.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx 
                  ? 'w-6 bg-[#2A5A43]' 
                  : 'w-2 bg-gray-200 hover:bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
