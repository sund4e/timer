import { render as testRender } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

export const render = (component: React.ReactElement) =>
  testRender(<ThemeProvider theme={{ colors: {} }}>{component}</ThemeProvider>);
