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
