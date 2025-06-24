import styled from 'styled-components';
import { useRef, ChangeEvent, useCallback, useState } from 'react';
import tinycolor from 'tinycolor2';

const StyledInput = styled.input<{
  $isInvalid: boolean;
}>`
  opacity: 1;
  border-style: none;
  caret-color: transparents;
  background-color: transparent;
  border-radius: ${({ theme }) => theme.radius}rem;
  border: 3px solid transparent;
  outline: none;
  &:focus {
    background-color: ${({ theme }) =>
      tinycolor(theme.colors.highlight).setAlpha(0.5).toRgbString()};
    color: ${({ theme }) => theme.colors.dark};
  }
  text-align: center;
  padding: 0;
  font-size: inherit;
  color: inherit;
  max-width: 1ch;
  margin: 0;
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
  ['aria-label']?: string;
};

const SingleInput = ({
  value,
  onChange,
  className,
  maxValue,
  ref,
  ...rest
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const input = ref || inputRef;
  const [isValid, setIsValid] = useState(true);

  const onFocus = useCallback(() => {
    if (input.current) {
      input.current.setSelectionRange(0, 0);
    }
  }, [input]);

  const onChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const number = parseInt(event.target.value[0]);
      onChange(isNaN(number) ? ('!' as unknown as number) : number);
      if (isNaN(number) || (maxValue && number > maxValue)) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    },
    [onChange, maxValue]
  );

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
      {...rest}
    />
  );
};

export default SingleInput;
