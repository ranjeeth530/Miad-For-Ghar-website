import React, { useState } from 'react';
import { 
  Sparkles, 
  UtensilsCrossed, 
  Baby, 
  HeartHandshake, 
  Car, 
  Home, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Info,
  CalendarCheck,
  Zap,
  X
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../constants/appData';
import { ServiceCategory, ServiceDetail } from '../types';

interface ServiceCatalogProps {
  onOpenBookingModal: (serviceId?: string) => void;
  onPreloadBookingModal?: () => void;
  onSelectCategory?: (category: ServiceCategory) => void;
  selectedCity?: string;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  onOpenBookingModal,
  onPreloadBookingModal,
  selectedCity = ''
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [detailedService, setDetailedService] = useState<ServiceDetail | null>(null);

  // Map string icon names to Lucide icons
  const getCategoryIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className={className} />;
      case 'Baby':
        return <Baby className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Home':
        return <Home className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const filteredServices = activeCategoryFilter === 'all'
    ? SERVICE_CATEGORIES
    : SERVICE_CATEGORIES.filter(s => s.id === activeCategoryFilter);

  return (
    <section id="services" className="py-8 sm:py-12 bg-white scroll-mt-32 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-1.5 max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Complete Service Catalog
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2723] tracking-tight">
              Domestic Staffing & Home Care Solutions
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5A53] leading-relaxed">
              Explore 100% background-verified household services with flexible shift timings, direct candidate interviews, and free replacement guarantees in {selectedCity && selectedCity !== 'all' ? selectedCity : 'major cities across India'}.
            </p>
          </div>

          {/* Quick CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenBookingModal()}
              className="px-4 py-2.5 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Place Service Request</span>
            </button>
          </div>
        </div>

        {/* Category Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              activeCategoryFilter === 'all'
                ? 'bg-[#2A5A43] text-white shadow-xs'
                : 'bg-[#FAF9F5] text-gray-700 hover:bg-gray-200/70 border border-gray-200/80'
            }`}
          >
            All Services ({SERVICE_CATEGORIES.length})
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeCategoryFilter === cat.id
                  ? 'bg-[#2A5A43] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-gray-700 hover:bg-gray-200/70 border border-gray-200/80'
              }`}
            >
              {getCategoryIcon(cat.iconName, "w-3.5 h-3.5")}
              <span>{cat.title.split('&')[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#FAF9F5] rounded-2xl border border-[#2A5A43]/15 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#2A5A43]/40 transition-all duration-300 flex flex-col justify-between group text-left"
            >
              {/* Card Media Header */}
              <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-gray-100">
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                {/* Floating Service Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <div className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#2A5A43] text-[10.5px] font-bold flex items-center gap-1 shadow-2xs">
                    {getCategoryIcon(service.iconName, "w-3 h-3 text-[#2A5A43]")}
                    <span>{service.id.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>

                {/* Free Replacement Guarantee tag */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>

                {/* Title inside hero area */}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug drop-shadow-sm">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3">
                
                {/* Short Description */}
                <p className="text-xs text-[#4A5A53] leading-relaxed line-clamp-2">
                  {service.shortDescription}
                </p>

                {/* Popular Shift Timings */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#2A5A43]" />
                    <span>Available Shifts</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {service.popularShifts.map((shift, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[#1C2723] text-[10.5px] font-medium"
                      >
                        {shift}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Responsibilities Snippet */}
                <div className="space-y-1 pt-1.5 border-t border-gray-200/80">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Scope of Work:
                  </div>
                  <ul className="space-y-0.5">
                    {service.responsibilities.slice(0, 2).map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-[#1C2723]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2A5A43] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{resp}</span>
                      </li>
                    ))}
                  </ul>
                  {service.responsibilities.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setDetailedService(service)}
                      className="text-[11px] text-[#2A5A43] font-bold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>+ {service.responsibilities.length - 2} more duties</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Benefits Checklist */}
                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100/90 space-y-0.5">
                  {service.benefits.slice(0, 2).map((ben, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10.5px] font-medium text-emerald-900">
                      <Zap className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span className="truncate">{ben}</span>
                    </div>
                  ))}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenBookingModal(service.id)}
                    onMouseEnter={() => onPreloadBookingModal?.()}
                    onPointerDown={() => onPreloadBookingModal?.()}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold transition-all shadow-2xs active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Place request for this service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailedService(service)}
                    title="View full service specifications"
                    className="p-2.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 transition-all cursor-pointer shrink-0"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#2A5A43]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2A5A43] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#1C2723]">Need a customized combination of services?</h4>
              <p className="text-[11px] text-[#4A5A53]">Our domestic placement team creates tailor-made duty routines tailored to your family's exact needs.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenBookingModal()}
            className="px-4 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold cursor-pointer shrink-0"
          >
            Request Custom Placement
          </button>
        </div>

      </div>

      {/* Detailed Service Specifications Modal */}
      {detailedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col text-left">
            {/* Modal Header */}
            <div className="p-6 bg-[#FAF9F5] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2A5A43] text-white flex items-center justify-center">
                  {getCategoryIcon(detailedService.iconName, "w-5 h-5")}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C2723]">{detailedService.title}</h3>
                  <p className="text-xs text-[#4A5A53]">Service Details & Standards</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailedService(null)}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Overview</h4>
                <p className="text-sm text-[#4A5A53] leading-relaxed">{detailedService.fullDescription}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">All Duties & Scope of Work</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detailedService.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 text-xs text-[#1C2723]">
                      <CheckCircle2 className="w-4 h-4 text-[#2A5A43] shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Available Shift Timings</h4>
                <div className="flex flex-wrap gap-2">
                  {detailedService.popularShifts.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Safety & Quality Standards</h4>
                <div className="space-y-1.5">
                  {detailedService.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#1C2723]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDetailedService(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const sId = detailedService.id;
                  setDetailedService(null);
                  onOpenBookingModal(sId);
                }}
                onMouseEnter={() => onPreloadBookingModal?.()}
                onPointerDown={() => onPreloadBookingModal?.()}
                className="px-5 py-2.5 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Place request for this service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
