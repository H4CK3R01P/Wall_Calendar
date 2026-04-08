# 📅 Story Progress Calendar

> A premium, physics-driven wall calendar built entirely on the frontend.  
> Thirteen weekly stories. Live progress animations. Date ranges. Persistent notes.  
> No backend. No database. Pure React engineering.

---

## ✨ Overview

**Story Progress Calendar** is a fully frontend-first React application that reimagines the digital calendar as a work of craft. Inspired by the tactility of a physical wall calendar, it blends rich UI aesthetics with a novel **Story Progress System** — a 13-slot weekly narrative engine that pairs every week with a hand-curated visual theme, a cinematic hero image, and a live progress animation arc that responds in real time to the current day.

Every design and engineering decision in this project prioritises one thing: **making the user feel something when they open a calendar**. Beautiful typography, spring-physics animations, lined-paper notes, and a dual-column responsive layout come together to create an experience that genuinely feels like a premium product.

---

## 🏆 Key Features

### 🎬 Story Progress System *(The Signature Feature)*
- **13 weekly story slots** cycle across the 52-week year (via `cycle` or `random` mode)
- Each slot has a unique **hero image**, **theme name**, **tagline**, **accent colour**, **gradient**, and **animation type**
- Image content perfectly matched to theme:
  | Slot | Image Theme | Story Name |
  |------|-------------|------------|
  | 1 | Mountains | Mountain Majesty |
  | 2 | Mountains | Above the Clouds |
  | 3 | Winter / Ice | Deep Freeze |
  | 4 | Flowers | First Bloom |
  | 5 | Purple sky & moon | Moonchaser |
  | 6 | Rain | Petrichor |
  | 7 | Flowers | Garden in Full |
  | 8 | Winter / Ice | Frozen Stillness |
  | 9 | Solitude | A Table for One |
  | 10 | Summer beach | Salt & Sun |
  | 11 | Forest sunset & lake | Forest at Dusk |
  | 12 | Summer beach | High Tide |
  | 13 | Rain | After the Rain |
- **Four animation types** driven by Framer Motion spring physics:
  - `vertical` — parallax scroll (mountains, rain)
  - `horizontal` — timeline slide (flowers, beach)
  - `scale` — cinematic zoom-out (clouds, ice)
  - `opacity` — atmospheric fade (moon, solitude)
- Progress bar dots animate in real time based on the **day-of-week** (Mon = 0% → Sun = 100%)
- **Smooth crossfades** between stories via `AnimatePresence` mode `"wait"`

### 📅 Wall Calendar UI
- Realistic **physical design cues**: wire hanger, punch-hole eyelets, floating layered shadows, paper texture
- **Full-bleed hero image** with a light vignette and a delicate colour wash at the base
- Month + Year displayed directly on the image, animated on navigation
- Story badge with icon, theme name, and active week indicator

### 🎯 Date Range Selection
- **Click 1** → selects start date (solid blue highlight)
- **Hover** → live preview sweeps the range across the grid in real time
- **Click 2** → locks the range (deep navy for interior days)
- Auto-swaps endpoints if end date is selected before start
- Clicking a new date after a completed range immediately starts a fresh selection
- Selection banner shows the active date or range with a clear/reset button

### 📝 Persistent Notes
- Per-date and per-range notes saved in **`localStorage`**
- Notes survive page refresh and are restored instantly on re-selecting the same date/range
- `Cmd/Ctrl + S` keyboard shortcut to save
- Styled as **lined paper** with a ruled background and character count
- Unsaved-change awareness via `isSaved` state

### 📱 Fully Responsive
- **Desktop**: hero image full-width on top; notes panel (left) + calendar grid (right)
- **Mobile**: stacked layout — hero → calendar → notes
- `touch-action: manipulation` eliminates the 300 ms tap delay on iOS and Android
- 40×40 px minimum touch targets on all interactive elements
- Hover animations disabled on touch-only sessions (`@media (hover: none)`)

