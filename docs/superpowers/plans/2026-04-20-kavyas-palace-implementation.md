# Kavya's Palace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the learn-indian-languages app as "Kavya's Palace" — a character-led, tactile play world with wand-drag reveal mechanic, missions, and daily stories — replacing the flashcard/matching-game UI that bored the 4-year-old primary user.

**Architecture:** Keep the no-bundler, globals-only browser constraint. Split the single `app.jsx` into six focused `<script type="text/babel">` files loaded in dependency order from `index.html`. Pure-logic modules (engines, store) get an in-browser test runner invoked via `?test=1`. UI is verified manually per spec checklist.

**Tech Stack:** React 18 + ReactDOM (CDN globals), Babel Standalone (in-browser JSX), Tailwind CSS (CDN), existing Netlify function `netlify/functions/tts.js` for Sarvam AI, browser `SpeechSynthesis` fallback, `localStorage` persistence. No npm, no bundler.

**Spec:** `docs/superpowers/specs/2026-04-20-kavyas-palace-design.md`

---

## File structure

After this plan is complete, the repo tree for application code will be:

```
index.html              ~ loads scripts in order, CSS keyframes
data.jsx                ~ SCENES, WORDS, FRIENDS, STORIES, CONTENT_VERSION (globals)
audio.jsx               ~ AudioManager (global)
engines.jsx             ~ MissionEngine, StoryEngine, ProgressStore, __TEST_RUNNER__
components.jsx          ~ Wand, SparkleLayer, KavyaAvatar, SpeechBubble,
                          LangPicker, StarCounter, BackButton
scenes.jsx              ~ Scene, PalaceHub
app.jsx                 ~ LanguageLearningApp root (view routing, wiring)
ADDING_CONTENT.md       ~ how to extend content as daughter ages
CLAUDE.md               ~ updated to reflect new architecture
netlify/functions/tts.js  (unchanged — keep Sarvam proxy as-is)
```

The old `app.jsx` will be renamed to `app-legacy.jsx` at the start so it stays around as reference during build, then deleted in the final cleanup task.

---

## Testing strategy

There is no test framework (no npm, no bundler). For **pure-logic** modules (`ProgressStore`, `MissionEngine`, `StoryEngine`), add an inline test runner in `engines.jsx`:

```javascript
const __TESTS = [];
const __test = (name, fn) => __TESTS.push({ name, fn });
const __assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
const __runTests = () => {
  let pass = 0, fail = 0;
  __TESTS.forEach(({ name, fn }) => {
    try { fn(); console.log('%c✓ ' + name, 'color: #4caf50'); pass++; }
    catch (e) { console.error('✗ ' + name + ':', e.message); fail++; }
  });
  console.log(`\n${pass} passed, ${fail} failed`);
};
if (new URLSearchParams(location.search).get('test') === '1') {
  window.addEventListener('DOMContentLoaded', __runTests);
}
```

Each engine task appends tests via `__test(...)`. Open `index.html?test=1` in a browser and check the console. "Test run" in verification steps means loading `index.html?test=1` and confirming zero failures.

For **UI** components and scenes, verification is manual: steps list the exact interactions to perform and the observable outcome.

---

## Task 1: Scaffold new file structure and update index.html

**Files:**
- Rename: `app.jsx` → `app-legacy.jsx` (keep for reference; not loaded after this task)
- Create: `data.jsx`, `audio.jsx`, `engines.jsx`, `components.jsx`, `scenes.jsx`, `app.jsx` (new, empty stubs)
- Modify: `index.html` — add script tags in dependency order, add CSS keyframes

- [ ] **Step 1: Rename existing app.jsx to app-legacy.jsx**

Run: `git mv app.jsx app-legacy.jsx`

- [ ] **Step 2: Create empty stub files**

Each file just logs a load marker so we can verify script order in the console.

Create `data.jsx`:
```javascript
// data.jsx — content bundle. Edit this file to add words, scenes, stories, friends.
console.log('[data.jsx] loaded');
```

Create `audio.jsx`:
```javascript
// audio.jsx — AudioManager: Sarvam TTS primary, browser TTS fallback.
console.log('[audio.jsx] loaded');
```

Create `engines.jsx`:
```javascript
// engines.jsx — MissionEngine, StoryEngine, ProgressStore, in-browser test runner.
console.log('[engines.jsx] loaded');
```

Create `components.jsx`:
```javascript
// components.jsx — shared UI primitives: Wand, Sparkles, KavyaAvatar, SpeechBubble, widgets.
console.log('[components.jsx] loaded');
```

Create `scenes.jsx`:
```javascript
// scenes.jsx — Scene component and PalaceHub.
console.log('[scenes.jsx] loaded');
```

Create `app.jsx` (new root):
```javascript
// app.jsx — LanguageLearningApp root. Wires engines, audio, persistence; handles view routing.
const { useState, useEffect } = React;

const LanguageLearningApp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-green-200">
      <div className="text-center">
        <div className="text-8xl">👸🏽</div>
        <p className="mt-4 text-xl font-bold text-purple-800">Kavya's Palace — scaffolding in progress</p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] loaded');
```

- [ ] **Step 3: Update index.html to load files in dependency order and add global CSS keyframes**

Replace the single `<script type="text/babel" src="./app.jsx"></script>` at the bottom of `index.html` with the ordered set, and extend the `<style>` block with the keyframes used across the app.

Find this block in `index.html:85`:
```html
    <!-- Main App -->
    <script type="text/babel" src="./app.jsx"></script>
```

Replace with:
```html
    <!-- App scripts — load order matters (no module resolver) -->
    <script type="text/babel" src="./data.jsx"></script>
    <script type="text/babel" src="./audio.jsx"></script>
    <script type="text/babel" src="./engines.jsx"></script>
    <script type="text/babel" src="./components.jsx"></script>
    <script type="text/babel" src="./scenes.jsx"></script>
    <script type="text/babel" src="./app.jsx"></script>
```

Inside the existing `<style>` block (before the closing `</style>` at `index.html:74`), append these keyframes:

```css
@keyframes sparkle-float {
  0%   { opacity: 0; transform: translate(0,0) scale(0.5); }
  20%  { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--dx,0), var(--dy,-30px)) scale(1.2); }
}
@keyframes reveal-bounce {
  0%   { filter: grayscale(1); opacity: 0.25; transform: scale(0.8); }
  60%  { filter: grayscale(0); opacity: 1;   transform: scale(1.15); }
  100% { filter: grayscale(0); opacity: 1;   transform: scale(1); }
}
@keyframes kavya-wave {
  0%,100% { transform: rotate(0deg); }
  50%     { transform: rotate(-8deg); }
}
@keyframes kavya-dance {
  0%,100% { transform: translateY(0) rotate(-3deg); }
  50%     { transform: translateY(-10px) rotate(3deg); }
}
@keyframes pop-in {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}
```

- [ ] **Step 4: Verify scaffold loads**

