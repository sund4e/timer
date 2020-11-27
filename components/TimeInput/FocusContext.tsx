import React, { createContext, useContext, useState } from 'react';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';

export type FocusContextType = {
  focusIndex: number | null;
  setFocusIndex: (newIndex: number | null) => void;
};
export const FocusContext = createContext<FocusContextType>({
  focusIndex: 0,
  setFocusIndex: () => {},
});

export const FocusContextProvider = ({
  children,
  initialIndex,
  maxIndex,
}: // onFinish,
// allowFocus,
// claimFocus,
{
  children: React.ReactNode;
  initialIndex: number;
  maxIndex: number;
  // onFinish: () => void;
  // claimFocus: () => void;
}) => {
  const [focusIndex, setFocusIndex] = useState<number | null>(initialIndex);

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

  const setIndex = (newIndex: number) => {
    if (newIndex > maxIndex) {
      setFocusIndex(null);
      // onFinish();
    } else {
      // if (!allowFocus) claimFocus();
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
