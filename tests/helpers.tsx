import { screen, fireEvent } from '@testing-library/react';

export const getElementWithText = (text: string): HTMLElement | undefined => {
  try {
    return screen.getByText((_, node) => {
      const hasText = (node: Element) => node.textContent === text;
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every(
        (child) => !hasText(child)
      );

      return nodeHasText && childrenDontHaveText;
    });
  } catch {
    return undefined;
  }
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
