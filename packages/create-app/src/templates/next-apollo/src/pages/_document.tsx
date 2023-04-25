import { Children } from 'react';
import { renderToInitialStream } from 'next/dist/server/node-web-streams-helper';
import Document, { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from 'next/document';
import { getMarkupFromTree } from '@apollo/client/react/ssr';
import createEmotionServer from '@emotion/server/create-instance';

import { getLanguageFromContext } from '@/helpers/getLanguageFromContext';
import { initApolloClient } from '@/helpers/initApolloClient';
import { initEmotionCache } from '@/helpers/initEmotionCache';
import { initI18n, loadTranslation } from '@/helpers/initI18n';

function MyDocument({ locale }: DocumentProps) {
  return (
    <Html lang={locale}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const { renderPage } = ctx;

  const language = getLanguageFromContext(ctx);

  const apolloClient = initApolloClient(ctx);
  const i18n = initI18n(ctx, await loadTranslation(apolloClient, language));

  ctx.renderPage = () =>
    renderPage({
      enhanceApp: (App) =>
        function EnhanceApp({ pageProps, ...props }) {
          return <App pageProps={{ ...pageProps, i18n, apolloClient }} {...props} />;
        },
      enhancedRenderToInitialStream: async ({ ReactDOMServer, element }) => {
        const stream = await getMarkupFromTree({
          tree: element,
          renderFunction: async (element) =>
            renderToInitialStream({
              ReactDOMServer,
              element,
            }),
        });

        stream.pageProps = {
          initialState: {
            i18n: i18n.extract(),
            apolloClient: apolloClient.extract(),
          },
        };

        return stream;
      },
    });

  const emotionCache = initEmotionCache();
  const emotionServer = createEmotionServer(emotionCache);

  const documentProps = await Document.getInitialProps(ctx);
  const documentStyles = documentProps.styles;

  const emotionChunks = emotionServer.extractCriticalToChunks(documentProps.html);
  const emotionStyles = emotionChunks?.styles.map((style) => (
    <style
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
    />
  ));

  const styles = Children.toArray([documentStyles, emotionStyles]);

  return { ...documentProps, locale: language, styles };
};

export default MyDocument;
