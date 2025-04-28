import styled from 'styled-components';
import SingleInput from '../SingleInput/SingleInput';

const ValidatedSingleInput = styled(SingleInput)<{
  $isInvalid: boolean;
}>`
  ${({ theme, $isInvalid }) =>
    $isInvalid ? `color: ${theme.colors.accent}` : ''};
  transition: ${({ theme }) => theme.transition}s;
`;

export type Props = {
  onChange: (value: number) => void;
  value: number;
  focusIndex: number | null;
  size: number;
  onClick: (index: number) => void;
  invalidFocus: boolean;
  className?: string;
};

const getValueAsArray = (value: number, size: number): number[] => {
  const valueArray = Array.from(value.toString()).map((value) =>
    parseInt(value)
  );
  if (valueArray.length < size) {
    const defict = size - valueArray.length;
    const defictArray = new Array(defict).fill(0);
    return [...defictArray, ...valueArray];
  }

  if (valueArray.length > size) {
    return valueArray.slice(0, size);
  }

  return valueArray;
};

const NumberInput = ({
  value,
  onChange,
  focusIndex,
  size,
  onClick,
  invalidFocus,
  className,
}: Props) => {
  const inputValue = getValueAsArray(value, size);

  const onChangeInput = (newValue: number) => {
    if (focusIndex === null) return;
    const newNumber = parseInt(
      Object.assign([], inputValue, { [focusIndex]: newValue }).join('')
    );
    onChange(newNumber);
  };

  const onClickInput = (index: number) => () => {
    onClick(index);
  };

  return (
    <>
      {inputValue.map((num: number, index: number) => {
        return (
          <ValidatedSingleInput
            $isInvalid={invalidFocus && focusIndex === index}
            className={className}
            key={index}
            onChange={onChangeInput}
            value={num}
            isFocused={focusIndex === index}
            onClick={onClickInput(index)}
          />
        );
      })}
    </>
  );
};

export default NumberInput;
