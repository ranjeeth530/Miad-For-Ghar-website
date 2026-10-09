import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  UserCheck,
  UtensilsCrossed,
  Baby,
  Car,
  HeartHandshake,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { CustomInquiry } from '../types';
import heroStaffBanner from '../assets/images/hero_five_services_1788713830332.jpg';

interface HeroSectionProps {
  onSearch?: (city: string, category: string, shift: string) => void;
  onOpenBookingModal: (serviceId?: string) => void;
  onPreloadBookingModal?: () => void;
  onSubmitInquiry?: (inquiry: Omit<CustomInquiry, 'id' | 'createdAt'>) => Promise<any>;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  onOpenCityModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenBookingModal,
  onPreloadBookingModal,
  selectedCity: controlledCity,
  onCityChange,
  onOpenCityModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState('house_cleaning');

  const handleBookSelected = (categoryId: string) => {
    if (onSearch) {
      onSearch(controlledCity || 'Mumbai', categoryId, 'all');
    }
    onOpenBookingModal(categoryId);
  };

  const serviceOptions = [
    { 
      id: 'house_cleaning', 
      label: 'House Maid', 
      emoji: '🧹',
      sub: 'Dusting, Mopping & Utensils'
    },
    { 
      id: 'cook_chef', 
      label: 'Home Cook', 
      emoji: '🍳',
      sub: 'Daily Meals & Home Cooking'
    },
    { 
      id: 'babysitter', 
      label: 'Babysitter', 
      emoji: '👶',
      sub: 'Childcare & Infant Nanny'
    },
    { 
      id: 'elderly_care', 
      label: 'Elderly Care', 
      emoji: '👵',
      sub: 'Patient & Elderly Attendant'
    },
    { 
      id: 'driver', 
      label: 'Driver', 
      emoji: '🚗',
      sub: 'Personal & Family Chauffeur'
    },
    { 
      id: 'all_rounder', 
      label: 'All-Rounder', 
      emoji: '🏡',
      sub: 'Multi-Task Household Help'
    }
  ];

  const currentSelectedService = serviceOptions.find(s => s.id === selectedCategory) || serviceOptions[0];

