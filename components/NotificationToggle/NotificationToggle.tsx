import { useEffect, useState, useCallback } from 'react';
import Toggle from '../Toggle';

export type Props = {
  setNotify: (notify: () => void) => void;
  children: (isDenied: boolean) => React.ReactNode;
};

const NotificationToggle = ({ setNotify, children }: Props) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isDenied, setIsDenied] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsBrowserSupported(true);

      if (Notification.permission === 'granted') {
        setShowNotification(true);
      } else if (Notification.permission === 'denied') {
        setIsDenied(true);
      }
    }
  }, []);

  const changeShowNotification = (showNotification: boolean) => {
    if (showNotification && isBrowserSupported) {
      if (Notification.permission === 'granted') {
        setShowNotification(true);
      } else {
        setShowNotification(false);
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            setShowNotification(true);
            setIsDenied(false);
          } else if (permission === 'denied') {
            setIsDenied(true);
          }
        });
      }
    } else {
      setShowNotification(false);
    }
  };

  const notify = useCallback(() => {
    if (showNotification && isBrowserSupported) {
      new Notification(`Time's up!`);
    }
  }, [showNotification, isBrowserSupported]);

  useEffect(() => {
    setNotify(notify);
  }, [notify, setNotify]);

  return isBrowserSupported ? (
    <Toggle
      isOn={showNotification}
      setIsOn={(isOn: boolean) => changeShowNotification(isOn)}
    >
      {children(isDenied)}
    </Toggle>
  ) : (
    <></>
  );
};

export default NotificationToggle;
