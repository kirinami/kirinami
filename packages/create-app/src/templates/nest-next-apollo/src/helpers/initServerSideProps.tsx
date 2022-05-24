import { GetServerSideProps } from 'next';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { initApolloClient } from './initApolloClient';

export type GetProps = {
  isFirstServerCall: boolean;
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

export const initServerSideProps = (get: (props: GetProps) => GetServerSideProps): GetServerSideProps => async (ctx) => {
  const isFirstServerCall = ctx.req.url?.indexOf('/_next/data/') === -1;

  const apolloClient = await initApolloClient();
  const pageProps = await get({ isFirstServerCall, apolloClient })(ctx);

  if ('props' in pageProps) {
    pageProps.props = await pageProps.props;
    pageProps.props.extractData = apolloClient.extract();
  }

  return pageProps;
};

export default initServerSideProps;
