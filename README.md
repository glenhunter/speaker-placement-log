# Speaker Placement Log

A web application for tracking and comparing speaker placement measurements to help optimize your audio setup. Record distance measurements and rate various audio qualities to find the perfect speaker positioning.

**[View Live Application](https://glenhunter.github.io/speaker-placement-log/)**

## Features

- **User Authentication**: Secure email/password authentication with password reset
- **Cloud Storage**: Data syncs across devices via Supabase PostgreSQL
- **Track Measurements**: Record speaker distance from front and side walls
- **Rate Audio Quality**: Use Worse/Better buttons (-10 to +10) to rate:
  - Bass response
  - Treble clarity
  - Vocal presence
  - Soundstage width
- **Compare Results**: View all measurements in a convenient sidebar
- **Export Data**: Export your measurements to Markdown format
- **Data Migration**: Automatically migrates existing localStorage data on first login
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- npm (comes with Node.js)
- Supabase account and project (free tier available)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/glenhunter/speaker-placement-log.git
   cd speaker-placement-log
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:

   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Configure Supabase:

   - Run the database schema (see `/docs/supabase-implementation-plan.md`)
   - Configure authentication redirect URLs in Supabase dashboard
   - Enable email provider authentication

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to:

   ```
   http://localhost:5173/speaker-placement-log/
   ```

7. Remote URL is: [https://glenhunter.github.io/speaker-placement-log/](https://glenhunter.github.io/speaker-placement-log/)

## Usage

1. **Sign Up/Sign In**: Create an account via the menu (hamburger icon)
2. **Enter Distance Measurements**: Input the distance of your speakers from the front and side walls
3. **Rate Audio Qualities**: Use Worse/Better buttons to rate bass, treble, vocals, and soundstage (-10 to +10)
4. **Submit**: Click the Submit button to save your measurement to the cloud
5. **View History**: Click the sidebar tab (right edge of screen) to view all measurements
6. **Export**: Use "Export to Markdown" in the menu to download your data
7. **Sign Out**: Click Sign Out in the menu when done

## Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Tech Stack

- **Framework**: [React](https://react.dev/) 18
- **Build Tool**: [Vite](https://vitejs.dev/) 5
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth) (email/password)
- **Database**: [Supabase](https://supabase.com/) PostgreSQL with Row Level Security
- **Deployment**: GitHub Pages with GitHub Actions

## Project Structure

```
speaker-placement-log/
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── Header.jsx           # Header with user info and logout
│   │   ├── Sidebar.jsx          # Measurement history sidebar
│   │   ├── LoginPage.jsx        # Authentication page
│   │   ├── PasswordResetPage.jsx # Password reset flow
│   │   └── ProtectedRoute.jsx   # Route protection wrapper
│   ├── contexts/
│   │   └── AuthContext.jsx      # Authentication state and methods
│   ├── hooks/
│   │   ├── useMeasurements.js   # Measurement data with React Query
│   │   └── useBaseline.js       # Baseline data with React Query
│   ├── lib/
│   │   ├── supabase.js          # Supabase client initialization
│   │   ├── storage.js           # Supabase storage utilities
│   │   └── utils.js             # Helper functions
│   ├── pages/
│   │   └── SpeakerBaselines.jsx # Baseline calculator page
│   ├── css/
│   │   └── index.css            # Global styles
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # Application entry point
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages deployment
└── package.json
```

## License

This project is private and not licensed for public use.
