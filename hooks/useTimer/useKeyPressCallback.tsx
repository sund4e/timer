import { useEffect } from 'react';

const useKeyPressCallBack = (key: string, callback: () => void) => {
  const pressHandler = (e: KeyboardEvent) => {
    if (key === e.key) {
      e.preventDefault();
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', pressHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', pressHandler);
    };
  }, []);
};

export default useKeyPressCallBack;
