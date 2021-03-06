import { screen, fireEvent, act } from '@testing-library/react';

export const getTime = (): string | null => {
  const numbers = screen
    .getAllByRole('textbox')
    .map((input) => (input as HTMLInputElement).value);
  return `${numbers.slice(0, 2).join('')}:${numbers
    .slice(2, 4)
    .join('')}:${numbers.slice(4, 6).join('')}`;
};

export const changeInputValue = (inputInxed: number, value: number) => {
  const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
  const input = inputs[inputInxed];
  fireEvent.click(input);
  fireEvent.change(input, { target: { value } });
};

export const enter = () => {
  fireEvent.keyDown(document, {
    key: 'Enter',
    charCode: 13,
  });
};
