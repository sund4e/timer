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
  onDirty?: () => void;
};

const getDigits = (seconds: number) => {
  const hms = getHms(seconds);
  return [
    Math.floor(hms.hours / 10),
    hms.hours % 10,
    Math.floor(hms.minutes / 10),
    hms.minutes % 10,
    Math.floor(hms.seconds / 10),
    hms.seconds % 10,
  ];
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
  return time.every(
    (digit, index) => !isNaN(digit) && digit >= 0 && digit <= maxValues[index]
  );
};

const TimeInput = ({
  value,
  onChange,
  className,
  onFocus,
  onBlur,
  isFocused,
  onDirty,
}: Props) => {
  const [time, setTime] = useState(getDigits(value));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);
  const inputRef5 = useRef<HTMLInputElement>(null);
  const inputRefs = [
    inputRef0,
    inputRef1,
    inputRef2,
    inputRef3,
    inputRef4,
    inputRef5,
  ];
  const [nextInputToFocus, setNextInputToFocus] = useState(0);

  useEffect(() => {
    setTime(getDigits(value));
  }, [value]);

  useEffect(() => {
    if (nextInputToFocus) {
      inputRefs[nextInputToFocus]?.current?.focus();
    }
  }, [nextInputToFocus]);

  const onChangeTime = useCallback(
    (time: number[]) => {
      if (isValidTime(time)) {
        const seconds = getSecondsFromDigits(time);
        if (seconds !== value) {
          onChange(seconds);
        }
      }
    },
    [onChange, time]
  );

  useEffect(() => {
    const currentIndex = findFocusedIndex();
    if (isFocused && currentIndex === -1) {
      inputRefs[0]?.current?.focus();
    } else if (!isFocused && currentIndex > -1) {
      inputRefs[currentIndex]?.current?.blur();
    }
  }, [isFocused]);

  const findFocusedIndex = useCallback(() => {
    return inputRefs.findIndex((ref) => ref.current === document.activeElement);
  }, [inputRefs]);

  useKeyPressCallBack(wrapperRef.current, 'ArrowRight', () => {
    const currentIndex = findFocusedIndex();
    const nextIndex = currentIndex + 1;
    if (currentIndex !== -1 && nextIndex < inputRefs.length) {
      inputRefs[nextIndex]?.current?.focus();
    }
  });

  useKeyPressCallBack(wrapperRef.current, 'ArrowLeft', () => {
    const currentIndex = findFocusedIndex();
    const prevIndex = currentIndex - 1;
    if (currentIndex !== -1 && prevIndex >= 0) {
      inputRefs[prevIndex]?.current?.focus();
    }
  });

  const handleTimeChange = useCallback(
    (index: number) => (newValue: number) => {
      onDirty?.();
      const newTime = time.map((digit, i) => (i === index ? newValue : digit));
      setTime(newTime);
      if (!isValidTime(newTime)) {
        return;
      }
      const nextIndex = index + 1;
      if (inputRefs[nextIndex]) {
        setNextInputToFocus(nextIndex);
      } else {
        inputRefs[index]?.current?.blur();
        onChangeTime(newTime);
      }
    },
    [time, inputRefs, onChangeTime]
  );

  const handleFocusCapture = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

  const handleBlurCapture = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.relatedTarget as Node)
      ) {
        onBlur?.();
        onChangeTime(time);
      }
    },
    [onBlur, time]
  );

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
