import { format, isToday, isYesterday, parseISO, startOfDay } from 'date-fns';

/**
 * Formats minutes into human-readable format like "2h 30m" or "45m"
 */
export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Formats minutes to decimal hours for charts (e.g. 90 -> 1.5)
 */
export function minutesToHours(minutes: number): number {
  return Number((minutes / 60).toFixed(1));
}

/**
 * Get standard YYYY-MM-DD for today in local timezone
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a YYYY-MM-DD or ISO string into a friendly label: "Today, Sep 5", "Yesterday", "Mon, Sep 2"
 */
export function formatDateLabel(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    if (isToday(dateObj)) {
      return `Today, ${format(dateObj, 'MMM d')}`;
    }
    if (isYesterday(dateObj)) {
      return `Yesterday, ${format(dateObj, 'MMM d')}`;
    }
    return format(dateObj, 'EEE, MMM d, yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Formats date into short display (e.g. "Sep 5" or "09/05")
 */
export function formatShortDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return format(dateObj, 'MMM d');
  } catch {
    return dateStr;
  }
}

/**
 * Normalize Date to UTC Start of Day or ISO YYYY-MM-DD
 */
export function toISODateOnly(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
