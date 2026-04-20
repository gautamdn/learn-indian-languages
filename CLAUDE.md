# Learn Indian Languages

Interactive language learning app for kids. Built for my child to learn **Kannada**, **Hindi**, and **Gujarati**.

## Architecture

Six-file, no-bundler React app. Scripts are loaded in dependency order from `index.html`:

```
index.html
  ├─ (CDN) React / ReactDOM / Tailwind / Babel standalone
  ├─ data.jsx          — content bundle (SCENES, WORDS, FRIENDS, STORIES)
  ├─ audio.jsx         — AudioManager (Sarvam + browser TTS fallback, prefetch cache)
  ├─ engines.jsx       — MissionEngine, StoryEngine, ProgressStore + in-browser test runner
  ├─ components.jsx    — KavyaAvatar, SpeechBubble, Wand, SparkleLayer, widgets
  ├─ scenes.jsx        — Scene, PalaceHub, StoryIntro, StoryFinale
  └─ app.jsx           — LanguageLearningApp root (view routing, wiring)
```

All code uses globals — no `import`/`export`. Babel Standalone transpiles JSX in-browser.

Tests run in-browser: open `index.html?test=1` to execute engine tests and see results in the console.

## Languages

The app must support **3 languages** — these are the priority:

| Language | Script | TTS Code | Status |
|----------|--------|----------|--------|
| Kannada | ಕನ್ನಡ | `kn-IN` | Done |
| Hindi | हिन्दी | `hi-IN` | Done |
| Gujarati | ગુજરાતી | `gu-IN` | Done |

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

### Language Selection

`selectedLanguage` state controls which languages are shown. Values: `'all'`, `'kannada'`, `'hindi'`, `'gujarati'`. Default is `'all'`. A `<select>` dropdown in `CategoryView` lets users switch. The `speak()` function uses a language map to resolve TTS codes.

### Adding More Languages

Follow the same pattern: add `{lang}` and `{lang}Sound` fields to every item, add an `<option>` to the dropdown, add a conditional block in FlashCard, and update the `langMap` in `speak()`. See `ADDING_LANGUAGES.md` for reference.

## Scenes (replaces old categories)

Five scenes mapped from the old 8 categories:

| Scene | Covers | Words |
|-------|--------|-------|
| 🌺 Garden | animals, colors, flowers | 10 |
| 🍛 Kitchen | food, fruits | 10 |
| 🛏️ Bedroom | body, numbers | 10 |
| 👨‍👩‍👧 Family Room | family, greetings, dog | 10 |
| 🛕 Courtyard | vehicles, weather, outdoors | 10 |

Each scene has 10 words at fractional positions that scale to screen size. Missions pick 5 of 10 per visit (or the 5 specified by an active story).

## Key Components

- `LanguageLearningApp` (app.jsx) — root; view state (`hub` | `story-intro` | `scene:<id>` | `story-finale`)
- `PalaceHub` (scenes.jsx) — home screen with 5 scene tiles, language picker, star count, today's story
- `Scene` (scenes.jsx) — generic scene shell: wand, ghost/revealed objects, Kavya, mission HUD, collision
- `StoryIntro`, `StoryFinale` (scenes.jsx) — story entry/exit cutscenes
- `KavyaAvatar`, `SpeechBubble`, `Wand`, `SparkleLayer`, `LangPicker`, `StarCounter`, `BackButton` (components.jsx)
- `MissionEngine`, `StoryEngine`, `ProgressStore` (engines.jsx) — plain JS modules, no React

## Routing

No router library. `LanguageLearningApp.view` string:
- `'hub'` → PalaceHub
- `'story-intro'` → StoryIntro
- `'scene:<sceneId>'` → Scene (with or without `storyStep`)
- `'story-finale'` → StoryFinale

## Data Persistence

Single `localStorage` key `indianLanguagesProgress`, v2 schema:
```js
{
  version: 2,
  stars, language, wordsRevealed: { kannada, hindi, gujarati },
  sceneVisits, storiesCompleted, lastActive, dailyStreak,
}
```
`ProgressStore.load()` migrates v1 → v2 on first load.

## Content growth

The app is designed to grow with the user's daughter as she ages. New words, scenes, stories, and friends are **pure data edits to `data.jsx`** — see `ADDING_CONTENT.md` for patterns.

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
