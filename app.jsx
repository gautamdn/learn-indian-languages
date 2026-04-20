// app.jsx — LanguageLearningApp root. Wires engines, audio, persistence; handles view routing.
// Note: useState/useEffect/useRef are declared globally in data.jsx.

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
