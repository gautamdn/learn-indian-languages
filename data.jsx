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

// Content summary (visible in console on load).
console.log('[data.jsx] content v' + CONTENT_VERSION
  + ' — ' + Object.keys(WORDS).length + ' words'
  + ', ' + SCENES.length + ' scenes'
  + ', ' + Object.keys(FRIENDS).length + ' friends'
  + ', ' + STORIES.length + ' stories');
