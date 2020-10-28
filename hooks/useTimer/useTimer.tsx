import { useState, useEffect, useRef } from 'react';

const useTimer = (startTime: number, onTimeEnd: () => void) => {
  const [time, setTime] = useState(startTime);
  const [isPaused, setIsPaused] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    console.log('newTime', time);
    if (time === 0) {
      onTimeEnd();
    } else if (!isPaused) {
      timer.current = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time, isPaused]);

  const pause = () => {
    setIsPaused(true);
    clearTimeout(timer.current);
  };

  const setNewTime = (seconds: number) => {
    console.log('setNewTime', seconds);
    setTime(seconds);
    clearTimeout(timer.current);
    setIsPaused(false);
  };

  return { time, setTime: setNewTime, pause };
};

export default useTimer;
