
import React from 'react';

interface Props {
  onStart: () => void;
}

const Welcome: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center text-center py-12 px-4 space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4">
        <h2 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-tight">
          Animate your <span className="text-yellow-400">voice</span>. <br />
          Become a <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">cartoon</span>.
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The ultimate engine to transform your voice into an animated persona. Record your speech and watch it morph into a colorful, expressive cartoon character.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button 
          onClick={onStart}
          className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold text-lg shadow-xl shadow-pink-900/20 transform hover:-translate-y-1 transition-all"
        >
          Animate Me!
        </button>
        <button className="px-8 py-4 glass hover:bg-white/5 text-white rounded-full font-bold text-lg transition-all border border-white/10">
          Character Lab
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full">
        {[
          { icon: '🎨', title: 'Animated Analysis', desc: 'Our engine detects the "cartoon potential" in your natural speech patterns.' },
          { icon: '🍭', title: 'Persona Fusion', desc: 'Merge your tone with whimsical heroes, grumpy villains, or talking animals.' },
          { icon: '🎬', title: 'Live Interaction', desc: 'Chat in real-time with an AI that sounds like your voice but acts like a star.' }
        ].map((feat, idx) => (
          <div key={idx} className="glass p-6 rounded-3xl text-left space-y-3 border-pink-500/20">
            <span className="text-3xl">{feat.icon}</span>
            <h3 className="text-xl font-bold">{feat.title}</h3>
            <p className="text-gray-400 text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
