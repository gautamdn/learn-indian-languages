// audio.jsx — AudioManager: Sarvam TTS primary, browser TTS fallback.
// Exposed as global `AudioManager`.

const AudioManager = (() => {
  const LANG_MAP = { kannada: 'kn-IN', hindi: 'hi-IN', gujarati: 'gu-IN' };
  const DEFAULT_VOICE = 'priya';
  const SPEAK_TIMEOUT_MS = 4000;     // if Sarvam hasn't responded in 4s, fall back to browser TTS

  const cache = {};      // key "<langCode>:<text>:<voice>" -> data URL
  const inflight = {};   // key -> Promise<url>, dedupes concurrent fetches
  let currentAudio = null;
  let lastSourceListener = null; // optional UI callback: (src) => void, src ∈ 'sarvam' | 'browser'

  const notify = (src) => { if (lastSourceListener) lastSourceListener(src); };

  const speakWithBrowserTTS = (text, lang) => {
    if (!('speechSynthesis' in window)) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG_MAP[lang] || 'hi-IN';
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
    notify('browser');
  };

  const fetchSarvamOnce = async (text, langCode, voice) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SPEAK_TIMEOUT_MS);
    try {
      const res = await fetch('/.netlify/functions/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language_code: langCode, speaker: voice }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error('tts proxy ' + res.status);
      const data = await res.json();
      return `data:audio/mp3;base64,${data.audio}`;
    } finally {
      clearTimeout(timer);
    }
  };

  // Single-flight: if a fetch for the same key is already in-flight, reuse its promise.
  const fetchSarvam = (text, langCode, voice) => {
    const key = `${langCode}:${text}:${voice}`;
    if (cache[key]) return Promise.resolve(cache[key]);
    if (inflight[key]) return inflight[key];
    const p = fetchSarvamOnce(text, langCode, voice)
      .then(url => { cache[key] = url; delete inflight[key]; return url; })
      .catch(err => { delete inflight[key]; throw err; });
    inflight[key] = p;
    return p;
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
    try {
      const url = await fetchSarvam(text, langCode, voice);
      await playUrl(url);
      notify('sarvam');
    } catch (e) {
      speakWithBrowserTTS(text, lang);
    }
  };

  // Prefetch: warms the cache SEQUENTIALLY to avoid hammering the TTS proxy with
  // parallel requests (which caused 502s on Netlify). Fire-and-forget from the
  // caller's perspective — errors are swallowed.
  const prefetch = async (items, { voice = DEFAULT_VOICE } = {}) => {
    for (const { text, lang } of items) {
      const langCode = LANG_MAP[lang];
      if (!langCode || !text) continue;
      const key = `${langCode}:${text}:${voice}`;
      if (cache[key]) continue;
      try { await fetchSarvam(text, langCode, voice); } catch (e) { /* silent */ }
    }
  };

  const setSourceListener = (fn) => { lastSourceListener = fn; };
  const stop = () => {
    try { if (currentAudio) currentAudio.pause(); } catch (e) {}
    currentAudio = null;
    try { window.speechSynthesis.cancel(); } catch (e) {}
  };

  return { speak, prefetch, setSourceListener, stop, LANG_MAP };
})();

console.log('[audio.jsx] AudioManager ready');
