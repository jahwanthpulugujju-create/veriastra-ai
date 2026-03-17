# Veriastra

## Overview
Veriastra is an Identity Verification & Deepfake Defense Platform. It is a pure frontend React/Vite/TypeScript application featuring a landing page and a dashboard with analytics, live monitoring, settings, and API playground sections. Tagline: "Trust, Verified in Real Time."

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6
- **State/Data**: TanStack React Query
- **Charts**: Recharts
- **Animations**: Framer Motion

## Project Structure
- `src/pages/` - Top-level route pages (Index, Dashboard, Analytics, Settings, Verify, LiveMonitoring, ApiPlayground)
- `src/components/` - Reusable components organized by feature (landing, analytics, dashboard, evidence, ui)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities (cn helper)

## Running the App
The app runs via the "Start application" workflow using `npm run dev` on port 5000.

## Notes
- Migrated from Lovable to Replit: removed `lovable-tagger` dev dependency and updated `vite.config.ts` to bind to `0.0.0.0:5000` with `allowedHosts: true` for Replit compatibility.
