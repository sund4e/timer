import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = context.renderPage;

    try {
      context.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(context);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

    return (
      <Html lang="en">
        <Head>
          {umamiWebsiteId && (
            <script
              defer
              src="https://cloud.umami.is/script.js"
              data-website-id={umamiWebsiteId}
            />
          )}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, viewport-fit=cover interactive-widget=resizes-content"
          ></meta>
        </Head>
        <body style={{ backgroundColor: 'black' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
