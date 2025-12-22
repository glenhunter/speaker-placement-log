# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start dev server**: `npm run dev` (runs on http://localhost:5173/speaker-placement-log/)
- **Build for production**: `npm run build` (output to `dist/`)
- **Preview production build**: `npm run preview`

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 4 with CSS variables for theming
- **UI Components**: shadcn/ui (custom implementation, not installed via CLI)
- **Routing**: React Router DOM (basename: `/speaker-placement-log`)
- **State**: React Query (@tanstack/react-query) for measurements, useState for UI
- **Storage**: localStorage via custom storage utilities

## Architecture Overview

### Routing Structure
- Two routes: `/` (main app) and `/speaker-baselines` (baseline calculator)
- Configured in `main.jsx` with BrowserRouter basename `/speaker-placement-log`
- React Query wraps entire app for state management

### Data Flow
1. **Measurements**: TanStack Query manages localStorage-backed measurements
   - Hook: `useMeasurements` → Storage: `storage` object in `lib/storage.js`
   - Query key: `['measurements']`
   - Mutations: save, update, delete, clear (all trigger query invalidation)

2. **Baseline**: Simple useState + localStorage (no React Query)
   - Hook: `useBaseline` → Storage: `baselineStorage` in `lib/storage.js`
   - Single baseline stored (methodName, values array with label/value/formula)

### Key Architectural Decisions
- **TanStack Query**: Used for measurements only (not baseline) to practice async state management
- **Custom shadcn**: Components copied manually, not installed via CLI
- **Path alias**: `@/` maps to `./src` (configured in vite.config.js)
- **No TypeScript**: Plain JavaScript with .jsx extensions
- **GitHub Pages deployment**: Base path `/speaker-placement-log/` configured in vite.config.js

## Component Conventions

### shadcn/ui Components

- Follow existing pattern: use `React.forwardRef`, `cn` utility, and spread props
- Default `type="button"` for Button component to prevent form submission
- Components use CSS variables for theming (--color-primary, --color-background, etc.)
- See `src/components/ui/button.jsx` as reference

### Creating New shadcn Components

When a shadcn component is missing:

1. Create file in `src/components/ui/`
2. Follow the forwardRef pattern
3. Use `cn` utility for className merging
4. Apply theming via CSS variables
5. Example: `separator.jsx` - simple horizontal/vertical divider

## Styling Approach

1. **CSS Variables**: Used for theme colors (defined in `src/css/index.css`)
2. **Tailwind Classes**: For layout, spacing, and responsive design
3. **Inline Styles**: For dynamic values (conditional colors, CSS variable references)
4. **Custom Classes**: Minimal - only for specific reusable patterns

## Project-Specific Concepts

### Baseline

- Speaker placement calculations based on room dimensions
- Methods: Cardas Golden Ratio, Planar Edge, Rule of 1/3's, Nearfield Listening
- Stored with method name, calculation type, speaker type, and calculated values

### Measurements

- User-recorded adjustments from baseline
- Includes: distances (front wall, side wall, listening position)
- Ratings: bass, treble, vocals, soundstage (-10 to +10 scale)
- Can be marked as favorites

### Distance Formatting

- Use `feetToFraction()` utility to convert decimal feet to fractional format
- Example: 8.5 → "8' 6"", 0.25 → "1/4""

## Design Patterns

### Forms

- No HTML5 validation (buttons use type="button" by default)
- Number inputs include `min="0"` and `step="0.01"`
- Direct state updates via onChange handlers

### Visual Feedback

- Color-coded ratings: green (#0f0) positive, red (#f00) negative, gray (#666) zero
- Separators for hierarchy: dark gray (bg-gray-700) for major sections, light gray (bg-gray-300) between items
- Card-based layout for grouping related content

### Grid Layouts

- 3-column grid for rating controls: [Worse Button] [Title + Counter] [Better Button]
- Use `items-center` and `justify-center`/`justify-end` for alignment

## Common Operations

### Adding a New Calculation Method

1. Add to `handleUseAsBaseline()` in SpeakerBaselines.jsx
2. Include method name in `methodNames` object
3. Create calculation logic with `feetToFraction()` for display values
4. Add tab with TabsContent component
5. Include Acknowledgements section below calculations

### Data Persistence Pattern

**Measurements** (src/hooks/useMeasurements.js):
- Uses TanStack Query with mutations for CRUD operations
- Query key: `['measurements']`
- Storage: `storage.getAll()`, `storage.save()`, `storage.update()`, `storage.delete()`
- Each mutation invalidates queries to trigger refetch
- IDs: timestamp-based (`Date.now()`)

**Baseline** (src/hooks/useBaseline.js):
- Simple useState + useEffect pattern
- Storage: `baselineStorage.get()`, `baselineStorage.save()`, `baselineStorage.clear()`
- Structure: `{ methodName, values: [{ label, value, formula }] }`

## Git Workflow

- Feature branches for new work
- Branch naming: descriptive (e.g., `subjectively-better-or-worse`, `rule-of-thirds`)

## Development Preferences

- Keep solutions simple and focused
- Avoid over-engineering or premature abstraction
- Only add features explicitly requested
- Use existing components and patterns
