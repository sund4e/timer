import { useEffect, useState, useCallback } from 'react';
import Toggle from '../Toggle';

export type Props = {
  setNotify: (notify: () => void) => void;
  initialShow: boolean;
};

const NotificationToggle = ({ setNotify, initialShow = true }: Props) => {
  const [showNotification, setShowNotification] = useState(initialShow);
  const [isDenied, setIsDenied] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);

  useEffect(() => {
    if (showNotification && isBrowserSupported) {
      if (Notification.permission === 'denied') {
        setIsDenied(true);
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            setIsDenied(false);
          }
        });
      }
    }
  }, [showNotification, isBrowserSupported]);

  useEffect(() => {
    if ('Notification' in window) {
      setIsBrowserSupported(true);
    }
  }, []);

  const notify = useCallback(() => {
    if (showNotification && !isDenied && isBrowserSupported) {
      new Notification(`Time's up!`);
    }
  }, [showNotification, isDenied, isBrowserSupported]);

  useEffect(() => {
    setNotify(notify);
  }, [notify]);

  return isBrowserSupported ? (
    <Toggle
      label={'Notifications'}
      isOn={showNotification}
      setIsOn={setShowNotification}
    />
  ) : (
    <></>
  );
};

export default NotificationToggle;