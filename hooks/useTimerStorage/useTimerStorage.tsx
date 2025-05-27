type SavedTimerConfig = {
  id: string;
  initialTime: number;
};

function useTimerStorage(key: string): {
  getSavedTimers: () => SavedTimerConfig[] | null;
  setSavedTimers: (value: SavedTimerConfig[]) => void;
} {
  const getSavedTimers = (): SavedTimerConfig[] | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as SavedTimerConfig[]) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  };

  const setSavedTimers = (value: SavedTimerConfig[]) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  };

  return { getSavedTimers, setSavedTimers };
}

export default useTimerStorage;
