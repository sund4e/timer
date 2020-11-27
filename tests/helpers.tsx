import { screen, fireEvent } from '@testing-library/react';

export const getTime = (): string | null => {
  return screen.getByTestId('time').textContent;
};

export const changeInputValue = (inputInxed: number, value: number) => {
  const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
  const lastInput = inputs[inputInxed];
  fireEvent.click(lastInput);
  fireEvent.keyPress(lastInput, {
    key: value.toString(),
    charCode: 49,
  });
};

export const enter = () => {
  fireEvent.keyDown(document, {
    key: 'Enter',
    charCode: 13,
  });
};
