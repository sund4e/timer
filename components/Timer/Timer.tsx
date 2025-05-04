import TimeInput from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect, useState } from 'react';

export type Props = {
  onTimeEnd: () => void;
  isActive: boolean;
  initialTime: number;
  initialFocus?: boolean;
  restart: boolean;
  className?: string;
  setTitleTime: (seconds: number) => void;
};

const Timer = ({
  onTimeEnd,
  isActive,
  initialTime,
  restart,
  initialFocus,
  className,
  setTitleTime,
}: Props) => {
  const [startTime, setStartTime] = useState(initialTime);
  const [isFocused, setIsFocused] = useState(!!initialFocus);
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

  const onBlur = () => {
    setIsFocused(false);
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
      onBlur={onBlur}
    />
  );
};

export default Timer;
