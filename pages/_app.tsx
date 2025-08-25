import type { AppProps } from 'next/app';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'GeneralSans';
    src: url('/fonts/GeneralSans-Regular.woff2') format('woff2');
    font-weight: 400; /* Regular */
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'GeneralSans';
    src: url('/fonts/GeneralSans-Semibold.woff2') format('woff2');
    font-weight: 600; /* Semibold */
    font-style: normal;
    font-display: swap;
  }


  body {
    margin: 0;
    padding: 0;
    font-family: 'GeneralSans', Helvetica, sans-serif;
    font-weight: 400; /* Default to regular weight */
    color: ${({ theme }) => theme.colors.light};
    background-color: ${({ theme }) => theme.colors.dark};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600; /* Headings are semibold */
  }

  button,
  input {
    font-family: inherit; /* Ensure buttons and inputs use the correct font */
  }
`;

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (window.umami) {
        window.umami.track(url);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
