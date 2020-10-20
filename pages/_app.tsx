import type { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Verdana, Helvetica, sans-serif;
  }
`;

const theme = {
  colors: {
    dark: '#141414',
    primary: '#182033',
    highlight: '#494F69',
    accent: '#975E6E',
    light: '#E8E8E8',
  },
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
