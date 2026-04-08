// ─── Story Mode ───────────────────────────────────────────────────────────────
//
// 'cycle'  → week 1→slot 1, week 2→slot 2, … week 13→slot 13,
//             week 14→slot 1, week 15→slot 2, … (wraps every 13 weeks)
//
// 'random' → each ISO week maps to a slot in a fixed shuffle so the same
//             week always shows the same image, but the order looks non-linear.
//
export const STORY_MODE: 'cycle' | 'random' = 'cycle';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnimationType = 'vertical' | 'horizontal' | 'scale' | 'opacity';

export interface StoryConfig {
  /**
   * Slot index (1–13).
   * This is NOT the ISO week — it is used only to name the image file.
   */
  slot: number;
  /** Theme title shown in the hero banner. */
  theme: string;
  /** One-sentence tagline beneath the theme. */
  tagline: string;
  /**
   * URL of the hero image.
   *
   * ╔══════════════════════════════════════════════════════════════╗
   * ║  📁  PUT YOUR 13 PHOTOS IN:   public/stories/              ║
   * ║  📝  NAME THEM:               week-01.jpg                  ║
   * ║                                week-02.jpg                  ║
   * ║                                …                            ║
   * ║                                week-13.jpg                  ║
   * ║                                                             ║
   * ║  Two-digit numbers required: week-01, not week-1            ║
   * ║  If a photo is missing the gradient shows through.          ║
   * ╚══════════════════════════════════════════════════════════════╝
   */
  imageUrl: string;
  /** CSS gradient shown behind the image (always visible). */
  gradient: string;
  /** Accent colour for the wave banner, progress bar, and dots. */
  accentColor: string;
  /** Animation style as progress through the week advances. */
  animationType: AnimationType;
  /** Emoji for the story mood. */
  icon: string;
}

// ─── 13-Slot Story Registry ───────────────────────────────────────────────────
//
// Edit themes, taglines, colours, and animations freely.
// To swap a photo just replace the file in  public/stories/
// — no code changes needed.
//

