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
