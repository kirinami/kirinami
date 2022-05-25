import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';

import { emotionCache } from '@/contexts/emotion-provider/EmotionProvider';

function MyDocument() {
  return (
    <Html lang="en">
      <Head />
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

  Object.assign(initialProps, {
    styles: initialStyles.concat(emotionStyles),
  });

  return initialProps;
};

export default MyDocument;
