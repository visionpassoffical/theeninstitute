/**
 * Centralized Timezone Utilities for THEEN – INSTITUTE OF QUR’AN
 * Standard Operational Timezone: Asia/Kolkata (Indian Standard Time - IST, UTC+5:30)
 */

export const THEEN_TIMEZONE = 'Asia/Kolkata';

/**
 * Returns current date in Asia/Kolkata in 'YYYY-MM-DD' format.
 * Essential for accurate midnight roll-over and attendance recording.
 */
export const getKolkataDateString = (date: Date = new Date()): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: THEEN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // outputs 'YYYY-MM-DD'
};

/**
 * Formats an ISO string or date into a readable date in Asia/Kolkata
 */
export const formatKolkataDate = (dateInput: string | Date | number): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: THEEN_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

/**
 * Formats an ISO string or date into a readable time in Asia/Kolkata (e.g., '04:30 PM IST')
 */
export const formatKolkataTime = (dateInput: string | Date | number): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: THEEN_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d) + ' IST';
};

/**
 * Full date and time representation (e.g., '05 Oct 2026, 12:45 PM IST')
 */
export const formatKolkataFullDateTime = (dateInput: string | Date | number): string => {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: THEEN_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d) + ' IST';
};
