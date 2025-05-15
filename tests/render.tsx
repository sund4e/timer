import { render as testRender } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';

export const render = (component: React.ReactElement) => {
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
