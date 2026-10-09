import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { SERVICE_CATEGORIES, CITIES_LIST } from '../constants/appData';

interface WhatsAppFloaterProps {
  selectedCity?: string;
}

export const WhatsAppFloater: React.FC<WhatsAppFloaterProps> = ({
  selectedCity: controlledCity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(() => (controlledCity && controlledCity !== 'all' ? controlledCity : 'Mumbai'));
  const [selectedService, setSelectedService] = useState('house_cleaning');
  const [customMsg, setCustomMsg] = useState('');

  useEffect(() => {
    if (controlledCity && controlledCity !== 'all') {
      setSelectedCity(controlledCity);
    }
  }, [controlledCity]);

  const handleSendWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const serviceObj = SERVICE_CATEGORIES.find(s => s.id === selectedService);
    const serviceTitle = serviceObj ? serviceObj.title : 'Domestic Staff';

    let text = `Hello Maid for Ghar! I am looking for a background-verified ${serviceTitle} in ${selectedCity}.`;
    if (customMsg.trim()) {
      text += ` Requirement: ${customMsg.trim()}`;
    }

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=919364798027&text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

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

      {/* Compact WhatsApp Support Card */}
      {isOpen && (
        <div
          id="whatsapp-support-card"
          className="fixed bottom-16 sm:bottom-28 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm max-h-[calc(100dvh-5rem)] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#2A5A43]/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-left"
        >
          {/* Compact Header */}
          <div className="bg-[#128C7E] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-serif font-bold text-xs sm:text-sm leading-tight text-white">Instant WhatsApp Support</div>
                <div className="text-[10px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>Online • Avg reply &lt; 5 mins</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Close WhatsApp card"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Compact Body Form */}
          <div className="p-3 sm:p-3.5 bg-[#F0F2F5] space-y-2.5">
            {/* 1-Line Trust Badge */}
            <div className="bg-white px-2.5 py-1.5 rounded-xl border border-gray-100 text-[11px] text-[#1C2723] flex items-center justify-between shadow-2xs">
              <span className="font-semibold text-[#2A5A43] flex items-center gap-1 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2A5A43] shrink-0" />
                <span>Direct Staff Placement</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                100% Verified
              </span>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-2">
              {/* 2-Column Selectors for Service & City */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="wa-service-select" className="text-[10px] font-bold uppercase text-[#4A5A53] block mb-0.5">
                    Service:
                  </label>
                  <select
                    id="wa-service-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#1C2723] focus:ring-2 focus:ring-[#128C7E] focus:outline-none cursor-pointer truncate"
                  >
                    {SERVICE_CATEGORIES.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="wa-city-select" className="text-[10px] font-bold uppercase text-[#4A5A53] block mb-0.5">
                    City:
                  </label>
                  <select
                    id="wa-city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#1C2723] focus:ring-2 focus:ring-[#128C7E] focus:outline-none cursor-pointer truncate"
                  >
                    {CITIES_LIST.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Requirement Note Input */}
              <div>
                <label htmlFor="wa-custom-note" className="text-[10px] font-bold uppercase text-[#4A5A53] block mb-0.5">
                  Requirement Note (Optional):
                </label>
                <input
                  id="wa-custom-note"
                  type="text"
                  placeholder="e.g. 8-hour shift cook, immediate start..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#1C2723] placeholder:text-gray-400 focus:ring-2 focus:ring-[#128C7E] focus:outline-none"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                <span>Start WhatsApp Chat</span>
              </button>
            </form>
          </div>

          {/* Compact Footer */}
          <div className="bg-white px-3 py-1.5 text-center text-[10px] text-gray-500 border-t border-gray-100 flex items-center justify-center gap-1 truncate">
            <span className="font-semibold text-[#128C7E]">+91 93647 98027</span>
            <span>• Replacement Guarantee</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="fixed bottom-[8.5rem] sm:bottom-28 right-3 sm:right-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-[#2A5A43]/15 text-xs text-[#1C2723] animate-bounce duration-1000">
            <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
            <span className="font-medium text-[11px]">Chat on WhatsApp</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close WhatsApp Support" : "Contact on WhatsApp"}
          className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white relative group cursor-pointer"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <WhatsAppIcon className="w-5 h-5 sm:w-7 sm:h-7" />
          )}
        </button>
      </div>
    </>
  );
};
