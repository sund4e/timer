import { useState } from 'react';
import SingleInput from '../SingleInput/SingleInput';

export type Props = {
  onChange: (value: number, inputReady: boolean) => void;
  value: number;
  isFocused: boolean;
  size: number;
};

const getValueAsArray = (value: number, size: number) => {
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
}: NumberInputProps) => {
  const [focusIndex, setFocusIndex] = useState(0);
  const inputValue = getValueAsArray(value, size);

  const focusNextInput = () => {};

  const onChangeInput = (index: number) => (newValue: number) => {
    const newNumber = parseInt(
      Object.assign([], inputValue, { [index]: newValue }).join('')
    );
    const nextIndex = index + 1;
    const inputReady = nextIndex === inputValue.length;
    if (inputReady) {
      setFocusIndex(0);
    } else {
      setFocusIndex(nextIndex);
    }
    focusNextInput();
    onChange(newNumber, inputReady);
  };

  return (
    <>
      {inputValue.map((num: number, index: number) => {
        return (
          <SingleInput
            key={index}
            onChange={onChangeInput(index)}
            value={num}
            isFocused={isFocused && focusIndex === index}
          />
        );
      })}
    </>
  );
};

export default NumberInput;
