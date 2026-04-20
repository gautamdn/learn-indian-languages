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
