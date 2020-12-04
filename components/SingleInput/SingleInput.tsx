import styled from 'styled-components';
import { useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { Theme } from '../../styles/theme';

const StyledInput = styled.div`
  opacity: ${({ isFocused }: { isFocused: boolean }) => (isFocused ? 0.5 : 1)};
  border-style: none;
  caret-color: transparents;
  background-color: transparent;
  &:focus {
    outline: none;
  }
  transition: ${({ theme }: { theme: Theme }) => theme.transition}s;
`;

export type Props = {
  value: number;
  onChange: (newValue: number) => void;
  isFocused: boolean;
  onClick: () => void;
  className?: string;
};

const SingleInput = ({
  value,
  onChange,
  isFocused,
  onClick,
  className,
}: Props) => {
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

  const onClickInput = (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
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
      className={className}
      ref={input}
      isFocused={isFocused}
      onClick={onClickInput}
      tabIndex={0}
      onKeyPress={onKeyPress}
      role="textbox"
    >
      {value}
    </StyledInput>
  );
};

export default SingleInput;
