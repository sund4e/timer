import { useRef, useCallback } from 'react';

function useWakeLock() {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const request = useCallback(async () => {
    if (document.visibilityState !== 'visible' || !navigator.wakeLock) {
      return;
    }

    try {
      if (!wakeLock.current) {
        wakeLock.current = await navigator.wakeLock.request('screen');
        console.log('request wakelock');
      }
    } catch (err) {
      console.error('Wake Lock request failed:', err);
    }
  }, []);

  const release = useCallback(async () => {
    if (wakeLock.current) {
      await wakeLock.current.release();
      console.log('release wakelock');
      wakeLock.current = null;
    }
  }, []);

  return { request, release };
}

export default useWakeLock;
