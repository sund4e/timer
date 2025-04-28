import { useState, useEffect, useRef } from 'react';

const useTimer = (
  time: number,
  onTimeEnd: () => void,
  isRunning: boolean,
  restart: boolean
) => {
  const [timeLeft, setTimeLeft] = useState(time);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    timer.current && clearTimeout(timer.current);
    const startTime = Date.now();
    timer.current = setInterval(() => {
      const timeGone = Math.round((Date.now() - startTime) / 1000);
      if (time >= timeGone) {
        setTimeLeft(time - timeGone);
      } else {
        setTimeLeft(0);
      }
    }, 100);
  };

  useEffect(() => {
    if (timeLeft === 0 && time !== 0) {
      onTimeEnd();
      timer.current && clearTimeout(timer.current);
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
      timer.current && clearTimeout(timer.current);
    }
  }, [isRunning]);

  useEffect(() => {
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, []);

  return { time: timeLeft };
};

export default useTimer;
