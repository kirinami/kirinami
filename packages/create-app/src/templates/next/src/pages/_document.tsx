import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';

import { emotionCache } from '@/components/Provider/EmotionProvider/EmotionProvider';

function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700&display=swap" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const { extractCriticalToChunks } = createEmotionServer(emotionCache);

  const initialProps = await Document.getInitialProps(ctx);
  const initialStyles = initialProps.styles ? ([] as unknown[]).concat(initialProps.styles) : [];

  const emotionChunks = extractCriticalToChunks(initialProps.html);
  const emotionStyles = emotionChunks.styles.map((style) => (
    <style
      key={style.key}
      data-emotion={`${style.key} ${style.ids.join(' ')}`.trim()}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return Object.assign(initialProps, {
    styles: initialStyles.concat(emotionStyles),
  });
};

export default MyDocument;
