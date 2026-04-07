
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VoiceSample } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Analyzes the user's voice sample to extract linguistic features
 */
export async function analyzeVoiceSample(sample: VoiceSample, characterPrompt: string): Promise<string> {
  const ai = getAI();
  const prompt = `
    Analyze this audio sample of a person's voice.
    Then, describe how to mimic their personality, tone, cadence, and linguistic style in text.
    The target character is: "${characterPrompt}".
    Focus on how to merge the user's vocal "vibe" with the character's persona.
    Provide a detailed stylistic profile.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: sample.data, mimeType: sample.mimeType } },
        { text: prompt }
      ]
    },
    config: {
      temperature: 0.7,
      maxOutputTokens: 500,
    }
  });

  return response.text || "A standard conversational tone.";
}

/**
 * Generates a chat response with audio TTS
 */
export async function generateChatResponse(
  message: string, 
  history: {role: 'user' | 'model', text: string}[], 
  systemInstruction: string
) {
  const ai = getAI();
  
  // 1. Generate text response
  const chatResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction,
      temperature: 0.9,
    }
  });

  const replyText = chatResponse.text || "I'm not sure what to say.";

  // 2. Generate audio response (TTS) using the 2.5 flash preview
  // Choosing a high-fidelity voice. In a real app we might let the user choose.
  const audioResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text: replyText }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' } // 'Kore' is a good expressive voice
        }
      }
    }
  });

  const audioBase64 = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  return {
    text: replyText,
    audio: audioBase64
  };
}

// Utility to decode raw PCM from Gemini TTS
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
