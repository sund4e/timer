import styled from 'styled-components';
import SingleInput from '../SingleInput/SingleInput';
import { Theme } from '../../styles/theme';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFocusIndex } from '../FocusContext';

const ValidatedSingleInput = styled(SingleInput)<{
  $isInvalid: boolean;
}>`
  ${({ theme, $isInvalid }) =>
    $isInvalid ? `color: ${theme.colors.accent}` : ''};
  transition: ${({ theme }) => theme.transition}s;
`;

export type Props = {
  onChange: (value: number) => void;
  value: number;
  indexes: number[];
  maxValue: number;
  size: number;
  className?: string;
};

const getValueAsArray = (value: number, size: number): number[] => {
  const valueArray = Array.from(value.toString()).map((value) =>
    parseInt(value)
  );
  if (valueArray.length < size) {
    const defict = size - valueArray.length;
    const defictArray = new Array(defict).fill(0);
    return [...defictArray, ...valueArray];
  }

  if (valueArray.length > size) {
    return valueArray.slice(0, size);
  }

  return valueArray;
};

const NumberInput = ({
  value,
  onChange,
  indexes,
  maxValue,
  size,
  className,
}: Props) => {
  const { focusIndex: globalFocusIndex, setFocusIndex } = useFocusIndex();
  const [isInvalid, setIsInvalid] = useState(false);

  const focusIndex = useMemo(() => {
    return globalFocusIndex !== null
      ? indexes.indexOf(globalFocusIndex) < 0
        ? null
        : indexes.indexOf(globalFocusIndex)
      : null;
  }, [globalFocusIndex, indexes]);

  useEffect(() => {
    if (focusIndex === null) {
      setIsInvalid(false);
    }
  }, [focusIndex]);

  const onClick = useCallback((index: number) => {
    setFocusIndex(indexes[index]);
  }, [setFocusIndex, indexes]);

  const inputValue = getValueAsArray(value, size);

  const handleSingleInputChange = useCallback((localIndex: number) => (newValue: number) => {
    if (newValue < 0 || newValue > 9) { 
      return;
    } 
    
    if (isInvalid) setIsInvalid(false);

    const currentInputValue = getValueAsArray(value, size);
    const newNumber = parseInt(
      Object.assign([], currentInputValue, { [localIndex]: newValue }).join('')
    );
    onChange(newNumber);

    if (globalFocusIndex !== null) { 
      const currentGlobalIndex = globalFocusIndex;
      const nextGlobalIndex = currentGlobalIndex + 1;

      setTimeout(() => {
        setFocusIndex(nextGlobalIndex); 
      }, 0); 
    }
  }, [onChange, value, size, isInvalid, indexes, setFocusIndex, globalFocusIndex]);

  return (
    <>
      {inputValue.map((num: number, index: number) => {
        const currentGlobalIndex = indexes[index]; 
        return (
          <ValidatedSingleInput
            $isInvalid={isInvalid && globalFocusIndex === currentGlobalIndex}
            className={className}
            key={currentGlobalIndex} 
            onChange={handleSingleInputChange(index)} 
            value={num}
            isFocused={globalFocusIndex === currentGlobalIndex}
            onClick={() => onClick(index)} 
          />
        );
      })}
    </>
  );
};

export default NumberInput;
