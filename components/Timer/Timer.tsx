import TimeInput, { Input } from '../TimeInput';
import useTimer from '../../hooks/useTimer';
import { useEffect, useState, useRef, MutableRefObject } from 'react';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';

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

  useKeyPressCallBack('Enter', () => {
    onFinish();
  });

  function hanldeEnd() {
    onTimeEnd();
  }

  const onFocus = () => {
    setIsFocused(true);
  };

  const onChange = (seconds: number) => {
    setStartTime(seconds);
  };

  function onFinish() {
    setIsFocused(false);
  }

  return (
    <TimeInput
      value={time}
      onChange={onChange}
      isFocused={isFocused}
      onFocus={onFocus}
      initalFocus={Input.minutes}
      onFinish={onFinish}
    />
  );
};

export default Timer;
