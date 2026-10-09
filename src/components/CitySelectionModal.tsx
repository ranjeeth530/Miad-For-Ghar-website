import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, X, Building2, Check, Sparkles, Compass, Search } from 'lucide-react';
import { CITIES_LIST_LEFT, CITIES_LIST_RIGHT } from '../constants/appData';

interface CitySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  isFirstVisitPrompt?: boolean;
}

export const CitySelectionModal: React.FC<CitySelectionModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  isFirstVisitPrompt = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCityClick = (city: string) => {
    onSelectCity(city);
    onClose();
  };

  const filteredLeft = useMemo(() => {
    if (!searchQuery.trim()) return CITIES_LIST_LEFT;
    const q = searchQuery.toLowerCase().trim();
    return CITIES_LIST_LEFT.filter(c => c.toLowerCase().includes(q) || (c.toLowerCase() === 'bengaluru' && q.includes('bangalore')));
  }, [searchQuery]);

  const filteredRight = useMemo(() => {
    if (!searchQuery.trim()) return CITIES_LIST_RIGHT;
    const q = searchQuery.toLowerCase().trim();
    return CITIES_LIST_RIGHT.filter(c => c.toLowerCase().includes(q) || (c.toLowerCase() === 'gurugram' && q.includes('gurgaon')));
  }, [searchQuery]);

  const totalResults = filteredLeft.length + filteredRight.length;

  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-selection-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden shadow-2xl border border-gray-200 text-left animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 bg-[#FAF9F5] flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2A5A43] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="city-selection-title" className="font-serif text-lg sm:text-xl font-bold text-[#1C2723]">
                  {isFirstVisitPrompt || !selectedCity ? 'Welcome to Maid for Ghar — Choose Your City' : 'Select Your City'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  15 Hubs
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Choose your location to view verified domestic helpers, local salary rates, and immediate candidate availability in your area.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Bar */}
        <div className="px-5 pt-3 pb-2 border-b border-gray-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city e.g. Bengaluru, Pune, Delhi NCR, Hyderabad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A5A43] transition-colors"
              autoFocus={!isFirstVisitPrompt}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 p-0.5 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Modal Body - City Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {totalResults === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm text-gray-500">No matching city found for "{searchQuery}".</p>
              <button
                type="button"
                onClick={() => handleCityClick('all')}
                className="px-4 py-2 rounded-xl bg-[#2A5A43] text-white text-xs font-bold cursor-pointer"
              >
                Browse All Indian Cities
              </button>
            </div>
          ) : (
            <>
              {/* Top Metro Cities */}
              {filteredLeft.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-2.5">
                    <Building2 className="w-3.5 h-3.5 text-[#2A5A43]" />
                    <span>Major Metros (Highest Helper Availability)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {filteredLeft.map((city) => {
                      const isSelected = (selectedCity || '').toLowerCase() === city.toLowerCase();
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleCityClick(city)}
                          className={`p-3 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                            isSelected
                              ? 'border-[#2A5A43] bg-[#2A5A43] text-white shadow-md ring-2 ring-[#2A5A43]/20'
                              : 'border-gray-200 bg-[#FAF9F5] hover:bg-white hover:border-[#2A5A43]/40 text-[#1C2723] hover:shadow-xs'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-[#1C2723]'}`}>
                              {city}
                            </div>
                            <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                              Verified staff ready
                            </div>
                          </div>
                          {isSelected ? (
                            <Check className="w-4 h-4 text-amber-300 shrink-0 ml-1" />
                          ) : (
                            <span className="w-2 h-2 rounded-full border border-gray-300 group-hover:border-[#2A5A43] shrink-0 ml-1 transition-colors" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Regional Hubs & Emerging Cities */}
              {filteredRight.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-2.5">
                    <Compass className="w-3.5 h-3.5 text-[#D96C4E]" />
                    <span>Other Operational Cities & NCR Hubs</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                    {filteredRight.map((city) => {
                      const isSelected = (selectedCity || '').toLowerCase() === city.toLowerCase();
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleCityClick(city)}
                          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                            isSelected
                              ? 'border-[#2A5A43] bg-[#2A5A43] text-white shadow-md ring-2 ring-[#2A5A43]/20'
                              : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-[#1C2723] hover:shadow-2xs'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-[#1C2723]'}`}>
                              {city}
                            </div>
                            <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                              Operational hub
                            </div>
                          </div>
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-amber-300 shrink-0 ml-1" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* All Cities Option */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCityClick('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
                selectedCity === 'all'
                  ? 'bg-[#2A5A43] text-white border-[#2A5A43]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Browse All Cities Across India</span>
            </button>

            <span className="text-[11px] text-gray-400">
              You can change your city anytime from the location selector in the hero section.
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 sm:px-6 sm:py-3.5 bg-[#FAF9F5] border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Currently selected: <strong className="text-[#2A5A43]">{selectedCity ? (selectedCity === 'all' ? 'All Indian Cities' : selectedCity) : 'None (Click a city above)'}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            {selectedCity ? 'Confirm & Explore' : 'Continue'}
          </button>
        </div>

      </div>
    </div>
  );
};

