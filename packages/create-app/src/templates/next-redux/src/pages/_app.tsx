import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import App, { AppContext, AppProps } from 'next/app';

import Meta from '@/components/Meta/Meta';
import { context } from '@/components/Provider/ReduxProvider/ReduxProvider';
import EmotionProvider from '@/components/Provider/EmotionProvider/EmotionProvider';
import ThemeProvider from '@/components/Provider/ThemeProvider/ThemeProvider';
import getEmotionServer from '@/helpers/getEmotionServer';
import getReduxStore from '@/helpers/getReduxStore';
import { headers } from '@/utils/request';
import parseCookie from '@/utils/parseCookie';

type MyAppProps = AppProps & {
  store: any,
  state: any,
};

function MyApp({ Component, pageProps, store, state }: MyAppProps) {
  console.log(Component, pageProps, store);
  return (
    <Provider store={store || getReduxStore(state)}>
      <EmotionProvider>
        <ThemeProvider>
          <Meta />
          <Component {...pageProps} />
        </ThemeProvider>
      </EmotionProvider>
    </Provider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  getEmotionServer();

  const initialProps = await App.getInitialProps(appContext);

  if (typeof window === 'undefined') {
    headers.Authorization = `Bearer ${parseCookie(appContext.ctx.req?.headers.cookie ?? document.cookie).accessToken}`;

    const store = getReduxStore();

    console.log(111111111);
    renderToString(<appContext.AppTree {...initialProps} store={store} state={store.getState()} />);

    console.log(context.requests);

    await Promise.all(Object.values(context.requests || {}).map((r: any) => r()));

    context.requests = [];

    Object.assign(initialProps, {
      state: store.getState(),
    });

    console.log(222222222);
  }

  return initialProps;
};

export default MyApp;
