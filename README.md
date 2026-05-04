# Pomodoro Web

Modern Pomodoro web app focused on clean architecture, responsive laptop-first UI, and maintainable TypeScript modules.

Live app: [https://aneq05.github.io/pomodoro-web/](https://aneq05.github.io/pomodoro-web/)  
Repository: [https://github.com/aneq05/pomodoro-web](https://github.com/aneq05/pomodoro-web)

## Project Overview

This project is a browser Pomodoro timer with:

- Focus / short break / long break modes
- Editable timer presets
- Task list with selection, done marking, filtering, and deletion
- Session stats (sessions, breaks, task progress)
- Motivational quote rotation
- Spotify embed panel for focus sessions

The codebase was refactored from a single-file implementation into feature-based modules to improve scalability and readability.

## Tech Stack

- TypeScript
- Vite
- Vitest (unit tests)
- GitHub Actions (CI + Pages deployment)
- GitHub Pages (hosting)

## Architecture and Folder Structure

```text
.
|- .github/
|  |- workflows/
|     |- ci.yml
|     |- deploy-pages.yml
|- public/
|- src/
|  |- app/
|  |  |- createPomodoroApp.ts
|  |  |- dom.ts
|  |- features/
|  |  |- quotes/
|  |  |  |- quotes.ts
|  |  |- tasks/
|  |  |  |- taskStore.ts
|  |  |  |- taskStore.test.ts
|  |  |- timer/
|  |     |- pomodoroEngine.ts
|  |     |- pomodoroEngine.test.ts
|  |- shared/
|  |  |- constants.ts
|  |  |- time.ts
|  |  |- time.test.ts
|  |  |- types.ts
|  |- styles/
|  |  |- base.css
|  |  |- layout.css
|  |  |- components.css
|  |  |- main.css
|  |- main.ts
|- index.html
|- package.json
|- tsconfig.json
|- vite.config.ts
|- vitest.config.ts
```

## Design Decisions

- Feature-based split (`timer`, `tasks`, `quotes`) to avoid logic coupling.
- Shared utilities in `src/shared` to reduce duplication.
- One app bootstrap in `src/app/createPomodoroApp.ts`.
- CSS split into `base`, `layout`, and `components` for cleaner maintenance.
- Laptop-first responsive layout that adapts to smaller widths.

## Getting Started (Local)

### Requirements

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run tests

```bash
npm run test
```

### Watch tests

```bash
npm run test:watch
```

## Available Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and production build
- `npm run preview` - preview production build
- `npm run test` - run unit tests once (Vitest)
- `npm run test:watch` - run tests in watch mode

## Testing Strategy

Unit tests cover:

- `src/shared/time.ts` (time formatting and conversion utilities)
- `src/features/tasks/taskStore.ts` (task state and behavior)
- `src/features/timer/pomodoroEngine.ts` (timer logic and session counting)

This keeps core business logic testable outside of the DOM layer.

## CI and Deployment

### CI Workflow

File: `.github/workflows/ci.yml`

On every push/PR:

1. Install dependencies
2. Run unit tests
3. Build the app

### GitHub Pages Deployment

File: `.github/workflows/deploy-pages.yml`

On push to `main`:

1. Install dependencies
2. Run unit tests
3. Build app (`dist`)
4. Upload `dist` artifact
5. Deploy to GitHub Pages

`vite.config.ts` sets `base` automatically in GitHub Actions using `GITHUB_REPOSITORY`, so assets resolve correctly on Pages.

## How to Use the App

1. Add tasks in the left panel.
2. Start a focus session with `Start focus`.
3. Switch to short/long break modes when needed.
4. Select tasks and mark them done with `Done`.
5. Use `Edit` in timer presets to customize durations.
6. Track progress in the stats panel.

## Roadmap Ideas

- Persist state in `localStorage`
- Keyboard shortcuts
- Sound notifications
- Light/dark theme toggle
- E2E tests (Playwright)

## License

Private project for personal use.
