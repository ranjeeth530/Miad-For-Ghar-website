import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  Star, 
  Award, 
  MapPin, 
  Clock, 
  Languages, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  X,
  UserCheck,
  Zap,
  PhoneCall
} from 'lucide-react';
import { DomesticHelper, ServiceCategory, ShiftType } from '../types';
import { CITIES_LIST, SERVICE_CATEGORIES } from '../constants/appData';
import { HelperDetailModal } from './HelperDetailModal';
import { TwoColumnCityDropdown } from './TwoColumnCityDropdown';

interface HelperDirectoryProps {
  helpers: DomesticHelper[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onBookHelper: (helper: DomesticHelper) => void;
  onAddHelperClick?: () => void;
}

export const HelperDirectory: React.FC<HelperDirectoryProps> = ({
  helpers,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
  onBookHelper,
  onAddHelperClick
}) => {
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyPoliceVerified, setOnlyPoliceVerified] = useState<boolean>(false);
  const [activeModalHelper, setActiveModalHelper] = useState<DomesticHelper | null>(null);

  // Filter logic
  const filteredHelpers = useMemo(() => {
    return helpers.filter((h) => {
      if (selectedCategory !== 'all' && h.category !== selectedCategory) return false;
      if (selectedCity !== 'all' && h.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (selectedShift !== 'all' && !h.shiftTypes.includes(selectedShift as ShiftType)) return false;
      if (onlyPoliceVerified && !h.badges.includes('police_verified')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = h.name.toLowerCase().includes(q);
        const matchesCategory = h.categoryTitle.toLowerCase().includes(q);
        const matchesSpecialty = h.specialties.some((s) => s.toLowerCase().includes(q));
        const matchesLang = h.languages.some((l) => l.toLowerCase().includes(q));
        const matchesLocality = h.localities.some((loc) => loc.toLowerCase().includes(q));
        return matchesName || matchesCategory || matchesSpecialty || matchesLang || matchesLocality;
      }
      return true;
    });
  }, [helpers, selectedCategory, selectedCity, selectedShift, onlyPoliceVerified, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('all');
    setSelectedShift('all');
    setOnlyPoliceVerified(false);
    setSearchQuery('');
  };

  const cityNameDisplay = selectedCity === 'all' || !selectedCity ? 'All Indian Cities' : selectedCity;

  // City-specific helper count
  const totalLocalCount = useMemo(() => {
    if (selectedCity === 'all' || !selectedCity) return helpers.length;
    return helpers.filter(h => h.city.toLowerCase() === selectedCity.toLowerCase()).length;
  }, [helpers, selectedCity]);

  // If no helper profiles exist in the system, do not render the section
  if (!helpers || helpers.length === 0) {
    return null;
  }

  return (
    <section id="helpers" className="py-8 sm:py-12 bg-gradient-to-b from-[#FAF9F5] via-[#F1F5E8]/40 to-[#FAF9F5] scroll-mt-32 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Background Checked Domestic Staff
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2723] tracking-tight">
              Verified Domestic Staff in <span className="text-[#2A5A43] italic font-normal">{cityNameDisplay}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5A53] max-w-2xl">
              Connect directly with screened house maids, cooks, babysitters, elderly caregivers, and drivers ready for immediate hire.
            </p>
          </div>

          {onAddHelperClick && (
            <button
              onClick={onAddHelperClick}
              className="px-3.5 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto shadow-2xs cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" /> Add Helper Profile
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-2xs border border-[#2A5A43]/10 space-y-3 mb-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" aria-hidden="true" />
              <input
                id="helper-search-input"
                type="text"
                placeholder="Search name, skill, language..."
                aria-label="Search helpers by name, skill, or language"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-[#FAF9F5] border border-gray-200 rounded-xl text-xs font-medium text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-700"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div>
              <select
                id="helper-category-select"
                aria-label="Filter by service category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43] focus:outline-none cursor-pointer"
              >
                <option value="all">All Service Categories</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            {/* City Select */}
            <div>
              <TwoColumnCityDropdown
                id="helper-city-select"
                value={selectedCity}
                onChange={(city) => setSelectedCity(city)}
                showAllOption={true}
                allOptionLabel="All Cities Across India"
              />
            </div>

            {/* Shift Select */}
            <div>
              <select
                id="helper-shift-select"
                aria-label="Filter by shift type"
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43] focus:outline-none cursor-pointer"
              >
                <option value="all">All Shift Hours</option>
                <option value="part_time">Part-Time (2-4 hrs)</option>
                <option value="full_time_8h">Full-Time (8 hrs)</option>
                <option value="full_time_12h">Full-Time (12 hrs)</option>
                <option value="live_in_24h">Live-in (24 hrs)</option>
              </select>
            </div>

          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1">Quick Filter:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#2A5A43] text-white'
                  : 'bg-[#FAF9F5] text-[#1C2723] hover:bg-emerald-50'
              }`}
            >
              All Categories ({helpers.length})
            </button>
            {SERVICE_CATEGORIES.map((cat) => {
              const count = helpers.filter(h => {
                const matchCat = h.category === cat.id;
                const matchCity = selectedCity === 'all' || !selectedCity ? true : h.city.toLowerCase() === selectedCity.toLowerCase();
                return matchCat && matchCity;
              }).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#2A5A43] text-white'
                      : 'bg-[#FAF9F5] text-[#1C2723] hover:bg-emerald-50'
                  }`}
                >
                  {cat.title.split('&')[0].trim()} ({count})
                </button>
              );
            })}
          </div>

          {/* Additional Toggles & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
            
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#2A5A43] text-[11px]">
              <input
                type="checkbox"
                checked={onlyPoliceVerified}
                onChange={(e) => setOnlyPoliceVerified(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#2A5A43] focus:ring-[#2A5A43]"
              />
              <span>Show 100% Verified Staff Only</span>
            </label>

            <div className="flex items-center gap-2.5 text-[11px]">
              <span className="text-gray-500 font-medium">
                Showing <strong className="text-[#1C2723]">{filteredHelpers.length}</strong> profiles in <strong className="text-[#2A5A43]">{cityNameDisplay}</strong>
              </span>
              {(selectedCategory !== 'all' || selectedCity !== 'all' || selectedShift !== 'all' || onlyPoliceVerified || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-[#D96C4E] hover:underline font-bold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Helpers Cards Grid */}
        {filteredHelpers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-300 space-y-3">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#1C2723]">No staff match your filter in {cityNameDisplay}</h3>
            <p className="text-xs text-[#4A5A53] max-w-md mx-auto">
              Try switching your city, relaxing search terms, or clicking below to view all verified profiles across India.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-[#2A5A43] text-white text-xs font-bold cursor-pointer hover:bg-[#1E4231] transition-colors"
              >
                Clear All Filters (Show All Cities)
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredHelpers.map((helper) => (
              <div
                key={helper.id}
                className="bg-white rounded-2xl border border-[#2A5A43]/10 shadow-2xs hover:shadow-md transition-all duration-300 p-4 sm:p-4.5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={helper.photoUrl}
                          alt={helper.name}
                          referrerPolicy="no-referrer"
                          loading="eager"
                          decoding="async"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300';
                          }}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2A5A43] text-white flex items-center justify-center text-[9px]" title="Background Verified">
                          ✓
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#1C2723] group-hover:text-[#2A5A43] transition-colors line-clamp-1">
                          {helper.name}
                        </h3>
                        <div className="text-[11px] font-medium text-[#2A5A43]">
                          {helper.categoryTitle}
                        </div>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="px-2 py-0.5 rounded-lg bg-[#FAF9F5] border border-gray-200 text-xs font-bold text-[#1C2723] flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                      <span>{helper.rating}</span>
                    </div>
                  </div>

                  {/* Highlights Tags */}
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-[#4A5A53] mb-3">
                    <div className="flex items-center gap-1.5 font-medium text-[11px]">
                      <Award className="w-3 h-3 text-[#2A5A43] shrink-0" />
                      <span>{helper.experienceYears} Yrs Exp</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-[11px]">
                      <MapPin className="w-3 h-3 text-[#D96C4E] shrink-0" />
                      <span className="font-bold text-[#1C2723] truncate">{helper.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-[11px]">
                      <Clock className="w-3 h-3 text-[#F59E0B] shrink-0" />
                      <span className="truncate">{helper.availability}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-[11px]">
                      <Languages className="w-3 h-3 text-[#2A5A43] shrink-0" />
                      <span className="truncate">{helper.languages.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  {/* Verification Badges */}
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {helper.badges.slice(0, 3).map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#F1F4EB] text-[#2A5A43] text-[9.5px] font-semibold flex items-center gap-1"
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-[#2A5A43]" />
                        {badge === 'police_verified' ? '100% Verified' : badge === 'id_verified' ? '100% Verified Staff' : 'Health Certified'}
                      </span>
                    ))}
                  </div>

                  {/* Localities Serviced */}
                  <div className="text-[10.5px] text-[#4A5A53] mb-2 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="text-gray-500">Areas:</span>
                    <span className="font-medium text-[#1C2723] truncate">{helper.localities.join(', ')}</span>
                  </div>

                  {/* Specialties Pills */}
                  <div className="space-y-1 mb-3">
                    <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#4A5A53]">Top Specialties:</div>
                    <div className="flex flex-wrap gap-1">
                      {helper.specialties.slice(0, 2).map((spec, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px]">
                          • {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2.5 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModalHelper(helper)}
                    className="py-2 px-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-[#1C2723] hover:bg-[#FAF9F5] hover:border-[#2A5A43]/20 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-[#2A5A43]" /> View Profile
                  </button>
                  <button
                    onClick={() => onBookHelper(helper)}
                    className="py-2 px-2.5 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-200" /> Book Staff
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Detailed Modal */}
        {activeModalHelper && (
          <HelperDetailModal
            helper={activeModalHelper}
            onClose={() => setActiveModalHelper(null)}
            onBookHelper={onBookHelper}
          />
        )}

      </div>
    </section>
  );
};
