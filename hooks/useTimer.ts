import { useState, useRef, useCallback, useEffect } from 'react';

const useTimer = (initialDuration = 0) => {
  const [time, setTime] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRunning]);

  const start = useCallback(() => {
    if (!isRunning && time > 0) {
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        setTime(prevTime => {
            if (prevTime <= 1) {
                pause();
                return 0;
            }
            return prevTime - 1;
        });
      }, 1000);
    }
  }, [isRunning, time, pause]);

  const reset = useCallback((newDuration: number) => {
    pause();
    setTime(newDuration);
  }, [pause]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return { time, isRunning, start, pause, reset, formattedTime: formatTime(time) };
};

export default useTimer;