import styled from 'styled-components';
import { useState, useEffect } from 'react';
import NumberInput from '../NumberInput/NumberInput';
import { Theme } from '../../styles/theme';
import { getHms, Input, getSeconds } from './timeConverters';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';

const Wrapper = styled.div`
  display: flex;
  height: 30%;
  align-items: center;
  justify-content: center;
`;

const StyledSpan = styled.span`
  font-size: ${({ theme }: { theme: Theme }) => theme.fontSizes.big};
`;

const InvalidNumberInput = styled(NumberInput)`
  color: ${({ theme }: { theme: Theme }) => theme.colors.accent};
`;

const NumberInputWithFocus = styled(NumberInput)`
  ${({ theme, isFocused }: { theme: Theme; isFocused: boolean }) =>
    isFocused && `color: ${theme.colors.highlight}`};
`;

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  onFocus: () => void;
  initalFocus: Input;
};

const TimeInput = ({ value, onChange, onFocus, initalFocus }: Props) => {
  const [time, setTime] = useState(getHms(value));
  const [focusedInput, setFocusedInput] = useState<Input | null>(initalFocus);
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
    const isFocused = focusedInput === input;
    const props = {
      value: time[input],
      onChange: onChangeInput(input),
      isFocused: isFocused,
      size: 2,
      onClick: onClick(input),
    };
    return isFocused && isInvalid ? (
      <InvalidNumberInput {...props} />
    ) : (
      <NumberInputWithFocus {...props} />
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
