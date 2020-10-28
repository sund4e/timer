import TimeInput from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect } from 'react';

const Timer = () => {
  const handleEnd = () => {
    console.log('END');
  };
  const { time, setTime, pause } = useTimer(10, handleEnd);

  const onFocus = () => {
    pause();
  };

  const onChange = (seconds: number) => {
    setTime(seconds);
  };

  return <TimeInput value={time} onChange={onChange} onFocus={onFocus} />;
};

export default Timer;
