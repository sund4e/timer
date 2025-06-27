import { useEffect, useState, useCallback } from 'react';

export function useNotification(): {
  showNotification: () => void;
  browserSupported: boolean;
  requestNotificationPermission: () => Promise<boolean>;
} {
  const [isBrowserSupported, setIsBrowserSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsBrowserSupported(true);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (isBrowserSupported) {
      if (Notification.permission === 'granted') {
        return true;
      } else {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          return true;
        } else if (permission === 'denied') {
          return false;
        }
      }
    }
    return false;
  };

  const showNotification = useCallback(() => {
    if (isBrowserSupported) {
      new Notification(`Time's up!`, { icon: '/logo.png', badge: '/logo.png' });
    }
  }, [isBrowserSupported]);

  return {
    showNotification,
    requestNotificationPermission,
    browserSupported: isBrowserSupported,
  };
}
