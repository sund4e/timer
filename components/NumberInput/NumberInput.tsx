import styled from 'styled-components';
import { useState, useRef, useEffect, MutableRefObject } from 'react';
import usePrevious from '../../hooks/usePrevious.tsx/usePrevious';
import { Theme } from '../../styles/theme';

const StyledInput = styled.input`
  color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  border-style: none;
  font-size: ${({ theme }: { theme: Theme }) => theme.fontSizes.big};
  caret-color: transparents;
  background-color: transparent;
`;

export type Props = {
  value: number;
  onChange: (newValue: number) => void;
  size: number;
};

const NumberInput = ({ value, onChange, size }: Props) => {
  const input = useRef<HTMLInputElement>(null);
  const changeIndex = useRef<number>(0);

  const inputValue = value < 10 ? `0${value}` : value.toString();

  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    const integers = Array.from(newValue).map((character: string) =>
      parseInt(character)
    );

    if (integers.every((num) => !isNaN(num))) {
      const newTime = parseInt(integers.slice(0, size).join(''));
      changeIndex.current =
        changeIndex.current === size - 1 ? 0 : changeIndex.current + 1;
      onChange(newTime);
    }

    //Use tiemout to set the cursor position to avoid race condition with browser updating the input
    setTimeout(() => {
      input.current &&
        input.current.setSelectionRange(
          changeIndex.current,
          changeIndex.current
        );
    }, 0);
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
      size={size}
    />
  );
};

export default NumberInput;
