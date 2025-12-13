# Speaker Placement Log

A web application for tracking and comparing speaker placement measurements to help optimize your audio setup. Record distance measurements and rate various audio qualities to find the perfect speaker positioning.

**[View Live Application](https://glenhunter.github.io/speaker-placement-log/)**

## Features

- **Track Measurements**: Record speaker distance from front and side walls
- **Rate Audio Quality**: Use intuitive sliders (0-10) to rate:
  - Bass response
  - Treble clarity
  - Vocal presence
  - Soundstage width
- **Compare Results**: View all measurements in a convenient sidebar
- **Export Data**: Export your measurements to Markdown format
- **Persistent Storage**: All data is saved locally in your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- npm (comes with Node.js)

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

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/speaker-placement-log/
   ```

## Usage

1. **Enter Distance Measurements**: Input the distance of your speakers from the front and side walls
2. **Rate Audio Qualities**: Use the sliders to rate bass, treble, vocals, and soundstage (0-10)
3. **Submit**: Click the Submit button to save your measurement
4. **View History**: Click the sidebar tab (right edge of screen) to view all measurements
5. **Export**: Use the "Export to Markdown" button in the sidebar to download your data

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
- **State Management**: React hooks with local storage persistence
- **Deployment**: GitHub Pages with GitHub Actions

## Project Structure

```
speaker-placement-log/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   └── Sidebar.jsx  # Measurement history sidebar
│   ├── hooks/
│   │   └── useMeasurements.js  # Measurement data management
│   ├── lib/
│   │   ├── storage.js   # Local storage utilities
│   │   └── utils.js     # Helper functions
│   ├── css/
│   │   └── index.css    # Global styles
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Pages deployment
└── package.json
```

## License

This project is private and not licensed for public use.
