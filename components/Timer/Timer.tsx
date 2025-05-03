import TimeInput, { Input } from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect, useState, useRef, MutableRefObject } from 'react';

export type Props = {
  onTimeEnd: () => void;
  isActive: boolean;
  initialTime: number;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  restart: boolean;
  className?: string;
  setTitleTime: (seconds: number) => void;
};

const Timer = ({
  onTimeEnd,
  isActive,
  initialTime,
  restart,
  isFocused,
  setIsFocused,
  className,
  setTitleTime,
}: Props) => {
  const [startTime, setStartTime] = useState(initialTime);
  const { time } = useTimer(
    startTime,
    hanldeEnd,
    !isFocused && isActive,
    restart
  );

  useEffect(() => {
    if (isActive) {
      setTitleTime(time);
    }
  }, [time, isActive]);

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
      className={className}
      value={time}
      onChange={onChange}
      isFocused={isFocused}
      onFocus={onFocus}
    />
  );
};

export default Timer;
