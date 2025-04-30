import { useState, useEffect, useRef, useCallback } from 'react';

const useTimer = (
  initialTime: number,
  onTimeEnd: () => void,
  isRunning: boolean,
  restart: boolean
) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const initialTimeRef = useRef<number>(initialTime);

  const onTimeEndRef = useRef(onTimeEnd);
  useEffect(() => {
    onTimeEndRef.current = onTimeEnd;
  }, [onTimeEnd]);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimerInterval();
    initialTimeRef.current = initialTime;
    setTimeLeft(initialTime);
    startTimeRef.current = Date.now();

    if (initialTime <= 0) return;

    intervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      const currentInitial = initialTimeRef.current;

      if (currentInitial > elapsedSeconds) {
        setTimeLeft(currentInitial - elapsedSeconds);
      } else {
        setTimeLeft(0);
        clearTimerInterval();
        onTimeEndRef.current();

        if (restart) {
          startTimer();
        }
      }
    }, 1000);
  }, [initialTime, restart, clearTimerInterval]);

  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current === null) {
        startTimer();
      }
    } else {
      clearTimerInterval();
    }
  }, [isRunning, startTimer, clearTimerInterval]);

  useEffect(() => {
    setTimeLeft(initialTime);
    initialTimeRef.current = initialTime;
    if (isRunning) {
      startTimer();
    } else {
      clearTimerInterval();
    }
  }, [initialTime]);

  useEffect(() => {
    return clearTimerInterval;
  }, [clearTimerInterval]);

  return { time: timeLeft };
};

export default useTimer;
