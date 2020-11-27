import TimeInput, { Input } from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect, useState, useRef, MutableRefObject } from 'react';

export type Props = {
  onTimeEnd: () => void;
  isActive: boolean;
  initialTime: number;
  initialIsFocused: boolean;
  restart: boolean;
};

const Timer = ({
  onTimeEnd,
  isActive,
  initialTime,
  restart,
  initialIsFocused,
}: Props) => {
  const [startTime, setStartTime] = useState(initialTime);
  const [isFocused, setIsFocused] = useState(initialIsFocused);
  const { time } = useTimer(
    startTime,
    hanldeEnd,
    !isFocused && isActive,
    restart
  );

  function hanldeEnd() {
    onTimeEnd();
  }

  const onFocus = () => {
    setIsFocused(true);
  };

  const onChange = (seconds: number) => {
    setStartTime(seconds);
    setIsFocused(false);
  };

  return (
    <TimeInput
      value={time}
      onChange={onChange}
      isFocused={isFocused}
      onFocus={onFocus}
      initalFocus={Input.minutes}
    />
  );
};

export default Timer;
