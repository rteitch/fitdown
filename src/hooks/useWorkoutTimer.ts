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
  const totalSecondsRef = useRef(initialSeconds);

  // Update totalSecondsRef when initialSeconds changes (e.g. on reset to a new duration)
  useEffect(() => {
    totalSecondsRef.current = initialSeconds;
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            // Don't set isRunning false here — let the component detect seconds===0 first
            if (intervalRef.current) clearInterval(intervalRef.current);
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

  // Auto-stop running state when seconds hits 0
  useEffect(() => {
    if (seconds === 0 && isRunning) {
      setIsRunning(false);
    }
  }, [seconds, isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds: number) => {
    setIsRunning(false);
    setSeconds(newSeconds);
    totalSecondsRef.current = newSeconds;
  }, []);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    progress: totalSecondsRef.current > 0 ? 1 - seconds / totalSecondsRef.current : 0,
  };
}
