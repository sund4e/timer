import TimeInput from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect, useRef, useState } from 'react';

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
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const timerIsRunningRef = useRef(timerIsRunning);

  useEffect(() => {
    timerIsRunningRef.current = timerIsRunning;
  }, [timerIsRunning]);

  // Ensure timer does not start running if focused when chaninging window
  useEffect(() => {
    const handleBlur = () => {
      if(!timerIsRunningRef.current) {
        setTimerIsRunning(false);
      }
    };
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if(!isFocused && isActive) {
      setTimerIsRunning(true);
    } else {
      setTimerIsRunning(false);
    }
  }, [isFocused, isActive]);

  const { time } = useTimer(
    startTime,
    hanldeEnd,
    timerIsRunning,
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
