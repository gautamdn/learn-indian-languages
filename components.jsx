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
