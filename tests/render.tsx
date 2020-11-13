import { render as testRender } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Theme, theme } from '../styles/theme';

export const render = (component: React.ReactElement, options?: any) => {
  const rendered = testRender(
    <ThemeProvider theme={theme}>{component}</ThemeProvider>
  );
  return {
    ...rendered,
    rerender: (component: React.ReactElement) =>
      rendered.rerender(
        <ThemeProvider theme={theme}>{component}</ThemeProvider>
      ),
  };
};
