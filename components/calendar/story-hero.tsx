'use client';

import { memo, useEffect } from 'react';
import { format } from 'date-fns';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import type { StoryProgressState } from '@/hooks/use-story-progress';

// ─── Spring Configs ───────────────────────────────────────────────────────────

/** Snappy but smooth — good for transforms and opacity. */
const SPRING = { stiffness: 80,  damping: 20, mass: 0.8 } as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface StoryHeroProps {
  viewDate: Date;
  storyState: StoryProgressState;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function darken(color: string, amount: number): string {
  return `color-mix(in srgb, ${color} ${100 - amount}%, black)`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StoryHero = memo(function StoryHero({ viewDate, storyState }: StoryHeroProps) {
  const { story, progress, activeWeek, targets } = storyState;

  const monthName = format(viewDate, 'MMMM');
  const year      = format(viewDate, 'yyyy');

  // ── Motion pipeline ───────────────────────────────────
  const xRaw     = useMotionValue(targets.x);
  const yRaw     = useMotionValue(targets.y);
  const scaleRaw = useMotionValue(targets.scale);
  const imgOpRaw = useMotionValue(targets.imageOpacity);

  const xSpring     = useSpring(xRaw,     SPRING);
  const ySpring     = useSpring(yRaw,     SPRING);
  const scaleSpring = useSpring(scaleRaw, SPRING);
  const imgOpSpring = useSpring(imgOpRaw, SPRING);

  useEffect(() => { xRaw.set(targets.x);                }, [targets.x]);
  useEffect(() => { yRaw.set(targets.y);                }, [targets.y]);
  useEffect(() => { scaleRaw.set(targets.scale);        }, [targets.scale]);
  useEffect(() => { imgOpRaw.set(targets.imageOpacity); }, [targets.imageOpacity]);

  const xPercent = useTransform(xSpring, (v) => `${v}%`);
  const yPercent = useTransform(ySpring, (v) => `${v}%`);

  const waveLight = story.accentColor;
  const waveDark  = darken(story.accentColor, 25);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={story.slot}
        className="relative w-full overflow-hidden rounded-t-2xl"
        role="img"
        aria-label={`${story.icon} ${story.theme} — ${monthName} ${year}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── Image Container ─────────────────────────── */}
        <div
          className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden"
          style={{ background: story.gradient }}
        >
          {/* Animated hero image */}
          <motion.img
            src={story.imageUrl}
            alt={`${story.theme} — ${monthName}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              x:          xPercent,
              y:          yPercent,
              scale:      scaleSpring,
              opacity:    imgOpSpring,
              willChange: 'transform, opacity',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />

          {/* Vignette — subtle fixed dark edge, never hides the photo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.18) 100%)' }}
          />

          {/* Bottom fade into wave — very light colour wash */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent 55%, ${story.accentColor}4d 100%)`,
            }}
          />

          {/* Film-grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* ── Story badge ─────────────────────────────── */}
          <motion.div
            className="absolute top-3 left-3 flex items-center gap-2 backdrop-blur-md bg-black/30 rounded-xl px-3 py-1.5 border border-white/10"
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.45, ease: 'easeOut' }}
          >
            <span className="text-xl select-none" aria-hidden="true">
              {story.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.15em]">
                Week {activeWeek}
              </span>
              <motion.span
                className="text-xs font-bold text-white tabular-nums tracking-wide"
                key={pct(progress)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {pct(progress)}
              </motion.span>
            </div>
          </motion.div>

          {/* ── Progress bar ─────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className="absolute inset-0 bg-white/10" />
            {/* Color div: plain, never animated — avoids lab() Framer Motion warning */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: story.accentColor }}
            />
            {/* Width mask: animated by Framer Motion — transparent, clips the color div */}
            <motion.div
              className="absolute inset-y-0 right-0 bg-white/10"
              animate={{ width: `${(1 - progress) * 100}%` }}
              transition={{ type: 'spring', ...SPRING }}
            />
            {/* Glow overlay — plain, no color animation */}
            <div
              className="absolute inset-y-0 left-0 rounded-r-full pointer-events-none"
              style={{ boxShadow: `0 0 16px ${story.accentColor}60, 0 0 4px ${story.accentColor}` }}
            />
          </div>
        </div>

        {/* ── Wave Banner ─────────────────────────────── */}
        <div
          className="relative h-20 md:h-24"
          style={{ backgroundColor: story.accentColor }}
        >
          <svg
            className="absolute bottom-full left-0 w-full"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            style={{ height: '60px' }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id={`swg-${story.slot}`}
                x1="0%" y1="0%" x2="100%" y2="0%"
              >
                <stop offset="0%"   stopColor={waveLight} />
                <stop offset="100%" stopColor={waveDark}  />
              </linearGradient>
            </defs>
            <path
              d="M0,30 C200,0 400,50 600,25 C800,0 1000,40 1200,20 L1200,0 L0,0 Z"
              fill={`url(#swg-${story.slot})`}
              opacity="0.7"
            />
            <path
              d="M0,40 C200,15 400,55 600,35 C800,10 1000,45 1200,30 L1200,0 L0,0 Z"
              fill={story.accentColor}
            />
          </svg>

          {/* Banner content */}
          <div className="absolute inset-0 flex items-center justify-between px-5 md:px-7">
            {/* Theme + tagline */}
            <motion.div
              className="flex-1 min-w-0 pr-4"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] truncate">
                {story.theme}
              </p>
              <p className="text-xs text-white/75 font-light leading-relaxed line-clamp-2 mt-0.5">
                {story.tagline}
              </p>
            </motion.div>

            {/* Month + year */}
            <motion.div
              className="text-right shrink-0"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="text-[10px] font-medium text-white/50 uppercase tracking-[0.25em]">
                {year}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
                {monthName}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Progress Dots ───────────────────────────── */}
        <ProgressDots progress={progress} accentColor={story.accentColor} activeWeek={activeWeek} />
      </motion.div>
    </AnimatePresence>
  );
});

// ─── Progress Dots ────────────────────────────────────────────────────────────

interface ProgressDotsProps {
  progress: number;
  accentColor: string;
  activeWeek: number;
}

function ProgressDots({ progress, accentColor, activeWeek }: ProgressDotsProps) {
  const filledCount = Math.round(progress * 10);

  return (
    <div
      className="flex items-center justify-center gap-1.5 py-2 bg-card border-t border-border/40"
      aria-label={`Week ${activeWeek} progress: ${Math.round(progress * 100)}%`}
    >
      {Array.from({ length: 10 }).map((_, i) => {
        const filled = i < filledCount;
        return (
          <motion.span
            key={i}
            className="inline-block rounded-full"
            animate={{
              backgroundColor: filled ? accentColor : 'var(--muted)',
              scale:           filled ? 1 : 0.85,
              width:           filled ? 8 : 6,
              height:          filled ? 8 : 6,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 22,
              delay: i * 0.025,
            }}
          />
        );
      })}
    </div>
  );
}
