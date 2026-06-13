import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWorkoutTimerReturn {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: (newSeconds: number) => void;
  progress: number; // 0–1
}

export function useWorkoutTimer(initialSeconds: number): UseWorkoutTimerReturn {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setIsRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds: number) => {
    setIsRunning(false);
    setSeconds(newSeconds);
  }, []);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    progress: initialSeconds > 0 ? 1 - seconds / initialSeconds : 0,
  };
}
