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

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  onFocus: () => void;
};

const TimeInput = ({ value, onChange, onFocus }: Props) => {
  const [time, setTime] = useState(getHms(value));
  const [focusedInput, setFocusedInput] = useState<Input | null>(null);

  const nextInput = {
    [Input.hours]: Input.minutes,
    [Input.minutes]: Input.seconds,
    [Input.seconds]: null,
  };

  const onChangeInput = (inputName: Input) => (
    newValue: number,
    inputReady: boolean
  ) => {
    setTime({
      ...time,
      [inputName]: newValue,
    });
    if (inputReady) {
      const next = nextInput[inputName];
      if (next !== null) {
        setFocusedInput(next);
      } else {
        onChange(getSeconds(time));
        setFocusedInput(null);
      }
    }
  };

  const onClick = (inputName: Input) => () => {
    setFocusedInput(inputName);
    onFocus();
  };

  const getInput = (input: Input) => {
    return (
      <NumberInput
        value={time[input]}
        onChange={onChangeInput(input)}
        isFocused={focusedInput === input}
        size={2}
        onClick={onClick(input)}
      />
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
