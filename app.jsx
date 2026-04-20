// app.jsx — LanguageLearningApp root. Wires engines, audio, persistence; handles view routing.
const { useState, useEffect, useRef } = React;

const LanguageLearningApp = () => {
  const parentRef = useRef(null);
  const sparkleRef = useRef(null);
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-200 to-green-400">
      <div
        ref={parentRef}
        className="relative w-full max-w-2xl h-[500px] mx-auto bg-white/30 rounded-3xl overflow-hidden touch-none"
      >
        <SparkleLayer ref={sparkleRef} />
        <Wand parentRef={parentRef} sparkleRef={sparkleRef} onMove={({x,y}) => console.log('wand@', x.toFixed(0), y.toFixed(0))} />
        <div className="absolute bottom-4 left-4"><KavyaAvatar /></div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] loaded');
