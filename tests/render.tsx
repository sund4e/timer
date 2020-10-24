import { render as testRender } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Theme, theme } from '../styles/theme';

export const render = (component: React.ReactElement) =>
  testRender(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
