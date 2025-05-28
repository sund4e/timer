import { useCallback, useEffect, useRef, useState } from 'react';

const useTimer = (initialTimeSeconds: number, onTimeEnd: () => void) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(initialTimeSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevInitialTimeSecods = useRef(initialTimeSeconds);

  const intervalCallback = useCallback(() => {
    setTimeLeftSeconds((prevTime) => Math.max(0, prevTime - 1));
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearTimer();
    }
    intervalRef.current = setInterval(intervalCallback, 1000);
  }, [intervalCallback, clearTimer]);

  useEffect(() => {
    // inital time changed, we should reset timer without calling onTimeEnd
    if (initialTimeSeconds !== prevInitialTimeSecods.current) {
      setTimeLeftSeconds(initialTimeSeconds);
      prevInitialTimeSecods.current = initialTimeSeconds;
    } else {
      if (timeLeftSeconds <= 0 && initialTimeSeconds > 0) {
        if (intervalRef.current) {
          onTimeEnd();
          clearTimer();
        }

        setTimeLeftSeconds(initialTimeSeconds);
      }
    }
  }, [initialTimeSeconds, timeLeftSeconds, onTimeEnd, clearTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { time: timeLeftSeconds, startTimer, stopTimer: clearTimer };
};

export default useTimer;
