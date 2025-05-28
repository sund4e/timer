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
  onDirty?: () => void;
  onChange: (seconds: number) => void;
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
  onChange,
}: Props) => {
  const [startTime, setStartTime] = useState(initialTime);
  const { time, startTimer, stopTimer } = useTimer(startTime, hanldeEnd);

  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [isRunning, startTimer, stopTimer]);

  useEffect(() => {
    if (isRunning) {
      setTitleTime(time);
    }
  }, [time, isRunning, setTitleTime]);

  function hanldeEnd() {
    onTimeEnd();
  }

  const onChangeTimeInput = (seconds: number) => {
    setStartTime(seconds);
    onChange(seconds);
  };

  return (
    <TimeInput
      className={className}
      value={time}
      onChange={onChangeTimeInput}
      onDirty={onDirty}
      isFocused={isFocused}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default Timer;
