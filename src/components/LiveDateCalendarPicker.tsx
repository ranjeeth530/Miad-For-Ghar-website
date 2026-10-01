import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Check, 
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { formatDateToIndian, isoToIndianDate, formatDayMonthYear, getLocalTodayIso } from '../utils/dateUtils';

interface LiveDateCalendarPickerProps {
  value: string; // YYYY-MM-DD
  onChange: (isoDate: string) => void;
  minDate?: string; // YYYY-MM-DD
  label?: string;
  className?: string;
}

export const LiveDateCalendarPicker: React.FC<LiveDateCalendarPickerProps> = ({
  value,
  onChange,
  minDate,
  label = 'Preferred Start Date',
  className = ''
}) => {
  // Live current date state respecting device local timezone
  const [currentLiveDate, setCurrentLiveDate] = useState<Date>(() => new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const previousTodayIsoRef = useRef<string>(getLocalTodayIso(new Date()));

  // Function to refresh current local date and detect midnight crossing
  const refreshLocalDate = useCallback(() => {
    const now = new Date();
    const newTodayIso = getLocalTodayIso(now);
    const prevTodayIso = previousTodayIsoRef.current;

    setCurrentLiveDate(now);

    // If midnight crossed while app was open
    if (newTodayIso !== prevTodayIso) {
      previousTodayIsoRef.current = newTodayIso;
      // If user had previous today selected or no date, automatically refresh to new current day
      if (!value || value === prevTodayIso) {
        onChange(newTodayIso);
      }
    }
  }, [value, onChange]);

  // Keep live date updated every 10 seconds, and listen to window focus/visibility changes
  useEffect(() => {
    refreshLocalDate();
    const interval = setInterval(refreshLocalDate, 10000);

    const handleVisibilityOrFocus = () => {
      refreshLocalDate();
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [refreshLocalDate]);

  const todayIso = getLocalTodayIso(currentLiveDate);
  const effectiveMinIso = minDate || todayIso;

  // Active view month & year in calendar
  const parseIsoToLocalDate = (isoStr?: string): Date => {
    if (!isoStr) return currentLiveDate;
    const match = isoStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, y, m, d] = match;
      return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    }
    const parsed = new Date(isoStr);
    return isNaN(parsed.getTime()) ? currentLiveDate : parsed;
  };

  const initialDate = parseIsoToLocalDate(value || todayIso);
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  // Update view month & year whenever value changes
  useEffect(() => {
    if (value) {
      const d = parseIsoToLocalDate(value);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  // Generate days matrix for the viewMonth/viewYear
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Quick preset dates ISO calculation
  const getOffsetIso = (offsetDays: number): string => {
    const target = new Date(currentLiveDate);
    target.setDate(target.getDate() + offsetDays);
    return getLocalTodayIso(target);
  };

  const getWeekendIso = (): string => {
    const target = new Date(currentLiveDate);
    const day = target.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    target.setDate(target.getDate() + daysUntilSaturday);
    return getLocalTodayIso(target);
  };

  const tomorrowIso = getOffsetIso(1);
  const in2DaysIso = getOffsetIso(2);
  const weekendIso = getWeekendIso();

  const [lastSelectedPreset, setLastSelectedPreset] = useState<'today' | 'tomorrow' | 'in2days' | 'weekend' | null>(() => {
    if (value === todayIso) return 'today';
    return null;
  });

  const isTodayActive = value === todayIso;
  const isTomorrowActive = value === tomorrowIso && (tomorrowIso !== weekendIso || lastSelectedPreset !== 'weekend');
  const isIn2DaysActive = value === in2DaysIso && (in2DaysIso !== weekendIso || lastSelectedPreset !== 'weekend');
  const isWeekendActive = value === weekendIso && (
    lastSelectedPreset === 'weekend' || 
    (value !== tomorrowIso && value !== in2DaysIso)
  );

  // Quick select helper
  const handleQuickSelect = (offsetDays: number) => {
    const targetIso = getOffsetIso(offsetDays);
    if (offsetDays === 0) setLastSelectedPreset('today');
    else if (offsetDays === 1) setLastSelectedPreset('tomorrow');
    else if (offsetDays === 2) setLastSelectedPreset('in2days');
    onChange(targetIso);
  };

  // Select next Saturday
  const handleSelectWeekend = () => {
    const targetIso = getWeekendIso();
    setLastSelectedPreset('weekend');
    onChange(targetIso);
  };

  // Dynamic formatted display string in clear format (e.g., "17 Aug 2026")
  const activeDateValue = value || todayIso;
  const selectedDateFormatted = formatDayMonthYear(activeDateValue);

  return (
    <div className={`space-y-2 text-left ${className}`}>
      {/* Label and Real-time Date Indicator */}
      <div className="flex items-center justify-between flex-wrap gap-1">
        <label className="text-xs font-bold text-[#4A5A53] uppercase flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#2A5A43]" />
          <span>{label}</span>
        </label>
        
        {/* Today's Date Indicator */}
        <button
          type="button"
          onClick={() => {
            onChange(todayIso);
            setViewYear(currentLiveDate.getFullYear());
            setViewMonth(currentLiveDate.getMonth());
            setLastSelectedPreset('today');
          }}
          title="Click to set start date to Today"
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-[#FAF9F5] hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-800 text-[10px] font-semibold cursor-pointer transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2A5A43]" />
          <span>Today: {formatDayMonthYear(currentLiveDate)}</span>
        </button>
      </div>

      {/* Main Trigger Input / Date Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#FAF9F5] hover:bg-white border border-gray-200 hover:border-[#2A5A43]/40 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-bold text-[#1C2723] flex items-center justify-between transition-all shadow-2xs cursor-pointer focus:ring-2 focus:ring-[#2A5A43]/20"
        >
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-4 h-4 text-[#2A5A43] shrink-0" />
            <span className="text-xs font-bold text-[#1C2723]">{selectedDateFormatted}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#2A5A43]' : ''}`} />
        </button>
      </div>

      {/* Quick Date Shortcut Chips */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
        <button
          type="button"
          onClick={() => handleQuickSelect(0)}
          className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10.5px] sm:text-[11px] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
            isTodayActive
              ? 'bg-[#2A5A43] text-white border-[#2A5A43] shadow-2xs'
              : 'bg-white hover:bg-emerald-50 text-[#1C2723] border-gray-200 hover:border-emerald-300'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Today</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickSelect(1)}
          className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10.5px] sm:text-[11px] font-bold transition-colors cursor-pointer border ${
            isTomorrowActive
              ? 'bg-[#2A5A43] text-white border-[#2A5A43] shadow-2xs'
              : 'bg-white hover:bg-emerald-50 text-[#1C2723] border-gray-200 hover:border-emerald-300'
          }`}
        >
          Tomorrow
        </button>

        <button
          type="button"
          onClick={() => handleQuickSelect(2)}
          className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10.5px] sm:text-[11px] font-bold transition-colors cursor-pointer border ${
            isIn2DaysActive
              ? 'bg-[#2A5A43] text-white border-[#2A5A43] shadow-2xs'
              : 'bg-white hover:bg-emerald-50 text-[#1C2723] border-gray-200 hover:border-emerald-300'
          }`}
        >
          In 2 Days
        </button>

        <button
          type="button"
          onClick={handleSelectWeekend}
          className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10.5px] sm:text-[11px] font-bold transition-colors cursor-pointer border ${
            isWeekendActive
              ? 'bg-[#2A5A43] text-white border-[#2A5A43] shadow-2xs'
              : 'bg-white hover:bg-emerald-50 text-[#1C2723] border-gray-200 hover:border-emerald-300'
          }`}
        >
          This Weekend
        </button>
      </div>

      {/* Expandable Live Interactive Calendar View */}
      {isOpen && (
        <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-lg space-y-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="font-serif font-bold text-sm text-[#1C2723]">
                {monthNames[viewMonth]} {viewYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {daysOfWeek.map((d, i) => (
              <div key={d} className={`py-1 ${i === 0 || i === 6 ? 'text-amber-700 font-extrabold' : ''}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Trailing days from previous month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              return (
                <div 
                  key={`prev-${i}`} 
                  className="py-2 text-[11px] text-gray-300 font-medium select-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(viewYear, viewMonth, dayNum);
              const dateIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              
              const isDateToday = dateIso === todayIso;
              const isSelected = dateIso === value;
              const isPast = dateIso < effectiveMinIso;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onChange(dateIso);
                    setIsOpen(false);
                    if (dateIso === todayIso) setLastSelectedPreset('today');
                    else if (dateIso === tomorrowIso) setLastSelectedPreset('tomorrow');
                    else if (dateIso === in2DaysIso) setLastSelectedPreset('in2days');
                    else if (dateIso === weekendIso) setLastSelectedPreset('weekend');
                    else setLastSelectedPreset(null);
                  }}
                  className={`relative py-2 text-xs rounded-xl font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-[#2A5A43] text-white shadow-sm ring-2 ring-[#2A5A43]/30 scale-105 z-10'
                      : isDateToday
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-extrabold'
                      : isPast
                      ? 'text-gray-300 cursor-not-allowed hover:bg-transparent'
                      : 'hover:bg-gray-100 text-[#1C2723]'
                  }`}
                >
                  <span>{dayNum}</span>
                  {isDateToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
                  )}
                  {isSelected && (
                    <span className="w-1 h-1 rounded-full bg-amber-300 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Live Calendar Footer */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Today: <strong>{formatDayMonthYear(currentLiveDate)}</strong></span>
            </div>

            <button
              type="button"
              onClick={() => {
                onChange(todayIso);
                setIsOpen(false);
              }}
              className="font-bold text-[#2A5A43] hover:underline cursor-pointer"
            >
              Select Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
