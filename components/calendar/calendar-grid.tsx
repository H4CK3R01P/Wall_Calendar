'use client';

import { memo, useMemo } from 'react';
import { buildCalendarCells, WEEK_HEADERS } from '@/lib/calendar';
import type { DateRange } from '@/lib/calendar';
import { DayCell } from './day-cell';

// ─── Props ────────────────────────────────────────────────────────────────────

interface CalendarGridProps {
  viewDate: Date;
  range: DateRange | null;
  previewRange: DateRange | null;
  onDayClick: (date: Date) => void;
  onDayMouseEnter: (date: Date) => void;
  onDayMouseLeave: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CalendarGrid = memo(function CalendarGrid({
  viewDate,
  range,
  previewRange,
  onDayClick,
  onDayMouseEnter,
  onDayMouseLeave,
}: CalendarGridProps) {
  const cells = useMemo(() => buildCalendarCells(viewDate), [viewDate]);

  return (
    <div role="grid" aria-label="Calendar grid">
      {/* Week-day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-2" role="row">
        {WEEK_HEADERS.map((day, i) => {
          const isWeekend = i >= 5;
          return (
            <div
              key={day}
              role="columnheader"
              className={`
                text-center text-[10px] font-bold uppercase tracking-[0.15em]
                h-7 flex items-center justify-center
                ${isWeekend ? 'text-primary/50' : 'text-muted-foreground/70'}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Grid separator */}
      <div className="h-px bg-border/50 mb-1" />

      {/* Day cells */}
      <div
        className="grid grid-cols-7 gap-0.5"
        role="rowgroup"
        onMouseLeave={onDayMouseLeave}
      >
        {cells.map((cell) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            range={range}
            previewRange={previewRange}
            onClick={onDayClick}
            onMouseEnter={onDayMouseEnter}
            onMouseLeave={onDayMouseLeave}
          />
        ))}
      </div>
    </div>
  );
});
