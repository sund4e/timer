import styled from 'styled-components';
import { useState, useEffect } from 'react';
import NumberInput from '../NumberInput/NumberInput';
import { Theme } from '../../styles/theme';
import { getHms, Input, getSeconds } from './timeConverters';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';

const Wrapper = styled.div`
  display: flex;
  border-style: solid;
  height: 30%;
  align-items: center;
`;

const StyledSpan = styled.span`
  font-size: ${({ theme }: { theme: Theme }) => theme.fontSizes.big};
`;

const InvalidNumberInput = styled(NumberInput)`
  color: ${({ theme, isFocused }: { theme: Theme; isFocused: boolean }) =>
    isFocused ? theme.colors.accent : theme.colors.primary};
`;

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  onFocus: () => void;
  isFocused: boolean;
};

const TimeInput = ({ value, onChange, onFocus, isFocused }: Props) => {
  const [time, setTime] = useState(getHms(value));
  const [focusedInput, setFocusedInput] = useState<Input | null>(Input.hours);
  const [isInvalid, setIsInvalid] = useState(false);

  useKeyPressCallBack('Enter', () => {
    setFocusedInput(null);
  });

  useEffect(() => {
    setTime(getHms(value));
  }, [value]);

  useEffect(() => {
    if (focusedInput === null) {
      onChange(getSeconds(time));
    }
  }, [focusedInput]);

  const nextInput = {
    [Input.hours]: Input.minutes,
    [Input.minutes]: Input.seconds,
    [Input.seconds]: null,
  };

  const maxValue = {
    [Input.hours]: 24,
    [Input.minutes]: 59,
    [Input.seconds]: 59,
  };

  const onChangeInput = (inputName: Input) => (
    newValue: number,
    inputReady: boolean
  ) => {
    const newTime = {
      ...time,
      [inputName]: newValue,
    };
    setTime(newTime);

    if (newValue > maxValue[inputName] && inputReady) {
      setIsInvalid(true);
      return;
    }

    const next = nextInput[inputName];
    if (inputReady) {
      setIsInvalid(false);
      setFocusedInput(next);
    }
  };

  const onClick = (inputName: Input) => () => {
    setFocusedInput(inputName);
    onFocus();
  };

  const getInput = (input: Input) => {
    const isFocusedInput = focusedInput === input;
    const props = {
      value: time[input],
      onChange: onChangeInput(input),
      isFocused: isFocused && isFocusedInput,
      size: 2,
      onClick: onClick(input),
    };
    return isFocusedInput && isInvalid ? (
      <InvalidNumberInput {...props} />
    ) : (
      <NumberInput {...props} />
    );
  };

  return (
    <Wrapper>
      {getInput(Input.hours)}
      <StyledSpan>:</StyledSpan>
      {getInput(Input.minutes)}
      <StyledSpan>:</StyledSpan>
      {getInput(Input.seconds)}
    </Wrapper>
  );
};

export default TimeInput;
