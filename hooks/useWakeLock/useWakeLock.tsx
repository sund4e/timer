import { useRef, useCallback } from 'react';

function useWakeLock() {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const request = useCallback(() => {
    if (document.visibilityState !== 'visible') {
      return;
    }

    if (navigator.wakeLock) {
      navigator.wakeLock
        .request('screen')
        .then((lock) => {
          wakeLock.current = lock;
        })
        .catch((err) => {
          console.error('Native Wake Lock request failed:', err);
        });
    }
  }, []);

  const release = useCallback(() => {
    if (wakeLock.current) {
      wakeLock.current.release().then(() => {
        wakeLock.current = null;
      });
    }
  }, []);

  return { request, release };
}

export default useWakeLock;
