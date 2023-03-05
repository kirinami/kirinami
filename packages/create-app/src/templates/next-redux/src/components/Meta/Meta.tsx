import { useTranslation } from 'react-i18next';
import Head from 'next/head';

export function Meta() {
  const { t } = useTranslation();

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={t('meta.description')} />
      <meta name="keywords" content={t('meta.keywords')} />
      <title>{t('meta.title')}</title>
    </Head>
  );
}