Open `index.html` in a browser (file:// is fine; or run a tiny local server such as `python3 -m http.server 8000`).

Expected in console (in this exact order):
```
[data.jsx] loaded
[audio.jsx] loaded
[engines.jsx] loaded
[components.jsx] loaded
[scenes.jsx] loaded
[app.jsx] loaded
```

Expected on screen: a pastel-gradient page with a princess emoji and "Kavya's Palace — scaffolding in progress" text.

- [ ] **Step 5: Commit**

```bash
git add index.html data.jsx audio.jsx engines.jsx components.jsx scenes.jsx app.jsx app-legacy.jsx
git commit -m "scaffold: split app.jsx into ordered script files, add CSS keyframes"
```

---

## Task 2: Content bundle (data.jsx)

**Files:**
- Modify: `data.jsx`

- [ ] **Step 1: Write WORDS dictionary**

Replace `data.jsx` entirely with:

```javascript
// data.jsx — content bundle. Edit this file to add words, scenes, stories, friends.
// See ADDING_CONTENT.md for the authoring patterns.

const CONTENT_VERSION = 2;

const WORDS = {
  // --- Garden ---
  elephant:  { english: 'Elephant',  emoji: '🐘', kannada: 'ಆನೆ',   kannadaSound: 'aane',   hindi: 'हाथी',   hindiSound: 'haathi',  gujarati: 'હાથી',   gujaratiSound: 'haathi' },
  peacock:   { english: 'Peacock',   emoji: '🦚', kannada: 'ನವಿಲು',  kannadaSound: 'navilu', hindi: 'मोर',    hindiSound: 'mor',     gujarati: 'મોર',    gujaratiSound: 'mor' },
  butterfly: { english: 'Butterfly', emoji: '🦋', kannada: 'ಚಿಟ್ಟೆ',  kannadaSound: 'chitte', hindi: 'तितली',  hindiSound: 'titli',   gujarati: 'પતંગિયું', gujaratiSound: 'patangiyu' },
  tree:      { english: 'Tree',      emoji: '🌳', kannada: 'ಮರ',    kannadaSound: 'mara',   hindi: 'पेड़',   hindiSound: 'ped',     gujarati: 'ઝાડ',    gujaratiSound: 'zaad' },
  flower:    { english: 'Flower',    emoji: '🌸', kannada: 'ಹೂವು',  kannadaSound: 'hoovu',  hindi: 'फूल',   hindiSound: 'phool',   gujarati: 'ફૂલ',    gujaratiSound: 'phool' },
  turtle:    { english: 'Turtle',    emoji: '🐢', kannada: 'ಆಮೆ',    kannadaSound: 'aame',   hindi: 'कछुआ',  hindiSound: 'kachua',  gujarati: 'કાચબો',  gujaratiSound: 'kachbo' },
  monkey:    { english: 'Monkey',    emoji: '🐒', kannada: 'ಕೋತಿ',   kannadaSound: 'koti',   hindi: 'बंदर',   hindiSound: 'bandar',  gujarati: 'વાંદરો',  gujaratiSound: 'vandro' },
  hibiscus:  { english: 'Hibiscus',  emoji: '🌺', kannada: 'ದಾಸವಾಳ', kannadaSound: 'daasavaala', hindi: 'गुड़हल', hindiSound: 'gudhal', gujarati: 'જાસૂદ', gujaratiSound: 'jasud' },
  parrot:    { english: 'Parrot',    emoji: '🦜', kannada: 'ಗಿಳಿ',    kannadaSound: 'gili',   hindi: 'तोता',   hindiSound: 'tota',    gujarati: 'પોપટ',   gujaratiSound: 'popat' },
  mango:     { english: 'Mango',     emoji: '🥭', kannada: 'ಮಾವಿನಹಣ್ಣು', kannadaSound: 'maavina hannu', hindi: 'आम', hindiSound: 'aam', gujarati: 'કેરી', gujaratiSound: 'keri' },

  // --- Kitchen ---
  milk:      { english: 'Milk',      emoji: '🥛', kannada: 'ಹಾಲು',  kannadaSound: 'haalu',  hindi: 'दूध',   hindiSound: 'doodh',   gujarati: 'દૂધ',    gujaratiSound: 'doodh' },
  rice:      { english: 'Rice',      emoji: '🍚', kannada: 'ಅನ್ನ',   kannadaSound: 'anna',   hindi: 'चावल',  hindiSound: 'chaawal', gujarati: 'ભાત',    gujaratiSound: 'bhat' },
  banana:    { english: 'Banana',    emoji: '🍌', kannada: 'ಬಾಳೆಹಣ್ಣು', kannadaSound: 'baale hannu', hindi: 'केला', hindiSound: 'kela', gujarati: 'કેળું', gujaratiSound: 'kelu' },
  bread:     { english: 'Bread',     emoji: '🍞', kannada: 'ಬ್ರೆಡ್',   kannadaSound: 'bread',  hindi: 'ब्रेड',  hindiSound: 'bread',   gujarati: 'બ્રેડ',    gujaratiSound: 'bread' },
  water:     { english: 'Water',     emoji: '💧', kannada: 'ನೀರು',   kannadaSound: 'neeru',  hindi: 'पानी',  hindiSound: 'paani',   gujarati: 'પાણી',    gujaratiSound: 'paani' },
  tea:       { english: 'Tea',       emoji: '🍵', kannada: 'ಚಹಾ',   kannadaSound: 'chaha',  hindi: 'चाय',   hindiSound: 'chai',    gujarati: 'ચા',      gujaratiSound: 'cha' },
  chapati:   { english: 'Chapati',   emoji: '🫓', kannada: 'ಚಪಾತಿ', kannadaSound: 'chapati', hindi: 'चपाती', hindiSound: 'chapati', gujarati: 'ચપાતી',   gujaratiSound: 'chapati' },
  apple:     { english: 'Apple',     emoji: '🍎', kannada: 'ಸೇಬು',   kannadaSound: 'sebu',   hindi: 'सेब',   hindiSound: 'seb',     gujarati: 'સફરજન',  gujaratiSound: 'safarjan' },
  sugar:     { english: 'Sugar',     emoji: '🍬', kannada: 'ಸಕ್ಕರೆ', kannadaSound: 'sakkare', hindi: 'चीनी', hindiSound: 'cheeni',  gujarati: 'ખાંડ',   gujaratiSound: 'khand' },

  // --- Bedroom (body + counting) ---
  eye:       { english: 'Eye',       emoji: '👁️', kannada: 'ಕಣ್ಣು',   kannadaSound: 'kannu',  hindi: 'आँख',   hindiSound: 'aankh',   gujarati: 'આંખ',    gujaratiSound: 'ankh' },
  nose:      { english: 'Nose',      emoji: '👃', kannada: 'ಮೂಗು',   kannadaSound: 'moogu',  hindi: 'नाक',   hindiSound: 'naak',    gujarati: 'નાક',    gujaratiSound: 'naak' },
  mouth:     { english: 'Mouth',     emoji: '👄', kannada: 'ಬಾಯಿ',   kannadaSound: 'baayi',  hindi: 'मुँह',  hindiSound: 'munh',    gujarati: 'મોં',     gujaratiSound: 'mon' },
  hand:      { english: 'Hand',      emoji: '✋', kannada: 'ಕೈ',      kannadaSound: 'kai',    hindi: 'हाथ',   hindiSound: 'haath',   gujarati: 'હાથ',    gujaratiSound: 'haath' },
  foot:      { english: 'Foot',      emoji: '🦶', kannada: 'ಕಾಲು',   kannadaSound: 'kaalu',  hindi: 'पैर',   hindiSound: 'pair',    gujarati: 'પગ',     gujaratiSound: 'pag' },
  one:       { english: 'One',       emoji: '1️⃣', kannada: 'ಒಂದು',   kannadaSound: 'ondu',   hindi: 'एक',    hindiSound: 'ek',      gujarati: 'એક',     gujaratiSound: 'ek' },
  two:       { english: 'Two',       emoji: '2️⃣', kannada: 'ಎರಡು',   kannadaSound: 'eradu',  hindi: 'दो',    hindiSound: 'do',      gujarati: 'બે',     gujaratiSound: 'be' },
  three:     { english: 'Three',     emoji: '3️⃣', kannada: 'ಮೂರು',   kannadaSound: 'mooru',  hindi: 'तीन',   hindiSound: 'teen',    gujarati: 'ત્રણ',    gujaratiSound: 'tran' },
  four:      { english: 'Four',      emoji: '4️⃣', kannada: 'ನಾಲ್ಕು',  kannadaSound: 'naalku', hindi: 'चार',   hindiSound: 'chaar',   gujarati: 'ચાર',    gujaratiSound: 'chaar' },
  five:      { english: 'Five',      emoji: '5️⃣', kannada: 'ಐದು',    kannadaSound: 'aidu',   hindi: 'पाँच',  hindiSound: 'paanch',  gujarati: 'પાંચ',    gujaratiSound: 'paanch' },

  // --- Family Room ---
  mother:    { english: 'Mother',    emoji: '👩', kannada: 'ಅಮ್ಮ',    kannadaSound: 'amma',   hindi: 'माँ',    hindiSound: 'maa',     gujarati: 'મમ્મી',   gujaratiSound: 'mummy' },
  father:    { english: 'Father',    emoji: '👨', kannada: 'ಅಪ್ಪ',    kannadaSound: 'appa',   hindi: 'पापा',   hindiSound: 'papa',    gujarati: 'પપ્પા',   gujaratiSound: 'pappa' },
  brother:   { english: 'Brother',   emoji: '👦', kannada: 'ಅಣ್ಣ',    kannadaSound: 'anna',   hindi: 'भाई',   hindiSound: 'bhai',    gujarati: 'ભાઈ',    gujaratiSound: 'bhai' },
  sister:    { english: 'Sister',    emoji: '👧', kannada: 'ಅಕ್ಕ',    kannadaSound: 'akka',   hindi: 'बहन',   hindiSound: 'behen',   gujarati: 'બહેન',    gujaratiSound: 'behen' },
  grandma:   { english: 'Grandma',   emoji: '👵', kannada: 'ಅಜ್ಜಿ',   kannadaSound: 'ajji',   hindi: 'दादी',   hindiSound: 'daadi',   gujarati: 'દાદી',    gujaratiSound: 'daadi' },
  grandpa:   { english: 'Grandpa',   emoji: '👴', kannada: 'ಅಜ್ಜ',    kannadaSound: 'ajja',   hindi: 'दादा',   hindiSound: 'daada',   gujarati: 'દાદા',    gujaratiSound: 'daada' },
  baby:      { english: 'Baby',      emoji: '👶', kannada: 'ಮಗು',   kannadaSound: 'magu',   hindi: 'बच्चा',  hindiSound: 'bachcha', gujarati: 'બાળક',    gujaratiSound: 'balak' },
  namaste:   { english: 'Hello',     emoji: '🙏', kannada: 'ನಮಸ್ಕಾರ', kannadaSound: 'namaskara', hindi: 'नमस्ते', hindiSound: 'namaste', gujarati: 'નમસ્તે', gujaratiSound: 'namaste' },
  thankyou:  { english: 'Thank you', emoji: '💐', kannada: 'ಧನ್ಯವಾದ', kannadaSound: 'dhanyavada', hindi: 'धन्यवाद', hindiSound: 'dhanyawaad', gujarati: 'આભાર', gujaratiSound: 'aabhar' },
  dog:       { english: 'Dog',       emoji: '🐕', kannada: 'ನಾಯಿ',   kannadaSound: 'naayi',  hindi: 'कुत्ता', hindiSound: 'kutta',   gujarati: 'કૂતરો',   gujaratiSound: 'kutro' },

  // --- Courtyard (vehicles + weather) ---
  car:       { english: 'Car',       emoji: '🚗', kannada: 'ಕಾರು',   kannadaSound: 'kaaru',  hindi: 'गाड़ी',  hindiSound: 'gaadi',   gujarati: 'ગાડી',   gujaratiSound: 'gaadi' },
  bus:       { english: 'Bus',       emoji: '🚌', kannada: 'ಬಸ್',    kannadaSound: 'bus',    hindi: 'बस',    hindiSound: 'bus',     gujarati: 'બસ',     gujaratiSound: 'bus' },
  bicycle:   { english: 'Bicycle',   emoji: '🚲', kannada: 'ಸೈಕಲ್', kannadaSound: 'cycle',  hindi: 'साइकिल', hindiSound: 'cycle',   gujarati: 'સાઇકલ',  gujaratiSound: 'cycle' },
  auto:      { english: 'Auto',      emoji: '🛺', kannada: 'ಆಟೋ',   kannadaSound: 'auto',   hindi: 'ऑटो',   hindiSound: 'auto',    gujarati: 'ઑટો',    gujaratiSound: 'auto' },
  sun:       { english: 'Sun',       emoji: '☀️', kannada: 'ಸೂರ್ಯ',   kannadaSound: 'soorya', hindi: 'सूरज',  hindiSound: 'sooraj',  gujarati: 'સૂરજ',   gujaratiSound: 'suraj' },
  moon:      { english: 'Moon',      emoji: '🌙', kannada: 'ಚಂದ್ರ',   kannadaSound: 'chandra', hindi: 'चाँद', hindiSound: 'chaand',  gujarati: 'ચાંદ',   gujaratiSound: 'chand' },
  cloud:     { english: 'Cloud',     emoji: '☁️', kannada: 'ಮೋಡ',   kannadaSound: 'moda',   hindi: 'बादल',  hindiSound: 'baadal',  gujarati: 'વાદળ',    gujaratiSound: 'vaadal' },
  rain:      { english: 'Rain',      emoji: '🌧️', kannada: 'ಮಳೆ',    kannadaSound: 'male',   hindi: 'बारिश', hindiSound: 'baarish', gujarati: 'વરસાદ',   gujaratiSound: 'varsaad' },
  star:      { english: 'Star',      emoji: '⭐', kannada: 'ನಕ್ಷತ್ರ', kannadaSound: 'nakshatra', hindi: 'तारा', hindiSound: 'taara',  gujarati: 'તારો',    gujaratiSound: 'taaro' },
  road:      { english: 'Road',      emoji: '🛣️', kannada: 'ರಸ್ತೆ',   kannadaSound: 'raste',  hindi: 'सड़क',  hindiSound: 'sadak',   gujarati: 'રસ્તો',   gujaratiSound: 'rasto' },
};
```

- [ ] **Step 2: Add SCENES array**

Append to `data.jsx`:

```javascript
// Scene layouts. objectPositions use fractions (0–1) of the scene box so they scale.
const SCENES = [
  { id: 'garden', label: 'Garden', emoji: '🌺',
    bg: 'from-green-200 to-green-400',
    decor: ['☀️', '🌳', '🌳'],
    words: ['elephant','peacock','butterfly','tree','flower','turtle','monkey','hibiscus','parrot','mango'],
    objectPositions: {
      elephant:  { x: 0.08, y: 0.20 },
      peacock:   { x: 0.72, y: 0.15 },
      butterfly: { x: 0.18, y: 0.45 },
      tree:      { x: 0.85, y: 0.40 },
      flower:    { x: 0.42, y: 0.28 },
      turtle:    { x: 0.50, y: 0.65 },
      monkey:    { x: 0.78, y: 0.68 },
      hibiscus:  { x: 0.12, y: 0.70 },
      parrot:    { x: 0.55, y: 0.12 },
      mango:     { x: 0.35, y: 0.55 },
    }},
  { id: 'kitchen', label: 'Kitchen', emoji: '🍛',
    bg: 'from-orange-100 to-amber-300',
    decor: ['🍳', '🍲', '🪔'],
    words: ['milk','rice','banana','bread','water','tea','chapati','apple','sugar','mango'],
    objectPositions: {
      milk:    { x: 0.10, y: 0.25 },
      rice:    { x: 0.80, y: 0.20 },
      banana:  { x: 0.30, y: 0.40 },
      bread:   { x: 0.60, y: 0.35 },
      water:   { x: 0.20, y: 0.60 },
      tea:     { x: 0.75, y: 0.55 },
      chapati: { x: 0.45, y: 0.25 },
      apple:   { x: 0.85, y: 0.72 },
      sugar:   { x: 0.15, y: 0.80 },
      mango:   { x: 0.55, y: 0.75 },
    }},
  { id: 'bedroom', label: 'Bedroom', emoji: '🛏️',
    bg: 'from-purple-200 to-pink-300',
    decor: ['🌙', '⭐', '🧸'],
    words: ['eye','nose','mouth','hand','foot','one','two','three','four','five'],
    objectPositions: {
      eye:   { x: 0.15, y: 0.20 },
      nose:  { x: 0.40, y: 0.18 },
      mouth: { x: 0.65, y: 0.22 },
      hand:  { x: 0.85, y: 0.35 },
      foot:  { x: 0.25, y: 0.50 },
      one:   { x: 0.50, y: 0.45 },
      two:   { x: 0.75, y: 0.55 },
      three: { x: 0.20, y: 0.72 },
      four:  { x: 0.50, y: 0.75 },
      five:  { x: 0.80, y: 0.75 },
    }},
  { id: 'family', label: 'Family Room', emoji: '👨‍👩‍👧',
    bg: 'from-rose-200 to-rose-400',
    decor: ['🖼️', '🛋️', '🪔'],
    words: ['mother','father','brother','sister','grandma','grandpa','baby','namaste','thankyou','dog'],
    objectPositions: {
      mother:   { x: 0.15, y: 0.25 },
      father:   { x: 0.40, y: 0.22 },
      brother:  { x: 0.65, y: 0.28 },
      sister:   { x: 0.85, y: 0.38 },
      grandma:  { x: 0.20, y: 0.55 },
      grandpa:  { x: 0.48, y: 0.50 },
      baby:     { x: 0.75, y: 0.60 },
      namaste:  { x: 0.30, y: 0.75 },
      thankyou: { x: 0.60, y: 0.78 },
      dog:      { x: 0.85, y: 0.72 },
    }},
  { id: 'courtyard', label: 'Courtyard', emoji: '🛕',
    bg: 'from-sky-200 to-blue-300',
    decor: ['🛕', '🌳'],
    words: ['car','bus','bicycle','auto','sun','moon','cloud','rain','star','road'],
    objectPositions: {
      car:     { x: 0.15, y: 0.60 },
      bus:     { x: 0.50, y: 0.58 },
      bicycle: { x: 0.80, y: 0.65 },
      auto:    { x: 0.30, y: 0.75 },
      sun:     { x: 0.85, y: 0.15 },
      moon:    { x: 0.18, y: 0.18 },
      cloud:   { x: 0.45, y: 0.20 },
      rain:    { x: 0.65, y: 0.30 },
      star:    { x: 0.72, y: 0.10 },
      road:    { x: 0.50, y: 0.85 },
    }},
];
```

- [ ] **Step 3: Add FRIENDS dictionary**

Append to `data.jsx`:

```javascript
// Named characters. wordRef ties a friend to a vocabulary word
// (so revealing "dog" in the Garden reveals Scooby specifically).
const FRIENDS = {
  kai:    { realName: 'Kailash', displayName: 'Kai',    role: 'brother', appearsIn: ['family'],             wordRef: 'brother' },
  scooby: { displayName: 'Scooby',                      role: 'dog',     appearsIn: ['garden','courtyard','family'], wordRef: 'dog' },
  aira:   { displayName: 'Aira',                        role: 'friend',  appearsIn: ['garden','bedroom'] },
  millie: { displayName: 'Millie',                      role: 'friend',  appearsIn: ['kitchen','bedroom'] },
  lila:   { displayName: 'Lila',                        role: 'friend',  appearsIn: ['bedroom','courtyard'] },
  priya:  { displayName: 'Priya',                       role: 'friend',  appearsIn: ['family','kitchen'] },
};
```

- [ ] **Step 4: Add STORIES array**

Append to `data.jsx`:

```javascript
const STORIES = [
  { id: 'birthday', title: "Kavya's Birthday Surprise",
    intro: "It's my sister's birthday! Help me get ready — we need a gift from the garden, a feast in the kitchen, and all my family together.",
    steps: [
      { scene: 'garden',  targetWords: ['flower','mango','butterfly','tree','peacock'] },
      { scene: 'kitchen', targetWords: ['milk','sugar','mango','rice','banana'] },
      { scene: 'family',  targetWords: ['sister','mother','father','brother','grandma'] },
    ],
    finale: 'cake-dance' },
  { id: 'scooby-lost', title: "Where is Scooby?",
    intro: "Oh no! Scooby ran off. Let's look in the garden, the courtyard, and the bedroom!",
    steps: [
      { scene: 'garden',    targetWords: ['tree','flower','butterfly','parrot','monkey'] },
      { scene: 'courtyard', targetWords: ['sun','cloud','road','car','star'] },
      { scene: 'bedroom',   targetWords: ['one','two','three','four','five'] },
    ],
    finale: 'scooby-reunion' },
  { id: 'missing-tiara', title: "The Missing Tiara",
    intro: "My tiara is missing! Let's search everywhere.",
    steps: [
      { scene: 'bedroom', targetWords: ['eye','nose','mouth','hand','foot'] },
      { scene: 'family',  targetWords: ['grandma','grandpa','mother','father','baby'] },
      { scene: 'garden',  targetWords: ['hibiscus','flower','tree','peacock','turtle'] },
    ],
    finale: 'tiara-found' },
  { id: 'friends-come-over', title: "Friends Come Over",
    intro: "Aira, Millie, Lila, and Priya are coming over! Let's get ready to play.",
    steps: [
      { scene: 'bedroom', targetWords: ['one','two','three','hand','foot'] },
      { scene: 'kitchen', targetWords: ['tea','banana','apple','water','chapati'] },
      { scene: 'garden',  targetWords: ['flower','butterfly','peacock','tree','mango'] },
    ],
    finale: 'friends-dance' },
  { id: 'festival-feast', title: "A Festival Feast",
    intro: "Today is a festival! Let's cook, gather the family, and enjoy fireworks.",
    steps: [
      { scene: 'kitchen',   targetWords: ['rice','chapati','milk','sugar','tea'] },
      { scene: 'family',    targetWords: ['mother','father','grandma','grandpa','baby'] },
      { scene: 'courtyard', targetWords: ['moon','star','cloud','road','bus'] },
    ],
    finale: 'fireworks' },
];
```

- [ ] **Step 5: Add a console load summary + quick content sanity log**

Append to `data.jsx`:

```javascript
// Content summary (visible in console on load).
console.log('[data.jsx] content v' + CONTENT_VERSION
  + ' — ' + Object.keys(WORDS).length + ' words'
  + ', ' + SCENES.length + ' scenes'
  + ', ' + Object.keys(FRIENDS).length + ' friends'
  + ', ' + STORIES.length + ' stories');
```

Remove the earlier stub `console.log('[data.jsx] loaded');` so only the new summary line fires.

- [ ] **Step 6: Verify**

Reload `index.html` in browser. Expected console output includes:
```
[data.jsx] content v2 — 50 words, 5 scenes, 6 friends, 5 stories
```
And no errors.

- [ ] **Step 7: Commit**

```bash
git add data.jsx
git commit -m "data: seed WORDS, SCENES, FRIENDS, STORIES for v2 content"
```

---

## Task 3: AudioManager (audio.jsx)

**Files:**
- Modify: `audio.jsx`

Port the existing Sarvam + browser-TTS pattern from `app-legacy.jsx:404-441` into a framework-free singleton, add a prefetch API so scenes can warm up the cache for the mission targets.

- [ ] **Step 1: Write AudioManager**

Replace `audio.jsx` entirely with:

```javascript
// audio.jsx — AudioManager: Sarvam TTS primary, browser TTS fallback.
// Exposed as global `AudioManager`.

const AudioManager = (() => {
  const LANG_MAP = { kannada: 'kn-IN', hindi: 'hi-IN', gujarati: 'gu-IN' };
  const DEFAULT_VOICE = 'priya';

  const cache = {};      // key "<langCode>:<text>:<voice>" -> data URL
  let currentAudio = null;
  let lastSourceListener = null; // optional UI callback: (src) => void, src ∈ 'sarvam' | 'browser'

  const notify = (src) => { if (lastSourceListener) lastSourceListener(src); };

  const speakWithBrowserTTS = (text, lang) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG_MAP[lang] || 'hi-IN';
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
    notify('browser');
  };

  const fetchSarvam = async (text, langCode, voice) => {
    const res = await fetch('/.netlify/functions/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language_code: langCode, speaker: voice }),
    });
    if (!res.ok) throw new Error('tts proxy ' + res.status);
    const data = await res.json();
    return `data:audio/mp3;base64,${data.audio}`;
  };

  const playUrl = (url) => {
    try { if (currentAudio) { currentAudio.pause(); currentAudio = null; } } catch (e) {}
    const a = new Audio(url);
    currentAudio = a;
    return a.play();
  };

  const speak = async (text, lang, { voice = DEFAULT_VOICE } = {}) => {
    const langCode = LANG_MAP[lang];
    if (!langCode || !text) return;
    const key = `${langCode}:${text}:${voice}`;
    if (cache[key]) {
      try { await playUrl(cache[key]); notify('sarvam'); return; }
      catch (e) { speakWithBrowserTTS(text, lang); return; }
    }
    try {
      const url = await fetchSarvam(text, langCode, voice);
      cache[key] = url;
      await playUrl(url);
      notify('sarvam');
    } catch (e) {
      speakWithBrowserTTS(text, lang);
    }
  };

  // Prefetch an array of { text, lang } objects. Fire-and-forget.
  const prefetch = (items, { voice = DEFAULT_VOICE } = {}) => {
    items.forEach(({ text, lang }) => {
      const langCode = LANG_MAP[lang];
      if (!langCode || !text) return;
      const key = `${langCode}:${text}:${voice}`;
      if (cache[key]) return;
      fetchSarvam(text, langCode, voice).then(url => { cache[key] = url; }).catch(() => {});
    });
  };

  const setSourceListener = (fn) => { lastSourceListener = fn; };
  const stop = () => { try { if (currentAudio) currentAudio.pause(); } catch (e) {} currentAudio = null; };

  return { speak, prefetch, setSourceListener, stop, LANG_MAP };
})();

console.log('[audio.jsx] AudioManager ready');
```

- [ ] **Step 2: Manual verification**

Open `index.html`. In the browser console, run:

```javascript
AudioManager.speak('ಆನೆ', 'kannada');
```

Expected (when deployed to Netlify, or locally if you set `SARVAM_API_KEY` and run `netlify dev`): Sarvam audio plays "aane". If the proxy is unreachable (e.g., plain `file://`), browser TTS fallback speaks it instead. Either is a pass for this task.

Also run:
```javascript
AudioManager.prefetch([{text:'ಆನೆ',lang:'kannada'},{text:'ನವಿಲು',lang:'kannada'}]);
```
Expected: no visible effect; no console errors.

- [ ] **Step 3: Commit**

```bash
git add audio.jsx
git commit -m "audio: AudioManager with Sarvam primary + browser TTS fallback + prefetch"
```

---

## Task 4: ProgressStore with in-browser test runner (engines.jsx)

**Files:**
- Modify: `engines.jsx`

- [ ] **Step 1: Write test runner scaffolding**

Replace `engines.jsx` with:

```javascript
// engines.jsx — MissionEngine, StoryEngine, ProgressStore + in-browser tests.

// -- Test runner (append tests via __test(name, fn); open index.html?test=1 to run) --
const __TESTS = [];
const __test = (name, fn) => __TESTS.push({ name, fn });
const __assert = (cond, msg) => { if (!cond) throw new Error(msg || 'assertion failed'); };
const __assertEq = (a, b, msg) => {
  const sa = JSON.stringify(a), sb = JSON.stringify(b);
  if (sa !== sb) throw new Error((msg || 'not equal') + `: ${sa} !== ${sb}`);
};
const __runTests = () => {
  let pass = 0, fail = 0;
  __TESTS.forEach(({ name, fn }) => {
    try { fn(); console.log('%c✓ ' + name, 'color:#4caf50'); pass++; }
    catch (e) { console.error('✗ ' + name + ': ' + e.message); fail++; }
  });
  console.log(`%c${pass} passed, ${fail} failed`, 'font-weight:bold');
};
if (new URLSearchParams(location.search).get('test') === '1') {
  window.addEventListener('DOMContentLoaded', __runTests);
}
```

- [ ] **Step 2: Write failing tests for ProgressStore**

Append:

```javascript
// -- ProgressStore --
// Wraps localStorage for app progress. Handles v1 -> v2 migration.

__test('ProgressStore: fresh install returns v2 defaults', () => {
  localStorage.removeItem('indianLanguagesProgress');
  const s = ProgressStore.load();
  __assertEq(s.version, 2);
  __assertEq(s.stars, 0);
  __assertEq(s.language, 'kannada');
  __assertEq(s.wordsRevealed, { kannada: {}, hindi: {}, gujarati: {} });
});

__test('ProgressStore: addStars persists', () => {
  localStorage.removeItem('indianLanguagesProgress');
  ProgressStore.load();
  ProgressStore.addStars(3);
  ProgressStore.addStars(2);
  __assertEq(ProgressStore.load().stars, 5);
});

__test('ProgressStore: recordReveal increments per-language count', () => {
  localStorage.removeItem('indianLanguagesProgress');
  ProgressStore.load();
  ProgressStore.recordReveal('elephant', 'kannada');
  ProgressStore.recordReveal('elephant', 'kannada');
  ProgressStore.recordReveal('elephant', 'hindi');
  const s = ProgressStore.load();
  __assertEq(s.wordsRevealed.kannada.elephant, 2);
  __assertEq(s.wordsRevealed.hindi.elephant, 1);
});

__test('ProgressStore: v1 -> v2 migration carries stars + marks revealed words', () => {
  localStorage.setItem('indianLanguagesProgress', JSON.stringify({
    progress: { 'animals-0': true, 'animals-1': true },
    totalStars: 12,
  }));
  const s = ProgressStore.load();
  __assertEq(s.version, 2);
  __assertEq(s.stars, 12);
});
```

- [ ] **Step 3: Verify tests fail**

Open `index.html?test=1`. Expected: 4 red "✗ ProgressStore..." errors (ProgressStore undefined).

- [ ] **Step 4: Implement ProgressStore**

Append to `engines.jsx`:

```javascript
const ProgressStore = (() => {
  const KEY = 'indianLanguagesProgress';
  const OLD_KEY = 'kannadaHindiProgress';

  const makeDefaults = () => ({
    version: 2,
    stars: 0,
    language: 'kannada',
    wordsRevealed: { kannada: {}, hindi: {}, gujarati: {} },
    sceneVisits: {},
    storiesCompleted: {},
    lastActive: new Date().toISOString().slice(0, 10),
    dailyStreak: 0,
  });

  let cache = null;

  const migrate = (raw) => {
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      if (obj && obj.version === 2) return obj;
      // v1 shape: { progress: {cat-idx: true}, totalStars: N }
      const migrated = makeDefaults();
      if (typeof obj.totalStars === 'number') migrated.stars = obj.totalStars;
      return migrated;
    } catch (e) { return null; }
  };

  const save = () => { localStorage.setItem(KEY, JSON.stringify(cache)); };

  const load = () => {
    const raw = localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY);
    cache = migrate(raw) || makeDefaults();
    save();
    return { ...cache };
  };

  const get = () => cache ? { ...cache } : load();

  const addStars = (n) => { if (!cache) load(); cache.stars += n; save(); };

  const recordReveal = (wordId, lang) => {
    if (!cache) load();
    if (!cache.wordsRevealed[lang]) cache.wordsRevealed[lang] = {};
    cache.wordsRevealed[lang][wordId] = (cache.wordsRevealed[lang][wordId] || 0) + 1;
    save();
  };

  const recordSceneVisit = (sceneId) => {
    if (!cache) load();
    cache.sceneVisits[sceneId] = (cache.sceneVisits[sceneId] || 0) + 1;
    save();
  };

  const markStoryComplete = (storyId) => {
    if (!cache) load();
    cache.storiesCompleted[storyId] = new Date().toISOString().slice(0, 10);
    save();
  };

  const setLanguage = (lang) => { if (!cache) load(); cache.language = lang; save(); };

  const touchDailyActive = () => {
    if (!cache) load();
    const today = new Date().toISOString().slice(0, 10);
    if (cache.lastActive === today) return;
    const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    cache.dailyStreak = cache.lastActive === y ? (cache.dailyStreak + 1) : 1;
    cache.lastActive = today;
    save();
  };

  return { load, get, addStars, recordReveal, recordSceneVisit, markStoryComplete, setLanguage, touchDailyActive };
})();
```

- [ ] **Step 5: Verify tests pass**

Reload `index.html?test=1`. Expected: 4 green "✓ ProgressStore..." lines and "4 passed, 0 failed".

- [ ] **Step 6: Commit**

```bash
git add engines.jsx
git commit -m "engines: ProgressStore with v1→v2 migration + in-browser test runner"
```

---

## Task 5: MissionEngine

**Files:**
- Modify: `engines.jsx`

- [ ] **Step 1: Write failing tests**

Append to `engines.jsx`:

```javascript
// -- MissionEngine --

__test('MissionEngine: pickMission returns 5 words from scene pool', () => {
  const m = MissionEngine.pickMission('garden');
  __assert(m.targets.length === 5, 'expected 5 targets');
  const pool = SCENES.find(s => s.id === 'garden').words;
  m.targets.forEach(t => __assert(pool.includes(t), t + ' not in pool'));
});

__test('MissionEngine: story-driven mission uses story target words', () => {
  const storyStep = { scene: 'garden', targetWords: ['flower','mango','butterfly','tree','peacock'] };
  const m = MissionEngine.pickMission('garden', storyStep);
  __assertEq(m.targets.slice().sort(), ['butterfly','flower','mango','peacock','tree']);
});

__test('MissionEngine: advance cycles through targets and completes', () => {
  const m = MissionEngine.pickMission('garden');
  const seen = [];
  for (let i = 0; i < 5; i++) { seen.push(m.currentTarget()); m.advance(); }
  __assertEq(seen.length, 5);
  __assert(m.isComplete(), 'should be complete after 5 advances');
});

__test('MissionEngine: wrong-reveal does not advance', () => {
  const m = MissionEngine.pickMission('garden');
  const target = m.currentTarget();
  const wrong = SCENES.find(s => s.id === 'garden').words.find(w => w !== target);
  const advanced = m.tryReveal(wrong);
  __assert(advanced === false, 'tryReveal with wrong word should return false');
  __assertEq(m.currentTarget(), target);
});
```

- [ ] **Step 2: Verify tests fail**

Reload `index.html?test=1`. Expected: 4 new red MissionEngine errors.

- [ ] **Step 3: Implement MissionEngine**

Append to `engines.jsx`:

```javascript
const MissionEngine = (() => {
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const pickMission = (sceneId, storyStep = null) => {
    const scene = SCENES.find(s => s.id === sceneId);
    if (!scene) throw new Error('unknown scene ' + sceneId);
    let targets;
    if (storyStep && storyStep.scene === sceneId && Array.isArray(storyStep.targetWords)) {
      targets = storyStep.targetWords.slice(0, 5);
    } else {
      targets = shuffle(scene.words).slice(0, 5);
    }
    let idx = 0;
    return {
      sceneId,
      targets,
      currentTarget: () => targets[idx] || null,
      advance: () => { idx = Math.min(idx + 1, targets.length); },
      isComplete: () => idx >= targets.length,
      tryReveal: (wordId) => {
        if (targets[idx] === wordId) { idx += 1; return true; }
        return false;
      },
      index: () => idx,
    };
  };

  return { pickMission };
})();
```

- [ ] **Step 4: Verify tests pass**

Reload `index.html?test=1`. Expected: all MissionEngine tests green.

- [ ] **Step 5: Commit**

```bash
git add engines.jsx
git commit -m "engines: MissionEngine with shuffled missions + story overrides"
```

---

## Task 6: StoryEngine

**Files:**
- Modify: `engines.jsx`

- [ ] **Step 1: Write failing tests**

Append to `engines.jsx`:

```javascript
// -- StoryEngine --

__test('StoryEngine: todayStory returns a story from the library', () => {
  const s = StoryEngine.todayStory();
  __assert(STORIES.some(x => x.id === s.id), 'today story not in library');
});

__test('StoryEngine: todayStory is day-stable within the same day', () => {
  const a = StoryEngine.todayStory().id;
  const b = StoryEngine.todayStory().id;
  __assertEq(a, b);
});

__test('StoryEngine: session tracks step progression', () => {
  const story = STORIES[0];
  const sess = StoryEngine.newSession(story.id);
  __assertEq(sess.currentStep().scene, story.steps[0].scene);
  sess.advance();
  __assertEq(sess.currentStep().scene, story.steps[1].scene);
  sess.advance(); sess.advance();
  __assert(sess.isComplete(), 'session should be complete after all steps');
});
```

- [ ] **Step 2: Verify tests fail**

Reload `index.html?test=1`. Expected: 3 StoryEngine errors.

- [ ] **Step 3: Implement StoryEngine**

Append to `engines.jsx`:

```javascript
const StoryEngine = (() => {
  // Simple string-hash seed for day-stable selection.
  const hashStr = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  };

  const todayStory = () => {
    const idx = hashStr(new Date().toDateString()) % STORIES.length;
    return STORIES[idx];
  };

  const newSession = (storyId) => {
    const story = STORIES.find(s => s.id === storyId);
    if (!story) throw new Error('unknown story ' + storyId);
    let step = 0;
    return {
      storyId,
      story,
      currentStep: () => story.steps[step] || null,
      stepIndex: () => step,
      totalSteps: () => story.steps.length,
      advance: () => { step = Math.min(step + 1, story.steps.length); },
      isComplete: () => step >= story.steps.length,
      intro: () => story.intro,
      title: () => story.title,
      finale: () => story.finale,
    };
  };

  return { todayStory, newSession };
})();
```

- [ ] **Step 4: Verify tests pass**

Reload `index.html?test=1`. Expected all green.

- [ ] **Step 5: Commit**

```bash
git add engines.jsx
git commit -m "engines: StoryEngine with day-stable today() and stepping sessions"
```

---

## Task 7: Shared UI primitives — KavyaAvatar, SpeechBubble, StarCounter, BackButton, LangPicker

**Files:**
- Modify: `components.jsx`

- [ ] **Step 1: Replace components.jsx with the UI primitive set**

Replace the stub with:

```javascript
// components.jsx — shared UI primitives.
const { useState, useEffect, useRef } = React;

// KavyaAvatar — the princess companion. v1 = emoji with frame + animation state.
const KavyaAvatar = ({ state = 'idle', size = 80, className = '' }) => {
  const animClass = state === 'wave'     ? 'kavya-wave'
                  : state === 'celebrate'? 'kavya-dance'
                  : state === 'dance'    ? 'kavya-dance'
                  : '';
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-yellow-100 shadow-lg ${className}`}
      style={{ width: size, height: size, animation: animClass ? `${animClass} 800ms ease-in-out infinite` : 'none' }}
      aria-label="Kavya"
    >
      <span style={{ fontSize: size * 0.75 }}>👸🏽</span>
    </div>
  );
};

