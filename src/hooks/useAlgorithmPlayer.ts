import { useEffect, useRef } from 'react';
import { useAlgorithmStore } from '../store/useAlgorithmStore';

export const useAlgorithmPlayer = () => {
  const { isPlaying, nextStep, playbackSpeed } = useAlgorithmStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextStep();
      }, playbackSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, nextStep, playbackSpeed]);
};
