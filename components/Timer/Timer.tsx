import TimeInput, { Input } from '../TimeInput';
import NotificationToggle from '../NotificationToggle';
import useTimer from '../../hooks/useTimer';
import { useEffect, useState, useRef, MutableRefObject } from 'react';

const Timer = () => {
  const { time, setTime, pause } = useTimer(10, onTimeEnd);
  const [isFocused, setIsFocused] = useState(true);
  const [notify, setNotify] = useState<(() => void) | null>(null);

  useEffect(() => {
    pause();
  }, []);

  const onFocus = () => {
    pause();
    setIsFocused(true);
  };

  const onChange = (seconds: number) => {
    setTime(seconds);
    setIsFocused(false);
  };

  function onTimeEnd() {
    if (notify) {
      notify();
    }
  }

  return (
    <>
      <TimeInput
        value={time}
        onChange={onChange}
        isFocused={isFocused}
        onFocus={onFocus}
        initalFocus={Input.minutes}
      />
      <NotificationToggle
        setNotify={(notify) => setNotify(() => notify)}
        initialShow={true}
      />
    </>
  );
};

export default Timer;
