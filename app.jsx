// app.jsx — LanguageLearningApp root. Wires engines, audio, persistence; handles view routing.
const { useState, useEffect, useRef } = React;

const LanguageLearningApp = () => {
  const [view, setView] = useState('scene');
  useEffect(() => { ProgressStore.load(); }, []);
  if (view === 'scene') {
    return <Scene sceneId="garden" lang="kannada" onExit={() => setView('done')} onMissionComplete={() => setView('done')} />;
  }
  return <div className="min-h-screen flex items-center justify-center text-3xl">✅ Mission complete or exited</div>;
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] loaded');
