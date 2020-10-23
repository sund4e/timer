import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import usePrevious from '../../hooks/usePrevious.tsx/usePrevious';

const StyledInput = styled.input`
  color: ${({ theme }) => theme.colors.primary};
  border-style: none;
  font-size: 8em;
  caret-color: transparent;
  background-color: transparent;
`;

const NumberInput = () => {
  const [time, setTime] = useState(0);
  const input = useRef<HTMLInputElement>();
  const previousTime = usePrevious(time);

  useEffect(() => {
    if (Math.abs(time - previousTime) >= 10) {
      input.current.setSelectionRange(1, 1);
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
    input.current.setSelectionRange(0, 0);
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
