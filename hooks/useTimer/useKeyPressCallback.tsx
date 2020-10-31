import { useEffect } from 'react';

const useKeyPressCallBack = (key: string, callback: () => void) => {
  const pressHandler = ({ key: keyPressed }: { key: string }) => {
    if (key === keyPressed) {
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
