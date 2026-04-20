// app.jsx — LanguageLearningApp root. Wires engines, audio, persistence; handles view routing.
const { useState, useEffect, useRef } = React;

const LanguageLearningApp = () => {
  const [view, setView] = useState('hub');             // 'hub' | 'scene:<id>'
  const [lang, setLang] = useState('kannada');
  const [bump, setBump] = useState(0);                  // forces re-render after ProgressStore mutations outside React

  useEffect(() => {
    const s = ProgressStore.load();
    setLang(s.language || 'kannada');
    ProgressStore.touchDailyActive();
  }, []);

  const changeLang = (l) => {
    setLang(l);
    ProgressStore.setLanguage(l);
    setBump(b => b + 1);
  };

  const enterScene = (id) => setView('scene:' + id);
  const exitScene  = () => { setBump(b => b + 1); setView('hub'); };

  if (view.startsWith('scene:')) {
    const sceneId = view.slice('scene:'.length);
    return (
      <Scene
        sceneId={sceneId}
        lang={lang}
        onExit={exitScene}
        onMissionComplete={exitScene}
      />
    );
  }

  return (
    <PalaceHub
      key={bump}
      lang={lang}
      onLangChange={changeLang}
      onEnterScene={enterScene}
      todayStory={StoryEngine.todayStory()}
      onEnterStory={() => alert('Story flow wires up in Task 13')}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] root mounted');
