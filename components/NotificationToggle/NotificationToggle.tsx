import { useEffect, useState, useCallback } from 'react';
import Toggle from '../Toggle';

export type Props = {
  setNotify: (notify: () => void) => void;
};

const NotificationToggle = ({ setNotify }: Props) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isDenied, setIsDenied] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);

  useEffect(() => {
    if (showNotification && isBrowserSupported) {
      if (Notification.permission !== 'granted') {
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

      if (Notification.permission === 'granted') {
        setShowNotification(true);
      }
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
