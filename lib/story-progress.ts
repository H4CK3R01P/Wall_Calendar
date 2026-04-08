import { getDay } from 'date-fns';
import type { AnimationType } from './stories';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Raw numeric animation targets.
 * These are consumed by Framer Motion's `animate` prop — no CSS strings,
 * no manual transitions.  The spring physics live in the component.
 */
export interface AnimationTargets {
  /** Horizontal translate target (% of container width). */
  x: number;
  /** Vertical translate target (% of container height). */
  y: number;
  /** Scale multiplier (1 = identity). */
  scale: number;
  /** Image opacity [0, 1]. */
  imageOpacity: number;
  /** Vignette overlay opacity [0, 1]. */
  overlayOpacity: number;
}

// ─── Progress Calculation ─────────────────────────────────────────────────────

/**
 * Converts a JS day-of-week (0=Sun … 6=Sat) to a Monday-anchored index (0=Mon … 6=Sun).
 */
function toMondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7; // Sun(0)→6, Mon(1)→0, …, Sat(6)→5
}

/**
 * Calculates normalised progress [0, 1] for where the date sits within its week.
 *
 * - Monday   → 0   (start of week)
 * - Sunday   → 1   (end of week)
 */
export function calculateProgress(
  _viewDate: Date,
  referenceDate: Date | null,
): number {
  if (!referenceDate) return 0;
  return toMondayIndex(getDay(referenceDate)) / 6;
}

/**
 * Given a start + end date, returns the progress at the midpoint of the range
 * measured within the week of the start date.
 */
export function calculateRangeProgress(
  _viewDate: Date,
  start: Date,
  end: Date,
): number {
  const startIdx = toMondayIndex(getDay(start));
  const endIdx   = toMondayIndex(getDay(end));
  const midIdx   = (startIdx + endIdx) / 2;
  return Math.min(1, midIdx / 6);
}

// ─── Animation Resolvers ──────────────────────────────────────────────────────

/**
 * Maps (AnimationType × progress) → plain numeric targets.
 *
 * No easing is applied here — Framer Motion handles that via spring physics.
 * Returns only the *target values* that a `motion.*` element should animate to.
 */
export function resolveAnimationTargets(
  type: AnimationType,
  progress: number, // [0, 1]
): AnimationTargets {
  // Defaults — identity transform, full opacity, moderate overlay
  const base: AnimationTargets = {
    x: 0,
    y: 0,
    scale: 1,
    imageOpacity: 1,
    overlayOpacity: 0.25,
  };

  switch (type) {
    // ── Vertical: parallax scroll from +20 % → 0 % ──────────────────────
    case 'vertical':
      return {
        ...base,
        y:              (1 - progress) * 20,   // 20 → 0
        overlayOpacity: 0.15 + progress * 0.4, // 0.15 → 0.55
      };

    // ── Horizontal: timeline slide from +15 % → 0 % ─────────────────────
    case 'horizontal':
      return {
        ...base,
        x:              (1 - progress) * 15,   // 15 → 0
        overlayOpacity: 0.10 + progress * 0.35,
      };

    // ── Scale: zoom-out reveal from 1.25 → 1.0 ─────────────────────────
    case 'scale':
      return {
        ...base,
        scale:          1.25 - progress * 0.25, // 1.25 → 1.0
        overlayOpacity: 0.05 + progress * 0.45,
      };

    // ── Opacity: cinematic fade from 0.2 → 1.0 ─────────────────────────
    case 'opacity':
      return {
        ...base,
        imageOpacity:   0.2 + progress * 0.8,  // 0.2 → 1.0
        overlayOpacity: 0.20 + progress * 0.30,
      };
  }
}
