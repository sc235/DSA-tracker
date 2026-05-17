import * as Speech from 'expo-speech';

export const VoiceService = {
  _isSpeakingInternal: false,

  speak: async (text: string) => {
    try {
      if (!text || typeof text !== 'string') return;

      try {
        const isSpeaking = await Speech.isSpeakingAsync();
        if (isSpeaking) {
          await Speech.stop();
        }
      } catch (stopErr) {
        console.warn('Speech stop error:', stopErr);
      }

      VoiceService._isSpeakingInternal = true;

      Speech.speak(text, {
        language: 'en',
        pitch: 1.1,
        rate: 0.95,
        onDone: () => {
          VoiceService._isSpeakingInternal = false;
        },
        onStopped: () => {
          VoiceService._isSpeakingInternal = false;
        },
        onError: (err) => {
          VoiceService._isSpeakingInternal = false;
          console.warn('Speech synthesizer error:', err);
        }
      });
    } catch (e) {
      VoiceService._isSpeakingInternal = false;
      console.warn('VoiceService speak error:', e);
    }
  },

  stop: async () => {
    try {
      VoiceService._isSpeakingInternal = false;
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        await Speech.stop();
      }
    } catch (e) {
      console.warn('VoiceService stop error:', e);
    }
  },

  isSpeaking: async () => {
    try {
      return await Speech.isSpeakingAsync();
    } catch (e) {
      return VoiceService._isSpeakingInternal;
    }
  }
};
