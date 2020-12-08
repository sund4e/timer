import { useState, useEffect, useRef } from 'react';

const useTimer = (
  time: number,
  onTimeEnd: () => void,
  isRunning: boolean,
  restart: boolean
) => {
  const [timeLeft, setTimeLeft] = useState(time);
  const timer = useRef<number>();

  const startTimer = () => {
    clearTimeout(timer.current);
    const startTime = Date.now();
    timer.current = setInterval(() => {
      const timeGone = Math.round((Date.now() - startTime) / 1000);
      if (timeGone === time) {
        onTimeEnd();
        clearTimeout(timer.current);
        if (restart) startTimer();
      } else {
        setTimeLeft(time - timeGone);
      }
    }, 100);
  };

  useEffect(() => {
    setTimeLeft(time);
    if (isRunning) {
      startTimer();
    }
  }, [time]);

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      clearTimeout(timer.current);
    }
  }, [isRunning]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return { time: timeLeft };
};

export default useTimer;
