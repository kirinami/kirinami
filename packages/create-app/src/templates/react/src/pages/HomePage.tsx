import { useTranslation } from 'react-i18next';

import { Layout } from '@/containers/Layout';
import { useHead } from '@/utils/react/head';

export function HomePage() {
  const { t } = useTranslation();

  useHead({
    title: t('home'),
    description: `${t('home')} - description`,
    keywords: [t('home'), 'keyword'].join(','),
  });

  return (
    <Layout>
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 p-4 lg:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-500">{t('hello')}</h1>
        </div>
      </div>
    </Layout>
  );
}
