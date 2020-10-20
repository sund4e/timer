import { useState, useEffect } from 'react';
type Props = {
  startTime: number;
  onTimeEnd: () => void;
};

const Timer = ({ startTime, onTimeEnd }: Props) => {
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

export default Timer;
