
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Character, ChatMessage } from '../types';
import { generateChatResponse, decodeBase64, decodeAudioData } from '../services/geminiService';

interface Props {
  character: Character;
}

const ChatInterface: React.FC<Props> = ({ character }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `*POOF!* Animation complete! Hello, I am ${character.name}! I've got your voice and a whole lot of toon energy. What's our first adventure?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const playAudio = async (base64: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const bytes = decodeBase64(base64);
      const buffer = await decodeAudioData(bytes, ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const result = await generateChatResponse(input, history, character.systemInstruction);
      
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: result.text,
        audio: result.audio 
      };
      
      setMessages(prev => [...prev, modelMsg]);
      if (result.audio) {
        playAudio(result.audio);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "*Sputter, cough!* My ink well ran dry. Can you say that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] glass rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-700 border-pink-500/20">
      {/* Header Info */}
      <div className="bg-white/5 p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 via-orange-400 to-yellow-400 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            🌟
          </div>
          <div>
            <h3 className="font-bold text-2xl font-display text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">{character.name}</h3>
            <p className="text-[10px] text-pink-400 font-bold tracking-[0.2em] uppercase">Fully Animated & Synced</p>
          </div>
        </div>
        <div className="hidden md:block px-4 py-1.5 bg-pink-500/10 text-pink-400 rounded-full text-xs font-bold animate-pulse border border-pink-500/20">
          Cartoon Physics Enabled
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[2rem] p-5 shadow-lg ${
              m.role === 'user' 
                ? 'bg-pink-600 text-white rounded-tr-none' 
                : 'bg-white/10 border border-white/10 text-gray-100 rounded-tl-none'
            }`}>
              <p className="text-base md:text-lg leading-relaxed font-medium">{m.text}</p>
              {m.audio && (
                <button 
                  onClick={() => playAudio(m.audio!)}
                  className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-pink-200 hover:text-white transition-colors bg-pink-900/30 px-3 py-1 rounded-full w-fit"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Hear Voice
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-full p-4 flex gap-2 items-center">
              <div className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white/5 border-t border-white/10">
        <div className="flex gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Say something to ${character.name}...`}
            className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-pink-500 transition-all text-lg placeholder:text-gray-600"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-8 py-5 bg-gradient-to-tr from-pink-600 to-orange-500 text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-900/20 active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
