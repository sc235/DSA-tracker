import * as Speech from 'expo-speech';

export const VoiceService = {
  speak: async (text: string) => {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }
    
    Speech.speak(text, {
      language: 'en',
      pitch: 1.1, // Slightly higher pitch for a 'helpful' AI feel
      rate: 0.95,  // Slightly slower for better clarity
    });
  },

  stop: () => {
    Speech.stop();
  },

  isSpeaking: async () => {
    return await Speech.isSpeakingAsync();
  }
};
