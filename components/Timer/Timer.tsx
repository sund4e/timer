import TimeInput from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect, useRef, useState } from 'react';

export type Props = {
  onTimeEnd: () => void;
  isRunning: boolean;
  initialTime: number;
  restart: boolean;
  className?: string;
  setTitleTime: (seconds: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused: boolean;
};

const Timer = ({
  onTimeEnd,
  isRunning,
  initialTime,
  restart,
  className,
  setTitleTime,
  onFocus,
  onBlur,
  isFocused,
}: Props) => {
  const [startTime, setStartTime] = useState(initialTime);
  const { time } = useTimer(
    startTime,
    hanldeEnd,
    isRunning,
    restart
  );

  useEffect(() => {
    if (isRunning) {
      setTitleTime(time);
    }
  }, [time, isRunning]);

  function hanldeEnd() {
    onTimeEnd();
  }

  const onChange = (seconds: number) => {
    setStartTime(seconds);
  };

  return (
    <TimeInput
      className={className}
      value={time}
      onChange={onChange}
      isFocused={isFocused}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default Timer;
