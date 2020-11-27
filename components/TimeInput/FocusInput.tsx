import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import NumberInput from '../NumberInput/NumberInput';
import { Theme } from '../../styles/theme';
import { getHms, Input, getSeconds } from './timeConverters';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';
import { useFocusIndex } from './FocusContext';

const StyledNumberInput = styled(NumberInput)`
  ${({ theme, isInvalid }: { theme: Theme; isInvalid: boolean }) =>
    isInvalid ? `color: ${theme.colors.accent}` : ''};
  transition: ${({ theme }) => theme.transition}s;
`;

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  indexes: number[];
  maxValue: number;
};

const FocusInput = ({ value, onChange, indexes, maxValue }: Props) => {
  const { focusIndex, setFocusIndex } = useFocusIndex();
  const [isInvalid, setIsInvalid] = useState(false);

  const onChangeInput = (newValue: number) => {
    if (!focusIndex) return;
    if (newValue > maxValue) {
      setIsInvalid(true);
    } else {
      if (isInvalid) setIsInvalid(false);
      setFocusIndex(focusIndex + 1);
    }
    onChange(newValue);
  };

  const onClick = (index: number) => {
    setFocusIndex(indexes[index]);
  };

  return (
    <StyledNumberInput
      isInvalid={isInvalid && focusIndex !== undefined}
      value={value}
      onChange={onChangeInput}
      onClick={onClick}
      focusIndex={focusIndex && indexes.indexOf(focusIndex)}
      size={indexes.length}
    />
  );
};

export default FocusInput;
