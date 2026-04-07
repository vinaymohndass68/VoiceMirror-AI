
import React, { useState, useEffect } from 'react';

interface Props {
  isDone: boolean;
}

const TrainingProgress: React.FC<Props> = ({ isDone }) => {
  const [progress, setProgress] = useState(0);
  const messages = [
    "Sketching character frames...",
    "Stretching vocal cords for slapstick...",
    "Adding squash and stretch to syllables...",
    "Injecting punchy catchphrases...",
    "Painting the background world...",
    "Finalizing the animation loop..."
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + (Math.random() * 10), 95));
      setMsgIdx(prev => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto py-20 flex flex-col items-center text-center space-y-12">
      <div className="relative">
        <div className="w-32 h-32 border-4 border-pink-900/30 rounded-full flex items-center justify-center">
          <div className="w-24 h-24 border-t-4 border-pink-500 rounded-full animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-pink-500">
          {Math.floor(progress)}%
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-display font-bold animate-pulse text-pink-400">Animating Your Voice...</h2>
        <p className="text-gray-400 font-mono text-lg transition-all duration-500 h-8 italic">
          "{messages[msgIdx]}"
        </p>
      </div>

      <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 transition-all duration-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-600 max-w-xs mx-auto">
        Your voice is being merged with the laws of cartoon physics. Please hold onto your hat!
      </p>
    </div>
  );
};

export default TrainingProgress;
