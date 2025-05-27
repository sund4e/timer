import { useCallback, useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import useTimerStorage from '../useTimerStorage/useTimerStorage';

type TimerConfig = {
  id: string;
  initialTime: number; // in seconds
  enterAnimation?: boolean;
};

const useTimers = (initialTimers: TimerConfig[]) => {
  const { getSavedTimers, setSavedTimers } = useTimerStorage('timers');
  const [timers, setTimers] = useState<TimerConfig[]>(initialTimers);

  useEffect(() => {
    const saved = getSavedTimers();
    if (saved) {
      setTimers(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timers.length > 0) {
      setSavedTimers(
        timers.map((timer) => ({
          id: timer.id,
          initialTime: timer.initialTime,
        }))
      );
    }
  }, [timers, setSavedTimers, initialTimers, getSavedTimers]);

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
