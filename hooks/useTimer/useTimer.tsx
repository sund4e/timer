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
      if (time >= timeGone) {
        setTimeLeft(time - timeGone);
      }
    }, 100);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeEnd();
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (restart) startTimer();
      }, 1000);
    }
  }, [timeLeft]);

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
