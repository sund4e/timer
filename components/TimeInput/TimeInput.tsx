import styled from 'styled-components';
import { useState, useEffect, } from 'react';
import { getHms, Input, getSeconds } from './timeConverters';
import { FocusContextProvider, useFocusIndex } from '../FocusContext';
import useKeyPressCallBack from '../../hooks/useTimer/useKeyPressCallback';
import NumberInput from '../NumberInput/NumberInput';

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

const TimeInput = ({
  value,
  onChange,
  className,
  isFocused,
}: Props) => {
  const [time, setTime] = useState(getHms(value));
  const { focusIndex, setFocusIndex } = useFocusIndex();

  useEffect(() => {
    setTime(getHms(value));
  }, [value]);

  useKeyPressCallBack('Enter', () => {
    if (focusIndex !== null) {
      setFocusIndex(null);
    } else {
      setFocusIndex(0);
    }
  });

  const handleTimeChange = (inputType: Input) => (newValue: number) => {
      const newTime = { ...time, [inputType]: newValue };
      setTime(newTime);
      onChange(getSeconds(newTime)); 
  };

  return (
    <Wrapper $isFocused={isFocused} data-testid="time" className={className}>
      <NumberInput 
          value={time.hours}
          indexes={[0, 1]}
          maxValue={99}
          size={2}
          onChange={handleTimeChange(Input.hours)} 
          className={className} 
      />
      <span>:</span>
      <NumberInput 
          value={time.minutes}
          indexes={[2, 3]}
          maxValue={59}
          size={2}
          onChange={handleTimeChange(Input.minutes)} 
          className={className}
      />
      <span>:</span>
      <NumberInput 
          value={time.seconds}
          indexes={[4, 5]}
          maxValue={59}
          size={2}
          onChange={handleTimeChange(Input.seconds)} 
          className={className}
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