// SpeechBubble — positioned next to Kavya. Supports English prompt + native-script line.
const SpeechBubble = ({ english, native, className = '' }) => (
  <div className={`bg-white rounded-3xl px-4 py-3 shadow-lg max-w-xs ${className}`} style={{ animation: 'pop-in 240ms ease-out' }}>
    {english && <div className="text-sm font-semibold text-gray-800">{english}</div>}
    {native && <div className="text-2xl font-bold text-purple-700 mt-1">{native}</div>}
  </div>
);

// StarCounter — top-right badge.
const StarCounter = ({ count }) => (
  <div className="bg-white/90 rounded-full px-3 py-1 shadow font-bold text-sm flex items-center gap-1">
    <span>⭐</span><span>{count}</span>
  </div>
);

// BackButton — top-left, big touch target, navigates home.
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-white/90 rounded-full w-16 h-16 shadow-lg flex items-center justify-center text-3xl active:scale-95 transition-transform"
    aria-label="Back to Palace"
  >🏰</button>
);

// LangPicker — switches chosen language.
const LangPicker = ({ value, onChange }) => {
  const LANGS = [
    { id: 'kannada',  label: '🇮🇳 ಕನ್ನಡ' },
    { id: 'hindi',    label: '🇮🇳 हिन्दी' },
    { id: 'gujarati', label: '🇮🇳 ગુજરાતી' },
  ];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/90 rounded-full px-4 py-2 shadow font-bold text-sm"
    >
      {LANGS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
    </select>
  );
};

