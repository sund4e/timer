import TimeInput, { Input } from '../TimeInput';
import NotificationToggle from '../NotificationToggle';
import Toggle from '../Toggle';
import useTimer from '../../hooks/useTimer';
import { useEffect, useState, useRef, MutableRefObject } from 'react';

export type Props = {
  onTimeEnd: () => void;
  isActive: boolean;
  initialTime: number;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
};

const Timer = ({
  onTimeEnd,
  isActive,
  initialTime,
  isFocused,
  setIsFocused,
}: Props) => {
  const [startTime, setStartTime] = useState(initialTime);
  const { time, start, pause } = useTimer(startTime, onTimeEnd);

  useEffect(() => {
    if (isFocused || !isActive) {
      pause();
    } else {
      start();
    }
  }, [isFocused, isActive]);

  const onFocus = () => {
    setIsFocused(true);
  };

  const onChange = (seconds: number) => {
    setStartTime(seconds);
    setIsFocused(false);
  };

  return (
    <>
      <TimeInput
        value={time}
        onChange={onChange}
        isFocused={isFocused}
        onFocus={onFocus}
        initalFocus={Input.minutes}
      />
    </>
  );
};

export default Timer;
