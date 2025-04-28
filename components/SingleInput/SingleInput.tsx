import styled from 'styled-components';
import {
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
  ChangeEvent,
  useCallback
} from 'react';
import { Theme } from '../../styles/theme';

const StyledInput = styled.input<{
  theme: Theme;
  $isFocused: boolean;
}>`
  opacity: ${({ $isFocused }) => ($isFocused ? 0.5 : 1)};
  border-style: none;
  caret-color: transparents;
  background-color: transparent;
  &:focus {
    outline: none;
  }
  text-align: center;
  padding: 0;
  font-size: inherit;
  color: inherit;
  transition: ${({ theme }) => theme.transition}s;
  caret-color: transparent;
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

  useEffect(() => {
    if (isFocused && input.current) {
        input.current.setSelectionRange(0, 0);
    }
  }, [isFocused]);

  const onClickInput = useCallback((event: ReactMouseEvent<HTMLInputElement, MouseEvent>) => {
    event.stopPropagation();
    if (input.current) {
        input.current.setSelectionRange(0, 0);
    }
    onClick();
  }, [onClick]);

  const onChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
        if(input.current) input.current.setSelectionRange(0, 0);
    });

    const number = parseInt(event.target.value[0]);
    if (!isNaN(number)) {
      onChange(number);
    }
  }, [onChange]);

  return (
    <StyledInput
      type="tel"
      className={className}
      ref={input}
      $isFocused={isFocused}
      onClick={onClickInput}
      tabIndex={0}
      onChange={onChangeInput}
      role="textbox"
      value={value}
      size={1}
    />
  );
};

export default SingleInput;
