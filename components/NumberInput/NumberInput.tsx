import styled from 'styled-components';
import { useRef, useEffect } from 'react';
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
  onChange: (newValue: number, inputReady: boolean) => void;
  size: number;
  isFocused: boolean;
};

const NumberInput = ({ value, onChange, size, isFocused }: Props) => {
  const input = useRef<HTMLInputElement>(null);
  const changeIndex = useRef<number>(0);

  useEffect(() => {
    if (input.current) {
      if (isFocused) {
        input.current.focus();
      } else {
        input.current.blur();
      }
    }
  }, [isFocused]);

  const inputValue = value < 10 ? `0${value}` : value.toString();

  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    const currentIndex = changeIndex.current;
    const changedValue = newValue[currentIndex];
    const valueWithChange =
      inputValue.toString().substr(0, currentIndex) +
      changedValue +
      inputValue.toString().substr(currentIndex + 1);
    const newTime = parseInt(valueWithChange.slice(0, size));

    if (!isNaN(newTime)) {
      const lastIndex = changeIndex.current === size - 1;
      changeIndex.current = lastIndex ? 0 : changeIndex.current + 1;
      onChange(newTime, lastIndex);
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
