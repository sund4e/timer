function useStorage<T>(key: string): {
  getSavedItem: () => T | null;
  setSavedItem: (value: T) => void;
} {
  const getSavedItem = (): T | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  };

  const setSavedItem = (value: T) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  };

  return { getSavedItem, setSavedItem };
}

export default useStorage;