export const STORIES: readonly StoryConfig[] = [
  // ── week-01.jpg  Mountains ────────────────────────────────────────────────
  {
    slot: 1,
    theme: 'Mountain Majesty',
    tagline: 'Peaks that remind you how small — and free — you are.',
    imageUrl: '/stories/week-01.jpg',
    gradient: 'linear-gradient(135deg, #232526, #3a4557, #5a6d82)',
    accentColor: '#4a5e74',
    animationType: 'vertical',
    icon: '⛰️',
  },
  // ── week-02.jpg  Mountains ────────────────────────────────────────────────
  {
    slot: 2,
    theme: 'Above the Clouds',
    tagline: 'The higher you climb, the quieter the world becomes.',
    imageUrl: '/stories/week-02.jpg',
    gradient: 'linear-gradient(135deg, #1a1a2e, #2d4a6b, #5a8aad)',
    accentColor: '#2d4a6b',
    animationType: 'scale',
    icon: '🏔️',
  },
  // ── week-03.jpg  Winter / Ice ─────────────────────────────────────────────
  {
    slot: 3,
    theme: 'Deep Freeze',
    tagline: 'Ice holds the world in a breathless, silent grip.',
    imageUrl: '/stories/week-03.jpg',
    gradient: 'linear-gradient(135deg, #0f2027, #203a43, #8ab4c9)',
    accentColor: '#4a90b8',
    animationType: 'opacity',
    icon: '🧊',
  },
  // ── week-04.jpg  Flowers ──────────────────────────────────────────────────
  {
    slot: 4,
    theme: 'First Bloom',
    tagline: 'Flowers don\'t ask permission — they simply appear.',
    imageUrl: '/stories/week-04.jpg',
    gradient: 'linear-gradient(135deg, #f0abcf, #c2185b, #880e4f)',
    accentColor: '#c2185b',
    animationType: 'horizontal',
    icon: '🌸',
  },
  // ── week-05.jpg  Purple sky, moon, girl alone ─────────────────────────────
  {
    slot: 5,
    theme: 'Moonchaser',
    tagline: 'A purple sky, a white moon, and one girl who understands both.',
    imageUrl: '/stories/week-05.jpg',
    gradient: 'linear-gradient(135deg, #1a0533, #4a1a7a, #7c3aed)',
    accentColor: '#7c3aed',
    animationType: 'opacity',
    icon: '🌙',
  },
  // ── week-06.jpg  Rain ─────────────────────────────────────────────────────
  {
    slot: 6,
    theme: 'Petrichor',
    tagline: 'Rain washes the world clean and leaves only the truth.',
    imageUrl: '/stories/week-06.jpg',
    gradient: 'linear-gradient(135deg, #1a2a3a, #2d4a6b, #6090b0)',
    accentColor: '#3a6b8a',
    animationType: 'vertical',
    icon: '🌧️',
  },
  // ── week-07.jpg  Flowers ──────────────────────────────────────────────────
  {
    slot: 7,
    theme: 'Garden in Full',
    tagline: 'Every petal is a small act of courage.',
    imageUrl: '/stories/week-07.jpg',
    gradient: 'linear-gradient(135deg, #56ab2f, #a8e063)',
    accentColor: '#2e7d32',
    animationType: 'scale',
    icon: '🌺',
  },
  // ── week-08.jpg  Winter / Ice ─────────────────────────────────────────────
  {
    slot: 8,
    theme: 'Frozen Stillness',
    tagline: 'Winter does not ask. It simply arrives and rearranges everything.',
    imageUrl: '/stories/week-08.jpg',
    gradient: 'linear-gradient(135deg, #cfd9df, #9ca3af, #3b5280)',
    accentColor: '#5b7fa6',
    animationType: 'horizontal',
    icon: '❄️',
  },
  // ── week-09.jpg  Person sitting alone at table ────────────────────────────
  {
    slot: 9,
    theme: 'A Table for One',
    tagline: 'Some things are better understood in solitude.',
    imageUrl: '/stories/week-09.jpg',
    gradient: 'linear-gradient(135deg, #2c2c2c, #4a4a4a, #6b6b6b)',
    accentColor: '#5a5a72',
    animationType: 'opacity',
    icon: '☕',
  },
  // ── week-10.jpg  Summer / Beach ───────────────────────────────────────────
  {
    slot: 10,
    theme: 'Salt & Sun',
    tagline: 'The ocean asks nothing of you except to be present.',
    imageUrl: '/stories/week-10.jpg',
    gradient: 'linear-gradient(135deg, #00b4d8, #0077b6)',
    accentColor: '#0077b6',
    animationType: 'horizontal',
    icon: '🏖️',
  },
  // ── week-11.jpg  Sunset in forest with lake ───────────────────────────────
  {
    slot: 11,
    theme: 'Forest at Dusk',
    tagline: 'Sunset finds the lake and together they hold the sky.',
    imageUrl: '/stories/week-11.jpg',
    gradient: 'linear-gradient(135deg, #c0392b, #e67e22, #f39c12)',
    accentColor: '#c0392b',
    animationType: 'vertical',
    icon: '🌅',
  },
  // ── week-12.jpg  Summer / Beach ───────────────────────────────────────────
  {
    slot: 12,
    theme: 'High Tide',
    tagline: 'Waves that remind you the world is still moving, still alive.',
    imageUrl: '/stories/week-12.jpg',
    gradient: 'linear-gradient(135deg, #0096c7, #48cae4)',
    accentColor: '#0096c7',
    animationType: 'scale',
    icon: '🌊',
  },
  // ── week-13.jpg  Rain ─────────────────────────────────────────────────────
  {
    slot: 13,
    theme: 'After the Rain',
    tagline: 'Everything washed clean. The world starts over.',
    imageUrl: '/stories/week-13.jpg',
    gradient: 'linear-gradient(135deg, #243b55, #3a6b8a, #6b9fc4)',
    accentColor: '#3a6b8a',
    animationType: 'opacity',
    icon: '🌦️',
  },
];

// ─── Shuffle Map (for 'random' mode) ─────────────────────────────────────────
//
// A fixed mapping of every ISO week (index 0 = week 1) to a slot (1–13).
// Generated once so the same week always shows the same image.
// Distribution is balanced: each slot appears exactly 4 times across 52 weeks.
//
const SHUFFLE_MAP: readonly number[] = [
   3,  9,  1,  7, 12,  5, 10,  2, 13,  6,
   4, 11,  8,  6,  3, 10,  1,  9,  7,  4,
  13,  2,  5, 11,  8, 12,  1,  6,  3, 10,
   9,  5, 13,  2,  7, 11,  4,  8, 12,  6,
   3,  9,  1, 10,  7,  5, 13,  2,  4, 11,
   8, 12,
];

// ─── Lookup Helper ────────────────────────────────────────────────────────────

/**
 * Returns the StoryConfig for a given ISO week number (1–52).
 *
 * Mode 'cycle'  → slot = ((week - 1) % 13) + 1
 * Mode 'random' → slot = SHUFFLE_MAP[week - 1]  (deterministic, balanced)
 */
export function getStory(isoWeek: number): StoryConfig {
  const week = Math.max(1, Math.min(52, isoWeek));

  const slot =
    STORY_MODE === 'random'
      ? SHUFFLE_MAP[week - 1]
      : ((week - 1) % 13) + 1;

  return STORIES.find((s) => s.slot === slot) ?? STORIES[0];
}
