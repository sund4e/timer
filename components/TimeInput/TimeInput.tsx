import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
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
  ${({ theme }: { theme: Theme }) => `color: ${theme.colors.highlight}`};
`;

export type Props = {
  value: number;
  onChange: (seconds: number) => void;
  isFocused: boolean;
  onFocus: () => void;
  initalFocus: Input;
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
  onFocus,
  initalFocus,
  isFocused,
}: Props) => {
  const time = useRef(getHms(value));
  const [isInvalid, setIsInvalid] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(
    Inputs[initalFocus].indexes[0]
  );

  useKeyPressCallBack('Enter', () => {
    onChange(getSeconds(time.current));
  });

  const isValidIndex = (newIndex: number) => {
    return Indexes.includes(newIndex);
  };

  useKeyPressCallBack('ArrowRight', () => {
    setFocusedIndex((previousIndex) => {
      const newIndex = previousIndex + 1;
      return isValidIndex(newIndex) ? newIndex : previousIndex;
    });
  });

  useKeyPressCallBack('ArrowLeft', () => {
    setFocusedIndex((previousIndex) => {
      const newIndex = previousIndex - 1;
      return isValidIndex(newIndex) ? newIndex : previousIndex;
    });
  });

  useEffect(() => {
    time.current = getHms(value);
  }, [value]);

  useEffect(() => {
    if (!isFocused) {
      setIsInvalid(false);
    }
  }, [isFocused]);

  const onChangeInput = (inputName: Input) => (newValue: number) => {
    const newTime = {
      ...time.current,
      [inputName]: newValue,
    };

    const nextIndex = focusedIndex + 1;
    const isInputReady = !Inputs[inputName].indexes.includes(nextIndex);
    time.current = newTime;

    if (isInputReady) {
      if (newValue > Inputs[inputName].maxValue) {
        setIsInvalid(true);
        setFocusedIndex(Inputs[inputName].indexes[0]);
        return;
      }
      setIsInvalid(false);
    }

    if (Indexes.includes(nextIndex)) {
      setFocusedIndex(nextIndex);
    } else {
      onChange(getSeconds(newTime));
    }
  };

  const onClick = (inputName: Input) => (index: number) => {
    setFocusedIndex(Inputs[inputName].indexes[index]);
    onFocus();
  };

  const getInput = (input: Input) => {
    const focusedPosition = Inputs[input].indexes.findIndex(
      (index) => index === focusedIndex
    );
    const focusIndex =
      !isFocused || focusedPosition < 0 ? undefined : focusedPosition;
    const props = {
      value: time.current[input],
      onChange: onChangeInput(input),
      size: 2,
      onClick: onClick(input),
      focusIndex: focusIndex,
    };

    if (isFocused) {
      if (isInvalid && focusIndex !== undefined) {
        return <InvalidNumberInput {...props} />;
      }
      return <NumberInputWithFocus {...props} />;
    }
    return <NumberInput {...props} />;
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
