import { useEffect, useRef } from 'react';

const useKeyPressCallBack = (element: HTMLElement | null, key: string, callback: () => void) => {
  const callbackRef = useRef<() => void>(() => {});

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const pressHandler = (e: KeyboardEvent | Event) => {
      if (key === (e as KeyboardEvent).key) {
        e.preventDefault();
        callbackRef.current();
      }
    };
    (element || window).addEventListener('keydown', pressHandler);
    // Remove event listeners on cleanup
    return () => {
      (element || window).removeEventListener('keydown', pressHandler);
    };
  }, [element, key]);
};

export default useKeyPressCallBack;
