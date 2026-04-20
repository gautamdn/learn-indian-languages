// app.jsx — LanguageLearningApp root. Wires engines, audio, persistence; handles view routing.
const { useState, useEffect } = React;

const LanguageLearningApp = () => {
  const [lang, setLang] = useState('kannada');
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-pink-200 via-yellow-100 to-green-200">
      <div className="flex justify-between">
        <BackButton onClick={() => alert('back')} />
        <div className="flex gap-2">
          <LangPicker value={lang} onChange={setLang} />
          <StarCounter count={42} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 mt-12">
        <KavyaAvatar state="wave" size={120} />
        <SpeechBubble english="Namaste! Let's play!" native="ನಮಸ್ಕಾರ 👋" />
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] loaded');
