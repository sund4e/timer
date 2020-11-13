import { useState, useEffect, useRef } from 'react';

const useTimer = (startTime: number, onTimeEnd: () => void) => {
  const [time, setTime] = useState(startTime);
  const timer = useRef<number>();

  useEffect(() => {
    setTime(startTime);
    clearTimeout(timer.current);
  }, [startTime]);

  const nextTick = () => {
    timer.current = setTimeout(() => {
      setTime(time - 1);
    }, 1000);
  };

  useEffect(() => {
    if (time === 0) {
      onTimeEnd();
    } else {
      nextTick();
    }
    return () => {
      clearTimeout(timer.current);
    };
  }, [time]);

  const pause = () => {
    clearTimeout(timer.current);
  };

  const start = () => {
    if (!timer.current) {
      nextTick();
    }
  };

  return { time, start, pause };
};

export default useTimer;
