import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, Sparkles } from 'lucide-react';
import { CITIES_LIST_LEFT, CITIES_LIST_RIGHT } from '../constants/appData';

interface TwoColumnCityDropdownProps {
  value: string;
  onChange: (city: string) => void;
  id?: string;
  className?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
  variant?: 'light' | 'white' | 'compact';
}

export const TwoColumnCityDropdown: React.FC<TwoColumnCityDropdownProps> = ({
  value,
  onChange,
  id,
  className = '',
  showAllOption = false,
  allOptionLabel = 'All Cities Across India',
  variant = 'light'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  const getDisplayLabel = () => {
    if (value === 'all' || !value) {
      return showAllOption ? 'All Cities' : 'Select City';
    }
    return value;
  };

  const bgClasses = 
    variant === 'white' 
      ? 'bg-white hover:bg-gray-50 border-gray-200' 
      : variant === 'compact'
      ? 'bg-transparent border-transparent'
      : 'bg-[#FAF9F5] hover:bg-gray-50 border-gray-200';

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-50' : 'z-20'} ${className}`}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold text-[#1C2723] transition-all duration-150 focus:ring-2 focus:ring-[#2A5A43]/20 focus:outline-none cursor-pointer ${bgClasses}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          <MapPin className="w-4 h-4 text-[#2A5A43] shrink-0" />
          <span className="truncate">{getDisplayLabel()}</span>
        </div>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2A5A43]' : ''}`} 
        />
      </button>

      {/* Two-Part Divided Dropdown Popover */}
      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-1.5 w-[calc(100vw-3.25rem)] sm:w-[440px] max-w-[calc(100vw-2rem)] sm:max-w-[460px] max-h-[min(380px,50vh)] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#2A5A43]/15 z-[100] animate-in fade-in zoom-in-95 duration-150"
          style={{ transformOrigin: 'top left' }}
        >
          {/* Header Banner */}
          <div className="bg-[#FAF9F5] px-4 py-2.5 border-b border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2723]">
              <MapPin className="w-3.5 h-3.5 text-[#2A5A43]" />
              <span>Select City (15 Operational Hubs)</span>
            </div>
            <span className="text-[10px] font-semibold bg-[#2A5A43]/10 text-[#2A5A43] px-2 py-0.5 rounded-full">
              Verified Services
            </span>
          </div>

          {/* Optional "All Cities" Option */}
          {showAllOption && (
            <div className="px-3 pt-2 pb-1 border-b border-gray-100">
              <button
                type="button"
                onClick={() => handleSelect('all')}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  value === 'all' 
                    ? 'bg-[#2A5A43] text-white' 
                    : 'text-[#1C2723] hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{allOptionLabel}</span>
                </div>
                {value === 'all' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
          )}

          {/* Two-Column Grid: 8 Cities on Left, 7 Cities on Right */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 p-2 sm:p-3">
            
            {/* Left Side: 8 Metro Cities */}
            <div className="pr-1.5 sm:pr-2 space-y-1">
              <div className="px-2 py-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A5A43]">
                  Metros (8)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A5A43]" />
              </div>
              
              <div className="space-y-0.5">
                {CITIES_LIST_LEFT.map((city) => {
                  const isSelected = value === city;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2A5A43] text-white shadow-2xs'
                          : 'text-[#1C2723] hover:bg-emerald-50 hover:text-[#2A5A43]'
                      }`}
                    >
                      <span className="truncate">{city}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side: 7 Emerging & Regional Hubs */}
            <div className="pl-1.5 sm:pl-2 space-y-1">
              <div className="px-2 py-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D96C4E]">
                  Regional Hubs (7)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D96C4E]" />
              </div>

              <div className="space-y-0.5">
                {CITIES_LIST_RIGHT.map((city) => {
                  const isSelected = value === city;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2A5A43] text-white shadow-2xs'
                          : 'text-[#1C2723] hover:bg-emerald-50 hover:text-[#2A5A43]'
                      }`}
                    >
                      <span className="truncate">{city}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="bg-[#FAF9F5] px-3 py-1.5 border-t border-gray-100 text-[10px] text-center text-gray-500 font-medium">
            100% Verified Staff in All Cities
          </div>
        </div>
      )}
    </div>
  );
};
