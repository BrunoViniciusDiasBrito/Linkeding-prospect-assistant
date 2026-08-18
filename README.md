# Linkeding Prospect Assistant

Initial Tauri v2 desktop application scaffold with React, TypeScript, Vite, Tailwind CSS, and Feature Slice Design organization.

## Frontend structure

- `src/app`
- `src/pages`
- `src/widgets`
- `src/features/searches`
- `src/features/profiles`
- `src/features/automation`
- `src/features/reports`
- `src/features/settings`
- `src/entities/profile`
- `src/entities/search`
- `src/entities/connection`
- `src/shared/api`
- `src/shared/hooks`
- `src/shared/lib`
- `src/shared/ui`
- `src/shared/types`
- `src/shared/utils`
- `src/processes`

## Backend structure

- `src-tauri/src/commands`
- `src-tauri/src/services`
- `src-tauri/src/repositories`
- `src-tauri/src/domain`
- `src-tauri/src/automation`
- `src-tauri/src/ocr`
- `src-tauri/src/vision`
- `src-tauri/src/database`

## Scripts

- `npm run dev`: starts the Vite dev server.
- `npm run tauri:dev`: starts the Tauri development app.
- `npm run build`: type-checks and builds the frontend.
- `npm run check`: type-checks the frontend and runs Cargo checks for the Tauri backend.
