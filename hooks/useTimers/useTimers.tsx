import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';

type TimerConfig = {
  id: string;
  initialTime: number; // in seconds
  enterAnimation?: boolean;
};

const useTimers = (initialTimers: TimerConfig[]) => {
  const [timers, setTimers] = useState<TimerConfig[]>(initialTimers);

  const addTimerAtIndex = useCallback(
    (index: number, timer: TimerConfig) => {
      setTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        newTimers.splice(index, 0, timer);
        return newTimers;
      });
    },
    [setTimers]
  );

  const removeTimerAtIndex = useCallback(
    (index: number) => {
      if (timers.length === 1) {
        return;
      }
      setTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        newTimers.splice(index, 1);
        return newTimers;
      });
    },
    [setTimers, timers]
  );

  const editTimerAtIndex = useCallback(
    (index: number, timer: Partial<TimerConfig>) => {
      setTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        newTimers[index] = { ...newTimers[index], ...timer };
        return newTimers;
      });
    },
    [setTimers]
  );

  const resetTimers = useCallback(() => {
    setTimers((prevTimers) => {
      const newTimers = prevTimers.map((timer) => ({ ...timer, id: uuid() }));
      return newTimers;
    });
  }, [setTimers]);

  return {
    timers: timers,
    addTimerAtIndex,
    removeTimerAtIndex,
    resetTimers,
    editTimerAtIndex,
  };
};

export default useTimers;
