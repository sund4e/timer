import React, { createContext, useContext, useState, useEffect } from 'react';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';

export type FocusContextType = {
  focusIndex: number | null;
  setFocusIndex: (newIndex: number | null) => void;
};
export const FocusContext = createContext<FocusContextType>({
  focusIndex: 0,
  setFocusIndex: () => {},
});

export type Props = {
  children: React.ReactNode;
  initialIndex: number | null;
  maxIndex: number;
  onFocus?: () => void;
  allowFocus: boolean;
};

export const FocusContextProvider = ({
  children,
  initialIndex,
  maxIndex,
  onFocus,
  allowFocus,
}: Props) => {
  const [focusIndex, setFocusIndex] = useState<number | null>(initialIndex);

  useEffect(() => {
    if (!allowFocus) {
      setFocusIndex(null);
    }
  }, [allowFocus]);

  useKeyPressCallBack('ArrowRight', () => {
    setFocusIndex((previousIndex) => {
      if (previousIndex === null) return null;
      const newIndex = previousIndex + 1;
      return newIndex < maxIndex ? newIndex : previousIndex;
    });
  });

  useKeyPressCallBack('ArrowLeft', () => {
    setFocusIndex((previousIndex) => {
      if (previousIndex === null) return null;
      const newIndex = previousIndex - 1;
      return newIndex > 0 ? newIndex : previousIndex;
    });
  });

  const setIndex = (newIndex: number | null) => {
    if (newIndex && newIndex > maxIndex) {
      setFocusIndex(null);
    } else {
      if (newIndex !== null && onFocus) {
        onFocus();
      }
      setFocusIndex(newIndex);
    }
  };

  const context = {
    focusIndex: focusIndex,
    setFocusIndex: setIndex,
  };

  return (
    <FocusContext.Provider value={context}>{children}</FocusContext.Provider>
  );
};

export const useFocusIndex = () => useContext(FocusContext);
