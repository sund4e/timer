import styled from 'styled-components';
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import NumberInput from '../NumberInput/NumberInput';
import { Theme } from '../../styles/theme';
import { getHms, Input, getSeconds } from './timeConverters';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';
import { useFocusIndex } from '../FocusContext';

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  indexes: number[];
  maxValue: number;
};

const FocusInput = ({ value, onChange, indexes, maxValue }: Props) => {
  const { focusIndex: globalFocusIndex, setFocusIndex } = useFocusIndex();
  const [isInvalid, setIsInvalid] = useState(false);

  const onChangeInput = useCallback((newValue: number) => {
    if (newValue > maxValue) {
      setIsInvalid(true);
    } else {
      if (isInvalid) setIsInvalid(false);
      if (globalFocusIndex) setFocusIndex(globalFocusIndex + 1);
    }
    onChange(newValue);
  }, [maxValue, isInvalid, globalFocusIndex, onChange, setFocusIndex]);

  useEffect(() => {
    if (!globalFocusIndex) {
      setIsInvalid(false);
    }
  }, [globalFocusIndex]);

  const onClick = useCallback((index: number) => {
    setFocusIndex(indexes[index]);
  }, [setFocusIndex, indexes]);

  const focusIndex = useMemo(() => {
    return globalFocusIndex !== null
      ? indexes.indexOf(globalFocusIndex) < 0
        ? null
        : indexes.indexOf(globalFocusIndex)
      : null;
  }, [globalFocusIndex, indexes]);

  useEffect(() => {
    if (!focusIndex) {
      setIsInvalid(false);
    }
  }, [focusIndex]);

  return (
    <NumberInput
      invalidFocus={isInvalid}
      value={value}
      onChange={onChangeInput}
      onClick={onClick}
      focusIndex={focusIndex}
      size={indexes.length}
    />
  );
};

export default memo(FocusInput);
