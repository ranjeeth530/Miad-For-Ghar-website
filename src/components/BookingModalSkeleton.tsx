import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import appLogo from '../assets/images/logo_maid_ghar_1788710443908.jpg';

interface BookingModalSkeletonProps {
  onClose?: () => void;
}

export const BookingModalSkeleton: React.FC<BookingModalSkeletonProps> = ({ onClose }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading booking form"
      className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-3 sm:py-6 overflow-hidden animate-in fade-in duration-100"
    >
      <div 
        className="relative w-full sm:max-w-xl bg-white h-full sm:h-auto max-h-[100dvh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-[#2A5A43]/20 flex flex-col text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching BookingModal exactly */}
        <div className="sticky top-0 z-30 bg-[#2A5A43] text-white px-4 py-3 sm:px-5 sm:py-3.5 relative shrink-0 shadow-xs select-none">
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 rounded-lg bg-white/10 text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5 pr-8">
            <img
              src={appLogo}
              alt="Maid for Ghar"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-contain shadow-xs border border-white/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 leading-none mb-0.5">
                <span className="font-serif text-xs sm:text-sm font-bold text-amber-300 tracking-tight">Maid for Ghar</span>
                <span className="text-white/40">•</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-amber-300" /> 100% Verified
                </span>
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
                Book Domestic Staff
              </h3>
            </div>
          </div>

          {/* Stepper placeholder */}
          <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-white/15 text-[10px] sm:text-xs">
            <div className="flex items-center justify-center gap-1 py-1 px-1 rounded-md bg-white text-[#2A5A43] font-bold shadow-xs">
              <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] bg-[#2A5A43] text-white font-bold">1</span>
              <span>Service & Shift</span>
            </div>
            <div className="flex items-center justify-center gap-1 py-1 px-1 rounded-md bg-white/10 text-white/70">
              <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] bg-white/20 text-white">2</span>
              <span>Date & Address</span>
            </div>
            <div className="flex items-center justify-center gap-1 py-1 px-1 rounded-md bg-white/10 text-white/70">
              <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] bg-white/20 text-white">3</span>
              <span>Contact Info</span>
            </div>
          </div>
        </div>

        {/* Shimmer skeleton body */}
        <div className="p-4 sm:p-5 space-y-4 animate-pulse">
          <div className="h-4 w-40 bg-gray-200 rounded-md"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 border border-gray-200/60"></div>
            ))}
          </div>

          <div className="h-4 w-32 bg-gray-200 rounded-md mt-4"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-gray-100 border border-gray-200/60"></div>
            ))}
          </div>

          <div className="h-4 w-36 bg-gray-200 rounded-md mt-4"></div>
          <div className="h-10 rounded-xl bg-gray-100 border border-gray-200/60"></div>

          <div className="pt-2 flex justify-end">
            <div className="h-10 w-28 rounded-xl bg-[#2A5A43]/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
