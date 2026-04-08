'use client';

import { memo } from 'react';
import { format } from 'date-fns';
import type { CalendarCell, DateRange } from '@/lib/calendar';
import { isRangeStart, isRangeEnd, isInRange } from '@/lib/calendar';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DayCellProps {
  cell: CalendarCell;
  range: DateRange | null;
  previewRange: DateRange | null;
  onClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseLeave: () => void;
}

// ─── Role resolution ──────────────────────────────────────────────────────────

type CellRole =
  | 'outside'
  | 'rangeEndpoint'
  | 'rangeInner'
  | 'previewEndpoint'
  | 'previewInner'
  | 'today'
  | 'weekend'
  | 'normal';

function resolveCellRole(
  cell: CalendarCell,
  range: DateRange | null,
  previewRange: DateRange | null,
): CellRole {
  if (!cell.isCurrentMonth) return 'outside';
  if (isRangeStart(cell.date, range) || isRangeEnd(cell.date, range)) return 'rangeEndpoint';
  if (isInRange(cell.date, range)) return 'rangeInner';
  if (isRangeStart(cell.date, previewRange) || isRangeEnd(cell.date, previewRange))
    return 'previewEndpoint';
  if (isInRange(cell.date, previewRange)) return 'previewInner';
  if (cell.isToday)   return 'today';
  if (cell.isWeekend) return 'weekend';
  return 'normal';
}

const ROLE_CLASSES: Record<CellRole, string> = {
  outside:
    'text-muted-foreground/25 cursor-default pointer-events-none',

  // Single selected date or range start/end → solid blue
  rangeEndpoint:
    'bg-[#2563eb] text-white shadow-lg scale-[1.08] z-10 ring-2 ring-[#2563eb]/30',

  // Days inside a confirmed range → deep navy
  rangeInner:
    'bg-[#1e3a5f] text-[#93c5fd] rounded-none',

  // Hover-preview endpoint → medium blue
  previewEndpoint:
    'bg-[#3b82f6]/70 text-white scale-[1.04] z-10 ring-1 ring-[#3b82f6]/20',

  // Hover-preview inner → very light navy tint
  previewInner:
    'bg-[#1e3a5f]/20 text-[#3b82f6] rounded-none',

  // Today → no background fill, just a dot below the number
  today:
    'text-foreground font-bold cursor-pointer hover:bg-muted/50',

  weekend:
    'text-foreground/60 hover:bg-muted/40 cursor-pointer',

  normal:
    'text-foreground/85 hover:bg-muted/50 cursor-pointer',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const DayCell = memo(function DayCell({
  cell,
  range,
  previewRange,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: DayCellProps) {
  const label     = format(cell.date, 'd');
  const ariaLabel = format(cell.date, 'EEEE, MMMM d, yyyy');
  const role      = resolveCellRole(cell, range, previewRange);

  const isEndpoint     = role === 'rangeEndpoint';
  const isInner        = role === 'rangeInner';
  const isPreviewInner = role === 'previewInner';
  const showStrip      = isInner || isPreviewInner;
  const showTodayDot   = cell.isToday && role === 'today';

  const baseClasses = [
    'relative w-full h-full flex items-center justify-center',
    // Mobile: larger text + min tap target via parent aspect-square
    'text-[14px] sm:text-[13px] font-medium rounded-md day-hover',
    'transition-all duration-150 ease-out select-none',
    'touch-action-manipulation',  // prevents 300ms delay on touch
  ].join(' ');

  return (
    <div className="aspect-square relative flex items-center justify-center p-px">
      {showStrip && (
        <span
          aria-hidden="true"
          className={`
            absolute inset-y-px -inset-x-px -z-10 transition-colors duration-150
            ${isInner ? 'bg-[#1e3a5f]' : 'bg-[#1e3a5f]/20'}
          `}
        />
      )}

      {cell.isCurrentMonth ? (
        <button
          type="button"
          onClick={() => onClick(cell.date)}
          onMouseEnter={() => onMouseEnter(cell.date)}
          onMouseLeave={onMouseLeave}
          aria-label={ariaLabel}
          aria-pressed={isEndpoint}
          className={`${baseClasses} ${ROLE_CLASSES[role]}`}
        >
          {label}
          {showTodayDot && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
          )}
        </button>
      ) : (
        <span aria-hidden="true" className={`${baseClasses} ${ROLE_CLASSES.outside}`}>
          {label}
        </span>
      )}
    </div>
  );
}, function propsAreEqual(prevProps, nextProps) {
  // If it's literally a different cell (e.g. viewDate changed drastically), re-render
  if (prevProps.cell.date.getTime() !== nextProps.cell.date.getTime()) return false;

  // Crucial Optimization: A cell only needs to re-render if its resolved visual role changes.
  // E.g. as the hover 'previewRange' moves across the calendar, most cells stay 'normal'
  // and will completely skip rendering.
  const prevRole = resolveCellRole(prevProps.cell, prevProps.range, prevProps.previewRange);
  const nextRole = resolveCellRole(nextProps.cell, nextProps.range, nextProps.previewRange);

  return prevRole === nextRole;
});
