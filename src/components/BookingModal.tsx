import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Home, 
  ArrowRight, 
  ArrowLeft, 
  IndianRupee,
  Check,
  Briefcase
} from 'lucide-react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import appLogo from '../assets/images/logo_maid_ghar_1788710443908.jpg';
import { ServiceCategory, ShiftType, DomesticHelper, BookingRequest } from '../types';
import { SERVICE_CATEGORIES } from '../constants/appData';
import { formatDateToIndian, isoToIndianDate, indianToIsoDate, getLocalTodayIso } from '../utils/dateUtils';
import { LiveDateCalendarPicker } from './LiveDateCalendarPicker';
import { TwoColumnCityDropdown } from './TwoColumnCityDropdown';

export const SALARY_RANGE_OPTIONS = [
  'Rs.  9000-11000 (2 hours)',
  'Rs.  12000-14000 (3-4 hours)',
  'Rs.  14000-16000 (5-6 hours)',
  'Rs.  18000-20000 (8-9 hours)',
  'Rs.  22000-24000 (10-11 hours)',
  'Rs.  25000-28000 (Live-in)(Food to be provided by client)',
] as const;

// Compact display names for services to keep buttons neat & precise
const SERVICE_SHORT_TITLES: Record<ServiceCategory, string> = {
  house_cleaning: 'House Maid',
  cook_chef: 'Cook / Chef',
  babysitter: 'Babysitter / Nanny',
  elderly_care: 'Elderly Care',
  driver: 'Private Driver',
  all_rounder: 'All-Rounder'
};

const SHIFT_OPTIONS: { id: ShiftType; label: string; hours: string }[] = [
  { id: 'part_time', label: 'Part-Time', hours: '2–4 hrs' },
  { id: 'full_time_8h', label: 'Day Shift', hours: '8 hrs' },
  { id: 'full_time_12h', label: 'Full Day', hours: '12 hrs' },
  { id: 'live_in_24h', label: 'Live-In', hours: '24 hrs' }
];