console.log('[components.jsx] primitives ready');
```

- [ ] **Step 2: Manual verification harness**

Temporarily extend the root in `app.jsx` to render the primitives. Replace the current `LanguageLearningApp` body with:

```javascript
const LanguageLearningApp = () => {
  const [lang, setLang] = useState('kannada');
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-200 via-yellow-100 to-green-200">
      <div className="flex justify-between">
        <BackButton onClick={() => alert('back')} />
        <div className="flex gap-2">
          <LangPicker value={lang} onChange={setLang} />
          <StarCounter count={42} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mt-12">
        <KavyaAvatar state="wave" size={120} />
        <SpeechBubble english="Namaste! Let's play!" native="ನಮಸ್ಕಾರ 👋" />
      </div>
    </div>
  );
};
```

Reload `index.html`. Expected: Back button (🏰) top-left, language picker + star counter top-right, Kavya emoji in a waving frame, speech bubble below showing English + Kannada text. Changing language picker has no effect yet (expected).

- [ ] **Step 3: Commit**

```bash
git add components.jsx app.jsx
git commit -m "components: KavyaAvatar, SpeechBubble, LangPicker, StarCounter, BackButton"
```

---

## Task 8: Wand + SparkleLayer with collision API

**Files:**
- Modify: `components.jsx`

- [ ] **Step 1: Implement Wand and SparkleLayer**

Append to `components.jsx` (before the final `console.log`):

```javascript
// SparkleLayer — renders a pool of absolutely-positioned sparkle spans driven by CSS animation.
// API: ref.emit(x, y) queues a particle at page coords within the layer's bounding box.
const SparkleLayer = React.forwardRef((props, ref) => {
  const [particles, setParticles] = useState([]);
  const nextId = useRef(0);
  React.useImperativeHandle(ref, () => ({
    emit: (x, y) => {
      const id = nextId.current++;
      const dx = (Math.random() - 0.5) * 40;
      const dy = -20 - Math.random() * 30;
      setParticles(p => [...p, { id, x, y, dx, dy }]);
      setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 700);
    },
    burst: (x, y, n = 8) => {
      for (let i = 0; i < n; i++) {
        setTimeout(() => {
          const id = nextId.current++;
          const a = (Math.PI * 2 * i) / n;
          const dx = Math.cos(a) * 40;
          const dy = Math.sin(a) * 40 - 10;
          setParticles(p => [...p, { id, x, y, dx, dy }]);
          setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 700);
        }, i * 15);
      }
    },
  }), []);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map(pt => (
        <span
          key={pt.id}
          style={{
            position: 'absolute',
            left: pt.x, top: pt.y,
            fontSize: 20,
            '--dx': pt.dx + 'px',
            '--dy': pt.dy + 'px',
            animation: 'sparkle-float 700ms ease-out forwards',
          }}
        >✨</span>
      ))}
    </div>
  );
});

