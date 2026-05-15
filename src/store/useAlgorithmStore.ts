import { create } from 'zustand';
import { Step } from '../engine/types';
import { socketService } from '../services/socket';

interface AlgorithmState {
  steps: Step[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // ms delay
  isRemoteSyncEnabled: boolean;
  isPracticeMode: boolean;
  practiceScore: number;
  
  // Actions
  setSteps: (steps: Step[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  reset: () => void;
  setPlaybackSpeed: (speed: number) => void;
  jumpToStep: (index: number, remote?: boolean) => void;
  toggleRemoteSync: () => void;
  togglePracticeMode: () => void;
  validateAction: (actionType: string) => boolean;
}

export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 500,
  isRemoteSyncEnabled: false,
  isPracticeMode: false,
  practiceScore: 0,

  setSteps: (steps) => set({ steps, currentStepIndex: 0, isPlaying: false }),

  nextStep: () => {
    const { currentStepIndex, steps, isRemoteSyncEnabled } = get();
    if (currentStepIndex < steps.length - 1) {
      const newIndex = currentStepIndex + 1;
      set({ currentStepIndex: newIndex });
      if (isRemoteSyncEnabled) socketService.emitStep(newIndex);
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStepIndex, isRemoteSyncEnabled } = get();
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      set({ currentStepIndex: newIndex });
      if (isRemoteSyncEnabled) socketService.emitStep(newIndex);
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  reset: () => {
    set({ currentStepIndex: 0, isPlaying: false });
    if (get().isRemoteSyncEnabled) socketService.emitStep(0);
  },

  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

  jumpToStep: (index, remote = false) => {
    const { steps, isRemoteSyncEnabled } = get();
    if (index >= 0 && index < steps.length) {
      set({ currentStepIndex: index });
      if (isRemoteSyncEnabled && !remote) socketService.emitStep(index);
    }
  },
  toggleRemoteSync: () => {
    const { isRemoteSyncEnabled } = get();
    if (!isRemoteSyncEnabled) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }
    set({ isRemoteSyncEnabled: !isRemoteSyncEnabled });
  },

  togglePracticeMode: () => set(state => ({ 
    isPracticeMode: !state.isPracticeMode, 
    practiceScore: 0, 
    currentStepIndex: 0,
    isPlaying: false 
  })),

  validateAction: (actionType) => {
    const { steps, currentStepIndex } = get();
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= steps.length) return false;

    set(state => ({ 
      currentStepIndex: nextIndex,
      practiceScore: state.practiceScore + 10 
    }));
    return true;
  }
}));
