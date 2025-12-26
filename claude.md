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
- **State**: React Query (@tanstack/react-query) for async data management
- **Authentication**: Supabase Auth (email/password)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Storage**: Cloud storage via Supabase (previously localStorage)

## Architecture Overview

### Routing Structure
- Four routes: `/login`, `/reset-password`, `/` (main app), `/speaker-baselines` (baseline calculator)
- All routes are accessible without authentication (anonymous usage supported)
- Anonymous users have data stored in localStorage (lost on browser close)
- Authenticated users have data synced to Supabase cloud storage
- Configured in `main.jsx` with BrowserRouter basename `/speaker-placement-log`
- AuthProvider wraps entire app for authentication state
- React Query wraps entire app for data management

### Data Flow

1. **Authentication**: Managed by AuthContext
   - Hook: `useAuth` → Context: `AuthContext` in `contexts/AuthContext.jsx`
   - Methods: `signUp`, `signIn`, `signOut`, `resetPassword`, `updatePassword`
   - Session persistence via Supabase (localStorage + session tokens)
   - Auto-migrates localStorage data on first login

2. **Measurements**: TanStack Query manages Supabase-backed measurements
   - Hook: `useMeasurements` → Storage: `storage` object in `lib/storage.js` → Supabase PostgreSQL
   - Query key: `['measurements']`
   - Mutations: save, update, delete, clear (all trigger query invalidation)
   - Requires `user.id` for save operations (passed from `useAuth`)
   - Row Level Security ensures users only access their own data

3. **Baseline**: TanStack Query manages Supabase-backed baseline
   - Hook: `useBaseline` → Storage: `baselineStorage` in `lib/storage.js` → Supabase PostgreSQL
   - Query key: `['baseline']`
   - Single baseline per user (most recent)
   - Mutations: save, clear (all trigger query invalidation)

### Key Architectural Decisions
- **TanStack Query**: Used for both measurements and baselines for async state management
- **Supabase Auth**: Email/password authentication with automatic session management
- **Row Level Security**: Database-level security enforces user data isolation
- **localStorage Migration**: Existing data automatically migrated to cloud on first login
- **Custom shadcn**: Components copied manually, not installed via CLI
- **Path alias**: `@/` maps to `./src` (configured in vite.config.js)
- **No TypeScript**: Plain JavaScript with .jsx extensions
- **GitHub Pages deployment**: Base path `/speaker-placement-log/` configured in vite.config.js
- **Environment Variables**: Supabase credentials stored in `.env.local` (gitignored)

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
- Storage: Async functions in `storage` object → Supabase PostgreSQL
  - `storage.getAll()` - Returns all user's measurements
  - `storage.save(measurement, userId)` - Creates new measurement with user_id
  - `storage.update(id, updates)` - Updates existing measurement
  - `storage.delete(id)` - Deletes measurement
  - `storage.clear()` - Deletes all user's measurements
- Each mutation invalidates queries to trigger refetch
- IDs: UUID generated by Supabase
- Requires `user.id` from `useAuth` for save operations

**Baseline** (src/hooks/useBaseline.js):
- Uses TanStack Query with mutations (changed from useState)
- Query key: `['baseline']`
- Storage: Async functions in `baselineStorage` object → Supabase PostgreSQL
  - `baselineStorage.get()` - Returns user's most recent baseline
  - `baselineStorage.save(baseline, userId)` - Creates new baseline with user_id
  - `baselineStorage.clear()` - Deletes all user's baselines
- Structure: `{ calculationType, methodName, speakerType, values: [{ label, value, formula }] }`
- Each mutation invalidates queries to trigger refetch

### Authentication Pattern

**AuthContext** (src/contexts/AuthContext.jsx):
- Provides authentication state and methods to entire app
- Available via `useAuth()` hook
- State: `user`, `loading`
- Methods:
  - `signUp(email, password)` - Create new user account
  - `signIn(email, password)` - Sign in existing user
  - `signOut()` - Sign out current user
  - `resetPassword(email)` - Send password reset email
  - `updatePassword(newPassword)` - Update user password
- Session restoration: Automatically restores session on app load
- localStorage migration: Runs `migrateLocalStorageData()` on first successful login

**Protected Routes** (src/components/ProtectedRoute.jsx):
- Component available for wrapping routes that require authentication
- Shows loading state while checking session
- Redirects to `/login` if user not authenticated
- Currently NOT used - app allows anonymous usage with localStorage fallback

### Environment Variables

Required in `.env.local` (gitignored):
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Required as GitHub Secrets for deployment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are exposed to the build process in `.github/workflows/deploy.yml`

## Git Workflow

- Feature branches for new work
- Branch naming: descriptive (e.g., `subjectively-better-or-worse`, `rule-of-thirds`)

## Development Preferences

- Keep solutions simple and focused
- Avoid over-engineering or premature abstraction
- Only add features explicitly requested
- Use existing components and patterns