// Wand — follows pointer within a parent element. Calls onMove({x,y}) in local (parent) coordinates.
// Caller handles collision (only Wand knows position; parent provides hit-test via onMove).
const Wand = ({ parentRef, sparkleRef, onMove, onDown, onUp }) => {
  const [pos, setPos] = useState({ x: -100, y: -100, visible: false });
  const lastEmit = useRef(0);

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    const toLocal = (clientX, clientY) => {
      const r = el.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    };

    const handleMove = (clientX, clientY) => {
      const { x, y } = toLocal(clientX, clientY);
      setPos({ x, y, visible: true });
      const now = performance.now();
      if (now - lastEmit.current > 40 && sparkleRef.current) {
        sparkleRef.current.emit(x, y);
        lastEmit.current = now;
      }
      if (onMove) onMove({ x, y });
    };

    const onPointerDown = (e) => { if (onDown) onDown(); handleMove(e.clientX, e.clientY); };
    const onPointerMove = (e) => { if (e.buttons || e.pointerType === 'touch') handleMove(e.clientX, e.clientY); };
    const onPointerUp   = () => { if (onUp) onUp(); setPos(p => ({ ...p, visible: false })); };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup',   onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('pointerleave', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup',   onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('pointerleave', onPointerUp);
    };
  }, [parentRef, sparkleRef, onMove, onDown, onUp]);

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: pos.x - 20, top: pos.y - 20,
        opacity: pos.visible ? 1 : 0,
        transition: 'opacity 120ms',
        fontSize: 40,
        textShadow: '0 0 10px gold',
      }}
    >🪄</div>
  );
};
```

- [ ] **Step 2: Manual verification harness**

Replace the `LanguageLearningApp` body in `app.jsx` with:

```javascript
const LanguageLearningApp = () => {
  const parentRef = useRef(null);
  const sparkleRef = useRef(null);
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-200 to-green-400">
      <div
        ref={parentRef}
        className="relative w-full max-w-2xl h-[500px] mx-auto bg-white/30 rounded-3xl overflow-hidden touch-none"
      >
        <SparkleLayer ref={sparkleRef} />
        <Wand parentRef={parentRef} sparkleRef={sparkleRef} onMove={({x,y}) => console.log('wand@', x.toFixed(0), y.toFixed(0))} />
        <div className="absolute bottom-4 left-4"><KavyaAvatar /></div>
      </div>
    </div>
  );
};
```

Reload `index.html`. Expected:
- Dragging the pointer inside the white box shows a wand emoji following it.
- Sparkle particles emit at ~25Hz, each floats up and fades.
- Leaving/lifting hides the wand.
- Console logs `wand@ x y` (throttled via the emit cadence, but present).

- [ ] **Step 3: Commit**

```bash
git add components.jsx app.jsx
git commit -m "components: Wand + SparkleLayer with pointer tracking and particle pool"
```

---

## Task 9: Scene component (no story integration yet)

**Files:**
- Modify: `scenes.jsx`

- [ ] **Step 1: Implement Scene with mission, wand collision, and reveal animation**

Replace `scenes.jsx` with:

```javascript
// scenes.jsx — Scene shell and (later) PalaceHub.
const { useState, useEffect, useRef, useMemo } = React;

