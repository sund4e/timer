import styled from 'styled-components';
import { useState, useRef, useEffect, MutableRefObject } from 'react';
import usePrevious from '../../hooks/usePrevious.tsx/usePrevious';
import { Theme } from '../../styles/theme';

const StyledInput = styled.input`
  color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  border-style: none;
  font-size: ${({ theme }: { theme: Theme }) => theme.fontSizes.big};
  caret-color: transparent;
  background-color: transparent;
`;

type Props = {
  value: number;
  onChange: (newValue: number) => void;
};

const NumberInput = ({ value, onChange }: Props) => {
  const input = useRef<HTMLInputElement>(null);
  const previousTime = usePrevious(value);

  useEffect(() => {
    if (input.current) {
      if (Math.abs(value - previousTime) >= 10) {
        input.current.setSelectionRange(1, 1);
      } else {
        input.current.setSelectionRange(0, 0);
      }
    }
  }, [value]);

  const inputValue = value < 10 ? `0${value}` : value.toString();

  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    const tens = newValue[0];
    const ones = tens !== inputValue[0] ? newValue[2] : newValue[1];

    if (!isNaN(parseInt(tens)) && !isNaN(parseInt(ones))) {
      const newTime = parseInt(`${tens}${ones}`);
      onChange(newTime);
    }
  };

  const onClick = () => {
    input.current && input.current.setSelectionRange(0, 0);
  };

  return (
    <StyledInput
      ref={input}
      value={inputValue}
      onChange={onChangeInput}
      onClick={onClick}
    />
  );
};

export default NumberInput;
