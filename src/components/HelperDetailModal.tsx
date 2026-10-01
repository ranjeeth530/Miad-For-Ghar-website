import React, { useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Star, MapPin, Award, Clock, Languages, Calendar, UserCheck, PhoneCall, Sparkles } from 'lucide-react';
import { DomesticHelper } from '../types';
import { formatDateToIndian } from '../utils/dateUtils';

interface HelperDetailModalProps {
  helper: DomesticHelper | null;
  onClose: () => void;
  onBookHelper: (helper: DomesticHelper) => void;
}

export const HelperDetailModal: React.FC<HelperDetailModalProps> = ({ helper, onClose, onBookHelper }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && helper) {
        onClose();
      }
    };
    if (helper) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [helper, onClose]);

  if (!helper) return null;

  const renderBadgeName = (badge: string) => {
    switch (badge) {
      case 'police_verified': return '100% Verified Staff';
      case 'id_verified': return '100% Verified Staff';
      case 'health_certified': return 'Medical & Health Check Passed';
      case 'covid_vaccinated': return 'Fully Vaccinated';
      case 'first_aid_trained': return 'First-Aid & Emergency Trained';
      case 'background_checked': return 'Reference Checked';
      default: return badge.replace('_', ' ');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="helper-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#2A5A43]/15 overflow-hidden my-4 sm:my-8 text-left max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-[#2A5A43] text-white p-5 sm:p-6 relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close helper details"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pr-8">
            <img 
              src={helper.photoUrl} 
              alt={helper.name} 
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300';
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 id="helper-detail-title" className="font-serif text-xl sm:text-2xl font-bold">{helper.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F59E0B] text-black font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-0.5">{helper.categoryTitle}</p>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-emerald-200 font-medium">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#F59E0B]" /> {helper.experienceYears} Yrs Exp
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" /> {helper.rating} ({helper.reviewsCount})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" /> {helper.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-gray-100">
              <div className="text-[10px] font-bold uppercase text-[#4A5A53]">Age & Gender</div>
              <div className="text-sm font-bold text-[#1C2723]">{helper.age} Yrs • {helper.gender}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-gray-100">
              <div className="text-[10px] font-bold uppercase text-[#4A5A53]">Availability</div>
              <div className="text-sm font-bold text-[#2A5A43]">{helper.availability}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-gray-100">
              <div className="text-[10px] font-bold uppercase text-[#4A5A53]">Jobs Completed</div>
              <div className="text-sm font-bold text-[#1C2723]">{helper.completedJobs}+ Families</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F5] border border-gray-100">
              <div className="text-[10px] font-bold uppercase text-[#4A5A53]">Verification Date</div>
              <div className="text-sm font-bold text-[#1C2723]">{formatDateToIndian(helper.verifiedAt)}</div>
            </div>
          </div>

          {/* About & Bio */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A5A43]">Helper Summary & Background</h4>
            <p className="text-sm text-[#4A5A53] leading-relaxed bg-[#FAF9F5] p-4 rounded-xl border border-gray-100">
              "{helper.bio}"
            </p>
          </div>

          {/* Verification Badges */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A5A43] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#2A5A43]" /> Checked Security Badges
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {helper.badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F1F4EB] text-[#2A5A43] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#2A5A43] shrink-0" />
                  <span>{renderBadgeName(badge)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialties & Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A5A43]">Specialties & Daily Skills</h4>
            <div className="flex flex-wrap gap-2">
              {helper.specialties.map((spec, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-50 text-[#2A5A43] border border-[#2A5A43]/20 text-xs font-medium">
                  ✓ {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Languages & Localities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <div className="text-xs font-bold uppercase text-[#4A5A53] flex items-center gap-1 mb-1">
                <Languages className="w-3.5 h-3.5 text-[#D96C4E]" /> Languages Spoken:
              </div>
              <div className="text-sm font-medium text-[#1C2723]">
                {helper.languages.join(', ')}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-[#4A5A53] flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#2A5A43]" /> Localities Served:
              </div>
              <div className="text-sm font-medium text-[#1C2723]">
                {helper.localities.join(', ')}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#4A5A53] flex items-center gap-1">
            <UserCheck className="w-4 h-4 text-[#2A5A43]" /> 100% Background verified staff
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookHelper(helper);
              }}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Book / Request Interview</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