const HOUSEHOLD_OPTIONS = ['1 BHK', '2–3 BHK', '4+ BHK', 'Villa / House'];

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  preselectedHelper?: DomesticHelper | null;
  onSubmitBooking: (booking: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) => Promise<any>;
  className?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  preselectedHelper,
  onSubmitBooking,
  className
}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Real-time current date in local YYYY-MM-DD
  const getTodayIso = () => getLocalTodayIso(new Date());

  // Form State
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>(
    (initialServiceId as ServiceCategory) || 'house_cleaning'
  );
  const [shiftType, setShiftType] = useState<ShiftType>('full_time_8h');
  const [startDate, setStartDate] = useState<string>(() => getTodayIso());
  const [, setIndianDateInput] = useState<string>(() =>
    isoToIndianDate(getTodayIso())
  );

  const [city, setCity] = useState<string>('Mumbai');
  const [locality, setLocality] = useState<string>('');
  const [householdSize, setHouseholdSize] = useState<string>('2–3 BHK');
  const [salaryRange, setSalaryRange] = useState<string>('Rs.  18000-20000 (8-9 hours)');
  
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Restore form state
  const resetFormState = () => {
    const today = getTodayIso();
    setStep(1);
    setConfirmedBookingId(null);
    setStartDate(today);
    setIndianDateInput(isoToIndianDate(today));
    setHouseholdSize('2–3 BHK');
    setSalaryRange('Rs.  18000-20000 (8-9 hours)');
    setCustomerName('');
    setPhone('');
    setEmail('');
    setLocality('');
    setSpecialInstructions('');
    setFormError(null);
    if (initialServiceId) {
      setServiceCategory(initialServiceId as ServiceCategory);
    } else {
      setServiceCategory('house_cleaning');
    }
    if (preselectedHelper) {
      setServiceCategory(preselectedHelper.category);
      setCity(preselectedHelper.city);
    } else {
      setCity('Mumbai');
    }
  };

  const prevIsOpenRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      resetFormState();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, initialServiceId, preselectedHelper?.id]);

  // Lock background body scroll
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Smooth scroll top on step transitions
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [step]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        resetFormState();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentServiceObj = SERVICE_CATEGORIES.find(s => s.id === serviceCategory) || SERVICE_CATEGORIES[0];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (step === 1) {
      if (!salaryRange) {
        setFormError('Please select your preferred salary budget.');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!city.trim() || !locality.trim()) {
        setFormError('Please provide your city and locality / address.');
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    if (!customerName.trim() || !phone.trim() || !city.trim()) {
      setFormError('Please fill in your name, mobile number, and city.');
      return;
    }

    setLoading(true);
    setFormError(null);
    try {
      const res = await onSubmitBooking({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        locality: locality.trim(),
        serviceCategory,
        serviceTitle: currentServiceObj.title,
        shiftType,
        salaryRange,
        helperId: preselectedHelper?.id,
        helperName: preselectedHelper?.name,
        startDate,
        householdSize,
        specialInstructions: specialInstructions.trim()
      });

      setConfirmedBookingId(res?.id || `BK-${Math.floor(1000 + Math.random() * 9000)}`);
      setStep(4);
    } catch (err) {
      console.error(err);
      setFormError('Booking request failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    resetFormState();
    if (onClose) onClose();
  };

  // Wheel forwarding for smooth scrolling anywhere on card
  const handleScrollWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onWheel={handleScrollWheel}
      className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-3 sm:py-6 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          resetAndClose();
        }
      }}
    >
      <div 
        className={`relative w-full sm:max-w-xl bg-white h-auto max-h-[96dvh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-[#2A5A43]/20 flex flex-col text-left overflow-hidden ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* COMPACT CLEAN HEADER */}
        <div 
          onWheel={handleScrollWheel}
          className="sticky top-0 z-30 bg-[#2A5A43] text-white px-4 py-3 sm:px-5 sm:py-3.5 relative shrink-0 shadow-xs select-none"
        >
          {/* Close Button */}
          <button 
            type="button"
            onClick={resetAndClose}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white z-10"
            aria-label="Close booking modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand & Heading in single compact row */}
          <div className="flex items-center gap-2.5 pr-8">
            <img
              src={appLogo}
              alt="Maid for Ghar Logo"
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
              <h3 id="booking-modal-title" className="font-serif text-sm sm:text-base font-bold text-white tracking-tight leading-tight truncate">
                {step === 4 ? 'Booking Confirmed' : preselectedHelper ? `Book ${preselectedHelper.name}` : 'Book Domestic Staff'}
              </h3>
            </div>
          </div>

          {/* COMPACT SEGMENTED STEPPER */}
          {step < 4 && (
            <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-white/15 text-[10px] sm:text-xs min-w-0">
              {[
                { num: 1, label: 'Service & Shift' },
                { num: 2, label: 'Date & Address' },
                { num: 3, label: 'Contact Info' }
              ].map((s) => {
                const isActive = step === s.num;
                const isDone = step > s.num;
                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (s.num < step || (step === 1 && salaryRange)) {
                        setStep(s.num);
                      }
                    }}
                    className={`flex items-center justify-center gap-1 py-1 px-1 sm:px-1.5 rounded-md font-medium transition-all text-center min-w-0 ${
                      isActive 
                        ? 'bg-white text-[#2A5A43] font-bold shadow-xs' 
                        : isDone
                        ? 'bg-white/20 text-white hover:bg-white/30 cursor-pointer'
                        : 'bg-white/10 text-white/70 hover:bg-white/15 cursor-pointer'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                      isActive ? 'bg-[#2A5A43] text-white font-bold' : isDone ? 'bg-emerald-300 text-[#2A5A43] font-bold' : 'bg-white/20 text-white'
                    }`}>
                      {isDone ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : s.num}
                    </span>
                    <span className="truncate">{s.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* COMPACT SCROLLABLE FORM BODY */}
        <div 
          ref={scrollContainerRef} 
          tabIndex={0}
          className="p-3.5 sm:p-5 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-6 overflow-y-auto overscroll-y-contain flex-1 min-h-0 touch-pan-y focus:outline-none"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'contain',
            scrollbarWidth: 'thin',
            scrollbarColor: '#2A5A43 rgba(0,0,0,0.08)'
          }}
        >
          {/* STEP 1: SERVICE & SHIFT */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-3">
              {/* Service Selection: Compact 2-column or 3-column chip grid */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#2A5A43] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D96C4E]" />
                  <span>1. Required Domestic Service:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {SERVICE_CATEGORIES.map((s) => {
                    const isSelected = serviceCategory === s.id;
                    const shortTitle = SERVICE_SHORT_TITLES[s.id] || s.title;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setServiceCategory(s.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer min-w-0 ${
                          isSelected
                            ? 'border-[#2A5A43] bg-[#2A5A43]/8 ring-1 ring-[#2A5A43] shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#2A5A43] bg-[#2A5A43]' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-xs sm:text-[13px] truncate ${isSelected ? 'font-bold text-[#1C2723]' : 'font-medium text-gray-700'}`}>
                          {shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duty Shift: 2 columns on mobile, 4 on tablet/desktop */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#2A5A43] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>2. Working Hours / Shift:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {SHIFT_OPTIONS.map((sh) => {
                    const isSelected = shiftType === sh.id;
                    return (
                      <button
                        type="button"
                        key={sh.id}
                        onClick={() => setShiftType(sh.id)}
                        className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer min-w-0 ${
                          isSelected
                            ? 'border-[#D96C4E] bg-[#D96C4E]/10 text-[#D96C4E] font-bold shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-xs sm:text-[13px] font-semibold leading-tight truncate">{sh.label}</div>
                        <div className="text-[10.5px] sm:text-xs text-gray-500 font-normal leading-tight truncate mt-0.5">{sh.hours}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Salary Range: Clean 2-column list */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#2A5A43] flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-[#2A5A43]" />
                    <span>3. Preferred Monthly Budget:</span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">Standard verified rates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {SALARY_RANGE_OPTIONS.map((option) => {
                    const isSelected = salaryRange === option;
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => {
                          setSalaryRange(option);
                          setFormError(null);
                        }}
                        className={`px-3 py-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer min-w-0 ${
                          isSelected
                            ? 'border-[#2A5A43] bg-[#F1F4EB] ring-1 ring-[#2A5A43] shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#2A5A43] bg-[#2A5A43]' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-xs sm:text-[13px] leading-tight truncate ${isSelected ? 'text-[#1C2723] font-bold' : 'text-gray-700 font-medium'}`}>
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {formError && !salaryRange && (
                  <p className="text-[11px] text-red-600 font-semibold mt-0.5">Please select a salary budget option.</p>
                )}
              </div>

              {/* Household Size: Compact 4-pill selector */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#2A5A43] flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-[#2A5A43]" />
                  <span>4. House / Property Size:</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 min-w-0">
                  {HOUSEHOLD_OPTIONS.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setHouseholdSize(size)}
                      className={`py-2 px-1 rounded-xl border text-xs sm:text-[12.5px] font-semibold text-center cursor-pointer transition-colors min-w-0 truncate ${
                        householdSize === size
                          ? 'border-[#2A5A43] bg-[#2A5A43] text-white shadow-2xs'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] active:bg-[#163326] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DATE & ADDRESS */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-3">
              {/* Interactive Calendar Date Picker */}
              <LiveDateCalendarPicker
                value={startDate}
                onChange={(val) => {
                  setStartDate(val);
                  setIndianDateInput(isoToIndianDate(val));
                }}
                label="Preferred Placement Start Date"
              />

              {/* City and Locality in tidy 2-column layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A5A53] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#2A5A43]" /> City:
                  </label>
                  <TwoColumnCityDropdown
                    id="booking-city-select"
                    value={city}
                    onChange={(newCity) => setCity(newCity)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A5A53] flex items-center gap-1">
                    <Home className="w-3 h-3 text-[#2A5A43]" /> Locality / Area / Pincode:
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bandra West, Sector 56, HSR Layout"
                    value={locality}
                    onChange={(e) => {
                      setLocality(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43]/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Household Preferences */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A5A53] flex items-center justify-between">
                  <span>Special Requirements (Optional):</span>
                  <span className="text-[10px] text-gray-400 font-normal">e.g. Veg cook, dog friendly</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific food, language, or elderly/child care preferences..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl p-2.5 text-xs text-[#1C2723] resize-none focus:ring-2 focus:ring-[#2A5A43]/20 focus:outline-none"
                />
              </div>

              {formError && (
                <p className="text-[11px] text-red-600 font-semibold">{formError}</p>
              )}

              {/* Navigation Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] active:bg-[#163326] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
                >
                  <span>Continue to Contact</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CONTACT & CONFIRMATION */}
          {step === 3 && (
            <form onSubmit={handleNextStep} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A5A53] flex items-center gap-1">
                  <User className="w-3 h-3 text-[#2A5A43]" /> Full Name:
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your complete name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43]/20 focus:outline-none"
                />
              </div>

              {/* Phone & Email in clean 2-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A5A53] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#D96C4E]" /> Mobile Number:
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43]/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#4A5A53] flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#2A5A43]" /> Email Address (Optional):
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF9F5] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#1C2723] focus:ring-2 focus:ring-[#2A5A43]/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* Concise Summary Receipt Ticket */}
              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#2A5A43]/15 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-gray-200/80 pb-1.5">
                  <span className="font-bold text-[#2A5A43] uppercase text-[10.5px] tracking-wider flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Booking Request Summary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-[#1C2723] min-w-0">
                  <div className="min-w-0 truncate"><span className="text-gray-500">Service:</span> <strong>{currentServiceObj.title}</strong></div>
                  <div className="min-w-0 truncate"><span className="text-gray-500">Shift:</span> <strong>{shiftType.replace(/_/g, ' ')}</strong></div>
                  <div className="min-w-0 truncate"><span className="text-gray-500">Location:</span> <strong>{city}</strong> {locality ? `(${locality})` : ''}</div>
                  <div className="min-w-0 truncate"><span className="text-gray-500">Start Date:</span> <strong>{formatDateToIndian(startDate)}</strong></div>
                  <div className="col-span-1 sm:col-span-2 text-xs pt-0.5 border-t border-gray-200/60 flex items-center justify-between min-w-0">
                    <span className="text-gray-500">Estimated Salary:</span>
                    <strong className="text-[#2A5A43] truncate">{salaryRange}</strong>
                  </div>
                </div>

                <div className="text-[10px] text-[#4A5A53] flex items-center gap-1 pt-1 border-t border-gray-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2A5A43] shrink-0" />
                  <span>Interview candidates & verify credentials with free replacement guarantee.</span>
                </div>
              </div>

              {formError && (
                <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Navigation Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-[#D96C4E] hover:bg-[#C55B3E] active:bg-[#B34B30] text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{loading ? 'Submitting...' : 'Confirm Placement Request'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION TICKET */}
          {step === 4 && (
            <div className="py-3 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2A5A43]/10 text-[#2A5A43] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-[#2A5A43]" />
              </div>

              <div className="space-y-0.5">
                <h4 className="font-serif text-lg font-bold text-[#1C2723]">Placement Request Received!</h4>
                <p className="text-xs text-[#4A5A53]">
                  Booking Reference: <strong className="text-[#2A5A43] font-mono text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{confirmedBookingId}</strong>
                </p>
              </div>

              <div className="bg-[#FAF9F5] p-3 rounded-xl border border-gray-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-emerald-900 text-[11px] leading-tight flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>SMS & WhatsApp confirmation sent to <strong>{phone}</strong>.</span>
                </div>

                <div className="text-[11px] space-y-1 text-gray-700">
                  <div className="font-bold text-[#1C2723]">Next steps:</div>
                  <div className="flex items-start gap-1">
                    <span className="text-[#2A5A43] font-bold">1.</span>
                    <span>Placement manager will call within <strong>30 minutes</strong>.</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="text-[#2A5A43] font-bold">2.</span>
                    <span>100% verified candidate profiles shared on WhatsApp.</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="text-[#2A5A43] font-bold">3.</span>
                    <span>Free telephonic interview before placement.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=919364798027&text=${encodeURIComponent(`Hello Maid for Ghar! I just booked request #${confirmedBookingId} for ${customerName || 'Domestic Staff'}. Please share verified profiles.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp Placement Desk</span>
                </a>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#2A5A43] hover:bg-[#1E4231] text-white font-semibold text-xs cursor-pointer"
                >
                  Close & View Staff
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
