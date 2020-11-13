import { screen } from '@testing-library/react';

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
