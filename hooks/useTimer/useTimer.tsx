import { useCallback, useEffect, useRef, useState } from 'react';

const useTimer = (
  initialTimeSeconds: number,
  onTimeEnd: () => void,
  isRunning: boolean,
  restart: boolean
) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(initialTimeSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevInitialTimeSecods = useRef(initialTimeSeconds);

  // Update time left when initial time changes
  useEffect(() => {
    if (initialTimeSeconds !== prevInitialTimeSecods.current) {
      setTimeLeftSeconds(initialTimeSeconds);
      prevInitialTimeSecods.current = initialTimeSeconds;
    }
  }, [initialTimeSeconds]);

  const intervalCallback = useCallback(() => {
    setTimeLeftSeconds((prevTime) => Math.max(0, prevTime - 1));
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearTimer();
    }
    intervalRef.current = setInterval(intervalCallback, 1000);
  }, [intervalCallback]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Handle time end
  useEffect(() => {
    if (timeLeftSeconds <= 0 && initialTimeSeconds > 0) {
      if (intervalRef.current) {
        onTimeEnd();
        clearTimer();
      }

      if (restart) {
        setTimeLeftSeconds(initialTimeSeconds);
        startTimer();
      }
    }
  }, [timeLeftSeconds, restart, initialTimeSeconds, onTimeEnd]);

  // Start or stop timer based on isRunning prop
  useEffect(() => {
    if (isRunning && timeLeftSeconds > 0 && !intervalRef.current) {
      startTimer();
    } else if (!isRunning && intervalRef.current) {
      clearTimer();
    }
  }, [isRunning, startTimer, timeLeftSeconds]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimer();
  }, []);

  return { time: timeLeftSeconds };
};

export default useTimer;
