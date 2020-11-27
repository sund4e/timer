import { fireEvent } from '@testing-library/dom';
import { useState, useEffect, useRef } from 'react';

const useTimer = (
  startTime: number,
  onTimeEnd: () => void,
  isRunning: boolean,
  restart: boolean
) => {
  const [time, setTime] = useState(startTime);
  const timer = useRef<number>();

  const nextTick = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (time === 0) {
        onTimeEnd();
        if (restart) setTime(startTime);
      } else {
        setTime(time - 1);
      }
    }, 1000);
  };

  useEffect(() => {
    setTime(startTime);
  }, [startTime]);

  useEffect(() => {
    if (isRunning) {
      nextTick();
    } else {
      clearTimeout(timer.current);
    }
    return () => {
      clearTimeout(timer.current);
    };
  }, [time, isRunning]);

  return { time };
};

export default useTimer;
