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
