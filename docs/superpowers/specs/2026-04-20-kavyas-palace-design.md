# Kavya's Palace — Design Spec

**Date:** 2026-04-20
**Status:** Approved for implementation planning
**Supersedes:** current `app.jsx` (flashcards + matching game + category grid)

## Vision

Replace the existing flashcards + matching game with **Kavya's Palace** — a warm, character-led, tactile play world. A 4-year-old user explores 5 palace scenes, helps her companion Kavya with missions and daily stories, and picks up Kannada / Hindi / Gujarati words along the way. Learning is a by-product of play, not the task.

**Why this redesign:** The current app bored the primary user (4-year-old daughter), and the audio button was too small to be discoverable. This redesign replaces "tap a card to flip it" with "drag a wand around a living scene and help Kavya" — every tappable object replays its own audio, so there is no small audio button anywhere.

**Primary user:** 4-year-old child on iPad Safari. Secondary: parents.

**Non-goals:** multiplayer, accounts, ads, IAP, new languages beyond KN/HI/GU, recorded voice lines (TTS only for v1), a preserved "classic" flashcards mode.

## The cast

All content references these names exactly:

- **Kavya** — main character and companion. Indian princess aesthetic (warm brown skin, long braid, pink/gold lehenga, tiara). Appears on home screen and in every scene.
- **Kailash (Kai)** — Kavya's brother. Full name Kailash; referred to as Kai in casual/spoken contexts. Lives in the Family Room scene.
- **Aira, Millie, Lila, Priya** — Kavya's four friends. Drop-in visitors who appear across scenes to introduce friend/greeting words in context.
- **Scooby** — Kavya's pet dog. Always referred to by name, not a generic "dog." Appears in Garden and Courtyard.
- **Family background cast** — Amma (mother), Appa (father), Dadi (grandma), Dada (grandpa) in Family Room. Generically named for now; can be re-named later without breaking anything.

## Product anatomy

### Palace hub (home screen)

Replaces the existing `HomePage` (For You strip + category grid).

- Central palace illustration, 5 scene tiles arranged around it:
  - 🌺 **Garden** (animals, colors, flowers)
  - 🍛 **Kitchen** (food, fruits)
  - 🛏️ **Bedroom** (body, numbers)
  - 👨‍👩‍👧 **Family Room** (family, greetings/phrases)
  - 🛕 **Courtyard** (vehicles, weather)
- Kavya avatar at bottom with speech bubble ("Namaste! Where to?").
- Corner widgets: language picker (top-left), star count (top-right).
- Top banner: "Today's story" card (if a daily story is active and incomplete).

### Scene

Generic `Scene` component configured per scene via data. Anatomy:

