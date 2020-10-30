import styled from 'styled-components';
import { useState, useEffect } from 'react';
import NumberInput from '../NumberInput/NumberInput';
import { Theme } from '../../styles/theme';
import { getHms, Input, getSeconds } from './timeConverters';

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
};

const TimeInput = ({ value, onChange, onFocus }: Props) => {
  const [time, setTime] = useState(getHms(value));
  const [focusedInput, setFocusedInput] = useState<Input | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setTime(getHms(value));
  }, [value]);

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

    if (newValue > maxValue[inputName] && inputReady) {
      setIsInvalid(true);
      setTime(newTime);
      return;
    }

    const next = nextInput[inputName];
    if (next === null && inputReady) {
      onChange(getSeconds(newTime));
      setFocusedInput(null);
    } else {
      if (inputReady) {
        setFocusedInput(next);
        setIsInvalid(false);
      }
      setTime(newTime);
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
