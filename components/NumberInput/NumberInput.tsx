import { useState } from 'react';
import SingleInput from '../SingleInput/SingleInput';

export type Props = {
  onChange: (value: number, inputReady: boolean) => void;
  value: number;
  isFocused: boolean;
  size: number;
  onClick: () => void;
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
  isFocused,
  size,
  onClick,
  className,
}: Props) => {
  const [focusIndex, setFocusIndex] = useState(0);
  const inputValue = getValueAsArray(value, size);

  const onChangeInput = (newValue: number) => {
    const newNumber = parseInt(
      Object.assign([], inputValue, { [focusIndex]: newValue }).join('')
    );
    const nextIndex = focusIndex + 1;
    const inputReady = nextIndex === inputValue.length;

    if (inputReady) {
      setFocusIndex(0);
    } else {
      setFocusIndex(nextIndex);
    }
    onChange(newNumber, inputReady);
  };

  const onClickInput = (index: number) => () => {
    setFocusIndex(index);
    onClick();
  };

  return (
    <>
      {inputValue.map((num: number, index: number) => {
        return (
          <SingleInput
            className={className}
            key={index}
            onChange={onChangeInput}
            value={num}
            isFocused={isFocused && focusIndex === index}
            onClick={onClickInput(index)}
          />
        );
      })}
    </>
  );
};

export default NumberInput;