  return (
    <section className="relative z-20 pt-6 pb-8 sm:pt-10 sm:pb-12 bg-[#FAF9F5] border-b border-[#2A5A43]/10">
      {/* Subtle ambient lighting with isolated overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#2A5A43]/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#D96C4E]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl xl:max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 lg:items-end">
          
          {/* Left Column: Clear Value Proposition & Streamlined Search */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-4 text-left">
            
            {/* Tagline Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[#2A5A43]/20 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-serif italic font-bold text-[#0F2E20] text-sm sm:text-base tracking-normal">
                Where Trust Meets Everyday Care
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-medium leading-[1.18] tracking-tight text-[#1C2723]">
                Hire trusted domestic help <br className="hidden sm:inline" />
                <span className="text-[#2A5A43] font-serif italic">for your home and family.</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#4A5A53] max-w-lg leading-relaxed">
                Connect with verified house maids, home cooks, babysitters, senior attendants, and drivers with replacement guarantee.
              </p>
            </div>

            {/* Clean Service Selection & Booking Card */}
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl shadow-md border border-gray-200/90 max-w-xl text-left space-y-4">
              
              {/* Visitor Location / City Selector Bar */}
              <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-gray-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2723]">
                    <MapPin className="w-4 h-4 text-[#2A5A43]" />
                    <span>Select Your City:</span>
                    {(!controlledCity || controlledCity === 'all') && (
                      <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        {controlledCity === 'all' ? 'All India' : 'Choose below'}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCityModal}
                    className="text-[11px] font-bold text-[#2A5A43] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <span>All 15 Cities</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Popular City Quick-Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'].map((cityName) => {
                    const isSelected = (controlledCity || '').toLowerCase() === cityName.toLowerCase();
                    return (
                      <button
                        key={cityName}
                        type="button"
                        onClick={() => onCityChange?.(cityName)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2A5A43] text-white shadow-2xs ring-1 ring-[#2A5A43]'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {cityName}
                      </button>
                    );
                  })}
                  {/* If user selected a city outside the top 6 (e.g. Kolkata, Ahmedabad, Gurugram, etc.) */}
                  {controlledCity && 
                    controlledCity !== 'all' && 
                    !['mumbai', 'bengaluru', 'delhi ncr', 'hyderabad', 'pune', 'chennai'].includes(controlledCity.toLowerCase()) && (
                      <button
                        type="button"
                        onClick={onOpenCityModal}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#2A5A43] text-white shadow-2xs ring-1 ring-[#2A5A43] transition-all cursor-pointer"
                      >
                        {controlledCity}
                      </button>
                    )}
                  <button
                    type="button"
                    onClick={onOpenCityModal}
                    className="px-2 py-1 rounded-lg text-xs font-semibold text-[#D96C4E] hover:bg-amber-50 border border-amber-200 transition-colors cursor-pointer"
                  >
                    + More
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Select Required Service
                  </div>
                  <div className="text-[11px] text-[#5A6B62] mt-0.5">
                    Choose from 100% background-verified domestic professionals
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-[11px] font-bold text-[#2A5A43] bg-[#2A5A43]/10 px-2.5 py-1 rounded-full">
                  Instant Match
                </span>
              </div>

              {/* Six Prominently Sized Service Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {serviceOptions.map((opt) => {
                  const isSelected = selectedCategory === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(opt.id);
                      }}
                      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 text-left flex flex-col justify-between gap-3 transition-all duration-200 cursor-pointer group ${
                        isSelected
                          ? 'bg-[#2A5A43] border-[#2A5A43] text-white shadow-md ring-2 ring-[#2A5A43]/20 scale-[1.02]'
                          : 'bg-[#FAF9F5] hover:bg-white border-gray-200/90 hover:border-[#2A5A43]/40 text-[#1C2723] hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-3xl sm:text-4xl lg:text-[2.5rem] leading-none filter drop-shadow-xs group-hover:scale-115 transition-transform">
                          {opt.emoji}
                        </span>
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-white text-[#2A5A43] flex items-center justify-center text-xs font-black shadow-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full border border-gray-300 group-hover:border-[#2A5A43] transition-colors" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className={`text-sm sm:text-[15px] font-bold leading-snug tracking-tight ${isSelected ? 'text-white' : 'text-[#1C2723]'}`}>
                          {opt.label}
                        </div>
                        <div className={`text-[10px] sm:text-[11px] leading-tight line-clamp-1 ${isSelected ? 'text-emerald-100 font-medium' : 'text-gray-500'}`}>
                          {opt.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Primary CTA Button */}
              <button
                type="button"
                onClick={() => handleBookSelected(selectedCategory)}
                onMouseEnter={() => onPreloadBookingModal?.()}
                onPointerDown={() => onPreloadBookingModal?.()}
                className="w-full py-3 sm:py-3.5 px-5 rounded-xl sm:rounded-2xl bg-[#2A5A43] hover:bg-[#1E4231] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Book Verified {currentSelectedService.label}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

            </div>

          </div>

          {/* Right Column: Hero Staff Banner Visual (Mobile proportional & enlarged, Desktop bottom-aligned and top elevated) */}
          <div className="lg:col-span-7 xl:col-span-7 relative flex flex-col justify-end mt-5 sm:mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-3xl lg:max-w-none w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border-2 border-white/80 ring-1 ring-[#2A5A43]/20 bg-white transition-all duration-300 group">
              <img 
                src={heroStaffBanner} 
                alt="Maid for Ghar - Trusted domestic staff: Cook, Cleaner, Nanny, Elderly Care, and Driver"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero_maid_banner.jpg';
                }}
                className="w-full aspect-[16/10] sm:aspect-[16/9.2] lg:aspect-auto lg:h-[445px] xl:h-[465px] object-cover object-[center_28%] sm:object-[center_22%] lg:object-[center_12%] block group-hover:scale-[1.015] transition-transform duration-500 ease-out"
              />

              {/* Top Banner Verified Staff Badge */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 bg-[#0F2E20]/90 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/20 text-white shadow-sm flex items-center gap-1.5 pointer-events-none">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide">
                  100% Verified Staff
                </span>
              </div>

              {/* 5 Services Interactive Ribbon Overlay on Banner */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-3 sm:left-3 sm:right-3 bg-[#1C2723]/90 backdrop-blur-md px-1 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl border border-white/20 shadow-lg">
                <div className="flex items-center justify-between gap-0.5 sm:gap-1 py-0.5">
                  <button
                    type="button"
                    onClick={() => onOpenBookingModal('cook_chef')}
                    className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 text-[9.5px] sm:text-[11.5px] font-semibold transition-all cursor-pointer group/btn"
                    title="Hire Verified Cook & Chef"
                  >
                    <UtensilsCrossed className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 group-hover/btn:scale-110 transition-transform shrink-0" />
                    <span className="truncate">Cook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenBookingModal('house_cleaning')}
                    className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 text-[9.5px] sm:text-[11.5px] font-semibold transition-all cursor-pointer group/btn"
                    title="Hire Verified Cleaner & Housemaid"
                  >
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300 group-hover/btn:scale-110 transition-transform shrink-0" />
                    <span className="truncate">Cleaner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenBookingModal('babysitter')}
                    className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 text-[9.5px] sm:text-[11.5px] font-semibold transition-all cursor-pointer group/btn"
                    title="Hire Verified Nanny & Babysitter"
                  >
                    <Baby className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-300 group-hover/btn:scale-110 transition-transform shrink-0" />
                    <span className="truncate">Nanny</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenBookingModal('elderly_care')}
                    className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 text-[9.5px] sm:text-[11.5px] font-semibold transition-all cursor-pointer group/btn ring-1 ring-emerald-300/40"
                    title="Hire Verified Elderly Care & Patient Attendant"
                  >
                    <HeartHandshake className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-200 group-hover/btn:scale-110 transition-transform shrink-0" />
                    <span className="truncate">Elderly Care</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenBookingModal('driver')}
                    className="flex-1 min-w-0 py-1 px-1 sm:px-1.5 rounded-lg bg-white/10 hover:bg-white/25 text-white flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 text-[9.5px] sm:text-[11.5px] font-semibold transition-all cursor-pointer group/btn"
                    title="Hire Verified Personal Driver"
                  >
                    <Car className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-300 group-hover/btn:scale-110 transition-transform shrink-0" />
                    <span className="truncate">Driver</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Clean Trust Bar Spanning Across Below Aligned Elements */}
        <div className="pt-4 sm:pt-5 mt-5 sm:mt-6 border-t border-[#2A5A43]/10 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-[#4A5A53]">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 sm:gap-x-7 font-medium">
            <span className="flex items-center gap-1.5 text-[#1C2723]">
              <ShieldCheck className="w-4 h-4 text-[#2A5A43]" /> 100% Verified Staff
            </span>
            <span className="flex items-center gap-1.5 text-[#1C2723]">
              <RefreshCw className="w-4 h-4 text-[#2A5A43]" /> Free Replacement
            </span>
            <span className="flex items-center gap-1.5 text-[#1C2723]">
              <UserCheck className="w-4 h-4 text-[#2A5A43]" /> We Provide Staff As Per Your Requirement
            </span>
          </div>
          <div className="text-[11px] text-[#2A5A43] font-semibold bg-[#2A5A43]/10 px-2.5 py-1 rounded-full">
            Trusted in 15+ Cities Across India
          </div>
        </div>

      </div>
    </section>
  );
};



