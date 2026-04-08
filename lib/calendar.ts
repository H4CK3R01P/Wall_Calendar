import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isWithinInterval,
  isWeekend,
  format,
} from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// ─── Calendar Generation ──────────────────────────────────────────────────────

/**
 * Returns a flat array of cells (Mon–Sun rows) for the given month,
 * including overflow days from the previous and next month.
 */
export function buildCalendarCells(viewDate: Date): CalendarCell[] {
  const monthStart = startOfMonth(viewDate);
  const monthEnd   = endOfMonth(viewDate);

  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd   = endOfWeek(monthEnd,   { weekStartsOn: 1 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, viewDate),
    isToday:        isToday(date),
    isWeekend:      isWeekend(date),
  }));
}

// ─── Range Helpers ────────────────────────────────────────────────────────────

export function isRangeStart(date: Date, range: DateRange | null): boolean {
  return range !== null && isSameDay(date, range.start);
}

export function isRangeEnd(date: Date, range: DateRange | null): boolean {
  return range !== null && isSameDay(date, range.end);
}

/** True only for interior days (not the endpoints themselves). */
export function isInRange(date: Date, range: DateRange | null): boolean {
  if (!range) return false;
  return (
    !isSameDay(date, range.start) &&
    !isSameDay(date, range.end) &&
    isWithinInterval(date, { start: range.start, end: range.end })
  );
}

/** True for start, end, and all interior days. */
export function isInRangeInclusive(date: Date, range: DateRange | null): boolean {
  if (!range) return false;
  return isWithinInterval(date, { start: range.start, end: range.end });
}

/**
 * Normalises a raw pair of dates into a DateRange (swaps if end < start).
 */
export function normaliseRange(a: Date, b: Date): DateRange {
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}

// ─── Notes Key ───────────────────────────────────────────────────────────────

const KEY_PREFIX = 'cal:notes:';
const DATE_FMT   = 'yyyy-MM-dd';

/** Derives the localStorage key for a single date. */
export function notesKeyForDate(date: Date): string {
  return `${KEY_PREFIX}${format(date, DATE_FMT)}`;
}

/** Derives the localStorage key for a confirmed date range. */
export function notesKeyForRange(range: DateRange): string {
  return `${KEY_PREFIX}${format(range.start, DATE_FMT)}_${format(range.end, DATE_FMT)}`;
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export const WEEK_HEADERS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function formatFullDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatShortDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}
