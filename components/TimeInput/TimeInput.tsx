import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback, FocusEvent } from 'react';
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
  color: ${({ theme, $isFocused }) =>
    $isFocused ? theme.colors.highlight : ''};
  transition: ${({ theme }) => theme.transition}s;
`;

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  isFocused: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
};

const getDigits = (seconds: number) => {
  const hms = getHms(seconds);
  return [Math.floor(hms.hours / 10), hms.hours % 10, Math.floor(hms.minutes / 10), hms.minutes % 10, Math.floor(hms.seconds / 10), hms.seconds % 10];
};

export const getSecondsFromDigits = (digits: number[]) => {
  return getSeconds({
    [Input.hours]: digits[0] * 10 + digits[1],
    [Input.minutes]: digits[2] * 10 + digits[3],
    [Input.seconds]: digits[4] * 10 + digits[5],
  });
};

const maxValues = [9, 9, 5, 9, 5, 9];
const isValidTime = (time: number[]) => {
  return time.every((digit, index) => 
    !isNaN(digit) && digit >= 0 && digit <= maxValues[index]
  );
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
  const [internallyFocused, setInternallyFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {  
    if (isFocused) {
       if (!internallyFocused && !(wrapperRef.current?.contains(document.activeElement))) {
        inputRefs[2]?.current?.focus(); 
       }
    } else {
      if (internallyFocused && wrapperRef.current?.contains(document.activeElement)) {
         if (document.activeElement instanceof HTMLElement) {
           document.activeElement.blur();
         }
      }
    }
    setInternallyFocused(isFocused); 
  }, [isFocused, internallyFocused, inputRefs]);

  const onChangeTime = useCallback((seconds: number) => {
    if (seconds !== value) {
      onChange(seconds);
    }
  }, [onChange, time]);

  useKeyPressCallBack('Enter', () => {
    if (internallyFocused && isValidTime(time)) {
      onChangeTime(getSecondsFromDigits(time));
      onBlur?.();
    } else {
      onFocus?.(); 
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

  const handleTimeChange = useCallback((index: number) => (newValue: number) => {
    const newTime = time.map((digit, i) => i === index ? newValue : digit);
    setTime(newTime);
    if (!isValidTime(newTime)) {
      return;
    }
    const nextIndex = index + 1;
    if (inputRefs[nextIndex]) {
      setTimeout(() => {
         inputRefs[nextIndex]?.current?.focus();
      }, 0);
    } else {
      inputRefs[index]?.current?.blur();
      onChangeTime(getSecondsFromDigits(newTime));
    }
  }, [time, inputRefs, onChangeTime]);

  const handleFocusCapture = useCallback(() => {
    if (!internallyFocused) {
      setInternallyFocused(true);
      onFocus?.();
    }
  }, [internallyFocused, onFocus]);

  const handleBlurCapture = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.relatedTarget as Node)) {
        if (internallyFocused && isValidTime(time)) {
           setInternallyFocused(false);
           onBlur?.();
           onChangeTime(getSecondsFromDigits(time)); 
        }
    }
  }, [internallyFocused, onBlur, time]);

  return (
    <Wrapper 
      ref={wrapperRef}
      $isFocused={isFocused} 
      data-testid="time" 
      className={className} 
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      tabIndex={-1}
    >
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
