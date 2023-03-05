import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import App, { AppProps } from 'next/app';
import { CacheProvider } from '@emotion/react';

import { Meta } from '@/components/Meta';
import { Styles } from '@/components/Styles';
import { initEmotionCache } from '@/helpers/initEmotionCache';
import { initI18n } from '@/helpers/initI18n';
import { initStore } from '@/helpers/initStore';

function MyApp({ pageProps: { i18n, store, initialState, ...pageProps }, Component }: AppProps) {
  const emotionCacheMemo = useMemo(() => initEmotionCache(), []);

  const i18nMemo = useMemo(() => i18n || initI18n(null, initialState?.i18n), [i18n, initialState?.i18n]);

  const storeMemo = useMemo(() => store || initStore(null, initialState?.store), [store, initialState?.store]);

  return (
    <CacheProvider value={emotionCacheMemo}>
      <I18nextProvider i18n={i18nMemo}>
        <ReduxProvider store={storeMemo}>
          <Meta />
          <Styles />
          <Component {...pageProps} />
        </ReduxProvider>
      </I18nextProvider>
    </CacheProvider>
  );
}

MyApp.getInitialProps = App.getInitialProps;

export default MyApp;
