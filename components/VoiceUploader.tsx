
import React, { useState, useRef, useEffect } from 'react';
import { VoiceSample } from '../types';

interface Props {
  onComplete: (sample: VoiceSample) => void;
}

const VoiceUploader: React.FC<Props> = ({ onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sample, setSample] = useState<VoiceSample | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          setSample({
            data: base64data,
            mimeType: 'audio/webm'
          });
        };
      };

      recorder.start();
      setIsRecording(true);
      setTimer(0);
      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display font-bold">Step 1: Feed the Engine</h2>
        <p className="text-gray-400">Record 10-20 seconds of your voice reading a paragraph naturally.</p>
      </div>

      <div className="glass p-12 rounded-[2rem] flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
        {isRecording && (
          <div className="absolute inset-0 bg-purple-600/5 animate-pulse flex items-center justify-center pointer-events-none">
             <div className="flex gap-1 items-end h-16">
               {[...Array(12)].map((_, i) => (
                 <div 
                   key={i} 
                   className="w-1 bg-purple-500 rounded-full animate-bounce"
                   style={{ 
                     height: `${Math.random() * 100}%`,
                     animationDelay: `${i * 0.1}s`,
                     animationDuration: '0.6s'
                   }}
                 />
               ))}
             </div>
          </div>
        )}

        <div className="text-5xl font-mono font-bold tabular-nums">
          {formatTime(timer)}
        </div>

        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="w-24 h-24 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
          >
            <div className="w-8 h-8 bg-white rounded-full" />
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="w-24 h-24 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-900/30 transition-all animate-pulse"
          >
            <div className="w-8 h-8 bg-white rounded-md" />
          </button>
        )}

        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
          {isRecording ? 'Capturing Biometrics...' : 'Tap to start recording'}
        </p>
      </div>

      {audioUrl && !isRecording && (
        <div className="space-y-4 pt-4">
          <div className="glass p-4 rounded-2xl flex items-center justify-between">
            <audio src={audioUrl} controls className="h-10 rounded-lg filter invert hue-rotate-180" />
            <button 
              onClick={() => {setAudioUrl(null); setSample(null); setTimer(0);}}
              className="text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <button 
            disabled={!sample || timer < 5}
            onClick={() => sample && onComplete(sample)}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Character Setup
          </button>
          {timer < 5 && <p className="text-xs text-center text-red-400">Please record at least 5 seconds.</p>}
        </div>
      )}
    </div>
  );
};

export default VoiceUploader;
