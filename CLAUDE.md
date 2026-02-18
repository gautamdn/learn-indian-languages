# Learn Indian Languages

Interactive language learning app for kids. Built for my child to learn **Kannada**, **Hindi**, and **Gujarati**.

## Architecture

Single-file React app with **no bundler or build step**. Everything runs via CDN scripts + Babel standalone transpilation in the browser.

- `index.html` — Entry point, loads CDN deps, contains loading spinner
- `app.jsx` — Entire app (components, data, routing, styles). Loaded via `<script type="text/babel">`
- `manifest.json` — PWA config

### CDN Dependencies (loaded as globals, NOT npm modules)

- **React 18 / ReactDOM 18** — `React` and `ReactDOM` are global. Use `const { useState, useEffect } = React;` — never `import` from `'react'`.
- **Babel Standalone** — Transpiles JSX in-browser. Supports JSX but NOT ES module `import`/`export` syntax.
- **Tailwind CSS** — Loaded via `cdn.tailwindcss.com` play CDN.

### Critical Constraints

- **No `import`/`export` statements.** Babel standalone does not support ES module resolution. All code must use globals.
- **No npm packages.** Any library must be loaded via `<script>` tag in `index.html` and accessed as a global.
- **Icons are emoji-based.** Lucide-react was removed; icon components use emoji (e.g., `const Star = () => <Icon>⭐</Icon>`).
- **Single JSX file.** All components live in `app.jsx`. The file renders itself at the bottom: `ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);`

## Languages

The app must support **3 languages** — these are the priority:

| Language | Script | TTS Code | Status |
|----------|--------|----------|--------|
| Kannada | ಕನ್ನಡ | `kn-IN` | Done |
| Hindi | हिन्दी | `hi-IN` | Done |
| Gujarati | ગુજરાતી | `gu-IN` | Not yet added |

### Word Data Structure

Each vocabulary item follows this pattern:
```javascript
{
  english: 'Dog',
  kannada: 'ನಾಯಿ', kannadaSound: 'naayi',
  hindi: 'कुत्ता', hindiSound: 'kutta',
  gujarati: 'કૂતરો', gujaratiSound: 'kuutro',  // add for all items
  emoji: '🐕'
}
```

### Adding Gujarati

When adding Gujarati support:
1. Add `gujarati` and `gujaratiSound` fields to every item in every category
2. Update `speak()` to handle `'gujarati'` → `'gu-IN'`
3. Add Gujarati toggle button in `CategoryView`
4. Show Gujarati in the FlashCard back face
5. Support Gujarati in the matching game word selection
6. Update homepage subtitle to remove "Coming Soon"

See `ADDING_LANGUAGES.md` for detailed vocabulary reference and code examples.

## Categories

8 categories with ~10 words each: `animals`, `colors`, `numbers`, `family`, `body`, `food`, `phrases`, `vehicles`

## Key Components in app.jsx

- `LanguageLearningApp` — Root component, manages state and routing via `currentView`
- `FlashCard` — Tap-to-flip card showing English front / translations back
- `MatchingGame` — Memory card matching game (emoji ↔ word)
- `CategoryView` — Practice view with flashcards + language toggles
- `ProgressDashboard` — Stats overview (stars, words learned, per-category bars)
- `HomePage` — Category grid, star count, tips for parents

## Routing

No router library. `currentView` state string controls which component renders:
- `'home'` → HomePage
- `'progress'` → ProgressDashboard
- `'game-{categoryKey}'` → MatchingGame
- Any category key (e.g. `'animals'`) → CategoryView

## Data Persistence

`localStorage` key: `kannadaHindiProgress`
```javascript
{ progress: { "animals-0": true, ... }, totalStars: 25, dailyStreak: 5, lastUpdated: "..." }
```

## Deployment

- Hosted on **Netlify** at https://zesty-bublanina-d4336d.netlify.app/
- Auto-deploys from `main` branch on GitHub
- No build command needed — Netlify serves static files directly
- Repo: `gautamdn/learn-indian-languages`

## Development Workflow

1. Edit `app.jsx` (or `index.html`)
2. Open `index.html` in browser to test locally
3. `git add` + `git commit` + `git push` to deploy

## Style

- Tailwind utility classes throughout
- Purple primary theme (`purple-500`, `purple-600`)
- Gradient backgrounds (`from-blue-200 via-purple-200 to-pink-200`)
- Large touch targets for kids (rounded-full, big text, big emoji)
- Custom CSS for card flip animations (`.perspective-1000`, `.backface-hidden`, `.rotate-y-180`) defined in a `<style jsx>` block at the bottom of the root component

## Target Audience

- **Primary user:** Young child (3-6 years old) learning on iPad
- **Secondary user:** Parents helping with practice
- Keep UI simple, colorful, touch-friendly with large targets
- No complex navigation — everything is 1-2 taps from home
