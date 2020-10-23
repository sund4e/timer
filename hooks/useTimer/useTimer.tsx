import { useState, useEffect } from 'react';

const useTimer = (startTime: number, onTimeEnd: () => void) => {
  const [time, setTime] = useState(startTime);
  useEffect(() => {
    if (time === 0) {
      onTimeEnd();
    } else {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);
  return time;
};

export default useTimer;
