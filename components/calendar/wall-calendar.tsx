'use client';

import { useState, useCallback, useMemo } from 'react';
import { addMonths, subMonths, startOfMonth, getMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, X, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { StoryHero }           from './story-hero';
import { CalendarGrid }        from './calendar-grid';
import { NotesPanel }          from './notes-panel';
import { useNotes }            from '@/hooks/use-notes';
import { useStoryProgress }    from '@/hooks/use-story-progress';
import {
  formatMonthYear,
  formatFullDate,
  formatShortDate,
  normaliseRange,
  notesKeyForDate,
  notesKeyForRange,
} from '@/lib/calendar';
import type { DateRange } from '@/lib/calendar';

// ─── State Machine ────────────────────────────────────────────────────────────

type SelectionPhase = 'idle' | 'picking-end' | 'complete';

interface RangeState {
  phase: SelectionPhase;
  pendingStart: Date | null;
  range: DateRange | null;
}

const INITIAL_RANGE_STATE: RangeState = {
  phase: 'idle',
  pendingStart: null,
  range: null,
};

function rangeReducer(state: RangeState, clicked: Date): RangeState {
  switch (state.phase) {
    case 'idle':
      return { phase: 'picking-end', pendingStart: clicked, range: null };
    case 'picking-end':
      return {
        phase: 'complete',
        pendingStart: null,
        range: normaliseRange(state.pendingStart!, clicked),
      };
    case 'complete':
      // Start a new range immediately on the clicked date
      return { phase: 'picking-end', pendingStart: clicked, range: null };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveNotesContext(
  phase: SelectionPhase,
  pendingStart: Date | null,
  range: DateRange | null,
): { key: string | null; label: string | null } {
  if (phase === 'complete' && range) {
    const sameDay = range.start.toDateString() === range.end.toDateString();
    return {
      key:   sameDay ? notesKeyForDate(range.start) : notesKeyForRange(range),
      label: sameDay
        ? formatShortDate(range.start)
        : `${formatShortDate(range.start)} → ${formatShortDate(range.end)}`,
    };
  }
  if (phase === 'picking-end' && pendingStart) {
    return { key: notesKeyForDate(pendingStart), label: formatShortDate(pendingStart) };
  }
  return { key: null, label: null };
}

// ─── Slide variants ───────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

// ─── Component ────────────────────────────────────────────────────────────────

export function WallCalendar() {
  // ── Month navigation ──────────────────────────────────
  const [viewDate, setViewDate] = useState<Date>(startOfMonth(new Date()));
  const [slideDir, setSlideDir] = useState(0);

  const resetSelection = useCallback(() => {
    setRangeState(INITIAL_RANGE_STATE);
    setHoverDate(null);
  }, []);

  const goToPrevMonth = useCallback(() => {
    setSlideDir(-1);
    setViewDate((d) => subMonths(d, 1));
    resetSelection();
  }, [resetSelection]);

  const goToNextMonth = useCallback(() => {
    setSlideDir(1);
    setViewDate((d) => addMonths(d, 1));
    resetSelection();
  }, [resetSelection]);

  const goToToday = useCallback(() => {
    const now = startOfMonth(new Date());
    setSlideDir(now > viewDate ? 1 : -1);
    setViewDate(now);
    resetSelection();
  }, [resetSelection, viewDate]);

  // ── Range selection ───────────────────────────────────
  const [rangeState, setRangeState] = useState<RangeState>(INITIAL_RANGE_STATE);

  const handleDayClick = useCallback((date: Date) => {
    setHoverDate(null);
    setRangeState((prev) => rangeReducer(prev, date));
  }, []);

  const clearRange = useCallback(() => resetSelection(), [resetSelection]);

  // ── Hover preview ─────────────────────────────────────
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const handleDayMouseEnter = useCallback((date: Date) => setHoverDate(date), []);
  const handleDayMouseLeave = useCallback(() => setHoverDate(null), []);

  const previewRange = useMemo<DateRange | null>(() => {
    if (rangeState.phase !== 'picking-end' || !rangeState.pendingStart || !hoverDate)
      return null;
    return normaliseRange(rangeState.pendingStart, hoverDate);
  }, [rangeState.phase, rangeState.pendingStart, hoverDate]);

  // ── Story progress ────────────────────────────────────
  const { phase, pendingStart, range } = rangeState;

  const selectedDate = useMemo<Date | null>(() => {
    if (phase === 'picking-end') return pendingStart;
    if (phase === 'complete' && range && range.start.toDateString() === range.end.toDateString())
      return range.start;
    return null;
  }, [phase, pendingStart, range]);

  const storyState = useStoryProgress(viewDate, selectedDate, range);

  // ── Notes ─────────────────────────────────────────────
  const { key: notesKey, label: notesLabel } = useMemo(
    () => deriveNotesContext(phase, pendingStart, range),
    [phase, pendingStart, range],
  );

  const { value, setValue, save, isSaved, justSaved } = useNotes(notesKey);

  // ── Derived ───────────────────────────────────────────
  const isPickingEnd = phase === 'picking-end';
  const accent       = storyState.story.accentColor;
  const monthKey     = `${getMonth(viewDate)}-${viewDate.getFullYear()}`;

  return (
    /* ── Page shell ─────────────────────────────────────────────────────── */
    <div className="min-h-screen bg-background py-6 px-3 sm:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-sm sm:max-w-2xl lg:max-w-4xl">

        {/* ── Wire + Today button ──────────────────────────────────────── */}
        <div className="calendar-wire flex justify-center mb-1">
          <motion.button
            type="button"
            onClick={goToToday}
            aria-label="Go to today"
            className="
              relative z-20 flex items-center gap-1.5
              px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]
              rounded-full border border-border/60
              bg-card text-muted-foreground
              hover:text-foreground hover:border-border
              active:scale-95 transition-all duration-200 shadow-sm
              min-h-[36px]
            "
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <CalendarDays className="w-3 h-3" />
            Today
          </motion.button>
        </div>

        {/* ── Calendar Card ────────────────────────────────────────────── */}
        <div className="calendar-shadow calendar-hanger rounded-2xl overflow-hidden bg-card">

          {/* ── Hero image — full width at all breakpoints ─────────────── */}
          <StoryHero viewDate={viewDate} storyState={storyState} />

          {/* ── Body ─────────────────────────────────────────────────────── */}
          <div className="paper-texture">

            {/* Month nav bar */}
            <nav
              className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2"
              aria-label="Month navigation"
            >
              {/* Prev */}
              <motion.button
                type="button"
                onClick={goToPrevMonth}
                aria-label="Previous month"
                className="
                  flex items-center justify-center
                  w-10 h-10 rounded-xl text-muted-foreground/60
                  hover:text-foreground hover:bg-muted/50
                  active:scale-90 transition-colors duration-150
                "
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Animated month title */}
              <div className="relative overflow-hidden h-12 flex flex-col items-center justify-center flex-1 mx-2">
                <AnimatePresence mode="wait" custom={slideDir}>
                  <motion.div
                    key={monthKey}
                    custom={slideDir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="text-center"
                  >
                    <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                      {formatMonthYear(viewDate)}
                    </h2>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] -mt-0.5 truncate max-w-[200px]"
                      style={{ color: accent }}
                    >
                      {storyState.story.icon} {storyState.story.theme} · Wk {storyState.activeWeek}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next */}
              <motion.button
                type="button"
                onClick={goToNextMonth}
                aria-label="Next month"
                className="
                  flex items-center justify-center
                  w-10 h-10 rounded-xl text-muted-foreground/60
                  hover:text-foreground hover:bg-muted/50
                  active:scale-90 transition-colors duration-150
                "
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </nav>

            {/* Separator */}
            <div className="h-px mx-4 sm:mx-6 bg-gradient-to-r from-transparent via-border to-transparent" />

            {/*
              ── Two-column layout:
                 Mobile  → single column  (calendar first, notes below)
                 Desktop → notes (1fr) + calendar (2.2fr)
            */}
            <div className="
              grid grid-cols-1 md:grid-cols-[1fr_2.2fr]
              gap-0 md:gap-0
              px-0
            ">
              {/* ── Notes panel (shows BELOW calendar on mobile) */}
              <div className="
                order-2 md:order-1
                px-4 sm:px-5 py-4
                md:border-r border-border/40
                md:min-h-[320px]
              ">
                <NotesPanel
                  contextLabel={notesLabel}
                  value={value}
                  onChange={setValue}
                  onSave={save}
                  isSaved={isSaved}
                  justSaved={justSaved}
                />
              </div>

              {/* ── Calendar grid (shows ABOVE notes on mobile) */}
              <div className="order-1 md:order-2 px-3 sm:px-5 pb-4 pt-3">
                <CalendarGrid
                  viewDate={viewDate}
                  range={range}
                  previewRange={previewRange}
                  onDayClick={handleDayClick}
                  onDayMouseEnter={handleDayMouseEnter}
                  onDayMouseLeave={handleDayMouseLeave}
                />

                {/* Selection banner — inside grid column on all sizes */}
                <AnimatePresence>
                  {phase !== 'idle' && (
                    <SelectionBanner
                      key="banner"
                      phase={phase}
                      pendingStart={pendingStart}
                      range={range}
                      onClear={clearRange}
                      accentColor={accent}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div className="border-t border-border/40 px-4 sm:px-6 py-2.5 flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/50 tracking-wide">
              {isPickingEnd ? 'Hover to preview — click to confirm' : 'Click a day to start'}
            </p>
            <p className="text-[10px] text-muted-foreground/30 tracking-wide tabular-nums">
              Wk {storyState.activeWeek} · {Math.round(storyState.progress * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Selection Banner ─────────────────────────────────────────────────────────

interface SelectionBannerProps {
  phase: SelectionPhase;
  pendingStart: Date | null;
  range: DateRange | null;
  onClear: () => void;
  accentColor: string;
}

function SelectionBanner({
  phase,
  pendingStart,
  range,
  onClear,
  accentColor,
}: SelectionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div className="pt-3 mt-2 border-t border-border/40">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            {phase === 'picking-end' && pendingStart && (
              <>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: accentColor }}
                >
                  Start date
                </p>
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {formatFullDate(pendingStart)}
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  Tap another day to set end date
                </p>
              </>
            )}

            {phase === 'complete' && range && (
              <>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: accentColor }}
                >
                  {range.start.toDateString() === range.end.toDateString() ? 'Selected' : 'Range'}
                </p>
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {formatFullDate(range.start)}
                </p>
                {range.start.toDateString() !== range.end.toDateString() && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="font-medium" style={{ color: accentColor }}>→</span>
                    {formatFullDate(range.end)}
                  </p>
                )}
              </>
            )}
          </div>

          <motion.button
            type="button"
            onClick={onClear}
            aria-label="Clear selection"
            className="
              flex items-center justify-center
              w-8 h-8 rounded-lg shrink-0
              text-muted-foreground/50
              hover:text-foreground hover:bg-muted/50
              active:scale-90 transition-colors duration-150
            "
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
