import { useCallback, useEffect, useRef, useState } from 'react';

const useTimer = (
  initialTimeSeconds: number,
  onTimeEnd: () => void,
  isRunning: boolean,
  restart: boolean
) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(initialTimeSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeEndRef = useRef(onTimeEnd);
  const prevInitialTimeRef = useRef(initialTimeSeconds);
  const prevIsRunningRef = useRef(isRunning);
  const timeEndedRef = useRef(initialTimeSeconds <= 0);

  useEffect(() => {
    onTimeEndRef.current = onTimeEnd;
  }, [onTimeEnd]);

  useEffect(() => {
    if (initialTimeSeconds !== prevInitialTimeRef.current) {
      setTimeLeftSeconds(initialTimeSeconds);
      prevInitialTimeRef.current = initialTimeSeconds;
      timeEndedRef.current = initialTimeSeconds <= 0;
    }
  }, [initialTimeSeconds]);

  const intervalCallback = useCallback(() => {
    setTimeLeftSeconds((prevTime) => Math.max(0, prevTime - 1));
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    timeEndedRef.current = false;
    intervalRef.current = setInterval(intervalCallback, 1000);
  }, [intervalCallback]);

  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (!timeEndedRef.current) {
        onTimeEndRef.current();
        timeEndedRef.current = true;
      }

      if (restart && prevIsRunningRef.current) {
        setTimeLeftSeconds(initialTimeSeconds);
      }
    }
  }, [timeLeftSeconds, restart, initialTimeSeconds, onTimeEndRef]);

  useEffect(() => {
    if (isRunning && timeLeftSeconds > 0) {
      if (!prevIsRunningRef.current || !intervalRef.current) {
        startTimer();
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    prevIsRunningRef.current = isRunning;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, startTimer, timeLeftSeconds]);

  return { time: timeLeftSeconds };
};

export default useTimer;
