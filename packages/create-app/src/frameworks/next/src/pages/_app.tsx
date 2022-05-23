import '@/styles/_app.scss';

import Modal from 'react-modal';
import { AppProps } from 'next/app';
import Head from 'next/head';

import Layout from '@/containers/layout/Layout';

Modal.setAppElement('#__next');

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Next.js Starter powered by KIRINAMI" />
        <meta name="keywords" content="Next.js, TypeScript, SCSS" />

        <title>Next.js Starter powered by KIRINAMI</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
