import { useEffect, useRef } from 'react';

function useWakeLock(isOn: boolean) {
  const wakeLock = useRef<WakeLockSentinel>(null);
  const wakeLockRequest = useRef<Promise<WakeLockSentinel | null>>(null);
  const releaseRequest = useRef<Promise<void>>(null);

  const requestWakelock = async () => {
    if (navigator.wakeLock) {
      if (!wakeLockRequest.current) {
        wakeLockRequest.current = navigator.wakeLock.request('screen');
        try {
          wakeLock.current = await wakeLockRequest.current;
        } catch (err) {
          console.log(err);
        } finally {
          wakeLockRequest.current = null;
        }
      }
    }
    return null;
  };

  const releaseWakeLock = async () => {
    if (!releaseRequest.current && wakeLock.current) {
      releaseRequest.current = wakeLock.current.release();
      try {
        await releaseRequest.current;
        releaseRequest.current = null;
        wakeLock.current = null;
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (isOn) {
      if (releaseRequest.current) {
        releaseRequest.current.then(() => {
          requestWakelock();
        });
      } else {
        requestWakelock();
      }
    } else {
      if (wakeLockRequest.current) {
        wakeLockRequest.current.then(() => {
          releaseWakeLock();
        });
      } else {
        releaseWakeLock();
      }
    }
  }, [isOn]);
}

export default useWakeLock;
