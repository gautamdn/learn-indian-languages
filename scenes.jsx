// scenes.jsx — Scene shell and (later) PalaceHub.
const { useState, useEffect, useRef, useMemo } = React;

// --- helpers ---
const wordNative = (wordId, lang) => {
  const w = WORDS[wordId];
  if (!w) return { text: '', sound: '' };
  return { text: w[lang], sound: w[lang + 'Sound'] };
};

const HIT_RADIUS = 60; // px — generous for a 4yo

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

// --- Scene ---
// Props: sceneId, lang, storyStep (nullable), onExit, onMissionComplete
const Scene = ({ sceneId, lang, storyStep = null, onExit, onMissionComplete }) => {
  const scene = useMemo(() => SCENES.find(s => s.id === sceneId), [sceneId]);
  const parentRef = useRef(null);
  const sparkleRef = useRef(null);
  const mission = useMemo(() => MissionEngine.pickMission(sceneId, storyStep), [sceneId, storyStep]);
  const goldenTarget = useMemo(() => pickGoldenTarget(mission.targets), [mission]);
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
    if (wordId === goldenTarget) {
      ProgressStore.addStars(3);
      if (sparkleRef.current) sparkleRef.current.burst(posOf(wordId).x, posOf(wordId).y, 20);
    }
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
    <div className={`relative w-full h-screen bg-gradient-to-b ${scene.bg} overflow-hidden select-none touch-none`}
         style={{ filter: timeOfDayTint() }}>
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
      </div>

      <div className="absolute bottom-4 left-4 flex items-end gap-3">
        <KavyaAvatar state="wave" size={96} />
        <SpeechBubble english="Namaste! Where to?" native={wordNative('namaste', lang).text} className="mb-4" />
      </div>
    </div>
  );
};

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

console.log('[scenes.jsx] Scene + PalaceHub + StoryIntro + StoryFinale ready');
