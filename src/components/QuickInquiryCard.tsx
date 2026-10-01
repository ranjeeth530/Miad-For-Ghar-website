import React, { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle2, Send, Sparkles, X, ShieldCheck } from 'lucide-react';
import { CustomInquiry } from '../types';
import { CITIES_LIST } from '../constants/appData';
import { TwoColumnCityDropdown } from './TwoColumnCityDropdown';

interface QuickInquiryCardProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
  onSubmitInquiry: (inquiry: Omit<CustomInquiry, 'id' | 'createdAt'>) => Promise<any>;
}

export const QuickInquiryCard: React.FC<QuickInquiryCardProps> = ({
  isOpenModal = false,
  onCloseModal,
  onSubmitInquiry
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [requirement, setRequirement] = useState('');
  const [urgency, setUrgency] = useState<'Immediate (Today)' | 'As Soon As Possible' | 'This Week' | 'General Query'>('As Soon As Possible');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenModal && onCloseModal) {
        onCloseModal();
      }
    };
    if (isOpenModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenModal, onCloseModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !requirement.trim()) {
      setFormError('Please fill in your name, phone number, and requirement.');
      return;
    }

    setLoading(true);
    setFormError(null);
    try {
      await onSubmitInquiry({ name, phone, city, requirement, urgency });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setFormError('Failed to send callback request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="text-left">
      {submitted ? (
        <div className="bg-white p-4 rounded-xl text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#2A5A43] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-[#2A5A43]" />
          </div>
          <h4 className="font-serif text-base font-bold text-[#1C2723]">Callback Scheduled!</h4>
          
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg text-[10.5px] font-medium mx-auto max-w-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Confirmation sent to <strong>{phone}</strong></span>
          </div>

          <p className="text-[11px] text-[#4A5A53]">
            Thank you, {name}. Our specialist will call within 30 mins to discuss verified candidates.
          </p>
          <p className="text-[10.5px] text-[#2A5A43] font-medium">
            For urgent requests, dial our direct helpline: <a href="tel:+919364798027" className="font-bold underline hover:text-[#1E4231]">+91 93647 98027</a>
          </p>
          {onCloseModal && (
            <button
              onClick={() => { setSubmitted(false); onCloseModal(); }}
              className="mt-1 px-4 py-1.5 rounded-lg bg-[#2A5A43] text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A5A43] cursor-pointer shadow-xs"
            >
              Done
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="inquiry-name-input" className="text-[10px] font-bold uppercase text-[#4A5A53]">Your Name:</label>
              <input
                id="inquiry-name-input"
                type="text"
                required
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="inquiry-phone-input" className="text-[10px] font-bold uppercase text-[#4A5A53]">Phone Number:</label>
              <input
                id="inquiry-phone-input"
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="inquiry-city-select" className="text-[10px] font-bold uppercase text-[#4A5A53]">City:</label>
              <TwoColumnCityDropdown
                id="inquiry-city-select"
                value={city}
                onChange={(newCity) => setCity(newCity)}
              />
            </div>
            <div>
              <label htmlFor="inquiry-urgency-select" className="text-[10px] font-bold uppercase text-[#4A5A53]">Urgency:</label>
              <select
                id="inquiry-urgency-select"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full bg-[#FAF9F5] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43] focus:outline-none"
              >
                <option value="Immediate (Today)">Immediate (Today)</option>
                <option value="As Soon As Possible">As Soon As Possible</option>
                <option value="This Week">This Week</option>
                <option value="General Query">General Query</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="inquiry-req-input" className="text-[10px] font-bold uppercase text-[#4A5A53]">Describe Your Requirement:</label>
            <input
              id="inquiry-req-input"
              type="text"
              required
              placeholder="e.g. Need full-time live-in cook in Bandra for North Indian food..."
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43] focus:outline-none"
            />
          </div>

          {formError && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] active:bg-[#B34B30] text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D96C4E] cursor-pointer active:scale-98 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-amber-200 shrink-0" />
            <span className="truncate">{loading ? 'Submitting...' : 'Request Instant Callback (30 Min)'}</span>
          </button>

          <div className="text-center pt-0.5">
            <span className="text-[11px] text-gray-500">Need immediate help? Dial </span>
            <a href="tel:+919364798027" className="text-[11px] font-bold text-[#2A5A43] hover:underline">
              +91 93647 98027
            </a>
          </div>
        </form>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
        className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 pb-24 sm:pb-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      >
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#2A5A43]/15 p-4 sm:p-5 my-auto max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#D96C4E]" />
              <h3 id="inquiry-modal-title" className="font-serif text-lg font-bold text-[#1C2723]">Request Instant Callback</h3>
            </div>
            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#2A5A43] cursor-pointer"
                aria-label="Close callback modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-10 bg-[#2A5A43] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-5 text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-[11px] font-bold uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" /> Quick Placement Assistance
            </div>
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold leading-snug">Need Custom Domestic Help Quickly?</h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Share your household routine or dietary preference. Our placement manager will call you within 30 minutes to assist on your requirements.
            </p>
            <div className="pt-2 hidden sm:flex items-center gap-4 text-xs text-emerald-200/90 font-medium">
              <span className="flex items-center gap-1.5">✓ 100% Verified Staff</span>
              <span className="flex items-center gap-1.5">✓ Free Replacement</span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 text-left shadow-xl text-[#1C2723] border border-white/20">
            {formContent}
          </div>
        </div>
      </div>
    </section>
  );
};
