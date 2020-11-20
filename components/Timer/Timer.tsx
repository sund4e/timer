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
  const { time, start, pause } = useTimer(startTime, hanldeEnd);

  useKeyPressCallBack('Enter', () => {
    onFinish();
  });

  useEffect(() => {
    if (isFocused || !isActive) {
      pause();
    } else {
      start();
    }
  }, [isFocused, isActive]);

  function hanldeEnd() {
    if (restart) {
      start();
    }
    onTimeEnd();
  }

  const onFocus = () => {
    setIsFocused(true);
  };

  const onChange = (seconds: number) => {
    setStartTime(seconds);
  };

  function onFinish() {
    console.log('setisFocused: false');
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