// --- helpers ---
const wordNative = (wordId, lang) => {
  const w = WORDS[wordId];
  if (!w) return { text: '', sound: '' };
  return { text: w[lang], sound: w[lang + 'Sound'] };
};

const HIT_RADIUS = 60; // px — generous for a 4yo

// --- Scene ---
// Props: sceneId, lang, storyStep (nullable), onExit, onMissionComplete
const Scene = ({ sceneId, lang, storyStep = null, onExit, onMissionComplete }) => {
  const scene = useMemo(() => SCENES.find(s => s.id === sceneId), [sceneId]);
  const parentRef = useRef(null);
  const sparkleRef = useRef(null);
  const mission = useMemo(() => MissionEngine.pickMission(sceneId, storyStep), [sceneId, storyStep]);
  const [revealed, setRevealed] = useState(() => new Set());
  const [currentTarget, setCurrentTarget] = useState(mission.currentTarget());
  const [kavyaState, setKavyaState] = useState('wave');
  const [bubbleEnglish, setBubbleEnglish] = useState(`Can you find the ${WORDS[mission.currentTarget()].english.toLowerCase()}?`);
  const [boxSize, setBoxSize] = useState({ w: 0, h: 0 });

  // Prefetch mission audio on mount.
  useEffect(() => {
    ProgressStore.recordSceneVisit(sceneId);
    const items = mission.targets.map(w => ({ text: WORDS[w][lang], lang }));
    AudioManager.prefetch(items);
    AudioManager.speak(WORDS[mission.currentTarget()][lang], lang);
  }, []); // eslint-disable-line

  // Track parent size so object positions map from fractions to px.
  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setBoxSize({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Position helper.
  const posOf = (wordId) => {
    const p = scene.objectPositions[wordId] || { x: 0.5, y: 0.5 };
    return { x: p.x * boxSize.w, y: p.y * boxSize.h };
  };

  const revealWord = (wordId) => {
    if (revealed.has(wordId)) { AudioManager.speak(WORDS[wordId][lang], lang); return; }
    setRevealed(prev => { const n = new Set(prev); n.add(wordId); return n; });
    ProgressStore.recordReveal(wordId, lang);
    AudioManager.speak(WORDS[wordId][lang], lang);
    const { x, y } = posOf(wordId);
    if (sparkleRef.current) sparkleRef.current.burst(x, y, 12);

    const advanced = mission.tryReveal(wordId);
    if (advanced) {
      setKavyaState('celebrate');
      ProgressStore.addStars(1);
      setTimeout(() => {
        if (mission.isComplete()) {
          setBubbleEnglish('Yay! Well done!');
          setKavyaState('dance');
          ProgressStore.addStars(3);
          setTimeout(() => { if (onMissionComplete) onMissionComplete(); }, 1500);
        } else {
          const nt = mission.currentTarget();
          setCurrentTarget(nt);
          setBubbleEnglish(`Now find the ${WORDS[nt].english.toLowerCase()}!`);
          setKavyaState('wave');
          AudioManager.speak(WORDS[nt][lang], lang);
        }
      }, 300);
    } else {
      setBubbleEnglish(`Oh, a ${WORDS[wordId].english.toLowerCase()}! But I still need the ${WORDS[mission.currentTarget()].english.toLowerCase()}!`);
    }
  };

  const handleMove = ({ x, y }) => {
    for (const wordId of scene.words) {
      if (revealed.has(wordId)) continue;
      const p = posOf(wordId);
      const dx = x - p.x, dy = y - p.y;
      if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) {
        revealWord(wordId);
        break;
      }
    }
  };

  const target = currentTarget && WORDS[currentTarget];
  const nativeTarget = target ? `${target.emoji} ${target[lang]}` : '';

  return (
    <div className={`relative w-full h-screen bg-gradient-to-b ${scene.bg} overflow-hidden select-none touch-none`}>
      <div className="absolute top-4 left-4 z-20"><BackButton onClick={onExit} /></div>
      <div className="absolute top-4 right-4 z-20 flex gap-2 items-center">
        <StarCounter count={ProgressStore.get().stars} />
      </div>

      {/* Decor */}
      <div className="absolute inset-0 pointer-events-none">
        {scene.decor.map((emoji, i) => (
          <span key={i} className="absolute text-5xl opacity-70" style={{ top: `${10 + i*8}%`, left: `${85 - i*70}%` }}>{emoji}</span>
        ))}
      </div>

      {/* Object layer */}
      <div ref={parentRef} className="absolute inset-0">
        <SparkleLayer ref={sparkleRef} />
        {scene.words.map(wordId => {
          const p = posOf(wordId);
          const isRevealed = revealed.has(wordId);
          return (
            <div
              key={wordId}
              onClick={() => revealWord(wordId)}
              className="absolute cursor-pointer"
              style={{
                left: p.x - 40, top: p.y - 40, width: 80, height: 80,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 54,
                opacity: isRevealed ? 1 : 0.25,
                filter: isRevealed ? 'none' : 'grayscale(1)',
                animation: isRevealed ? 'reveal-bounce 400ms ease-out' : 'none',
                transition: 'opacity 200ms',
              }}
            >{WORDS[wordId].emoji}</div>
          );
        })}
        <Wand parentRef={parentRef} sparkleRef={sparkleRef} onMove={handleMove} />
      </div>

      {/* Kavya + speech */}
      <div className="absolute bottom-4 left-4 z-10 flex items-end gap-3">
        <KavyaAvatar state={kavyaState} size={100} />
        <SpeechBubble english={bubbleEnglish} native={nativeTarget} className="mb-4" />
      </div>
    </div>
  );
};

console.log('[scenes.jsx] Scene ready');
```

- [ ] **Step 2: Manual verification harness**

Replace `LanguageLearningApp` in `app.jsx` with:

```javascript
const LanguageLearningApp = () => {
  const [view, setView] = useState('scene');
  useEffect(() => { ProgressStore.load(); }, []);
  if (view === 'scene') {
    return <Scene sceneId="garden" lang="kannada" onExit={() => setView('done')} onMissionComplete={() => setView('done')} />;
  }
  return <div className="min-h-screen flex items-center justify-center text-3xl">✅ Mission complete or exited</div>;
};
```

Reload `index.html`. Expected:
- Garden scene loads with 10 faded objects and Kavya at bottom-left with a speech bubble naming the first target (e.g., "Can you find the elephant?" + "🐘 ಆನೆ").
- Dragging the wand near an object lights it up (color bounce + sparkle burst) and audio plays in Kannada.
- Revealing the target word advances Rani's prompt to the next target.
- Revealing a non-target word redirects ("Oh, a X! But I still need the Y!") without advancing.
- Revealing all 5 targets triggers "Yay! Well done!" and then the "Mission complete or exited" screen.
- Tapping a revealed object replays its audio.
- Star counter increments as reveals happen; reloading preserves it.

- [ ] **Step 3: Commit**

```bash
git add scenes.jsx app.jsx
git commit -m "scenes: Scene shell with mission, wand collision, reveal animations, audio"
```

---

## Task 10: PalaceHub

**Files:**
- Modify: `scenes.jsx`

- [ ] **Step 1: Implement PalaceHub**

Append to `scenes.jsx` (before the final `console.log`):

```javascript
// PalaceHub — home screen with 5 scene tiles, Kavya greeter, language picker, stars.
// Props: lang, onLangChange, onEnterScene(sceneId), todayStory (nullable), onEnterStory
const PalaceHub = ({ lang, onLangChange, onEnterScene, todayStory, onEnterStory }) => {
  const stars = ProgressStore.get().stars;
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-amber-100 to-green-200 p-4 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <LangPicker value={lang} onChange={onLangChange} />
        <StarCounter count={stars} />
      </div>

      <div className="flex justify-center mt-4">
        <div className="text-8xl" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>🏰</div>
      </div>

      {todayStory && (
        <div
          onClick={onEnterStory}
          className="mt-4 mx-auto max-w-md bg-white rounded-2xl shadow-lg p-4 cursor-pointer active:scale-95 transition-transform"
        >
          <div className="text-xs font-bold text-purple-600 uppercase tracking-wide">Today's Story</div>
          <div className="text-lg font-bold text-gray-800 mt-1">{todayStory.title}</div>
          <div className="text-sm text-gray-600 mt-1">{todayStory.intro}</div>
          <div className="text-sm font-bold text-purple-600 mt-2">Tap to begin →</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
        {SCENES.map(s => (
          <button
            key={s.id}
            onClick={() => onEnterScene(s.id)}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center active:scale-95 transition-transform"
            style={{ minHeight: 120 }}
          >
            <div className="text-5xl">{s.emoji}</div>
            <div className="mt-2 font-bold text-gray-800">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 flex items-end gap-3">
        <KavyaAvatar state="wave" size={96} />
        <SpeechBubble english="Namaste! Where to?" native={wordNative('namaste', lang).text} className="mb-4" />
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Manual verification harness**

Replace `LanguageLearningApp` in `app.jsx`:

```javascript
const LanguageLearningApp = () => {
  const [lang, setLang] = useState('kannada');
  useEffect(() => { ProgressStore.load(); }, []);
  return (
    <PalaceHub
      lang={lang}
      onLangChange={(l) => { setLang(l); ProgressStore.setLanguage(l); }}
      onEnterScene={(id) => alert('enter ' + id)}
      todayStory={StoryEngine.todayStory()}
      onEnterStory={() => alert('story: ' + StoryEngine.todayStory().title)}
    />
  );
};
```

Reload `index.html`. Expected:
- Palace emoji top-center.
- "Today's Story" card with the day-stable title (same on reload same day).
- 5 scene tiles in a 2-col grid; tapping one alerts "enter <sceneId>".
- Language picker + star counter in top corners.
- Kavya avatar at bottom-left with speech bubble saying "Namaste!" + native-script equivalent.

- [ ] **Step 3: Commit**

```bash
git add scenes.jsx app.jsx
git commit -m "scenes: PalaceHub with scene tiles, today's story card, Kavya greeter"
```

---

## Task 11: Wire LanguageLearningApp — hub + scene routing + language persistence

**Files:**
- Modify: `app.jsx`

- [ ] **Step 1: Implement routing and persistence**

Replace the content of `app.jsx` (after the initial `const { useState, useEffect } = React;` line) with:

```javascript
const LanguageLearningApp = () => {
  const [view, setView] = useState('hub');             // 'hub' | 'scene:<id>'
  const [lang, setLang] = useState('kannada');
  const [bump, setBump] = useState(0);                  // forces re-render after ProgressStore mutations outside React

  useEffect(() => {
    const s = ProgressStore.load();
    setLang(s.language || 'kannada');
    ProgressStore.touchDailyActive();
  }, []);

  const changeLang = (l) => {
    setLang(l);
    ProgressStore.setLanguage(l);
    setBump(b => b + 1);
  };

  const enterScene = (id) => setView('scene:' + id);
  const exitScene  = () => { setBump(b => b + 1); setView('hub'); };

  if (view.startsWith('scene:')) {
    const sceneId = view.slice('scene:'.length);
    return (
      <Scene
        sceneId={sceneId}
        lang={lang}
        onExit={exitScene}
        onMissionComplete={exitScene}
      />
    );
  }

  return (
    <PalaceHub
      key={bump}
      lang={lang}
      onLangChange={changeLang}
      onEnterScene={enterScene}
      todayStory={StoryEngine.todayStory()}
      onEnterStory={() => alert('Story flow wires up in Task 13')}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] root mounted');
```

- [ ] **Step 2: Manual verification**

Reload `index.html`. Expected:
- App opens on PalaceHub.
- Tapping any scene tile routes into that scene.
- Completing the mission OR tapping the 🏰 back button returns to hub.
- Star counter on hub reflects accumulated stars.
- Changing language picker, entering a scene: audio plays in the newly picked language.
- Reloading the page preserves language and star count.

- [ ] **Step 3: Commit**

```bash
git add app.jsx
git commit -m "app: wire hub↔scene routing, language persistence, daily-active stamp"
```

---

## Task 12: Story cutscenes (intro & finale) and StoryEngine wiring

**Files:**
- Modify: `scenes.jsx` (add StoryIntro, StoryFinale), `app.jsx` (add story view states)

- [ ] **Step 1: Add StoryIntro and StoryFinale components**

Append to `scenes.jsx` (before the final `console.log`):

```javascript
// StoryIntro — opens with Kavya speaking the story setup; "Let's start!" advances.
const StoryIntro = ({ story, lang, onBegin, onSkip }) => (
  <div className="min-h-screen bg-gradient-to-b from-purple-300 to-pink-300 flex flex-col items-center justify-center p-6">
    <div className="text-8xl mb-6">👸🏽</div>
    <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg text-center">
      <div className="text-xs font-bold uppercase tracking-widest text-purple-600">Today's Story</div>
      <h2 className="text-2xl font-bold mt-2">{story.title}</h2>
      <p className="mt-3 text-gray-700 leading-relaxed">{story.intro}</p>
      <div className="mt-5 flex flex-col gap-3">
        <button
          onClick={onBegin}
          className="bg-purple-600 text-white font-bold py-4 px-6 rounded-full shadow-lg active:scale-95 transition-transform text-lg"
        >Let's start! ✨</button>
        <button
          onClick={onSkip}
          className="text-purple-600 font-semibold py-2"
        >Maybe later</button>
      </div>
    </div>
  </div>
);

// StoryFinale — plays after last story step. Uses story.finale as a lightweight scene tag.
const FINALES = {
  'cake-dance':      { emoji: '🎂', line: "We made it! Happy birthday!",    bg: 'from-pink-300 to-yellow-200' },
  'scooby-reunion':  { emoji: '🐕', line: "Scooby! I found you!",           bg: 'from-amber-200 to-green-200' },
  'tiara-found':     { emoji: '👑', line: "My tiara! You found it!",         bg: 'from-yellow-200 to-purple-200' },
  'friends-dance':   { emoji: '💃', line: "Let's all dance together!",      bg: 'from-pink-200 to-blue-200' },
  'fireworks':       { emoji: '🎆', line: "Look at the fireworks!",          bg: 'from-indigo-300 to-purple-400' },
};

const StoryFinale = ({ story, onDone }) => {
  const f = FINALES[story.finale] || { emoji: '🎉', line: 'Hooray!', bg: 'from-pink-200 to-yellow-100' };
  useEffect(() => {
    ProgressStore.addStars(10);
    ProgressStore.markStoryComplete(story.id);
  }, []); // eslint-disable-line
  return (
    <div className={`min-h-screen bg-gradient-to-b ${f.bg} flex flex-col items-center justify-center p-6`}>
      <div className="text-9xl" style={{ animation: 'pop-in 500ms ease-out' }}>{f.emoji}</div>
      <div className="mt-6 bg-white rounded-3xl shadow-xl p-5 max-w-md text-center">
        <div className="text-2xl font-bold text-gray-800">{story.title}</div>
        <div className="text-gray-700 mt-2 text-lg">{f.line}</div>
        <div className="mt-4 text-purple-600 font-bold">+10 ⭐</div>
        <button
          onClick={onDone}
          className="mt-4 bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow active:scale-95 transition-transform"
        >Back to Palace</button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Wire story states into LanguageLearningApp**

Replace `LanguageLearningApp` in `app.jsx` with:

```javascript
const LanguageLearningApp = () => {
  const [view, setView] = useState('hub');     // 'hub' | 'story-intro' | 'scene:<id>' | 'story-finale'
  const [lang, setLang] = useState('kannada');
  const [bump, setBump] = useState(0);
  const [storySession, setStorySession] = useState(null);

  useEffect(() => {
    const s = ProgressStore.load();
    setLang(s.language || 'kannada');
    ProgressStore.touchDailyActive();
  }, []);

  const changeLang = (l) => { setLang(l); ProgressStore.setLanguage(l); setBump(b => b + 1); };

  const enterScene = (id) => { setStorySession(null); setView('scene:' + id); };
  const exitScene  = () => {
    if (storySession) {
      storySession.advance();
      if (storySession.isComplete()) setView('story-finale');
      else setView('scene:' + storySession.currentStep().scene);
    } else {
      setView('hub');
    }
    setBump(b => b + 1);
  };

  const beginStory = () => {
    const today = StoryEngine.todayStory();
    const sess = StoryEngine.newSession(today.id);
    setStorySession(sess);
    setView('story-intro');
  };

  const startFirstStoryStep = () => {
    if (!storySession) return;
    setView('scene:' + storySession.currentStep().scene);
  };

  const finishStory = () => { setStorySession(null); setBump(b => b + 1); setView('hub'); };

  if (view.startsWith('scene:')) {
    const sceneId = view.slice('scene:'.length);
    const storyStep = storySession ? storySession.currentStep() : null;
    return (
      <Scene
        sceneId={sceneId}
        lang={lang}
        storyStep={storyStep}
        onExit={() => { setStorySession(null); setView('hub'); setBump(b => b + 1); }}
        onMissionComplete={exitScene}
      />
    );
  }

  if (view === 'story-intro' && storySession) {
    return (
      <StoryIntro
        story={storySession.story}
        lang={lang}
        onBegin={startFirstStoryStep}
        onSkip={() => { setStorySession(null); setView('hub'); }}
      />
    );
  }

  if (view === 'story-finale' && storySession) {
    return <StoryFinale story={storySession.story} onDone={finishStory} />;
  }

  return (
    <PalaceHub
      key={bump}
      lang={lang}
      onLangChange={changeLang}
      onEnterScene={enterScene}
      todayStory={StoryEngine.todayStory()}
      onEnterStory={beginStory}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] root mounted');
```

- [ ] **Step 3: Manual verification**

Reload `index.html`. Run through:
1. Open hub → "Today's Story" card shows.
2. Tap story card → StoryIntro page with title + intro text + "Let's start!" button.
3. Tap Let's start → loads the first step scene with story-specific targets (the 5 words from `storyStep.targetWords`, not random).
4. Complete mission → auto-advances to next step's scene.
5. After final step → StoryFinale page with payoff emoji + line + +10⭐.
6. "Back to Palace" returns to hub.
7. Opening story a second time on the same day: takes you through the story again (engine allows replay; persistence just records completion date).
8. Back button (🏰) inside a story-mode scene exits the whole story back to hub (designed as abandon).

- [ ] **Step 4: Commit**

```bash
git add scenes.jsx app.jsx
git commit -m "scenes+app: StoryIntro, StoryFinale, multi-step story routing"
```

---

## Task 13: Novelty knobs — golden objects, time-of-day tint, bubble-pop variant

**Files:**
- Modify: `scenes.jsx`

- [ ] **Step 1: Add golden-object roll and time-of-day palette**

In `scenes.jsx`, inside the `Scene` component, replace the existing `mission` useMemo and the `revealWord` function with the augmented versions below, and add the helpers just above the `Scene` definition:

```javascript
// Time-of-day palette tint (applied on top of scene.bg).
const timeOfDayTint = () => {
  const h = new Date().getHours();
  if (h < 7)  return 'brightness(0.85) hue-rotate(-10deg)';
  if (h < 12) return 'brightness(1.05)';
  if (h < 17) return 'brightness(1.0)';
  if (h < 20) return 'brightness(0.95) sepia(0.1)';
  return 'brightness(0.75) hue-rotate(-15deg)';
};

// Golden roll — 20% chance that one of the targets becomes golden.
const pickGoldenTarget = (targets) => (Math.random() < 0.2
  ? targets[Math.floor(Math.random() * targets.length)]
  : null);
```

Then, inside `Scene`, change:

```javascript
  const mission = useMemo(() => MissionEngine.pickMission(sceneId, storyStep), [sceneId, storyStep]);
```
...to also track the golden pick:
```javascript
  const mission = useMemo(() => MissionEngine.pickMission(sceneId, storyStep), [sceneId, storyStep]);
  const goldenTarget = useMemo(() => pickGoldenTarget(mission.targets), [mission]);
```

In `revealWord`, after `AudioManager.speak(...)` and before the `mission.tryReveal` block, add:
```javascript
    if (wordId === goldenTarget) {
      ProgressStore.addStars(3);
      if (sparkleRef.current) sparkleRef.current.burst(posOf(wordId).x, posOf(wordId).y, 20);
    }
```

In the `scene.words.map` render loop in the JSX, wrap a golden halo on the golden target while still ghosted:
```javascript
          const isGolden = wordId === goldenTarget;
          return (
            <div
              key={wordId}
              onClick={() => revealWord(wordId)}
              className="absolute cursor-pointer"
              style={{
                left: p.x - 40, top: p.y - 40, width: 80, height: 80,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 54,
                opacity: isRevealed ? 1 : 0.25,
                filter: isRevealed ? 'none' : 'grayscale(1)',
                animation: isRevealed ? 'reveal-bounce 400ms ease-out' : 'none',
                boxShadow: (isGolden && !isRevealed) ? '0 0 30px 8px gold' : 'none',
                borderRadius: '50%',
                transition: 'opacity 200ms',
              }}
            >{WORDS[wordId].emoji}</div>
          );
```

Finally, apply the time-of-day filter to the scene container:
```javascript
    <div className={`relative w-full h-screen bg-gradient-to-b ${scene.bg} overflow-hidden select-none touch-none`}
         style={{ filter: timeOfDayTint() }}>
```

- [ ] **Step 2: Add bubble-pop variant gating (3+ visits)**

Inside `PalaceHub` (in `scenes.jsx`), next to each scene tile, when the user has visited ≥ 3 times, show a "Bubble Pop" badge. The variant itself is a data-only flag for now — passed to `Scene` via props; we'll default the actual bubble-render alt to stay as ghost objects, but expose the UI affordance so the user sees what's unlocked. Replace the `SCENES.map` block inside `PalaceHub` with:

```javascript
        {SCENES.map(s => {
          const visits = ProgressStore.get().sceneVisits[s.id] || 0;
          const unlocked = visits >= 3;
          return (
            <button
              key={s.id}
              onClick={() => onEnterScene(s.id)}
              className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center active:scale-95 transition-transform relative"
              style={{ minHeight: 120 }}
            >
              <div className="text-5xl">{s.emoji}</div>
              <div className="mt-2 font-bold text-gray-800">{s.label}</div>
              {unlocked && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-br from-pink-400 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                  🫧 Bubble Pop!
                </div>
              )}
            </button>
          );
        })}
```

(The actual bubble-render alt is deliberately deferred — the spec lists this as a novelty knob, not a required launch feature. The badge + scene-visit counting is live now; the alt render can be added in a later content-only iteration without rewiring engines.)

- [ ] **Step 3: Manual verification**

Reload `index.html`.
- Enter the Garden scene; keep refreshing / re-entering. Within a handful of tries, you should see one object glowing with a gold halo — that's the golden target. Revealing it awards +3 extra stars (watch the counter).
- Time-of-day filter: open devtools → Rendering → "Emulate... prefers-color-scheme" is not sufficient here. Instead, verify by opening the app at different hours OR temporarily change `timeOfDayTint` to a fixed value and observe the scene tint.
- Visit the Garden 3 times (enter → exit → enter → exit → enter → exit). On the fourth time at the hub, the Garden tile shows a "🫧 Bubble Pop!" badge.

- [ ] **Step 4: Commit**

```bash
git add scenes.jsx
git commit -m "scenes: golden target, time-of-day tint, bubble-pop unlock badge"
```

---

## Task 14: Content authoring docs + CLAUDE.md refresh

**Files:**
- Create: `ADDING_CONTENT.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Write ADDING_CONTENT.md**

Create `ADDING_CONTENT.md`:

````markdown
# Adding content to Kavya's Palace

All content lives in `data.jsx`. To add something, edit that one file and bump `CONTENT_VERSION` at the top so users see a "New!" indicator once you deploy.

## Add a word

1. Add the word to `WORDS`:
   ```javascript
   WORDS.kite = { english: 'Kite', emoji: '🪁',
     kannada: 'ಗಾಳಿಪಟ', kannadaSound: 'gaalipata',
     hindi: 'पतंग', hindiSound: 'patang',
     gujarati: 'પતંગ', gujaratiSound: 'patang' };
   ```
2. Reference it from a scene's `words` array and give it a position:
   ```javascript
   // in SCENES find the scene you want, then:
   words: [...existing, 'kite'],
   objectPositions: { ...existing, kite: { x: 0.5, y: 0.3 } },
   ```

## Add a story

Append to `STORIES`:
```javascript
STORIES.push({
  id: 'kite-festival',
  title: 'The Kite Festival',
  intro: "It's Uttarayan! Let's fly kites and celebrate.",
  steps: [
    { scene: 'courtyard', targetWords: ['kite','sun','cloud','star','moon'] },
    { scene: 'kitchen',   targetWords: ['tea','chapati','sugar','milk','rice'] },
    { scene: 'family',    targetWords: ['mother','father','brother','sister','grandma'] },
  ],
  finale: 'fireworks',
});
```

`finale` must match one of the `FINALES` keys in `scenes.jsx`, or add a new finale entry there.

## Add a friend

Append to `FRIENDS`:
```javascript
FRIENDS.rohan = { displayName: 'Rohan', role: 'friend', appearsIn: ['garden','courtyard'] };
```

Optional: set `wordRef: '<wordId>'` to tie the friend to a specific vocabulary word (like `scooby` -> `dog`).

## Add a scene

Append to `SCENES`:
```javascript
SCENES.push({
  id: 'beach', label: 'Beach', emoji: '🏖️',
  bg: 'from-sky-200 to-amber-200',
  decor: ['🌊','⛵','☀️'],
  words: ['sand','shell','wave','boat','fish', /*...10 total...*/],
  objectPositions: { sand:{x:0.2,y:0.6}, /*...*/ },
});
```

No component code needs to change — `Scene` and `PalaceHub` both pick up the new entry on reload.

## Bump CONTENT_VERSION

At the top of `data.jsx`, bump `CONTENT_VERSION` whenever you add content. The app compares this to `indianLanguagesContentVersion` in localStorage to decide whether to show a "New!" badge.
````

- [ ] **Step 2: Rewrite relevant sections of CLAUDE.md**

Open `CLAUDE.md`. Replace the **Architecture**, **Categories**, **Key Components**, **Routing**, **Interest Tags**, and **Data Persistence** sections with:

```markdown
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
```

Leave the **Languages**, **Development Workflow**, **Style**, **Target Audience**, and **Deployment** sections as-is (they still apply).

- [ ] **Step 3: Commit**

```bash
git add ADDING_CONTENT.md CLAUDE.md
git commit -m "docs: add ADDING_CONTENT guide; rewrite CLAUDE.md for v2 architecture"
```

---

## Task 15: Cleanup — delete legacy app code and unused docs

**Files:**
- Delete: `app-legacy.jsx`
- Delete: old guides that no longer apply
- Review: `manifest.json`, `setup.sh`, `ADDING_LANGUAGES.md`, `NAMING_GUIDE.md`, `PROJECT_STRUCTURE.md`, `README.md`

- [ ] **Step 1: Delete the legacy app file**

```bash
git rm app-legacy.jsx
```

- [ ] **Step 2: Retire docs made obsolete by v2**

`ADDING_LANGUAGES.md`, `NAMING_GUIDE.md`, and `PROJECT_STRUCTURE.md` in the repo root describe the old category/flashcard architecture and file layout. The new source of truth is `CLAUDE.md` + `ADDING_CONTENT.md`. Remove the stale files:

```bash
git rm ADDING_LANGUAGES.md NAMING_GUIDE.md PROJECT_STRUCTURE.md
```

- [ ] **Step 3: Update README.md**

Open `README.md` and replace its contents with:

```markdown
# Learn Indian Languages — Kavya's Palace

Interactive language learning app for a 4-year-old. Kannada, Hindi, Gujarati.

- **Live:** https://zesty-bublanina-d4336d.netlify.app/
- **Architecture:** see `CLAUDE.md`
- **Adding content:** see `ADDING_CONTENT.md`
- **Spec:** `docs/superpowers/specs/2026-04-20-kavyas-palace-design.md`

## Running locally

No build step. Open `index.html` directly, or for the Sarvam TTS proxy to work:
```bash
netlify dev
```
and set `SARVAM_API_KEY` in a `.env` file.

## Running engine tests

Open `index.html?test=1` in a browser. Results print to the console.

## Deployment

Auto-deploys from `main` to Netlify. `netlify/functions/tts.js` proxies Sarvam TTS with the API key stored in Netlify env vars.
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "cleanup: remove legacy files and stale guides; update README for v2"
```

---

## Task 16: Verification pass + deploy

**Files:** none directly.

- [ ] **Step 1: Full manual checklist (from spec)**

Open `index.html` on an iPad Safari session (primary target device). Walk through:

1. Hub renders; 5 scene tiles visible; Kavya greets; language picker works; star count correct.
2. Enter each of the 5 scenes; verify 10 ghost objects at expected positions; wand follows touch; revealing plays correct-language audio.
3. Complete a full mission in each scene; confirm celebration + star accrual + return to hub (or next story step).
4. Tap "Today's Story" card → run story end-to-end; confirm finale cutscene + +10⭐ + story marked complete.
5. Switch language mid-scene; confirm subsequent reveals use the new language.
6. Trigger the golden-object path (replay until it fires) and confirm +3 bonus stars + gold halo while ghosted.
7. Visit a single scene 3 times; confirm the "🫧 Bubble Pop!" badge appears on that scene's tile.
8. Reload the app mid-session; confirm localStorage restores stars, language, streak.
9. Simulate v1 migration: in devtools, run
   ```javascript
   localStorage.clear();
   localStorage.setItem('indianLanguagesProgress', JSON.stringify({ progress:{'animals-0':true}, totalStars:7 }));
   ```
   Reload; confirm hub shows 7⭐.
10. Test runner: open `index.html?test=1`; confirm `N passed, 0 failed` in console.

Fix anything that fails before proceeding. Commit each fix as its own `fix:` commit with a terse message.

- [ ] **Step 2: Deploy**

```bash
git push origin main
```

Netlify auto-deploys. Confirm the live URL (`https://zesty-bublanina-d4336d.netlify.app/`) reflects the new experience.

- [ ] **Step 3: Final commit if any doc touch-ups were needed**

If the verification pass surfaced anything that wants a follow-up note in `CLAUDE.md` or `ADDING_CONTENT.md`, write that commit last:

```bash
git add <files>
git commit -m "docs: verification follow-ups"
git push
```

---

## Spec coverage check

| Spec section | Implementing task(s) |
|---|---|
| Vision / primary user / non-goals | Task 14 (CLAUDE.md + README) |
| The cast (Kavya, Kailash/Kai, Scooby, Aira/Millie/Lila/Priya) | Task 2 (FRIENDS) |
| Palace hub + 5 scene tiles | Task 10 |
| Scene anatomy + ghost objects + wand + sparkle | Tasks 8, 9 |
| Core interaction loop | Task 9 |
| MissionEngine (5/10 shuffle, story override) | Task 5 |
| StoryEngine (day-stable, 3-step sessions) | Task 6 |
| StoryIntro / StoryFinale cutscenes | Task 12 |
| Novelty knobs: mission shuffle, bubble-pop, golden, time-of-day | Tasks 5, 13 |
| Audio (Sarvam + fallback + prefetch) | Task 3 |
| ProgressStore + v1→v2 migration | Task 4 |
| Tap-to-replay (revealed objects as audio buttons) | Task 9 |
| Content bundle as living library | Tasks 2, 14 |
| ADDING_CONTENT.md | Task 14 |
| File split (6 files, load order) | Task 1 |
| In-browser test runner | Task 4 |
| Touch targets ≥ 64/80 pt | Tasks 7, 10 (via Tailwind min-sizes) |
| CSS keyframes (sparkle-float, reveal-bounce, kavya-wave, kavya-dance, pop-in) | Task 1 |
| Manual verification checklist | Task 16 |
| Remove classic flashcard/matching mode | Task 15 |

Anything missed from the spec gets a new task before implementation begins.
