import TimeInput, { Input } from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect, useState } from 'react';

const Timer = () => {
  const [isTimeInputFocused, setIsTimeInputFocused] = useState(false);
  const handleEnd = () => {
    console.log('END');
  };
  const { time, setTime, pause } = useTimer(10, handleEnd);

  useEffect(() => {
    pause();
  }, []);

  const onFocus = () => {
    pause();
    setIsTimeInputFocused(true);
  };

  const onChange = (seconds: number) => {
    setTime(seconds);
    setIsTimeInputFocused(false);
  };

  return (
    <TimeInput
      value={time}
      onChange={onChange}
      onFocus={onFocus}
      initalFocus={Input.minutes}
    />
  );
};

export default Timer;
