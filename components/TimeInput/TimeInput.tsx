import styled from 'styled-components';
import { useState, useEffect, useRef, useContext } from 'react';
import NumberInput from '../NumberInput/NumberInput';
import { Theme } from '../../styles/theme';
import { getHms, Input, getSeconds } from './timeConverters';
import FocusInput from './FocusInput';
import { FocusContextProvider, useFocusIndex } from '../FocusContext';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${({ theme, isFocused }: { theme: Theme; isFocused: boolean }) =>
    isFocused ? theme.colors.highlight : ''};
  transition: ${({ theme }) => theme.transition}s;
`;

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  isFocused: boolean;
  onFocus: () => void;
  initalFocus: Input;
  className?: string;
};

const Inputs = {
  [Input.hours]: {
    indexes: [0, 1],
    maxValue: 99,
  },
  [Input.minutes]: {
    indexes: [2, 3],
    maxValue: 59,
  },
  [Input.seconds]: {
    indexes: [4, 5],
    maxValue: 59,
  },
};

const Indexes = Object.values(Inputs).reduce<number[]>(
  (arr, input) => [...arr, ...input.indexes],
  []
);

const TimeInput = ({ value, onChange, className, isFocused }: Props) => {
  const [time, setTime] = useState(getHms(value));
  const { focusIndex, setFocusIndex } = useFocusIndex();

  useEffect(() => {
    setTime(getHms(value));
  }, [value]);

  useKeyPressCallBack('Enter', () => {
    setFocusIndex(null);
  });

  useEffect(() => {
    if (focusIndex === null) {
      onChange(getSeconds(time));
    }
  }, [focusIndex]);

  const onChangeInput = (inputName: Input) => (newValue: number) => {
    const newTime = {
      ...time,
      [inputName]: newValue,
    };
    setTime(newTime);
  };

  return (
    <Wrapper isFocused={isFocused} data-testid="time" className={className}>
      <FocusInput
        {...Inputs[Input.hours]}
        value={time[Input.hours]}
        onChange={onChangeInput(Input.hours)}
      />
      <span>:</span>
      <FocusInput
        {...Inputs[Input.minutes]}
        value={time[Input.minutes]}
        onChange={onChangeInput(Input.minutes)}
      />
      <span>:</span>
      <FocusInput
        {...Inputs[Input.seconds]}
        value={time[Input.seconds]}
        onChange={onChangeInput(Input.seconds)}
      />
    </Wrapper>
  );
};

const TimeInputWithFocus = (props: Props) => {
  const { initalFocus, isFocused, onFocus } = props;
  return (
    <FocusContextProvider
      allowFocus={isFocused}
      initialIndex={isFocused ? Inputs[initalFocus].indexes[0] : null}
      maxIndex={Math.max(...Indexes)}
      onFocus={onFocus}
    >
      <TimeInput {...props} />
    </FocusContextProvider>
  );
};

export default TimeInputWithFocus;
