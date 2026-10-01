/**
 * Utility functions for Indian date formatting (DD/MM/YYYY or DD/MM/YY)
 */

export const getLocalTodayIso = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDayMonthYear = (dateInput?: string | Date | null): string => {
  if (!dateInput) return '';
  let d: Date;
  if (typeof dateInput === 'string') {
    const match = dateInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, y, m, day] = match;
      d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(day, 10));
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = dateInput;
  }
  if (isNaN(d.getTime())) return String(dateInput);

  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatDateToIndian = (dateInput?: string | Date | null, fullYear: boolean = true): string => {
  if (!dateInput) return 'N/A';

  if (typeof dateInput === 'string') {
    // If already in DD/MM/YY or DD/MM/YYYY format
    if (/^\d{2}[\/-]\d{2}[\/-]\d{2,4}$/.test(dateInput.trim())) {
      const parts = dateInput.trim().split(/[\/-]/);
      const day = parts[0];
      const month = parts[1];
      let year = parts[2];
      if (year.length === 2) {
        year = `20${year}`;
      }
      return fullYear ? `${day}/${month}/${year}` : `${day}/${month}/${year.slice(-2)}`;
    }
    // Handle YYYY-MM-DD directly to prevent timezone offset shifts
    const yyyyMmDdMatch = dateInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (yyyyMmDdMatch) {
      const [, year, month, day] = yyyyMmDdMatch;
      return fullYear ? `${day}/${month}/${year}` : `${day}/${month}/${year.slice(-2)}`;
    }
  }

  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return String(dateInput);
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear());

  return fullYear ? `${day}/${month}/${year}` : `${day}/${month}/${year.slice(-2)}`;
};

export const isoToIndianDate = (isoStr: string): string => {
  if (!isoStr) return '';
  const match = isoStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, yyyy, mm, dd] = match;
    return `${dd}/${mm}/${yyyy}`;
  }
  return formatDateToIndian(isoStr);
};

export const indianToIsoDate = (indianStr: string): string => {
  if (!indianStr) return '';
  const trimmed = indianStr.trim();
  const match = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
  if (match) {
    const [, dd, mm, yyyy] = match;
    const year = yyyy.length === 2 ? `20${yyyy}` : yyyy;
    return `${year}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return indianStr;
};

export const formatTime12Hour = (dateInput?: string | Date | null, includeSeconds: boolean = false): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  return d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true,
  });
};

export const formatDateTimeToIndian = (dateInput?: string | Date | null, includeSeconds: boolean = false): string => {
  if (!dateInput) return 'N/A';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  const datePart = formatDateToIndian(d);
  const timePart = formatTime12Hour(d, includeSeconds);

  return `${datePart}, ${timePart}`;
};
