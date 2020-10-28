import { useState, useEffect } from 'react';

const useTimer = (startTime: number, onTimeEnd: () => void) => {
  const [time, setTime] = useState(startTime);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    console.log('effect');
    if (time === 0) {
      onTimeEnd();
    } else if (!isPaused) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time, isPaused]);

  const pause = () => {
    setIsPaused(true);
  };

  const setNewTime = (seconds: number) => {
    console.log('newTime!');
    setTime(seconds);
    setIsPaused(false);
  };
  console.log('render');
  return { time, setTime: setNewTime, pause };
};

export default useTimer;
