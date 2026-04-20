// components.jsx — shared UI primitives.
// Note: useState/useEffect/useRef are declared globally in data.jsx.

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

console.log('[components.jsx] primitives ready');
