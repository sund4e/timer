import styled from 'styled-components';
import { useState, useRef, useEffect, MutableRefObject } from 'react';
import usePrevious from '../../hooks/usePrevious.tsx/usePrevious';
import { Theme } from '../../styles/theme';

const StyledInput = styled.input`
  color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  border-style: none;
  font-size: 8em;
  caret-color: transparent;
  background-color: transparent;
`;

const NumberInput = ({ value }: { value: number }) => {
  const [time, setTime] = useState(value);
  const input = useRef<HTMLInputElement>(null);
  const previousTime = usePrevious(time);

  useEffect(() => {
    if (input.current) {
      if (Math.abs(time - previousTime) >= 10) {
        input.current.setSelectionRange(1, 1);
      } else {
        input.current.setSelectionRange(0, 0);
      }
    }
  }, [time]);

  const inputValue = time < 10 ? `0${time}` : time.toString();

  const onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    const tens = newValue[0];
    const ones = tens !== inputValue[0] ? newValue[2] : newValue[1];

    if (!isNaN(parseInt(tens)) && !isNaN(parseInt(ones))) {
      const newTime = parseInt(`${tens}${ones}`);
      setTime(newTime);
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
