import styled from 'styled-components';
import { useRef, useEffect, useState } from 'react';
import { Theme } from '../../styles/theme';

const StyledInput = styled.div`
  color: ${({ theme, isFocused }: { theme: Theme; isFocused: boolean }) =>
    isFocused ? theme.colors.accent : theme.colors.primary};
  border-style: none;
  font-size: ${({ theme }: { theme: Theme }) => theme.fontSizes.big};
  caret-color: transparents;
  background-color: transparent;
  &:focus {
    outline: none;
  }
  flex-grow: 0;
  ::-moz-selection {
    color: red;
  }
  ::selection {
    color: red;
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

  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    const newTime = parseInt(newValue[1]);

    if (!isNaN(newTime)) {
      onChange(newTime);
    }
  };

  const onClickInput = () => {
    onClick();
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    const number = parseInt(event.key);
    if (!isNaN(number)) {
      onChange(number);
    }
  };

  return (
    <StyledInput
      ref={input}
      onChange={onChangeInput}
      isFocused={isFocused}
      onClick={onClickInput}
      tabIndex={0}
      onKeyPress={onKeyPress}
    >
      {value}
    </StyledInput>
  );
};

export default SingleInput;