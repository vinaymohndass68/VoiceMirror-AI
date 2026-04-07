
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
  onComplete: (name: string, prompt: string) => void;
}

const CharacterCreator: React.FC<Props> = ({ onBack, onComplete }) => {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');

  const suggestions = [
    "A hyperactive squirrel who's addicted to coffee.",
    "A grumpy magic hat with a British accent.",
    "A clumsy superhero with the power of static electricity.",
    "A sarcastic robot who secretly wants to be a cat.",
    "A posh penguin who dreams of being a surfer."
  ];

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
           </svg>
        </button>
        <div>
          <h2 className="text-3xl font-display font-bold">Step 2: Pick Your Toon</h2>
          <p className="text-gray-400">What kind of animated legend are we creating today?</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Character Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Captain Zap, Squeaky, Professor Paws"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-500 transition-all text-xl"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Cartoon Personality</label>
          <textarea 
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe their funny traits, catchphrases, and animated quirks..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none text-lg"
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Cartoon Ideas</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button 
                key={idx}
                onClick={() => setPrompt(s)}
                className="px-3 py-1.5 glass rounded-full text-xs text-gray-400 hover:text-white hover:bg-pink-500/20 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={!name || !prompt}
          onClick={() => onComplete(name, prompt)}
          className="w-full py-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-pink-900/20"
        >
          Start Animation Process
        </button>
      </div>
    </div>
  );
};

export default CharacterCreator;
