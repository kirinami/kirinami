import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { streamToString } from 'next/dist/server/node-web-streams-helper';
import { getMarkupFromTree } from '@apollo/client/react/ssr';
import createEmotionServer from '@emotion/server/create-instance';

function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const pageProps = ctx.req!.pageProps;
  const renderPage = ctx.renderPage;

  ctx.renderPage = () => renderPage({
    enhanceApp: (App) => function EnhanceApp(props) {
      Object.assign(props.pageProps, pageProps);

      return <App {...props} />;
    },
    enhanceRenderShell: async (Tree, { renderToReadableStream }) => {
      let stream: ReadableStream;

      const html = await getMarkupFromTree({
        tree: Tree,
        renderFunction: async (Tree) => {
          stream = await renderToReadableStream(Tree);

          return streamToString(stream.tee()[1]);
        },
      });

      return {
        stream: stream!,
        html,
        pageProps: {
          i18n: undefined,
          apolloClient: undefined,
          apolloState: pageProps.apolloClient.extract(),
          emotionCache: undefined,
          user: undefined,
        },
      };
    },
  });

  const emotionServer = createEmotionServer(pageProps.emotionCache);

  const initialProps = await Document.getInitialProps(ctx);
  const initialStyles = initialProps.styles ? ([] as unknown[]).concat(initialProps.styles) : [];

  const emotionChunks = emotionServer.extractCriticalToChunks(initialProps.html);
  const emotionStyles = emotionChunks?.styles.map((style) => (
    <style
      key={style.key}
      data-emotion={`${style.key} ${style.ids.join(' ')}`.trim()}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return Object.assign(initialProps, {
    styles: initialStyles.concat(emotionStyles || []),
  });
};

export default MyDocument;
