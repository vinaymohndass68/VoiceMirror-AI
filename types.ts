
export interface VoiceSample {
  data: string; // base64
  mimeType: string;
}

export interface Character {
  name: string;
  prompt: string;
  voiceAnalysis: string;
  systemInstruction: string;
}

export enum AppStep {
  WELCOME = 'WELCOME',
  UPLOAD_VOICE = 'UPLOAD_VOICE',
  CREATE_CHARACTER = 'CREATE_CHARACTER',
  TRAINING = 'TRAINING',
  CHAT = 'CHAT'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  audio?: string; // base64 pcm
}
