
import React, { useState, useCallback } from 'react';
import { AppStep, VoiceSample, Character } from './types';
import Header from './components/Header';
import Welcome from './components/Welcome';
import VoiceUploader from './components/VoiceUploader';
import CharacterCreator from './components/CharacterCreator';
import TrainingProgress from './components/TrainingProgress';
import ChatInterface from './components/ChatInterface';
import { analyzeVoiceSample } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [voiceSample, setVoiceSample] = useState<VoiceSample | null>(null);
  const [characterConfig, setCharacterConfig] = useState<{ name: string; prompt: string }>({ name: '', prompt: '' });
  const [character, setCharacter] = useState<Character | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  const startTraining = useCallback(async (name: string, prompt: string, sample: VoiceSample) => {
    setStep(AppStep.TRAINING);
    setIsTraining(true);
    try {
      const analysis = await analyzeVoiceSample(sample, prompt);
      
      const systemInstruction = `
        You are "${name}", a vibrant and highly expressive CARTOON character.
        Your Persona context: ${prompt}
        Your Linguistic Analysis: ${analysis}
        
        Cartoon Guidelines:
        1. Adopt a tone that is energetic, whimsical, and larger-than-life.
        2. Use exaggerated emotions and playful language.
        3. Occasionally use "cartoon sound effects" in asterisks like *boing*, *zap*, or *squeak* to enhance your character's vibe.
        4. Merge the user's vocal cadence (from the analysis) with this animated cartoon energy.
        5. Keep your responses punchy and fun.
      `;

      setCharacter({
        name,
        prompt,
        voiceAnalysis: analysis,
        systemInstruction
      });
      
      // Simulate "deep training" feel
      setTimeout(() => {
        setIsTraining(false);
        setStep(AppStep.CHAT);
      }, 3000);
    } catch (error) {
      console.error("Training failed", error);
      setIsTraining(false);
      setStep(AppStep.CREATE_CHARACTER);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 bg-[#030712] text-gray-100 overflow-x-hidden">
      <Header onHome={() => setStep(AppStep.WELCOME)} />
      
      <main className="w-full max-w-4xl mt-8 flex-grow">
        {step === AppStep.WELCOME && (
          <Welcome onStart={() => setStep(AppStep.UPLOAD_VOICE)} />
        )}

        {step === AppStep.UPLOAD_VOICE && (
          <VoiceUploader 
            onComplete={(sample) => {
              setVoiceSample(sample);
              setStep(AppStep.CREATE_CHARACTER);
            }} 
          />
        )}

        {step === AppStep.CREATE_CHARACTER && (
          <CharacterCreator 
            onBack={() => setStep(AppStep.UPLOAD_VOICE)}
            onComplete={(name, prompt) => {
              setCharacterConfig({ name, prompt });
              if (voiceSample) {
                startTraining(name, prompt, voiceSample);
              }
            }} 
          />
        )}

        {step === AppStep.TRAINING && (
          <TrainingProgress isDone={!isTraining} />
        )}

        {step === AppStep.CHAT && character && (
          <ChatInterface character={character} />
        )}
      </main>

      <footer className="mt-12 text-gray-500 text-sm py-4 border-t border-white/5 w-full max-w-4xl text-center">
        Powered by Gemini 3 Flash & CartoonMirror Neural Engine
      </footer>
    </div>
  );
};

export default App;
