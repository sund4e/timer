import styled from 'styled-components';
import { useRef, useEffect, useState } from 'react';
import { Theme } from '../../styles/theme';

const StyledInput = styled.input`
  color: ${({ theme, isFocused }: { theme: Theme; isFocused: boolean }) =>
    isFocused ? theme.colors.accent : theme.colors.primary};
  border-style: none;
  font-size: ${({ theme }: { theme: Theme }) => theme.fontSizes.big};
  caret-color: transparent;
  background-color: transparent;
  &:focus {
    outline: none;
  }
`;

export type Props = {
  value: number;
  onChange: (newValue: number) => void;
  isFocused: boolean;
  onClick: () => void;
};

const SingleInput = ({ value, onChange, isFocused, onClick }: Props) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current) {
      if (isFocused) {
        input.current.focus();
      } else {
        input.current.blur();
      }
    }
  }, [isFocused]);

  useEffect(() => {
    input.current && input.current.setSelectionRange(0, 0);
  });

  const inputValue = value.toString();

  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    const newTime = parseInt(newValue[0]);

    if (!isNaN(newTime)) {
      onChange(newTime);
    }
  };

  return (
    <StyledInput
      ref={input}
      value={inputValue}
      onChange={onChangeInput}
      size={1}
      isFocused={isFocused}
      onClick={onClick}
    />
  );
};

export default SingleInput;
