import { useState } from 'react';
import SingleInput from '../SingleInput/SingleInput';

export type Props = {
  onChange: (value: number, inputReady: boolean) => void;
  value: number;
  focusIndex: number | undefined;
  size: number;
  onClick: (index: number) => void;
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
  className,
}: Props) => {
  const inputValue = getValueAsArray(value, size);

  const onChangeInput = (newValue: number) => {
    if (focusIndex === undefined) return;
    const newNumber = parseInt(
      Object.assign([], inputValue, { [focusIndex]: newValue }).join('')
    );
    const nextIndex = focusIndex + 1;
    const inputReady = nextIndex === inputValue.length;
    onChange(newNumber, inputReady);
  };

  const onClickInput = (index: number) => () => {
    onClick(index);
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
            isFocused={focusIndex === index}
            onClick={onClickInput(index)}
          />
        );
      })}
    </>
  );
};

export default NumberInput;
