import { Children } from 'react';
import { streamToString } from 'next/dist/server/node-web-streams-helper';
import Document, { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';

import { getLanguageFromContext } from '@/helpers/getLanguageFromContext';
import { getMarkupFromTree } from '@/helpers/getMarkupFromTree';
import { initApiClient } from '@/helpers/initApiClient';
import { initEmotionCache } from '@/helpers/initEmotionCache';
import { initI18n, loadTranslation } from '@/helpers/initI18n';
import { initStore } from '@/helpers/initStore';

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

  const apiClient = initApiClient(ctx);
  const store = initStore(ctx);
  const i18n = initI18n(ctx, await loadTranslation(apiClient, language));

  ctx.renderPage = () =>
    renderPage({
      enhanceApp: (App) =>
        function EnhanceApp({ pageProps, ...props }) {
          return <App pageProps={{ ...pageProps, i18n, store }} {...props} />;
        },
      enhanceRender: async (Tree, { renderToReadableStream }) => {
        let stream: Awaited<ReturnType<typeof renderToReadableStream>>;

        const html = await getMarkupFromTree({
          tree: Tree,
          renderFunction: async (Tree) => {
            stream = await renderToReadableStream(Tree);

            return streamToString(stream.tee()[1]);
          },
        });

        return {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          stream: stream!,
          html,
          pageProps: {
            initialState: {
              i18n: i18n.getState(),
              store: store.getState(),
            },
          },
        };
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
