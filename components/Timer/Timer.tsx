import TimeInput from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect, useState } from 'react';

export type Props = {
  onTimeEnd: () => void;
  isRunning: boolean;
  initialTime: number;
  className?: string;
  setTitleTime: (seconds: number) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused: boolean;
  onDirty: (seconds: number) => void;
};

const Timer = ({
  onTimeEnd,
  isRunning,
  initialTime,
  className,
  setTitleTime,
  onFocus,
  onBlur,
  isFocused,
  onDirty,
}: Props) => {
  const [startTime, setStartTime] = useState(initialTime);
  const { time, startTimer, stopTimer } = useTimer(startTime, hanldeEnd);

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isRunning]);

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
    onDirty(seconds);
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
