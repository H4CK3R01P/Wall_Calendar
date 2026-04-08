'use client';

import { useMemo } from 'react';
import { getISOWeek } from 'date-fns';
import { getStory }              from '@/lib/stories';
import type { StoryConfig }      from '@/lib/stories';
import {
  calculateProgress,
  calculateRangeProgress,
  resolveAnimationTargets,
}                                from '@/lib/story-progress';
import type { AnimationTargets } from '@/lib/story-progress';
import type { DateRange }        from '@/lib/calendar';

// ─── Return Type ──────────────────────────────────────────────────────────────

export interface StoryProgressState {
  /** The StoryConfig for the active week. */
  story: StoryConfig;
  /**
   * Normalised progress through the week [0, 1].
   * 0 = Monday, 1 = Sunday.
   */
  progress: number;
  /** ISO week number (1–52) driving the current story. */
  activeWeek: number;
  /** Raw numeric animation targets for Framer Motion. */
  targets: AnimationTargets;
}

// ─── Week Derivation ──────────────────────────────────────────────────────────

/**
 * Picks the reference date for the active story:
 *
 *  1. Range complete  → start of range
 *  2. Picking end     → pendingStart (selectedDate)
 *  3. Nothing → today
 *
 * We use this date's ISO week to select the story.
 */
function deriveReferenceDate(
  selectedDate: Date | null,
  range: DateRange | null,
): Date {
  if (range)        return range.start;
  if (selectedDate) return selectedDate;
  return new Date();
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Derives the active weekly story + animation targets from calendar state.
 *
 * @param viewDate     Month displayed in the grid (used for progress fallback).
 * @param selectedDate A single selected date (or null).
 * @param range        A confirmed date-range selection (or null).
 *
 * Story switching:  ISO week of the reference date.
 * Progress:         Day-of-week position within that week (Mon=0, Sun=1).
 */
export function useStoryProgress(
  viewDate: Date,
  selectedDate: Date | null,
  range: DateRange | null,
): StoryProgressState {
  return useMemo(() => {
    const refDate  = deriveReferenceDate(selectedDate, range);
    const activeWeek = getISOWeek(refDate);
    const story    = getStory(activeWeek);

    const progress: number = (() => {
      if (range)        return calculateRangeProgress(viewDate, range.start, range.end);
      if (selectedDate) return calculateProgress(viewDate, selectedDate);
      return 0;
    })();

    const targets = resolveAnimationTargets(story.animationType, progress);

    return { story, progress, activeWeek, targets };
  }, [viewDate, selectedDate, range]);
}