- Full-bleed gradient background + 2-3 persistent decorative elements.
- 10 **ghost objects** at predetermined positions (grayscale + 25% opacity).
- **Kavya avatar** (bottom-left) with **speech bubble** above her.
- **Wand** follows pointer/touch, emits sparkle trail.
- **Mission HUD** (Kavya's speech bubble doubles as this): shows current target word (English + native-script) + emoji cue.
- **Back-to-hub** button (🏰 icon, top-left, ≥ 64pt).
- **SparkleLayer** (absolutely positioned, animated particles).

### Core interaction loop (inside a scene)

1. Scene mounts → `MissionEngine.pickMission(sceneId)` returns 5 target words from the ~10-word pool. Story-driven missions override with story-specific words.
2. Kavya walks in, waves, speaks intro TTS in chosen language. First target shown in speech bubble.
3. Pointer/touch → wand follows finger, emitting sparkle particles every ~40ms.
4. Wand tip bounding box overlaps a ghost object → `revealObject(id)`:
   - Object transitions grayscale → color + scale 0.8 → 1.1 → 1.0 bounce + sparkle burst.
   - `AudioManager.speakWord(wordId, lang)`.
   - If `wordId === currentTarget` → Kavya celebrates, +1 star, `MissionEngine.advance()`.
   - Else → Kavya says "Oh, a [word]! And I still need to find the [target]!" (no correction, gentle redirect).
5. Revealed objects remain color-filled. Tapping any revealed object replays its audio. **This is the audio affordance — there is no separate button.**
6. All 5 mission targets found → mission-complete animation (Kavya dances, confetti, +3 stars). Remaining ghost objects become tappable for free-play.
7. Exit → return to hub. If this scene is a step in today's active story → `StoryEngine.advance()` and the hub highlights the next story scene.

### Novelty knobs (anti-boredom)

Each is a small feature flag in data:

- **Mission shuffle** — every visit picks 5 of 10 scene words randomly.
- **Bubble-pop variant** — scene visit count ≥ 3 unlocks alt mode (same words appear inside floating bubbles; tap to pop). Kid picks mode on scene entry.
- **Golden objects** — 20% chance per visit: one target becomes golden (extra sparkle, +3 bonus stars).
- **Time-of-day palette** — morning / afternoon / evening gradient tints based on `new Date()`.
- **Story-of-the-day** — frames missions when active; see below.

### Story engine

- **Library of 5 daily stories** (rotates day-stably, seeded by `new Date().toDateString()`):
  1. *Kavya's Birthday* — Garden → Kitchen → Family Room. Payoff: cake + dance.
  2. *Where is Scooby?* — Garden → Courtyard → Bedroom. Payoff: Scooby reunion.
  3. *The Missing Tiara* — Bedroom → Family Room → Garden. Payoff: tiara restored.
  4. *Friends Come Over* — Bedroom → Kitchen → Garden. Payoff: all four friends dance.
  5. *A Festival Feast* — Kitchen → Family Room → Courtyard. Payoff: fireworks.
- Each story has **3 scene-steps**, each with specific `targetWords` drawn from that scene's pool.
- Hub shows a "Today's story" card above scene tiles when incomplete.
- Tap story card → intro cutscene (Kavya speaks setup) → hub highlights first scene.
- Completing all 3 steps → finale cutscene (payoff animation), +10 stars, story marked complete for the day.
- Kid can ignore the story and free-play; engine never blocks.

### Kavya's voice & personality

- Always warm, never corrective. Wrong taps redirect, never scold.
- Short spoken lines via TTS in the chosen language. Speech bubble shows English phrasing for the parent to understand + native-script for the target word.
- Recurring named friends (Aira/Millie/Lila/Priya) visit with a consistent entry phrase ("Look — Aira is here to play!"). Scooby appears with a bark sound effect + name.

## Architecture

### Constraints (unchanged from existing CLAUDE.md)

- No bundler, no build step. CDN-loaded React / ReactDOM / Tailwind + Babel Standalone in-browser JSX transpilation.
- No `import` / `export`. Everything is a global. Libraries loaded via `<script>` tags.
- No npm packages. Icons are emoji-based.
- Single-page: `index.html` is the only entry point.

### File split

Single `app.jsx` is replaced by **several focused `<script type="text/babel">` files** loaded in dependency order from `index.html`:

```
index.html
  ├─ (CDN) React / ReactDOM / Tailwind / Babel standalone
  ├─ data.jsx          — scenes, words, friends, stories (content bundle)
  ├─ audio.jsx         — AudioManager: Sarvam TTS + browser TTS fallback
  ├─ engines.jsx       — MissionEngine, StoryEngine, ProgressStore
  ├─ components.jsx    — Wand, Sparkles, KavyaAvatar, SpeechBubble, LangPicker, StarCounter, BackButton
  ├─ scenes.jsx        — Scene component + per-scene layouts + PalaceHub
  └─ app.jsx           — LanguageLearningApp root: routing, state, wiring
```

Load order is required because there is no module resolver — each file defines globals consumed by later files.

### Component inventory

- `LanguageLearningApp` — root; holds view state (`hub` | `scene:<id>` | `story-intro:<id>` | `story-outro:<id>`); wires engines, audio, persistence.
- `PalaceHub` — home screen: 5 scene tiles, Kavya greeter, language picker, star count, story-of-the-day card.
- `Scene` — generic scene shell configured via `SCENES[id]`. Renders background, Kavya, wand, ghost + revealed objects, sparkle layer, mission HUD, back button.
- `KavyaAvatar` — positioned character with `idle` / `wave` / `celebrate` / `dance` states + `SpeechBubble`. v1 = emoji stand-in (👸🏽) with sparkle frame; illustrated SVG is a stretch goal that does not block launch.
- `Wand` — follows pointer; emits sparkle particles; performs collision against ghost objects.
- `SparkleLayer` — pooled absolutely-positioned particle elements recycled via CSS keyframe animation. No canvas, no animation lib.
- `MissionEngine` — plain JS module exposing `{pickMission, currentTarget, advance, isComplete}`; no React state.
- `StoryEngine` — `{today, currentStep, advance, isComplete, intro, outro}`; seeded by date.
- `AudioManager` — Sarvam AI primary with `{kn-IN, hi-IN, gu-IN}`; browser `speechSynthesis` fallback; word-level prefetch and cache; safe interruption.
- `ProgressStore` — thin wrapper over `localStorage`; handles v1 → v2 migration.
- `LangPicker`, `BackButton`, `StarCounter` — small corner widgets.

### Data model (in `data.jsx`)

```js
SCENES = [
  { id: 'garden', label: 'Garden', emoji: '🌺',
    bg: 'from-green-200 to-green-400',
    decor: ['☀️','🌳','🌳'],
    words: ['elephant','peacock','butterfly','tree','flower','turtle',
            'monkey','hibiscus','parrot','mango'],
    objectPositions: { elephant: {x:.08,y:.22}, peacock: {x:.7,y:.15}, /*…*/ } },
  // kitchen, bedroom, family, courtyard
]

WORDS = {
  elephant: { english: 'Elephant', emoji: '🐘',
    kannada: 'ಆನೆ', kannadaSound: 'aane',
    hindi: 'हाथी', hindiSound: 'haathi',
    gujarati: 'હાથી', gujaratiSound: 'haathi' },
  // …
}

FRIENDS = {
  kai:    { realName: 'Kailash', displayName: 'Kai', role: 'brother',
            appearsIn: ['family'], wordRef: 'brother' },
  scooby: { displayName: 'Scooby', role: 'dog',
            appearsIn: ['garden','courtyard'], wordRef: 'dog' },
  aira:   { displayName: 'Aira',  role: 'friend', appearsIn: ['garden','bedroom'] },
  millie: { displayName: 'Millie',role: 'friend', appearsIn: ['kitchen','bedroom'] },
  lila:   { displayName: 'Lila',  role: 'friend', appearsIn: ['bedroom','courtyard'] },
  priya:  { displayName: 'Priya', role: 'friend', appearsIn: ['family','kitchen'] },
}

STORIES = [
  { id: 'birthday', title: "Kavya's Birthday Surprise",
    intro: "It's my sister's birthday! Help me get ready!",
    steps: [
      { scene: 'garden',  targetWords: ['flower','mango','butterfly','tree','peacock'] },
      { scene: 'kitchen', targetWords: ['milk','sugar','mango','rice','banana']     },
      { scene: 'family',  targetWords: ['sister','mother','father','brother','grandma'] },
    ],
    finale: 'cake-dance' },
  // 4 more: scooby-lost, missing-tiara, friends-come-over, festival-feast
]

CONTENT_VERSION = 2 // bumped when new content is added
```

### Persistence

Single `localStorage` key `indianLanguagesProgress`, v2 schema:

```js
{
  version: 2,
  stars: 42,
  language: 'kannada',                 // 'kannada' | 'hindi' | 'gujarati'
  wordsRevealed: {                     // per language
    kannada:  { elephant: 3, peacock: 1, /*…*/ },
    hindi:    { /*…*/ },
    gujarati: { /*…*/ },
  },
  sceneVisits: { garden: 5, kitchen: 2, /*…*/ },
  storiesCompleted: { birthday: '2026-04-15', /*…*/ },
  lastActive: '2026-04-20',
  dailyStreak: 3,
}
```

Second key `indianLanguagesContentVersion` tracks the last `CONTENT_VERSION` the user has seen; new scenes/stories get a "New!" badge until that key catches up.

**Migration.** On first load if `version !== 2`: carry forward `totalStars` and mark any `progress[*] === true` as `wordsRevealed[currentLang][wordId] = 1`. Discard the rest.

## Visual design

- **Palette** — pastel Indian: marigold, rose pink, saffron, teal, cream. Scene-specific gradient backgrounds.
- **Typography** — Nunito (Google Fonts) for English/UI; system fonts handle Kannada/Hindi/Gujarati correctly.
- **Touch targets** — every tappable object ≥ 80×80 pt; every button ≥ 64 pt minimum.
- **Animations** — CSS transforms + keyframes only. No animation library.
  - `sparkle-float` — particle rises and fades over 600ms.
  - `reveal-bounce` — object scales 0.8 → 1.1 → 1.0 over 400ms with grayscale → color transition.
  - `kavya-wave`, `kavya-dance` — keyframe loops on the avatar.
- **Accessibility** — voice output is the primary feedback; captions (English + native) in speech bubble; high-contrast ghost-vs-revealed state.

## Content as a living library

The user will add words, friends, stories, and scenes as his daughter ages. Design must make that a pure data edit, not a code change.

**`data.jsx` is the only file to edit to add content.** Patterns:

- **Add a word** — insert into `WORDS`, reference from a scene's `words` array, set a position.
- **Add a friend** — insert into `FRIENDS`, list scenes in `appearsIn`.
- **Add a story** — append to `STORIES`; each step references existing scenes and words.
- **Add a scene** — append to `SCENES`; add a tile in `PalaceHub` config.

A companion doc **`ADDING_CONTENT.md`** documents each pattern with a worked example. Bumping `CONTENT_VERSION` makes the app badge the new content until the user sees it.

## Testing & verification

No test framework (platform constraint). Manual verification checklist (to be executed before each deploy):

1. Hub renders; 5 scene tiles visible; Kavya greets; language picker works; star count correct.
2. Enter each scene; verify 10 ghost objects at expected positions; wand follows touch; revealing plays correct-language audio.
3. Complete a full mission in each scene; confirm celebration + stars + return to hub.
4. Complete today's story end-to-end; confirm finale cutscene + +10 stars + story marked complete.
5. Switch language mid-scene; confirm subsequent reveals use new language.
6. Trigger the golden-object path (replay until it fires) and the bubble-pop variant (after 3 visits).
7. Reload the app mid-session; confirm localStorage restores state.
8. Fresh install: confirm v1 → v2 migration carries stars + revealed words.
9. iPad Safari (primary) and desktop Chrome (dev).

## Out of scope

- Recorded human voice lines (TTS only for v1).
- Multiplayer, cloud sync, accounts.
- Languages beyond Kannada / Hindi / Gujarati.
- Ads, IAP.
- Parent analytics dashboard beyond existing simple progress view.
- Classic flashcard / matching-game mode (removed — no legacy shim).
- Illustrated SVG Kavya avatar as a launch blocker (ship with emoji stand-in; upgrade later).

## Risks & open questions

- **Drag gesture on a 4-year-old.** Mitigated by "gentle forgiveness" — pure taps near a ghost also reveal. Verify on actual device before calling done.
- **TTS quality for short exclamations.** If Sarvam-produced "Shaabaash!" / "Namaste!" sound robotic, fall back to a recorded-phrase upgrade in a future release (not v1).
- **Positional layout on varying screen sizes.** `objectPositions` are percentages (0–1), so they scale. Needs validation across iPad portrait / landscape / phone sizes.
- **Content authoring effort for 5 daily stories.** Each story needs curated word sets per step; initial authoring is a real one-time cost (~1 day).
