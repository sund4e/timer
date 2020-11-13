import Timer from '../Timer';
import NotificationToggle from '../NotificationToggle';
import Toggle from '../Toggle';
import { useState } from 'react';

const TimerApp = () => {
  const [notify, setNotify] = useState<(() => void) | null>(null);
  const [restart, setRestart] = useState(true);
  const [isFocused, setIsFocused] = useState(true);

  function onTimeEnd() {
    if (notify) {
      notify();
    }
  }

  return (
    <>
      <Timer
        restart={restart}
        onTimeEnd={onTimeEnd}
        isActive={true}
        initialTime={1200}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
      />
      <NotificationToggle
        setNotify={(notify) => setNotify(() => notify)}
        initialShow={true}
      />
      <Toggle
        isOn={restart}
        setIsOn={setRestart}
        label={'Restart timer when done'}
      />
    </>
  );
};

export default TimerApp;
