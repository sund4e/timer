import styled from 'styled-components';
import {
  useRef,
  ChangeEvent,
  useCallback,
  useState
} from 'react';

const StyledInput = styled.input<{
  $isInvalid: boolean;
}>`
  opacity: 1;
  border-style: none;
  caret-color: transparents;
  background-color: transparent;
  &:focus {
    outline: none;
    opacity: 0.5;
  }
  text-align: center;
  padding: 0;
  font-size: inherit;
  color: inherit;
  transition: ${({ theme }) => theme.transition}s;
  caret-color: transparent;
  ${({ theme, $isInvalid }) =>
    $isInvalid ? `color: ${theme.colors.accent}` : ''};
`;

export type Props = {
  value: number;
  onChange: (newValue: number) => void;
  className?: string;
  maxValue?: number;
  ref?: React.RefObject<HTMLInputElement | null>;
};

const SingleInput = ({
  value,
  onChange,
  className,
  maxValue,
  ref
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const input = ref || inputRef;
  const [isValid, setIsValid] = useState(true);

  const onFocus = useCallback(() => {
    if (input.current) {
      input.current.setSelectionRange(0, 0);
    }
  }, [input.current]);

  const onChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const number = parseInt(event.target.value[0]);
    onChange(isNaN(number) ? "!" as unknown as number : number);
    if (isNaN(number) || maxValue && number > maxValue) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }

  }, [onChange]);

  return (
    <StyledInput
      type="tel"
      className={className}
      ref={input}
      onFocus={onFocus}
      onClick={onFocus}
      $isInvalid={!isValid}
      tabIndex={0}
      onChange={onChangeInput}
      role="textbox"
      value={value}
      size={1}
    />
  );
};

export default SingleInput;
