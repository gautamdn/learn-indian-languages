// app.jsx — LanguageLearningApp root. Wires engines, audio, persistence; handles view routing.
const { useState, useEffect, useRef } = React;

const LanguageLearningApp = () => {
  const [lang, setLang] = useState('kannada');
  useEffect(() => { ProgressStore.load(); }, []);
  return (
    <PalaceHub
      lang={lang}
      onLangChange={(l) => { setLang(l); ProgressStore.setLanguage(l); }}
      onEnterScene={(id) => alert('enter ' + id)}
      todayStory={StoryEngine.todayStory()}
      onEnterStory={() => alert('story: ' + StoryEngine.todayStory().title)}
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] loaded');
