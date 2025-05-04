import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getHms, Input, getSeconds } from './timeConverters';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';
import SingleInput from '../SingleInput/SingleInput';
import React from 'react';

const Wrapper = styled.div<{
  $isFocused: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${({ theme, $isFocused }) =>
    $isFocused ? theme.colors.highlight : ''};
  transition: ${({ theme }) => theme.transition}s;
`;

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  className?: string;
};

const getDigits = (seconds: number) => {
  const hms = getHms(seconds);
  return [Math.floor(hms.hours / 10), hms.hours % 10, Math.floor(hms.minutes / 10), hms.minutes % 10, Math.floor(hms.seconds / 10), hms.seconds % 10];
};

const getSecondsFromDigits = (digits: number[]) => {
  return getSeconds({
    [Input.hours]: digits[0] * 10 + digits[1],
    [Input.minutes]: digits[2] * 10 + digits[3],
    [Input.seconds]: digits[4] * 10 + digits[5],
  });
};

const TimeInput = ({
  value,
  onChange,
  className,
  onFocus,
  onBlur,
  isFocused
}: Props) => {
  const [time, setTime] = useState(getDigits(value));
  const maxValues = [9, 9, 5, 9, 5, 9];
  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);
  const inputRef5 = useRef<HTMLInputElement>(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3, inputRef4, inputRef5];

  useEffect(() => {
    setTime(getDigits(value));
  }, [value]);

  const onReady = () => {
    onChange(getSecondsFromDigits(time));
    
    if (document.activeElement instanceof HTMLInputElement) {
      document.activeElement.blur();
    }
  }

  useEffect(() => {  
    if (isFocused) {
      if (!(document.activeElement instanceof HTMLInputElement && inputRefs.some(ref => ref.current === document.activeElement))) {
        inputRefs[2]?.current?.focus();
      }
    } else {
      if (document.activeElement instanceof HTMLInputElement && inputRefs.some(ref => ref.current === document.activeElement)) {
        document.activeElement.blur();
      }
    }
  }, [isFocused, inputRefs]);

  useKeyPressCallBack('Enter', () => {
    if (document.activeElement instanceof HTMLInputElement) {
      document.activeElement.blur();
    } else {
      inputRefs[2]?.current?.focus();
    }
  });

  const findFocusedIndex = useCallback(() => {
    return inputRefs.findIndex(ref => ref.current === document.activeElement);
  }, [inputRefs]);

  useKeyPressCallBack('ArrowRight', () => {
    const currentIndex = findFocusedIndex();
    const nextIndex = currentIndex + 1;
    if (currentIndex !== -1 && nextIndex < inputRefs.length) {
      inputRefs[nextIndex]?.current?.focus();
    }
  });

  useKeyPressCallBack('ArrowLeft', () => {
    const currentIndex = findFocusedIndex();
    const prevIndex = currentIndex - 1;
    if (currentIndex !== -1 && prevIndex >= 0) {
      inputRefs[prevIndex]?.current?.focus();
    }
  });

  const handleTimeChange = (index: number) => (newValue: number) => {
      const newTime = time.map((digit, i) => i === index ? newValue : digit);
      setTime(newTime);
      const nextIndex = index + 1;
      if (inputRefs[nextIndex]) {
        inputRefs[nextIndex]?.current?.focus();
      } else {
        onReady();
      }
  };

  return (
    <Wrapper $isFocused={isFocused} data-testid="time" className={className} onBlur={onBlur} onFocus={onFocus}>
      {time.map((digit, index) => (
        <React.Fragment key={index}>
          <SingleInput
            ref={inputRefs[index]}
            maxValue={maxValues[index]}
            onChange={handleTimeChange(index)} 
            value={digit}
          />
          {(index === 1 || index === 3) && <span>:</span>}
        </React.Fragment>
      ))}
    </Wrapper>
  );
};

export default TimeInput;
