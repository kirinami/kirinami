import { GetServerSideProps } from 'next';

import initReduxStore, { ReduxStore } from './initReduxStore';

export type GetProps = {
  isFirstServerCall: boolean,
  reduxStore: ReduxStore,
};

export const initServerSideProps = (get: (props: GetProps) => GetServerSideProps): GetServerSideProps => async (ctx) => {
  const isFirstServerCall = ctx.req.url?.indexOf('/_next/data/') === -1;

  const reduxStore = await initReduxStore();
  const pageProps = await get({ isFirstServerCall, reduxStore })(ctx);

  if ('props' in pageProps) {
    pageProps.props = await pageProps.props;
    pageProps.props.extractData = reduxStore.getState();
  }

  return pageProps;
};

export default initServerSideProps;
