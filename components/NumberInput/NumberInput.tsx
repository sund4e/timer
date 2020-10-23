import styled from 'styled-components';
import { SyntheticEvent, useState, useRef } from 'react';

const StyledInput = styled.input`
  color: ${({ theme }) => theme.colors.primary};
  border-style: none;
  width: 50%;
  height: 50%;
  font-size: 8em;
  caret-color: transparents;
  background-color: transparent;
`;

const NumberInput = () => {
  const [time, setTime] = useState(0);

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
  return <StyledInput value={inputValue} onChange={onChangeInput} />;
};

export default NumberInput;
