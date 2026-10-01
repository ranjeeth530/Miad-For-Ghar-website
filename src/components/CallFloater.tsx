import React, { useState } from 'react';
import { PhoneCall, X, ShieldCheck, Clock, ArrowRight, UserCheck } from 'lucide-react';

interface CallFloaterProps {
  onOpenInquiryModal: () => void;
}

export const CallFloater: React.FC<CallFloaterProps> = ({ onOpenInquiryModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile backdrop to dismiss card when tapping outside */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Expanded Call Helpline Card */}
      {isOpen && (
        <div
          id="helpline-support-card"
          className="fixed bottom-16 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm max-h-[calc(100dvh-5rem)] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#D96C4E]/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-left"
        >
          {/* Header */}
          <div className="bg-[#D96C4E] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
              </div>
              <div>
                <div className="font-serif font-bold text-xs sm:text-sm leading-tight text-white">Direct Helpline Desk</div>
                <div className="text-[10px] text-amber-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"></span>
                  <span>Placement Officers Available</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Helpline card"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Card Body */}
          <div className="p-3 sm:p-3.5 bg-[#FAF9F5] space-y-2.5">
            <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 space-y-1">
              <div className="text-xs font-bold text-[#1C2723] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2A5A43]" /> Placement Helpline
                </span>
                <span className="text-[10px] font-bold text-[#D96C4E] bg-orange-50 px-1.5 py-0.5 rounded">Active</span>
              </div>
              <p className="text-[11px] text-[#4A5A53] leading-relaxed">
                Speak directly with our domestic staff placement manager to hire verified helpers.
              </p>
              <a
                href="tel:+919364798027"
                className="text-xs font-bold text-[#D96C4E] hover:underline flex items-center gap-1 pt-0.5"
              >
                <PhoneCall className="w-3 h-3 text-[#D96C4E]" />
                <span>+91 93647 98027</span>
              </a>
            </div>

            {/* Direct Call Button CTA */}
            <a
              href="tel:+919364798027"
              className="w-full py-2 px-3 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] active:scale-[0.98] text-white font-bold text-xs shadow-md flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-white shrink-0 animate-pulse" />
                <span className="truncate">Call: +91 93647 98027</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            {/* Request Instant Callback CTA */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenInquiryModal();
              }}
              className="w-full py-1.5 sm:py-2 px-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#1C2723] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#2A5A43] shrink-0" />
              <span>Or Request Instant Callback</span>
            </button>

            <div className="flex items-center gap-1 text-[10px] text-[#4A5A53] justify-center pt-0.5">
              <Clock className="w-3 h-3 text-[#2A5A43] shrink-0" />
              <span>Hours: 8:00 AM – 9:00 PM (Daily)</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-10 right-3 sm:right-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <a 
            href="tel:+919364798027"
            className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-[#D96C4E]/20 text-xs text-[#1C2723] hover:bg-orange-50/50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#D96C4E]"></span>
            <span className="font-semibold text-[11px] text-[#1C2723]">Call 93647 98027</span>
          </a>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Call Helpline" : "Call Domestic Support Helpline"}
          title="Call Domestic Support Helpline"
          className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#D96C4E] hover:bg-[#C55B3E] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white relative group cursor-pointer"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          )}
        </button>
      </div>
    </>
  );
};
