// app.jsx — LanguageLearningApp root. Wires engines, audio, persistence; handles view routing.
const { useState, useEffect } = React;

const LanguageLearningApp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-green-200">
      <div className="text-center">
        <div className="text-8xl">👸🏽</div>
        <p className="mt-4 text-xl font-bold text-purple-800">Kavya's Palace — scaffolding in progress</p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);
console.log('[app.jsx] loaded');