### ⚡ Performance-Optimised
- `React.memo` on every major component: `StoryHero`, `CalendarGrid`, `NotesPanel`
- `DayCell` has a **custom role comparator** — only cells whose visual state changes re-render during hover, shielding the 40+ other cells from DOM updates
- `useMemo` stabilises calendar cell array references across renders
- Framer Motion physics run on hardware-accelerated `transform` + `opacity` exclusively

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16** (App Router, `'use client'`) |
| UI Library | **React 19** |
| Animations | **Framer Motion 11** (springs, `AnimatePresence`) |
| Date Math | **date-fns 4** (ISO weeks, day-of-week, month grids) |
| Styling | **Tailwind CSS 4** + Vanilla CSS (physical effects) |
| Icons | **Lucide React** |
| Fonts | **Geist** (Variable sans) + **Geist Mono** |
| Persistence | **`localStorage`** (no backend, no database) |
| Type Safety | **TypeScript 5.7** (strict mode) |

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Root page — renders WallCalendar
│   └── globals.css           # Design tokens, physical effects, responsive rules
│
├── components/calendar/
│   ├── wall-calendar.tsx     # Root smart component — state machine + layout
│   ├── story-hero.tsx        # Hero image + animations + progress dots (memoised)
│   ├── calendar-grid.tsx     # Week-day headers + day cell grid (memoised)
│   ├── day-cell.tsx          # Individual date cell — role resolver + memo comparator
│   └── notes-panel.tsx       # Lined-paper textarea + save/flash (memoised)
│
├── hooks/
│   ├── use-story-progress.ts # Derives active story + progress from selected date
│   └── use-notes.ts          # localStorage read/write with saved-state tracking
│
└── lib/
    ├── stories.ts            # 13-slot story registry + getStory() lookup
    ├── story-progress.ts     # Animation target resolver (vertical/horizontal/scale/opacity)
    └── calendar.ts           # buildCalendarCells, range helpers, notes key formatters
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 1. Install dependencies
```bash
npm install
```

### 2. Add your story images
Place your 13 weekly images in the `public/stories/` directory:
```
public/
└── stories/
    ├── week-01.jpg   # Mountains
    ├── week-02.jpg   # Mountains
    ├── week-03.jpg   # Winter / Ice
    ├── week-04.jpg   # Flowers
    ├── week-05.jpg   # Purple sky & moon
    ├── week-06.jpg   # Rain
    ├── week-07.jpg   # Flowers
    ├── week-08.jpg   # Winter / Ice
    ├── week-09.jpg   # Person alone / Solitude
    ├── week-10.jpg   # Summer beach
    ├── week-11.jpg   # Forest sunset & lake
    ├── week-12.jpg   # Summer beach
    └── week-13.jpg   # Rain
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

### Optional: Switch story iteration mode
In `lib/stories.ts`, toggle the mode at the top of the file:
```typescript
// 'cycle'  → weeks 1→13, 1→13, repeating
// 'random' → deterministic shuffle using a fixed SHUFFLE_MAP (each slot appears exactly 4× per year)
export const STORY_MODE: 'cycle' | 'random' = 'cycle';
```

---

## 🎬 Demo Walkthrough

### 1. Wall Calendar Aesthetic
Open the app on a desktop. The card floats above the background on layered shadows with a subtle paper texture. The hero image is full-bleed with the month name and year overlaid in bold type. The story theme and one-line tagline sit beside a small story badge. Below the image, 10 animated dots reflect live week progress.

### 2. Story Progress System
Click the left/right navigation arrows to move between months. Watch the hero image crossfade — mountains give way to flowers, which give way to a purple sky and moon. Each image parallaxes, scales, or fades according to its assigned animation type. The story badge, accent colours, gradients, and theme names all update to match.

### 3. Date Range Selection
Click any date in the grid — it turns solid blue. Now move your cursor laterally across the grid. A live navy-blue preview sweeps with your mouse in real time. Click a second date — the range is locked. Start and end show in blue; interior days show in deep navy. The selection banner below the grid shows your exact date range. Click anywhere new to immediately begin a fresh selection.

### 4. Notes System
With a date or range selected, the **Notes** panel on the left activates. Type anything and press **Save** (or `Cmd+S`). Refresh the page. Reselect the same date. Your note is still there — loaded instantly from `localStorage`.

### 5. Responsiveness
Drag the browser window to a narrow viewport or open DevTools mobile emulation (e.g., 390×844 for iPhone). The layout collapses cleanly: hero on top, calendar full-width, notes below. Touch the grid directly — selection works identically. No jank. No overflow. No broken layout.

---

## 🎨 Customising Stories

Each story slot in `lib/stories.ts` accepts:

```typescript
{
  slot: number;         // 1–13
  theme: string;        // Display name (e.g. "Moonchaser")
  tagline: string;      // One-line mood text
  imageUrl: string;     // Path under /public/ (e.g. '/stories/week-05.jpg')
  gradient: string;     // CSS linear-gradient (shown before image loads)
  accentColor: string;  // Hex — used for badge, progress dots, bottom fade
  animationType: 'vertical' | 'horizontal' | 'scale' | 'opacity';
  icon: string;         // Emoji
}
```

Add or replace any slot to extend the system to any number of themes.

---

## 📄 License

MIT — free to use, fork, and build upon.

---

*Built with precision. Designed with intention. Engineered for the frontend.*
# Wall_Calendar
